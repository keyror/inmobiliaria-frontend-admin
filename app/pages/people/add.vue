<template>
  <PeopleAdd />
</template>

<script setup lang="ts">
definePageMeta({
  permission: "people.create",
});

useHead({
  title: "Sheltos - Admin Dashboard Page",
});
</script>

<style scoped></style>
