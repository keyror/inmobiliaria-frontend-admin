<template>
  <div class="page-body">
    <CommonBreadcrumb :page="$t('property.breadCrumbPage')" :title="$t('property.breadCrumbTitle')"/>

    <div class="container-fluid">
      <nav>
        <div id="nav-tab" class="nav nav-tabs" role="tablist">
          <button
              :class="{ active: activeTab === 'property' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('property')"
          >
            Propiedad
          </button>
          <button
              :class="{ active: activeTab === 'ownerships' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('ownerships')"
          >
            Propietarios
          </button>
          <button
              :class="{ active: activeTab === 'addresses' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('addresses')"
          >
            Dirección
          </button>
          <button
              :class="{ active: activeTab === 'contacts' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('contacts')"
          >
            Contacto
          </button>
          <button
              :class="{ active: activeTab === 'areas' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('areas')"
          >
            Áreas
          </button>
          <button
              :class="{ active: activeTab === 'publishChannels' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('publishChannels')"
          >
            Redes Sociales
          </button>
          <button
              :class="{ active: activeTab === 'obligations' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('obligations')"
          >
            Obligaciones
          </button>
        </div>
      </nav>

      <div class="tab-content mt-4">
        <div class="container-fluid">
          <div class="card">
            <div class="card-body admin-form">
              <div v-show="activeTab === 'property'">
                <PropertiesProperty
                    ref="propertyRef"
                    @sendForm="getFormProperties"
                    :lookups="propertyLookups || {}"
                    :data="property"
                    :isEditing="props.isEditing"
                    @formInvalid="isPropertyValid = false"
                />
              </div>
              <div v-show="activeTab === 'ownerships'">
                <PropertiesOwnerships
                    ref="ownershipsRef"
                    @sendForm="getFormOwnerships"
                    :data="property?.ownerships"
                    :lookups="ownershipsLookups"
                    :isEditing="props.isEditing"
                    @formInvalid="isOwnershipsValid = false"
                />
              </div>
              <div v-show="activeTab === 'addresses'">
                <Addresses
                    ref="addressesRef"
                    @sendForm="getFormAddresses"
                    :lookups="addressesLookups"
                    :data="property?.addresses"
                    :isEditing="props.isEditing"
                    @formInvalid="isAddressValid = false"
                    :single="true"
                />
              </div>
              <div v-show="activeTab === 'contacts'">
                <Contacts
                    ref="contactsRef"
                    @sendForm="getFormContacts"
                    :data="property?.contacts"
                    :isEditing="props.isEditing"
                    @formInvalid="isContactValid = false"
                    :single="false"
                />
              </div>
              <div v-show="activeTab === 'areas'">
                <Areas
                    ref="areasRef"
                    @sendForm="getFormAreas"
                    :data="property?.areas"
                    :isEditing="props.isEditing"
                    :lookups="areasLookups"
                    @formInvalid="isAreasValid = false"
                />
              </div>
              <div v-show="activeTab === 'publishChannels'">
                <PropertiesPublishChannels
                    ref="publishChannelsRef"
                    @sendForm="getFormPublishChannels"
                    :data="property?.publish_channels"
                    :lookups="publishChannelsLookups"
                    @formInvalid="isPublishChannelsValid = false"
                />
              </div>
              <div v-show="activeTab === 'obligations'">
                <Obligations
                    ref="obligationsRef"
                    @sendForm="getFormObligations"
                    :data="property?.obligations"
                    :lookups="obligationsLookups"
                    @formInvalid="isObligationsValid = false"
                />
              </div>
              <div class="form-btn mt-3">
                <button class="btn btn-pill btn-gradient color-4" @click="save">
                  {{ props.isEditing ? 'Actualizar' : 'Crear' }}
                </button>

                <button class="btn btn-pill btn-dashed color-4" type="button" @click="cancel">
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
import '@vuepic/vue-datepicker/dist/main.css'
import LoadingService from "~/services/LoadingService";
import AlertService from "~/services/AlertService";
import LookupService from "~/services/LookupService";
import type {IIndexLookupsRequest} from "~/interfaces/IIndexLookupsRequest";
import {Constants} from "~/constants/Constants";
import type {ILookupsResponse} from "~/interfaces/ILookup";
import {
  Addresses,
  Contacts,
  PropertiesProperty,
  Areas,
  PropertiesPublishChannels,
  Obligations,
  PropertiesOwnerships
} from "#components";
import PropertyService from "~/services/PropertyService";
import type {IProperty} from "~/interfaces/IProperty";
import type {ISaveProperty} from "~/interfaces/ISaveProperty";

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  }
});


