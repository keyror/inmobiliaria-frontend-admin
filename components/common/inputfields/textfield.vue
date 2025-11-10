<template>
  <div class="form-group" :class="classes">
    <label>
      {{ label }}
      <span class="font-danger" v-if="star">{{ star }}</span>
    </label>
    <input
        :type="type ? type : 'text'"
        class="form-control"
        :placeholder="placeholder"
        v-model="localValue"
        :required="props.required"
        :readonly="props.readonly"
        :disabled="props.disabled"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  required:  { type: Boolean, default: true },
  classes: String,
  placeholder: String,
  label: String,
  modelValue: [String, Number],
  star: String,
  type: String,
  clean: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
})

const emit = defineEmits(["update:modelValue"])

const localValue = computed({
  get: () => props.modelValue,
  set: (val: string) => {

    let newVal = val

    if (props.clean) {
      newVal = val.replace(/\s+/g, '')
    }

    emit("update:modelValue", newVal)
  }
})
</script>

<style scoped>
</style>
