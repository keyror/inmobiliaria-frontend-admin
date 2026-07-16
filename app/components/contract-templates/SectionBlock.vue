<script setup lang="ts">
import type { ITemplateSection, ITemplateSectionVariableGroup, TemplateSectionType } from '~/interfaces/ITemplateSection'

interface Props {
  clause: ITemplateSection
  isEditing: boolean
  isSaving: boolean
  isDeleting: boolean
  variableGroups: ITemplateSectionVariableGroup[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'start-edit'): void
  (e: 'save', data: { heading: string; content_json?: Record<string, any> | null; section_config?: Record<string, any> | null }): void
  (e: 'cancel'): void
  (e: 'toggle-active'): void
  (e: 'delete'): void
  (e: 'duplicate'): void
}>()

// ── Local edit state ──────────────────────────────────────────────────────────

const editHeading = ref<string>('')
const editContentJson = ref<Record<string, any> | null>(null)
const editSectionConfig = ref<Record<string, any> | null>(null)
const showMenu = ref(false)

watch(
  () => props.isEditing,
  (editing) => {
    if (editing) {
      editHeading.value = props.clause.heading ?? ''
      editContentJson.value = props.clause.content_json ?? null
      editSectionConfig.value = props.clause.section_config ? { ...props.clause.section_config } : null
    }
  },
  { immediate: true },
)

function save() {
  const sendsConfig = usesConfig.value || usesSignatureEditor.value || isSeparator.value
  emit('save', {
    heading: editHeading.value,
    content_json: usesTextEditor.value ? editContentJson.value : undefined,
    section_config: sendsConfig ? editSectionConfig.value : undefined,
  })
}

// ── Type helpers ──────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<TemplateSectionType, string> = {
  clause: 'Cláusula',
  observation: 'Observación',
  header: 'Encabezado',
  party_info: 'Datos de parte',
  property_info: 'Inmueble',
  contract_info: 'Términos',
  signature: 'Firmas',
  table: 'Tabla',
  separator: 'Separador',
}

const TYPE_ICONS: Record<TemplateSectionType, string> = {
  clause: 'lucide:file-text',
  observation: 'lucide:message-square',
  header: 'lucide:layout-template',
  party_info: 'lucide:user',
  property_info: 'lucide:building-2',
  contract_info: 'lucide:scroll-text',
  signature: 'lucide:pen-line',
  table: 'lucide:table-2',
  separator: 'lucide:minus',
}

const usesTextEditor = computed(() =>
  props.clause.section_type === 'clause' || props.clause.section_type === 'observation',
)

const usesConfig = computed(() =>
  ['party_info', 'property_info', 'contract_info'].includes(props.clause.section_type),
)

const usesSignatureEditor = computed(() => props.clause.section_type === 'signature')

const isSeparator = computed(() => props.clause.section_type === 'separator')

// ── Compact preview helpers ───────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

const compactSubtitle = computed(() => {
  const cfg = props.clause.section_config
  const type = props.clause.section_type
  if (type === 'party_info') {
    const role = cfg?.role ?? 'arrendatario'
    const fields: string[] = cfg?.fields ?? []
    const ROLE_NAMES: Record<string, string> = { arrendatario: 'Arrendatario', propietario: 'Propietario', codeudor: 'Codeudor' }
    return `${ROLE_NAMES[role] ?? role} · ${fields.length} campos`
  }
  if (type === 'property_info') {
    const fields: string[] = cfg?.fields ?? []
    return `${fields.length} campos de inmueble`
  }
  if (type === 'contract_info') {
    const fields: string[] = cfg?.fields ?? []
    return `${fields.length} campos de contrato`
  }
  if (type === 'signature') {
    const sigs = (cfg?.signatories ?? []) as any[]
    return `${sigs.length} firmante${sigs.length !== 1 ? 's' : ''}`
  }
  if (type === 'separator') {
    return cfg?.style === 'page_break' ? 'Salto de página' : 'Línea divisoria'
  }
  return stripHtml(props.clause.body ?? '')
})

// ── Separator section_config toggle ──────────────────────────────────────────

const separatorStyle = computed({
  get: () => editSectionConfig.value?.style ?? 'line',
  set: (val) => { editSectionConfig.value = { style: val } },
})
</script>

