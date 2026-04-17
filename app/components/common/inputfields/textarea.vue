<template>
  <div class="form-group" :class="[classes, { 'was-validated': error }]">
    <label>
      {{ label }}
      <span class="font-danger" v-if="star">{{ star }}</span>
    </label>

    <textarea
      ref="textareaRef"
      class="form-control"
      :class="{ 'is-invalid': error }"
      rows="4"
      :value="modelValue"
      :placeholder="placeholder"
      :name="name"
      :required="required"
      :readonly="readonly"
      :disabled="disabled"
      @input="onInput"
    ></textarea>

    <small v-if="error" class="text-danger">
      {{ error }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  classes: String,
  label: String,
  placeholder: String,
  modelValue: String,
  star: String,
  required: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  name: String,
  error: String,
});

const emit = defineEmits(["update:modelValue"]);

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit("update:modelValue", target.value);
};

defineExpose({
  focus: () => textareaRef.value?.focus(),
  scrollIntoView: (options?: ScrollIntoViewOptions) =>
    textareaRef.value?.scrollIntoView(options),
});
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545 !important;
  background-image: none !important;
}
</style>
