<template>
  <div class="page-body">
    <CommonBreadcrumb page="Informes" :title="'Informes'" />

    <div class="container-fluid">
      <!-- Toolbar -->
      <div class="card mb-3">
        <div class="card-body admin-form">
          <!-- Fila 1: nombre/selector del informe + acciones -->
          <div class="row gx-3 align-items-end mb-3">
            <!-- Un solo informe: muestra el nombre como texto -->
            <div v-if="templates.length <= 1" class="col-md-4 col-sm-6">
              <span class="toolbar-label d-block">Informe activo</span>
              <span class="fw-semibold">{{ activeTemplate?.name ?? "—" }}</span>
            </div>

            <!-- Varios informes: selector + botón eliminar si no es default -->
            <template v-else>
              <CommonInputfieldsSelectfield
                v-model="activeTemplateId"
                :data="templates"
                label="Informe"
                labelField="name"
                classes="col-md-4 col-sm-6"
                @update:modelValue="onTemplateChange"
              />
              <div
                v-if="activeTemplate && !activeTemplate.is_default"
                class="col-auto"
                style="padding-bottom: 1px"
              >
                <button
                  class="btn btn-dashed color-1"
                  type="button"
                  title="Eliminar este informe"
                  @click="deleteTemplate"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </template>

            <!-- Botones de acción -->
            <div class="col ms-auto mt-3 mt-md-0">
              <div
                class="d-flex gap-2 flex-wrap justify-content-md-end"
                style="padding-bottom: 1px"
              >
                <button
                  class="btn btn-pill btn-dashed color-4"
                  type="button"
                  @click="showNewTemplateModal = true"
                >
                  <i class="fas fa-plus me-1"></i> Nueva plantilla
                </button>
                <button
                  class="btn btn-pill btn-dashed color-4"
                  type="button"
                  @click="showColPanel = true"
                >
                  <i class="fas fa-columns me-1"></i> Columnas
                </button>
                <button
                  class="btn btn-pill btn-gradient color-4"
                  type="button"
                  :disabled="exporting || !activeTemplate"
                  @click="exportExcel"
                >
                  <span
                    v-if="exporting"
                    class="spinner-border spinner-border-sm me-1"
                  ></span>
                  <i v-else class="fas fa-file-excel me-1"></i>
                  {{ exporting ? "Generando..." : "Exportar" }}
                </button>
              </div>
            </div>
          </div>

          <!-- Fila 2: filtros -->
          <div class="row gx-3 align-items-end">
            <CommonInputfieldsSelectfield
              v-model="filters.status"
              :data="STATUS_OPTIONS"
              label="Estado"
              labelField="name"
              classes="col-md-2 col-sm-6"
              @update:modelValue="onFilterChange"
            />

            <div class="col-md-3 col-sm-6">
              <label>Inicio desde</label>
              <VueDatePicker
                v-model="filters.start_from"
                format="yyyy-MM-dd"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
                @update:modelValue="onFilterChange"
              />
            </div>

            <div class="col-md-3 col-sm-6">
              <label>Hasta</label>
              <VueDatePicker
                v-model="filters.start_to"
                format="yyyy-MM-dd"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
                @update:modelValue="onFilterChange"
              />
            </div>

            <div class="col-auto">
              <button
                v-if="hasActiveFilters"
                class="btn btn-pill btn-dashed color-1"
                type="button"
                style="padding-bottom: 9px; padding-top: 9px"
                @click="clearFilters"
              >
                ✕ Limpiar
              </button>
            </div>

            <div v-if="preview" class="col ms-auto text-end">
              <small class="text-muted">
                <strong>{{ preview.total }}</strong> registros
                <span v-if="hasActiveFilters"> · filtrado</span>
                &nbsp;·&nbsp;
                <strong>{{ preview.columns.length }}</strong> columnas
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="card">
        <div class="card-body p-0">
          <!-- Loading -->
          <div
            v-if="loading"
            class="d-flex align-items-center justify-content-center gap-3 p-5"
          >
            <div class="spinner-border text-primary" role="status"></div>
            <span class="text-muted">Cargando datos...</span>
          </div>

          <!-- Empty -->
          <div
            v-else-if="!preview || preview.rows.length === 0"
            class="d-flex flex-column align-items-center justify-content-center p-5 gap-2 text-muted"
          >
            <i class="fas fa-table fa-2x"></i>
            <p class="mb-0">
              No se encontraron registros con los filtros seleccionados
            </p>
          </div>

          <!-- Table -->
          <div v-else class="table-responsive">
            <table class="table table-bordered table-hover report-table mb-0">
              <thead>
                <tr>
                  <th class="col-seq">#</th>
                  <th v-for="col in preview.columns" :key="col.key">
                    {{ col.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in preview.rows" :key="idx">
                  <td class="col-seq text-muted">
                    {{
                      (preview.current_page - 1) * preview.per_page + idx + 1
                    }}
                  </td>
                  <td
                    v-for="col in preview.columns"
                    :key="col.key"
                    :class="{
                      'cell-num': isNumericKey(col.key),
                      'cell-date': isDateKey(col.key),
                    }"
                  >
                    {{ row[col.key] ?? "—" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginación -->
          <div
            v-if="preview && preview.last_page > 1"
            class="d-flex align-items-center justify-content-between p-3 border-top flex-wrap gap-2"
          >
            <small class="text-muted">
              Mostrando {{ preview.rows.length }} de {{ preview.total }} ·
              Página {{ preview.current_page }} de {{ preview.last_page }}
            </small>
            <nav>
              <ul class="pagination pagination-sm mb-0">
                <li
                  class="page-item"
                  :class="{ disabled: preview.current_page === 1 }"
                >
                  <a
                    class="page-link"
                    href="javascript:void(0)"
                    @click="goToPage(preview.current_page - 1)"
                    >«</a
                  >
                </li>
                <li
                  v-for="(page, i) in visiblePages"
                  :key="i"
                  class="page-item"
                  :class="{
                    active: page === preview.current_page,
                    disabled: page === '...',
                  }"
                >
                  <span v-if="page === '...'" class="page-link">...</span>
                  <a
                    v-else
                    class="page-link"
                    href="javascript:void(0)"
                    @click="goToPage(Number(page))"
                    >{{ page }}</a
                  >
                </li>
                <li
                  class="page-item"
                  :class="{
                    disabled: preview.current_page === preview.last_page,
                  }"
                >
                  <a
                    class="page-link"
                    href="javascript:void(0)"
                    @click="goToPage(preview.current_page + 1)"
                    >»</a
                  >
                </li>
              </ul>
            </nav>
          </div>
          <div v-else-if="preview && preview.total > 0" class="p-3 border-top">
            <small class="text-muted">{{ preview.total }} registros</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel de columnas -->
    <ReportsColumnsPanel
      v-if="showColPanel && activeTemplate"
      :show="showColPanel"
      :template="activeTemplate"
      :variables="variables"
      @close="showColPanel = false"
      @saved="onColumnsSaved"
    />

    <!-- Modal nueva plantilla -->
    <CommonModal
      v-model:show="showNewTemplateModal"
      title="Nueva plantilla"
      @close="
        showNewTemplateModal = false;
        newTemplateName = '';
      "
    >
      <div class="admin-form">
        <CommonInputfieldsTextfield
          v-model="newTemplateName"
          label="Nombre del informe"
          placeholder="Ej: Contratos activos 2026"
          name="new-template-name"
          classes="col-12"
        />
        <p class="text-muted small mb-0">
          Se creará una copia del informe actual con las mismas columnas.
        </p>
      </div>
      <template #actions>
        <button
          class="btn btn-pill btn-gradient color-4"
          type="button"
          :disabled="!newTemplateName.trim() || creating"
          @click="createTemplate"
        >
          <span
            v-if="creating"
            class="spinner-border spinner-border-sm me-1"
          ></span>
          {{ creating ? "Creando..." : "Crear informe" }}
        </button>
      </template>
    </CommonModal>
  </div>
</template>

<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";

import { useApiHandler } from "~/composables/useApiHandler";
import AlertService from "~/services/AlertService";
import ReportService from "~/services/ReportService";
import SaveFileFromBackService from "~/services/SaveFileFromBackService";

import type {
  IReportColumn,
  IReportFilters,
  IReportPreviewData,
  IReportTemplate,
  IReportVariableGroup,
} from "~/interfaces/IReportTemplate";

const { run } = useApiHandler();

const STATUS_OPTIONS = [
  { id: "", name: "Todos los estados" },
  { id: "activo", name: "Activo" },
  { id: "pendiente", name: "Pendiente" },
  { id: "terminado", name: "Terminado" },
  { id: "suspendido", name: "Suspendido" },
];

// ── Templates ──────────────────────────────────────────────────────────────
const templates = ref<IReportTemplate[]>([]);
const activeTemplateId = ref<string>("");
const variables = ref<IReportVariableGroup[]>([]);

const activeTemplate = computed<IReportTemplate | undefined>(() =>
  templates.value.find((t) => t.id === activeTemplateId.value),
);

// ── Nueva plantilla ────────────────────────────────────────────────────────
const showNewTemplateModal = ref(false);
const newTemplateName = ref("");
const creating = ref(false);

// ── Preview ────────────────────────────────────────────────────────────────
const preview = ref<IReportPreviewData | null>(null);
const loading = ref(false);
const currentPage = ref(1);

// ── Filters ────────────────────────────────────────────────────────────────
const filters = ref<IReportFilters & { start_from: any; start_to: any }>({
  status: "",
  start_from: null,
  start_to: null,
});

const hasActiveFilters = computed(
  () =>
    !!(
      filters.value.status ||
      filters.value.start_from ||
      filters.value.start_to
    ),
);

// ── Column panel / export ──────────────────────────────────────────────────
const showColPanel = ref(false);
const exporting = ref(false);

// ── Pagination ─────────────────────────────────────────────────────────────
const visiblePages = computed(() => {
  if (!preview.value) return [];
  const total = preview.value.last_page;
  const current = preview.value.current_page;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  )
    pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
});

