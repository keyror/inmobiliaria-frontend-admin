import {
  REALSTATE_SITE_PAGE_OPTIONS,
  REALSTATE_TEMPLATE_OPTIONS,
  isHexThemeColor,
  normalizeRealstateTheme,
} from "~/constants/RealstateTemplates";
import AlertService from "~/services/AlertService";
import RealstateSiteManagementService from "~/services/RealstateSiteManagementService";
import { usecustomizerStore } from "~/store/costomizer";

import type {
  RealstateSitePageKey,
  RealstateTemplateSet,
  RealstateTheme,
} from "~/constants/RealstateTemplates";
import type { ILookup } from "~/interfaces/ILookup";
import type {
  RealstateAboutContent,
  RealstateAboutIntroContent,
  RealstateContactContent,
  RealstateContentItem,
  RealstateEditableImage,
  RealstateFeaturedIcon,
  RealstateFeaturedSection,
  RealstateHeroContent,
  RealstateHomeContent,
  RealstateHomeSlide,
  RealstateLayoutContent,
  RealstatePropertyDetailContent,
  RealstatePropertyListContent,
  RealstateServicesContent,
  RealstateSitePage,
  RealstateSitePageContent,
  RealstateSitePagePayload,
  RealstateSitePages,
  RealstateSiteTemplateData,
  RealstateSiteTemplatePayload,
} from "~/interfaces/IRealstateSiteManagement";

export type ThemeFieldKey = Exclude<keyof RealstateTheme, "accent">;

// ── Defaults ──────────────────────────────────────────────────────────────────

export const DEFAULT_TEMPLATE_SET: RealstateTemplateSet = "template1";

export const EMPTY_ITEM: RealstateContentItem = {
  icon: "fas fa-home",
  title: "",
  description: "",
  link: "",
  points: [],
};

export const EMPTY_FEATURED_ICON: RealstateFeaturedIcon = {
  name: "",
  icon: "fas fa-home",
  path: "/realstate/property",
};

export const EMPTY_FEATURED_SECTION: RealstateFeaturedSection = {
  heading: "Servicios destacados",
  type: "filter",
  icons: [],
};

export const EMPTY_HERO: RealstateHeroContent = {
  label: "",
  title: "",
  subtitle: "",
  button_text: "",
  button_link: "",
};

export const EMPTY_HOME_SLIDE: RealstateHomeSlide = {
  title: "",
  description: "",
  img: "",
  link: "",
  button_text: "",
};

export const THEME_FIELDS: { key: ThemeFieldKey; label: string }[] = [
  { key: "primary", label: "Color primario" },
  { key: "secondary", label: "Color secundario" },
];

// ── Helpers (normalize) ────────────────────────────────────────────────────────

function asRecord(content: unknown): Record<string, unknown> {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return {};
  }
  return content as Record<string, unknown>;
}

function toText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toEditableText(value: unknown): string {
  if (typeof value === "string") return value;
  const record = asRecord(value);
  return toText(record.description ?? record.content ?? record.title);
}

function toNullableText(value: unknown): string | null {
  const text = toText(value).trim();
  return text || null;
}

interface NormalizeItemOptions {
  includeLink?: boolean;
  includePoints?: boolean;
}

function normalizeItems(
  value: unknown,
  options: NormalizeItemOptions = {},
): RealstateContentItem[] {
  if (!Array.isArray(value)) return [];
  const includeLink = options.includeLink ?? true;
  const includePoints = options.includePoints ?? true;
  return value
    .map((item) => {
      const record = asRecord(item);
      const normalized: RealstateContentItem = {
        icon: toText(record.icon),
        title: toText(record.title),
        description: toText(record.description),
      };
      if (includeLink) normalized.link = toText(record.link);
      if (includePoints) normalized.points = normalizeStringArray(record.points);
      return normalized;
    })
    .filter((item) => item.title.trim() || item.description.trim());
}

