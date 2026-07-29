<template>
  <div class="page-body">
    <CommonBreadcrumb
      :page="props.isEditing ? 'Editar Contrato' : 'Nuevo Contrato'"
      title="Gestión de Contratos"
    />

    <div class="container-fluid">
      <CommonTabsNav v-model="activeTab" :tabs="tabsConfig" />

      <div class="tab-content mt-4">
        <div class="container-fluid">
          <div class="card">
            <div class="card-body admin-form">
              <div v-show="activeTab === 'rent'">
                <RentsRent
                  ref="rentRef"
                  :data="rent"
                  :lookups="rentLookups"
                  :isEditing="props.isEditing"
                />
              </div>

              <div
                v-show="activeTab === 'tenants' || activeTab === 'codebtors'"
              >
                <RentsTenants
                  ref="tenantsRef"
                  :data="rent?.rent_tenant_codebtors"
                  :view="activeTab === 'codebtors' ? 'codebtor' : 'tenant'"
                  :isEditing="props.isEditing"
                />
              </div>

              <div v-show="activeTab === 'obligations'">
                <Obligations
                  ref="obligationsRef"
                  :data="rent?.rent_obligations"
                  :lookups="obligationsLookups"
                  :isEditing="props.isEditing"
                />
              </div>

              <div v-if="props.isEditing" v-show="activeTab === 'documents'">
                <RentsDocuments
                  :rentId="rentId"
                  :lookups="documentsLookups"
                />
              </div>

              <div class="form-btn mt-3" v-show="activeTab !== 'documents'">
                <button
                  class="btn btn-pill btn-gradient color-4"
                  @click="save"
                >
                  {{ props.isEditing ? "Actualizar" : "Crear" }}
                </button>

                <button
                  class="btn btn-pill btn-dashed color-4"
                  type="button"
                  @click="cancel"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@vuepic/vue-datepicker/dist/main.css";
import { useApiHandler } from "~/composables/useApiHandler";
import { Constants } from "~/constants/Constants";
import AlertService from "~/services/AlertService";
import PropertyService from "~/services/PropertyService";
import RentService from "~/services/RentService";

import {
  Obligations,
  RentsRent,
  RentsTenants,
  RentsDocuments,
} from "#components";

const { run } = useApiHandler();

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const rentRef = ref<InstanceType<typeof RentsRent> | null>(null);
const tenantsRef = ref<InstanceType<typeof RentsTenants> | null>(null);
const obligationsRef = ref<InstanceType<typeof Obligations> | null>(null);

const activeTab = ref<string>("rent");

const tabsConfig = computed(() => [
  { key: "rent", label: "Contrato", required: true },
  { key: "tenants", label: "Arrendatario", required: true },
  { key: "codebtors", label: "Codeudor" },
  { key: "obligations", label: "Obligaciones" },
  { key: "documents", label: "Documentos", visible: props.isEditing },
]);

const route = useRoute();
const rentId = route.params.id as string;

const rent = ref<any>(null);

const { lookups } = useLookups([
  Constants.CONTRACT_TYPE,
  Constants.INCREMENT_TYPE,
  Constants.DOCUMENT_CATEGORY,
  Constants.DOCUMENT_STATUS,
  Constants.DOCUMENT_TEMPLATE_TYPE,
  Constants.BANKS,
  Constants.TAXE_TYPE,
  Constants.CITY,
  Constants.OBLIGATION_TYPE,
  Constants.FREQUENCY,
  Constants.STATUS,
]);

const allProperties = ref<any[]>([]);

const loadProperties = async () => {
  const response = await run(
    PropertyService.getProperties({ page: 1, perPage: 200, sortBy: "title", sortType: "asc" }),
  );
  if (response) {
    allProperties.value = response.data?.data ?? [];
  }
};

const switchTab = (tab: string) => {
  activeTab.value = tab;
};

const { distributeErrors } = useFormErrorDistributor(
  {
    rent: rentRef,
    tenants: tenantsRef,
    rent_obligations: obligationsRef,
  },
  {
    rent: "rent",
    tenants: "tenants",
    rent_obligations: "obligations",
  },
  switchTab,
);

const hasValue = (value: unknown): boolean => {
  if (Array.isArray(value)) return value.some(hasValue);
  if (value && typeof value === "object") {
    return Object.values(value as object).some(hasValue);
  }
  return value !== null && value !== undefined && String(value).trim() !== "";
};

const save = async () => {
  const forms = [
    { key: "rent", ref: rentRef, optional: false },
    { key: "tenants", ref: tenantsRef, optional: false },
    { key: "obligations", ref: obligationsRef, optional: true },
  ];

  const payload: Record<string, any> = {};

  for (const form of forms) {
    const values = form.ref.value?.getValues();

    if (form.optional && !hasValue(values)) continue;

    const isValid = await form.ref.value?.validateForm();

    if (!isValid) {
      switchTab(form.key);
      await AlertService.showFormError();
      return;
    }

    if (form.key === "rent") payload.rent = values;
    if (form.key === "tenants") payload.rent_tenants = values;
    if (form.key === "obligations") payload.rent_obligations = values;
  }

  const promise = props.isEditing
    ? RentService.updateRent(rentId, payload)
    : RentService.createRent(payload);

  const response = await run(promise, {
    showSuccess: true,
    successMessage: props.isEditing
      ? "Contrato actualizado correctamente"
      : "Contrato creado correctamente",
    setErrors: distributeErrors,
  });

  if (response) {
    props.isEditing ? await getRent() : cancel();
  }
};

const cancel = () => {
  rentRef.value?.reset();
  tenantsRef.value?.reset();
  obligationsRef.value?.reset();
  navigateTo("/rents/all");
};

const rentLookups = computed(() => ({
  properties: allProperties.value,
  contractTypes: lookups.value[Constants.CONTRACT_TYPE] ?? [],
  incrementTypes: lookups.value[Constants.INCREMENT_TYPE] ?? [],
  banks: lookups.value[Constants.BANKS] ?? [],
  taxeTypes: lookups.value[Constants.TAXE_TYPE] ?? [],
  cities: lookups.value[Constants.CITY] ?? [],
}));

const documentsLookups = computed(() => ({
  documentCategories: lookups.value[Constants.DOCUMENT_CATEGORY] ?? [],
  documentStatuses: lookups.value[Constants.DOCUMENT_STATUS] ?? [],
  documentTemplateTypes: lookups.value[Constants.DOCUMENT_TEMPLATE_TYPE] ?? [],
}));

const obligationsLookups = computed(() => ({
  obligationTypes: lookups.value[Constants.OBLIGATION_TYPE] ?? [],
  frequency: lookups.value[Constants.FREQUENCY] ?? [],
  status: lookups.value[Constants.STATUS] ?? [],
}));

const getRent = async () => {
  if (!props.isEditing || !rentId) return;
  const response = await run(RentService.getRent(rentId));
  if (response) {
    rent.value = response.data;
  }
};

loadProperties();
getRent();
</script>

<style scoped></style>
