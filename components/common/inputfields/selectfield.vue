<template>
  <div class="form-group" :class="[classes, { 'was-validated': errors[props.name] }]" ref="componentRef">
    <label>
      {{ label }}
      <span class="font-danger" v-if="star">{{ star }}</span>
    </label>

    <!-- Dropdown principal -->
    <div class="dropdown w-100" :class="{ 'is-invalid': errors[props.name] }" ref="dropdownRef">
      <span
          class="dropdown-toggle font-rubik d-flex justify-content-between align-items-center w-100"
          :class="{ 'is-invalid': errors[props.name] }"
          data-bs-toggle="dropdown"
          style="cursor: pointer;"
          @blur="validate"
          ref="dropdownToggle"
      >
        <span class="text-truncate">{{ selectedLabel }}</span>
        <i class="fas fa-angle-down"></i>
      </span>

      <div
          class="dropdown-menu text-start w-100 p-2"
          @click="multiple ? $event.stopPropagation() : null"
          ref="dropdownMenu"
      >
        <!-- Buscador -->
        <input
            v-if="searchable"
            v-model="search"
            type="text"
            class="form-control mb-2 search-input"
            placeholder="Buscar..."
            @input="emitSearch"
            @click.stop
            autocomplete="off"
        />

        <!-- Lista de opciones -->
        <a
            href="javascript:void(0)"
            class="dropdown-item d-flex justify-content-between align-items-center"
            v-for="item in filteredData"
            :key="item.id"
            @click="select(item)"
        >
          <span class="text-truncate d-inline-block" style="max-width: calc(100% - 25px);">
            {{ getLabel(item) }}
          </span>
          <i v-if="isSelected(item.id)" class="fas fa-check text-success ms-2 flex-shrink-0"></i>
        </a>

        <!-- Botón limpiar (solo para múltiple) -->
        <div v-if="multiple && selectedValues.length" class="mt-2 text-end">
          <button class="btn btn-pill btn-dashed color-4" type="button" @click.stop="clearAll">
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Tags para selección múltiple -->
    <div v-if="multiple && selectedValues.length" class="mt-1 d-flex flex-wrap gap-1">
      <span
          v-for="id in selectedValues"
          :key="id"
          class="label label-light label-flat color-3 d-flex align-items-center gap-2"
      >
        {{ getLabel(data.find(it => it.id === id)) }}
      </span>
    </div>

    <CommonErrorfield :name="props.name ?? `field-${label}-${Math.random().toString(36).substring(2,7)}`" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from "vue"
import type { PropType } from "vue"
import type { ILookup } from "~/interfaces/ILookup"
import { useValidator } from "~/composables/useValidator"

const props = defineProps({
  classes: String,
  label: String,
  star: String,
  data: {
    type: Array as PropType<ILookup[]>,
    default: () => []
  },
  modelValue: {
    type: [String, Array, Object] as PropType<any>,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  },
  show: {
    type: String,
    default: "Selecciona una opción..."
  },
  labelField: {
    type: String as PropType<"name" | "alias" | "code" | "value">,
    default: "name"
  },
  concat: {
    type: Boolean,
    default: false
  },
  concatField: {
    type: String,
    default: "alias"
  },
  searchable: {
    type: Boolean,
    default: false
  },
  onSearch: {
    type: Function as PropType<(term: string) => void>,
    default: null
  },
  name: String,
  rules: { type: Array, default: () => [] },
})

const { validateField, errors } = useValidator()
const emit = defineEmits(["update:modelValue"])

// Estado del componente
const search = ref("")
const selectedLabel = ref(props.show)
const touched = ref(false) // Controla si el campo ha sido interactuado

// Referencias del DOM
const componentRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownToggle = ref<HTMLElement | null>(null)
const dropdownMenu = ref<HTMLElement | null>(null)

// Normaliza el modelo para manejar tanto objetos como IDs
const normalizedModel = computed(() => {
  const mv = props.modelValue

  if (Array.isArray(mv)) {
    if (mv.length && typeof mv[0] === "object" && "id" in mv[0]) {
      return mv.map((o: any) => o.id)
    }
    return mv
  }

  if (mv && typeof mv === "object" && "id" in mv) {
    return mv.id
  }

  return mv
})

// Cierra el dropdown (maneja Bootstrap y clases directamente)
function closeDropdown() {
  if (!dropdownToggle.value || !dropdownMenu.value) return

  try {
    // Intenta usar la API de Bootstrap si está disponible
    if (window.bootstrap?.Dropdown) {
      const bsDropdown = window.bootstrap.Dropdown.getInstance(dropdownToggle.value)
      if (bsDropdown) {
        bsDropdown.hide()
        return
      }
    }

    // Fallback: manipula las clases directamente
    dropdownMenu.value.classList.remove('show')
    dropdownToggle.value.classList.remove('show')
    dropdownToggle.value.setAttribute('aria-expanded', 'false')

    // Limpia el backdrop si existe
    const backdrop = document.querySelector('.dropdown-backdrop')
    if (backdrop) backdrop.remove()
  } catch (error) {
    console.error('Error al cerrar dropdown:', error)
  }
}

