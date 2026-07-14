<template>
  <CommonModal
    v-model:show="showModel"
    title="Configurar columnas"
    size="xl"
    @close="emit('close')"
  >
    <div class="admin-form reports-col-builder">
      <div class="builder-grid">
        <!-- Panel izquierdo: variables disponibles -->
        <div class="var-panel">
          <div class="var-panel-header">
            <span class="var-panel-title">Variables disponibles</span>
          </div>

          <div class="var-groups">
            <div v-for="group in variables" :key="group.key" class="var-group">
              <div class="var-group-label">{{ group.label }}</div>
              <div class="var-items-list">
                <div v-for="v in group.variables" :key="v.key" class="var-item">
                  <CommonInputfieldsCheckbox
                    :modelValue="isAdded(v.key)"
                    :label="v.label"
                    :name="'col-' + v.key"
                    @update:modelValue="(val) => toggleColumn(val, v)"
                  />
                  <code class="var-key-hint">{{ v.key }}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel derecho: columnas seleccionadas -->
        <div class="sel-panel">
          <div class="sel-panel-header">
            <span class="sel-panel-title">
              Columnas del informe
              <span class="col-count">{{ localColumns.length }}</span>
            </span>
            <span class="sel-panel-hint">El encabezado es editable</span>
          </div>

          <div class="sel-empty" v-if="localColumns.length === 0">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            <p>Selecciona variables desde la izquierda</p>
          </div>

          <draggable
            v-else
            v-model="localColumns"
            class="sel-list"
            handle=".drag-handle"
            item-key="key"
            ghost-class="sel-row--ghost"
          >
            <template #item="{ element: col, index: idx }">
              <div class="sel-row">
                <Icon
                  name="lucide:grip-vertical"
                  class="drag-handle"
                  style="width:15px;height:15px;cursor:grab;color:#94a3b8;flex-shrink:0"
                />
                <span class="sel-num">{{ idx + 1 }}</span>
                <div class="sel-main">
                  <input
                    v-model="col.label"
                    type="text"
                    class="sel-label-input"
                    placeholder="Encabezado de columna"
                  />
                  <code class="sel-key">{{ col.key }}</code>
                </div>
                <button type="button" class="remove-btn" @click="removeColumn(idx)" title="Quitar">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </template>
          </draggable>
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
  if (checked) {
    addColumn(v);
  } else {
    const idx = localColumns.value.findIndex((c) => c.key === v.key);
    if (idx !== -1) localColumns.value.splice(idx, 1);
  }
}

function addColumn(v: { key: string; label: string }) {
  if (!isAdded(v.key)) localColumns.value.push({ key: v.key, label: v.label });
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
  gap: 0;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  min-height: 400px;
}
:global(body.dark-layout) .builder-grid { border-color: #2d3f55; }

/* ── Left panel ── */
.var-panel { border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; overflow: hidden; }
:global(body.dark-layout) .var-panel { border-right-color: #2d3f55; }

.var-panel-header {
  padding: 10px 14px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}
:global(body.dark-layout) .var-panel-header { background: #162032; border-bottom-color: #2d3f55; }
.var-panel-title { font-weight: 600; font-size: 12.5px; color: #0f172a; }
:global(body.dark-layout) .var-panel-title { color: #f1f5f9; }

.var-groups { overflow-y: auto; flex: 1; }
.var-group { border-bottom: 1px solid #f1f5f9; }
:global(body.dark-layout) .var-group { border-bottom-color: #1e293b; }

.var-group-label {
  padding: 7px 14px;
  background: #f8fafc;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: #94a3b8;
}
:global(body.dark-layout) .var-group-label { background: #1e293b; }

.var-items-list { padding: 4px 8px 6px; }

.var-item { margin-bottom: 1px; }

.var-key-hint {
  font-size: 10px;
  color: #94a3b8;
  font-family: ui-monospace, monospace;
  padding-left: 42px;
  display: block;
  margin-top: -6px;
  margin-bottom: 3px;
  line-height: 1.4;
}

/* ── Right panel ── */
.sel-panel { display: flex; flex-direction: column; overflow: hidden; }
.sel-panel-header {
  padding: 10px 14px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:global(body.dark-layout) .sel-panel-header { background: #162032; border-bottom-color: #2d3f55; }
.sel-panel-title { font-weight: 600; font-size: 12.5px; color: #0f172a; display: flex; align-items: center; gap: 8px; }
:global(body.dark-layout) .sel-panel-title { color: #f1f5f9; }
.col-count {
  font-size: 11px; font-weight: 600;
  background: #e2e8f0; color: #475569;
  border-radius: 10px; padding: 1px 7px;
}
:global(body.dark-layout) .col-count { background: #2d3f55; color: #94a3b8; }
.sel-panel-hint { font-size: 11px; color: #94a3b8; }

.sel-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  color: #94a3b8; gap: 8px; text-align: center; padding: 40px 20px;
}
.sel-empty p { font-size: 13px; }

.sel-list { overflow-y: auto; flex: 1; padding: 8px 10px; display: flex; flex-direction: column; gap: 5px; }
.sel-row {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  transition: border-color .1s;
}
.sel-row:hover { border-color: #cbd5e1; }
:global(body.dark-layout) .sel-row { background: #162032; border-color: #2d3f55; }
:global(body.dark-layout) .sel-row:hover { border-color: #3a506b; }
.sel-num { font-size: 11px; font-weight: 700; color: #94a3b8; width: 16px; text-align: right; flex-shrink: 0; font-variant-numeric: tabular-nums; }
.sel-main { flex: 1; min-width: 0; }
.sel-label-input {
  width: 100%; font-size: 13px; font-weight: 500;
  background: transparent; border: none; outline: none;
  color: #0f172a; padding: 0;
}
:global(body.dark-layout) .sel-label-input { color: #f1f5f9; }
.sel-label-input::placeholder { color: #94a3b8; }
.sel-key { font-size: 10.5px; color: #94a3b8; font-family: ui-monospace, monospace; }
.sel-row--ghost {
  opacity: 0.4;
  background: #e8f4ff !important;
  border-color: #93c5fd !important;
}
:global(body.dark-layout) .sel-row--ghost { background: #1e3a5f !important; border-color: #3b82f6 !important; }
.drag-handle:active { cursor: grabbing; }
.remove-btn {
  background: none; border: none; color: #94a3b8; cursor: pointer;
  padding: 3px; border-radius: 4px; display: flex; align-items: center;
  transition: color .1s, background .1s;
}
.remove-btn:hover { color: #ef4444; background: #fee2e2; }
:global(body.dark-layout) .remove-btn:hover { background: #2d1515; color: #f87171; }

@media (max-width: 640px) {
  .builder-grid { grid-template-columns: 1fr; }
  .var-panel { border-right: none; border-bottom: 1px solid #e2e8f0; max-height: 280px; }
  :global(body.dark-layout) .var-panel { border-bottom-color: #2d3f55; }
}
</style>
