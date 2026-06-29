<template>
  <CompanyBaseForm />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "companies.view",
});

useHead({
  title: "Gestion de empresa",
});
</script>

<style scoped></style>
