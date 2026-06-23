<template>
  <PeopleEdit />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "people.edit",
});

useHead({
  title: "Sheltos - Admin Dashboard Page",
});
</script>

<style scoped></style>
