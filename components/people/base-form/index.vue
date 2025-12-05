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
              <div class="form-btn mt-3">
                <button class="btn btn-pill btn-gradient color-4" @click="save">
                  {{props.isEditing ? 'Actualizar' : 'Crear' }}
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
import {PeopleFiscalProfiles, type PeoplePersons} from "#components";

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  }
});

const form = ref({});
const personRef = ref<InstanceType<typeof PeoplePersons> | null>(null);
const fiscalProfileRef = ref<InstanceType<typeof PeopleFiscalProfiles> | null>(null);

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
    Constants.ECONOMIC_ACTIVITY
  ]
});

const lookups = ref<ILookupsResponse>({});

const person = ref<any>({});

const isPersonValid = ref<boolean | null>(null);       // null = aún no validado
const isFiscalValid = ref<boolean | null>(null);


const switchTab = (tab: string) => {
  activeTab.value = tab
}

const getFormPerson = (data: Partial<IPerson>) => {
  isPersonValid.value = true;
  console.log(data,'persona');
}

const getFormFiscalProfile = (data: Partial<IFiscalProfile> | { invalidForm:true }) => {
  isFiscalValid.value = true;
  console.log(data,'perfil fiscal');
}

const save = () => {
  // Resetear estado antes de validar
  isPersonValid.value = null;
  isFiscalValid.value = null;

  // Disparar validación
  personRef.value?.sendForm();
  fiscalProfileRef.value?.sendForm();

  // Esperar siguiente ciclo para asegurar respuesta de ambos formularios
  nextTick(() => {
    if (isPersonValid.value === false || isFiscalValid.value === false) {
      AlertService.showFormError();
      return;
    }

    // Si ambos son válidos:
    console.log("Datos válidos:", 'formPersonData.value', 'formFiscalData.value');
    // Haz aquí el submit final al backend
  });
};

const cancel = () => {
  personRef.value?.reset();
  fiscalProfileRef.value?.reset();
}

const lookupsToSend = computed(() => ({
  organizationTypes: lookups.value[Constants.ORGANIZATION_TYPE],
  documentTypes: lookups.value[Constants.DOCUMENT_TYPE],
  genders: lookups.value[Constants.GENDER]
}));

const fiscalProfilesLookups = computed(() => ({
  vatType: lookups.value[Constants.VAT_TYPE],
  taxeType: lookups.value[Constants.TAXE_TYPE],
  economicActivity: lookups.value[Constants.ECONOMIC_ACTIVITY],
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