// Detecta clicks fuera del componente para cerrar el dropdown
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node

  if (componentRef.value && !componentRef.value.contains(target)) {
    if (dropdownMenu.value?.classList.contains('show')) {
      closeDropdown()
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
})

// Emite evento de búsqueda
function emitSearch() {
  if (props.onSearch) props.onSearch(search.value)
}

// Filtra opciones según búsqueda
const filteredData = computed(() => {
  if (!props.searchable) return props.data

  return props.data.filter(item =>
      getLabel(item).toLowerCase().includes(search.value.toLowerCase())
  )
})

// Obtiene el label del item
function getLabel(item: any) {
  if (!item) return ""
  const base = item[props.labelField] ?? ""

  if (props.concat && item.name) {
    return `${item[props.concatField]} - ${item.name}`
  }

  return base
}

// Verifica si un item está seleccionado
function isSelected(id: string) {
  return Array.isArray(normalizedModel.value) && normalizedModel.value.includes(id)
}

// Maneja la selección de items
function select(item: ILookup) {
  touched.value = true // Marca como tocado al interactuar

  if (props.multiple) {
    // Modo múltiple: agrega/quita del array
    let values = Array.isArray(normalizedModel.value) ? [...normalizedModel.value] : []
    const index = values.indexOf(item.id)

    if (index === -1) {
      values.push(item.id)
    } else {
      values.splice(index, 1)
    }

    emit("update:modelValue", values)
    updateSelectedLabel(values)
    validateField(props.name, values, props.rules)
  } else {
    // Modo simple: reemplaza el valor y cierra
    emit("update:modelValue", item.id)
    selectedLabel.value = getLabel(item)
    validateField(props.name, item.id, props.rules)
    setTimeout(() => closeDropdown(), 50)
  }
}

// Actualiza el label cuando hay múltiples selecciones
function updateSelectedLabel(values: string[]) {
  if (!values.length) {
    selectedLabel.value = props.show
    return
  }

  const labels = props.data
      .filter(item => values.includes(item.id))
      .map(item => getLabel(item))

  selectedLabel.value = labels.join(", ")
}

// Valores seleccionados para mostrar tags
const selectedValues = computed(() =>
    Array.isArray(normalizedModel.value) ? normalizedModel.value : []
)

// Limpia todas las selecciones
function clearAll() {
  touched.value = true // Marca como tocado al limpiar
  const emptyValue = props.multiple ? [] : ""
  emit("update:modelValue", emptyValue)

  if (props.multiple) {
    updateSelectedLabel([])
  } else {
    selectedLabel.value = props.show
  }

  // Valida después de limpiar
  if (props.name && props.rules && props.rules.length > 0) {
    setTimeout(() => {
      validateField(props.name, emptyValue, props.rules)
    }, 0)
  }
}

// Sincroniza el label cuando cambia el modelo
watch(
    () => normalizedModel.value,
    (newVal) => {
      if (props.multiple) {
        const values = Array.isArray(newVal) ? newVal : []
        updateSelectedLabel(values)
        // Solo validar si el campo ya tiene un error previo
        if (props.name && errors[props.name]) {
          validateField(props.name, values, props.rules)
        }
      } else {
        const found = props.data.find(item => item.id === newVal)
        selectedLabel.value = found ? getLabel(found) : props.show
        // Solo validar si el campo ya tiene un error previo
        if (props.name && errors[props.name]) {
          validateField(props.name, newVal, props.rules)
        }
      }
    },
    { immediate: true }
)

// Normaliza objetos a IDs cuando se reciben del v-model
watch(
    () => props.modelValue,
    (value) => {
      // Array de objetos → array de IDs
      if (Array.isArray(value) && value.length && typeof value[0] === "object" && "id" in value[0]) {
        const ids = value.map((o: any) => o.id)
        emit("update:modelValue", ids)
      }

      // Objeto → ID
      if (!Array.isArray(value) && value && typeof value === "object" && "id" in value) {
        emit("update:modelValue", value.id)
      }
    },
    { immediate: true }
)

// Valida el campo manualmente
function validate() {
  if (touched.value) {
    validateField(props.name, props.modelValue, props.rules)
  }
}

function resetTouched() {
  touched.value = false
}

defineExpose({
  resetTouched
})
</script>

<style scoped>
.dropdown.is-invalid {
  border: 1px solid #dc3545 !important;
}

.search-input {
  background-image: none !important;
  padding-right: 0.75rem !important;
  border-color: #ced4da !important;
  box-shadow: none !important;
}

.search-input:focus {
  background-image: none !important;
  border-color: #86b7fe !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
}

/* Asegura que no se apliquen estilos de validación */
.search-input.is-valid,
.search-input:valid {
  background-image: none !important;
  border-color: #ced4da !important;
  padding-right: 0.75rem !important;
}

.search-input.is-valid:focus,
.search-input:valid:focus {
  border-color: #86b7fe !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
}
</style>
