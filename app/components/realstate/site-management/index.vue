<template>
  <div class="page-body">
    <CommonBreadcrumb page="Sitio público" title="Configuración del sitio" />

    <div class="container-fluid">
      <div class="card">
        <div
          class="card-header d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-lg-center"
        >
          <div>
            <h5>Template y colores</h5>
            <span class="text-muted">
              La plantilla y el tema se aplican de forma global al sitio
              público.
            </span>
          </div>

          <button
            class="btn btn-pill btn-dashed color-4"
            type="button"
            :disabled="isLoading"
            @click="loadAll"
          >
            Recargar
          </button>
        </div>

        <div class="card-body admin-form">
          <div v-if="isLoading" class="alert alert-info mb-0">
            Cargando configuración del sitio...
          </div>

          <div v-else class="row gx-3">
            <div class="col-lg-4">
              <CommonInputfieldsSelectfield
                v-model="templateForm.template_set"
                :data="templateSelectOptions"
                :disabled="isSavingTemplate"
                :error="getTemplateError('template_set')"
                label="Template global"
                label-field="name"
                name="site-template-set"
                show="Selecciona un template"
              />
              <small class="text-muted d-block mt-1">
                {{ selectedTemplateDescription }}
              </small>
            </div>

            <div
              v-for="field in themeFields"
              :key="field.key"
              class="form-group col-md-4 col-lg-2"
              :class="{ 'was-validated': getThemeError(field.key) }"
            >
              <label :for="`site-theme-${field.key}`">{{ field.label }}</label>
              <div class="site-color-field">
                <input
                  :id="`site-theme-${field.key}`"
                  v-model="templateForm.theme[field.key]"
                  class="form-control form-control-color site-color-input"
                  :class="{ 'is-invalid': getThemeError(field.key) }"
                  type="color"
                  :disabled="isSavingTemplate"
                />
                <span class="site-color-value">
                  {{ templateForm.theme[field.key] }}
                </span>
              </div>
              <small v-if="getThemeError(field.key)" class="text-danger">
                {{ getThemeError(field.key) }}
              </small>
            </div>

            <div class="col-12">
              <div class="site-theme-preview" :style="themePreviewStyle">
                <span class="preview-dot preview-dot-primary"></span>
                <span class="preview-dot preview-dot-secondary"></span>
                <div>
                  <strong>Vista rápida del tema</strong>
                  <small>
                    Primary y secondary se editan desde aquí. Accent se guarda
                    automáticamente igual al primary.
                  </small>
                </div>
              </div>
            </div>

            <div class="form-btn col-12 mt-2">
              <button
                class="btn btn-pill btn-gradient color-4"
                type="button"
                :disabled="isSavingTemplate"
                @click="saveTemplate"
              >
                Guardar template y colores
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5>Contenido por página</h5>
          <span class="text-muted">
            Cada página guarda estado y contenido. La plantilla se hereda del
            template global.
          </span>
        </div>

        <div class="card-body admin-form">
          <div v-if="isLoading" class="alert alert-info mb-0">
            Cargando páginas configurables...
          </div>

          <div v-else class="site-page-layout">
            <nav class="site-page-nav" aria-label="Páginas del sitio">
              <button
                v-for="page in REALSTATE_SITE_PAGE_OPTIONS"
                :key="page.id"
                class="site-page-nav-item"
                :class="{ active: activePage === page.id }"
                type="button"
                @click="activePage = page.id"
              >
                <span>{{ page.label }}</span>
                <small>{{ page.description }}</small>
                <span
                  class="badge"
                  :class="
                    pagesForm[page.id].is_active
                      ? 'badge-success'
                      : 'badge-secondary'
                  "
                >
                  {{ pagesForm[page.id].is_active ? "Activa" : "Inactiva" }}
                </span>
              </button>
            </nav>

            <section class="site-page-editor">
              <div
                class="d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-lg-start mb-3"
              >
                <div>
                  <h5 class="mb-1">{{ activePageMeta.label }}</h5>
                  <p class="text-muted mb-0">
                    {{ activePageMeta.description }}
                  </p>
                </div>

                <CommonInputfieldsCheckbox
                  v-model="currentPage.is_active"
                  :name="`site-page-${activePage}-active`"
                  classes="site-active-checkbox"
                  label="Página activa"
                />
              </div>

              <div class="alert alert-light border d-flex flex-wrap gap-2">
                <span>Template heredado:</span>
                <strong>{{ globalTemplateLabel }}</strong>
                <span class="text-muted">
                  El backend valida que coincida con el template global.
                </span>
              </div>

              <div
                v-if="currentPageErrorMessages.length"
                class="alert alert-danger"
              >
                <div v-for="message in currentPageErrorMessages" :key="message">
                  {{ message }}
                </div>
              </div>

              <form class="row gx-3" @submit.prevent="saveActivePage">
                <template v-if="activePage === 'propertyList'">
                  <CommonInputfieldsTextfield
                    v-model="propertyListContent.title"
                    :error="getPageError('title')"
                    classes="col-md-6"
                    label="Título"
                    :required="false"
                  />

                  <CommonInputfieldsTextfield
                    v-model="propertyListContent.subtitle"
                    :error="getPageError('subtitle')"
                    classes="col-md-6"
                    label="Subtítulo"
                    :required="false"
                  />
                </template>

                <template v-else-if="activePage === 'propertyDetail'">
                  <CommonInputfieldsCheckbox
                    v-model="propertyDetailContent.show_related_properties"
                    classes="col-md-6"
                    label="Mostrar propiedades relacionadas"
                    name="show_related_properties"
                  />

                  <CommonInputfieldsTextfield
                    v-model="propertyDetailContent.contact_title"
                    :error="getPageError('contact_title')"
                    classes="col-md-6"
                    label="Título de contacto"
                    :required="false"
                  />
                </template>

                <template v-else-if="activePage === 'about'">
                  <CommonInputfieldsTextarea
                    v-model="aboutContent.history"
                    :error="getPageError('history')"
                    classes="col-md-4"
                    label="Historia"
                    :required="false"
                  />

                  <CommonInputfieldsTextarea
                    v-model="aboutContent.mission"
                    :error="getPageError('mission')"
                    classes="col-md-4"
                    label="Misión"
                    :required="false"
                  />

                  <CommonInputfieldsTextarea
                    v-model="aboutContent.vision"
                    :error="getPageError('vision')"
                    classes="col-md-4"
                    label="Visión"
                    :required="false"
                  />

                  <div class="col-12">
                    <div class="repeatable-section">
                      <div
                        class="d-flex justify-content-between align-items-center mb-3"
                      >
                        <h6>Por qué elegirnos</h6>
                        <button
                          class="btn btn-pill btn-dashed color-4"
                          type="button"
                          @click="addWhyChooseUs"
                        >
                          Agregar razón
                        </button>
                      </div>

                      <div
                        v-if="!aboutContent.why_choose_us.length"
                        class="text-muted"
                      >
                        No hay razones configuradas.
                      </div>

                      <div
                        v-for="(item, index) in aboutContent.why_choose_us"
                        :key="`why-${index}`"
                        class="repeatable-item"
                      >
                        <div
                          class="d-flex justify-content-between align-items-center mb-2"
                        >
                          <strong>Razón {{ index + 1 }}</strong>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            type="button"
                            @click="removeWhyChooseUs(index)"
                          >
                            Eliminar
                          </button>
                        </div>

                        <div class="row gx-3">
                          <CommonInputfieldsTextfield
                            v-model="item.title"
                            classes="col-md-5"
                            label="Título"
                            :required="false"
                          />

                          <CommonInputfieldsTextarea
                            v-model="item.description"
                            classes="col-md-7"
                            label="Descripción"
                            :required="false"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else-if="activePage === 'services'">
                  <div class="col-12">
                    <div class="repeatable-section">
                      <div
                        class="d-flex justify-content-between align-items-center mb-3"
                      >
                        <h6>Servicios prestados</h6>
                        <button
                          class="btn btn-pill btn-dashed color-4"
                          type="button"
                          @click="addProvidedService"
                        >
                          Agregar servicio
                        </button>
                      </div>

                      <div
                        v-if="!servicesContent.provided_services.length"
                        class="text-muted"
                      >
                        No hay servicios prestados configurados.
                      </div>

                      <div
                        v-for="(
                          item, index
                        ) in servicesContent.provided_services"
                        :key="`provided-${index}`"
                        class="repeatable-item"
                      >
                        <div
                          class="d-flex justify-content-between align-items-center mb-2"
                        >
                          <strong>Servicio {{ index + 1 }}</strong>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            type="button"
                            @click="removeProvidedService(index)"
                          >
                            Eliminar
                          </button>
                        </div>

                        <div class="row gx-3">
                          <CommonInputfieldsTextfield
                            v-model="item.title"
                            classes="col-md-5"
                            label="Título"
                            :required="false"
                          />

                          <CommonInputfieldsTextarea
                            v-model="item.description"
                            classes="col-md-7"
                            label="Descripción"
                            :required="false"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="repeatable-section">
                      <div
                        class="d-flex justify-content-between align-items-center mb-3"
                      >
                        <h6>Servicios de propiedades</h6>
                        <button
                          class="btn btn-pill btn-dashed color-4"
                          type="button"
                          @click="addPropertyService"
                        >
                          Agregar servicio
                        </button>
                      </div>

                      <div
                        v-if="!servicesContent.property_services.length"
                        class="text-muted"
                      >
                        No hay servicios de propiedades configurados.
                      </div>

                      <div
                        v-for="(
                          item, index
                        ) in servicesContent.property_services"
                        :key="`property-service-${index}`"
                        class="repeatable-item"
                      >
                        <div
                          class="d-flex justify-content-between align-items-center mb-2"
                        >
                          <strong>Servicio {{ index + 1 }}</strong>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            type="button"
                            @click="removePropertyService(index)"
                          >
                            Eliminar
                          </button>
                        </div>

                        <div class="row gx-3">
                          <CommonInputfieldsTextfield
                            v-model="item.title"
                            classes="col-md-5"
                            label="Título"
                            :required="false"
                          />

                          <CommonInputfieldsTextarea
                            v-model="item.description"
                            classes="col-md-7"
                            label="Descripción"
                            :required="false"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else>
                  <div
                    class="form-group col-12"
                    :class="{ 'was-validated': getPageError('content') }"
                  >
                    <label :for="`site-page-${activePage}-json`">
                      Contenido JSON
                    </label>
                    <textarea
                      :id="`site-page-${activePage}-json`"
                      v-model="pageJsonDrafts[activePage]"
                      class="form-control site-json-editor"
                      :class="{ 'is-invalid': getPageError('content') }"
                      rows="12"
                    ></textarea>
                    <small class="text-muted">
                      Usa un objeto JSON válido. Ejemplo: {}
                    </small>
                    <small v-if="getPageError('content')" class="text-danger">
                      {{ getPageError("content") }}
                    </small>
                  </div>
                </template>

                <div class="form-btn col-12 mt-3">
                  <button
                    class="btn btn-pill btn-gradient color-4"
                    type="submit"
                    :disabled="isSavingPage"
                  >
                    Guardar página
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApiHandler } from "~/composables/useApiHandler";
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
  RealstateContentItem,
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

