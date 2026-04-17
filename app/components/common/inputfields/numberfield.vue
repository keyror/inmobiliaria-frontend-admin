<template>
  <div class="form-group" :class="[classes, { 'was-validated': error }]">
    <label>
      {{ label }}
      <span class="font-danger" v-if="star">{{ star }}</span>
    </label>

    <input
      ref="inputRef"
      type="number"
      class="form-control input-field"
      :class="{ 'is-invalid': error }"
      :placeholder="placeholder"
      v-model="localValue"
      :required="required"
      :readonly="readonly"
      :disabled="disabled"
      :name="name"
    />

    <small v-if="error" class="text-danger">
      {{ error }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  required: { type: Boolean, default: true },
  classes: String,
  placeholder: String,
  label: String,
  modelValue: [Number, String, null],
  star: String,
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  name: String,
  error: String,
  min: Number,
  max: Number,
  step: Number,
});

const emit = defineEmits(["update:modelValue"]);

const inputRef = ref<HTMLInputElement | null>(null);

const localValue = computed({
  get: () => props.modelValue,
  set: (val: string | number | null) => {
    const parsed = val === "" || val === null ? null : Number(val);

    emit("update:modelValue", isNaN(parsed as number) ? null : parsed);
  },
});

defineExpose({
  focus: () => inputRef.value?.focus(),
  scrollIntoView: (options?: ScrollIntoViewOptions) =>
    inputRef.value?.scrollIntoView(options),
});
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545 !important;
  background-image: none !important;
}
</style>
