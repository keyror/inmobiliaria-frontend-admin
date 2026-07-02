<template>
  <CentralTenantsUsersBaseForm :is-editing="true" />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "tenants.users.edit",
});

useHead({
  title: "Editar Usuario del Tenant",
});
</script>

<style scoped></style>