type ThemeFieldKey = Exclude<keyof RealstateTheme, "accent">;

const DEFAULT_TEMPLATE_SET: RealstateTemplateSet = "template1";
const JSON_EDITABLE_PAGES: RealstateSitePageKey[] = ["home", "contact"];
const EMPTY_ITEM: RealstateContentItem = {
  title: "",
  description: "",
};

const themeFields: { key: ThemeFieldKey; label: string }[] = [
  { key: "primary", label: "Primario" },
  { key: "secondary", label: "Secundario" },
];

const { run } = useApiHandler();
const customizerStore = usecustomizerStore();

const isLoading = ref(false);
const isSavingTemplate = ref(false);
const isSavingPage = ref(false);
const activePage = ref<RealstateSitePageKey>("home");

const templateForm = ref<RealstateSiteTemplatePayload>({
  template_set: DEFAULT_TEMPLATE_SET,
  theme: normalizeRealstateTheme(),
});
const pagesForm = ref<RealstateSitePages>(createPagesState());
const pageJsonDrafts =
  ref<Record<RealstateSitePageKey, string>>(createJsonDrafts());
const templateErrors = ref<Record<string, string>>({});
const pageErrors =
  ref<Record<RealstateSitePageKey, Record<string, string>>>(createPageErrors());

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
      (template) => template.id === templateForm.value.template_set,
    )?.description ?? "",
);

