<template>
  <CentralTenantsAdd />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "tenants.create",
});

useHead({
  title: "Sheltos - Admin Dashboard Page",
});
</script>

<style scoped></style>
