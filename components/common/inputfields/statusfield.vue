<template>
  <div class="form-group" :class="classes">
    <label>
      {{ label }}
      <span class="font-danger" v-if="star">{{ star }}</span>
    </label>

    <div class="dropdown">
      <span
          class="dropdown-toggle font-rubik"
          data-bs-toggle="dropdown"
      >
        <span>{{ selectedstatus || show }}</span>
        <i class="fas fa-angle-down"></i>
      </span>

      <div class="dropdown-menu text-start">
        <a
            href="javascript:void(0)"
            class="dropdown-item"
            v-for="(item, index) in data"
            :key="index"
            @click="getsatus(item)"
        >
          {{ item }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"

const props = defineProps({
  classes: String,
  label: String,
  data: Array as () => string[],
  show: String,
  star: String,
  modelValue: String
})

const emit = defineEmits(["update:modelValue"])

let selectedstatus = ref<string|undefined>(props.modelValue || "")

watch(
    () => props.modelValue,
    (newVal) => {
      selectedstatus.value = newVal
    }
)

function getsatus(status: string) {
  selectedstatus.value = status
  emit("update:modelValue", status)
}
</script>


<style scoped>

</style>
