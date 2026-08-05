<template>
  <CentralDashboard v-if="isCentral" />
  <Dashboard v-else />
</template>

<script setup lang="ts">
import { useAppContext } from "~/composables/useAppContext";

definePageMeta({
  permission: "dashboard.view",
});

useHead({
  title: "Dashboard",
});

const { isCentral } = useAppContext();
</script>
