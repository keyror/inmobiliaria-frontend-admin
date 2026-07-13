<script setup lang="ts">
import type { TemplateSectionType } from '~/interfaces/ITemplateSection'
import type { ILookup } from '~/interfaces/ILookup'

const emit = defineEmits<{
  (e: 'add', type: TemplateSectionType): void
}>()

const SECTION_TYPE_OPTIONS: ILookup[] = [
  { id: 'clause',        name: 'Cláusula',                    category: 'section_type', alias: null, value: null, code: null, icon: null, is_active: true, lang: 'es' },
  { id: 'observation',   name: 'Observación',                 category: 'section_type', alias: null, value: null, code: null, icon: null, is_active: true, lang: 'es' },
  { id: 'party_info',    name: 'Datos de parte',              category: 'section_type', alias: null, value: null, code: null, icon: null, is_active: true, lang: 'es' },
  { id: 'property_info', name: 'Datos del inmueble',          category: 'section_type', alias: null, value: null, code: null, icon: null, is_active: true, lang: 'es' },
  { id: 'contract_info', name: 'Términos del contrato',       category: 'section_type', alias: null, value: null, code: null, icon: null, is_active: true, lang: 'es' },
  { id: 'signature',     name: 'Bloque de firmas',            category: 'section_type', alias: null, value: null, code: null, icon: null, is_active: true, lang: 'es' },
  { id: 'separator',     name: 'Separador / salto de página', category: 'section_type', alias: null, value: null, code: null, icon: null, is_active: true, lang: 'es' },
]

const selected = ref<string>('clause')

function add() {
  emit('add', selected.value as TemplateSectionType)
}
</script>

<template>
  <div class="section-add-bar admin-form">
    <CommonInputfieldsSelectfield
      v-model="selected"
      :data="SECTION_TYPE_OPTIONS"
      classes="section-add-field"
      show="Tipo de sección..."
    />
    <button type="button" class="btn btn-dashed color-4 btn-sm section-add-btn" @click="add">
      <Icon name="lucide:plus" style="width:14px;height:14px" />
      Agregar
    </button>
  </div>
</template>

<style scoped>
.section-add-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px 12px;
}

/* SelectField genera un form-group — necesitamos quitarle el margin-bottom y que ocupe el espacio */
.section-add-bar :deep(.section-add-field) {
  flex: 1;
  min-width: 0;
  margin-bottom: 0;
}

.section-add-bar :deep(.section-add-field .dropdown-toggle) {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
}

.section-add-btn {
  white-space: nowrap;
  flex-shrink: 0;
}

/* Dark mode */
:global(body.dark-layout) .section-add-bar :deep(.section-add-field .dropdown-toggle) {
  background-color: #2a2a2a;
  border-color: #383434;
  color: rgba(255, 255, 255, 0.82);
}

:global(body.dark-layout) .section-add-bar :deep(.section-add-field .dropdown-menu) {
  background-color: #2a2a2a;
  border-color: #383434;
}

:global(body.dark-layout) .section-add-bar :deep(.section-add-field .dropdown-item) {
  color: rgba(255, 255, 255, 0.82);
}

:global(body.dark-layout) .section-add-bar :deep(.section-add-field .dropdown-item:hover) {
  background-color: rgba(255, 255, 255, 0.06);
}
</style>
