<template>
  <div class="form-group" :class="classes">
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
          <!-- Texto truncado -->
          <span class="text-truncate d-inline-block" style="max-width: calc(100% - 25px);">
            {{ getLabel(item) }}
          </span>

          <!-- Ícono check -->
          <i
              v-if="isSelected(item.id)"
              class="fas fa-check text-success ms-2 flex-shrink-0"
          ></i>
        </a>


        <!-- Botón limpiar -->
        <div v-if="multiple && selectedValues.length" class="mt-2 text-end">
          <button class="btn btn-pill btn-dashed color-4" type="button" @click="clearAll">
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- TAGS -->
    <div v-if="multiple && selectedValues.length" class="mt-1 d-flex flex-wrap gap-1">
      <span
          v-for="id in selectedValues"
          :key="id"
          class="label label-light label-flat color-3 d-flex align-items-center gap-2"
      >
        {{ getLabel(data.find(it => it.id === id)) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue"
import type { PropType } from "vue"
import type { ILookup } from "~/interfaces/ILookup"

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
  }
})

const emit = defineEmits(["update:modelValue"])

const search = ref("")
const selectedLabel = ref(props.show)

/* ============================================================
      NORMALIZADOR INTERNO (OBJETOS → IDs)
============================================================ */
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

/* ============================================================
      BUSCADOR
============================================================ */
function emitSearch() {
  if (props.onSearch) props.onSearch(search.value)
}

const filteredData = computed(() => {
  if (!props.searchable) return props.data

  return props.data.filter(item =>
      getLabel(item).toLowerCase().includes(search.value.toLowerCase())
  )
})

/* ============================================================
      LABEL
============================================================ */
function getLabel(item: any) {
  if (!item) return ""
  const base = item[props.labelField] ?? ""

  if (props.concat && item.name) {
    return `${item[props.concatField]} - ${item.name}`
  }

  return base
}

/* ============================================================
      SELECCIÓN
============================================================ */
function isSelected(id: string) {
  return Array.isArray(normalizedModel.value) && normalizedModel.value.includes(id)
}

function select(item: ILookup) {
  if (props.multiple) {
    let values = Array.isArray(normalizedModel.value)
        ? [...normalizedModel.value]
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

/* ============================================================
      LABEL MULTIPLE
============================================================ */
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

/* ============================================================
      TAGS
============================================================ */
const selectedValues = computed(() =>
    Array.isArray(normalizedModel.value) ? normalizedModel.value : []
)

/* ============================================================
      LIMPIAR
============================================================ */
function clearAll() {
  emit("update:modelValue", [])
  updateSelectedLabel([])
}

/* ============================================================
      WATCH: sincroniza selección inicial
============================================================ */
watch(
    () => normalizedModel.value,
    (newVal) => {
      if (props.multiple) {
        updateSelectedLabel(Array.isArray(newVal) ? newVal : [])
      } else {
        const found = props.data.find(item => item.id === newVal)
        selectedLabel.value = found ? getLabel(found) : props.show
      }
    },
    { immediate: true }
)

/* ============================================================
     Normaliza hacia afuera (OBJETOS → IDs)
============================================================ */
watch(
    () => props.modelValue,
    (value) => {
      // MULTIPLE: array de objetos → emitir array de IDs
      if (Array.isArray(value) && value.length && typeof value[0] === "object" && "id" in value[0]) {
        const ids = value.map((o: any) => o.id)
        emit("update:modelValue", ids)
      }

      // SINGLE: objeto → emitir id
      if (!Array.isArray(value) && value && typeof value === "object" && "id" in value) {
        emit("update:modelValue", value.id)
      }
    },
    { immediate: true }
)
</script>
