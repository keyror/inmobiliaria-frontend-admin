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
  <div :class="['form-group', classes]">
    <div class="form-check">
      <input
        class="form-check-input"
        :class="{ 'is-invalid': error }"
        type="checkbox"
        :id="inputId"
        :name="name"
        v-model="checked"
        :disabled="disabled"
        :aria-invalid="!!error"
      />
      <label class="form-check-label" :for="inputId">
        {{ label }}
        <span class="font-danger" v-if="star">{{ star }}</span>
      </label>
    </div>

    <small v-if="error" class="text-danger">
      {{ error }}
    </small>
  </div>
</template>