const propertyRef = ref<InstanceType<typeof PropertiesProperty> | null>(null);
const addressesRef = ref<InstanceType<typeof Addresses> | null>(null);
const contactsRef = ref<InstanceType<typeof Contacts> | null>(null);
const areasRef = ref<InstanceType<typeof Areas> | null>(null);
const publishChannelsRef = ref<InstanceType<typeof PropertiesPublishChannels> | null>(null);
const obligationsRef = ref<InstanceType<typeof Obligations> | null>(null)
const ownershipsRef = ref<InstanceType<typeof PropertiesOwnerships> | null>(null)

const activeTab = ref<string>('property')

const route = useRoute()
const idProperty = route.params.id as string;

const categories = ref<IIndexLookupsRequest>({
  categories: [
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
  ]
});

const lookups = ref<ILookupsResponse>({});

const property = ref<any>({});

const propertySaveDate = ref<ISaveProperty>({});

const isPropertyValid = ref<boolean | null>(null);
const isAddressValid = ref<boolean | null>(null);
const isContactValid = ref<boolean | null>(null);
const isAreasValid = ref<boolean | null>(null);
const isPublishChannelsValid = ref<boolean | null>(null);
const isObligationsValid = ref<boolean | null>(null);
const isOwnershipsValid = ref<boolean | null>(null);

const formStatusMap = {
  property: isPropertyValid,
  ownerships: isOwnershipsValid,
  addresses: isAddressValid,
  contacts: isContactValid,
  areas: isAreasValid,
  publishChannels: isPublishChannelsValid,
  obligations: isObligationsValid,
} as const;


const switchTab = (tab: string) => {
  activeTab.value = tab
}

const getFormProperties = (data: IProperty | { invalidForm: boolean }) => {
  if ('invalidForm' in data) {
    isPropertyValid.value = false;
    return;
  }

  isPropertyValid.value = true;
  propertySaveDate.value.property = data;
}

const getFormAddresses = (data: any[] | { invalidForm: boolean }) => {
  if ('invalidForm' in data) {
    isAddressValid.value = false;
    return;
  }

  isAddressValid.value = true;
  propertySaveDate.value.addresses = data
}

const getFormContacts = (data: any[] | { invalidForm: boolean }) => {
  if ('invalidForm' in data) {
    isContactValid.value = false;
    return;
  }

  isContactValid.value = true;
  propertySaveDate.value.contacts = data
}

const getFormAreas = (data: any[] | { invalidForm: boolean }) => {
  if ('invalidForm' in data) {
    isAreasValid.value = false;
    return;
  }

  isAreasValid.value = true;
  propertySaveDate.value.areas = data
}

const getFormPublishChannels = (data: any[] | { invalidForm: boolean }) => {
  if ('invalidForm' in data) {
    isPublishChannelsValid.value = false;
    return;
  }

  isPublishChannelsValid.value = true;
  propertySaveDate.value.publish_channels = data;
};


const getFormObligations = async (data: any[] | { invalidForm: boolean }) => {
  if ('invalidForm' in data) {
    isObligationsValid.value = false;
    return;
  }

  isObligationsValid.value = true;
  propertySaveDate.value.obligations = data;
}

const getFormOwnerships = (data: any[] | { invalidForm: boolean }) => {
  if ('invalidForm' in data) {
    isOwnershipsValid.value = false;
    return;
  }

  isOwnershipsValid.value = true;
  propertySaveDate.value.ownerships = data;
}

