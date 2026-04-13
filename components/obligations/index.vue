<template>
  <div>
    <div class="card-header ps-0 d-flex justify-content-between align-items-center">
      <h5>Obligaciones</h5>
      <button
          type="button"
          class="btn btn-pill btn-gradient color-4"
          @click="addItem"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Obligación
      </button>
    </div>

    <div v-if="fields.length === 0" class="alert alert-info">
      No hay obligaciones registradas.
    </div>

    <!-- error general -->
    <div
        v-if="hasTriedSubmit && errors.obligations"
        class="alert alert-danger p-2 small"
    >
      {{ errors.obligations }}
    </div>

    <div
        v-for="(field, index) in fields"
        :key="field.key"
        class="card mb-3 border"
    >
      <div class="card-body">

        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Obligación #{{ index + 1 }}</h6>

          <button
              type="button"
              class="btn btn-dashed color-4"
              :disabled="fields.length === 1"
              @click="removeItem(index)"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">

          <CommonInputfieldsSelectfield
              v-model="field.value.obligation_type_id"
              classes="col-md-4"
              label="Tipo de Obligación"
              :data="lookups.obligationTypes"
              labelField="name"
              star="*"
              :error="getFieldError(index, 'obligation_type_id')"
          />

          <CommonInputfieldsTextfield
              v-model="field.value.amount"
              classes="col-md-4"
              label="Monto"
              star="*"
              :error="getFieldError(index, 'amount')"
          />

          <CommonInputfieldsTextfield
              v-model="field.value.total"
              classes="col-md-4"
              label="Total"
              star="*"
              :error="getFieldError(index, 'total')"
          />

          <CommonInputfieldsSelectfield
              v-model="field.value.frequency_type_id"
              classes="col-md-4"
              label="Frecuencia"
              :data="lookups.frequency"
              labelField="name"
              star="*"
              :error="getFieldError(index, 'frequency_type_id')"
          />

          <CommonInputfieldsTextfield
              v-model="field.value.expiration_date"
              classes="col-md-4"
              label="Fecha de Vencimiento"
              type="date"
              :error="getFieldError(index, 'expiration_date')"
          />

          <CommonInputfieldsSelectfield
              v-model="field.value.status_id"
              classes="col-md-4"
              label="Activa"
              :data="lookups.status"
              labelField="name"
              star="*"
              :error="getFieldError(index, 'status_id')"
          />

          <CommonInputfieldsTextarea
              v-model="field.value.description"
              classes="col-md-12"
              label="Descripción"
              :error="getFieldError(index, 'description')"
          />

        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFieldArray } from 'vee-validate'
import type { IPropertyObligation } from "~/interfaces/IPropertyObligation";
import { useObligationForm } from '~/composables/forms/useObligationForm'

const props = defineProps<{
  data?: IPropertyObligation[];
  lookups: {
    obligationTypes: any[];
    frequency: any[];
    status: any[];
  };
  isEditing?: boolean
}>()

const {
  validate,
  values,
  resetForm,
  errors,
  setErrors,
} = useObligationForm()

const { remove, push, fields } = useFieldArray<IPropertyObligation>('obligations')

const hasTriedSubmit = ref(false)

const getFieldError = (index: number, field: string): string => {
  if (!hasTriedSubmit.value) return ''
  const errorsMap = errors.value as Record<string, string>

  return (
      errorsMap[`obligations[${index}].${field}`] ||
      errorsMap[`obligations.${index}.${field}`] ||
      ''
  )
}

const emptyItem = (): IPropertyObligation => ({
  obligation_type_id: '',
  amount: '',
  total: '',
  frequency_type_id: '',
  expiration_date: '',
  status_id: '',
  description: ''
})

watch(() => props.data, (val) => {
  hasTriedSubmit.value = false

  if (val && val.length > 0) {
    resetForm({
      values: {
        obligations: val.map(i => ({
          obligation_type_id: i.obligation_type_id ?? '',
          amount: i.amount ?? '',
          total: i.total ?? '',
          frequency_type_id: i.frequency_type_id ?? '',
          expiration_date: i.expiration_date ?? '',
          status_id: i.status_id ?? '',
          description: i.description ?? '',
        }))
      }
    })
  } else {
    resetForm({
      values: {
        obligations: [{ ...emptyItem() }]
      }
    })
  }
}, { immediate: true })

const addItem = () => push(emptyItem())

const removeItem = (index: number) => {
  if (fields.value.length > 1) {
    remove(index)
  }
}

defineExpose({
  async validateForm() {
    hasTriedSubmit.value = true
    const result = await validate()
    return result.valid
  },

  getValues(): IPropertyObligation[] | undefined {
    return values.obligations as IPropertyObligation[]
  },

  reset() {
    hasTriedSubmit.value = false
    resetForm()
  },

  setBackendErrors(backendErrors: Record<string, string>) {
    hasTriedSubmit.value = true
    setErrors(backendErrors)
  }
})
</script>
