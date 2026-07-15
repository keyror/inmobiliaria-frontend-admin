<template>
  <Reports />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "reports.view",
});

useHead({
  title: "Informes",
});
</script>
