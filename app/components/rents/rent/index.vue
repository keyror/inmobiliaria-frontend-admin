<template>
  <div class="card-header ps-0">
    <h5>{{ props.isEditing ? "Editar Contrato" : "Crear Contrato" }}</h5>
  </div>

  <form class="row gx-3">
    <!-- Propiedad -->
    <CommonInputfieldsSelectfield
      v-model="property_id"
      :data="propertiesAsLookup"
      :error="errors.property_id"
      classes="col-md-6"
      label="Propiedad"
      labelField="name"
      star="*"
      searchable
    />

    <!-- Tipo de Contrato -->
    <CommonInputfieldsSelectfield
      v-model="contract_type_id"
      :data="props.lookups.contractTypes ?? []"
      :error="errors.contract_type_id"
      classes="col-md-3"
      label="Tipo de Contrato"
      labelField="name"
      star="*"
    />

    <!-- Estado -->
    <CommonInputfieldsSelectfield
      v-model="status"
      :data="statusOptions"
      :error="errors.status"
      classes="col-md-3"
      label="Estado"
      labelField="name"
      star="*"
    />

    <!-- N° Contrato -->
    <CommonInputfieldsTextfield
      v-model="contract_number"
      :error="errors.contract_number"
      classes="col-md-3"
      label="N° Contrato"
    />

    <!-- Fecha Inicio -->
    <div class="col-md-3">
      <label>Fecha Inicio <span class="font-danger">*</span></label>
      <VueDatePicker
        v-model="start_date"
        format="yyyy-MM-dd"
        model-type="yyyy-MM-dd"
        :enable-time-picker="false"
        :state="errors.start_date ? false : null"
      />
      <small v-if="errors.start_date" class="text-danger">{{ errors.start_date }}</small>
    </div>

    <!-- Fecha Fin -->
    <div class="col-md-3">
      <label>Fecha Fin</label>
      <VueDatePicker
        v-model="end_date"
        format="yyyy-MM-dd"
        model-type="yyyy-MM-dd"
        :enable-time-picker="false"
      />
    </div>

    <!-- Duración -->
    <CommonInputfieldsNumberfield
      v-model="duration"
      :error="errors.duration"
      classes="col-md-3"
      label="Duración (meses)"
    />

    <!-- Canon -->
    <CommonInputfieldsNumberfield
      v-model="canon"
      :error="errors.canon"
      classes="col-md-3"
      label="Canon mensual"
      star="*"
    />

    <!-- IVA -->
    <CommonInputfieldsNumberfield
      v-model="iva"
      :error="errors.iva"
      classes="col-md-3"
      label="IVA (%)"
    />

    <!-- Destino -->
    <CommonInputfieldsTextfield
      v-model="destination"
      :error="errors.destination"
      classes="col-md-3"
      label="Destino (vivienda / comercial)"
    />

    <!-- Actividad -->
    <CommonInputfieldsTextfield
      v-model="activity"
      :error="errors.activity"
      classes="col-md-3"
      label="Actividad"
    />

    <!-- Administración incluida -->
    <CommonInputfieldsCheckbox
      v-model="administration_included"
      name="administration_included"
      label="Administración incluida en canon"
      classes="col-md-3 d-flex align-items-end"
    />

    <!-- PH -->
    <CommonInputfieldsCheckbox
      v-model="is_ph"
      name="is_ph"
      label="Propiedad Horizontal (PH)"
      classes="col-md-3 d-flex align-items-end"
    />

    <!-- Asegurado -->
    <CommonInputfieldsCheckbox
      v-model="is_insured"
      name="is_insured"
      label="Contrato asegurado"
      classes="col-md-3 d-flex align-items-end"
    />

    <div class="col-12 mt-2"></div>

    <!-- Tipo de Incremento -->
    <CommonInputfieldsSelectfield
      v-model="increment_type_id"
      :data="props.lookups.incrementTypes ?? []"
      :error="errors.increment_type_id"
      classes="col-md-4"
      label="Tipo de Incremento"
      labelField="name"
    />

    <!-- Fecha de Ajuste -->
    <div class="col-md-4">
      <label>Fecha de Ajuste</label>
      <VueDatePicker
        v-model="adjustment_date"
        format="yyyy-MM-dd"
        model-type="yyyy-MM-dd"
        :enable-time-picker="false"
      />
    </div>

    <!-- Interés mora -->
    <CommonInputfieldsNumberfield
      v-model="interest_rate"
      :error="errors.interest_rate"
      classes="col-md-4"
      label="Interés mora (%)"
    />

    <!-- Ciudad firma -->
    <CommonInputfieldsTextfield
      v-model="signed_city"
      :error="errors.signed_city"
      classes="col-md-4"
      label="Ciudad de firma"
    />

    <!-- Fecha firma -->
    <div class="col-md-4">
      <label>Fecha de firma</label>
      <VueDatePicker
        v-model="signed_at"
        format="yyyy-MM-dd"
        model-type="yyyy-MM-dd"
        :enable-time-picker="false"
      />
    </div>

    <!-- Banco pago -->
    <CommonInputfieldsSelectfield
      v-model="payment_bank_id"
      :data="props.lookups.banks ?? []"
      :error="errors.payment_bank_id"
      classes="col-md-4"
      label="Banco de pago"
      labelField="name"
    />

    <!-- Cuenta consignación -->
    <CommonInputfieldsTextfield
      v-model="consignment_account"
      :error="errors.consignment_account"
      classes="col-md-6"
      label="Cuenta de consignación"
    />

    <!-- Notas internas -->
    <CommonInputfieldsTextarea
      v-model="internal_notes"
      :error="errors.internal_notes"
      classes="col-12"
      label="Notas internas"
    />

    <!-- Cláusulas adicionales -->
    <div class="col-12 mt-3">
      <label class="form-label fw-semibold">Cláusulas adicionales</label>
      <div class="text-muted mb-2" style="font-size: 0.82rem;">
        Texto libre que se imprimirá al final del contrato, después de las cláusulas estándar.
      </div>
      <div
        v-for="(clause, idx) in (additional_clauses ?? [])"
        :key="idx"
        class="d-flex gap-2 mb-2 align-items-start"
      >
        <textarea
          class="form-control"
          rows="2"
          :value="clause ?? ''"
          placeholder="Texto de la cláusula..."
          @input="updateClause(idx, ($event.target as HTMLTextAreaElement).value)"
        ></textarea>
        <button type="button" class="btn btn-dashed color-1" @click="removeClause(idx)">✕</button>
      </div>
      <button type="button" class="btn btn-dashed color-4" @click="addClause">+ Agregar cláusula</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import { useRentForm } from "~/composables/forms/useRentForm";