function normalizeFeaturedIcons(value: unknown): RealstateFeaturedIcon[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = asRecord(item);
      return {
        name: toText(record.name ?? record.title),
        icon: toText(record.icon) || EMPTY_FEATURED_ICON.icon,
        path: toText(record.path ?? record.link) || EMPTY_FEATURED_ICON.path,
      };
    })
    .filter((item) => item.name.trim() || item.icon.trim() || item.path.trim());
}

function normalizeFeaturedSections(value: unknown): RealstateFeaturedSection[] {
  if (!Array.isArray(value)) return [];
  const groups = value
    .map((item) => {
      const record = asRecord(item);
      if (!Array.isArray(record.icons)) return null;
      const icons = normalizeFeaturedIcons(record.icons);
      if (!icons.length) return null;
      return {
        heading: toText(record.heading ?? record.title) || "Servicios destacados",
        type: toText(record.type) || "filter",
        icons,
      };
    })
    .filter(Boolean) as RealstateFeaturedSection[];
  if (groups.length) return groups;
  const legacyIcons = normalizeFeaturedIcons(value);
  return legacyIcons.length
    ? [{ heading: "Servicios destacados", type: "filter", icons: legacyIcons }]
    : [];
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => toText(item).trim()).filter(Boolean);
}

function normalizeEditableImages(value: unknown): RealstateEditableImage[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = asRecord(item);
      const url = typeof item === "string" ? item : toText(record.url);
      return { url: url.trim(), alt: toText(record.alt) };
    })
    .filter((image) => image.url);
}

function normalizeAboutIntro(value: unknown): RealstateAboutIntroContent {
  const record = asRecord(value);
  return {
    title: toText(record.title),
    description: toText(record.description),
    images: normalizeEditableImages(record.images),
  };
}

function normalizeHero(value: unknown): RealstateHeroContent {
  const record = asRecord(value);
  return {
    ...record,
    label: toText(record.label),
    title: toText(record.title),
    subtitle: toText(record.subtitle),
    description: toText(record.description),
    image: toText(record.image),
    button_text: toText(record.button_text),
    button_link: toText(record.button_link),
  };
}

function normalizeHomeSlides(value: unknown): RealstateHomeSlide[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record = asRecord(item);
      return {
        title: toText(record.title),
        description: toText(record.description),
        img: toText(record.img ?? record.image),
        link: toText(record.link),
        button_text: toText(record.button_text ?? record.buttonText),
      };
    })
    .filter(
      (item) =>
        item.title.trim() ||
        item.description.trim() ||
        item.img.trim() ||
        item.link.trim() ||
        item.button_text.trim(),
    );
}

// ── Clone helpers ──────────────────────────────────────────────────────────────

export function cloneItem(): RealstateContentItem {
  return { ...EMPTY_ITEM };
}

export function cloneFeaturedIcon(): RealstateFeaturedIcon {
  return { ...EMPTY_FEATURED_ICON };
}

export function cloneFeaturedSection(): RealstateFeaturedSection {
  return { ...EMPTY_FEATURED_SECTION, icons: [cloneFeaturedIcon()] };
}

export function cloneHomeSlide(): RealstateHomeSlide {
  return { ...EMPTY_HOME_SLIDE };
}

// ── Default content factories ──────────────────────────────────────────────────

function createDefaultContent(page: RealstateSitePageKey): RealstateSitePageContent {
  if (page === "home") {
    return {
      background_image_url: "",
      featured_sections_bg_url: "",
      hero_slides: [],
      featured_sections: [],
      brands: [],
    };
  }
  if (page === "about") {
    return {
      banner_image_url: "",
      intro: { title: "", description: "", images: [] },
      history: "",
      mission: "",
      vision: "",
      why_choose_us: [],
    };
  }
  if (page === "services") {
    return {
      banner_image_url: "",
      hero: { ...EMPTY_HERO },
      provided_services: [],
      property_services: [],
    };
  }
  if (page === "propertyList") {
    return { banner_image_url: "", title: "", subtitle: "" };
  }
  if (page === "propertyDetail") {
    return {
      show_related_properties: true,
      hide_address: true,
      contact_title: "",
      contact_description: "",
      related_title: "",
      gallery_fallback: [],
    };
  }
  if (page === "contact") {
    return { banner_image_url: "", title: "", description: "", image: "" };
  }
  if (page === "layout") {
    return { footer_logo_url: "", footer_bg_url: "", favicon_url: "" };
  }
  return {};
}

