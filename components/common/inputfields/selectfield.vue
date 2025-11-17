<template>
  <div :class="classes">
    <label>
      {{ label }}
      <span class="font-danger" v-if="star">{{ star }}</span>
    </label>

    <!-- DROPDOWN -->
    <div class="dropdown w-100">
      <span
          class="dropdown-toggle font-rubik d-flex justify-content-between align-items-center w-100"
          data-bs-toggle="dropdown"
          style="cursor: pointer;"
      >
        <span class="text-truncate">{{ selectedLabel }}</span>
        <i class="fas fa-angle-down"></i>
      </span>

      <div
          class="dropdown-menu text-start w-100 p-2"
          @click="multiple ? $event.stopPropagation() : null"
      >

        <!-- Buscador opcional -->
        <input
            v-if="searchable"
            v-model="search"
            type="text"
            class="form-control mb-2"
            placeholder="Buscar..."
            @input="emitSearch"
        />

        <!-- Opciones -->
        <a
            href="javascript:void(0)"
            class="dropdown-item d-flex justify-content-between align-items-center"
            v-for="item in filteredData"
            :key="item.id"
            @click="select(item)"
        >
          <span>{{ getLabel(item) }}</span>

          <!-- ✔ Chulo -->
          <i
              v-if="isSelected(item.id)"
              class="fas fa-check text-success"
          ></i>
        </a>

        <!-- Botón limpiar -->
        <div
            v-if="multiple && selectedValues.length"
            class="mt-2 text-end"
        >
          <button class="btn btn-pill btn-dashed color-4" type="button"@click="clearAll">
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <div
        v-if="multiple && selectedValues.length"
        class="mt-1 d-flex flex-wrap gap-1"
    >
      <span
          v-for="id in selectedValues"
          :key="id"
          class="label label-light label-flat color-3 d-flex align-items-center gap-2"
      >
        {{ getLabel(data.find(it => it.id === id)!) }}
      </span>
    </div>

  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from "vue"
import type { PropType } from "vue"
import type { ILookup } from "~/interfaces/ILookup"


/**
 * Props del componente
 *
 * @param classes - Clases CSS adicionales para el contenedor
 * @param label - Etiqueta del campo
 * @param star - Indicador de campo requerido (ej: "*")
 * @param data - Array de opciones disponibles
 * @param modelValue - Valor(es) seleccionado(s): string para modo simple, string[] para múltiple
 * @param multiple - Permite selección múltiple
 * @param show - Texto placeholder cuando no hay selección
 * @param labelField - Campo del objeto a usar como etiqueta ("name", "alias", "value")
 * @param concat - Si true, concatena alias + name en la etiqueta
 * @param searchable - Habilita el campo de búsqueda
 * @param onSearch - Callback para búsqueda server-side. Si se proporciona, desactiva el filtro local
 *                   y delega la búsqueda al componente padre*/
const props = defineProps({
  classes: String,
  label: String,
  star: String,

  data: {
    type: Array as PropType<ILookup[]>,
    default: () => []
  },

  modelValue: {
    type: [String, Array] as PropType<string | string[]>,
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
    type: String as PropType<"name" | "alias" | "value">,
    default: "name"
  },

  concat: {
    type: Boolean,
    default: false
  },

  searchable: {
    type: Boolean,
    default: false
  },

  onSearch: {
    type: Function as PropType<(term: string) => void>,
    default: null
  }
})

const emit = defineEmits(["update:modelValue"])

const search = ref("")
const selectedLabel = ref(props.show)

/* =============================
      Filtro de búsqueda
============================= */
function emitSearch() {
  if (props.onSearch) props.onSearch(search.value) // Server side
}

const filteredData = computed(() => {
  if (!props.searchable) return props.data

  return props.data.filter(item =>
      getLabel(item).toLowerCase().includes(search.value.toLowerCase())
  )
})

/* =============================
      Obtener etiqueta
============================= */
function getLabel(item: ILookup) {
  if (!item) return ""

  const base = (item as any)[props.labelField] ?? ""

  if (props.concat && item.alias && item.name) {
    return `${item.alias} - ${item.name}`
  }

  return base
}

/* =============================
      Saber si está seleccionado
============================= */
function isSelected(id: string) {
  return Array.isArray(props.modelValue) && props.modelValue.includes(id)
}

/* =============================
      Seleccionar
============================= */
function select(item: ILookup) {
  if (props.multiple) {
    let values = Array.isArray(props.modelValue)
        ? [...props.modelValue]
        : []

    const index = values.indexOf(item.id)
    if (index === -1) values.push(item.id)
    else values.splice(index, 1)

    emit("update:modelValue", values)
    updateSelectedLabel(values)
  } else {
    emit("update:modelValue", item.id)
    selectedLabel.value = getLabel(item)
  }
}

/* =============================
      Actualizar label MULTI
============================= */
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

/* =============================
      Tags
============================= */
const selectedValues = computed(() =>
    Array.isArray(props.modelValue) ? props.modelValue : []
)
computed(() =>
    props.data
        .filter(item => selectedValues.value.includes(item.id))
        .map(item => getLabel(item))
);


function clearAll() {
  emit("update:modelValue", [])
  updateSelectedLabel([])
}

/* =============================
      Watch
============================= */
watch(
    () => props.modelValue,
    newVal => {
      if (props.multiple) {
        updateSelectedLabel(Array.isArray(newVal) ? newVal : [])
      } else {
        const found = props.data.find(item => item.id === newVal)
        selectedLabel.value = found ? getLabel(found) : props.show
      }
    },
    { immediate: true }
)
</script>
