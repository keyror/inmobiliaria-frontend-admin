<template>
  <div class="page-body site-management-page">
    <CommonBreadcrumb page="Sitio público" title="Configuración del sitio" />

    <div class="container-fluid">
      <!-- Template & Colors ─────────────────────────────────────────────── -->
      <div class="card">
        <div
          class="card-header d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-lg-center"
        >
          <div>
            <h5>
              Template y colores
              <span
                v-if="hasUnsavedTemplateChanges"
                class="unsaved-badge ms-2"
                title="Cambios sin guardar"
              >
                Sin guardar
              </span>
            </h5>
            <span class="text-muted">
              La plantilla y el tema de color se aplican globalmente al sitio público.
            </span>
          </div>

          <div class="d-flex flex-wrap gap-2">
            <button
              class="btn btn-pill btn-dashed color-4"
              type="button"
              :disabled="isLoading"
              @click="loadAll"
            >
              <i class="fas fa-sync-alt me-1"></i>
              Recargar
            </button>
          </div>
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
                :disabled="isSavingTemplate || !canEditSiteSettings"
                :error="getTemplateError('template_set')"
                label="Plantilla global"
                label-field="name"
                name="site-template-set"
                show="Selecciona una plantilla"
              />
              <small class="text-muted d-block mt-1">
                {{ selectedTemplateDescription }}
              </small>
            </div>

            <div
              v-for="field in THEME_FIELDS"
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
                  :disabled="isSavingTemplate || !canEditSiteSettings"
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
              <div
                class="site-theme-preview card border"
                :style="themePreviewStyle"
              >
                <span class="preview-dot preview-dot-primary"></span>
                <span class="preview-dot preview-dot-secondary"></span>
                <div>
                  <strong>Vista previa del tema</strong>
                  <small>
                    Primary y secondary se editan desde aquí. Accent se guarda
                    automáticamente igual al primary.
                  </small>
                </div>
              </div>
            </div>

            <div class="form-btn col-12 mt-2">
              <button
                v-if="canEditSiteSettings"
                class="btn btn-pill btn-gradient color-4"
                type="button"
                :disabled="isSavingTemplate || isRestoringTemplate"
                @click="saveTemplate"
              >
                Guardar template y colores
              </button>
              <button
                v-if="canEditSiteSettings"
                class="btn btn-pill btn-dashed color-4"
                type="button"
                :disabled="isSavingTemplate || isRestoringTemplate || !templateSnapshot"
                @click="cancelTemplate"
              >
                Cancelar
              </button>
              <button
                v-if="canEditSiteSettings"
                class="btn btn-pill btn-dashed color-2"
                type="button"
                :disabled="isSavingTemplate || isRestoringTemplate || !hasTemplateBackup"
                @click="doRestoreTemplate"
              >
                <i class="fa fa-undo me-1"></i>
                Restaurar anterior
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pages ─────────────────────────────────────────────────────────── -->
      <div class="card">
        <div class="card-header">
          <h5>Contenido por página</h5>
          <span class="text-muted">
            Cada página tiene su propio contenido. La plantilla se hereda del template global.
          </span>
        </div>

        <div class="card-body admin-form">
          <div v-if="isLoading" class="alert alert-info mb-0">
            Cargando páginas configurables...
          </div>

          <div v-else class="site-page-layout">
            <!-- Sidebar ── -->
            <nav class="site-page-nav">
              <button
                v-for="page in PAGE_OPTIONS"
                :key="page.id"
                class="btn btn-dashed site-page-nav-item"
                :class="{
                  active: activePage === page.id,
                  'color-4': activePage === page.id,
                }"
                type="button"
                @click="activePage = page.id"
              >
                <div class="nav-item-row">
                  <span class="nav-item-label">{{ page.label }}</span>
                  <span
                    v-if="pageHasUnsavedChanges(page.id)"
                    class="unsaved-dot"
                    title="Cambios sin guardar en esta página"
                  ></span>
                </div>
                <small>{{ page.description }}</small>
                <div class="nav-item-badges">
                  <span
                    class="badge rounded-pill"
                    :class="
                      pagesForm[page.id].is_active
                        ? 'bg-success-light text-success'
                        : 'bg-secondary-light text-secondary'
                    "
                  >
                    {{ pagesForm[page.id].is_active ? "Activa" : "Inactiva" }}
                  </span>
                </div>
              </button>
            </nav>

            <!-- Editor area ── -->
            <section class="site-page-editor">
              <div
                class="d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-lg-start mb-3"
              >
                <div>
                  <h5 class="mb-1">{{ activePageMeta.label }}</h5>
                  <p class="text-muted mb-0">{{ activePageMeta.description }}</p>
                </div>
                <CommonInputfieldsCheckbox
                  v-model="currentPage.is_active"
                  :name="`site-page-${activePage}-active`"
                  classes="site-active-checkbox"
                  label="Página activa"
                />
              </div>

              <div class="alert alert-light border d-flex flex-wrap gap-2 site-template-note">
                <span>Plantilla heredada:</span>
                <strong>{{ globalTemplateLabel }}</strong>
                <span class="text-muted">El backend valida que coincida con la plantilla global.</span>
              </div>

              <div v-if="currentPageErrorMessages.length" class="alert alert-danger">
                <div v-for="msg in currentPageErrorMessages" :key="msg">{{ msg }}</div>
              </div>

              <form class="row gx-3" @submit.prevent="saveActivePage">
                <RealstateSiteManagementEditorsHomeEditor
                  v-if="activePage === 'home'"
                  :content="homeContent"
                  :can-edit="canEditSiteSettings"
                  :on-add-slide="addHomeSlide"
                  :on-remove-slide="removeHomeSlide"
                  :on-add-section="addFeaturedSection"
                  :on-remove-section="removeFeaturedSection"
                  :on-add-icon="addFeaturedIcon"
                  :on-remove-icon="removeFeaturedIcon"
                />

                <RealstateSiteManagementEditorsPropertyListEditor
                  v-else-if="activePage === 'propertyList'"
                  :content="propertyListContent"
                  :get-error="getPageError"
                  :can-edit="canEditSiteSettings"
                />

                <RealstateSiteManagementEditorsPropertyDetailEditor
                  v-else-if="activePage === 'propertyDetail'"
                  :content="propertyDetailContent"
                  :get-error="getPageError"
                  :can-edit="canEditSiteSettings"
                />

                <RealstateSiteManagementEditorsAboutEditor
                  v-else-if="activePage === 'about'"
                  :content="aboutContent"
                  :get-error="getPageError"
                  :can-edit="canEditSiteSettings"
                  :on-add-item="addWhyChooseUs"
                  :on-remove-item="removeWhyChooseUs"
                />

                <RealstateSiteManagementEditorsServicesEditor
                  v-else-if="activePage === 'services'"
                  :content="servicesContent"
                  :get-error="getPageError"
                  :can-edit="canEditSiteSettings"
                  :on-add-provided-service="addProvidedService"
                  :on-remove-provided-service="removeProvidedService"
                  :on-add-property-service="addPropertyService"
                  :on-remove-property-service="removePropertyService"
                  :points-to-text="pointsToText"
                  :on-set-points="setItemPoints"
                />

                <RealstateSiteManagementEditorsContactEditor
                  v-else-if="activePage === 'contact'"
                  :content="contactContent"
                  :get-error="getPageError"
                  :can-edit="canEditSiteSettings"
                />

                <RealstateSiteManagementEditorsLayoutEditor
                  v-else-if="activePage === 'layout'"
                  :content="layoutContent"
                  :can-edit="canEditSiteSettings"
                />

                <div class="form-btn col-12 mt-3">
                  <button
                    v-if="canEditSiteSettings"
                    class="btn btn-pill btn-gradient color-4"
                    type="submit"
                    :disabled="isSavingPage || isRestoringPage"
                  >
                    Guardar página
                  </button>
                  <button
                    v-if="canEditSiteSettings"
                    class="btn btn-pill btn-dashed color-4"
                    type="button"
                    :disabled="isSavingPage || isRestoringPage || !pagesSnapshot"
                    @click="cancelPage"
                  >
                    Cancelar
                  </button>
                  <button
                    v-if="canEditSiteSettings"
                    class="btn btn-pill btn-dashed color-2"
                    type="button"
                    :disabled="isSavingPage || isRestoringPage || !hasActivePageBackup"
                    @click="doRestorePage"
                  >
                    <i class="fa fa-undo me-1"></i>
                    Restaurar anterior
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
import { REALSTATE_SITE_PAGE_OPTIONS } from "~/constants/RealstateTemplates";
import {
  THEME_FIELDS,
  useSiteManagement,
} from "~/composables/useSiteManagement";

