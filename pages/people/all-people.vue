<template>
  <div class="page-body">
    <CommonBreadcrumb :page="$t('people.breadCrumbPage')" :title="$t('people.breadCrumbTitle')"/>

    <div class="container-fluid">
      <nav>
        <div id="nav-tab" class="nav nav-tabs" role="tablist">
          <button
              :class="{ active: activeTab === 'users' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('users')"
          >
            Usuarios
          </button>
          <button
              :class="{ active: activeTab === 'persons' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('persons')"
          >
            Personas
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
        <div v-show="activeTab === 'users'">
          <PeopleUsers v-if="loadedTabs.users" :all-data="allData" @reload="reloadData"/>
        </div>
        <div v-show="activeTab === 'persons'">
          <PeoplePersons v-if="loadedTabs.persons" :all-data="allData" @reload="reloadData"/>
        </div>
        <div v-show="activeTab === 'fiscalProfiles'">
          <PeopleFiscalProfiles v-if="loadedTabs.fiscalProfiles" :all-data="allData" @reload="reloadData"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PersonService from "@/services/PersonService";
import LoadingService from "~/services/LoadingService";
import AlertService from "~/services/AlertService";

const activeTab = ref<string>('users')

const loadedTabs = ref<{ [key: string]: boolean }>({
  users: true,
  persons: false,
  fiscalProfiles: false
})

const allData = ref({
  users: [],
  people: [],
  fiscalProfiles: []
})

const switchTab = (tab: string) => {
  activeTab.value = tab
  loadedTabs.value[tab] = true // Marca como cargado cuando se activa
}

/**
 * Método para recargar todos los datos desde el API
 */
const loadAllData = async () => {
  LoadingService.show();
  try {
    const params = {
      page: 1,
      perPage: 1000,
      sortBy: 'created_at',
      sortType: 'desc',
      search: '',
    };

    const response = await PersonService.getPeople(params);
    allData.value = response.data;
  } catch (error) {
    AlertService.showError('Ha ocurrido un error', error);
  } finally {
    LoadingService.hide();
  }
}

/**
 * Método para recargar datos cuando se crea, actualiza o elimina
 */
const reloadData = () => {
  // Recarga los datos
  loadAllData();

  // Desmonta y remonta los tabs activos
  Object.keys(loadedTabs.value).forEach(tab => {
    if (loadedTabs.value[tab] && tab !== activeTab.value) {
      loadedTabs.value[tab] = false
      nextTick(() => {
        loadedTabs.value[tab] = true
      })
    }
  })
}

// Cargar datos al montar el componente
onMounted(() => {
  loadAllData();
})

useHead({
  title: 'Gestión de Personas'
})
</script>
