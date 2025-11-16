<template>
  <div :class="classes">
    <label>
      {{ label }}
      <span class="font-danger" v-if="star">{{ star }}</span>
    </label>

    <div class="dropdown">
      <span
          class="dropdown-toggle font-rubik"
          data-bs-toggle="dropdown"
      >
        <span>{{ selectedLabel || show }}</span>
        <i class="fas fa-angle-down"></i>
      </span>

      <div class="dropdown-menu text-start">
        <a
            href="javascript:void(0)"
            class="dropdown-item"
            v-for="item in data"
            :key="item.id"
            @click="select(item)"
        >
          {{ getLabel(item) }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import type { ILookup } from "~/interfaces/ILookup"

const props = defineProps({
  classes: String,
  label: String,
  data: {
    type: Array as () => ILookup[],
    default: () => []
  },
  show: String,
  star: String,
  modelValue: String,
  labelField: {
    type: String as () => "name" | "alias" | "value",
    default: "name"
  },
  concat: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["update:modelValue"])

const selectedLabel = ref<string>(props.show || "Selecciona una opción...");

watch(
    () => props.modelValue,
    (newVal) => {
      if (props.data && Array.isArray(props.data)) {
        const found = props.data.find(item => item.id === newVal)
        if (found) {
          selectedLabel.value = getLabel(found)
        }
      }
    },
    { immediate: true }
)

function getLabel(item: ILookup) {
  if (!item) return "";

  const baseLabel = (item as any)[props.labelField] ?? "";

  // Si concat es true, y existen alias + name → concatenamos
  if (props.concat && item.alias && item.name) {
    return `${item.alias} - ${item.name}`;
  }

  return baseLabel;
}


function select(item: ILookup) {
  emit("update:modelValue", item.id)
  selectedLabel.value = getLabel(item)
}
</script>
