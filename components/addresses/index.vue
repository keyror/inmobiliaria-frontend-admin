<script setup lang="ts">
import { useFieldArray } from 'vee-validate'
import type { ILookup } from '~/interfaces/ILookup'
import type { IAddress } from '~/interfaces/IAddress'
import { useAddressForm } from '~/composables/forms/useAddressForm'

const props = defineProps<{
  data?: IAddress[]
  single?: boolean
  isEditing?: boolean
  lookups: {
    roadTypes: ILookup[]
    letters: ILookup[]
    orientations: ILookup[]
    strata: ILookup[]
    country: ILookup[]
    cities: ILookup[]
    departments: ILookup[]
  }
}>()

const {
  validate,
  values,
  resetForm,
  errors,
  setFieldValue,
  setErrors,
} = useAddressForm()

const { remove, push, fields } = useFieldArray<IAddress>('addresses')

//evita que los errores se muestren al cargar el formulario por primera vez,
// solo después de intentar enviar el formulario
const hasTriedSubmit = ref<boolean>(false)

const getFieldError = (index: number, field: string): string => {
  if (!hasTriedSubmit.value) return ''
  const errorsMap = errors.value as Record<string, string>
  return (
      errorsMap[`addresses[${index}].${field}`] ||
      errorsMap[`addresses.${index}.${field}`] ||
      ''
  )
}

const emptyAddress: IAddress = {
  address: '',
  via_type_id: '',
  via_number: '',
  number2: '',
  number3: '',
  country_id: '',
  department_id: '',
  city_id: '',
  letra1_id: '',
  orientation1_id: '',
  letra2_id: '',
  orientation2_id: '',
  complement: '',
  zip_code: '',
  sector: '',
  stratum_id: '',
  is_principal: false,
}

const addAddress = (): void => {
  push({ ...emptyAddress })
}

const handlePrincipal = (index: number): void => {
  if (!values.addresses) return
  values.addresses.forEach((_: IAddress, i: number) => {
    ;(setFieldValue as any)(`addresses[${i}].is_principal`, i === index)
  })
}

const onDepartmentChange = (index: number): void => {
  ;(setFieldValue as any)(`addresses[${index}].city_id`, '')
}


const getLookupName = (arr: ILookup[], id: string): string =>
    arr.find(i => i.id === id)?.name ?? ''

const builtAddresses = ref<string[]>([])

const buildAddress = async (index: number): Promise<void> => {
  await nextTick()

  const a = fields.value[index]?.value
  if (!a) return

  let result = ''

  if (a.via_type_id) result += getLookupName(props.lookups.roadTypes, a.via_type_id)
  if (a.via_number) result += ` ${a.via_number}`
  if (a.letra1_id) result += getLookupName(props.lookups.letters, a.letra1_id)
  if (a.orientation1_id) result += ` ${getLookupName(props.lookups.orientations, a.orientation1_id)}`
  if (a.number2) result += ` # ${a.number2}`
  if (a.letra2_id) result += getLookupName(props.lookups.letters, a.letra2_id)
  if (a.orientation2_id) result += ` ${getLookupName(props.lookups.orientations, a.orientation2_id)}`
  if (a.number3) result += ` - ${a.number3}`

  const trimmed = result.trim()
  builtAddresses.value[index] = trimmed
  ;(setFieldValue as any)(`addresses[${index}].address`, trimmed)
}

const getFilteredCities = (index: number): ILookup[] => {
  if (!props.lookups?.departments || !props.lookups?.cities) return []
  const departmentId = values.addresses?.[index]?.department_id
  if (!departmentId) return []
  const selectedDepartment = props.lookups.departments.find(d => d.id === departmentId)
  if (!selectedDepartment?.alias) return []
  const alias = selectedDepartment.alias.toUpperCase()
  return props.lookups.cities.filter(c => c.code?.toUpperCase() === alias)
}

