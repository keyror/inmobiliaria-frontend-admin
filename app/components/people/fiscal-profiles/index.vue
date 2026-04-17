<template>
  <div class="card-header ps-0">
    <h5>
      {{ props.isEditing ? " Editar Perfil Fiscal" : "Crear Perfil Fiscal" }}
    </h5>
  </div>

  <form class="row gx-3">
    <CommonInputfieldsSelectfield
      v-model="economic_activities"
      classes="col-md-6 col-sm-6"
      label="Actividades económicas"
      :data="lookups.economicActivity"
      :labelField="'name'"
      concat
      :concatField="'code'"
      :multiple="true"
      :searchable="true"
      star="*"
      :error="errors.economic_activities"
    />

    <CommonInputfieldsSelectfield
      v-model="taxe_types"
      classes="col-md-6 col-sm-6"
      label="Responsabilidad Fiscal"
      :data="lookups.taxeType"
      :labelField="'name'"
      :multiple="true"
      :searchable="true"
      star="*"
      :error="errors.taxe_types"
    />

    <CommonInputfieldsSelectfield
      v-model="responsible_for_vat_type_id"
      classes="col-md-6 col-sm-6"
      label="Responsable IVA"
      :data="lookups.opSiNo"
      :labelField="'name'"
      star="*"
      :error="errors.responsible_for_vat_type_id"
    />

    <CommonInputfieldsNumberfield
      v-model="vat_withholding"
      type="number"
      classes="col-md-6 col-sm-6"
      label="Retención IVA (%)"
      placeholder="Ej: 19"
      :error="errors.vat_withholding"
    />

    <CommonInputfieldsNumberfield
      v-model="income_tax_withholding"
      type="number"
      classes="col-md-6 col-sm-6"
      label="Retención en la Fuente (%)"
      placeholder="Ej: 11"
      :error="errors.income_tax_withholding"
    />

    <CommonInputfieldsNumberfield
      v-model="ica_withholding"
      type="number"
      classes="col-md-6 col-sm-6"
      label="Retención ICA (%)"
      placeholder="Ej: 1.5"
      :error="errors.ica_withholding"
    />

    <CommonInputfieldsNumberfield
      v-model="rental_fee"
      type="number"
      classes="col-md-6 col-sm-6"
      label="Canon de arrendamiento"
      placeholder="Ej: 1.5"
      :error="errors.rental_fee"
    />
  </form>
</template>
<script lang="ts" setup>
import { useFiscalProfileForm } from "~/composables/forms/useFiscalProfileForm";

import type { IFiscalProfile } from "~/interfaces/IFiscalProfile";
import type { ILookup } from "~/interfaces/ILookup";

const props = defineProps<{
  data?: IFiscalProfile;
  lookups: {
    opSiNo: ILookup[];
    taxeType: ILookup[];
    economicActivity: ILookup[];
  };
  isEditing?: boolean;
}>();

const form = useFiscalProfileForm();

const { defineField, validate, values, resetForm, errors, setErrors } = form;

const [economic_activities] = defineField("economic_activities");
const [taxe_types] = defineField("taxe_types");
const [responsible_for_vat_type_id] = defineField(
  "responsible_for_vat_type_id",
);
const [vat_withholding] = defineField("vat_withholding");
const [income_tax_withholding] = defineField("income_tax_withholding");
const [ica_withholding] = defineField("ica_withholding");
const [rental_fee] = defineField("rental_fee");

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      resetForm({
        values: {
          ...newData,
          taxe_types: newData.taxe_types?.map((t: any) => t.taxe_type_id) ?? [],
          economic_activities:
            newData.economic_activities?.map(
              (e: any) => e.economic_activity_type_id,
            ) ?? [],
        },
      });
    }
  },
  { immediate: true },
);

defineExpose({
  async validateForm() {
    const result = await validate();
    return result.valid;
  },
  getValues(): Partial<IFiscalProfile> | undefined {
    return values;
  },
  reset() {
    resetForm();
  },
  setBackendErrors(backendErrors: Record<string, string>) {
    setErrors(backendErrors);
  },
});
</script>
<style scoped></style>
