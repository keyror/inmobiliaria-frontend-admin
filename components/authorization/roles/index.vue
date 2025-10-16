<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header pb-0">
            <h5> {{ $t('rol.addRol') }}</h5>
          </div>
          <div class="card-body admin-form">
            <form class="row gx-3" @submit.prevent="save">
              <CommonInputfieldsTextfield
                  v-model="newRole.name"
                  classes="col-md-6 col-sm-6"
                  label="Nombre del rol"
                  placeholder="Ingrese el nombre del rol"
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
                :headers="rolesHeader()"
                :items="rolesData"
                :loading="loading"
                :server-items-length="rolesTotal"
                @update="loadRoles"
            >
              <template #item-actions="{ item }">
                <div aria-label="Acciones" class="btn-group" role="group">
                  <button class="btn btn-dashed  color-2" type="button" @click="openPermissionsModal(item)">
                    <i class="fas fa-lock color-1"></i>
                  </button>
                  <button class="btn btn-dashed color-1" type="button" @click="editRole(item)">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button class="btn btn-dashed color-4" type="button" @click="deleteRole(item)">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para asignar permisos -->
    <CommonModal
        v-model:show="showModal"
        :title="`Permisos: ${selectedRole?.name}`"
        size="xl">

      <AuthorizationPermissionsGroup
          :permissions="allPermissions"
          :selectedPermissions="selectedPermissions"
          @update:selectedPermissions="selectedPermissions = $event"
      />

      <!-- Botones de acción -->
      <template #actions>
        <button
            :disabled="loadingPermissions"
            class="btn btn-pill btn-gradient color-4"
            type="button"
            @click="savePermissions">
          Guardar permisos
        </button>
      </template>
    </CommonModal>
  </div>
</template>

<script lang="ts" setup>
import RolePermissionService from "@/services/RolePermissionService";
import AlertaService from "~/services/AlertService";
import type {IParamsTable} from "~/interfaces/IParamsTable";
import {rolesHeader} from "~/constants/tableHeaders/RolesHeader";
import LoadingService from "~/services/LoadingService";
import { usePermissions } from '~/composables/usePermissions'

const { allPermissions, loadPermissions } = usePermissions()

const rolesData = ref([]);
const rolesTotal = ref(0);
const loading = ref(false);
const isEditing = ref(false);

const newRole = ref({
  name: '',
});

const selectedRole = ref(null);
const selectedPermissions = ref([]);
const loadingPermissions = ref(false);
const showModal = ref(false);

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: 'created_at',
  sortType: 'desc',
  search: '',
});

// Cargar roles
const loadRoles = async (params: IParamsTable) => {
  LoadingService.show();
  RolePermissionService.getRoles(params)
      .then((response) => {
        rolesData.value = response.data.data;
        rolesTotal.value = response.data.total;
        LoadingService.hide();
      }).catch((error) => {
    LoadingService.hide();
    AlertaService.showError('Ha ocurrido un error', error);
  });
};

const save = async () => {
  if (isEditing.value) {
    await updateRole();
  } else {
    await saveRole();
  }
}

// Guardar un nuevo rol
const saveRole = async () => {
  LoadingService.show();
  RolePermissionService.createRole(newRole.value)
      .then((response) => {
        AlertaService.showSuccess('Operación exitosa', response.message);
        resetForm();
        loadRoles(paramsTable.value);
        LoadingService.hide();
      }).catch((error) => {
    LoadingService.hide();
    AlertaService.showError('Ha ocurrido un error', error);
  });
};

const updateRole = async () => {
  LoadingService.show();
  RolePermissionService.updateRole(selectedRole.value, newRole.value)
      .then((response) => {
        AlertaService.showSuccess('Operación exitosa', response.message);
        resetForm();
        loadRoles(paramsTable.value);
        LoadingService.hide();
      }).catch((error) => {
    LoadingService.hide();
    AlertaService.showError('Ha ocurrido un error', error);
  });
};

// Resetear formulario
const resetForm = () => {
  newRole.value = {
    name: '',
  };
  isEditing.value = false;
};

// Editar un rol
const editRole = (item: any) => {
  isEditing.value = true;
  selectedRole.value = item.id;
  newRole.value = {
    name: item.name,
  };
};

// Eliminar un rol
const deleteRole = async (item: any) => {
  AlertaService.showConfirmation(
      '¿Está seguro de realizar esta operación?',
      `¿Está seguro de eliminar el rol: ${item.name}?`)
      .then((result) => {
        if (result.isConfirmed) {
          LoadingService.show();
          RolePermissionService.deleteRole(item.id)
              .then((response) => {
                AlertaService.showSuccess('Operación exitosa', response.message);
                LoadingService.hide();
                loadRoles(paramsTable.value);
              }).catch((error) => {
            LoadingService.hide();
            AlertaService.showError('Ha ocurrido un error', error);
          });
        }
      });
};

// Abrir modal de permisos
const openPermissionsModal = async (item: any) => {
  selectedRole.value = item;
  selectedPermissions.value = item.permissions.map((permission: any) => permission.id);
  showModal.value = true;
};

// Guardar permisos
const savePermissions = async () => {
  if (!selectedRole.value) return;

  LoadingService.show();
  RolePermissionService.assignPermissionsToRole(selectedRole.value.id, selectedPermissions.value)
      .then((response) => {
        AlertaService.showSuccess('Operación exitosa', 'Permisos asignados correctamente');
        closePermissionsModal();
        LoadingService.hide();
        loadRoles(paramsTable.value);
      }).catch((error) => {
    LoadingService.hide();
    AlertaService.showError('Ha ocurrido un error', error);
  });
};

// Función para cerrar el modal
const closePermissionsModal = () => {
  showModal.value = false;
};

loadRoles(paramsTable.value);
loadPermissions();
</script>

<style scoped>
</style>
