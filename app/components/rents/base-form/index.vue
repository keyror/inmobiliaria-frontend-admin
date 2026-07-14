<template>
  <div class="page-body">
    <CommonBreadcrumb
      :page="props.isEditing ? 'Editar Contrato' : 'Nuevo Contrato'"
      title="Gestión de Contratos"
    />

    <div class="container-fluid">
      <nav class="admin-theme-tabs">
        <div id="nav-tab" class="nav nav-tabs" role="tablist">
          <button
            :class="{ active: activeTab === 'rent' }"
            class="nav-link"
            type="button"
            @click="switchTab('rent')"
          >
            Contrato
          </button>
          <button
            :class="{ active: activeTab === 'tenants' }"
            class="nav-link"
            type="button"
            @click="switchTab('tenants')"
          >
            Arrendatario
          </button>
          <button
            :class="{ active: activeTab === 'codebtors' }"
            class="nav-link"
            type="button"
            @click="switchTab('codebtors')"
          >
            Codeudor
          </button>
          <button
            v-if="props.isEditing"
            :class="{ active: activeTab === 'documents' }"
            class="nav-link"
            type="button"
            @click="switchTab('documents')"
          >
            Documentos
          </button>
        </div>
      </nav>

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

              <div v-show="activeTab === 'tenants' || activeTab === 'codebtors'">
                <RentsTenants
                  ref="tenantsRef"
                  :data="rent?.rent_tenant_codebtors"
                  :view="activeTab === 'codebtors' ? 'codebtor' : 'tenant'"
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
import RentService from "~/services/RentService";
import PropertyService from "~/services/PropertyService";

const { run } = useApiHandler();

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const rentRef = ref<any>(null);
const tenantsRef = ref<any>(null);

const activeTab = ref<string>("rent");

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
  { rent: rentRef, tenants: tenantsRef },
  { rent: "rent", tenants: "tenants" },
  switchTab,
);

const save = async () => {
  const forms = [
    { key: "rent", ref: rentRef, optional: false },
    { key: "tenants", ref: tenantsRef, optional: false },
  ];

  const payload: Record<string, any> = {};

  for (const form of forms) {
    const isValid = await form.ref.value?.validateForm();

    if (!isValid) {
      switchTab(form.key);
      await AlertService.showFormError();
      return;
    }

    if (form.key === "rent") {
      payload.rent = form.ref.value?.getValues();
    }
    if (form.key === "tenants") {
      payload.rent_tenants = form.ref.value?.getValues();
    }
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
