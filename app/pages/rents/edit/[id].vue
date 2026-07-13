<template>
  <RentsEdit />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "rents.edit",
});

useHead({
  title: "Editar Contrato",
});
</script>

<style scoped></style>
