<template>
  <CentralTenantsAll />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "tenants.view",
});

useHead({
  title: "Sheltos - Admin Dashboard Page",
});
</script>

<style scoped></style>
