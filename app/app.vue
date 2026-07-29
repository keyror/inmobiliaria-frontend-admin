<template>
  <loader />
  <NuxtLayout>
    <NuxtPage :key="branchStore.activeCompanyId ?? 'default'" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useBranchStore } from "~/store/branchStore";
import { usePublicCompanyStore } from "~/store/publicCompany";

const branchStore = useBranchStore();

const publicCompanyStore = usePublicCompanyStore();

useHead(
  computed(() => ({
    link: publicCompanyStore.faviconUrl
      ? [{ rel: "icon", type: "image/png", href: publicCompanyStore.faviconUrl }]
      : [],
  })),
);
</script>
