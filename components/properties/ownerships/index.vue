<template>
  <div>
    <div class="card-header ps-0 d-flex justify-content-between align-items-center">
      <h5>Propietarios</h5>
      <button type="button" class="btn btn-pill btn-gradient color-4" @click="addOwnership">
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Propietario
      </button>
    </div>

    <div v-if="ownershipsList.length === 0" class="alert alert-info">
      No hay propietarios registrados. Haz clic en "Agregar Propietario" para añadir uno.
    </div>

    <div class="d-flex align-items-center gap-3 mb-3"
         :class="isPercentageValid ? 'label label-success label-pill' : 'label label-danger label-pill'">
      <i :class="isPercentageValid ? 'bi bi-check-circle' : 'bi bi-exclamation-circle'"></i>
      <span>
      Total % asignado: <strong>{{ totalPercentage }}%</strong>
      <span v-if="!isPercentageValid">
        — {{ remainingPercentage > 0 ? `Falta ${remainingPercentage}%` : `Excedido por ${Math.abs(remainingPercentage)}%` }}
      </span>
    </span>
    </div>

    <div v-for="(ownership, index) in ownershipsList" :key="index" class="card mb-3 border">
      <div class="card-body">

        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Propietario #{{ index + 1 }}</h6>
          <button
              type="button"
              class="btn btn-dashed color-4"
              @click="removeOwnership(index)"
              :disabled="ownershipsList.length === 1"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">
          <!-- Persona (búsqueda por cédula) -->
          <CommonInputfieldsSelectfield
              v-model="ownership.person_id"
              classes="col-md-12 col-sm-12"
              label="Persona"
              :data="getPersonsForIndex(index)"
              :labelField="'name'"
              :searchable="true"
              star="*"
              :onSearch="searchPerson"
              :rules="ownershipSchema.person_id"
              :name="`person_id_${index}`"
          />

          <!-- Porcentaje -->
          <CommonInputfieldsTextfield
              v-model="ownership.ownership_percentage"
              type="number"
              classes="col-md-4 col-sm-6"
              label="Porcentaje %"
              placeholder="Ej: 50"
              star="*"
              :rules="ownershipSchema.ownership_percentage"
              :name="`ownership_percentage_${index}`"
          />

          <!-- Estado -->
          <CommonInputfieldsSelectfield
              v-model="ownership.status_id"
              classes="col-md-4 col-sm-6"
              label="Estado"
              :data="lookups.status"
              :labelField="'name'"
              :rules="ownershipSchema.status_id"
              :name="`status_id_${index}`"
              star="*"
          />

          <!-- Fecha inicio -->
          <CommonInputfieldsTextfield
              v-model="ownership.ownership_start_date"
              type="date"
              classes="col-md-4 col-sm-6"
              label="Fecha Inicio"
              :rules="ownershipSchema.ownership_start_date"
              :name="`ownership_start_date_${index}`"
          />

          <!-- Fecha fin -->
          <CommonInputfieldsTextfield
              v-model="ownership.ownership_end_date"
              type="date"
              classes="col-md-4 col-sm-6"
              label="Fecha Fin"
              :rules="ownershipSchema.ownership_end_date"
              :name="`ownership_end_date_${index}`"
          />

          <!-- Propietario principal -->
          <CommonInputfieldsCheckbox
              v-model="ownership.is_principal_owner"
              classes="col-md-12"
              label="Propietario Principal"
              :name="`is_primary_owner_${index}`"
              :rules="ownershipSchema.is_primary_owner"
              @change="setPrimaryOwner(index)"
          />

        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ILookup } from "~/interfaces/ILookup";
import type { IOwnership } from "~/interfaces/IOwnership";
import { useValidator } from "@/composables/useValidator";
import { ownershipSchema } from "@/utils/validations/ownership.schema";
import type {IOwner} from "~/interfaces/IOwner";
import {useDebounce} from "~/composables/useDebounce";
import type {IParamsTable} from "~/interfaces/IParamsTable";
import LoadingService from "~/services/LoadingService";
import PersonService from "~/services/PersonService";
import AlertaService from "~/services/AlertService";

const { validateForm, resetErrors } = useValidator();

const props = defineProps<{
  data?: IOwnership[],
  lookups: {
    status: ILookup[]
  },
  isEditing?: boolean
}>();

const emit = defineEmits<{
  (e: "sendForm", payload: IOwnership[]): void;
  (e: "formInvalid", payload: boolean): void;
}>();

