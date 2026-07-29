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

    const activeBranch = computed(
      () => branches.value.find((b) => b.id === activeCompanyId.value) ?? null,
    );

    const headquarters = computed(
      () => branches.value.find((b) => b.is_headquarters) ?? null,
    );

    const hasMultipleBranches = computed(() => branches.value.length > 1);

    const branchesEnabled = computed(
      () => headquarters.value?.uses_branches ?? false,
    );

    const load = async (force = false) => {
      if (loaded.value && !force) return;
      try {
        const res = await BranchService.getAll();
        let defaultCompanyId: string | null = null;
        if (res?.data?.data) {
          branches.value = res.data.data;
          defaultCompanyId = res.data.default_company_id ?? null;
        } else if (Array.isArray(res?.data)) {
          branches.value = res.data;
        }

        if (
          !activeCompanyId.value ||
          !branches.value.find((b) => b.id === activeCompanyId.value)
        ) {
          const hq = headquarters.value;
          activeCompanyId.value =
            defaultCompanyId ?? hq?.id ?? branches.value[0]?.id ?? null;
        }

        loaded.value = true;
      } catch {}
    };

    const switchBranch = async (id: string) => {
      try {
        const res = await BranchService.switch(id);
        if (res?.data?.current_company_id) {
          activeCompanyId.value = res.data.current_company_id;
          if (res.data.accessible_branches) {
            const raw = res.data.accessible_branches;
            branches.value = Array.isArray(raw) ? raw : (raw?.data ?? []);
          }
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
    };

    return {
      activeCompanyId,
      branches,
      loaded,
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
      paths: ["activeCompanyId"],
    },
  },
);
