<script setup lang="ts">
import draggable from "vuedraggable";

import AlertService from "~/services/AlertService";
import TemplateSectionService from "~/services/TemplateSectionService";

import type { ILookup } from "~/interfaces/ILookup";
import type {
  TemplateSectionType,
  ITemplateSection,
  ITemplateSectionMeta,
} from "~/interfaces/ITemplateSection";

definePageMeta({ permission: "documents.view" });
useHead({ title: "Plantillas de Contratos" });

const { run } = useApiHandler();

// ── State ─────────────────────────────────────────────────────────────────────
const selectedTemplate = ref("arrendamiento_vivienda");
const clauses = ref<ITemplateSection[]>([]);
const loading = ref(false);
const saving = ref(false);
const resetting = ref(false);
const deleting = ref<number | null>(null);
const showResetConfirm = ref(false);
const editingId = ref<number | null>(null);
const showPreview = ref(false);

const meta = ref<ITemplateSectionMeta>({
  templates: {},
  variables: {},
  variable_groups: [],
  dotted_to_placeholder: {},
});

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  await loadMeta();
  await loadClauses();
});

// Recargar cuando cambia la plantilla seleccionada
watch(selectedTemplate, loadClauses);

// ── Data loaders ──────────────────────────────────────────────────────────────
async function loadMeta() {
  const result = await run(TemplateSectionService.getMeta());
  if (result) {
    meta.value = result.data;
    if (!meta.value.templates[selectedTemplate.value]) {
      selectedTemplate.value =
        Object.keys(meta.value.templates)[0] ?? "arrendamiento_vivienda";
    }
  }
}

async function loadClauses() {
  loading.value = true;
  editingId.value = null;
  try {
    const result = await run(
      TemplateSectionService.getByTemplate(selectedTemplate.value),
    );
    if (result) clauses.value = result.data;
  } finally {
    loading.value = false;
  }
}

// ── Section CRUD ──────────────────────────────────────────────────────────────
function startEdit(id: number) {
  editingId.value = id;
}

function cancelEdit() {
  editingId.value = null;
}

async function saveSection(
  clause: ITemplateSection,
  data: {
    heading: string;
    content_json?: Record<string, any> | null;
    section_config?: Record<string, any> | null;
  },
) {
  saving.value = true;
  const payload: Record<string, any> = { heading: data.heading };
  if (data.content_json !== undefined) payload.content_json = data.content_json;
  if (data.section_config !== undefined)
    payload.section_config = data.section_config;

  const result = await run(TemplateSectionService.update(clause.id, payload), {
    showSuccess: true,
  });
  saving.value = false;
  if (result) {
    const idx = clauses.value.findIndex((c) => c.id === clause.id);
    if (idx !== -1)
      clauses.value[idx] = { ...clauses.value[idx], ...result.data };
    editingId.value = null;
  }
}

async function toggleActive(clause: ITemplateSection) {
  const result = await run(
    TemplateSectionService.update(clause.id, { is_active: !clause.is_active }),
  );
  if (result) {
    const idx = clauses.value.findIndex((c) => c.id === clause.id);
    if (idx !== -1) clauses.value[idx]!.is_active = !clause.is_active;
  }
}

async function deleteSection(clause: ITemplateSection) {
  const confirmed = await AlertService.showConfirmation(
    "¿Eliminar sección?",
    `Se eliminará "${clause.heading}".`,
  );
  if (!confirmed.isConfirmed) return;
  deleting.value = clause.id;
  const result = await run(TemplateSectionService.remove(clause.id), {
    showSuccess: true,
  });
  deleting.value = null;
  if (result !== null)
    clauses.value = clauses.value.filter((c) => c.id !== clause.id);
}

async function duplicateSection(clause: ITemplateSection) {
  const payload: Partial<ITemplateSection> = {
    template_key: clause.template_key,
    section_type: clause.section_type,
    section_key: undefined,
    heading: clause.heading,
    body: clause.body,
    content_json: clause.content_json,
    section_config: clause.section_config,
    is_active: clause.is_active,
  };
  const result = await run(TemplateSectionService.create(payload), {
    showSuccess: true,
  });
  if (result) clauses.value.push(result.data);
}

async function onReorder() {
  const ids = clauses.value.map((c) => c.id);
  await run(TemplateSectionService.reorder(selectedTemplate.value, ids));
}

