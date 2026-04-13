<template>
  <div>
    <div class="card-header ps-0 d-flex justify-content-between align-items-center">
      <h5>Propietarios</h5>
      <button
          type="button"
          class="btn btn-pill btn-gradient color-4"
          @click="addOwnership"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Propietario
      </button>
    </div>

    <div v-if="fields.length === 0" class="alert alert-info">
      No hay propietarios registrados.
    </div>

    <!-- porcentaje -->
    <div
        class="d-flex align-items-center gap-3 mb-3"
        :class="isPercentageValid ? 'label label-success label-pill' : 'label label-danger label-pill'"
    >
      <i :class="isPercentageValid ? 'bi bi-check-circle' : 'bi bi-exclamation-circle'"></i>
      <span>
        Total % asignado: <strong>{{ totalPercentage }}%</strong>
        <span v-if="!isPercentageValid">
          — {{ remainingPercentage > 0
            ? `Falta ${remainingPercentage}%`
            : `Excedido por ${Math.abs(remainingPercentage)}%`
          }}
        </span>
      </span>
    </div>

    <!-- error general -->
    <div
        v-if="hasTriedSubmit && errors.ownerships"
        class="alert alert-danger p-2 small"
    >
      {{ errors.ownerships }}
    </div>

    <div
        v-for="(field, index) in fields"
        :key="field.key"
        class="card mb-3 border"
    >
      <div class="card-body">

        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Propietario #{{ index + 1 }}</h6>

          <button
              type="button"
              class="btn btn-dashed color-4"
              :disabled="fields.length === 1"
              @click="removeOwnership(index)"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">

          <!-- Persona -->
          <CommonInputfieldsSelectfield
              v-model="field.value.person_id"
              classes="col-md-12"
              label="Persona"
              :data="getPersonsForIndex(index)"
              :labelField="'name'"
              :searchable="true"
              star="*"
              :onSearch="searchPerson"
              :error="getFieldError(index, 'person_id')"
          />

          <!-- Porcentaje -->
          <CommonInputfieldsTextfield
              v-model="field.value.ownership_percentage"
              type="number"
              classes="col-md-4 col-sm-6"
              label="Porcentaje %"
              star="*"
              :error="getFieldError(index, 'ownership_percentage')"
          />

          <!-- Estado -->
          <CommonInputfieldsSelectfield
              v-model="field.value.status_id"
              classes="col-md-4 col-sm-6"
              label="Estado"
              :data="lookups.status"
              :labelField="'name'"
              star="*"
              :error="getFieldError(index, 'status_id')"
          />

          <!-- Fecha inicio -->
          <CommonInputfieldsTextfield
              v-model="field.value.ownership_start_date"
              type="date"
              classes="col-md-4 col-sm-6"
              label="Fecha Inicio"
              :error="getFieldError(index, 'ownership_start_date')"
          />

          <!-- Fecha fin -->
          <CommonInputfieldsTextfield
              v-model="field.value.ownership_end_date"
              type="date"
              classes="col-md-4 col-sm-6"
              label="Fecha Fin"
              :error="getFieldError(index, 'ownership_end_date')"
          />

          <!-- Principal -->
          <CommonInputfieldsCheckbox
              v-model="field.value.is_principal_owner"
              :name="`ownerships.${index}.is_principal_owner`"
              classes="col-md-12"
              label="Propietario Principal"
              @change="setPrimaryOwner(index)"
              :error="getFieldError(0, 'is_principal_owner')"
          />

        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFieldArray } from 'vee-validate'
import type { ILookup } from "~/interfaces/ILookup";
import type { IOwnership } from "~/interfaces/IOwnership";
import type { IOwner } from "~/interfaces/IOwner";
import { useOwnershipForm } from '~/composables/forms/useOwnershipForm'
import { useDebounce } from "~/composables/useDebounce";
import type { IParamsTable } from "~/interfaces/IParamsTable";
import PersonService from "~/services/PersonService";
import { useApiHandler } from '~/composables/useApiHandler'

const { run } = useApiHandler()

const props = defineProps<{
  data?: IOwnership[],
  lookups: {
    status: ILookup[]
  },
  isEditing?: boolean
}>()

