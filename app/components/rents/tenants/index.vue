<template>
  <div>
    <!-- ── ARRENDATARIOS ── -->
    <template v-if="view !== 'codebtor'">
      <div class="card-header ps-0 d-flex justify-content-between align-items-center">
        <h5>Arrendatarios</h5>
        <button type="button" class="btn btn-pill btn-gradient color-4" @click="addTenant">
          <i class="bi bi-plus-circle me-1"></i> Agregar Arrendatario
        </button>
      </div>

      <div v-if="tenantFields.length === 0" class="alert alert-info mt-3">
        Debe agregar al menos un arrendatario.
      </div>

      <div v-for="(field, index) in tenantFields" :key="field.key" class="card mb-3 border mt-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <h6 class="mb-0">Arrendatario #{{ index + 1 }}</h6>
            <button
              type="button"
              class="btn btn-dashed color-4"
              :disabled="tenantFields.length === 1"
              @click="removeTenant(index)"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>

          <form class="row gx-3">
            <CommonInputfieldsPersonselect
              v-model="field.value.tenant_id"
              :error="getTenantError(index)"
              :excludeIds="excludedTenantIds(index)"
              :initialPeople="field.value.tenant?.id ? [field.value.tenant] : []"
              classes="col-md-6"
              label="Arrendatario"
              star="*"
            />
          </form>
        </div>
      </div>
    </template>

    <!-- ── CODEUDORES ── -->
    <template v-else>
      <div class="card-header ps-0 d-flex justify-content-between align-items-center">
        <h5>Codeudores</h5>
        <button type="button" class="btn btn-pill btn-gradient color-4" @click="addCodebtor">
          <i class="bi bi-plus-circle me-1"></i> Agregar Codeudor
        </button>
      </div>

      <div v-if="coDebtorFields.length === 0" class="text-muted small mt-3 ps-1">
        No hay codeudores asociados. Use el botón para agregar.
      </div>

      <div v-for="(field, index) in coDebtorFields" :key="field.key" class="card mb-3 border mt-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <h6 class="mb-0">Codeudor #{{ index + 1 }}</h6>
            <button
              type="button"
              class="btn btn-dashed color-4"
              @click="removeCodebtor(index)"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>

          <form class="row gx-3">
            <CommonInputfieldsPersonselect
              v-model="field.value.codebtor_id"
              :error="getCoDebtorError(index)"
              :excludeIds="excludedCoDebtorIds(index)"
              :initialPeople="field.value.codebtor?.id ? [field.value.codebtor] : []"
              classes="col-md-6"
              label="Codeudor"
            />
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useFieldArray } from "vee-validate";
import { useRentTenantsForm } from "~/composables/forms/useRentTenantsForm";

const props = defineProps<{
  data?: any[];
  isEditing?: boolean;
  view?: 'tenant' | 'codebtor';
}>();

const { validate, values, resetForm, errors, setErrors } = useRentTenantsForm();

const { remove: removeTenantField, push: pushTenant, fields: tenantFields } =
  useFieldArray<any>("rent_tenants");
const { remove: removeCoDebtorField, push: pushCodebtor, fields: coDebtorFields } =
  useFieldArray<any>("rent_codebtors");

const hasTriedSubmit = ref(false);

const getTenantError = (index: number): string => {
  if (!hasTriedSubmit.value) return "";
  const errorsMap = errors.value as Record<string, string>;
  return (
    errorsMap[`rent_tenants[${index}].tenant_id`] ||
    errorsMap[`rent_tenants.${index}.tenant_id`] ||
    ""
  );
};

const getCoDebtorError = (index: number): string => {
  if (!hasTriedSubmit.value) return "";
  const errorsMap = errors.value as Record<string, string>;
  return (
    errorsMap[`rent_codebtors[${index}].codebtor_id`] ||
    errorsMap[`rent_codebtors.${index}.codebtor_id`] ||
    ""
  );
};

const excludedTenantIds = (currentIndex: number) =>
  (values.rent_tenants ?? [])
    .filter((_, i) => i !== currentIndex)
    .map((t: any) => t.tenant_id)
    .filter(Boolean);

const excludedCoDebtorIds = (currentIndex: number) =>
  (values.rent_codebtors ?? [])
    .filter((_, i) => i !== currentIndex)
    .map((c: any) => c.codebtor_id)
    .filter(Boolean);

watch(
  () => props.data,
  (newData) => {
    hasTriedSubmit.value = false;
    const pairs = newData ?? [];

    const tenants =
      pairs.length > 0
        ? pairs.map((pair: any) => ({ tenant_id: pair.tenant_id ?? "", tenant: pair.tenant }))
        : [{ tenant_id: "" }];

    const coDebtorPairs = pairs.filter((pair: any) => pair.codebtor_id);
    const codebtors =
      coDebtorPairs.length > 0
        ? coDebtorPairs.map((pair: any) => ({ codebtor_id: pair.codebtor_id, codebtor: pair.codebtor }))
        : [{ codebtor_id: null }];

    resetForm({ values: { rent_tenants: tenants, rent_codebtors: codebtors } });
  },
  { immediate: true },
);

const addTenant = () => pushTenant({ tenant_id: "" });
const removeTenant = (index: number) => {
  if (tenantFields.value.length > 1) removeTenantField(index);
};

const addCodebtor = () => pushCodebtor({ codebtor_id: null });
const removeCodebtor = (index: number) => removeCoDebtorField(index);

defineExpose({
  async validateForm() {
    hasTriedSubmit.value = true;
    const result = await validate();
    return result.valid;
  },
  getValues() {
    const tenants: any[] = values.rent_tenants ?? [];
    const codebtors: any[] = values.rent_codebtors ?? [];
    const count = Math.max(tenants.length, codebtors.length);
    const firstTenantId = tenants[0]?.tenant_id || null;

    return Array.from({ length: count }, (_, i) => ({
      tenant_id: tenants[i]?.tenant_id || firstTenantId,
      codebtor_id: codebtors[i]?.codebtor_id || null,
      percentage: null,
    }));
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
