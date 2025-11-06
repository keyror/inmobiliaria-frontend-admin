<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header pb-0">
            <h5>Editar Usuario</h5>
          </div>
          <div class="card-body admin-form">
            <form class="row gx-3" @submit.prevent="updateUser">
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
                  Actualizar
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
</template>

<script lang="ts" setup>
import UserService from "@/services/UserService";
import AlertService from "~/services/AlertService";
import LoadingService from "~/services/LoadingService";
import type {ILookup} from "~/interfaces/ILookup";

const props = defineProps<{
  data: any,
  lookups: ILookup[]
}>()

const emit = defineEmits<{
  (e: 'reload'): void
}>()

const editingId = ref();

const formData = ref({
  email: '',
  password: '',
  status_type_id: ''
});



// Guardar un nuevo usuario
const saveUser = async () => {
  LoadingService.show();
  UserService.createUser(formData.value)
      .then((response) => {
        AlertService.showSuccess('Operación exitosa', response.message);
        resetForm();
        emit('reload');
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
        emit('reload');
      }).catch((error) => {
        AlertService.showError('Ha ocurrido un error', error);
      })
      .finally(() => {
        LoadingService.hide();
      });
};

// Resetear formulario
const resetForm = () => {
/*formData.value = {
  email: '',
  password: '',
  status_type_id: ''
};

editingId.value = null;*/
};


// Eliminar un usuario
const deleteUser = async (item: any) => {
AlertService.showConfirmation(
    '¿Está seguro de realizar esta operación?',
    `¿Está seguro de eliminar el usuario: ${item.email}?`)
    .then((result) => {
      if (result.isConfirmed) {
        LoadingService.show();
        UserService.deleteUser(item.id)
            .then((response) => {
              AlertService.showSuccess('Operación exitosa', response.message);
              emit('reload');
            }).catch((error) => {
              AlertService.showError('Ha ocurrido un error', error);
            })
            .finally(() => {
              LoadingService.hide();
            });
      }
    });
};

watch(() => props.data, (newData) => {
if (newData) {
  formData.value = {
    email: newData.email ?? '',
    password: '', // siempre vacío al editar
    status_type_id: newData.status_type_id ?? ''
  };

  editingId.value = newData.id;
}
}, { immediate: true });
</script>

<style scoped>
</style>
