<template>
  <CentralDashboard />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "dashboard.view",
});

useHead({
  title: "Dashboard Central",
});
</script>