const globalTemplateLabel = computed(
  () =>
    REALSTATE_TEMPLATE_OPTIONS.find(
      (template) => template.id === templateForm.value.template_set,
    )?.label ?? templateForm.value.template_set,
);

const themePreviewStyle = computed(() => ({
  "--preview-primary": templateForm.value.theme.primary,
  "--preview-secondary": templateForm.value.theme.secondary,
}));

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

const aboutContent = computed(
  () => pagesForm.value.about.content as RealstateAboutContent,
);
const servicesContent = computed(
  () => pagesForm.value.services.content as RealstateServicesContent,
);
const propertyListContent = computed(
  () => pagesForm.value.propertyList.content as RealstatePropertyListContent,
);
const propertyDetailContent = computed(
  () =>
    pagesForm.value.propertyDetail.content as RealstatePropertyDetailContent,
);

function createJsonDrafts(): Record<RealstateSitePageKey, string> {
  return REALSTATE_SITE_PAGE_OPTIONS.reduce(
    (drafts, page) => {
      drafts[page.id] = "{}";
      return drafts;
    },
    {} as Record<RealstateSitePageKey, string>,
  );
}

function createPageErrors(): Record<
  RealstateSitePageKey,
  Record<string, string>
> {
  return REALSTATE_SITE_PAGE_OPTIONS.reduce(
    (errors, page) => {
      errors[page.id] = {};
      return errors;
    },
    {} as Record<RealstateSitePageKey, Record<string, string>>,
  );
}

