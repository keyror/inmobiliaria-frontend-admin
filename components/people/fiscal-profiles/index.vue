<template>
  <div class="card-header ps-0">
    <h5>{{ props.isEditing ? ' Editar Perfil Fiscal' : 'Crear Perfil Fiscal' }}</h5>
  </div>
  <form class="row gx-3" @submit.prevent="sendForm">
    <CommonInputfieldsSelectfield
        v-model="form.economic_activities"
        classes="col-md-6 col-sm-6"
        label="Actividades ecónomicas"
        :data="lookups.economicActivity"
        :labelField="'name'"
        concat
        :concatField="'code'"
        :multiple="true"
        :searchable="true"
        star="*"
    />

    <CommonInputfieldsSelectfield
        v-model="form.taxe_types"
        classes="col-md-6 col-sm-6"
        label="Responsabilidad Fiscal"
        :data="lookups.taxeType"
        :labelField="'name'"
        :multiple="true"
        :searchable="true"
        star="*"
    />

    <CommonInputfieldsSelectfield
        v-model="form.responsible_for_vat_type_id"
        classes="col-md-6 col-sm-6"
        label="Responsable IVA"
        :data="lookups.vatType"
        :labelField="'name'"
        star="*"
    />

    <CommonInputfieldsTextfield
        v-model="form.vat_withholding"
        type="number"
        classes="col-md-6 col-sm-6"
        label="Retención IVA (%)"
        placeholder="Ej: 19"
    />

    <CommonInputfieldsTextfield
        v-model="form.income_tax_withholding"
        type="number"
        classes="col-md-6 col-sm-6"
        label="Retención en la Fuente (%)"
        placeholder="Ej: 11"
    />

    <CommonInputfieldsTextfield
        v-model="form.ica_withholding"
        type="number"
        classes="col-md-6 col-sm-6"
        label="Retención ICA (%)"
        placeholder="Ej: 1.5"
    />

    <CommonInputfieldsTextfield
        v-model="form.rental_fee"
        type="number"
        classes="col-md-6 col-sm-6"
        label="Canon de arrendamiento"
        placeholder="Ej: 1.5"
    />
  </form>
</template>
<script lang="ts" setup>
import type { ILookup } from "~/interfaces/ILookup";
import type { IFiscalProfile } from "~/interfaces/IFiscalProfile";
import * as yup from 'yup'

const props = defineProps<{
  data?: IFiscalProfile,
  lookups: {
    vatType: ILookup[],
    taxeType: ILookup[],
    economicActivity: ILookup[]
  },
  isEditing?: boolean
}>();

const emit = defineEmits<{
  (e: "sendForm", fiscalProfile: Partial<IFiscalProfile>): void;
  (e: "reload"): void;
}>();

const initialForm: Partial<IFiscalProfile> = {
  tax_regime: "",
  responsible_for_vat_type_id: "",
  vat_withholding: "",
  income_tax_withholding: "",
  ica_withholding: "",
  taxe_type_id: "",
  taxe_types: [],
  rental_fee: ""
};

const form = ref({ ...initialForm });
const formOriginal = ref({ ...initialForm });

watch(() => props.data, (newData) => {
      if (newData) {
        const modAttributes = {
          ...newData,
          taxe_types: newData.taxe_types?.map(t => t.type.id) ?? []
        }

        form.value = { ...modAttributes };
        formOriginal.value = { ...modAttributes };
      }
}, { immediate: true });

const sendForm = () => {
  emit("sendForm", form.value);
};

const reset = () => {
  form.value = { ...formOriginal.value };
};

defineExpose({
  sendForm,
  reset
});
</script>
<style scoped>
</style>
