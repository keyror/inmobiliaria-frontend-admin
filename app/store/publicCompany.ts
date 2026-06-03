import { computed, ref } from "vue";

import { defineStore } from "pinia";

import { normalizeCompanyThemeColors } from "~/constants/CompanyTheme";
import PublicCompanyService from "~/services/PublicCompanyService";
import { usecustomizerStore } from "~/store/costomizer";

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

  const getCompanyThemeColors = (companyData?: PublicCompany | null) =>
    normalizeCompanyThemeColors(
      companyData?.theme?.colors?.primary,
      companyData?.theme?.colors?.secondary,
    );

  const applyCompanyTheme = (companyData?: PublicCompany | null) => {
    if (!import.meta.client) return;

    const customizerStore = usecustomizerStore();
    customizerStore.setcolor(getCompanyThemeColors(companyData));
  };

  const fetchCompany = async (force = false): Promise<PublicCompany | null> => {
    if (loading.value || (loaded.value && !force)) {
      applyCompanyTheme(company.value);
      return company.value;
    }

    loading.value = true;
    error.value = "";

    try {
      const response = await PublicCompanyService.getCompany();
      company.value = response.data ?? null;
      loaded.value = true;
      applyCompanyTheme(company.value);
    } catch (err: unknown) {
      error.value =
        err instanceof Error
          ? err.message
          : "No fue posible cargar la empresa.";
      applyCompanyTheme(null);
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