function createPagesState(): RealstateSitePages {
  return REALSTATE_SITE_PAGE_OPTIONS.reduce((pages, page) => {
    pages[page.id] = createPageState(page.id);
    return pages;
  }, {} as RealstateSitePages);
}

function createPageState(page: RealstateSitePageKey): RealstateSitePage {
  return {
    is_active: true,
    template: DEFAULT_TEMPLATE_SET,
    content: createDefaultContent(page),
  };
}

function createDefaultContent(
  page: RealstateSitePageKey,
): RealstateSitePageContent {
  if (page === "about") {
    return {
      history: "",
      mission: "",
      vision: "",
      why_choose_us: [],
    };
  }

  if (page === "services") {
    return {
      provided_services: [],
      property_services: [],
    };
  }

  if (page === "propertyList") {
    return {
      title: "",
      subtitle: "",
    };
  }

  if (page === "propertyDetail") {
    return {
      show_related_properties: true,
      contact_title: "",
    };
  }

  return {};
}

function asRecord(content: unknown): Record<string, unknown> {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return {};
  }

  return content as Record<string, unknown>;
}

function toText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toNullableText(value: unknown): string | null {
  const text = toText(value).trim();
  return text || null;
}

function normalizeItems(value: unknown): RealstateContentItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const record = asRecord(item);
      return {
        title: toText(record.title),
        description: toText(record.description),
      };
    })
    .filter((item) => item.title.trim() || item.description.trim());
}

function cloneItem(): RealstateContentItem {
  return { ...EMPTY_ITEM };
}

