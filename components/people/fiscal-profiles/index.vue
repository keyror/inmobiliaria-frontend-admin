<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header pb-0">
            <h5>{{ isEditing ? 'Editar Perfil Fiscal' : 'Agregar Perfil Fiscal' }}</h5>
          </div>
          <div class="card-body admin-form">
            <form class="row gx-3" @submit.prevent="save">
              <div class="col-md-6 col-sm-6">
                <label class="form-label">Persona <span class="text-danger">*</span></label>
                <select v-model="formData.person_id" class="form-select">
                  <option value="">Seleccione una persona...</option>
                  <option v-for="person in availablePeople" :key="person.id" :value="person.id">
                    {{ person.full_name }} - {{ person.document_number }}
                  </option>
                </select>
              </div>

              <div class="col-md-6 col-sm-6">
                <label class="form-label">Tipo de Régimen <span class="text-danger">*</span></label>
                <select v-model="formData.regime_type" class="form-select">
                  <option value="">Seleccione...</option>
                  <option value="simplificado">Régimen Simplificado</option>
                  <option value="comun">Régimen Común</option>
                  <option value="especial">Régimen Especial</option>
                </select>
              </div>

              <CommonInputfieldsTextfield
                  v-model="formData.nit"
                  classes="col-md-6 col-sm-6"
                  label="NIT"
                  placeholder="Ingrese el NIT"
                  star="*"
              />

              <CommonInputfieldsTextfield
                  v-model="formData.tax_address"
                  classes="col-md-6 col-sm-6"
                  label="Dirección Fiscal"
                  placeholder="Ingrese la dirección fiscal"
              />

              <CommonInputfieldsTextfield
                  v-model="formData.tax_city"
                  classes="col-md-6 col-sm-6"
                  label="Ciudad Fiscal"
                  placeholder="Ingrese la ciudad fiscal"
              />

              <CommonInputfieldsTextfield
                  v-model="formData.tax_phone"
                  classes="col-md-6 col-sm-6"
                  label="Teléfono Fiscal"
                  placeholder="Ingrese el teléfono fiscal"
              />

              <div class="col-md-6 col-sm-6">
                <label class="form-label">IVA Responsable</label>
                <select v-model="formData.is_iva_responsible" class="form-select">
                  <option :value="true">Sí</option>
                  <option :value="false">No</option>
                </select>
              </div>

              <div class="col-md-6 col-sm-6">
                <label class="form-label">Gran Contribuyente</label>
                <select v-model="formData.is_big_contributor" class="form-select">
                  <option :value="true">Sí</option>
                  <option :value="false">No</option>
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
                :headers="fiscalProfilesHeader()"
                :items="fiscalProfilesData"
                :loading="loading"
                :server-items-length="fiscalProfilesTotal"
                @update="loadFiscalProfiles"
                @reload="reloadDataTable"
            >
              <template #item-actions="{ item }">
                <div aria-label="Acciones" class="btn-group" role="group">
                  <button class="btn btn-dashed color-1" type="button" @click="editFiscalProfile(item)">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button class="btn btn-dashed color-4" type="button" @click="deleteFiscalProfile(item)">
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
import {fiscalProfilesHeader} from "~/constants/tableHeaders/FiscalProfilesHeader";
import LoadingService from "~/services/LoadingService";

const props = defineProps<{
  allData: any
}>()

const emit = defineEmits<{
  (e: 'reload'): void
}>()

const fiscalProfilesData = ref([]);
const fiscalProfilesTotal = ref(0);
const loading = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const availablePeople = ref([]);

const formData = ref({
  person_id: '',
  regime_type: '',
  nit: '',
  tax_address: '',
  tax_city: '',
  tax_phone: '',
  is_iva_responsible: false,
  is_big_contributor: false
});

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: 'created_at',
  sortType: 'desc',
  search: '',
});

// Cargar perfiles fiscales
const loadFiscalProfiles = async (params: IParamsTable) => {
  LoadingService.show();
  // Aquí deberías tener un endpoint específico para cargar fiscal profiles
  // Por ahora usamos getPeople y filtramos los que tienen fiscal_profile_id
  PersonService.getPeople(params)
      .then((response) => {
        // Filtrar solo los que tienen perfil fiscal
        fiscalProfilesData.value = response.data.data.filter((item: any) => item.fiscal_profile_id);
        fiscalProfilesTotal.value = fiscalProfilesData.value.length;
      }).catch((error) => {
        AlertService.showError('Ha ocurrido un error', error);
      })
      .finally(() => {
        LoadingService.hide();
      });
};

// Cargar personas disponibles
const loadAvailablePeople = async () => {
  const params = {
    page: 1,
    perPage: 1000,
    sortBy: 'created_at',
    sortType: 'desc',
    search: '',
  };

  PersonService.getPeople(params)
      .then((response) => {
        availablePeople.value = response.data.data;
      }).catch((error) => {
        console.error('Error al cargar personas', error);
      });
};

const save = async () => {
  if (isEditing.value) {
    await updateFiscalProfile();
  } else {
    await saveFiscalProfile();
  }
}

// Guardar un nuevo perfil fiscal
const saveFiscalProfile = async () => {
  LoadingService.show();
  PersonService.createFiscalProfile(formData.value)
      .then((response) => {
        AlertService.showSuccess('Operación exitosa', response.message);
        resetForm();
        loadFiscalProfiles(paramsTable.value);
        emit('reload');
      }).catch((error) => {
        AlertService.showError('Ha ocurrido un error', error);
      })
      .finally(() => {
        LoadingService.hide();
      });
};

const updateFiscalProfile = async () => {
  LoadingService.show();
  PersonService.updateFiscalProfile(editingId.value, formData.value)
      .then((response) => {
        AlertService.showSuccess('Operación exitosa', response.message);
        resetForm();
        loadFiscalProfiles(paramsTable.value);
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
    person_id: '',
    regime_type: '',
    nit: '',
    tax_address: '',
    tax_city: '',
    tax_phone: '',
    is_iva_responsible: false,
    is_big_contributor: false
  };
  isEditing.value = false;
  editingId.value = null;
};

// Editar un perfil fiscal
const editFiscalProfile = (item: any) => {
  isEditing.value = true;
  editingId.value = item.fiscal_profile_id;
  formData.value = {
    person_id: item.id,
    regime_type: item.regime_type || '',
    nit: item.nit || '',
    tax_address: item.tax_address || '',
    tax_city: item.tax_city || '',
    tax_phone: item.tax_phone || '',
    is_iva_responsible: item.is_iva_responsible || false,
    is_big_contributor: item.is_big_contributor || false
  };
};

// Eliminar un perfil fiscal
const deleteFiscalProfile = async (item: any) => {
  AlertService.showConfirmation(
      '¿Está seguro de realizar esta operación?',
      `¿Está seguro de eliminar el perfil fiscal de: ${item.full_name}?`)
      .then((result) => {
        if (result.isConfirmed) {
          LoadingService.show();
          PersonService.deleteFiscalProfile(item.fiscal_profile_id)
              .then((response) => {
                AlertService.showSuccess('Operación exitosa', response.message);
                loadFiscalProfiles(paramsTable.value);
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
  loadFiscalProfiles(paramsTable.value);
}

onMounted(() => {
  loadFiscalProfiles(paramsTable.value);
  loadAvailablePeople();
})
</script>

<style scoped>
</style>
