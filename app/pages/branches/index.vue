<template>
  <BranchList />
</template>

<script setup lang="ts">
import { useBranchStore } from "~/store/branchStore";

definePageMeta({
  permission: "companies.view",
});

useHead({
  title: "Sucursales",
});

const branchStore = useBranchStore();
const router = useRouter();

await branchStore.load();

if (!branchStore.branchesEnabled) {
  await router.replace("/company");
}
</script>
