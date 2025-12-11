<template>
  <div class="form-group" :class="[classes, { 'was-validated': errors[props.name] }]" ref="componentRef">
    <label>
      {{ label }}
      <span class="font-danger" v-if="star">{{ star }}</span>
    </label>

    <!-- Dropdown principal -->
    <div class="dropdown w-100" :class="{ 'is-invalid': errors[props.name] }">
      <span
          class="dropdown-toggle font-rubik d-flex justify-content-between align-items-center w-100"
          :class="{ 'is-invalid': errors[props.name] }"
          data-bs-toggle="dropdown"
          style="cursor: pointer;"
          @blur="validate"
          ref="dropdownToggle"
      >
        <span class="text-truncate">{{ displayLabel }}</span>
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
            @input="onSearch?.(search)"
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
        <div v-if="multiple && selectedIds.length" class="mt-2 text-end">
          <button class="btn btn-pill btn-dashed color-4" type="button" @click.stop="clearAll">
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Tags para selección múltiple -->
    <div v-if="multiple && selectedIds.length" class="mt-1 d-flex flex-wrap gap-1">
      <span
          v-for="id in selectedIds"
          :key="id"
          class="label label-light label-flat color-3 d-flex align-items-center gap-2"
      >
        {{ getLabel(data.find(it => it.id === id)) }}
      </span>
    </div>

    <CommonErrorfield :name="fieldName" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import type { PropType } from "vue"
import type { ILookup } from "~/interfaces/ILookup"
import { useValidator } from "~/composables/useValidator"

const props = defineProps({
  classes: String,
  label: String,
  star: String,
  data: { type: Array as PropType<ILookup[]>, default: () => [] },
  modelValue: { type: [String, Array, Object] as PropType<any>, default: () => [] },
  multiple: { type: Boolean, default: false },
  show: { type: String, default: "Selecciona una opción..." },
  labelField: { type: String as PropType<"name" | "alias" | "code" | "value">, default: "name" },
  concat: { type: Boolean, default: false },
  concatField: { type: String, default: "alias" },
  searchable: { type: Boolean, default: false },
  onSearch: { type: Function as PropType<(term: string) => void>, default: null },
  name: String,
  rules: { type: Array, default: () => [] },
})

const { validateField, errors } = useValidator()
const emit = defineEmits(["update:modelValue"])

const search = ref("")
const touched = ref(false)
const componentRef = ref<HTMLElement | null>(null)
const dropdownToggle = ref<HTMLElement | null>(null)
const dropdownMenu = ref<HTMLElement | null>(null)

// Nombre del campo con fallback
const fieldName = computed(() =>
    props.name ?? `field-${props.label}-${Math.random().toString(36).substring(2,7)}`
)

// Normaliza el modelo (objetos → IDs)
const normalizedValue = computed({
  get() {
    const mv = props.modelValue
    if (Array.isArray(mv)) {
      return mv.length && typeof mv[0] === "object" && "id" in mv[0]
          ? mv.map((o: any) => o.id)
          : mv
    }
    return mv && typeof mv === "object" && "id" in mv ? mv.id : mv
  },
  set(value) {
    emit("update:modelValue", value)
    if (touched.value && props.rules.length) {
      validateField(props.name, value, props.rules)
    }
  }
})

// IDs seleccionados (para múltiple)
const selectedIds = computed(() =>
    Array.isArray(normalizedValue.value) ? normalizedValue.value : []
)

// Label a mostrar en el dropdown
const displayLabel = computed(() => {
  if (props.multiple) {
    if (!selectedIds.value.length) return props.show
    const labels = props.data
        .filter(item => selectedIds.value.includes(item.id))
        .map(getLabel)
    return labels.join(", ")
  }

  const found = props.data.find(item => item.id === normalizedValue.value)
  return found ? getLabel(found) : props.show
})

// Filtra opciones según búsqueda
const filteredData = computed(() => {
  if (!props.searchable || !search.value) return props.data
  const term = search.value.toLowerCase()
  return props.data.filter(item => getLabel(item).toLowerCase().includes(term))
})

// Obtiene el label del item
function getLabel(item: any) {
  if (!item) return ""
  const base = item[props.labelField] ?? ""
  return props.concat && item.name ? `${item[props.concatField]} - ${item.name}` : base
}

// Verifica si un item está seleccionado
const isSelected = (id: string) => selectedIds.value.includes(id)

// Maneja la selección
function select(item: ILookup) {
  touched.value = true

  if (props.multiple) {
    const values = [...selectedIds.value]
    const index = values.indexOf(item.id)
    index === -1 ? values.push(item.id) : values.splice(index, 1)
    normalizedValue.value = values
  } else {
    normalizedValue.value = item.id
    setTimeout(closeDropdown, 50)
  }
}

// Limpia todas las selecciones
function clearAll() {
  touched.value = true
  normalizedValue.value = props.multiple ? [] : ""
}

// Valida el campo
function validate() {
  if (touched.value && props.rules.length) {
    validateField(props.name, normalizedValue.value, props.rules)
  }
}

// Cierra el dropdown
function closeDropdown() {
  if (!dropdownToggle.value || !dropdownMenu.value) return

  try {
    const bsDropdown = window.bootstrap?.Dropdown?.getInstance(dropdownToggle.value)
    if (bsDropdown) {
      bsDropdown.hide()
    } else {
      dropdownMenu.value.classList.remove('show')
      dropdownToggle.value.classList.remove('show')
      dropdownToggle.value.setAttribute('aria-expanded', 'false')
      document.querySelector('.dropdown-backdrop')?.remove()
    }
  } catch (error) {
    console.error('Error al cerrar dropdown:', error)
  }
}

// Detecta clicks fuera
function handleClickOutside(event: MouseEvent) {
  if (componentRef.value &&
      !componentRef.value.contains(event.target as Node) &&
      dropdownMenu.value?.classList.contains('show')) {
    closeDropdown()
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside, true))
onUnmounted(() => document.removeEventListener('click', handleClickOutside, true))

function resetTouched() {
  touched.value = false
}

defineExpose({ resetTouched })
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

.search-input:focus,
.search-input.is-valid,
.search-input:valid,
.search-input.is-valid:focus,
.search-input:valid:focus {
  background-image: none !important;
  border-color: #ced4da !important;
  padding-right: 0.75rem !important;
  box-shadow: none !important;
}
</style>
