<template>
  <PlansAll />
</template>
<script setup lang="ts">
definePageMeta({
  permission: "plans.view",
});

useHead({
  title: "Gestión de Planes",
});
</script>

<style scoped></style>
