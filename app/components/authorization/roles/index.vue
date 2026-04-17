<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header pb-0">
            <h5>
              {{ isEditing ? "Actualizar" : "Guardar" }} {{ $t("rol.addRol") }}
            </h5>
          </div>
          <div class="card-body admin-form">
            <form class="row gx-3" @submit.prevent="save" novalidate>
              <CommonInputfieldsTextfield
                ref="nameInputRef"
                v-model="name"
                :error="errors.name"
                classes="col-md-6 col-sm-6"
                label="Nombre del rol"
                placeholder="Ingrese el nombre del rol"
                star="*"
              />
              <div class="form-btn mt-3">
                <button class="btn btn-pill btn-gradient color-4" type="submit">
                  {{ isEditing ? "Actualizar" : "Guardar" }}
                </button>
                <button
                  class="btn btn-pill btn-dashed color-4"
                  type="button"
                  @click="resetRoleForm"
                >
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
          <div
            class="property-2 row column-sm property-label property-grid list-view"
          >
            <Table
              :headers="rolesHeader()"
              :items="rolesData"
              :loading="loading"
              :server-items-length="rolesTotal"
              @update="loadRoles"
              @reload="reloadDataTable"
            >
              <template #item-actions="item">
                <div aria-label="Acciones" class="btn-group" role="group">
                  <button
                    class="btn btn-dashed color-2"
                    type="button"
                    @click="openPermissionsModal(item)"
                  >
                    <i class="fas fa-lock color-1"></i>
                  </button>
                  <button
                    class="btn btn-dashed color-1"
                    type="button"
                    @click="editRole(item)"
                  >
                    <i class="fas fa-pen"></i>
                  </button>
                  <button
                    class="btn btn-dashed color-4"
                    type="button"
                    @click="deleteRole(item)"
                  >
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
      size="xl"
    >
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
          @click="savePermissions"
        >
          Guardar permisos
        </button>
      </template>
    </CommonModal>
  </div>
</template>

<script lang="ts" setup>
import RolePermissionService from "@/services/RolePermissionService";
import { useRoleForm } from "~/composables/forms/useRoleForm";
import { useApiHandler } from "~/composables/useApiHandler";
import { usePermissions } from "~/composables/usePermissions";
import { rolesHeader } from "~/constants/tableHeaders/RolesHeader";
import AlertaService from "~/services/AlertService";

import type { IParamsTable } from "~/interfaces/IParamsTable";

const { run } = useApiHandler();
const { allPermissions, loadPermissions } = usePermissions();

const { handleSubmit, errors, defineField, resetForm, setErrors } =
  useRoleForm();

const [name] = defineField("name");

const nameInputRef = ref<HTMLInputElement | null>(null);

// estado
const rolesData = ref([]);
const rolesTotal = ref(0);
const loading = ref(false);
const isEditing = ref(false);
const selectedRole = ref<number | null>(null);

// modal
const selectedPermissions = ref([]);
const loadingPermissions = ref(false);
const showModal = ref(false);

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: "created_at",
  sortType: "desc",
  search: "",
});

const loadRoles = async (params: IParamsTable) => {
  const response = await run(RolePermissionService.getRoles(params));

  if (response) {
    rolesData.value = response.data.data;
    rolesTotal.value = response.data.total;
  }
};

const save = handleSubmit(async (values) => {
  const promise = isEditing.value
    ? RolePermissionService.updateRole(selectedRole.value, values)
    : RolePermissionService.createRole(values);

  const response = await run(promise, {
    setErrors,
    showSuccess: true,
    successMessage: isEditing.value
      ? "Rol actualizado correctamente"
      : "Rol creado correctamente",
  });

  if (response) {
    resetRoleForm();
    await loadRoles(paramsTable.value);
  }
});

const resetRoleForm = () => {
  isEditing.value = false;
  selectedRole.value = null;

  resetForm({
    values: { name: "" },
  });
};

const editRole = (item: any) => {
  isEditing.value = true;
  selectedRole.value = item.id;

  resetForm({
    values: {
      name: item.name,
    },
  });

  nextTick(() => {
    nameInputRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
    nameInputRef.value?.focus();
  });
};

const deleteRole = async (item: any) => {
  const result = await AlertaService.showConfirmation(
    "¿Está seguro de realizar esta operación?",
    `¿Eliminar el rol: ${item.name}?`,
  );

  if (!result.isConfirmed) return;

  const response = await run(RolePermissionService.deleteRole(item.id), {
    showSuccess: true,
    successMessage: "Rol eliminado correctamente",
  });

  if (response) {
    await loadRoles(paramsTable.value);
  }
};

const openPermissionsModal = (item: any) => {
  selectedRole.value = item;
  selectedPermissions.value = item.permissions.map((p: any) => p.id);
  showModal.value = true;
};

const savePermissions = async () => {
  if (!selectedRole.value) return;

  const response = await run(
    RolePermissionService.assignPermissionsToRole(
      selectedRole.value.id,
      selectedPermissions.value,
    ),
    {
      showSuccess: true,
      successMessage: "Permisos actualizados correctamente",
    },
  );

  if (response) {
    showModal.value = false;
    await loadRoles(paramsTable.value);
  }
};

// reload
const reloadDataTable = () => {
  loadRoles(paramsTable.value);
  loadPermissions();
};

loadRoles(paramsTable.value);
loadPermissions();
</script>

<style scoped></style>
