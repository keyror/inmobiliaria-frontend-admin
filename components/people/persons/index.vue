<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header pb-0">
        <h5> Editar Persona</h5>
      </div>

      <div class="card-body admin-form">
        <form class="row gx-3" @submit.prevent="updatePerson">

          <CommonInputfieldsTextfield classes="col-md-6" v-model="formData.first_name" label="Nombres" star="*" />
          <CommonInputfieldsTextfield classes="col-md-6" v-model="formData.last_name" label="Apellidos" star="*" />

          <CommonInputfieldsTextfield classes="col-md-6" v-model="formData.company_name" label="Razón Social" />

          <CommonInputfieldsSelectfield
              v-model="formData.document_type_id"
              :data="lookups.documentTypes"
              label="Tipo de Documento"
              classes="col-md-3"
              :labelField="'alias'"
              star="*"
          />

          <CommonInputfieldsTextfield classes="col-md-3" v-model="formData.document_number" label="Número" star="*" />

          <CommonInputfieldsTextfield
              v-model="formData.dv"
              type="number"
              classes="col-md-6 col-sm-6"
              label="Dígito de Verificación (DV)"
              readonly
          />

          <CommonInputfieldsTextfield classes="col-md-6" v-model="formData.document_from" label="Lugar de Expedición" star="*" />

          <CommonInputfieldsSelectfield
              v-model="formData.organization_type_id"
              :data="lookups.organizationTypes"
              label="Tipo de Organización"
              classes="col-md-6"
              :labelField="'name'"
              star="*"
          />

          <CommonInputfieldsTextfield
              classes="col-md-6"
              v-model="formData.birth_date"
              label="Fecha de Nacimiento"
              type="date"
          />

          <CommonInputfieldsSelectfield
              v-model="formData.gender_type_id"
              :data="lookups.genders"
              label="Género"
              classes="col-md-6"
              :labelField="'name'"
              star="*"
          />

          <div class="form-btn mt-3">
            <button class="btn btn-pill btn-gradient color-4" type="submit">
             Actualizar
            </button>

            <button class="btn btn-pill btn-dashed color-4" type="button" @click="resetForm">
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PersonService from "@/services/PersonService";
import AlertService from "@/services/AlertService";
import LoadingService from "@/services/LoadingService";
import type {ILookup} from "@/interfaces/ILookup";
import { calculateDV } from "@/composables/useDV";

const props = defineProps<{
  data: any,
  lookups: {
    organizationTypes: ILookup[],
    documentTypes: ILookup[],
    genders: ILookup[]
  }
}>();

const emit = defineEmits<{ (e: 'reload'): void }>();

const editingId = ref();

const formData = ref({
  first_name: '',
  last_name: '',
  company_name: '',
  document_type_id: '',
  document_number: '',
  document_from: '',
  organization_type_id: '',
  birth_date: '',
  gender_type_id: '',
  dv:0,
});

watch(() => formData.value.document_number, (nuevoValor) => {
  formData.value.dv = nuevoValor ? calculateDV(nuevoValor): props.data.dv;
});


watch(() => props.data, (newData) => {
  if (newData) {
    editingId.value = newData.id;

    formData.value = {
      first_name: newData.first_name ?? '',
      last_name: newData.last_name ?? '',
      company_name: newData.company_name ?? '',
      document_type_id: newData.document_type_id ?? '',
      document_number: newData.document_number ?? '',
      document_from: newData.document_from ?? '',
      organization_type_id: newData.organization_type_id ?? '',
      birth_date: newData.birth_date ?? '',
      gender_type_id: newData.gender_type_id ?? '',
      dv: calculateDV(newData.document_number) ?? 0,
    };
  }
}, { immediate: true });


const savePerson = () => {
  LoadingService.show();
  PersonService.createPerson(formData.value)
      .then(resp => {
        AlertService.showSuccess('Operación exitosa', resp.message);
        resetForm();
        emit('reload');
      }).catch(err => {
    AlertService.showError('Error', err);
  }).finally(() => LoadingService.hide());
};

const updatePerson = () => {
  LoadingService.show();
  PersonService.updatePerson(editingId.value, formData.value)
      .then(resp => {
        AlertService.showSuccess('Operación exitosa', resp.message);
        resetForm();
        emit('reload');
      }).catch(err => {
    AlertService.showError('Error', err);
  }).finally(() => LoadingService.hide());
};

const resetForm = () => {
  formData.value = { ...props.data};
};
</script>

