<template>
  <div class="page-body">
    <CommonBreadcrumb title="Editar" page="Administrar Usuario"/>
    <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header pb-0">
            <h5>{{props.isEditing ? 'Editar Usuario ' : 'Crear Usuario' }}</h5>
          </div>
          <div class="card-body admin-form">
            <form autocomplete="off" class="row gx-3" @submit.prevent="save">
              <CommonInputfieldsTextfield
                  autocomplete="off"
                  v-model="formData.email"
                  classes="col-md-6 col-sm-6"
                  label="Email"
                  placeholder="Ingrese el email"
                  type="email"
                  star="*"
              />
              <CommonInputfieldsTextfield
                  autocomplete="off"
                  v-model="formData.password"
                  classes="col-md-6 col-sm-6"
                  label="Contraseña"
                  placeholder="Ingrese la contraseña"
                  type="password"
                  :required="false"
                  :star="''"
              />

              <CommonInputfieldsSelectfield
                  v-model="formData.status_type_id"
                  classes="col-md-6 col-sm-6"
                  label="Estado"
                  :data="lookups"
                  star="*"
              />

              <div class="form-btn mt-3">
                <button class="btn btn-pill btn-gradient color-4" type="submit">
                  {{props.isEditing ? 'Actualizar' : 'Crear' }}
                </button>
                <button class="btn btn-pill btn-dashed color-4" type="button" @click="resetForm">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
import UserService from "~/services/UserService";
import AlertService from "~/services/AlertService";
import LoadingService from "~/services/LoadingService";
import type {ILookup} from "~/interfaces/ILookup";
import LookupService from "~/services/LookupService";
import type {IIndexLookupsRequest} from "~/interfaces/IIndexLookupsRequest";
import {Constants} from "~/constants/Constants";

const categories = ref<IIndexLookupsRequest>({
  categories: [
    Constants.USER_STATUS
  ]
});

const route = useRoute()
const idUser = route.params.id as string;

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  }
});

const editingId = ref();

const lookups = ref<ILookup[]>([]);

const initialForm = {
  email: '',
  password: '',
  status_type_id: ''
};

const formData = ref({ ...initialForm});
const formDataOriginal = ref({ ...initialForm});

const save = () => {
  if (props.isEditing) {
    updateUser();
  } else {
    saveUser();
  }
}

/**
 * Método para obtener el usuario
 */
const getUser = async () => {
  LoadingService.show();
  Promise.all([
    LookupService.getLookups(categories.value),
    UserService.getUser(idUser)
  ])
      .then(([lookupsResponse, personResponse]) => {
        lookups.value = lookupsResponse.data[Constants.USER_STATUS];
        formData.value = { ...personResponse.data};
        formDataOriginal.value = { ...personResponse.data};
      })
      .catch((error) => {
        AlertService.showError('Ha ocurrido un error', error);
      })
      .finally(() => {
        LoadingService.hide();
      });
};

// Guardar un nuevo usuario
const saveUser = async () => {
  LoadingService.show();
  UserService.createUser(formData.value)
      .then((response) => {
        AlertService.showSuccess('Operación exitosa', response.message);
        resetForm();
        getUser()
      }).catch((error) => {
        AlertService.showError('Ha ocurrido un error', error);
      })
      .finally(() => {
        LoadingService.hide();
      });
};

const updateUser = async () => {
  LoadingService.show();
  UserService.updateUser(editingId.value, formData.value)
      .then((response) => {
        AlertService.showSuccess('Operación exitosa', response.message);
        resetForm();
        getUser()
      }).catch((error) => {
        AlertService.showError('Ha ocurrido un error', error);
      })
      .finally(() => {
        LoadingService.hide();
      });
};

// Resetear formulario
const resetForm = () => {
  formData.value = { ...formDataOriginal.value};
};

getUser();
</script>

<style scoped>
</style>