function normalizeContentForForm(
  page: RealstateSitePageKey,
  content: unknown,
): RealstateSitePageContent {
  const record = asRecord(content);
  if (page === "home") {
    return {
      ...record,
      background_image_url: toText(record.background_image_url),
      featured_sections_bg_url: toText(record.featured_sections_bg_url),
      hero_slides: normalizeHomeSlides(record.hero_slides ?? record.slides),
      featured_sections: normalizeFeaturedSections(record.featured_sections),
      brands: normalizeEditableImages(record.brands).map((img) => img.url),
    };
  }
  if (page === "about") {
    return {
      ...record,
      banner_image_url: toText(record.banner_image_url),
      intro: normalizeAboutIntro(record.intro),
      history: toEditableText(record.history),
      mission: toEditableText(record.mission),
      vision: toEditableText(record.vision),
      why_choose_us: normalizeItems(record.why_choose_us, {
        includeLink: false,
        includePoints: false,
      }),
    };
  }
  if (page === "services") {
    return {
      ...record,
      banner_image_url: toText(record.banner_image_url),
      hero: normalizeHero(record.hero),
      provided_services: normalizeItems(record.provided_services, { includePoints: false }),
      property_services: normalizeItems(record.property_services),
    };
  }
  if (page === "propertyList") {
    return {
      ...record,
      banner_image_url: toText(record.banner_image_url),
      title: toText(record.title),
      subtitle: toText(record.subtitle),
    };
  }
  if (page === "propertyDetail") {
    return {
      ...record,
      show_related_properties:
        typeof record.show_related_properties === "boolean"
          ? record.show_related_properties
          : true,
      hide_address: typeof record.hide_address === "boolean" ? record.hide_address : true,
      contact_title: toText(record.contact_title),
      contact_description: toText(record.contact_description),
      related_title: toText(record.related_title),
      gallery_fallback: normalizeStringArray(record.gallery_fallback),
    };
  }
  if (page === "contact") {
    return {
      ...record,
      banner_image_url: toText(record.banner_image_url),
      title: toText(record.title),
      description: toText(record.description),
      image: toText(record.image),
    };
  }
  if (page === "layout") {
    return {
      ...record,
      footer_logo_url: toText(record.footer_logo_url),
      footer_bg_url: toText(record.footer_bg_url),
      favicon_url: toText(record.favicon_url),
    };
  }
  return record;
}

function normalizePage(
  page: RealstateSitePageKey,
  data: RealstateSitePage | undefined,
  templateSet: RealstateTemplateSet,
): RealstateSitePage {
  return {
    is_active: data?.is_active ?? true,
    template: data?.template ?? templateSet,
    content: normalizeContentForForm(page, data?.content),
  };
}

function normalizePages(
  pages: Partial<RealstateSitePages> | undefined,
  templateSet: RealstateTemplateSet,
): RealstateSitePages {
  return REALSTATE_SITE_PAGE_OPTIONS.reduce((normalized, page) => {
    normalized[page.id] = normalizePage(page.id, pages?.[page.id], templateSet);
    return normalized;
  }, {} as RealstateSitePages);
}

function createPagesState(): RealstateSitePages {
  return REALSTATE_SITE_PAGE_OPTIONS.reduce((pages, page) => {
    pages[page.id] = {
      is_active: true,
      template: DEFAULT_TEMPLATE_SET,
      content: createDefaultContent(page.id),
    };
    return pages;
  }, {} as RealstateSitePages);
}

function createPageErrors(): Record<RealstateSitePageKey, Record<string, string>> {
  return REALSTATE_SITE_PAGE_OPTIONS.reduce(
    (errors, page) => {
      errors[page.id] = {};
      return errors;
    },
    {} as Record<RealstateSitePageKey, Record<string, string>>,
  );
}

// ── Composable ─────────────────────────────────────────────────────────────────

