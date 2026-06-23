<template>
  <LookupsEdit />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "lookups.edit",
});

useHead({
  title: "Editar lookup",
});
</script>

<style scoped></style>
