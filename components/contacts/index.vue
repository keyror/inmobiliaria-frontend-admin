<script lang="ts" setup>
import { useFieldArray } from 'vee-validate'
import type { IContact } from '~/interfaces/IContact'
import { useContactForm } from '~/composables/forms/useContactForm'

const props = defineProps<{
  data?: IContact[]
  single?: boolean
  isEditing?: boolean
}>()

const {
  validate,
  values,
  resetForm,
  errors,
  setFieldValue,
  setErrors,
} = useContactForm()

const { remove, push, fields } = useFieldArray<IContact>('contacts')

const hasTriedSubmit = ref<boolean>(false)

const getFieldError = (index: number, field: string): string => {
  if (!hasTriedSubmit.value) return ''
  const errorsMap = errors.value as Record<string, string>
  return (
      errorsMap[`contacts[${index}].${field}`] ||
      errorsMap[`contacts.${index}.${field}`] ||
      ''
  )
}

const emptyContact: IContact = {
  phone: '',
  mobile: '',
  email: '',
  is_principal: false
}

const addContact = (): void => {
  push({ ...emptyContact })
}

const handlePrincipal = (index: number): void => {
  if (!values.contacts) return
  values.contacts.forEach((_, i: number) => {
    ;(setFieldValue as any)(`contacts[${i}].is_principal`, i === index)
  })
}

watch(() => props.data, (newData?: IContact[]) => {
  hasTriedSubmit.value = false
  if (newData && newData.length > 0) {
    resetForm({
      values: {
        contacts: newData.map((c: IContact) => ({ ...c }))
      }
    })
  } else {
    resetForm({
      values: {
        contacts: [{ ...emptyContact, is_principal: true }]
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
  getValues(): IContact[] | undefined {
    return values.contacts
  },
  reset(): void {
    hasTriedSubmit.value = false
    resetForm()
  },
  setBackendErrors(backendErrors: Record<string, string>) {
    hasTriedSubmit.value = true
    setErrors(backendErrors)
  }
})
</script>

<template>
  <div>
    <div class="card-header ps-0 d-flex justify-content-between align-items-center">
      <h5>{{ props.single ? 'Contacto' : 'Contactos' }}</h5>
      <button
          v-if="!single"
          type="button"
          class="btn btn-pill btn-gradient color-4"
          @click="addContact"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Contacto
      </button>
    </div>

    <div v-if="fields.length === 0" class="alert alert-info">
      No hay contactos registrados.
    </div>

    <div
        v-if="hasTriedSubmit && errors.contacts"
        class="alert alert-danger p-2 small"
    >
      {{ errors.contacts }}
    </div>

    <div
        v-for="(field, index) in fields"
        :key="field.key"
        class="card mb-3 border"
    >
      <div class="card-body">

        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Contacto #{{ index + 1 }}</h6>
          <button
              v-if="!single"
              type="button"
              class="btn btn-dashed color-4"
              :disabled="fields.length === 1"
              @click="remove(index)"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">

          <CommonInputfieldsTextfield
              v-model="field.value.phone"
              type="text"
              classes="col-md-4 col-sm-6"
              label="Teléfono Fijo"
              placeholder="Ej: 6012345678"
              :error="getFieldError(index, 'phone')"
          />

          <CommonInputfieldsTextfield
              v-model="field.value.mobile"
              type="text"
              classes="col-md-4 col-sm-6"
              label="Teléfono Móvil"
              placeholder="Ej: 3001234567"
              star="*"
              :error="getFieldError(index, 'mobile')"
          />

          <CommonInputfieldsTextfield
              v-model="field.value.email"
              type="email"
              classes="col-md-4 col-sm-6"
              label="Correo Electrónico"
              placeholder="ejemplo@correo.com"
              star="*"
              :error="getFieldError(index, 'email')"
          />

          <CommonInputfieldsCheckbox
              v-model="field.value.is_principal"
              :name="`contacts.${index}.is_principal`"
              classes="col-md-12"
              label="Contacto Principal"
              @change="handlePrincipal(index)"
              :error="getFieldError(0, 'is_principal')"
          />

        </form>
      </div>
    </div>
  </div>
</template>
