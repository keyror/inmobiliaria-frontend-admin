<template>
  <CommonModal
    v-model:show="showModel"
    title="Configurar columnas"
    size="xl"
    @close="emit('close')"
  >
    <div class="reports-col-builder">
      <div class="builder-grid">

        <!-- ── Panel izquierdo: variables disponibles ── -->
        <div class="var-panel">
          <table class="table table-sm mb-0">
            <thead>
              <tr>
                <th class="ps-3">Variables disponibles</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="group in variables" :key="group.key">
                <tr>
                  <td class="group-label px-3">{{ group.label }}</td>
                </tr>
                <tr v-for="v in group.variables" :key="v.key">
                  <td class="p-0">
                    <CommonInputfieldsCheckbox
                      :modelValue="isAdded(v.key)"
                      :label="v.label"
                      :name="'col-' + v.key"
                      @update:modelValue="(val) => toggleColumn(val, v)"
                    />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- ── Panel derecho: columnas seleccionadas ── -->
        <div class="sel-panel">
          <table class="table table-sm mb-0" :class="{ 'table-hover': localColumns.length > 0 }">
            <thead>
              <tr>
                <th style="width: 28px"></th>
                <th style="width: 24px" class="text-center text-muted fw-normal">#</th>
                <th>
                  Columnas del informe
                  <span v-if="localColumns.length" class="col-count ms-1">{{ localColumns.length }}</span>
                </th>
                <th style="width: 40px"></th>
              </tr>
            </thead>

            <tbody v-if="localColumns.length === 0">
              <tr>
                <td colspan="4" class="sel-empty">
                  <Icon name="lucide:layout-list" style="width: 28px; height: 28px; opacity: 0.3" />
                  <p class="mb-0 mt-2">Selecciona variables desde la izquierda</p>
                </td>
              </tr>
            </tbody>

            <draggable
              v-else
              v-model="localColumns"
              tag="tbody"
              handle=".drag-handle"
              item-key="key"
              ghost-class="sel-row--ghost"
            >
              <template #item="{ element: col, index: idx }">
                <tr>
                  <td class="drag-cell">
                    <Icon
                      name="lucide:grip-vertical"
                      class="drag-handle text-muted"
                      style="width: 15px; height: 15px; cursor: grab; display: block"
                    />
                  </td>
                  <td class="sel-num text-center text-muted">{{ idx + 1 }}</td>
                  <td>
                    <input
                      v-model="col.label"
                      type="text"
                      class="sel-label-input"
                      placeholder="Encabezado de columna"
                    />
                  </td>
                  <td class="text-end pe-2">
                    <button
                      type="button"
                      class="btn btn-dashed color-4 btn-sm"
                      title="Quitar"
                      @click="removeColumn(idx)"
                    >
                      <Icon name="lucide:x" style="width: 13px; height: 13px" />
                    </button>
                  </td>
                </tr>
              </template>
            </draggable>
          </table>
        </div>

      </div>
    </div>

    <template #actions>
      <button
        class="btn btn-pill btn-gradient color-4"
        type="button"
        :disabled="localColumns.length === 0 || saving"
        @click="save"
      >
        {{ saving ? "Guardando..." : "Guardar configuración" }}
      </button>
    </template>
  </CommonModal>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import type { IReportColumn, IReportTemplate, IReportVariableGroup } from "~/interfaces/IReportTemplate";
import ReportService from "~/services/ReportService";
import { useApiHandler } from "~/composables/useApiHandler";

interface Props {
  show: boolean;
  template: IReportTemplate;
  variables: IReportVariableGroup[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved", columns: IReportColumn[]): void;
}>();

const { run } = useApiHandler();
const saving = ref(false);

const showModel = computed({
  get: () => props.show,
  set: (v) => { if (!v) emit("close"); },
});

const localColumns = ref<IReportColumn[]>([]);

watch(
  () => props.show,
  (open) => {
    if (open) localColumns.value = props.template.columns.map((c) => ({ ...c }));
  },
  { immediate: true },
);

const isAdded = (key: string) => localColumns.value.some((c) => c.key === key);

function toggleColumn(checked: boolean, v: { key: string; label: string }) {
  if (checked && !isAdded(v.key)) {
    localColumns.value.push({ key: v.key, label: v.label });
  } else if (!checked) {
    const idx = localColumns.value.findIndex((c) => c.key === v.key);
    if (idx !== -1) localColumns.value.splice(idx, 1);
  }
}

function removeColumn(idx: number) {
  localColumns.value.splice(idx, 1);
}

async function save() {
  saving.value = true;
  const resp = await run(
    ReportService.updateTemplate(props.template.id, {
      name: props.template.name,
      columns: localColumns.value,
    }),
    { showSuccess: true, successMessage: "Columnas actualizadas" },
  );
  saving.value = false;
  if (resp) emit("saved", localColumns.value);
}
</script>

<style scoped>
.reports-col-builder { min-height: 420px; }

.builder-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--bs-border-color);
  border-radius: 8px;
  overflow: hidden;
  min-height: 400px;
}

/* ── Left panel ── */
.var-panel {
  border-right: 1px solid var(--bs-border-color);
  overflow-y: auto;
}

.group-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--bs-secondary-color);
  background-color: var(--bs-tertiary-bg) !important;
  pointer-events: none;
}

/* Hacer que el checkbox del sistema ocupe toda la celda */
.var-panel :deep(.form-group) { margin-bottom: 0; }
.var-panel :deep(.common-checkbox-wrapper) { margin: 0; }
.var-panel :deep(.common-checkbox-label) {
  width: 100%;
  padding: 6px 14px;
  border-radius: 0;
  font-size: 13px;
  min-height: 34px;
}

/* ── Right panel ── */
.sel-panel { overflow-y: auto; }

.col-count {
  font-size: 11px;
  font-weight: 600;
  background: var(--bs-secondary-bg);
  color: var(--bs-secondary-color);
  border-radius: 10px;
  padding: 1px 7px;
}

.sel-empty {
  text-align: center;
  padding: 50px 20px !important;
  color: var(--bs-secondary-color);
  font-size: 13px;
}

.drag-cell { width: 28px; vertical-align: middle; padding-left: 12px !important; }
.sel-num { font-size: 11px; font-variant-numeric: tabular-nums; vertical-align: middle; }

.sel-label-input {
  width: 100%;
  font-size: 13px;
  font-weight: 500;
  background: transparent;
  border: none;
  outline: none;
  color: var(--bs-body-color);
  padding: 0;
}
.sel-label-input::placeholder { color: var(--bs-secondary-color); }

.sel-row--ghost { opacity: 0.4; background-color: var(--bs-primary-bg-subtle) !important; }

.drag-handle:active { cursor: grabbing; }

@media (max-width: 640px) {
  .builder-grid { grid-template-columns: 1fr; }
  .var-panel { border-right: none; border-bottom: 1px solid var(--bs-border-color); max-height: 280px; }
}
</style>
