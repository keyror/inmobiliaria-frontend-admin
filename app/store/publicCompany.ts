import { computed, ref } from "vue";

import { defineStore } from "pinia";

import { normalizeRealstateTheme } from "~/constants/RealstateTemplates";
import PublicCompanyService from "~/services/PublicCompanyService";
import RealstateSiteManagementService from "~/services/RealstateSiteManagementService";
import { useAuthStore } from "~/store/authStore";
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

  const applySiteTheme = async () => {
    if (!import.meta.client) return;

    const customizerStore = usecustomizerStore();
    const authStore = useAuthStore();
    const cachedTheme = customizerStore.applyCachedColor();

    if (!authStore.hasPermission("site-settings.theme-view")) {
      if (cachedTheme) return;

      const theme = normalizeRealstateTheme();
      customizerStore.setcolor({
        primary: theme.primary,
        secondary: theme.secondary,
        accent: theme.accent,
      });
      return;
    }

    try {
      const response = await RealstateSiteManagementService.getTemplate();
      const theme = normalizeRealstateTheme(response.data?.theme);
      customizerStore.setcolor(
        {
          primary: theme.primary,
          secondary: theme.secondary,
          accent: theme.accent,
        },
        {
          persist: true,
        },
      );
    } catch {
      if (cachedTheme) return;

      const theme = normalizeRealstateTheme();
      customizerStore.setcolor({
        primary: theme.primary,
        secondary: theme.secondary,
        accent: theme.accent,
      });
    }
  };

  const fetchCompany = async (force = false): Promise<PublicCompany | null> => {
    if (loading.value || (loaded.value && !force)) {
      await applySiteTheme();
      return company.value;
    }

    loading.value = true;
    error.value = "";

    try {
      const response = await PublicCompanyService.getCompany();
      company.value = response.data ?? null;
      loaded.value = true;
      await applySiteTheme();
    } catch (err: unknown) {
      error.value =
        err instanceof Error
          ? err.message
          : "No fue posible cargar la empresa.";
      await applySiteTheme();
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
    applySiteTheme,
    fetchCompany,
  };
});
