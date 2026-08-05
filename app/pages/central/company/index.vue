<template>
  <CentralCompanyBaseForm />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "companies.view",
});

useHead({
  title: "Empresa - Central",
});
</script>
