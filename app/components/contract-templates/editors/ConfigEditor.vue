<script setup lang="ts">
import type { TemplateSectionType, PartyInfoConfig } from '~/interfaces/ITemplateSection'

interface Props {
  modelValue: Record<string, any> | null
  sectionType: TemplateSectionType
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: Record<string, any>): void
}>()

// ── Field catalogs ───────────────────────────────────────────────────────────

const PARTY_ROLES = [
  { value: 'arrendatario', label: 'Arrendatario / Inquilino' },
  { value: 'propietario', label: 'Propietario' },
  { value: 'codeudor', label: 'Codeudor / Coarrendatario' },
]

const PARTY_FIELDS: Record<string, string> = {
  name: 'Nombre completo',
  document: 'Tipo y número de documento',
  phone: 'Teléfono',
  email: 'Correo electrónico',
  address: 'Dirección de residencia',
}

const PROPERTY_FIELDS: Record<string, string> = {
  address: 'Dirección del inmueble',
  city: 'Municipio / Ciudad',
  neighborhood: 'Barrio',
  registration: 'Matrícula inmobiliaria',
  type: 'Tipo de inmueble',
  area: 'Área (m²)',
  stratum: 'Estrato',
  floor: 'Piso / Apartamento',
}

const CONTRACT_FIELDS: Record<string, string> = {
  canon: 'Canon mensual',
  start_date: 'Fecha de inicio',
  end_date: 'Fecha de terminación',
  duration_months: 'Duración en meses',
  increment_type: 'Tipo de incremento',
  adjustment_date: 'Fecha de reajuste',
  admin_included: 'Administración incluida',
  iva: 'IVA (contratos comerciales)',
  deposit: 'Depósito de garantía',
  destination: 'Destinación del inmueble',
}

// ── Computed config ──────────────────────────────────────────────────────────

const config = computed<Record<string, any>>(() => props.modelValue ?? defaultConfig())

function defaultConfig(): Record<string, any> {
  if (props.sectionType === 'party_info') {
    return { role: 'arrendatario', fields: Object.keys(PARTY_FIELDS) }
  }
  if (props.sectionType === 'property_info') {
    return { fields: Object.keys(PROPERTY_FIELDS) }
  }
  return { fields: Object.keys(CONTRACT_FIELDS) }
}

const selectedRole = computed({
  get: () => (config.value as PartyInfoConfig).role ?? 'arrendatario',
  set: (val) => emit('update:modelValue', { ...config.value, role: val }),
})

const fieldsForType = computed<Record<string, string>>(() => {
  if (props.sectionType === 'party_info') return PARTY_FIELDS
  if (props.sectionType === 'property_info') return PROPERTY_FIELDS
  return CONTRACT_FIELDS
})

function isFieldEnabled(fieldKey: string): boolean {
  return (config.value.fields ?? []).includes(fieldKey)
}

function setField(fieldKey: string, enabled: boolean) {
  const current: string[] = config.value.fields ?? []
  const next = enabled
    ? [...current.filter(f => f !== fieldKey), fieldKey]
    : current.filter(f => f !== fieldKey)
  emit('update:modelValue', { ...config.value, fields: next })
}
</script>

<template>
  <div class="config-editor admin-form">
    <!-- Role selector for party_info -->
    <div v-if="sectionType === 'party_info'" class="cfg-row">
      <label class="cfg-label">Tipo de parte</label>
      <div class="cfg-role-btns">
        <button
          v-for="r in PARTY_ROLES"
          :key="r.value"
          type="button"
          class="cfg-role-btn"
          :class="{ active: selectedRole === r.value }"
          @click="selectedRole = r.value as any"
        >
          {{ r.label }}
        </button>
      </div>
    </div>

    <!-- Field toggles -->
    <div class="cfg-row">
      <label class="cfg-label">Campos a mostrar</label>
      <div class="cfg-fields">
        <CommonInputfieldsCheckbox
          v-for="(label, key) in fieldsForType"
          :key="key"
          :model-value="isFieldEnabled(key)"
          :name="`cfg-field-${key}`"
          :label="label"
          @update:model-value="(val: boolean) => setField(key, val)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-editor {
  --cfg-accent: var(--theme-default7);
  --cfg-accent-10: color-mix(in srgb, var(--theme-default7) 10%, transparent);

  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.75rem 0;
}

.cfg-row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.cfg-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #586167;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cfg-role-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cfg-role-btn {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.82rem;
  border: 1px solid rgba(88, 97, 103, 0.25);
  background: transparent;
  color: #586167;
  cursor: pointer;
  transition: all 0.12s;
}

.cfg-role-btn.active {
  background: var(--cfg-accent-10);
  border-color: var(--cfg-accent);
  color: var(--cfg-accent);
  font-weight: 600;
}

.cfg-fields {
  display: flex;
  flex-direction: column;
}

.cfg-fields :deep(.form-group) {
  margin-bottom: 0;
  padding: 2px 0;
}

/* ── Dark mode ── */
:global(body.dark-layout) .cfg-label { color: rgba(255,255,255,0.55); }
:global(body.dark-layout) .cfg-role-btn { border-color: #383434; color: rgba(255,255,255,0.6); }
:global(body.dark-layout) .cfg-role-btn.active {
  background: color-mix(in srgb, var(--theme-default7) 15%, transparent);
  border-color: color-mix(in srgb, var(--theme-default7) 60%, #fff);
  color: color-mix(in srgb, var(--theme-default7) 60%, #fff);
}
</style>
