<template>
  <CentralPeopleAll />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "people.view",
});

useHead({
  title: "Personas - Central",
});
</script>