import type { ILookup } from "~/interfaces/ILookup";

const props = defineProps<{
  data?: any;
  lookups: {
    properties?: any[];
    contractTypes?: ILookup[];
    incrementTypes?: ILookup[];
    banks?: ILookup[];
  };
  isEditing?: boolean;
}>();

const statusOptions = [
  { id: "activo", name: "Activo", alias: "activo", code: "activo", is_active: true },
  { id: "pendiente", name: "Pendiente", alias: "pendiente", code: "pendiente", is_active: true },
  { id: "terminado", name: "Terminado", alias: "terminado", code: "terminado", is_active: true },
  { id: "suspendido", name: "Suspendido", alias: "suspendido", code: "suspendido", is_active: true },
] as any[];

const propertiesAsLookup = computed(() =>
  (props.lookups.properties ?? []).map((p: any) => ({
    ...p,
    name: p.title ?? p.name ?? "",
  })),
);

const form = useRentForm(props.data);
const { defineField, validate, values, resetForm, errors, setErrors } = form;

const [property_id] = defineField("property_id");
const [status] = defineField("status");
const [contract_number] = defineField("contract_number");
const [contract_type_id] = defineField("contract_type_id");
const [start_date] = defineField("start_date");
const [end_date] = defineField("end_date");
const [duration] = defineField("duration");
const [destination] = defineField("destination");
const [activity] = defineField("activity");
const [canon] = defineField("canon");
const [iva] = defineField("iva");
const [administration_included] = defineField("administration_included");
const [is_ph] = defineField("is_ph");
const [interest_rate] = defineField("interest_rate");
const [increment_type_id] = defineField("increment_type_id");
const [adjustment_date] = defineField("adjustment_date");
const [is_insured] = defineField("is_insured");
const [consignment_account] = defineField("consignment_account");
const [payment_bank_id] = defineField("payment_bank_id");
const [signed_city] = defineField("signed_city");
const [signed_at] = defineField("signed_at");
const [internal_notes] = defineField("internal_notes");
const [additional_clauses] = defineField("additional_clauses");

const addClause = () => {
  additional_clauses.value = [...((additional_clauses.value as string[]) ?? []), ""];
};

const removeClause = (idx: number) => {
  additional_clauses.value = ((additional_clauses.value as string[]) ?? []).filter(
    (_: string, i: number) => i !== idx,
  );
};

const updateClause = (idx: number, val: string) => {
  const arr = [...((additional_clauses.value as string[]) ?? [])];
  arr[idx] = val;
  additional_clauses.value = arr;
};

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      resetForm({ values: { ...newData } });
    }
  },
  { immediate: true },
);

defineExpose({
  async validateForm() {
    const result = await validate();
    return result.valid;
  },
  getValues() {
    return { ...values };
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
