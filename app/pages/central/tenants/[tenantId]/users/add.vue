<template>
  <CentralTenantsUsersBaseForm />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "tenants.users.create",
});

useHead({
  title: "Crear Usuario del Tenant",
});
</script>

<style scoped></style>