const PAGE_OPTIONS = REALSTATE_SITE_PAGE_OPTIONS;

const {
  isLoading,
  isSavingTemplate,
  isSavingPage,
  isRestoringTemplate,
  isRestoringPage,
  activePage,
  canEditSiteSettings,
  templateForm,
  templateErrors,
  templateSnapshot,
  hasTemplateBackup,
  hasUnsavedTemplateChanges,
  templateSelectOptions,
  selectedTemplateDescription,
  globalTemplateLabel,
  themePreviewStyle,
  pagesForm,
  pagesSnapshot,
  hasActivePageBackup,
  activePageMeta,
  currentPage,
  currentPageErrorMessages,
  pageHasUnsavedChanges,
  homeContent,
  aboutContent,
  servicesContent,
  propertyListContent,
  propertyDetailContent,
  contactContent,
  layoutContent,
  getTemplateError,
  getThemeError,
  getPageError,
  loadAll,
  saveTemplate,
  saveActivePage,
  cancelTemplate,
  cancelPage,
  doRestoreTemplate,
  doRestorePage,
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
} = useSiteManagement();

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
  flex-direction: row;
  flex-wrap: wrap;
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

/* Sidebar layout */
.site-page-layout {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(240px, 300px) 1fr;
}

.site-page-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.site-page-nav-item {
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

.nav-item-row {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}

.nav-item-label {
  font-weight: 600;
}

.nav-item-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.2rem;
}