// ── Data loading ───────────────────────────────────────────────────────────
async function loadTemplates() {
  const resp = await run(ReportService.getTemplates());
  if (resp) {
    templates.value = resp.data ?? [];
    const def = templates.value.find((t) => t.is_default) ?? templates.value[0];
    if (def) {
      activeTemplateId.value = def.id;
      await loadPreview();
    }
  }
}

async function loadVariables() {
  const resp = await run(ReportService.getVariables());
  if (resp) variables.value = resp.data ?? [];
}

async function loadPreview(page = 1) {
  if (!activeTemplateId.value) return;
  loading.value = true;
  currentPage.value = page;

  const cleanFilters: IReportFilters = {
    status: filters.value.status || undefined,
    start_from: filters.value.start_from || undefined,
    start_to: filters.value.start_to || undefined,
  };

  const resp = await run(
    ReportService.preview(activeTemplateId.value, cleanFilters, page),
  );
  loading.value = false;
  if (resp) preview.value = resp.data;
}

// ── CRUD plantillas ─────────────────────────────────────────────────────────
async function createTemplate() {
  if (!newTemplateName.value.trim() || !activeTemplate.value) return;
  creating.value = true;

  const resp = await run(
    ReportService.createTemplate({
      name: newTemplateName.value.trim(),
      columns: activeTemplate.value.columns,
    }),
    { showSuccess: true, successMessage: "Informe creado correctamente" },
  );

  creating.value = false;

  if (resp) {
    templates.value.push(resp.data);
    activeTemplateId.value = resp.data.id;
    showNewTemplateModal.value = false;
    newTemplateName.value = "";
    await loadPreview(1);
  }
}

