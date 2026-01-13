<script setup lang="ts">
import { useValidator } from "@/composables/useValidator"

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: String,
  name: { type: String, required: true },
  classes: String,
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  star: String,
  rules: { type: Array, default: () => [] },
})

const emit = defineEmits(["update:modelValue", "change"])

const { validateField, errors } = useValidator()

const onChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  emit("update:modelValue", checked)
  emit("change", checked)

  // valida inmediatamente si cambia
  validateField(props.name, checked, props.rules)
}

function validate() {
  validateField(props.name, props.modelValue, props.rules)
}
</script>

<template>
  <div class="form-group">
    <div class="form-check">
      <input
          class="form-check-input"
          :class="{ 'is-invalid': errors[props.name] }"
          type="checkbox"
          :id="props.name"
          :name="props.name"
          :checked="modelValue"
          :required="props.required"
          :disabled="props.disabled"
          @change="onChange"
          @blur="validate"
      />
      <label class="form-check-label" :for="props.name">
        {{ label }}
        <span class="font-danger" v-if="star">{{ star }}</span>
      </label>
    </div>
    <CommonErrorfield :name="props.name" />
  </div>
</template>
<style scoped>

</style>
