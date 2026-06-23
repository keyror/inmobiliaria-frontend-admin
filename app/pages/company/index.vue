<template>
  <CompanyBaseForm />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "companies.view",
});

useHead({
  title: "Configuración de empresa",
});
</script>

<style scoped></style>
