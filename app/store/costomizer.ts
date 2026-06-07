import {
  applyCompanyThemeColors,
  normalizeCompanyThemeColors,
  readCompanyThemeCache,
  writeCompanyThemeCache,
} from "~/utils/companyTheme";

import type { RealstateTheme } from "~/constants/RealstateTemplates";

interface Color {
  primary: string;
  secondary: string;
  accent?: string;
}

interface SetColorOptions {
  persist?: boolean;
}

export const usecustomizerStore = defineStore("customizer", () => {
  const property = ref();

  function setcolor(color: Color, options: SetColorOptions = {}) {
    if (!import.meta.client) return;

    const theme = normalizeCompanyThemeColors({
      ...color,
      accent: color.accent ?? color.primary,
    });

    applyCompanyThemeColors(theme);

    if (options.persist) {
      writeCompanyThemeCache(theme);
    }
  }

  function applyCachedColor(): RealstateTheme | null {
    const cachedTheme = readCompanyThemeCache();

    if (!cachedTheme) return null;

    setcolor(cachedTheme.theme.colors);

    return cachedTheme.theme.colors;
  }

  return {
    applyCachedColor,
    setcolor,
    property,
  };
});