watch(() => props.data, (newData?: IAddress[]) => {
  hasTriedSubmit.value = false
  if (newData && newData.length > 0) {
    resetForm({
      values: {
        addresses: newData.map((a: IAddress) => ({ ...a }))
      }
    })
  } else {
    resetForm({
      values: {
        addresses: [{ ...emptyAddress, is_principal: true }]
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
  getValues(): IAddress[] | undefined {
    return values.addresses
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
      <h5>{{ props.single ? 'Dirección' : 'Direcciones' }}</h5>
      <button
          v-if="!single"
          type="button"
          class="btn btn-pill btn-gradient color-4"
          @click="addAddress"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Dirección
      </button>
    </div>

    <div v-if="fields.length === 0" class="alert alert-info">
      No hay direcciones registradas.
    </div>

    <div
        v-if="hasTriedSubmit && errors.addresses"
        class="alert alert-danger p-2 small"
    >
      {{ errors.addresses }}
    </div>

    <div
        v-for="(field, index) in fields"
        :key="field.key"
        class="card mb-3 border"
    >
      <div class="card-body">

        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Dirección #{{ index + 1 }}</h6>
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

          <div class="col-12 mb-3">
            <label class="form-label fw-bold">Construir Dirección</label>
            <div class="row gx-2">

              <CommonInputfieldsSelectfield
                  v-model="field.value.via_type_id"
                  classes="col-md-2 col-sm-4"
                  label="Tipo vía"
                  :data="lookups.roadTypes"
                  label-field="name"
                  star="*"
                  :error="getFieldError(index, 'via_type_id')"
                  @update:model-value="buildAddress(index)"
              />

              <CommonInputfieldsTextfield
                  v-model="field.value.via_number"
                  classes="col-md-2 col-sm-4"
                  label="Número"
                  star="*"
                  :error="getFieldError(index, 'via_number')"
                  @update:model-value="buildAddress(index)"
              />

              <CommonInputfieldsSelectfield
                  v-model="field.value.letra1_id"
                  classes="col-md-1 col-sm-4"
                  label="Letra"
                  :data="lookups.letters"
                  label-field="name"
                  :error="getFieldError(index, 'letra1_id')"
                  @update:model-value="buildAddress(index)"
              />

              <CommonInputfieldsSelectfield
                  v-model="field.value.orientation1_id"
                  classes="col-md-1 col-sm-4"
                  label="Orient."
                  :data="lookups.orientations"
                  label-field="name"
                  :error="getFieldError(index, 'orientation1_id')"
                  @update:model-value="buildAddress(index)"
              />

              <CommonInputfieldsTextfield
                  v-model="field.value.number2"
                  classes="col-md-2 col-sm-4"
                  label="# Cruce"
                  star="*"
                  :error="getFieldError(index, 'number2')"
                  @update:model-value="buildAddress(index)"
              />

              <CommonInputfieldsSelectfield
                  v-model="field.value.letra2_id"
                  classes="col-md-1 col-sm-4"
                  label="Letra"
                  :data="lookups.letters"
                  label-field="name"
                  :error="getFieldError(index, 'letra2_id')"
                  @update:model-value="buildAddress(index)"
              />

              <CommonInputfieldsSelectfield
                  v-model="field.value.orientation2_id"
                  classes="col-md-1 col-sm-4"
                  label="Orient."
                  :data="lookups.orientations"
                  label-field="name"
                  :error="getFieldError(index, 'orientation2_id')"
                  @update:model-value="buildAddress(index)"
              />

              <CommonInputfieldsTextfield
                  v-model="field.value.number3"
                  classes="col-md-2 col-sm-4"
                  label="# Placa"
                  star="*"
                  :error="getFieldError(index, 'number3')"
                  @update:model-value="buildAddress(index)"
              />

            </div>

            <div class="mt-3">
              <label class="form-label fw-bold">Dirección generada</label>
              <div class="alert alert-secondary mb-0">
                {{ builtAddresses[index]?.trim() ||field.value.address || 'Completa los campos' }}
              </div>
            </div>
          </div>

          <CommonInputfieldsTextfield
              v-model="field.value.complement"
              classes="col-md-6 col-sm-6"
              label="Complemento"
              :error="getFieldError(index, 'complement')"
          />

          <CommonInputfieldsSelectfield
              v-model="field.value.country_id"
              classes="col-md-6 col-sm-6"
              label="País"
              :data="lookups.country"
              label-field="name"
              star="*"
              :searchable="true"
              :error="getFieldError(index, 'country_id')"
          />

          <CommonInputfieldsSelectfield
              v-model="field.value.department_id"
              classes="col-md-6 col-sm-6"
              label="Departamento"
              :data="lookups.departments"
              label-field="name"
              star="*"
              :searchable="true"
              :error="getFieldError(index, 'department_id')"
              @update:model-value="onDepartmentChange(index)"
          />

          <CommonInputfieldsSelectfield
              v-model="field.value.city_id"
              classes="col-md-6 col-sm-6"
              label="Ciudad"
              :data="getFilteredCities(index)"
              label-field="name"
              star="*"
              :searchable="true"
              :error="getFieldError(index, 'city_id')"
          />

          <CommonInputfieldsTextfield
              v-model="field.value.zip_code"
              classes="col-md-4 col-sm-6"
              label="Código postal"
              :error="getFieldError(index, 'zip_code')"
          />

          <CommonInputfieldsTextfield
              v-model="field.value.sector"
              classes="col-md-4 col-sm-6"
              label="Sector"
              :error="getFieldError(index, 'sector')"
          />

          <CommonInputfieldsSelectfield
              v-model="field.value.stratum_id"
              classes="col-md-4 col-sm-6"
              label="Estrato"
              :data="lookups.strata"
              label-field="name"
              :error="getFieldError(index, 'stratum_id')"
          />

          <CommonInputfieldsCheckbox
              v-model="field.value.is_principal"
              :name="`addresses.${index}.is_principal`"
              classes="col-md-12"
              label="Dirección principal"
              @change="handlePrincipal(index)"
              :error="getFieldError(0, 'is_principal')"
          />

        </form>
      </div>
    </div>
  </div>
</template>
