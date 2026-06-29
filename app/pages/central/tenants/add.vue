<template>
  <CentralTenantsAdd />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "tenants.create",
});

useHead({
  title: "Crear Tenant",
});
</script>

<style scoped></style>
