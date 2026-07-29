<template>
  <div class="page-body">
    <CommonBreadcrumb
      :page="$t('property.breadCrumbPage')"
      :title="$t('property.breadCrumbTitle')"
    />

    <div class="container-fluid">
      <CommonTabsNav v-model="activeTab" :tabs="tabsConfig" />

      <div class="tab-content mt-4">
        <div class="container-fluid">
          <div class="card">
            <div class="card-body admin-form">
              <div v-show="activeTab === 'property'">
                <PropertiesProperty
                  ref="propertyRef"
                  :lookups="propertyLookups || {}"
                  :data="property"
                  :isEditing="props.isEditing"
                />
              </div>

              <div v-show="activeTab === 'ownerships'">
                <PropertiesOwnerships
                  ref="ownershipsRef"
                  :data="property?.ownerships"
                  :isEditing="props.isEditing"
                  :lookups="ownershipsLookups"
                />
              </div>

              <div v-show="activeTab === 'addresses'">
                <Addresses
                  ref="addressesRef"
                  :data="property?.addresses"
                  :isEditing="props.isEditing"
                  :lookups="addressesLookups"
                />
              </div>

              <div v-show="activeTab === 'contacts'">
                <div class="alert alert-info d-flex align-items-start gap-2 mb-3">
                  <i class="fa fa-info-circle mt-1 flex-shrink-0"></i>
                  <span>
                    En el sitio público, el detalle de la propiedad mostrará el
                    correo, celular y teléfono del contacto marcado como
                    <strong>principal</strong>. Si el contacto tiene celular, el
                    botón de <strong>WhatsApp</strong> usará ese número; si solo
                    tiene teléfono fijo, se usará como fallback. El formulario
                    de contacto enviará el mensaje a los correos de
                    <strong>todos</strong> los contactos registrados.
                  </span>
                </div>
                <Contacts
                  ref="contactsRef"
                  :data="property?.contacts"
                  :isEditing="props.isEditing"
                  :single="false"
                />
              </div>

              <div v-show="activeTab === 'areas'">
                <Areas
                  ref="areasRef"
                  :data="property?.areas"
                  :isEditing="props.isEditing"
                  :lookups="areasLookups"
                />
              </div>

              <div v-show="activeTab === 'publishChannels'">
                <PublishChannels
                  ref="publishChannelsRef"
                  :data="property?.publish_channels"
                  :lookups="publishChannelsLookups"
                />
              </div>

              <div v-show="activeTab === 'obligations'">
                <Obligations
                  ref="obligationsRef"
                  :data="property?.obligations"
                  :lookups="obligationsLookups"
                />
              </div>

              <div class="form-btn mt-3">
                <button class="btn btn-pill btn-gradient color-4" @click="save">
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

import type { IAddress } from "~/interfaces/IAddress";
import type { IArea } from "~/interfaces/IArea";
import type { IContact } from "~/interfaces/IContact";
import type { IOwnership } from "~/interfaces/IOwnership";
import type { IProperty } from "~/interfaces/IProperty";
import type { IPropertyObligation } from "~/interfaces/IPropertyObligation";
import type { IPublishChannel } from "~/interfaces/IPublishChannel";
import type { ISaveProperty } from "~/interfaces/ISaveProperty";

import {
  Addresses,
  Contacts,
  PropertiesProperty,
  Areas,
  PublishChannels,
  Obligations,
  PropertiesOwnerships,
} from "#components";

const { run } = useApiHandler();

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const propertyRef = ref<InstanceType<typeof PropertiesProperty> | null>(null);
const ownershipsRef = ref<InstanceType<typeof PropertiesOwnerships> | null>(
  null,
);
const addressesRef = ref<InstanceType<typeof Addresses> | null>(null);
const contactsRef = ref<InstanceType<typeof Contacts> | null>(null);
const areasRef = ref<InstanceType<typeof Areas> | null>(null);
const publishChannelsRef = ref<InstanceType<typeof PublishChannels> | null>(
  null,
);
const obligationsRef = ref<InstanceType<typeof Obligations> | null>(null);

const activeTab = ref<string>("property");

const tabsConfig = [
  { key: "property", label: "Propiedad", required: true },
  { key: "ownerships", label: "Propietarios", required: true },
  { key: "addresses", label: "Dirección", required: true },
  { key: "contacts", label: "Contacto", required: true },
  { key: "areas", label: "Áreas", required: true },
  { key: "publishChannels", label: "Redes Sociales" },
  { key: "obligations", label: "Obligaciones" },
];

const route = useRoute();
const idProperty = route.params.id as string;

const property = ref<any>({});

