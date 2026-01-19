<template>
  <div class="page-body">
    <CommonBreadcrumb :page="$t('people.breadCrumbPage')" :title="$t('people.breadCrumbTitle')"/>

    <div class="container-fluid">
      <nav>
        <div id="nav-tab" class="nav nav-tabs" role="tablist">
          <button
              :class="{ active: activeTab === 'persons' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('persons')"
          >
            Persona
          </button>
          <button
              :class="{ active: activeTab === 'fiscalProfiles' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('fiscalProfiles')"
          >
            Perfil Fiscal
          </button>
          <button
              :class="{ active: activeTab === 'accountBank' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('accountBank')"
          >
            Cuentas bancarias
          </button>
          <button
              :class="{ active: activeTab === 'addresses' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('addresses')"
          >
            Direcciones
          </button>
          <button
              :class="{ active: activeTab === 'contacts' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('contacts')"
          >
            Contactos
          </button>
        </div>
      </nav>

      <div class="tab-content mt-4">
        <div class="container-fluid">
          <div class="card">
            <div class="card-body admin-form">
              <div v-show="activeTab === 'persons'">
                <PeoplePersons
                    ref="personRef"
                    @sendForm="getFormPerson"
                    :lookups="lookupsToSend || {}"
                    :data="person"
                    :isEditing="props.isEditing"
                    @formInvalid="isPersonValid = false"
                />
              </div>
              <div v-show="activeTab === 'fiscalProfiles'">
                <PeopleFiscalProfiles
                    ref="fiscalProfileRef"
                    @sendForm="getFormFiscalProfile"
                    :lookups="fiscalProfilesLookups || {}"
                    :data="person?.fiscal_profile"
                    :isEditing="props.isEditing"
                    @formInvalid="isFiscalValid = false"
                />
              </div>
              <div v-show="activeTab === 'accountBank'">
                <PeopleAccountBank
                    ref="accountBankRef"
                    @sendForm="getFormAccountBank"
                    :lookups="accountBankLookups"
                    :data="person?.account_banks"
                    :isEditing="props.isEditing"
                    @formInvalid="isAccountBankValid = false"
                />

              </div>
              <div v-show="activeTab === 'addresses'">
                <PeopleAddresses
                    ref="addressesRef"
                    @sendForm="getFormAddresses"
                    :lookups="addressesLookups"
                    :data="person?.addresses"
                    :isEditing="props.isEditing"
                    @formInvalid="isAddressValid = false"
                />
              </div>
              <div v-show="activeTab === 'contacts'">
                <PeopleContacts
                    ref="contactsRef"
                    @sendForm="getFormContacts"
                    :data="person?.contacts"
                    :isEditing="props.isEditing"
                    @formInvalid="isContactValid = false"
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
import PersonService from "~/services/PersonService";
import LoadingService from "~/services/LoadingService";
import AlertService from "~/services/AlertService";
import LookupService from "~/services/LookupService";
import type {IIndexLookupsRequest} from "~/interfaces/IIndexLookupsRequest";
import {Constants} from "~/constants/Constants";
import type {ILookupsResponse} from "~/interfaces/ILookup";
import type {IPerson} from "~/interfaces/IPerson";
import type {IFiscalProfile} from "~/interfaces/IFiscalProfile";
import type {IAccountBank} from "~/interfaces/IAccountBank";
import {
  PeopleFiscalProfiles,
  PeopleAccountBank,
  type PeoplePersons,
  PeopleAddresses,
  PeopleContacts
} from "#components";
import type {ISavePerson} from "~/interfaces/ISavePerson";

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  }
});


const personRef = ref<InstanceType<typeof PeoplePersons> | null>(null);
const fiscalProfileRef = ref<InstanceType<typeof PeopleFiscalProfiles> | null>(null);
const accountBankRef = ref<InstanceType<typeof PeopleAccountBank> | null>(null);
const addressesRef = ref<InstanceType<typeof PeopleAddresses> | null>(null);
const contactsRef = ref<InstanceType<typeof PeopleContacts> | null>(null);

const activeTab = ref<string>('persons')

const route = useRoute()
const idPersona = route.params.id as string;

