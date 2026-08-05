<template>
  <CentralPeopleAdd />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "people.create",
});

useHead({
  title: "Crear Persona - Central",
});
</script>
