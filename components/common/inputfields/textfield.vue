<template>
  <div class="form-group" :class="[classes, { 'was-validated': errors[props.name] }]">
  <label>
      {{ label }}
      <span class="font-danger" v-if="star">{{ star }}</span>
    </label>
    <input
        :type="type ? type : 'text'"
        class="form-control input-field"
        :class="{ 'is-invalid': errors[props.name] }"
        :placeholder="placeholder"
        v-model="localValue"
        :required="props.required"
        :readonly="props.readonly"
        :disabled="props.disabled"
        autocomplete="one-time-code"
        :name="fieldName"
        @blur="validate"
    />
    <CommonErrorfield :name="fieldName" />
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
  modelValue: [String, Number, null],
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
  validateField(fieldName.value, localValue.value, props.rules);
}

const fieldName = computed(() =>
    props.name ?? `field-${props.label}-${Math.random().toString(36).substring(2,7)}`
)

watch(localValue, (val) => {
  if (props.rules.length) {
    validateField(fieldName.value, val, props.rules);
  }
});
</script>

<style scoped>
.input-field {
  background-image: none !important;
  padding-right: 0.75rem !important;
  box-shadow: none !important;
}

.input-field:focus,
.input-field.is-valid,
.input-field:valid,
.input-field.is-valid:focus,
.input-field:valid:focus {
  background-image: none !important;
  border-color: #ced4da !important;
  padding-right: 0.75rem !important;
  box-shadow: none !important;
}

.input-field:focus,
.input-field.is-valid,
.input-field:valid,
.input-field.is-valid:focus,
.input-field:valid:focus {
  background-image: none !important;
  border-color: #ced4da !important;
  padding-right: 0.75rem !important;
  box-shadow: none !important;
}
</style>