const {
  validate,
  values,
  resetForm,
  errors,
  setFieldValue,
  setErrors,
} = useOwnershipForm()

const { remove, push, fields } = useFieldArray<IOwnership>('ownerships')

const hasTriedSubmit = ref(false)

const getFieldError = (index: number, field: string): string => {
  if (!hasTriedSubmit.value) return ''
  const errorsMap = errors.value as Record<string, string>

  return (
      errorsMap[`ownerships[${index}].${field}`] ||
      errorsMap[`ownerships.${index}.${field}`] ||
      ''
  )
}

const emptyOwnership = (): IOwnership => ({
  id: '',
  person_id: '',
  property_id: '',
  ownership_percentage: 0,
  is_principal_owner: false,
  ownership_start_date: '',
  ownership_end_date: '',
  status_id: '',
  person: {} as IOwner
})

const persons = ref<{ id: string; name: string; raw: any }[]>([])

watch(() => props.data, (newData) => {
  hasTriedSubmit.value = false

  if (newData && newData.length > 0) {
    resetForm({
      values: {
        ownerships: newData.map(item => ({ ...item }))
      }
    })

    persons.value = newData.map((p: any) => ({
      id: p.person.id,
      name: `${p.person.full_name ?? p.person.company_name} - ${p.person.document_type_alias} ${p.person.document_number}`,
      raw: p.person
    }))
  } else {
    resetForm({
      values: {
        ownerships: [{ ...emptyOwnership(), is_principal_owner: true }]
      }
    })
  }
}, { immediate: true })

const addOwnership = () => {
  push(emptyOwnership())
}

const removeOwnership = (index: number) => {
  if (fields.value.length > 1) {
    remove(index)
  }
}

const setPrimaryOwner = (index: number) => {
  values.ownerships?.forEach((_, i) => {
    ;(setFieldValue as any)(`ownerships[${i}].is_principal_owner`, i === index)
  })
}

const totalPercentage = computed(() =>
    values.ownerships?.reduce((sum, o) => sum + (Number(o.ownership_percentage) || 0), 0) || 0
)

const remainingPercentage = computed(() => 100 - totalPercentage.value)

const isPercentageValid = computed(() => totalPercentage.value === 100)

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 99999,
  sortBy: 'created_at',
  sortType: 'desc',
  search: '',
})

const debouncedSearch = useDebounce(async (term: string) => {
  paramsTable.value.search = term

  const response = await run(PersonService.getPeople(paramsTable.value))

  if (!response) return

  const newPersons = response.data.data.map((p: any) => ({
    id: p.id,
    name: `${p.full_name ?? p.company_name} - ${p.document_type_alias} ${p.document_number}`,
    raw: p
  }))

  const selectedIds = new Set(values.ownerships?.map(o => o.person_id).filter(Boolean))
  const alreadySelected = persons.value.filter(p => selectedIds.has(p.id))

  const merged = [...alreadySelected, ...newPersons]

  persons.value = merged.filter((p, i, self) =>
      i === self.findIndex(x => x.id === p.id)
  )

}, 700)

const searchPerson = (term: string) => {
  if (!term || term.length < 3) return
  debouncedSearch(term)
}


const selectedPersonIds = computed(() =>
    new Set(values.ownerships?.map(o => o.person_id).filter(Boolean))
)

const getPersonsForIndex = (index: number) => {
  const currentId = values.ownerships?.[index]?.person_id

  return persons.value.filter(p =>
      !selectedPersonIds.value.has(p.id) || p.id === currentId
  )
}

defineExpose({
  async validateForm() {
    hasTriedSubmit.value = true

    if (!isPercentageValid.value) return false

    const result = await validate()
    return result.valid
  },

  getValues() {
    return values.ownerships
  },

  reset() {
    hasTriedSubmit.value = false
    resetForm()
  },

  setBackendErrors(backendErrors: Record<string, string>) {
    hasTriedSubmit.value = true
    setErrors(backendErrors)
  },

  getErrorCount() {
    return Object.keys(errors.value || {}).length
  }
})
</script>

<style scoped>
.card {
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
