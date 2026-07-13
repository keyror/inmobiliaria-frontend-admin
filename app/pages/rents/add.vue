<template>
  <RentsAdd />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "rents.create",
});

useHead({
  title: "Crear Contrato",
});
</script>

<style scoped></style>
