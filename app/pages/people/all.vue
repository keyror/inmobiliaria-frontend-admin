<template>
  <PeopleAll />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "people.view",
});

useHead({
  title: "Gestión de Personas",
});
</script>

<style scoped></style>