// ── Add section ───────────────────────────────────────────────────────────────
function defaultConfigForType(
  type: TemplateSectionType,
): Record<string, any> | null {
  if (type === "party_info") {
    return {
      role: "arrendatario",
      fields: ["name", "document", "phone", "email", "address"],
    };
  }
  if (type === "property_info") {
    return {
      fields: [
        "address",
        "city",
        "neighborhood",
        "registration",
        "type",
        "area",
      ],
    };
  }
  if (type === "contract_info") {
    return {
      fields: [
        "canon",
        "start_date",
        "end_date",
        "duration_months",
        "increment_type",
        "admin_included",
      ],
    };
  }
  if (type === "signature") {
    return {
      signatories: [
        { role: "arrendador", label: "EL ARRENDADOR", side: "left" },
        { role: "arrendatario", label: "EL ARRENDATARIO", side: "right" },
      ],
    };
  }
  if (type === "separator") {
    return { style: "line" };
  }
  return null;
}

const HEADING_FOR_TYPE: Record<TemplateSectionType, string | null> = {
  clause: null,
  observation: "OBSERVACIONES",
  header: "Encabezado del documento",
  party_info: "Datos del Arrendatario",
  property_info: "Datos del Inmueble",
  contract_info: "Términos del Contrato",
  signature: "Firmas",
  table: "Tabla",
  separator: null,
};

async function addSection(type: TemplateSectionType) {
  const payload: Partial<ITemplateSection> = {
    template_key: selectedTemplate.value,
    section_type: type,
    heading: HEADING_FOR_TYPE[type],
    content_json: null,
    section_config: defaultConfigForType(type),
    is_active: true,
  };
  const result = await run(TemplateSectionService.create(payload), {
    showSuccess: true,
  });
  if (result) {
    clauses.value.push(result.data);
    editingId.value = result.data.id;
  }
}

// ── Reset ─────────────────────────────────────────────────────────────────────
async function doReset() {
  resetting.value = true;
  const result = await run(
    TemplateSectionService.resetToDefaults(selectedTemplate.value),
    { showSuccess: true },
  );
  resetting.value = false;
  showResetConfirm.value = false;
  if (result) clauses.value = result.data;
}

// ── Template options para el SelectField ──────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  contrato: "Contratos",
  acta: "Actas",
  factura: "Facturas",
  poliza: "Pólizas",
  garantia: "Garantías",
  inventario: "Inventario",
  preaviso: "Preaviso",
  otro: "Otros",
};

const templateOptionsAsLookup = computed((): ILookup[] =>
  Object.entries(meta.value.templates).map(([key, tmpl]) => ({
    id: key,
    name: tmpl.label,
    alias: CATEGORY_LABELS[tmpl.category] ?? tmpl.category,
    category: tmpl.category,
    value: null,
    code: null,
    icon: null,
    is_active: true,
    lang: "es",
  })),
);

const selectedTemplateLabel = computed(
  () =>
    meta.value.templates[selectedTemplate.value]?.label ??
    selectedTemplate.value,
);

const selectedTemplateCategory = computed(
  () => meta.value.templates[selectedTemplate.value]?.category ?? "",
);
</script>