function normalizeContentForForm(
  page: RealstateSitePageKey,
  content: unknown,
): RealstateSitePageContent {
  const record = asRecord(content);

  if (page === "about") {
    return {
      ...record,
      history: toText(record.history),
      mission: toText(record.mission),
      vision: toText(record.vision),
      why_choose_us: normalizeItems(record.why_choose_us),
    };
  }

  if (page === "services") {
    return {
      ...record,
      provided_services: normalizeItems(record.provided_services),
      property_services: normalizeItems(record.property_services),
    };
  }

  if (page === "propertyList") {
    return {
      ...record,
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
      contact_title: toText(record.contact_title),
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

function setAdminTheme(theme: RealstateTheme) {
  if (!import.meta.client) return;

  customizerStore.setcolor({
    primary: theme.primary,
    secondary: theme.secondary,
  });
}

function getThemePayload(theme: RealstateTheme): RealstateTheme {
  const normalized = normalizeRealstateTheme(theme);

  return {
    ...normalized,
    accent: normalized.primary,
  };
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

function syncJsonDraft(page: RealstateSitePageKey) {
  if (!JSON_EDITABLE_PAGES.includes(page)) return;

  pageJsonDrafts.value[page] = JSON.stringify(
    pagesForm.value[page].content ?? {},
    null,
    2,
  );
}

function syncAllJsonDrafts() {
  JSON_EDITABLE_PAGES.forEach(syncJsonDraft);
}

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
  pageErrors.value = {
    ...pageErrors.value,
    [page]: errors,
  };
}

function validateTemplateForm(): boolean {
  const errors: Record<string, string> = {};

  if (
    !REALSTATE_TEMPLATE_OPTIONS.some(
      (template) => template.id === templateForm.value.template_set,
    )
  ) {
    errors.template_set = "Template inválido";
  }

  themeFields.forEach((field) => {
    if (!isHexThemeColor(templateForm.value.theme[field.key])) {
      errors[`theme.${field.key}`] =
        `${field.label} debe ser un hex de 6 dígitos`;
    }
  });

  templateErrors.value = errors;
  return !Object.keys(errors).length;
}

function getKnownContentPayload(
  page: RealstateSitePageKey,
): RealstateSitePageContent {
  if (page === "about") {
    return {
      ...aboutContent.value,
      history: toNullableText(aboutContent.value.history),
      mission: toNullableText(aboutContent.value.mission),
      vision: toNullableText(aboutContent.value.vision),
      why_choose_us: normalizeItems(aboutContent.value.why_choose_us),
    };
  }

  if (page === "services") {
    return {
      ...servicesContent.value,
      provided_services: normalizeItems(
        servicesContent.value.provided_services,
      ),
      property_services: normalizeItems(
        servicesContent.value.property_services,
      ),
    };
  }

  if (page === "propertyList") {
    return {
      ...propertyListContent.value,
      title: toNullableText(propertyListContent.value.title),
      subtitle: toNullableText(propertyListContent.value.subtitle),
    };
  }

  if (page === "propertyDetail") {
    return {
      ...propertyDetailContent.value,
      show_related_properties: Boolean(
        propertyDetailContent.value.show_related_properties,
      ),
      contact_title: toNullableText(propertyDetailContent.value.contact_title),
    };
  }

  return asRecord(pagesForm.value[page].content);
}

async function getPagePayload(
  page: RealstateSitePageKey,
): Promise<RealstateSitePagePayload | null> {
  setPageErrors(page, {});

  if (JSON_EDITABLE_PAGES.includes(page)) {
    try {
      const draft = pageJsonDrafts.value[page]?.trim() || "{}";
      const parsed = JSON.parse(draft);

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        setPageErrors(page, {
          content: "El contenido debe ser un objeto JSON.",
        });
        await AlertService.showFormError();
        return null;
      }

      return {
        is_active: Boolean(pagesForm.value[page].is_active),
        content: parsed as Record<string, unknown>,
      };
    } catch {
      setPageErrors(page, {
        content: "El JSON no es válido.",
      });
      await AlertService.showFormError();
      return null;
    }
  }

  return {
    is_active: Boolean(pagesForm.value[page].is_active),
    content: getKnownContentPayload(page),
  };
}

async function loadTemplate() {
  const response = await run(RealstateSiteManagementService.getTemplate());
  if (response?.data) applyTemplateData(response.data);
}

async function loadPages() {
  const response = await run(RealstateSiteManagementService.getPages());

  if (!response?.data) return;

  applyTemplateData({
    template_set: response.data.template_set,
    theme: response.data.theme,
  });
  pagesForm.value = normalizePages(
    response.data.pages,
    response.data.template_set,
  );
  syncAllJsonDrafts();
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
        successMessage: "Template y colores actualizados correctamente",
        setErrors: (errors) => {
          templateErrors.value = errors;
        },
      },
    );

    if (response?.data) {
      applyTemplateData(response.data);
      await loadPages();
    }
  } finally {
    isSavingTemplate.value = false;
  }
}

