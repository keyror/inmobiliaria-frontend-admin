<template>
  <UserAll />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "users.view",
});

useHead({
  title: "Gestión de Usuarios",
});
</script>

<style scoped></style>