const emptyOwnership = (): IOwnership => ({
  id: '',
  person_id: '',
  property_id: '',
  ownership_percentage: 0,
  is_principal_owner: false,
  ownership_start_date: '',
  ownership_end_date: '',
  status_id: '',
  person: {
    id: '',
    full_name: '',
    company_name: '',
    document_number: '',
    document_type_id: '',
    organization_type_id: '',
    document_type_alias: '',
    organization_type_alias: '',
  } as IOwner
});

const ownershipsList = ref<IOwnership[]>([emptyOwnership()]);
const ownershipsListOriginal = ref<IOwnership[]>([emptyOwnership()]);

const persons = ref<{ id: string; name: string; raw: any }[]>([]);

const totalPercentage = computed(() =>
    ownershipsList.value.reduce((sum, o) => sum + (Number(o.ownership_percentage) || 0), 0)
);

const remainingPercentage = computed(() => 100 - totalPercentage.value);

const isPercentageValid = computed(() => totalPercentage.value === 100);

watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    ownershipsList.value = newData.map(item => ({ ...item }));
    ownershipsListOriginal.value = newData.map(item => ({ ...item }));

    persons.value = newData.map((p: any) => ({
      id: p.person.id,
      name: `${p.person.full_name ?? p.person.company_name} - ${p.person.document_type_alias} ${p.person.document_number}`,
      raw: p.person
    }));
  }
}, { immediate: true });

const onPersonSelected = (index: number, personId: string) => {
  const found = persons.value.find(p => p.id === personId);
  if (found?.raw) {
    ownershipsList.value[index].person = { ...found.raw };
  }
};

const addOwnership = () => {
  ownershipsList.value.push(emptyOwnership());
};

const removeOwnership = (index: number) => {
  if (ownershipsList.value.length > 1) {
    ownershipsList.value.splice(index, 1);
    resetErrors();
  }
};

const setPrimaryOwner = (index: number) => {
  if (ownershipsList.value[index].is_principal_owner) {
    ownershipsList.value.forEach((item, i) => {
      if (i !== index) {
        item.is_principal_owner = false;
      }
    });
  }
};

/**
 * Búsqueda remota por número de documento
 */
const searchPerson = (term: string) => {
  if (!term || term.length < 3) {
    return;
  }

  debouncedSearch(term);
};

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 99999,
  sortBy: 'created_at',
  sortType: 'desc',
  search: '',
})

const debouncedSearch = useDebounce(async (term: string) => {
  paramsTable.value.search = term;

  LoadingService.show()
  PersonService.getPeople(paramsTable.value)
      .then((response) => {
        if (response.data.data) {
          const newPersons = response.data.data.map((p: any) => ({
            id: p.id,
            name: `${p.full_name ?? p.company_name} - ${p.document_type_alias} ${p.document_number}`,
            raw: p
          }));

          const selectedIds = new Set(ownershipsList.value.map(o => o.person_id).filter(Boolean));
          const alreadySelected = persons.value.filter(p => selectedIds.has(p.id));
          const merged = [...alreadySelected, ...newPersons];
          persons.value = merged.filter((p, i, self) =>
              i === self.findIndex(x => x.id === p.id)
          );
        }
        LoadingService.hide()
      }).catch((error) => {
    LoadingService.hide()
    AlertaService.showError('Ha ocurrido un error', error);
  })

}, 700);

// IDs ya seleccionados en cualquier ownership
const selectedPersonIds = computed(() =>
    new Set(ownershipsList.value.map(o => o.person_id).filter(Boolean))
);

// Por cada ownership, las opciones son: persons disponibles + la propia seleccionada
const getPersonsForIndex = (index: number) => {
  const currentId = ownershipsList.value[index].person_id;
  return persons.value.filter(p =>
      !selectedPersonIds.value.has(p.id) || p.id === currentId
  );
};

const sendForm = () => {
  if (!isPercentageValid.value) {
    emit("formInvalid", true);
    return;
  }

  const isValid = validateForm(ownershipsList.value, ownershipSchema, true);

  if (isValid) {
    emit("sendForm", ownershipsList.value);
  } else {
    emit("formInvalid", true);
  }
};

const reset = () => {
  ownershipsList.value = ownershipsListOriginal.value.map(item => ({ ...item }));
  resetErrors();
};

watch(
    () => ownershipsList.value.map(o => o.person_id),
    (newValues) => {
      newValues.forEach((personId, index) => {
        const found = persons.value.find(p => p.id === personId)
        if (found?.raw) {
          ownershipsList.value[index].person = { ...found.raw }
        }
      })
    },
    { deep: true }
)

defineExpose({
  sendForm,
  reset
});
</script>

<style scoped>
.card {
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
