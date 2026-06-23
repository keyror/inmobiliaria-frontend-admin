<template>
  <UserAdd />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "users.create",
});

useHead({
  title: "Sheltos - Admin Dashboard Page",
});
</script>

<style scoped></style>
