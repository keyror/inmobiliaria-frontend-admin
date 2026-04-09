<template>
  <div class="form-group" :class="[classes, { 'was-validated': error }]">
    <label>
      {{ label }}
      <span class="font-danger" v-if="star">{{ star }}</span>
    </label>

    <input
        :type="type || 'text'"
        class="form-control input-field"
        :class="{ 'is-invalid': error }"
        :placeholder="placeholder"
        v-model="localValue"
        :required="required"
        :readonly="readonly"
        :disabled="disabled"
        autocomplete="one-time-code"
        :name="name"
    />

    <small v-if="error" class="text-danger">
      {{ error }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  required: { type: Boolean, default: true },
  classes: String,
  placeholder: String,
  label: String,
  modelValue: [String, Number, null],
  star: String,
  type: String,
  clean: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  name: String,
  error: String
})

const emit = defineEmits(["update:modelValue"])

const localValue = computed({
  get: () => props.modelValue,
  set: (val: string) => {
    let newVal = val

    if (props.clean && val) {
      newVal = val.replace(/\s+/g, '')
    }

    emit("update:modelValue", newVal)
  }
})
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545 !important;
  background-image: none !important;
}


</style>