async function deleteTemplate() {
  if (!activeTemplate.value || activeTemplate.value.is_default) return;

  const result = await AlertService.showConfirmation(
    "¿Eliminar informe?",
    `Se eliminará "${activeTemplate.value.name}". Esta acción no se puede deshacer.`,
  );
  if (!result.isConfirmed) return;

  const resp = await run(ReportService.deleteTemplate(activeTemplateId.value), {
    showSuccess: true,
    successMessage: "Informe eliminado",
  });

  if (resp) {
    templates.value = templates.value.filter(
      (t) => t.id !== activeTemplateId.value,
    );
    const def = templates.value.find((t) => t.is_default) ?? templates.value[0];
    if (def) {
      activeTemplateId.value = def.id;
      await loadPreview(1);
    }
  }
}

// ── Handlers ───────────────────────────────────────────────────────────────
function onTemplateChange() {
  currentPage.value = 1;
  loadPreview(1);
}

let filterTimer: ReturnType<typeof setTimeout> | null = null;
function onFilterChange() {
  if (filterTimer) clearTimeout(filterTimer);
  filterTimer = setTimeout(() => loadPreview(1), 350);
}

function clearFilters() {
  filters.value = { status: "", start_from: null, start_to: null };
  loadPreview(1);
}

function goToPage(page: number) {
  loadPreview(page);
}

function onColumnsSaved(columns: IReportColumn[]) {
  showColPanel.value = false;
  const t = templates.value.find((t) => t.id === activeTemplateId.value);
  if (t) t.columns = columns;
  loadPreview(1);
}

// ── Export ─────────────────────────────────────────────────────────────────
async function exportExcel() {
  if (!activeTemplateId.value || exporting.value) return;
  exporting.value = true;

  const cleanFilters: IReportFilters = {
    status: filters.value.status || undefined,
    start_from: filters.value.start_from || undefined,
    start_to: filters.value.start_to || undefined,
  };

  const blob = await run(
    ReportService.exportExcel(activeTemplateId.value, cleanFilters),
  );
  if (blob) {
    await SaveFileFromBackService.captureFile(
      blob,
      "excel",
      activeTemplate.value?.name ?? "informe",
    );
  }
  exporting.value = false;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const NUMERIC_KEYS = ["rent.canon", "rent.iva", "rent.duration"];
const DATE_KEYS = ["rent.start_date", "rent.end_date", "rent.adjustment_date"];

function isNumericKey(key: string) {
  return NUMERIC_KEYS.includes(key);
}
function isDateKey(key: string) {
  return DATE_KEYS.includes(key);
}

// ── Init ───────────────────────────────────────────────────────────────────
onMounted(() => {
  loadTemplates();
  loadVariables();
});
</script>

<style scoped>
.toolbar-label {
  font-size: 11.5px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 4px;
}
:global(body.dark-layout) .toolbar-label {
  color: #94a3b8;
}
.col-seq {
  width: 44px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-size: 12px;
}
.cell-num {
  font-variant-numeric: tabular-nums;
}
.cell-date {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
}
</style>

<style>
body.dark-layout .report-table th,
body.dark-layout .report-table td {
  color: rgba(255, 255, 255, 0.82) !important;
  background-color: #232323 !important;
  border-color: #383434 !important;
}
body.dark-layout .report-table thead th {
  color: rgba(255, 255, 255, 0.92) !important;
  background-color: #1b1b1b !important;
}
body.dark-layout .report-table tbody tr:hover td {
  background-color: #282727 !important;
}
</style>
