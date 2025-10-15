<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header pb-0">
            <h5>Agregar permiso</h5>
          </div>
          <div class="card-body admin-form">
            <form class="row gx-3" @submit.prevent="savePermission">
              <CommonInputfieldsTextfield
                  v-model="newPermission.name"
                  classes="col-md-6 col-sm-6"
                  label="Nombre del permiso"
                  placeholder="Ingrese el nombre del permiso"
                  star="*"
              />

              <div class="form-btn mt-3">
                <button class="btn btn-pill btn-gradient color-4" type="submit">{{
                    isEditing ? 'Actualizar' : 'Guardar'
                  }}
                </button>
                <button class="btn btn-pill btn-dashed color-4" type="button" @click="resetForm">Cancelar</button>
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
                :headers="permissionsHeader"
                :items="permissionsData"
                :server-items-length="permissionsTotal"
                @update="loadPermissions"
            >
              <template #item-actions="{ item }">
                <div aria-label="Acciones" class="btn-group" role="group">
                  <button class="btn btn-dashed color-1" type="button" @click="editPermission(item)">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button class="btn btn-dashed color-4" type="button" @click="deletePermission(item)">
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
import RolePermissionService from "@/services/RolePermissionService";
import AlertaService from "~/services/AlertService";
import type {IParamsTable} from "~/interfaces/IParamsTable";
import {permissionsHeader} from "~/constants/tableHeaders/PermissionsHeader";
import LoadingService from "~/services/LoadingService";

const permissionsData = ref([]);
const permissionsTotal = ref(0);
const isEditing = ref(false);
const editingId = ref(null);

const newPermission = ref({
  name: ''
});

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: 'created_at',
  sortType: 'desc',
  search: '',
});

// Cargar permisos
const loadPermissions = async (params: IParamsTable) => {
  LoadingService.show();
  RolePermissionService.getPermissions(params)
      .then((response) => {
        permissionsData.value = response.data.data;
        permissionsTotal.value = response.data.total;
        LoadingService.hide();
      }).catch((error) => {
    LoadingService.hide();
    AlertaService.showError('Ha ocurrido un error', error);
  });
};

// Guardar un nuevo permiso o actualizar uno existente
const savePermission = async () => {
  if (isEditing.value) {
    await updatePermission();
  } else {
    await saveNewPermission();
  }
};

// Guardar un nuevo permiso
const saveNewPermission = async () => {
  LoadingService.show();
  RolePermissionService.createPermission(newPermission.value)
      .then((response) => {
        AlertaService.showSuccess('Operación exitosa', response.message);
        resetForm();
        loadPermissions(paramsTable.value);
        LoadingService.hide();
      })
      .catch((error) => {
        LoadingService.hide();
        AlertaService.showError('Ha ocurrido un error', error);
      });
};

// Actualizar permiso existente
const updatePermission = async () => {
  LoadingService.show();
  RolePermissionService.updatePermission(editingId.value, newPermission.value)
      .then((response) => {
        AlertaService.showSuccess('Operación exitosa', response.message);
        resetForm();
        loadPermissions(paramsTable.value);
        LoadingService.hide();
      })
      .catch((error) => {
        LoadingService.hide();
        AlertaService.showError('Ha ocurrido un error', error);
      });
};


// Resetear formulario
const resetForm = () => {
  newPermission.value = {
    name: ''
  };
  isEditing.value = false;
};

// Editar un permiso
const editPermission = (item: any) => {
  newPermission.value = {
    name: item.name,
  };
  isEditing.value = true;
  editingId.value = item.id;
};

// Eliminar un permiso
const deletePermission = async (item: any) => {
  AlertaService.showConfirmation(
      '¿Está seguro de realizar esta operación?',
      `¿Está seguro de eliminar el permiso: ${item.name}?`)
      .then((result) => {
        if (result.isConfirmed) {
          LoadingService.show();
          RolePermissionService.deletePermission(item.id)
              .then((response) => {
                AlertaService.showSuccess('Operación exitosa', response.message);
                LoadingService.hide();
                loadPermissions(paramsTable.value);
              }).catch((error) => {
            LoadingService.hide();
            AlertaService.showError('Ha ocurrido un error', error);
          });
        }
      });
};

loadPermissions(paramsTable.value);
console.log("hola");
</script>

<style scoped>
</style>