const categories = ref<IIndexLookupsRequest>({
  categories: [
    Constants.TAXE_TYPE,
    Constants.ORGANIZATION_TYPE,
    Constants.DOCUMENT_TYPE,
    Constants.GENDER,
    Constants.VAT_TYPE,
    Constants.ECONOMIC_ACTIVITY,
    Constants.CITY,
    Constants.ACCOUNT_BANKS,
    Constants.BANKS,
    Constants.ROAD_TYPE,
    Constants.LETTER,
    Constants.ORIENTATION,
    Constants.STRATUM,
    Constants.COUNTRY,
    Constants.DEPARTMENT
  ]
});

const lookups = ref<ILookupsResponse>({});

const person = ref<any>({});
const personToSaveData = ref<ISavePerson>({});

const isPersonValid = ref<boolean | null>(null);
const isFiscalValid = ref<boolean | null>(null);
const isAccountBankValid = ref<boolean | null>(null);
const isAddressValid = ref<boolean | null>(null);
const isContactValid = ref<boolean | null>(null);

const formStatusMap = {
  persons: isPersonValid,
  fiscalProfiles: isFiscalValid,
  accountBank: isAccountBankValid,
  addresses: isAddressValid,
  contacts: isContactValid
} as const;


const switchTab = (tab: string) => {
  activeTab.value = tab
}

const getFormPerson = (data: Partial<IPerson>) => {
  isPersonValid.value = true;
  personToSaveData.value.person = data;
}

const getFormFiscalProfile = (data: Partial<IFiscalProfile> | { invalidForm: boolean }) => {
  if ('invalidForm' in data) {
    isFiscalValid.value = false;
    return;
  }

  isFiscalValid.value = true;
  personToSaveData.value.fiscal_profile = data;
}

const getFormAccountBank = (data: IAccountBank[] | { invalidForm: boolean }) => {
  if ('invalidForm' in data) {
    isAccountBankValid.value = false;
    return;
  }

  isAccountBankValid.value = true;
  personToSaveData.value.account_banks = data
}

const getFormAddresses = (data: any[] | { invalidForm: boolean }) => {
  if ('invalidForm' in data) {
    isAddressValid.value = false;
    return;
  }

  isAddressValid.value = true;
  personToSaveData.value.addresses = data
}

const getFormContacts = (data: any[] | { invalidForm: boolean }) => {
  if ('invalidForm' in data) {
    isContactValid.value = false;
    return;
  }

  isContactValid.value = true;
  personToSaveData.value.contacts = data
}

const save = () => {
  // Disparar validación
  personRef.value?.sendForm();
  fiscalProfileRef.value?.sendForm();
  accountBankRef.value?.sendForm();
  addressesRef.value?.sendForm();
  contactsRef.value?.sendForm();

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
            ? PersonService.updatePerson(idPersona, personToSaveData.value)
            : PersonService.createPerson(personToSaveData.value)
      })
      .then((response) => {
        cancel();
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
  personRef.value?.reset();
  fiscalProfileRef.value?.reset();
  accountBankRef.value?.reset();
  addressesRef.value?.reset();
  contactsRef.value?.reset();
}

const lookupsToSend = computed(() => ({
  organizationTypes: lookups.value[Constants.ORGANIZATION_TYPE],
  documentTypes: lookups.value[Constants.DOCUMENT_TYPE],
  genders: lookups.value[Constants.GENDER],
  cities: lookups.value[Constants.CITY],
}));

const fiscalProfilesLookups = computed(() => ({
  vatType: lookups.value[Constants.VAT_TYPE],
  taxeType: lookups.value[Constants.TAXE_TYPE],
  economicActivity: lookups.value[Constants.ECONOMIC_ACTIVITY],
}));

const accountBankLookups = computed(() => ({
  banks: lookups.value[Constants.BANKS],
  typeAccountBank: lookups.value[Constants.ACCOUNT_BANKS],
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

const getLookups = async () => {
  return LookupService.getLookups(categories.value)
      .then((lookupsResponse) => {
        lookups.value = lookupsResponse.data;
      });
};


const getPerson = async () => {
  return PersonService.getPerson(idPersona)
      .then((response) => {
        person.value = response.data;
      });
};

const init = () => {
  LoadingService.show();
  const tasks = [];
  tasks.push(getLookups());

  if (props.isEditing) {
    tasks.push(getPerson());
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
    typeof isPersonValid
  ][];

  const invalid = entries.find(([_, ref]) => ref.value === false);

  return invalid?.[0] ?? null;
};


// Cargar datos al montar el componente
init();
</script>

<style scoped>

</style>
