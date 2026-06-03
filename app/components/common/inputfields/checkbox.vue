<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: String,
  name: { type: String, required: true },
  id: { type: String, default: "" },
  classes: String,
  disabled: { type: Boolean, default: false },
  star: String,
  error: String,
});

const emit = defineEmits(["update:modelValue", "change"]);

const checked = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit("update:modelValue", val);
    emit("change");
  },
});

const inputId = props.id || props.name;
</script>

<template>
  <div
    :class="[
      'form-group common-checkbox-field',
      classes,
      { 'has-error': error, 'is-disabled': disabled },
    ]"
  >
    <div class="additional-checkbox common-checkbox-wrapper">
      <label class="common-checkbox-label" :for="inputId">
        <input
          :id="inputId"
          v-model="checked"
          :aria-invalid="!!error"
          class="checkbox_animated"
          :class="{ 'is-invalid': error }"
          :disabled="disabled"
          :name="name"
          type="checkbox"
        />
        <span class="common-checkbox-text">
          {{ label }}
          <span v-if="star" class="font-danger">{{ star }}</span>
        </span>
      </label>
    </div>

    <small v-if="error" class="text-danger">
      {{ error }}
    </small>
  </div>
</template>

<style scoped>
.common-checkbox-wrapper {
  margin: 0;
}

.common-checkbox-label {
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  gap: 0.65rem;
  margin: 0;
  min-height: 28px;
  padding: 0.35rem 0.5rem;
  transition: background-color 0.2s;
}

.common-checkbox-label:hover {
  background-color: color-mix(in srgb, var(--theme-default7) 10%, transparent);
}

.common-checkbox-field .additional-checkbox .common-checkbox-label {
  font-weight: 500;
}

.common-checkbox-text {
  font-size: 0.875rem;
  font-weight: inherit;
  margin-left: 0;
}

.checkbox_animated {
  appearance: none;
  background: transparent;
  border: 0;
  flex: 0 0 1.3rem;
  height: 1.3rem;
  margin-right: 0;
  padding: 0;
  -webkit-appearance: none;
  width: 1.3rem;
}

.checkbox_animated::before {
  border-color: var(--theme-default7) !important;
}

.checkbox_animated.is-invalid::after {
  border-color: #dc3545 !important;
}

.is-disabled .common-checkbox-label {
  cursor: not-allowed;
  opacity: 0.65;
}

.is-disabled .common-checkbox-label:hover {
  background-color: transparent;
}
</style>
