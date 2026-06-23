<template>
  <UserEdit />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "users.edit",
});

useHead({
  title: "Sheltos - Admin Dashboard Page",
});
</script>

<style scoped></style>
