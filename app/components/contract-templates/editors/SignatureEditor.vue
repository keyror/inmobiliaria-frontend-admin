<script setup lang="ts">
import type { ILookup } from '~/interfaces/ILookup'
import type { SignatureConfig, SignatoryConfig } from '~/interfaces/ITemplateSection'

interface Props {
  modelValue: Record<string, any> | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: Record<string, any>): void
}>()

const ROLE_OPTIONS: ILookup[] = [
  { id: 'arrendador', name: 'Arrendador (Inmobiliaria)', category: '', alias: null, value: null, code: null, icon: null, is_active: true, lang: 'es' },
  { id: 'arrendatario', name: 'Arrendatario / Inquilino', category: '', alias: null, value: null, code: null, icon: null, is_active: true, lang: 'es' },
  { id: 'codeudor', name: 'Codeudor', category: '', alias: null, value: null, code: null, icon: null, is_active: true, lang: 'es' },
  { id: 'propietario', name: 'Propietario del inmueble', category: '', alias: null, value: null, code: null, icon: null, is_active: true, lang: 'es' },
  { id: 'custom', name: 'Personalizado', category: '', alias: null, value: null, code: null, icon: null, is_active: true, lang: 'es' },
]

const DEFAULT_SIGNATORIES: SignatoryConfig[] = [
  { role: 'arrendador', label: 'EL ARRENDADOR', side: 'left' },
  { role: 'arrendatario', label: 'EL ARRENDATARIO', side: 'right' },
]

const signatories = computed<SignatoryConfig[]>({
  get: () => (props.modelValue as SignatureConfig)?.signatories ?? DEFAULT_SIGNATORIES,
  set: (val) => emit('update:modelValue', { signatories: val }),
})

function updateSignatory(idx: number, patch: Partial<SignatoryConfig>) {
  const updated = signatories.value.map((s, i) => (i === idx ? { ...s, ...patch } : s))
  emit('update:modelValue', { signatories: updated })
}

function addSignatory() {
  emit('update:modelValue', {
    signatories: [...signatories.value, { role: 'custom', label: 'FIRMANTE', side: 'left' as const }],
  })
}

function removeSignatory(idx: number) {
  emit('update:modelValue', {
    signatories: signatories.value.filter((_, i) => i !== idx),
  })
}
</script>

<template>
  <div class="sig-editor admin-form">
    <p class="sig-hint">
      Configura quiénes firman el documento y su posición en la página.
    </p>

    <div class="sig-list">
      <div v-for="(sig, idx) in signatories" :key="idx" class="sig-row">
        <div class="sig-row-main">
          <div class="sig-field">
            <CommonInputfieldsSelectfield
              :model-value="sig.role"
              :data="ROLE_OPTIONS"
              label="Rol"
              label-field="name"
              show="Selecciona..."
              @update:model-value="(val: string) => updateSignatory(idx, { role: val as any })"
            />
          </div>
          <div class="sig-field sig-field--label">
            <CommonInputfieldsTextfield
              :model-value="sig.label"
              :name="`sig-label-${idx}`"
              label="Etiqueta en el documento"
              placeholder="EL ARRENDATARIO"
              @update:model-value="(val: string) => updateSignatory(idx, { label: val })"
            />
          </div>
          <div class="sig-field sig-field--side">
            <label class="sig-field-label">Posición</label>
            <div class="sig-side-btns">
              <button
                type="button"
                class="sig-side-btn"
                :class="{ active: sig.side === 'left' }"
                @click="updateSignatory(idx, { side: 'left' })"
              >
                <Icon name="lucide:align-left" /> Izquierda
              </button>
              <button
                type="button"
                class="sig-side-btn"
                :class="{ active: sig.side === 'right' }"
                @click="updateSignatory(idx, { side: 'right' })"
              >
                <Icon name="lucide:align-right" /> Derecha
              </button>
            </div>
          </div>
          <button
            type="button"
            class="sig-remove-btn"
            title="Eliminar firmante"
            :disabled="signatories.length <= 1"
            @click="removeSignatory(idx)"
          >
            <Icon name="lucide:x" />
          </button>
        </div>
      </div>
    </div>

    <button type="button" class="btn btn-dashed color-4 btn-sm mt-2" @click="addSignatory">
      <Icon name="lucide:user-plus" class="me-1" />
      Agregar firmante
    </button>
  </div>
</template>

<style scoped>
.sig-editor {
  --sig-accent: var(--theme-default7);
  --sig-accent-10: color-mix(in srgb, var(--theme-default7) 10%, transparent);

  padding: 0.5rem 0;
}

.sig-hint {
  font-size: 0.82rem;
  color: #586167;
  margin-bottom: 0.75rem;
}

.sig-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.sig-row {
  background: rgba(88, 97, 103, 0.05);
  border: 1px solid rgba(88, 97, 103, 0.15);
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
}

.sig-row-main {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: flex-end;
}

.sig-field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 130px;
}

.sig-field--label { flex: 1; min-width: 160px; }
.sig-field--side { min-width: 180px; }

.sig-field-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #586167;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Remove bottom margin from common inputs inside rows */
.sig-field :deep(.form-group) { margin-bottom: 0; }
.sig-field :deep(label) { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

.sig-side-btns {
  display: flex;
  gap: 4px;
}

.sig-side-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  border: 1px solid rgba(88, 97, 103, 0.25);
  background: transparent;
  color: #586167;
  cursor: pointer;
  transition: all 0.12s;
}

.sig-side-btn.active {
  background: var(--sig-accent-10);
  border-color: var(--sig-accent);
  color: var(--sig-accent);
  font-weight: 600;
}

.sig-remove-btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(184, 58, 45, 0.3);
  border-radius: 6px;
  background: transparent;
  color: #b83a2d;
  cursor: pointer;
  flex-shrink: 0;
  align-self: flex-end;
  transition: background 0.12s;
}

.sig-remove-btn:hover:not(:disabled) { background: rgba(184, 58, 45, 0.08); }
.sig-remove-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* ── Dark mode ── */
:global(body.dark-layout) .sig-row { background: rgba(255,255,255,0.04); border-color: #383434; }
:global(body.dark-layout) .sig-hint { color: rgba(255,255,255,0.55); }
:global(body.dark-layout) .sig-field-label { color: rgba(255,255,255,0.55); }
:global(body.dark-layout) .sig-side-btn { border-color: #383434; color: rgba(255,255,255,0.6); }
:global(body.dark-layout) .sig-side-btn.active {
  background: color-mix(in srgb, var(--theme-default7) 15%, transparent);
  border-color: color-mix(in srgb, var(--theme-default7) 60%, #fff);
  color: color-mix(in srgb, var(--theme-default7) 60%, #fff);
}
</style>
