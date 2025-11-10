<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header pb-0">
            <h5>Editar Perfil Fiscal</h5>
          </div>

          <div class="card-body admin-form">
            <form class="row gx-3" @submit.prevent="updateFiscalProfile">
              <p class="text-red">Pendiente mostrar actividades economicas</p>

              <CommonInputfieldsSelectfield
                  v-model="formData.responsible_for_vat_type_id"
                  classes="col-md-6 col-sm-6"
                  label="Responsable IVA"
                  :data="lookups.vatType"
                  :labelField="'name'"
                  star="*"
              />

              <CommonInputfieldsTextfield
                  v-model="formData.vat_withholding"
                  type="number"
                  classes="col-md-6 col-sm-6"
                  label="Retención IVA (%)"
                  placeholder="Ej: 19"
              />

              <CommonInputfieldsTextfield
                  v-model="formData.income_tax_withholding"
                  type="number"
                  classes="col-md-6 col-sm-6"
                  label="Retención de Renta (%)"
                  placeholder="Ej: 11"
              />

              <CommonInputfieldsTextfield
                  v-model="formData.ica_withholding"
                  type="number"
                  classes="col-md-6 col-sm-6"
                  label="Retención ICA (%)"
                  placeholder="Ej: 1.5"
              />

              <CommonInputfieldsSelectfield
                  v-model="formData.taxe_type_id"
                  classes="col-md-6 col-sm-6"
                  label="Responsabilidad Fiscal"
                  :data="lookups.taxeType"
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import PersonService from "@/services/PersonService";
import AlertService from "~/services/AlertService";
import LoadingService from "~/services/LoadingService";
import type {ILookup} from "~/interfaces/ILookup";

const props = defineProps<{
  data: any,
  lookups: {
    vatType: ILookup[],
    taxeType: ILookup[]
  }
}>();

const emit = defineEmits<{ (e: 'reload'): void }>();

const editingId = ref();

const formData = ref({
  person_id: '',
  tax_regime: '',
  responsible_for_vat_type_id: '',
  vat_withholding: '',
  income_tax_withholding: '',
  ica_withholding: '',
  taxe_type_id: ''
});

watch(() => props.data, (val) => {
  if (val) {
    editingId.value = val.id;

    formData.value = {
      person_id: val.person?.id ?? '',
      tax_regime: val.tax_regime ?? '',
      responsible_for_vat_type_id: val.responsible_for_vat_type_id ?? '',
      vat_withholding: val.vat_withholding ?? '',
      income_tax_withholding: val.income_tax_withholding ?? '',
      ica_withholding: val.ica_withholding ?? '',
      taxe_type_id: val.taxe_type_id ?? ''
    };
  }
}, { immediate: true });


const createFiscalProfile = () => {
  LoadingService.show();
  PersonService.createFiscalProfile(formData.value)
      .then((res) => {
        AlertService.showSuccess("Operación exitosa", res.message);
        resetForm();
        emit('reload');
      })
      .finally(() => LoadingService.hide());
};

const updateFiscalProfile = () => {
  LoadingService.show();
  PersonService.updateFiscalProfile(editingId.value, formData.value)
      .then((res) => {
        AlertService.showSuccess("Operación exitosa", res.message);
        resetForm();
        emit('reload');
      })
      .finally(() => LoadingService.hide());
};

const resetForm = () => {
  formData.value = { ...props.data};
};

</script>

<style scoped>
</style>
