<template>
  <div class="form-group" :class="classes">
    <label>{{ label }}</label>
    <textarea
        class="form-control"
        rows="4"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
defineProps({
  classes: String,
  label: String,
  modelValue: String
})

defineEmits(['update:modelValue'])
</script>
