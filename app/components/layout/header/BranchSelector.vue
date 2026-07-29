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

const onSwitch = async (id: string) => {
  if (!id || id === branchStore.activeCompanyId) return;
  await branchStore.switchBranch(id);
};
</script>

<style scoped>
.branch-selector-wrap {
  padding: 0 14px 10px;
}
</style>