async function savePage(page: RealstateSitePageKey) {
  const payload = await getPagePayload(page);
  if (!payload) return;

  isSavingPage.value = true;

  try {
    const response = await run(
      RealstateSiteManagementService.updatePage(page, payload),
      {
        showSuccess: true,
        successMessage: "Página actualizada correctamente",
        setErrors: (errors) => setPageErrors(page, errors),
      },
    );

    if (response?.data?.config) {
      pagesForm.value = {
        ...pagesForm.value,
        [page]: normalizePage(
          page,
          response.data.config,
          templateForm.value.template_set,
        ),
      };
      syncJsonDraft(page);
    }
  } finally {
    isSavingPage.value = false;
  }
}

async function saveActivePage() {
  await savePage(activePage.value);
}

function addWhyChooseUs() {
  aboutContent.value.why_choose_us.push(cloneItem());
}

function removeWhyChooseUs(index: number) {
  aboutContent.value.why_choose_us.splice(index, 1);
}

function addProvidedService() {
  servicesContent.value.provided_services.push(cloneItem());
}

function removeProvidedService(index: number) {
  servicesContent.value.provided_services.splice(index, 1);
}

function addPropertyService() {
  servicesContent.value.property_services.push(cloneItem());
}

function removePropertyService(index: number) {
  servicesContent.value.property_services.splice(index, 1);
}

onMounted(() => {
  void loadAll();
});
</script>

<style scoped>
.site-color-field {
  align-items: center;
  display: flex;
  gap: 0.75rem;
}

.site-color-input {
  height: 42px;
  padding: 0.25rem;
  width: 72px;
}

.site-color-value {
  color: #6c757d;
  font-family: monospace;
}

.site-theme-preview {
  align-items: center;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--preview-primary) 16%, transparent),
      transparent 45%
    ),
    color-mix(in srgb, var(--preview-secondary) 8%, #ffffff);
  border: 1px solid rgba(88, 97, 103, 0.14);
  border-radius: 12px;
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
}

.site-theme-preview small {
  color: #6c757d;
  display: block;
}

.preview-dot {
  border-radius: 50%;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.14);
  display: inline-block;
  height: 28px;
  width: 28px;
}

.preview-dot-primary {
  background: var(--preview-primary);
}

.preview-dot-secondary {
  background: var(--preview-secondary);
}

.site-page-layout {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(240px, 320px) 1fr;
}

.site-page-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.site-page-nav-item {
  background: #ffffff;
  border: 1px solid rgba(88, 97, 103, 0.14);
  border-radius: 12px;
  color: inherit;
  display: grid;
  gap: 0.35rem;
  padding: 0.9rem 1rem;
  text-align: left;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.site-page-nav-item.active {
  border-color: var(--theme-default7);
  box-shadow: 0 10px 24px rgba(88, 97, 103, 0.12);
  transform: translateY(-1px);
}

.site-page-nav-item small {
  color: #6c757d;
  line-height: 1.35;
}

.site-page-nav-item .badge {
  justify-self: start;
}

.site-page-editor {
  min-width: 0;
}

.site-active-checkbox {
  margin-bottom: 0;
  min-width: 170px;
}

.repeatable-section {
  background: color-mix(in srgb, var(--theme-default7) 4%, #ffffff);
  border: 1px solid rgba(88, 97, 103, 0.14);
  border-radius: 12px;
  margin-bottom: 1rem;
  padding: 1rem;
}

.repeatable-section h6 {
  margin: 0;
}

.repeatable-item {
  background: #ffffff;
  border: 1px solid rgba(88, 97, 103, 0.12);
  border-radius: 10px;
  margin-top: 0.85rem;
  padding: 1rem;
}

.site-json-editor {
  font-family: monospace;
  min-height: 260px;
}

:global(body.dark-layout) .site-theme-preview,
:global(body.dark-layout) .site-page-nav-item,
:global(body.dark-layout) .repeatable-item {
  background: #1f1f1f;
}

:global(body.dark-layout) .repeatable-section {
  background: rgba(255, 255, 255, 0.03);
}

@media (max-width: 991.98px) {
  .site-page-layout {
    grid-template-columns: 1fr;
  }
}
</style>