const { lookups } = useLookups([
  Constants.GARAGE_TYPE,
  Constants.PROPERTY_TYPE,
  Constants.PROPERTY_STATUS,
  Constants.OFFER_TYPE,
  Constants.AREA_TYPE,
  Constants.AREA_UNIT,
  Constants.PRICE_TYPE,
  Constants.PUBLISH_CHANNEL,
  Constants.FEATURE,
  Constants.OBLIGATION_TYPE,
  Constants.FREQUENCY,
  Constants.ROAD_TYPE,
  Constants.LETTER,
  Constants.ORIENTATION,
  Constants.STRATUM,
  Constants.COUNTRY,
  Constants.DEPARTMENT,
  Constants.CITY,
  Constants.STATUS,
  Constants.OP_SI_NO,
]);

const switchTab = (tab: string) => {
  activeTab.value = tab;
};

const { distributeErrors } = useFormErrorDistributor(
  {
    property: propertyRef,
    ownerships: ownershipsRef,
    addresses: addressesRef,
    contacts: contactsRef,
    areas: areasRef,
    publish_channels: publishChannelsRef,
    obligations: obligationsRef,
  },
  {
    property: "property",
    ownerships: "ownerships",
    addresses: "addresses",
    contacts: "contacts",
    areas: "areas",
    publish_channels: "publishChannels",
    obligations: "obligations",
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

const save = async () => {
  const forms = [
    { key: "property", ref: propertyRef, optional: false },
    { key: "ownerships", ref: ownershipsRef, optional: false },
    { key: "addresses", ref: addressesRef, optional: false },
    { key: "contacts", ref: contactsRef, optional: false },
    { key: "areas", ref: areasRef, optional: false },
    { key: "publishChannels", ref: publishChannelsRef, optional: true },
    { key: "obligations", ref: obligationsRef, optional: true },
  ];

  const data: ISaveProperty = {};

  for (const form of forms) {
    const values = form.ref.value?.getValues();

    if (form.optional && !hasValue(values)) continue;

    const isValid = await form.ref.value?.validateForm();

    if (!isValid) {
      switchTab(form.key);
      await AlertService.showFormError();
      return;
    }

    if (form.key === "property") {
      const { prices, ...propertyData } = values as IProperty;
      data.property = propertyData;
      data.prices = prices;
    }
    if (form.key === "ownerships") data.ownerships = values as IOwnership[];
    if (form.key === "addresses") data.addresses = values as IAddress[];
    if (form.key === "contacts") data.contacts = values as IContact[];
    if (form.key === "areas") data.areas = values as IArea[];
    if (form.key === "publishChannels") data.publish_channels = values as IPublishChannel[];
    if (form.key === "obligations") data.obligations = values as IPropertyObligation[];
  }

  const promise = props.isEditing
    ? PropertyService.updateProperty(idProperty, data)
    : PropertyService.createProperty(data);

  const response = await run(promise, {
    showSuccess: true,
    successMessage: props.isEditing
      ? "Propiedad actualizada correctamente"
      : "Propiedad creada correctamente",
    setErrors: distributeErrors,
  });

  if (response) {
    props.isEditing ? await getProperty() : cancel();
  }
};

const cancel = () => {
  propertyRef.value?.reset();
  ownershipsRef.value?.reset();
  addressesRef.value?.reset();
  contactsRef.value?.reset();
  areasRef.value?.reset();
  publishChannelsRef.value?.reset();
  obligationsRef.value?.reset();
};

const propertyLookups = computed(() => ({
  garageTypes: lookups.value[Constants.GARAGE_TYPE],
  propertyTypes: lookups.value[Constants.PROPERTY_TYPE],
  statusType: lookups.value[Constants.PROPERTY_STATUS],
  offerType: lookups.value[Constants.OFFER_TYPE],
  priceTypes: lookups.value[Constants.PRICE_TYPE],
  features: lookups.value[Constants.FEATURE],
  status: lookups.value[Constants.STATUS],
  strata: lookups.value[Constants.STRATUM],
  frequency: lookups.value[Constants.FREQUENCY],
  obligationTypes: lookups.value[Constants.OBLIGATION_TYPE],
  opSiNo: lookups.value[Constants.OP_SI_NO],
  publishChannels: lookups.value[Constants.PUBLISH_CHANNEL],
}));

const areasLookups = computed(() => ({
  areaTypes: lookups.value[Constants.AREA_TYPE],
  areaUnits: lookups.value[Constants.AREA_UNIT],
}));

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
  publishChannels: lookups.value[Constants.PUBLISH_CHANNEL],
  status: lookups.value[Constants.STATUS],
}));

const obligationsLookups = computed(() => ({
  obligationTypes: lookups.value[Constants.OBLIGATION_TYPE],
  frequency: lookups.value[Constants.FREQUENCY],
  status: lookups.value[Constants.STATUS],
}));

const ownershipsLookups = computed(() => ({
  status: lookups.value[Constants.STATUS],
}));

const getProperty = async () => {
  if (!props.isEditing) return;
  const response = await run(PropertyService.getProperty(idProperty));
  if (response) {
    property.value = response.data;
  }
};

getProperty();
</script>

<style scoped></style>