<template>
  <div class="section-block admin-form" :class="{ 'section-block--inactive': !clause.is_active }">
    <!-- ── COMPACT VIEW ── -->
    <div v-if="!isEditing" class="sb-compact d-flex align-items-start gap-2 p-3">
      <!-- Drag handle (rendered by parent draggable context) -->
      <Icon
        name="lucide:grip-vertical"
        class="drag-handle text-muted flex-shrink-0"
        style="cursor:grab;width:16px;height:16px;margin-top:3px"
      />

      <!-- Separator visual -->
      <template v-if="isSeparator">
        <div class="flex-grow-1 d-flex align-items-center gap-2 py-1">
          <Icon :name="TYPE_ICONS.separator" class="text-muted" style="width:15px;height:15px" />
          <div class="sb-sep-line" />
          <span class="section-type-chip">Separador</span>
        </div>
      </template>

      <!-- Normal sections -->
      <template v-else>
        <div class="flex-grow-1 sb-main-col">
          <div class="d-flex align-items-baseline gap-2 flex-wrap">
            <span class="fw-semibold sb-heading">{{ clause.heading || '(sin título)' }}</span>
            <span v-if="clause.section_type !== 'clause'" class="section-type-chip">
              {{ TYPE_LABELS[clause.section_type] ?? clause.section_type }}
            </span>
          </div>
          <p class="text-muted small mb-0 sb-preview">{{ compactSubtitle }}</p>
        </div>
      </template>

      <!-- Actions -->
      <div class="d-flex align-items-center gap-1 flex-shrink-0 ms-1">
        <!-- Active toggle -->
        <div class="sb-toggle" :title="clause.is_active ? 'Activa' : 'Inactiva'">
          <CommonInputfieldsCheckbox
            :model-value="clause.is_active"
            :name="`active-${clause.id}`"
            label=""
            @update:model-value="$emit('toggle-active')"
          />
        </div>
        <!-- Edit -->
        <button
          type="button"
          class="btn btn-dashed color-4 btn-sm"
          title="Editar"
          @click="$emit('start-edit')"
        >
          <Icon name="lucide:pen" style="width:13px;height:13px" />
        </button>
        <!-- Overflow menu -->
        <div class="position-relative">
          <button
            type="button"
            class="btn btn-dashed color-4 btn-sm"
            title="Más opciones"
            @click="showMenu = !showMenu"
          >
            <Icon name="lucide:more-horizontal" style="width:13px;height:13px" />
          </button>
          <div v-if="showMenu" class="sb-menu" @click.stop>
            <button type="button" class="sb-menu-item" @click="$emit('duplicate'); showMenu = false">
              <Icon name="lucide:copy" />
              Duplicar
            </button>
            <button type="button" class="sb-menu-item sb-menu-item--danger" :disabled="isDeleting" @click="$emit('delete'); showMenu = false">
              <Icon v-if="isDeleting" name="lucide:loader-circle" class="spin" />
              <Icon v-else name="lucide:trash-2" />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── EDITOR VIEW ── -->
    <div v-else class="sb-editor p-3">
      <!-- Heading (shown for non-separator types) -->
      <div v-if="!isSeparator" class="mb-3">
        <CommonInputfieldsTextfield
          v-model="editHeading"
          :label="`${TYPE_LABELS[clause.section_type]} — Título`"
          :name="`section-heading-${clause.id}`"
          :placeholder="clause.section_type === 'clause' ? 'Ej: PRIMERA — Objeto.' : 'Título de la sección'"
        />
      </div>

      <!-- Tiptap editor (clause / observation) -->
      <div v-if="usesTextEditor" class="mb-3">
        <label class="form-label fw-semibold mb-1 small">Contenido</label>
        <ContractTemplatesEditorsClauseEditor
          v-model="editContentJson"
          :variable-groups="variableGroups"
          :body-fallback="clause.body"
        />
      </div>

      <!-- Config editor (party_info / property_info / contract_info) -->
      <div v-else-if="usesConfig" class="mb-3">
        <ContractTemplatesEditorsConfigEditor
          v-model="editSectionConfig"
          :section-type="clause.section_type"
        />
      </div>

      <!-- Signature editor -->
      <div v-else-if="usesSignatureEditor" class="mb-3">
        <ContractTemplatesEditorsSignatureEditor v-model="editSectionConfig" />
      </div>

      <!-- Separator config -->
      <div v-else-if="isSeparator" class="mb-3">
        <label class="form-label fw-semibold mb-1 small">Tipo de separador</label>
        <div class="d-flex gap-2">
          <button
            type="button"
            class="cfg-role-btn"
            :class="{ active: separatorStyle === 'line' }"
            @click="separatorStyle = 'line'"
          >
            <Icon name="lucide:minus" class="me-1" /> Línea divisoria
          </button>
          <button
            type="button"
            class="cfg-role-btn"
            :class="{ active: separatorStyle === 'page_break' }"
            @click="separatorStyle = 'page_break'"
          >
            <Icon name="lucide:arrow-down-to-line" class="me-1" /> Salto de página
          </button>
        </div>
      </div>

      <!-- Save / Cancel -->
      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-pill btn-gradient color-4 btn-sm"
          :disabled="isSaving"
          @click="save"
        >
          <Icon v-if="isSaving" name="lucide:loader-circle" class="spin me-1" style="width:13px;height:13px" />
          Guardar
        </button>
        <button type="button" class="btn btn-pill btn-dashed color-4 btn-sm" @click="$emit('cancel')">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-block {
  --sb-accent: var(--theme-default7);
  --sb-accent-03: color-mix(in srgb, var(--theme-default7) 3%, transparent);
  --sb-accent-10: color-mix(in srgb, var(--theme-default7) 10%, transparent);
  --sb-accent-15: color-mix(in srgb, var(--theme-default7) 15%, transparent);

  border-bottom: 1px solid rgba(88, 97, 103, 0.1);
  transition: background 0.12s;
}

