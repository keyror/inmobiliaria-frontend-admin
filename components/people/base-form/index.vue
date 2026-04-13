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
                    :lookups="lookupsToSend || {}"
                    :data="person"
                    :isEditing="props.isEditing"
                />
              </div>
              <div v-show="activeTab === 'fiscalProfiles'">
                <PeopleFiscalProfiles
                    ref="fiscalProfileRef"
                    :lookups="fiscalProfilesLookups || {}"
                    :data="person?.fiscal_profile"
                    :isEditing="props.isEditing"
                />
              </div>
              <div v-show="activeTab === 'accountBank'">
                <PeopleAccountBank
                    ref="accountBankRef"
                    :lookups="accountBankLookups"
                    :data="person?.account_banks"
                    :isEditing="props.isEditing"
                />

              </div>
              <div v-show="activeTab === 'addresses'">
                <Addresses
                    ref="addressesRef"
                    :lookups="addressesLookups"
                    :data="person?.addresses"
                    :isEditing="props.isEditing"
                />
              </div>
              <div v-show="activeTab === 'contacts'">
                <Contacts
                    ref="contactsRef"
                    :data="person?.contacts"
                    :isEditing="props.isEditing"
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
import AlertService from "~/services/AlertService";
import { useApiHandler } from '~/composables/useApiHandler'
import {Constants} from "~/constants/Constants";

import {
  PeopleFiscalProfiles,
  PeopleAccountBank,
  type PeoplePersons,
  Addresses,
  Contacts
} from "#components";
import type {ISavePerson} from "~/interfaces/ISavePerson";
import type {IPerson} from "~/interfaces/IPerson";
import type {IFiscalProfile} from "~/interfaces/IFiscalProfile";
import type {IAccountBank} from "~/interfaces/IAccountBank";
import type {IAddress} from "~/interfaces/IAddress";
import type {IContact} from "~/interfaces/IContact";

const { run } = useApiHandler()

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  }
});

const personRef = ref<InstanceType<typeof PeoplePersons> | null>(null);
const fiscalProfileRef = ref<InstanceType<typeof PeopleFiscalProfiles> | null>(null);
const accountBankRef = ref<InstanceType<typeof PeopleAccountBank> | null>(null);
const addressesRef = ref<InstanceType<typeof Addresses> | null>(null);
const contactsRef = ref<InstanceType<typeof Contacts> | null>(null);

const activeTab = ref<string>('persons')

const route = useRoute()
const idPersona = route.params.id as string;

const person = ref<any>({});

const { lookups } = useLookups([
  Constants.TAXE_TYPE,
  Constants.ORGANIZATION_TYPE,
  Constants.DOCUMENT_TYPE,
  Constants.GENDER,
  Constants.OP_SI_NO,
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
])

const switchTab = (tab: string) => {
  activeTab.value = tab
}

const { distributeErrors } = useFormErrorDistributor({
      person: personRef,
      fiscal_profile: fiscalProfileRef,
      accounts: accountBankRef,
      addresses: addressesRef,
      contacts:contactsRef,
    },
    {
      person:'persons',
      fiscal_profile: 'fiscalProfiles',
      accounts:'accountBank',
      addresses:'addresses',
      contacts:'contacts',
    },
    switchTab
)

const save = async () => {

  const forms = [
    { key: 'persons', ref: personRef },
    { key: 'fiscalProfiles', ref: fiscalProfileRef },
    { key: 'accountBank', ref: accountBankRef },
    { key: 'addresses', ref: addressesRef },
    { key: 'contacts', ref: contactsRef },
  ];

  const data: ISavePerson = {}

  for (const form of forms) {
    const isValid = await form.ref.value?.validateForm();

    if (!isValid) {
      switchTab(form.key);
      await AlertService.showFormError();
      return;
    }

    // recolectar data
    const values = form.ref.value?.getValues();

    if (form.key === 'persons') data.person = values as IPerson
    if (form.key === 'fiscalProfiles') data.fiscal_profile = values as IFiscalProfile
    if (form.key === 'accountBank') data.account_banks = values as IAccountBank[]
    if (form.key === 'addresses') data.addresses = values as IAddress[]
    if (form.key === 'contacts') data.contacts = values as IContact[]
  }

  const promise = props.isEditing
      ? PersonService.updatePerson(idPersona, data)
      : PersonService.createPerson(data)

  const response = await run(promise, {
    showSuccess: true,
    successMessage: props.isEditing
        ? 'Persona actualizada correctamente'
        : 'Persona creada correctamente',
    setErrors: distributeErrors
  })

  if (response) {
    props.isEditing ? await getPerson() : cancel()
  }
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
  opSiNo: lookups.value[Constants.OP_SI_NO],
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

const getPerson = async () => {
  if (!props.isEditing) return;
  const response = await run(PersonService.getPerson(idPersona))
  if (response) {
    person.value = response.data
  }
}

getPerson()
</script>

<style scoped>

</style>
