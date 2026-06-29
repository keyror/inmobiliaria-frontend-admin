<template>
  <RealstateSiteManagement />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "site-settings.view",
});

useHead({
  title: "Gestión de Sitio Público",
});
</script>
