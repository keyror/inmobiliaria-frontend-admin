<template>
  <LookupsAll />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "lookups.view",
});

useHead({
  title: "Gestión de lookups",
});
</script>

<style scoped></style>
