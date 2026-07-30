<template>
  <div v-if="branchStore.branchesEnabled" class="branch-selector-wrap">
    <CommonInputfieldsSelectfield
      :data="branchOptions"
      :model-value="branchStore.activeCompanyId ?? ''"
      :disabled="!branchStore.hasMultipleBranches"
      @update:model-value="onSwitch"
    />
  </div>
</template>

<script setup lang="ts">
import { useBranchStore } from "~/store/branchStore";

const branchStore = useBranchStore();

const branchOptions = computed(() =>
  branchStore.branches.map((b) => ({
    id: b.id,
    name: b.is_headquarters
      ? `${b.company_name} · Principal`
      : !b.is_active
        ? `${b.company_name} · Inactiva`
        : b.company_name,
    category: "",
    alias: null,
    value: null,
    code: null,
    icon: null,
    is_active: b.is_active,
    lang: "es",
  })),
);

const route = useRoute();

const onSwitch = async (id: string) => {
  if (!id || id === branchStore.activeCompanyId) return;
  await branchStore.switchBranch(id);

  const segments = route.path.split("/").filter(Boolean);
  if (segments.length > 1) {
    await navigateTo("/");
  }
};
</script>

<style scoped>
.branch-selector-wrap {
  padding: 0 14px 10px;
  position: relative;
  z-index: 1050;
}

.branch-selector-wrap :deep(.dropdown-toggle) {
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 6px 10px;
  background-color: #fff;
  font-size: 0.875rem;
}

.branch-selector-wrap :deep(.dropdown-toggle:hover) {
  border-color: #adb5bd;
}

:global(body.dark-layout) .branch-selector-wrap :deep(.dropdown-toggle) {
  border-color: #374151;
  background-color: #1a1a2e;
  color: #e2e8f0;
}
</style>