const save = () => {
  // Disparar validación
  propertyRef.value?.sendForm();
  addressesRef.value?.sendForm();
  contactsRef.value?.sendForm();
  areasRef.value?.sendForm();
  publishChannelsRef.value?.sendForm();
  obligationsRef.value?.sendForm();
  ownershipsRef.value?.sendForm();

  nextTick()
      .then(() => {
        const invalidForm = getInvalidForm();

        if (invalidForm) {
          switchTab(invalidForm);
          AlertService.showFormError();
          // Cortamos la cadena de promesas
          return Promise.reject('FORM_INVALID');
        }

        LoadingService.show();

        return props.isEditing
            ? PropertyService.updateProperty(idProperty, propertySaveDate.value)
            : PropertyService.createProperty(propertySaveDate.value)
      })
      .then((response) => {
       // cancel();
        AlertService.showSuccess('Operación exitosa', response.message).then((response) => {
          if (response.isConfirmed) {
            init();
          }
        })
      })
      .catch((error) => {
        // Evita mostrar error si solo fue validación
        if (error !== 'FORM_INVALID') {
          AlertService.showError('Ha ocurrido un error', error);
        }
      })
      .finally(() => {
        LoadingService.hide();
      });
};

const cancel = () => {
  propertyRef.value?.reset();
  addressesRef.value?.reset();
  contactsRef.value?.reset();
  areasRef.value?.reset();
  publishChannelsRef.value?.reset();
  obligationsRef.value?.reset();
  ownershipsRef.value?.reset();
}

const propertyLookups = computed(() => ({
  garageTypes: lookups.value[Constants.GARAGE_TYPE],
  propertyTypes: lookups.value[Constants.PROPERTY_TYPE],
  statusType: lookups.value[Constants.PROPERTY_STATUS],
  offerType: lookups.value[Constants.OFFER_TYPE],
  priceTypes: lookups.value[Constants.PRICE_TYPE],
  features: lookups.value[Constants.FEATURE],
  status: lookups.value[Constants.STATUS],
  frequency: lookups.value[Constants.FREQUENCY],
  obligationTypes: lookups.value[Constants.OBLIGATION_TYPE],
  opSiNo: lookups.value[Constants.OP_SI_NO],
  publishChannels: lookups.value[Constants.PUBLISH_CHANNEL],
}));

const areasLookups = computed(() => ({
  areaTypes: lookups.value[Constants.AREA_TYPE],
  areaUnits: lookups.value[Constants.AREA_UNIT],
}))

const addressesLookups = computed(() => ({
  roadTypes: lookups.value[Constants.ROAD_TYPE],
  letters: lookups.value[Constants.LETTER],
  orientations: lookups.value[Constants.ORIENTATION],
  strata: lookups.value[Constants.STRATUM],
  country: lookups.value[Constants.COUNTRY],
  cities: lookups.value[Constants.CITY],
  departments: lookups.value[Constants.DEPARTMENT],
}))

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

const getLookups = async () => {
  return LookupService.getLookups(categories.value)
      .then((lookupsResponse) => {
        lookups.value = lookupsResponse.data;
      });
};


const getProperty = async () => {
  return PropertyService.getProperty(idProperty)
      .then((response) => {
        property.value = response.data;
      });
};

const init = () => {
  LoadingService.show();
  const tasks = [];
  tasks.push(getLookups());

  if (props.isEditing) {
    tasks.push(getProperty());
  }

  Promise.all(tasks)
      .catch((error) => {
        AlertService.showError('Ha ocurrido un error', error);
      })
      .finally(() => {
        LoadingService.hide();
      });
};

const getInvalidForm = (): keyof typeof formStatusMap | null => {
  const entries = Object.entries(formStatusMap) as [
    keyof typeof formStatusMap,
    typeof isPropertyValid
  ][];

  const invalid = entries.find(([_, ref]) => ref.value === false);

  return invalid?.[0] ?? null;
};

// Cargar datos al montar el componente
init();
</script>

<style scoped>

</style>
