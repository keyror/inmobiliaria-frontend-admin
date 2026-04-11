<template>
  <div class="card-header ps-0">
    <h5>{{ props.isEditing ? 'Editar Persona' : 'Crear Persona' }}</h5>
  </div>

  <form class="row gx-3">

    <CommonInputfieldsTextfield
        classes="col-md-6"
        v-model="first_name"
        :error="errors.first_name"
        label="Nombres"
        star="*"
    />

    <CommonInputfieldsTextfield
        classes="col-md-6"
        v-model="last_name"
        :error="errors.last_name"
        label="Apellidos"
        star="*"
    />

    <CommonInputfieldsSelectfield
        v-model="document_type_id"
        :data="lookups.documentTypes"
        label="Tipo de Documento"
        classes="col-md-6"
        :labelField="'alias'"
        star="*"
        concat
        :error="errors.document_type_id"
    />

    <CommonInputfieldsTextfield
        classes="col-md-6"
        v-model="document_number"
        :error="errors.document_number"
        label="Número"
        star="*"
    />

    <CommonInputfieldsTextfield
        v-model="dv"
        classes="col-md-6 col-sm-6"
        label="Dígito de Verificación (DV)"
        readonly
        :error="errors.dv"
    />

    <CommonInputfieldsSelectfield
        v-model="document_from_id"
        :data="lookups.cities"
        label="Lugar de Expedición"
        classes="col-md-6"
        :labelField="'name'"
        star="*"
        searchable
        :error="errors.document_from_id"
    />

    <CommonInputfieldsSelectfield
        v-model="organization_type_id"
        :data="lookups.organizationTypes"
        label="Tipo de Organización"
        classes="col-md-6"
        :labelField="'name'"
        star="*"
        :error="errors.organization_type_id"
    />

    <CommonInputfieldsTextfield
        classes="col-md-6"
        v-model="company_name"
        :error="errors.company_name"
        label="Razón Social"
    />

    <CommonInputfieldsTextfield
        classes="col-md-6"
        v-model="birth_date"
        type="date"
        label="Fecha de Nacimiento"
        star="*"
        :error="errors.birth_date"
    />

    <CommonInputfieldsSelectfield
        v-model="gender_type_id"
        :data="lookups.genders"
        label="Género"
        classes="col-md-6"
        :labelField="'name'"
        star="*"
        :error="errors.gender_type_id"
    />

  </form>
</template>
<script lang="ts" setup>
import type { ILookup } from "@/interfaces/ILookup";
import type { IPerson } from "~/interfaces/IPerson";
import { calculateDV } from "@/composables/useDV";
import { usePersonForm } from '~/composables/forms/usePersonForm'

const props = defineProps<{
  data?: IPerson,
  lookups: {
    organizationTypes: ILookup[]
    documentTypes: ILookup[]
    genders: ILookup[],
    cities: ILookup[],
  },
  isEditing?: boolean
}>()

const form = usePersonForm(props.data)

const {
  defineField,
  validate,
  values,
  resetForm,
  errors,
  setErrors,
} = form

// fields
const [first_name] = defineField('first_name')
const [last_name] = defineField('last_name')
const [document_type_id] = defineField('document_type_id')
const [document_number] = defineField('document_number')
const [dv] = defineField('dv')
const [document_from_id] = defineField('document_from_id')
const [organization_type_id] = defineField('organization_type_id')
const [company_name] = defineField('company_name')
const [birth_date] = defineField('birth_date')
const [gender_type_id] = defineField('gender_type_id')

// DV automático
watch(document_number, (nuevoValor) => {
  dv.value = nuevoValor ? calculateDV(nuevoValor) : ""
})

// cuando llega data (editar)
watch(() => props.data, (newData) => {
  if (newData) {
    resetForm({
      values: {
        ...newData,
        dv: newData.document_number
            ? calculateDV(newData.document_number)
            : ''
      }
    })
  }
}, { immediate: true })


defineExpose({
  async validateForm() {
    const result = await validate()
    return result.valid
  },
  getValues(): Partial<IPerson> {
    return values
  },
  reset() {
    resetForm()
  },
  setBackendErrors(backendErrors: Record<string, string>) {
    setErrors(backendErrors)
  }
})
</script>
<style scoped>
</style>