/* Unsaved indicator */
.unsaved-dot {
  background: #f6a821;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
  height: 8px;
  width: 8px;
}

.unsaved-badge {
  background: #f6a821;
  border-radius: 4px;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 2px 6px;
  text-transform: uppercase;
  vertical-align: middle;
}

/* Active/Inactive badges */
.bg-success-light {
  background: rgba(52, 168, 83, 0.12);
}

.bg-secondary-light {
  background: rgba(108, 117, 125, 0.12);
}

.site-page-editor {
  min-width: 0;
}

.site-active-checkbox {
  margin-bottom: 0;
  min-width: 170px;
}

/* Textarea dark mode inside editors */

/* Dark mode */
:global(body.dark-layout) .site-theme-preview {
  background: #1f1f1f;
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.88);
}

:global(body.dark-layout) .site-page-nav-item {
  color: rgba(255, 255, 255, 0.88);
}

:global(body.dark-layout) .site-template-note {
  background: rgba(255, 255, 255, 0.035);
  border-color: rgba(255, 255, 255, 0.08) !important;
  color: rgba(255, 255, 255, 0.82);
}

:global(body.dark-layout) .site-management-page .text-muted,
:global(body.dark-layout) .site-theme-preview small,
:global(body.dark-layout) .site-page-nav-item small,
:global(body.dark-layout) .site-color-value {
  color: rgba(255, 255, 255, 0.62) !important;
}

:global(body.dark-layout) .site-page-nav-item.active {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--theme-default7) 12%, transparent),
    rgba(255, 255, 255, 0.04)
  ), #1f1f1f;
  border-color: var(--theme-default7);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
}

:global(body.dark-layout) .site-theme-preview strong,
:global(body.dark-layout) .site-page-nav-item > .nav-item-row > .nav-item-label {
  color: rgba(255, 255, 255, 0.9);
}

:global(body.dark-layout) .site-management-page :deep(textarea.form-control) {
  background-color: #1f1f1f;
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.86);
}

:global(body.dark-layout) .bg-success-light {
  background: rgba(52, 168, 83, 0.18);
}

:global(body.dark-layout) .bg-secondary-light {
  background: rgba(108, 117, 125, 0.18);
}

@media (max-width: 991.98px) {
  .site-page-layout {
    grid-template-columns: 1fr;
  }
}
</style>
