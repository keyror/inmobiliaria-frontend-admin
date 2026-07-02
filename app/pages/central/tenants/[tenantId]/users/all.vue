<template>
  <CentralTenantsUsersAll />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "tenants.users.view",
});

useHead({
  title: "Usuarios del Tenant",
});
</script>

<style scoped></style>
