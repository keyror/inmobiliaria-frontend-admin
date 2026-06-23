<template>
  <LookupsAdd />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "lookups.create",
});

useHead({
  title: "Crear lookup",
});
</script>

<style scoped></style>
