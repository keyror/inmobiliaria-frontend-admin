<template>
  <div>
    <div class="card-header ps-0 d-flex justify-content-between align-items-center">
      <h5>Cuentas Bancarias</h5>
      <button
          type="button"
          class="btn btn-pill btn-gradient color-4"
          @click="addAccount"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Cuenta
      </button>
    </div>

    <div v-if="fields.length === 0" class="alert alert-info">
      No hay cuentas bancarias registradas.
    </div>

    <div
        v-if="hasTriedSubmit && errors.accounts"
        class="alert alert-danger p-2 small"
    >
      {{ errors.accounts }}
    </div>

    <div
        v-for="(field, index) in fields"
        :key="index"
        class="card mb-3 border"
    >
      <div class="card-body">

        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Cuenta #{{ index + 1 }}</h6>
          <button
              type="button"
              class="btn btn-dashed color-4"
              :disabled="fields.length === 1"
              @click="remove(index)"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">

          <CommonInputfieldsSelectfield
              v-model="field.value.bank_id"
              classes="col-md-4 col-sm-6"
              label="Banco"
              labelField="name"
              :data="lookups.banks"
              :searchable="true"
              star="*"
              :error="getFieldError(index, 'bank_id')"
          />

          <CommonInputfieldsSelectfield
              v-model="field.value.account_type_id"
              classes="col-md-4 col-sm-6"
              label="Tipo de Cuenta"
              labelField="name"
              :data="lookups.typeAccountBank"
              star="*"
              :error="getFieldError(index, 'account_type_id')"
          />

          <CommonInputfieldsTextfield
              v-model="field.value.account_number"
              type="text"
              classes="col-md-4 col-sm-6"
              label="Número de Cuenta"
              placeholder="Ej: 1234567890"
              star="*"
              :error="getFieldError(index, 'account_number')"
          />

          <CommonInputfieldsCheckbox
              v-model="field.value.is_principal"
              :name="`accounts.${index}.is_principal`"
              classes="col-md-12"
              label="Cuenta Principal"
              @change="handlePrincipal(index)"
              :error="getFieldError(0, 'is_principal')"
          />

        </form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useFieldArray } from 'vee-validate'
import type { ILookup } from '~/interfaces/ILookup'
import type { IAccountBank } from '~/interfaces/IAccountBank'
import { useAccountBankForm } from '~/composables/forms/useAccountBankForm'

const props = defineProps<{
  data?: IAccountBank[]
  lookups: {
    banks: ILookup[]
    typeAccountBank: ILookup[]
  }
  isEditing?: boolean
}>()

const {
  validate,
  values,
  resetForm,
  errors,
  setFieldValue
} = useAccountBankForm()

const { remove, push, fields } = useFieldArray<IAccountBank>('accounts')

//evita que los errores se muestren al cargar el formulario por primera vez,
// solo después de intentar enviar el formulario
const hasTriedSubmit = ref<boolean>(false)

const getFieldError = (index: number, field: string): string => {
  if (!hasTriedSubmit.value) return ''
  const errorsMap = errors.value as Record<string, string>
  return (
      errorsMap[`accounts[${index}].${field}`] ||
      errorsMap[`accounts.${index}.${field}`] ||
      ''
  )
}

const addAccount = (): void => {
  push({
    bank_id: '',
    account_type_id: '',
    account_number: '',
    is_principal: false
  })
}

const handlePrincipal = (index: number): void => {
  if (!values.accounts) return
  values.accounts.forEach((_: IAccountBank, i: number) => {
    ;(setFieldValue as any)(`accounts[${i}].is_principal`, i === index)
  })
}

watch(() => props.data, (newData?: IAccountBank[]) => {
  hasTriedSubmit.value = false
  if (newData && newData.length > 0) {
    resetForm({
      values: {
        accounts: newData.map((acc: IAccountBank) => ({ ...acc }))
      }
    })
  } else {
    resetForm({
      values: {
        accounts: [{
          bank_id: '',
          account_type_id: '',
          account_number: '',
          is_principal: true
        }]
      }
    })
  }
}, { immediate: true })

defineExpose({
  async validateForm(): Promise<boolean> {
    hasTriedSubmit.value = true
    const result = await validate()
    return result.valid
  },
  getValues(): IAccountBank[] | undefined {
    return values.accounts
  },
  reset(): void {
    hasTriedSubmit.value = false
    resetForm()
  }
})
</script>
<style scoped>
</style>

