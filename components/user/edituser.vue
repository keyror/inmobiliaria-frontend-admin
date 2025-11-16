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
              :class="{ active: activeTab === 'users' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('users')"
          >
            Usuarios
          </button>
        </div>
      </nav>

      <div class="tab-content mt-4">
        <div v-if="activeTab === 'persons'">
          <PeoplePersons
              :lookups="lookupsToSend || {}" :data="person"
              :isEditing="true"
          />
        </div>
        <div v-if="activeTab === 'fiscalProfiles'">
          <PeopleFiscalProfiles
              :lookups="fiscalProfilesLookups || {}"
              :data="person?.fiscal_profile"
              :isEditing="true"
          />
        </div>
        <div v-if="activeTab === 'users'">
          <PeopleUsers
              :lookups="lookups[Constants.USER_STATUS] || []"
              :data="person?.user"
              :isEditing="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'
import PersonService from "@/services/PersonService";
import LoadingService from "~/services/LoadingService";
import AlertService from "~/services/AlertService";
import LookupService from "@/services/LookupService";
import type {IIndexLookupsRequest} from "~/interfaces/IIndexLookupsRequest";
import {Constants} from "~/constants/Constants";
import type {ILookupsResponse} from "~/interfaces/ILookup";

const activeTab = ref<string>('persons')

const route = useRoute()
const idPersona = route.params.id as string;

const categories = ref<IIndexLookupsRequest>({
  categories: [
    Constants.TAXE_TYPE,
    Constants.ORGANIZATION_TYPE,
    Constants.DOCUMENT_TYPE,
    Constants.USER_STATUS,
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

/**
 * Método para recargar todos los datos desde el API
 */
const getPerson = async () => {
  LoadingService.show();

  Promise.all([
    LookupService.getLookups(categories.value),
    PersonService.getPerson(idPersona)
  ])
      .then(([lookupsResponse, personResponse]) => {
        lookups.value = lookupsResponse.data;
        person.value = personResponse.data;
      })
      .catch((error) => {
        AlertService.showError('Ha ocurrido un error', error);
      })
      .finally(() => {
        LoadingService.hide();
      });
};


// Cargar datos al montar el componente
getPerson();
</script>

<style scoped>

</style>
