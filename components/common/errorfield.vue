<template>
  <p v-if="errors[name]" class="text-danger small mt-1">
    {{errors}}
    {{ errors[name] }}
  </p>
</template>

<script setup lang="ts">
import { useValidator } from "@/composables/useValidator";

const props = defineProps<{ name: string }>();

const { errors } = useValidator();
</script>
