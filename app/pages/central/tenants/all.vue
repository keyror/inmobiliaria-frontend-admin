<template>
  <CentralTenantsAll />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "tenants.view",
});

useHead({
  title: "Gestión de Tenants",
});
</script>

<style scoped></style>