<template>
  <div class="page-body">
    <div class="container-fluid">
      <div class="page-header">
        <div class="row align-items-center">
          <div class="col">
            <h3 class="page-title">Constructor de Plantillas</h3>
            <p class="text-muted small mb-0">
              Diseña cada tipo de documento por secciones. Arrastra para
              reordenar y edita inline.
            </p>
          </div>
        </div>
      </div>

      <div class="card">
        <!-- ── Card header: selector + acciones ── -->
        <div
          class="card-header d-flex align-items-center flex-wrap gap-3 admin-form"
        >
          <!-- Selector de plantilla -->
          <CommonInputfieldsSelectfield
            v-model="selectedTemplate"
            :data="templateOptionsAsLookup"
            label="Tipo de documento"
            classes="tpl-select-wrap"
            show="Selecciona un tipo..."
            label-field="name"
            :searchable="true"
            :disabled="loading"
          />

          <!-- Badge categoría -->
          <span
            class="badge bg-secondary text-capitalize"
            style="font-size: 0.68rem; align-self: flex-end; margin-bottom: 2px"
          >
            {{
              CATEGORY_LABELS[selectedTemplateCategory] ??
              selectedTemplateCategory
            }}
          </span>

          <!-- Acciones — empujar a la derecha -->
          <div class="ms-auto d-flex gap-2 flex-wrap">
            <button
              type="button"
              class="btn btn-dashed color-4 btn-sm"
              :disabled="loading"
              @click="showPreview = true"
            >
              <Icon name="lucide:eye" class="me-1" />
              Vista previa
            </button>
            <button
              type="button"
              class="btn btn-dashed color-2 btn-sm"
              :disabled="loading || resetting"
              @click="showResetConfirm = true"
            >
              <Icon name="lucide:rotate-ccw" class="me-1" />
              Restaurar por defecto
            </button>
          </div>
        </div>

        <!-- ── Card body: lista de secciones ── -->
        <div class="card-body p-0">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-5">
            <Icon
              name="lucide:loader-circle"
              class="spin text-muted mb-2"
              style="width: 32px; height: 32px"
            />
            <p class="text-muted small">Cargando secciones…</p>
          </div>

          <!-- Lista -->
          <div v-else-if="clauses.length > 0">
            <draggable
              v-model="clauses"
              handle=".drag-handle"
              item-key="id"
              ghost-class="dragging-ghost"
              @end="onReorder"
            >
              <template #item="{ element: clause }">
                <ContractTemplatesSectionBlock
                  :clause="clause"
                  :is-editing="editingId === clause.id"
                  :is-saving="saving"
                  :is-deleting="deleting === clause.id"
                  :variable-groups="meta.variable_groups"
                  @start-edit="startEdit(clause.id)"
                  @save="(data) => saveSection(clause, data)"
                  @cancel="cancelEdit"
                  @toggle-active="toggleActive(clause)"
                  @delete="deleteSection(clause)"
                  @duplicate="duplicateSection(clause)"
                />
              </template>
            </draggable>
          </div>

          <!-- Vacío -->
          <div v-else class="text-center py-5 text-muted">
            <Icon
              name="lucide:layout-template"
              style="width: 40px; height: 40px; opacity: 0.4"
              class="mb-2"
            />
            <p class="mb-0">
              Sin secciones configuradas.<br />Usa el selector inferior para
              agregar la primera.
            </p>
          </div>
        </div>

        <!-- ── Card footer: agregar sección ── -->
        <div class="card-footer p-0">
          <ContractTemplatesSectionAddMenu @add="addSection" />
        </div>
      </div>

      <!-- Modal vista previa -->
      <ContractTemplatesDocumentPreview
        v-model:show="showPreview"
        :template-key="selectedTemplate"
        :template-label="selectedTemplateLabel"
      />

      <!-- Modal confirmación de reset -->
      <CommonModal
        v-model:show="showResetConfirm"
        title="Restaurar plantilla"
        size="sm"
      >
        <p class="mb-0">
          ¿Estás seguro de que deseas restaurar las secciones de
          <strong>{{ selectedTemplateLabel }}</strong>
          a los valores por defecto del sistema?
          <span class="text-danger d-block mt-1"
            >Todos los cambios personalizados se perderán.</span
          >
        </p>
        <template #actions>
          <button
            type="button"
            class="btn btn-dashed color-1"
            :disabled="resetting"
            @click="doReset"
          >
            <Icon
              v-if="resetting"
              name="lucide:loader-circle"
              class="spin me-1"
              style="width: 13px; height: 13px"
            />
            Sí, restaurar
          </button>
          <button
            type="button"
            class="btn btn-pill btn-dashed color-4"
            @click="showResetConfirm = false"
          >
            Cancelar
          </button>
        </template>
      </CommonModal>
    </div>
  </div>
</template>

<style scoped>
/* ── Template SelectField ── */
.tpl-select-wrap {
  margin-bottom: 0;
}

.tpl-select-wrap :deep(label) {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(28, 45, 58, 0.5);
  margin-bottom: 3px;
}

.tpl-select-wrap :deep(.dropdown) {
  min-width: 240px;
  max-width: 340px;
}

.tpl-select-wrap :deep(.dropdown-toggle) {
  font-size: 0.85rem;
}

/* ── Draggable ghost ── */
.dragging-ghost {
  opacity: 0.35;
  background: #e3e8ef;
}

/* ── Spin ── */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.spin {
  animation: spin 1s linear infinite;
  display: inline-block;
}

/* ── Dark mode ── */
:global(body.dark-layout) .tpl-select-wrap :deep(label) {
  color: rgba(255, 255, 255, 0.4);
}

:global(body.dark-layout) .tpl-select-wrap :deep(.dropdown-toggle) {
  background-color: #2a2a2a;
  border-color: #383434;
  color: rgba(255, 255, 255, 0.82);
}

:global(body.dark-layout) .tpl-select-wrap :deep(.dropdown-menu) {
  background-color: #2a2a2a;
  border-color: #383434;
}

:global(body.dark-layout) .tpl-select-wrap :deep(.dropdown-item) {
  color: rgba(255, 255, 255, 0.82);
}

:global(body.dark-layout) .tpl-select-wrap :deep(.dropdown-item:hover) {
  background-color: rgba(255, 255, 255, 0.06);
}

:global(body.dark-layout) .dragging-ghost {
  background: #1b1b1b;
}
</style>
