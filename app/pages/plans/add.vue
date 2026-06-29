<template>
  <PlansBaseForm />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "plans.create",
});

useHead({
  title: "Crear Plan",
});
</script>
