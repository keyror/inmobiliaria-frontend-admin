<template>
  <AuditAll />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "audit.view",
});

useHead({
  title: "Auditoría",
});
</script>

<style scoped></style>
