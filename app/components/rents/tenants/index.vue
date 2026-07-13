<template>
  <div>
    <div class="card-header ps-0 d-flex justify-content-between align-items-center">
      <h5>Arrendatarios y Codeudores</h5>
      <button type="button" class="btn btn-pill btn-gradient color-4" @click="addTenant">
        <i class="bi bi-plus-circle me-1"></i> Agregar Arrendatario
      </button>
    </div>

    <div v-if="fields.length === 0" class="alert alert-info">
      Debe agregar al menos un arrendatario.
    </div>

    <div v-for="(field, index) in fields" :key="field.key" class="card mb-3 border">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Arrendatario #{{ index + 1 }}</h6>
          <button
            type="button"
            class="btn btn-dashed color-4"
            :disabled="fields.length === 1"
            @click="removeTenant(index)"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">
          <CommonInputfieldsPersonselect
            v-model="field.value.tenant_id"
            :error="getFieldError(index, 'tenant_id')"
            :excludeIds="excludedTenantIds(index)"
            :initialPeople="field.value.tenant?.id ? [field.value.tenant] : []"
            classes="col-md-6"
            label="Arrendatario"
            star="*"
          />

          <CommonInputfieldsPersonselect
            v-model="field.value.codebtor_id"
            :error="getFieldError(index, 'codebtor_id')"
            :excludeIds="excludedCoDebtorIds(index)"
            :initialPeople="field.value.codebtor?.id ? [field.value.codebtor] : []"
            classes="col-md-6"
            label="Codeudor (opcional)"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFieldArray } from "vee-validate";
import { useRentTenantsForm } from "~/composables/forms/useRentTenantsForm";

const props = defineProps<{
  data?: any[];
  isEditing?: boolean;
}>();

const { validate, values, resetForm, errors, setErrors } = useRentTenantsForm();
const { remove, push, fields } = useFieldArray<any>("rent_tenants");

const hasTriedSubmit = ref(false);

const getFieldError = (index: number, field: string): string => {
  if (!hasTriedSubmit.value) return "";
  const errorsMap = errors.value as Record<string, string>;
  return (
    errorsMap[`rent_tenants[${index}].${field}`] ||
    errorsMap[`rent_tenants.${index}.${field}`] ||
    ""
  );
};

const emptyTenant = () => ({ tenant_id: "", codebtor_id: null, percentage: null });

const excludedTenantIds = (currentIndex: number) =>
  values.rent_tenants
    ?.filter((_, i) => i !== currentIndex)
    .map((t) => t.tenant_id)
    .filter(Boolean) ?? [];

const excludedCoDebtorIds = (currentIndex: number) =>
  values.rent_tenants
    ?.filter((_, i) => i !== currentIndex)
    .map((t) => t.codebtor_id)
    .filter(Boolean) ?? [];

watch(
  () => props.data,
  (newData) => {
    hasTriedSubmit.value = false;
    resetForm({
      values: {
        rent_tenants:
          newData && newData.length > 0
            ? newData.map((item) => ({ ...item }))
            : [emptyTenant()],
      },
    });
  },
  { immediate: true },
);

const addTenant = () => push(emptyTenant());

const removeTenant = (index: number) => {
  if (fields.value.length > 1) remove(index);
};

defineExpose({
  async validateForm() {
    hasTriedSubmit.value = true;
    const result = await validate();
    return result.valid;
  },
  getValues() {
    return values.rent_tenants;
  },
  reset() {
    hasTriedSubmit.value = false;
    resetForm();
  },
  setBackendErrors(backendErrors: Record<string, string>) {
    hasTriedSubmit.value = true;
    setErrors(backendErrors);
  },
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
