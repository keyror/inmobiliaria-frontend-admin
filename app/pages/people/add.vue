<template>
  <PeopleAdd />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "people.create",
});

useHead({
  title: "Crear Persona",
});
</script>

<style scoped></style>
