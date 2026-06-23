<template>
  <CentralTenantsEdit />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "tenants.edit",
});

useHead({
  title: "Sheltos - Admin Dashboard Page",
});
</script>

<style scoped></style>