export function useSiteManagement() {
  const { run } = useApiHandler();
  const { can } = useAuthorization();
  const customizerStore = usecustomizerStore();

  const canEditSiteSettings = computed(() => can("site-settings.edit"));

  // ── Loading / saving state ─────────────────────────────────────────────────
  const isLoading = ref(false);
  const isSavingTemplate = ref(false);
  const isSavingPage = ref(false);
  const isRestoringTemplate = ref(false);
  const isRestoringPage = ref(false);

  // ── Active page ────────────────────────────────────────────────────────────
  const activePage = ref<RealstateSitePageKey>("home");

  // ── Template form ──────────────────────────────────────────────────────────
  const templateForm = ref<RealstateSiteTemplatePayload>({
    template_set: DEFAULT_TEMPLATE_SET,
    theme: normalizeRealstateTheme(),
  });
  const templateErrors = ref<Record<string, string>>({});
  const templateSnapshot = ref<RealstateSiteTemplatePayload | null>(null);
  const hasTemplateBackup = ref(false);

  // ── Pages form ─────────────────────────────────────────────────────────────
  const pagesForm = ref<RealstateSitePages>(createPagesState());
  const pageErrors = ref<Record<RealstateSitePageKey, Record<string, string>>>(
    createPageErrors(),
  );
  const pagesSnapshot = ref<RealstateSitePages | null>(null);
  const pagesWithBackup = ref<string[]>([]);

  const hasActivePageBackup = computed(() =>
    pagesWithBackup.value.includes(activePage.value),
  );

  // ── Template selects ───────────────────────────────────────────────────────
  const templateSelectOptions = computed<ILookup[]>(() =>
    REALSTATE_TEMPLATE_OPTIONS.map((template) => ({
      id: template.id,
      category: "realstate_template",
      name: template.label,
      alias: null,
      value: template.description,
      code: template.id,
      icon: null,
      is_active: true,
      lang: "es",
    })),
  );

  const selectedTemplateDescription = computed(
    () =>
      REALSTATE_TEMPLATE_OPTIONS.find(
        (t) => t.id === templateForm.value.template_set,
      )?.description ?? "",
  );

  const globalTemplateLabel = computed(
    () =>
      REALSTATE_TEMPLATE_OPTIONS.find(
        (t) => t.id === templateForm.value.template_set,
      )?.label ?? templateForm.value.template_set,
  );

  const themePreviewStyle = computed(() => ({
    "--preview-primary": templateForm.value.theme.primary,
    "--preview-secondary": templateForm.value.theme.secondary,
  }));

  // ── Page meta ──────────────────────────────────────────────────────────────
  const activePageMeta = computed(
    () =>
      REALSTATE_SITE_PAGE_OPTIONS.find((page) => page.id === activePage.value) ??
      REALSTATE_SITE_PAGE_OPTIONS[0],
  );

  const currentPage = computed(() => pagesForm.value[activePage.value]);

  const currentPageErrors = computed(
    () => pageErrors.value[activePage.value] ?? {},
  );

  const currentPageErrorMessages = computed(() =>
    Object.entries(currentPageErrors.value).map(
      ([field, message]) => `${field}: ${message}`,
    ),
  );

  // ── Content slices (direct reactive references) ────────────────────────────
  const homeContent = computed(
    () => pagesForm.value.home.content as RealstateHomeContent,
  );

  const aboutContent = computed(
    () => pagesForm.value.about.content as RealstateAboutContent,
  );

  const aboutIntroImageUrls = computed<string[]>({
    get: () =>
      aboutContent.value.intro.images
        .map((image) => image.url.trim())
        .filter(Boolean),
    set: (urls) => {
      const currentImages = aboutContent.value.intro.images;
      aboutContent.value.intro.images = urls.map((url, index) => ({
        url,
        alt: currentImages[index]?.alt ?? "",
      }));
    },
  });

  const servicesContent = computed(
    () => pagesForm.value.services.content as RealstateServicesContent,
  );

  const propertyListContent = computed(
    () => pagesForm.value.propertyList.content as RealstatePropertyListContent,
  );

  const propertyDetailContent = computed(
    () => pagesForm.value.propertyDetail.content as RealstatePropertyDetailContent,
  );

  const contactContent = computed(
    () => pagesForm.value.contact.content as RealstateContactContent,
  );

  const layoutContent = computed(
    () => pagesForm.value.layout.content as RealstateLayoutContent,
  );

  // ── Unsaved changes detection ──────────────────────────────────────────────
  const hasUnsavedTemplateChanges = computed(() => {
    if (!templateSnapshot.value) return false;
    return (
      JSON.stringify(templateForm.value) !== JSON.stringify(templateSnapshot.value)
    );
  });

  const pagesWithUnsavedChanges = computed<string[]>(() => {
    if (!pagesSnapshot.value) return [];
    return REALSTATE_SITE_PAGE_OPTIONS.filter(
      (page) =>
        JSON.stringify(pagesForm.value[page.id]) !==
        JSON.stringify(pagesSnapshot.value![page.id]),
    ).map((page) => page.id);
  });

  function pageHasUnsavedChanges(pageKey: RealstateSitePageKey): boolean {
    return pagesWithUnsavedChanges.value.includes(pageKey);
  }

  // ── Error getters ──────────────────────────────────────────────────────────
  function getTemplateError(field: string): string | undefined {
    return templateErrors.value[field];
  }

  function getThemeError(field: ThemeFieldKey): string | undefined {
    return templateErrors.value[`theme.${field}`] ?? templateErrors.value[field];
  }

  function getPageError(field: string): string | undefined {
    return (
      currentPageErrors.value[field] ??
      currentPageErrors.value[`content.${field}`]
    );
  }

  function setPageErrors(
    page: RealstateSitePageKey,
    errors: Record<string, string>,
  ) {
    pageErrors.value = { ...pageErrors.value, [page]: errors };
  }

  // ── Template validation ────────────────────────────────────────────────────
  function validateTemplateForm(): boolean {
    const errors: Record<string, string> = {};
    if (!REALSTATE_TEMPLATE_OPTIONS.some((t) => t.id === templateForm.value.template_set)) {
      errors.template_set = "Template inválido";
    }
    THEME_FIELDS.forEach((field) => {
      if (!isHexThemeColor(templateForm.value.theme[field.key])) {
        errors[`theme.${field.key}`] = `${field.label} debe ser un hex de 6 dígitos`;
      }
    });
    templateErrors.value = errors;
    return !Object.keys(errors).length;
  }

  // ── Payload helpers ────────────────────────────────────────────────────────
  function getThemePayload(theme: RealstateTheme): RealstateTheme {
    const normalized = normalizeRealstateTheme(theme);
    return { ...normalized, accent: normalized.primary };
  }

  function getHeroPayload(hero: RealstateHeroContent): RealstateHeroContent {
    return {
      ...hero,
      label: toNullableText(hero.label),
      title: toNullableText(hero.title),
      subtitle: toNullableText(hero.subtitle),
      description: toNullableText(hero.description),
      image: toNullableText(hero.image),
      button_text: toNullableText(hero.button_text),
      button_link: toNullableText(hero.button_link),
    };
  }

  function getAboutIntroPayload(
    intro: RealstateAboutIntroContent,
  ): RealstateAboutIntroContent {
    return {
      title: toNullableText(intro.title),
      description: toNullableText(intro.description),
      images: normalizeEditableImages(intro.images).map((image) => ({
        url: image.url,
        alt: toNullableText(image.alt),
      })),
    };
  }

  function getKnownContentPayload(page: RealstateSitePageKey): RealstateSitePageContent {
    if (page === "home") {
      return {
        background_image_url: toNullableText(homeContent.value.background_image_url),
        featured_sections_bg_url: toNullableText(homeContent.value.featured_sections_bg_url),
        hero_slides: normalizeHomeSlides(homeContent.value.hero_slides),
        featured_sections: normalizeFeaturedSections(homeContent.value.featured_sections),
        brands: normalizeEditableImages(homeContent.value.brands),
      };
    }
    if (page === "about") {
      return {
        ...aboutContent.value,
        banner_image_url: toNullableText(aboutContent.value.banner_image_url),
        intro: getAboutIntroPayload(aboutContent.value.intro),
        history: toNullableText(aboutContent.value.history),
        mission: toNullableText(aboutContent.value.mission),
        vision: toNullableText(aboutContent.value.vision),
        why_choose_us: normalizeItems(aboutContent.value.why_choose_us, {
          includeLink: false,
          includePoints: false,
        }),
      };
    }
    if (page === "services") {
      return {
        ...servicesContent.value,
        banner_image_url: toNullableText(servicesContent.value.banner_image_url),
        hero: getHeroPayload(servicesContent.value.hero),
        provided_services: normalizeItems(servicesContent.value.provided_services, {
          includePoints: false,
        }),
        property_services: normalizeItems(servicesContent.value.property_services),
      };
    }
    if (page === "propertyList") {
      return {
        ...propertyListContent.value,
        banner_image_url: toNullableText(propertyListContent.value.banner_image_url),
        title: toNullableText(propertyListContent.value.title),
        subtitle: toNullableText(propertyListContent.value.subtitle),
      };
    }
    if (page === "propertyDetail") {
      return {
        show_related_properties: Boolean(propertyDetailContent.value.show_related_properties),
        hide_address: Boolean(propertyDetailContent.value.hide_address),
        contact_title: toNullableText(propertyDetailContent.value.contact_title),
        contact_description: toNullableText(propertyDetailContent.value.contact_description),
        related_title: toNullableText(propertyDetailContent.value.related_title),
        gallery_fallback: normalizeStringArray(propertyDetailContent.value.gallery_fallback),
      };
    }
    if (page === "contact") {
      return {
        ...contactContent.value,
        banner_image_url: toNullableText(contactContent.value.banner_image_url),
        title: toNullableText(contactContent.value.title),
        description: toNullableText(contactContent.value.description),
        image: toNullableText(contactContent.value.image),
      };
    }
    if (page === "layout") {
      return {
        footer_logo_url: toNullableText(layoutContent.value.footer_logo_url),
        footer_bg_url: toNullableText(layoutContent.value.footer_bg_url),
        favicon_url: toNullableText(layoutContent.value.favicon_url),
      };
    }
    return asRecord(pagesForm.value[page].content);
  }

  // ── Theme ──────────────────────────────────────────────────────────────────
  function setAdminTheme(theme: RealstateTheme) {
    if (!import.meta.client) return;
    customizerStore.setcolor(
      { primary: theme.primary, secondary: theme.secondary, accent: theme.accent },
      { persist: true },
    );
  }

  function applyTemplateData(data?: Partial<RealstateSiteTemplateData> | null) {
    if (!data) return;
    const theme = getThemePayload(normalizeRealstateTheme(data.theme));
    templateForm.value = {
      template_set: data.template_set ?? DEFAULT_TEMPLATE_SET,
      theme,
    };
    setAdminTheme(theme);
  }

  // ── API calls ──────────────────────────────────────────────────────────────
  async function loadTemplate() {
    const response = await run(RealstateSiteManagementService.getTemplate());
    if (response?.data) {
      applyTemplateData(response.data);
      templateSnapshot.value = JSON.parse(JSON.stringify(templateForm.value));
      hasTemplateBackup.value = response.data.has_backup ?? false;
    }
  }

  async function loadPages() {
    const response = await run(RealstateSiteManagementService.getPages());
    if (!response?.data) return;
    applyTemplateData({ template_set: response.data.template_set, theme: response.data.theme });
    pagesForm.value = normalizePages(response.data.pages, response.data.template_set);
    pagesSnapshot.value = JSON.parse(JSON.stringify(pagesForm.value));
    hasTemplateBackup.value = response.data.has_template_backup ?? hasTemplateBackup.value;
    pagesWithBackup.value = response.data.pages_with_backup ?? [];
  }

  async function loadAll() {
    isLoading.value = true;
    try {
      await loadTemplate();
      await loadPages();
    } finally {
      isLoading.value = false;
    }
  }

  async function saveTemplate() {
    if (!canEditSiteSettings.value) return;
    if (!validateTemplateForm()) {
      await AlertService.showFormError();
      return;
    }
    isSavingTemplate.value = true;
    try {
      const payload: RealstateSiteTemplatePayload = {
        template_set: templateForm.value.template_set,
        theme: getThemePayload(templateForm.value.theme),
      };
      const response = await run(
        RealstateSiteManagementService.updateTemplate(payload),
        {
          showSuccess: true,
          successMessage: "Template y colores actualizados",
          setErrors: (errors) => { templateErrors.value = errors; },
        },
      );
      if (response?.data) {
        applyTemplateData(response.data);
        templateSnapshot.value = JSON.parse(JSON.stringify(templateForm.value));
        hasTemplateBackup.value = response.data.has_backup ?? true;
        await loadPages();
      }
    } finally {
      isSavingTemplate.value = false;
    }
  }

  async function savePage(page: RealstateSitePageKey) {
    if (!canEditSiteSettings.value) return;
    setPageErrors(page, {});
    const payload: RealstateSitePagePayload = {
      is_active: Boolean(pagesForm.value[page].is_active),
      content: getKnownContentPayload(page),
    };
    isSavingPage.value = true;
    try {
      const response = await run(
        RealstateSiteManagementService.updatePage(page, payload),
        {
          showSuccess: true,
          successMessage: "Página actualizada",
          setErrors: (errors) => setPageErrors(page, errors),
        },
      );
      if (response?.data?.config) {
        const normalized = normalizePage(page, response.data.config, templateForm.value.template_set);
        pagesForm.value = { ...pagesForm.value, [page]: normalized };
        if (pagesSnapshot.value) {
          pagesSnapshot.value = {
            ...pagesSnapshot.value,
            [page]: JSON.parse(JSON.stringify(normalized)),
          };
        }
        if (response.data.has_backup && !pagesWithBackup.value.includes(page)) {
          pagesWithBackup.value = [...pagesWithBackup.value, page];
        }
      }
    } finally {
      isSavingPage.value = false;
    }
  }

  async function saveActivePage() {
    await savePage(activePage.value);
  }

  function cancelTemplate() {
    if (!templateSnapshot.value) return;
    templateForm.value = JSON.parse(JSON.stringify(templateSnapshot.value));
    templateErrors.value = {};
  }

  function cancelPage() {
    if (!pagesSnapshot.value) return;
    const page = activePage.value;
    pagesForm.value = {
      ...pagesForm.value,
      [page]: JSON.parse(JSON.stringify(pagesSnapshot.value[page])),
    };
    setPageErrors(page, {});
  }

  async function doRestoreTemplate() {
    if (!canEditSiteSettings.value) return;
    isRestoringTemplate.value = true;
    try {
      const response = await run(
        RealstateSiteManagementService.restoreTemplate(),
        {
          showSuccess: true,
          successMessage: "Plantilla restaurada a la versión anterior",
          setErrors: (errors) => { templateErrors.value = errors; },
        },
      );
      if (response?.data) {
        applyTemplateData(response.data);
        templateSnapshot.value = JSON.parse(JSON.stringify(templateForm.value));
        hasTemplateBackup.value = response.data.has_backup ?? false;
        await loadPages();
      }
    } finally {
      isRestoringTemplate.value = false;
    }
  }

  async function doRestorePage() {
    if (!canEditSiteSettings.value) return;
    const page = activePage.value;
    isRestoringPage.value = true;
    try {
      const response = await run(
        RealstateSiteManagementService.restorePage(page),
        {
          showSuccess: true,
          successMessage: "Página restaurada a la versión anterior",
          setErrors: (errors) => setPageErrors(page, errors),
        },
      );
      if (response?.data?.config) {
        const normalized = normalizePage(page, response.data.config, templateForm.value.template_set);
        pagesForm.value = { ...pagesForm.value, [page]: normalized };
        if (pagesSnapshot.value) {
          pagesSnapshot.value = { ...pagesSnapshot.value, [page]: JSON.parse(JSON.stringify(normalized)) };
        }
        pagesWithBackup.value = pagesWithBackup.value.filter((p) => p !== page);
      }
    } finally {
      isRestoringPage.value = false;
    }
  }

  // ── Add / remove helpers ───────────────────────────────────────────────────
  function addHomeSlide() {
    if (canEditSiteSettings.value) homeContent.value.hero_slides.push(cloneHomeSlide());
  }
  function removeHomeSlide(index: number) {
    if (canEditSiteSettings.value) homeContent.value.hero_slides.splice(index, 1);
  }
  function addFeaturedSection() {
    if (canEditSiteSettings.value) homeContent.value.featured_sections.push(cloneFeaturedSection());
  }
  function removeFeaturedSection(index: number) {
    if (canEditSiteSettings.value) homeContent.value.featured_sections.splice(index, 1);
  }
  function addFeaturedIcon(sectionIndex: number) {
    if (canEditSiteSettings.value)
      homeContent.value.featured_sections[sectionIndex]?.icons.push(cloneFeaturedIcon());
  }
  function removeFeaturedIcon(sectionIndex: number, iconIndex: number) {
    if (canEditSiteSettings.value)
      homeContent.value.featured_sections[sectionIndex]?.icons.splice(iconIndex, 1);
  }
  function addWhyChooseUs() {
    if (canEditSiteSettings.value) aboutContent.value.why_choose_us.push(cloneItem());
  }
  function removeWhyChooseUs(index: number) {
    if (canEditSiteSettings.value) aboutContent.value.why_choose_us.splice(index, 1);
  }
  function addProvidedService() {
    if (canEditSiteSettings.value) servicesContent.value.provided_services.push(cloneItem());
  }
  function removeProvidedService(index: number) {
    if (canEditSiteSettings.value) servicesContent.value.provided_services.splice(index, 1);
  }
  function addPropertyService() {
    if (canEditSiteSettings.value) servicesContent.value.property_services.push(cloneItem());
  }
  function removePropertyService(index: number) {
    if (canEditSiteSettings.value) servicesContent.value.property_services.splice(index, 1);
  }

  function pointsToText(points?: string[]): string {
    return Array.isArray(points) ? points.join("\n") : "";
  }

  function setItemPoints(item: RealstateContentItem, event: Event) {
    const target = event.target as HTMLTextAreaElement | null;
    item.points = target?.value
      .split("\n")
      .map((point) => point.trim())
      .filter(Boolean);
  }

  return {
    // state
    isLoading,
    isSavingTemplate,
    isSavingPage,
    isRestoringTemplate,
    isRestoringPage,
    activePage,
    canEditSiteSettings,
    // template
    templateForm,
    templateErrors,
    templateSnapshot,
    hasTemplateBackup,
    hasUnsavedTemplateChanges,
    templateSelectOptions,
    selectedTemplateDescription,
    globalTemplateLabel,
    themePreviewStyle,
    // pages
    pagesForm,
    pageErrors,
    pagesSnapshot,
    pagesWithBackup,
    hasActivePageBackup,
    activePageMeta,
    currentPage,
    currentPageErrors,
    currentPageErrorMessages,
    pagesWithUnsavedChanges,
    pageHasUnsavedChanges,
    // content slices
    homeContent,
    aboutContent,
    aboutIntroImageUrls,
    servicesContent,
    propertyListContent,
    propertyDetailContent,
    contactContent,
    layoutContent,
    // error getters
    getTemplateError,
    getThemeError,
    getPageError,
    // actions
    loadAll,
    saveTemplate,
    savePage,
    saveActivePage,
    cancelTemplate,
    cancelPage,
    doRestoreTemplate,
    doRestorePage,
    // add/remove
    addHomeSlide,
    removeHomeSlide,
    addFeaturedSection,
    removeFeaturedSection,
    addFeaturedIcon,
    removeFeaturedIcon,
    addWhyChooseUs,
    removeWhyChooseUs,
    addProvidedService,
    removeProvidedService,
    addPropertyService,
    removePropertyService,
    pointsToText,
    setItemPoints,
  };
}

export type SiteManagementReturn = ReturnType<typeof useSiteManagement>;
