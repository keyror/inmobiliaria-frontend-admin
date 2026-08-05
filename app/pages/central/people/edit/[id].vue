<template>
  <CentralPeopleEdit />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "people.edit",
});

useHead({
  title: "Editar Persona - Central",
});
</script>