.section-block:last-child { border-bottom: none; }
.section-block:hover { background: rgba(88, 97, 103, 0.03); }
.section-block--inactive { opacity: 0.5; }

.sb-main-col {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.sb-heading {
  font-size: 0.875rem;
  line-height: 1.4;
}

.sb-preview {
  font-size: 0.78rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sb-sep-line {
  flex: 1;
  height: 1px;
  background: rgba(88, 97, 103, 0.2);
  border-radius: 2px;
}

.section-type-chip {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 20px;
  background: var(--sb-accent-10);
  color: var(--sb-accent);
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Overflow menu ── */
.sb-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background: #fff;
  border: 1px solid rgba(88, 97, 103, 0.15);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  min-width: 140px;
  z-index: 100;
  overflow: hidden;
}

.sb-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 14px;
  border: none;
  background: transparent;
  font-size: 0.84rem;
  color: #1c2d3a;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
}

.sb-menu-item:hover { background: rgba(88, 97, 103, 0.07); }
.sb-menu-item--danger { color: #b83a2d; }
.sb-menu-item--danger:hover { background: rgba(184, 58, 45, 0.07); }
.sb-menu-item:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Editor expanded ── */
.sb-editor {
  background: var(--sb-accent-03);
  border-left: 3px solid var(--sb-accent);
}

/* Separator cfg button */
.cfg-role-btn {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.82rem;
  border: 1px solid rgba(88, 97, 103, 0.25);
  background: transparent;
  color: #586167;
  cursor: pointer;
  transition: all 0.12s;
}

.cfg-role-btn.active {
  background: var(--sb-accent-10);
  border-color: var(--sb-accent);
  color: var(--sb-accent);
  font-weight: 600;
}

/* ── Spin animation ── */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.spin { animation: spin 1s linear infinite; display: inline-block; }

/* ── Active toggle ── */
.sb-toggle :deep(.form-group) { margin-bottom: 0; }
.sb-toggle :deep(.common-checkbox-text) { display: none; }
.sb-toggle :deep(.common-checkbox-label) { padding: 0.2rem; min-height: unset; }

/* ── Dark mode ── */
:global(body.dark-layout) .section-block:hover { background: rgba(255,255,255,0.025); }
:global(body.dark-layout) .section-type-chip { background: color-mix(in srgb, var(--theme-default7) 13%, transparent); color: color-mix(in srgb, var(--theme-default7) 60%, #fff); }
:global(body.dark-layout) .sb-sep-line { background: #383434; }
:global(body.dark-layout) .sb-editor { background: color-mix(in srgb, var(--theme-default7) 4%, transparent); border-left-color: color-mix(in srgb, var(--theme-default7) 60%, #fff); }
:global(body.dark-layout) .sb-menu { background: #232323; border-color: #383434; box-shadow: 0 4px 16px rgba(0,0,0,0.35); }
:global(body.dark-layout) .sb-menu-item { color: rgba(255,255,255,0.88); }
:global(body.dark-layout) .sb-menu-item:hover { background: rgba(255,255,255,0.06); }
:global(body.dark-layout) .sb-menu-item--danger { color: #e06050; }
:global(body.dark-layout) .cfg-role-btn { border-color: #383434; color: rgba(255,255,255,0.6); }
:global(body.dark-layout) .cfg-role-btn.active { background: color-mix(in srgb, var(--theme-default7) 15%, transparent); border-color: color-mix(in srgb, var(--theme-default7) 60%, #fff); color: color-mix(in srgb, var(--theme-default7) 60%, #fff); }
</style>
