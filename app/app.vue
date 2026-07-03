<template>
  <loader />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { usePublicCompanyStore } from "~/store/publicCompany";

const publicCompanyStore = usePublicCompanyStore();

useHead(
  computed(() => ({
    link: publicCompanyStore.faviconUrl
      ? [{ rel: "icon", type: "image/png", href: publicCompanyStore.faviconUrl }]
      : [],
  })),
);
</script>
