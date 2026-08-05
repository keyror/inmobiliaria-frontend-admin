<template>
  <div class="page-body">
    <CommonBreadcrumb page="Central SaaS" title="Colores del sitio" />

    <div class="container-fluid">
      <div class="card">
        <div
          class="card-header d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-lg-center"
        >
          <div>
            <h5>
              Tema de color del sitio central
              <span
                v-if="isDirty"
                class="unsaved-badge ms-2"
                title="Cambios sin guardar"
              >Sin guardar</span>
            </h5>
            <span class="text-muted">
              Estos colores se aplican al sitio SaaS público (landing central).
            </span>
          </div>

          <div class="d-flex flex-wrap gap-2">
            <button
              type="button"
              class="btn btn-pill btn-dashed color-4"
              :disabled="isLoading"
              @click="load"
            >
              <i class="fas fa-sync-alt me-1" />
              Recargar
            </button>
          </div>
        </div>

        <div class="card-body admin-form">
          <div v-if="isLoading" class="alert alert-info mb-0">
            Cargando configuración...
          </div>

          <template v-else>
            <div v-if="errorMessage" class="alert alert-danger mb-3">
              {{ errorMessage }}
            </div>

            <div class="row gx-3">
              <div
                v-for="field in THEME_FIELDS"
                :key="field.key"
                class="form-group col-md-4 col-lg-2"
              >
                <label :for="`central-theme-${field.key}`">{{ field.label }}</label>
                <div class="site-color-field">
                  <input
                    :id="`central-theme-${field.key}`"
                    v-model="form[field.key]"
                    type="color"
                    class="form-control form-control-color site-color-input"
                    :disabled="isSaving || !canEdit"
                  />
                  <span class="site-color-value">{{ form[field.key] }}</span>
                </div>
              </div>

              <div class="col-12">
                <div
                  class="site-theme-preview card border"
                  :style="previewStyle"
                >
                  <span class="preview-dot preview-dot-primary" />
                  <span class="preview-dot preview-dot-secondary" />
                  <div>
                    <strong>Vista previa del tema</strong>
                    <small>Primary y secondary del sitio central.</small>
                  </div>
                </div>
              </div>

              <div class="form-btn col-12 mt-2">
                <button
                  v-if="canEdit"
                  type="button"
                  class="btn btn-pill btn-gradient color-4"
                  :disabled="isSaving"
                  @click="save"
                >
                  Guardar colores
                </button>
                <button
                  v-if="canEdit"
                  type="button"
                  class="btn btn-pill btn-dashed color-4"
                  :disabled="isSaving || !isDirty"
                  @click="cancel"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CentralSiteManagementService from "~/services/CentralSiteManagementService";
import type { CentralSiteTheme } from "~/services/CentralSiteManagementService";
import { usecustomizerStore } from "~/store/costomizer";

definePageMeta({
  permission: "site-settings.theme-view",
});

useHead({ title: "Colores del sitio central" });

type ThemeDisplayKey = Exclude<keyof CentralSiteTheme, "accent">;
const THEME_FIELDS: { key: ThemeDisplayKey; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
];

const DEFAULT_THEME: CentralSiteTheme = {
  primary: "#46b5d1",
  secondary: "#1f2937",
  accent: "#f35d43",
};

const { run } = useApiHandler();
const { can } = useAuthorization();
const customizerStore = usecustomizerStore();

const canEdit = computed(() => can("site-settings.edit"));

const isLoading = ref(false);
const isSaving = ref(false);
const errorMessage = ref("");
const form = ref<CentralSiteTheme>({ ...DEFAULT_THEME });
const snapshot = ref<CentralSiteTheme | null>(null);

const isDirty = computed(
  () =>
    snapshot.value !== null &&
    JSON.stringify(form.value) !== JSON.stringify(snapshot.value),
);

const previewStyle = computed(() => ({
  "--preview-primary": form.value.primary,
  "--preview-secondary": form.value.secondary,
  "--preview-accent": form.value.accent,
}));

async function load() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const res = await CentralSiteManagementService.getTheme();
    if (res.status && res.data?.theme) {
      form.value = { ...res.data.theme };
      snapshot.value = { ...res.data.theme };
    }
  } catch {
    errorMessage.value = "No se pudo cargar la configuración.";
  } finally {
    isLoading.value = false;
  }
}

async function save() {
  isSaving.value = true;
  try {
    const payload: CentralSiteTheme = { ...form.value, accent: form.value.primary };
    const res = await run(CentralSiteManagementService.updateTheme(payload), {
      showSuccess: true,
      successMessage: "Colores del sitio central actualizados",
    });
    if (res?.data?.theme) {
      form.value = { ...res.data.theme };
      snapshot.value = { ...res.data.theme };
      customizerStore.setcolor(
        { primary: res.data.theme.primary, secondary: res.data.theme.secondary, accent: res.data.theme.accent },
        { persist: true },
      );
    }
  } finally {
    isSaving.value = false;
  }
}

function cancel() {
  if (snapshot.value) {
    form.value = { ...snapshot.value };
  }
}

onMounted(() => void load());
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

:global(body.dark-layout) .site-theme-preview {
  background: #1f1f1f;
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.88);
}

:global(body.dark-layout) .site-theme-preview small,
:global(body.dark-layout) .site-color-value {
  color: rgba(255, 255, 255, 0.62) !important;
}

:global(body.dark-layout) .site-theme-preview strong {
  color: rgba(255, 255, 255, 0.9);
}
</style>
