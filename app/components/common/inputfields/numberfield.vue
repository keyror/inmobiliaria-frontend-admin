<template>
  <div class="form-group" :class="[classes, { 'was-validated': error }]">
    <label>
      {{ label }}
      <span class="font-danger" v-if="star">{{ star }}</span>
    </label>

    <input
      v-if="format"
      ref="inputRef"
      type="text"
      inputmode="numeric"
      class="form-control input-field"
      :class="{ 'is-invalid': error }"
      :placeholder="placeholder"
      :value="displayValue"
      :required="required"
      :readonly="readonly"
      :disabled="disabled"
      :name="name"
      @input="onFormattedInput"
    />

    <input
      v-else
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
  format: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const inputRef = ref<HTMLInputElement | null>(null);

const formatter = new Intl.NumberFormat("es-CO");

const displayValue = computed(() => {
  const num = Number(props.modelValue || 0);
  return num ? formatter.format(num) : "";
});

const onFormattedInput = (event: Event) => {
  const raw = (event.target as HTMLInputElement).value.replace(/\D/g, "");
  const num = raw === "" ? null : Number(raw);

  if (inputRef.value) {
    inputRef.value.value = num ? formatter.format(num) : "";
  }

  emit("update:modelValue", num);
};

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
