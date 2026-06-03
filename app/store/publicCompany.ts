import { computed, ref } from "vue";

import { defineStore } from "pinia";

import PublicCompanyService from "~/services/PublicCompanyService";

import type { PublicCompany } from "~/interfaces/IPublicCompany";

export const usePublicCompanyStore = defineStore("public-company", () => {
  const company = ref<PublicCompany | null>(null);
  const loading = ref(false);
  const loaded = ref(false);
  const error = ref("");

  const logoUrl = computed(() => company.value?.logo?.url || "");
  const displayName = computed(
    () =>
      company.value?.name ||
      company.value?.tradename ||
      company.value?.company_name ||
      "",
  );

  const fetchCompany = async (force = false): Promise<PublicCompany | null> => {
    if (loading.value || (loaded.value && !force)) {
      return company.value;
    }

    loading.value = true;
    error.value = "";

    try {
      const response = await PublicCompanyService.getCompany();
      company.value = response.data ?? null;
      loaded.value = true;
    } catch (err: unknown) {
      error.value =
        err instanceof Error
          ? err.message
          : "No fue posible cargar la empresa.";
    } finally {
      loading.value = false;
    }

    return company.value;
  };

  return {
    company,
    loading,
    loaded,
    error,
    logoUrl,
    displayName,
    fetchCompany,
  };
});
