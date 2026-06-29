<template>
  <PlansBaseForm :is-editing="true" />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "plans.edit",
});

useHead({
  title: "Editar Plan",
});
</script>
