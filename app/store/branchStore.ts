import { computed, ref } from "vue";

import { defineStore } from "pinia";

import BranchService from "~/services/BranchService";

import type { IBranch } from "~/interfaces/IBranch";

export const useBranchStore = defineStore(
  "branch",
  () => {
    const activeCompanyId = ref<string | null>(null);
    const branches = ref<IBranch[]>([]);
    const loaded = ref(false);
    const usesBranches = ref(false);

    const activeBranch = computed(
      () => branches.value.find((b) => b.id === activeCompanyId.value) ?? null,
    );

    const headquarters = computed(
      () => branches.value.find((b) => b.is_headquarters) ?? null,
    );

    const hasMultipleBranches = computed(() => branches.value.length > 1);

    // Viene del API — no depende de que HQ esté en la lista del usuario
    const branchesEnabled = computed(() => usesBranches.value);

    const load = async (force = false) => {
      if (loaded.value && !force) return;
      try {
        const res = await BranchService.getAll();
        let defaultCompanyId: string | null = null;
        if (res?.data) {
          branches.value = res.data;
          defaultCompanyId = res.default_company_id ?? null;
          usesBranches.value = res.uses_branches ?? false;
        }

        if (defaultCompanyId) {
          activeCompanyId.value = defaultCompanyId;
        } else if (
          !activeCompanyId.value ||
          !branches.value.find((b) => b.id === activeCompanyId.value)
        ) {
          activeCompanyId.value =
            headquarters.value?.id ?? branches.value[0]?.id ?? null;
        }

        loaded.value = true;
      } catch {}
    };

    const switchBranch = async (id: string) => {
      try {
        const res = await BranchService.switch(id);
        if (res?.data?.current_company_id) {
          activeCompanyId.value = res.data.current_company_id;
        } else {
          console.warn("[branchStore] switchBranch: respuesta inesperada", res);
        }
      } catch (e) {
        console.error("[branchStore] switchBranch falló:", e);
      }
    };

    const reset = () => {
      activeCompanyId.value = null;
      branches.value = [];
      loaded.value = false;
      usesBranches.value = false;
    };

    return {
      activeCompanyId,
      branches,
      loaded,
      usesBranches,
      activeBranch,
      headquarters,
      hasMultipleBranches,
      branchesEnabled,
      load,
      switchBranch,
      reset,
    };
  },
  {
    persist: {
      pick: ["activeCompanyId"],
    },
  },
);
