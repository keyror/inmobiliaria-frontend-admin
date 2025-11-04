<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header pb-0">
            <h5>{{ isEditing ? 'Editar Usuario' : 'Agregar Usuario' }}</h5>
          </div>
          <div class="card-body admin-form">
            <form class="row gx-3" @submit.prevent="save">
              <CommonInputfieldsTextfield
                  v-model="formData.email"
                  classes="col-md-6 col-sm-6"
                  label="Email"
                  placeholder="Ingrese el email"
                  type="email"
                  star="*"
              />
              <CommonInputfieldsTextfield
                  v-model="formData.password"
                  classes="col-md-6 col-sm-6"
                  label="Contraseña"
                  placeholder="Ingrese la contraseña"
                  type="password"
                  :star="isEditing ? '' : '*'"
              />

              <div class="col-md-6 col-sm-6">
                <label class="form-label">Estado</label>
                <select v-model="formData.is_active" class="form-select">
                  <option :value="true">Activo</option>
                  <option :value="false">Inactivo</option>
                </select>
              </div>

              <div class="form-btn mt-3">
                <button class="btn btn-pill btn-gradient color-4" type="submit">
                  {{ isEditing ? 'Actualizar' : 'Guardar' }}
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

    <div class="row agent-section property-section user-lists">
      <div class="col-lg-12">
        <div class="property-grid-3 agent-grids ratio2_3">
          <div class="property-2 row column-sm property-label property-grid list-view">
            <Table
                :headers="peopleUsersHeader()"
                :items="usersData"
                :loading="loading"
                :server-items-length="usersTotal"
                @update="loadUsers"
                @reload="reloadDataTable"
            >
              <template #item-is_active="{ item }">
                <span :class="item.is_active ? 'badge badge-success' : 'badge badge-danger'">
                  {{ item.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </template>

              <template #item-actions="{ item }">
                <div aria-label="Acciones" class="btn-group" role="group">
                  <button class="btn btn-dashed color-1" type="button" @click="editUser(item)">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button class="btn btn-dashed color-4" type="button" @click="deleteUser(item)">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PersonService from "@/services/PersonService";
import AlertService from "~/services/AlertService";
import type {IParamsTable} from "~/interfaces/IParamsTable";
import {peopleUsersHeader} from "~/constants/tableHeaders/PeopleUsersHeader";
import LoadingService from "~/services/LoadingService";

const props = defineProps<{
  allData: any
}>()

const emit = defineEmits<{
  (e: 'reload'): void
}>()

const usersData = ref([]);
const usersTotal = ref(0);
const loading = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const formData = ref({
  email: '',
  password: '',
  is_active: true
});

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: 'created_at',
  sortType: 'desc',
  search: '',
});

// Cargar usuarios
const loadUsers = async (params: IParamsTable) => {
  LoadingService.show();
  PersonService.getUsers(params)
      .then((response) => {
        usersData.value = response.data.data;
        usersTotal.value = response.data.total;
      }).catch((error) => {
        AlertService.showError('Ha ocurrido un error', error);
      })
      .finally(() => {
        LoadingService.hide();
      });
};

const save = async () => {
  if (isEditing.value) {
    await updateUser();
  } else {
    await saveUser();
  }
}

// Guardar un nuevo usuario
const saveUser = async () => {
  LoadingService.show();
  PersonService.createUser(formData.value)
      .then((response) => {
        AlertService.showSuccess('Operación exitosa', response.message);
        resetForm();
        loadUsers(paramsTable.value);
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
  const payload = {...formData.value};
  // Si no se ingresó contraseña, no la enviamos
  if (!payload.password) {
    delete payload.password;
  }

  PersonService.updateUser(editingId.value, payload)
      .then((response) => {
        AlertService.showSuccess('Operación exitosa', response.message);
        resetForm();
        loadUsers(paramsTable.value);
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
  formData.value = {
    email: '',
    password: '',
    is_active: true
  };
  isEditing.value = false;
  editingId.value = null;
};

// Editar un usuario
const editUser = (item: any) => {
  isEditing.value = true;
  editingId.value = item.id;
  formData.value = {
    email: item.email,
    password: '',
    is_active: item.is_active
  };
};

// Eliminar un usuario
const deleteUser = async (item: any) => {
  AlertService.showConfirmation(
      '¿Está seguro de realizar esta operación?',
      `¿Está seguro de eliminar el usuario: ${item.email}?`)
      .then((result) => {
        if (result.isConfirmed) {
          LoadingService.show();
          PersonService.deleteUser(item.id)
              .then((response) => {
                AlertService.showSuccess('Operación exitosa', response.message);
                loadUsers(paramsTable.value);
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

const reloadDataTable = () => {
  loadUsers(paramsTable.value);
}

loadUsers(paramsTable.value);
</script>

<style scoped>
</style>
