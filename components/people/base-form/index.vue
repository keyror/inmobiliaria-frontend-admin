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
        </div>
      </nav>

      <div class="tab-content mt-4">
        <div v-if="activeTab === 'persons'">
          <PeoplePersons
              :lookups="lookupsToSend || {}" :data="person"
              :isEditing="props.isEditing"
          />
        </div>
        <div v-if="activeTab === 'fiscalProfiles'">
          <PeopleFiscalProfiles
              :lookups="fiscalProfilesLookups || {}"
              :data="person?.fiscal_profile"
              :isEditing="props.isEditing"
          />
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

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  }
});

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
  ]
});

const lookups = ref<ILookupsResponse>({});

const person = ref<any>({});

const switchTab = (tab: string) => {
  activeTab.value = tab
}

const lookupsToSend = computed(() => ({
  organizationTypes: lookups.value[Constants.ORGANIZATION_TYPE],
  documentTypes: lookups.value[Constants.DOCUMENT_TYPE],
  genders: lookups.value[Constants.GENDER]
}));

const fiscalProfilesLookups = computed(() => ({
  vatType: lookups.value[Constants.VAT_TYPE],
  taxeType: lookups.value[Constants.TAXE_TYPE],
}));

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



// Cargar datos al montar el componente
init();
</script>

<style scoped>

</style>
