<template>
  <Dashboard />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "dashboard.view",
});

useHead({
  title: "Dashboard",
});
</script>

<style scoped></style>
