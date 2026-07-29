<template>
  <div class="page-body">
    <CommonBreadcrumb page="Empresa" title="Configuración de empresa" />

    <div class="container-fluid">
      <CommonTabsNav v-model="activeTab" :tabs="tabsConfig" />

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
                <div class="alert alert-info d-flex align-items-center gap-2 mb-3">
                  <i class="fa fa-info-circle"></i>
                  <span>
                    La dirección principal de la empresa se mostrará en la
                    sección <strong>Información de contacto</strong> del detalle
                    de propiedades en el sitio público.
                  </span>
                </div>
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

              <div v-show="activeTab === 'account_banks'">
                <AccountBanks
                  ref="accountBanksRef"
                  :data="company?.account_banks"
                  :isEditing="isEditing"
                  :lookups="accountBanksLookups"
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

              <div v-show="activeTab === 'settings'">
                <CompanySettings
                  ref="settingsRef"
                  :data="company?.company_setting"
                  :contacts="company?.contacts ?? []"
                  :isEditing="isEditing"
                  @go-to-contacts="switchTab('contacts')"
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
import AccountBanks from "~/components/account-banks/index.vue";
import Addresses from "~/components/addresses/index.vue";
import CompanyGeneral from "~/components/company/general/index.vue";
import CompanySettings from "~/components/company/settings/index.vue";
import Contacts from "~/components/contacts/index.vue";
import PublishChannels from "~/components/publish-channels/index.vue";
import { useApiHandler } from "~/composables/useApiHandler";
import { Constants } from "~/constants/Constants";
import AlertService from "~/services/AlertService";
import CompanyService from "~/services/CompanyService";
import { useBranchStore } from "~/store/branchStore";
import { useCompanySettingStore } from "~/store/companySettingStore";

import type { IAccountBank } from "~/interfaces/IAccountBank";
import type { IAddress } from "~/interfaces/IAddress";
import type { ICompany } from "~/interfaces/ICompany";
import type { ICompanySetting } from "~/interfaces/ICompanySetting";
import type { IContact } from "~/interfaces/IContact";
import type { IPublishChannel } from "~/interfaces/IPublishChannel";
import type { ISaveCompany } from "~/interfaces/ISaveCompany";

const { run } = useApiHandler();
const { can } = useAuthorization();
const branchStore = useBranchStore();
const companySettingStore = useCompanySettingStore();

const companyRef = ref<InstanceType<typeof CompanyGeneral> | null>(null);
const addressesRef = ref<InstanceType<typeof Addresses> | null>(null);
const contactsRef = ref<InstanceType<typeof Contacts> | null>(null);
const accountBanksRef = ref<InstanceType<typeof AccountBanks> | null>(null);
const publishChannelsRef = ref<InstanceType<typeof PublishChannels> | null>(
  null,
);
const settingsRef = ref<InstanceType<typeof CompanySettings> | null>(null);

const activeTab = ref<string>("company");

const tabsConfig = [
  { key: "company", label: "Empresa", required: true },
  { key: "addresses", label: "Dirección" },
  { key: "contacts", label: "Contacto" },
  { key: "account_banks", label: "Cuentas Bancarias" },
  { key: "publish_channels", label: "Redes sociales" },
  { key: "settings", label: "Configuración", required: true },
];

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
  Constants.ACCOUNT_BANKS,
  Constants.BANKS,
]);

const switchTab = (tab: string) => {
  activeTab.value = tab;
};

const { distributeErrors } = useFormErrorDistributor(
  {
    company: companyRef,
    addresses: addressesRef,
    contacts: contactsRef,
    account_banks: accountBanksRef,
    publish_channels: publishChannelsRef,
    company_setting: settingsRef,
  },
  {
    company: "company",
    addresses: "addresses",
    contacts: "contacts",
    account_banks: "account_banks",
    publish_channels: "publish_channels",
    company_setting: "settings",
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
    const mode = response.data?.company_setting?.text_case_mode ?? null;
    companySettingStore.setTextCaseMode(
      mode as Parameters<typeof companySettingStore.setTextCaseMode>[0],
    );
  }
};

const save = async () => {
  if (!canSaveCompany.value) return;

  const forms = [
    { key: "company", ref: companyRef, optional: false },
    { key: "addresses", ref: addressesRef, optional: true },
    { key: "contacts", ref: contactsRef, optional: true },
    { key: "account_banks", ref: accountBanksRef, optional: true },
    { key: "publish_channels", ref: publishChannelsRef, optional: true },
    { key: "settings", ref: settingsRef, optional: false },
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

    if (form.key === "company") data.company = values as Partial<ICompany>;
    if (form.key === "addresses") data.addresses = values as IAddress[];
    if (form.key === "contacts") data.contacts = values as IContact[];
    if (form.key === "account_banks") data.account_banks = values as IAccountBank[];
    if (form.key === "publish_channels") data.publish_channels = values as IPublishChannel[];
    if (form.key === "settings") data.company_setting = values as Partial<ICompanySetting>;
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
    await branchStore.load(true);
  }
};

const cancel = () => {
  companyRef.value?.reset();
  addressesRef.value?.reset();
  contactsRef.value?.reset();
  accountBanksRef.value?.reset();
  publishChannelsRef.value?.reset();
  settingsRef.value?.reset();
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

const accountBanksLookups = computed(() => ({
  banks: lookups.value[Constants.BANKS] ?? [],
  typeAccountBank: lookups.value[Constants.ACCOUNT_BANKS] ?? [],
}));

const publishChannelsLookups = computed(() => ({
  publishChannels: lookups.value[Constants.PUBLISH_CHANNEL] ?? [],
  status: lookups.value[Constants.STATUS] ?? [],
}));

getCompany();
</script>

<style scoped></style>
