import {
  applyCompanyThemeColors,
  buildCompanyThemeStyle,
  readCompanyThemeCache,
} from "~/utils/companyTheme";

export default defineNuxtPlugin({
  name: "company-theme",
  enforce: "pre",
  setup(nuxtApp) {
    const hydrationTheme = readCompanyThemeCache();

    if (hydrationTheme) {
      useHead({
        htmlAttrs: {
          style: buildCompanyThemeStyle(hydrationTheme.theme.colors),
        },
      });
    }

    if (!import.meta.client) return;

    const applyCachedTheme = () => {
      const cachedTheme = readCompanyThemeCache();
      if (!cachedTheme) return;

      applyCompanyThemeColors(cachedTheme.theme.colors);
    };

    const scheduleCachedThemeApply = () => {
      applyCachedTheme();
      requestAnimationFrame(applyCachedTheme);
      window.setTimeout(applyCachedTheme, 80);
    };

    scheduleCachedThemeApply();

    nuxtApp.hook("page:start", () => {
      scheduleCachedThemeApply();
    });

    nuxtApp.hook("page:finish", () => {
      scheduleCachedThemeApply();
    });
  },
});
