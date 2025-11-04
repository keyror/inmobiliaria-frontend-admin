<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header pb-0">
            <h5>{{ isEditing ? 'Editar Persona' : 'Agregar Persona' }}</h5>
          </div>
          <div class="card-body admin-form">
            <form class="row gx-3" @submit.prevent="save">
              <CommonInputfieldsTextfield
                  v-model="formData.first_name"
                  classes="col-md-6 col-sm-6"
                  label="Nombres"
                  placeholder="Ingrese los nombres"
                  star="*"
              />
              <CommonInputfieldsTextfield
                  v-model="formData.last_name"
                  classes="col-md-6 col-sm-6"
                  label="Apellidos"
                  placeholder="Ingrese los apellidos"
                  star="*"
              />

              <CommonInputfieldsTextfield
                  v-model="formData.company_name"
                  classes="col-md-6 col-sm-6"
                  label="Razón Social"
                  placeholder="Ingrese la razón social (opcional)"
              />

              <div class="col-md-3 col-sm-6">
                <label class="form-label">Tipo de Documento <span class="text-danger">*</span></label>
                <select v-model="formData.document_type_id" class="form-select">
                  <option value="">Seleccione...</option>
                  <option value="1">Cédula</option>
                  <option value="2">Pasaporte</option>
                  <option value="3">NIT</option>
                </select>
              </div>

              <CommonInputfieldsTextfield
                  v-model="formData.document_number"
                  classes="col-md-3 col-sm-6"
                  label="Número de Documento"
                  placeholder="Número"
                  star="*"
              />

              <CommonInputfieldsTextfield
                  v-model="formData.document_from"
                  classes="col-md-6 col-sm-6"
                  label="Lugar de Expedición"
                  placeholder="Ciudad de expedición"
                  star="*"
              />

              <div class="col-md-6 col-sm-6">
                <label class="form-label">Tipo de Organización <span class="text-danger">*</span></label>
                <select v-model="formData.organization_type_id" class="form-select">
                  <option value="">Seleccione...</option>
                  <option value="1">Persona Natural</option>
                  <option value="2">Persona Jurídica</option>
                </select>
              </div>

              <div class="form-btn mt-3">
                <button class="btn btn-pill btn-gradient color-4" type="submit">
                  {{ isEditing ? 'Actualizar' : 'Guardar' }}
                </button>
                <button class="btn btn-pill btn-dashed color-4" type="button" @click="resetForm">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="row agent-section property-section user-lists">
      <div class="col-lg-12">
        <div class="property-grid-3 agent-grids ratio2_3">
          <div class="property-2 row column-sm property-label property-grid list-view">
            <Table
                :headers="peopleHeader()"
                :items="peopleData"
                :loading="loading"
                :server-items-length="peopleTotal"
                @update="loadPeople"
                @reload="reloadDataTable"
            >
              <template #item-actions="{ item }">
                <div aria-label="Acciones" class="btn-group" role="group">
                  <button class="btn btn-dashed color-1" type="button" @click="editPerson(item)">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button class="btn btn-dashed color-4" type="button" @click="deletePerson(item)">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PersonService from "@/services/PersonService";
import AlertService from "~/services/AlertService";
import type {IParamsTable} from "~/interfaces/IParamsTable";
import {peopleHeader} from "~/constants/tableHeaders/PeopleHeader";
import LoadingService from "~/services/LoadingService";

const props = defineProps<{
  allData: any
}>()

const emit = defineEmits<{
  (e: 'reload'): void
}>()

const peopleData = ref([]);
const peopleTotal = ref(0);
const loading = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const formData = ref({
  first_name: '',
  last_name: '',
  company_name: '',
  document_type_id: '',
  document_number: '',
  document_from: '',
  organization_type_id: ''
});

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: 'created_at',
  sortType: 'desc',
  search: '',
});

// Cargar personas
const loadPeople = async (params: IParamsTable) => {
  LoadingService.show();
  PersonService.getPeople(params)
      .then((response) => {
        peopleData.value = response.data.data;
        peopleTotal.value = response.data.total;
      }).catch((error) => {
        AlertService.showError('Ha ocurrido un error', error);
      })
      .finally(() => {
        LoadingService.hide();
      });
};

const save = async () => {
  if (isEditing.value) {
    await updatePerson();
  } else {
    await savePerson();
  }
}

// Guardar una nueva persona
const savePerson = async () => {
  LoadingService.show();
  PersonService.createPerson(formData.value)
      .then((response) => {
        AlertService.showSuccess('Operación exitosa', response.message);
        resetForm();
        loadPeople(paramsTable.value);
        emit('reload');
      }).catch((error) => {
        AlertService.showError('Ha ocurrido un error', error);
      })
      .finally(() => {
        LoadingService.hide();
      });
};

const updatePerson = async () => {
  LoadingService.show();
  PersonService.updatePerson(editingId.value, formData.value)
      .then((response) => {
        AlertService.showSuccess('Operación exitosa', response.message);
        resetForm();
        loadPeople(paramsTable.value);
        emit('reload');
      }).catch((error) => {
        AlertService.showError('Ha ocurrido un error', error);
      })
      .finally(() => {
        LoadingService.hide();
      });
};

// Resetear formulario
const resetForm = () => {
  formData.value = {
    first_name: '',
    last_name: '',
    company_name: '',
    document_type_id: '',
    document_number: '',
    document_from: '',
    organization_type_id: ''
  };
  isEditing.value = false;
  editingId.value = null;
};

// Editar una persona
const editPerson = (item: any) => {
  isEditing.value = true;
  editingId.value = item.id;
  formData.value = {
    first_name: item.first_name,
    last_name: item.last_name,
    company_name: item.company_name || '',
    document_type_id: item.document_type_id,
    document_number: item.document_number,
    document_from: item.document_from,
    organization_type_id: item.organization_type_id
  };
};

// Eliminar una persona
const deletePerson = async (item: any) => {
  AlertService.showConfirmation(
      '¿Está seguro de realizar esta operación?',
      `¿Está seguro de eliminar a: ${item.full_name}?`)
      .then((result) => {
        if (result.isConfirmed) {
          LoadingService.show();
          PersonService.deletePerson(item.id)
              .then((response) => {
                AlertService.showSuccess('Operación exitosa', response.message);
                loadPeople(paramsTable.value);
                emit('reload');
              }).catch((error) => {
                AlertService.showError('Ha ocurrido un error', error);
              })
              .finally(() => {
                LoadingService.hide();
              });
        }
      });
};

const reloadDataTable = () => {
  loadPeople(paramsTable.value);
}

loadPeople(paramsTable.value);
</script>

<style scoped>
</style>
