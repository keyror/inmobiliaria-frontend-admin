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
        :rules="fiscalProfileSchema.economic_activities"
        name="economic_activities"
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
        :rules="fiscalProfileSchema.taxe_types"
        name="taxe_types"
    />

    <CommonInputfieldsSelectfield
        v-model="form.responsible_for_vat_type_id"
        classes="col-md-6 col-sm-6"
        label="Responsable IVA"
        :data="lookups.opSiNo"
        :labelField="'name'"
        star="*"
        :rules="fiscalProfileSchema.responsible_for_vat_type_id"
        name="responsible_for_vat_type_id"
    />

    <CommonInputfieldsTextfield
        v-model="form.vat_withholding"
        type="number"
        classes="col-md-6 col-sm-6"
        label="Retención IVA (%)"
        placeholder="Ej: 19"
        :rules="fiscalProfileSchema.vat_withholding"
        name="vat_withholding"
    />

    <CommonInputfieldsTextfield
        v-model="form.income_tax_withholding"
        type="number"
        classes="col-md-6 col-sm-6"
        label="Retención en la Fuente (%)"
        placeholder="Ej: 11"
        :rules="fiscalProfileSchema.income_tax_withholding"
        name="income_tax_withholding"
    />

    <CommonInputfieldsTextfield
        v-model="form.ica_withholding"
        type="number"
        classes="col-md-6 col-sm-6"
        label="Retención ICA (%)"
        placeholder="Ej: 1.5"
        :rules="fiscalProfileSchema.ica_withholding"
        name="ica_withholding"
    />

    <CommonInputfieldsTextfield
        v-model="form.rental_fee"
        type="number"
        classes="col-md-6 col-sm-6"
        label="Canon de arrendamiento"
        placeholder="Ej: 1.5"
        :rules="fiscalProfileSchema.rental_fee"
        name="rental_fee"
    />
  </form>
</template>
<script lang="ts" setup>
import type { ILookup } from "~/interfaces/ILookup";
import type { IFiscalProfile } from "~/interfaces/IFiscalProfile";
import { useValidator } from "@/composables/useValidator";
import { fiscalProfileSchema } from "@/utils/validations/ficalProfile.schema"

const { validateForm, resetErrors } = useValidator();

const props = defineProps<{
  data?: IFiscalProfile,
  lookups: {
    opSiNo: ILookup[],
    taxeType: ILookup[],
    economicActivity: ILookup[]
  },
  isEditing?: boolean
}>();

const emit = defineEmits<{
  (e: "sendForm", payload: Partial<IFiscalProfile>): void;
  (e: "formInvalid", payload: boolean): void;
  (e: "reload"): void;
}>();

const initialForm: Partial<IFiscalProfile> = {
  responsible_for_vat_type_id: "",
  vat_withholding: "",
  income_tax_withholding: "",
  ica_withholding: "",
  taxe_types: [],
  rental_fee: "",
  economic_activities: []
};

const form = ref({ ...initialForm });
const formOriginal = ref({ ...initialForm });

watch(() => props.data, (newData) => {
      if (newData) {
        const modAttributes = {
          ...newData,
          taxe_types: newData.taxe_types?.map(t => t.taxe_type_id) ?? [],
          economic_activities: newData.economic_activities?.map(e => e.economic_activity_type_id) ?? []
        }

        form.value = { ...modAttributes };
        formOriginal.value = { ...modAttributes };
      }
}, { immediate: true });

const sendForm = () => {
  const isValid = validateForm(form.value, fiscalProfileSchema);

  if (isValid) {
    emit("sendForm", form.value);
  } else {
    emit("formInvalid", true);
  }

};

const reset = () => {
  form.value = { ...formOriginal.value };
  resetErrors();
};

defineExpose({
  sendForm,
  reset
});
</script>
<style scoped>
</style>
