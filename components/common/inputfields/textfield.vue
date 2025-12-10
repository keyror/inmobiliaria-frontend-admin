<template>
  <div class="form-group" :class="[classes, { 'was-validated': errors[props.name] }]">
  <label>
      {{ label }}
      <span class="font-danger" v-if="star">{{ star }}</span>
    </label>
    <input
        :type="type ? type : 'text'"
        class="form-control"
        :class="{ 'is-invalid': errors[props.name] }"
        :placeholder="placeholder"
        v-model="localValue"
        :required="props.required"
        :readonly="props.readonly"
        :disabled="props.disabled"
        autocomplete="one-time-code"
        :name="props.name ?? `field-${label}-${Math.random().toString(36).substring(2,7)}`"
        @blur="validate"
    />
    <CommonErrorfield :name="props.name  ?? `field-${label}-${Math.random().toString(36).substring(2,7)}`" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useValidator } from "@/composables/useValidator";

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
  readonly: { type: Boolean, default: false },
  name: String,
  rules: { type: Array, default: () => [] },
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

const { validateField, errors } = useValidator();

function validate() {
  validateField(props.name, localValue.value, props.rules);
}
</script>

<style scoped>
</style>
