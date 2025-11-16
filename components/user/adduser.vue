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
            Usuario
          </button>
        </div>
      </nav>

      <div class="tab-content mt-4">
        <div v-if="activeTab === 'persons'">
          <PeoplePersons
              :lookups="lookupsToSend || {}"
          />
        </div>
        <div v-if="activeTab === 'fiscalProfiles'">
          <PeopleFiscalProfiles :lookups="fiscalProfilesLookups || {}"/>
        </div>
        <div v-if="activeTab === 'users'">
          <PeopleUsers :lookups="lookups[Constants.USER_STATUS] || []"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingService from "~/services/LoadingService";
import AlertService from "~/services/AlertService";
import LookupService from "~/services/LookupService";
import type {IIndexLookupsRequest} from "~/interfaces/IIndexLookupsRequest";
import {Constants} from "~/constants/Constants";
import type {ILookupsResponse} from "~/interfaces/ILookup";

const activeTab = ref<string>('persons')

const lookups = ref<ILookupsResponse>({});

const lookupsToSend = computed(() => ({
  organizationTypes: lookups.value[Constants.ORGANIZATION_TYPE],
  documentTypes: lookups.value[Constants.DOCUMENT_TYPE],
  genders: lookups.value[Constants.GENDER]
}));

const fiscalProfilesLookups = computed(() => ({
  vatType: lookups.value[Constants.VAT_TYPE],
  taxeType: lookups.value[Constants.TAXE_TYPE],
}));

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

const switchTab = (tab: string) => {
  activeTab.value = tab
}

const getLookups = () => {
  LoadingService.show();

  LookupService.getLookups(categories.value)
      .then((lookupsResponse) => {
        lookups.value = lookupsResponse.data;
      })
      .catch((error) => {
        AlertService.showError('Ha ocurrido un error', error);
      })
      .finally(() => {
        LoadingService.hide();
      });
};

getLookups();
</script>

<style scoped>

</style>
