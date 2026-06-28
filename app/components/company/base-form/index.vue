<template>
  <div class="page-body">
    <CommonBreadcrumb page="Empresa" title="Configuración de empresa" />

    <div class="container-fluid">
      <nav class="admin-theme-tabs">
        <div id="nav-tab" class="nav nav-tabs" role="tablist">
          <button
            :class="{ active: activeTab === 'company' }"
            class="nav-link"
            type="button"
            @click="switchTab('company')"
          >
            Empresa
          </button>
          <button
            :class="{ active: activeTab === 'addresses' }"
            class="nav-link"
            type="button"
            @click="switchTab('addresses')"
          >
            Dirección
          </button>
          <button
            :class="{ active: activeTab === 'contacts' }"
            class="nav-link"
            type="button"
            @click="switchTab('contacts')"
          >
            Contacto
          </button>
          <button
            :class="{ active: activeTab === 'publish_channels' }"
            class="nav-link"
            type="button"
            @click="switchTab('publish_channels')"
          >
            Redes sociales
          </button>
        </div>
      </nav>

      <div class="tab-content mt-4">
        <div class="container-fluid">
          <div class="card">
            <div class="card-body admin-form">
              <div v-show="activeTab === 'company'">
                <CompanyGeneral
                  ref="companyRef"
                  :data="company"
                  :isEditing="isEditing"
                />
              </div>

              <div v-show="activeTab === 'addresses'">
                <Addresses
                  ref="addressesRef"
                  :data="company?.addresses"
                  :isEditing="isEditing"
                  :lookups="addressesLookups"
                  :single="true"
                />
              </div>

              <div v-show="activeTab === 'contacts'">
                <div class="alert alert-info d-flex align-items-center gap-2">
                  <i class="fa fa-info-circle"></i>
                  <span>
                    El contacto marcado como principal recibirá los correos del
                    formulario de contacto y los mensajes enviados por WhatsApp.
                  </span>
                </div>

                <Contacts
                  ref="contactsRef"
                  :data="company?.contacts"
                  :isEditing="isEditing"
                  :single="false"
                />
              </div>

              <div v-show="activeTab === 'publish_channels'">
                <div class="alert alert-info d-flex align-items-center gap-2">
                  <i class="fa fa-info-circle"></i>
                  <span>
                    Los canales con enlace externo se mostrarán en el footer del
                    sitio público.
                  </span>
                </div>

                <PublishChannels
                  ref="publishChannelsRef"
                  :data="company?.publish_channels"
                  :lookups="publishChannelsLookups"
                  :isEditing="isEditing"
                />
              </div>

              <div v-if="canSaveCompany" class="form-btn mt-3">
                <button class="btn btn-pill btn-gradient color-4" @click="save">
                  {{ isEditing ? "Actualizar" : "Crear" }}
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
import Addresses from "~/components/addresses/index.vue";
import CompanyGeneral from "~/components/company/general/index.vue";
import Contacts from "~/components/contacts/index.vue";
import PublishChannels from "~/components/publish-channels/index.vue";
import { useApiHandler } from "~/composables/useApiHandler";
import { Constants } from "~/constants/Constants";
import AlertService from "~/services/AlertService";
import CompanyService from "~/services/CompanyService";

import type { ICompany } from "~/interfaces/ICompany";
import type { ISaveCompany } from "~/interfaces/ISaveCompany";

const { run } = useApiHandler();
const { can } = useAuthorization();

const companyRef = ref<InstanceType<typeof CompanyGeneral> | null>(null);
const addressesRef = ref<InstanceType<typeof Addresses> | null>(null);
const contactsRef = ref<InstanceType<typeof Contacts> | null>(null);
const publishChannelsRef = ref<InstanceType<typeof PublishChannels> | null>(null);

const activeTab = ref<string>("company");
const company = ref<ICompany | null>();
const isEditing = computed(() => !!company.value);
const canSaveCompany = computed(() =>
  isEditing.value ? can("companies.edit") : can("companies.create"),
);

const { lookups } = useLookups([
  Constants.ROAD_TYPE,
  Constants.LETTER,
  Constants.ORIENTATION,
  Constants.STRATUM,
  Constants.COUNTRY,
  Constants.DEPARTMENT,
  Constants.CITY,
  Constants.PUBLISH_CHANNEL,
  Constants.STATUS,
]);

const switchTab = (tab: string) => {
  activeTab.value = tab;
};

const { distributeErrors } = useFormErrorDistributor(
  {
    company: companyRef,
    addresses: addressesRef,
    contacts: contactsRef,
    publish_channels: publishChannelsRef,
  },
  {
    company: "company",
    addresses: "addresses",
    contacts: "contacts",
    publish_channels: "publish_channels",
  },
  switchTab,
);

const hasValue = (value: unknown): boolean => {
  if (Array.isArray(value)) return value.some(hasValue);
  if (value && typeof value === "object") {
    return Object.entries(value).some(
      ([key, nestedValue]) => key !== "is_principal" && hasValue(nestedValue),
    );
  }

  return value !== null && value !== undefined && String(value).trim() !== "";
};

const getCompany = async () => {
  const response = await run(CompanyService.getCurrentCompany());
  if (response) {
    company.value = response.data ?? null;
  }
};

const save = async () => {
  if (!canSaveCompany.value) return;

  const forms = [
    { key: "company", ref: companyRef, optional: false },
    { key: "addresses", ref: addressesRef, optional: true },
    { key: "contacts", ref: contactsRef, optional: true },
    { key: "publish_channels", ref: publishChannelsRef, optional: true },
  ];

  const data: ISaveCompany = {};

  for (const form of forms) {
    const values = form.ref.value?.getValues();

    if (form.optional && !hasValue(values)) continue;

    const isValid = await form.ref.value?.validateForm();

    if (!isValid) {
      switchTab(form.key);
      await AlertService.showFormError();
      return;
    }

    if (form.key === "company") data.company = values;
    if (form.key === "addresses") data.addresses = values;
    if (form.key === "contacts") data.contacts = values;
    if (form.key === "publish_channels") data.publish_channels = values;
  }

  const promise = isEditing.value
    ? CompanyService.updateCompany(data)
    : CompanyService.createCompany(data);

  const response = await run(promise, {
    showSuccess: true,
    successMessage: isEditing.value
      ? "Empresa actualizada correctamente"
      : "Empresa creada correctamente",
    setErrors: distributeErrors,
  });

  if (response) {
    await getCompany();
  }
};

const cancel = () => {
  companyRef.value?.reset();
  addressesRef.value?.reset();
  contactsRef.value?.reset();
  publishChannelsRef.value?.reset();
};

const addressesLookups = computed(() => ({
  roadTypes: lookups.value[Constants.ROAD_TYPE],
  letters: lookups.value[Constants.LETTER],
  orientations: lookups.value[Constants.ORIENTATION],
  strata: lookups.value[Constants.STRATUM],
  country: lookups.value[Constants.COUNTRY],
  cities: lookups.value[Constants.CITY],
  departments: lookups.value[Constants.DEPARTMENT],
}));

const publishChannelsLookups = computed(() => ({
  publishChannels: lookups.value[Constants.PUBLISH_CHANNEL] ?? [],
  status: lookups.value[Constants.STATUS] ?? [],
}));

getCompany();
</script>

<style scoped></style>
