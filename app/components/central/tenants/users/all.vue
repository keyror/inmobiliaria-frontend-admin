<template>
  <div class="page-body">
    <CommonBreadcrumb title="Usuarios del Tenant" page="Gestión de Tenants" />
    <div class="container-fluid">
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-between align-items-center">
          <button class="btn btn-pill btn-dashed color-4" type="button" @click="navigateTo('/central/tenants/all')">
            <i class="fa fa-arrow-left me-1"></i> Volver a tenants
          </button>
          <button
            v-if="can('tenants.users.create')"
            class="btn btn-pill btn-gradient color-4"
            type="button"
            @click="navigateTo(`/central/tenants/${tenantId}/users/add`)"
          >
            <i class="fa fa-plus me-1"></i> Crear usuario
          </button>
        </div>
      </div>

      <div class="row agent-section property-section user-lists">
        <div class="col-lg-12">
          <div class="property-grid-3 agent-grids ratio2_3">
            <div class="property-2 row column-sm property-label property-grid list-view">
              <Table
                :headers="usersHeader"
                :items="usersData"
                :server-items-length="usersTotal"
                @update="loadUsers"
                @reload="loadUsers(lastParams)"
              >
                <template #item-status.name="{ status }">
                  <span
                    v-if="status?.name === Constants.ACTIVO"
                    class="label label-light label-flat color-3 me-1"
                  >
                    {{ status.name }}
                  </span>
                  <span v-else class="label label-light label-flat color-4">
                    {{ status?.name ?? "-" }}
                  </span>
                </template>

                <template #item-roles="{ roles }">
                  <span
                    v-for="role in roles"
                    :key="role.id"
                    class="label label-light label-flat color-3 me-1"
                  >
                    {{ role.name }}
                  </span>
                </template>

                <template #item-actions="item">
                  <div
                    v-if="canAny(['tenants.users.edit', 'tenants.users.delete'])"
                    class="btn-group"
                    role="group"
                  >
                    <button
                      v-if="can('tenants.users.edit')"
                      class="btn btn-dashed color-1"
                      type="button"
                      @click="editUser(item)"
                    >
                      <i class="fas fa-pen"></i>
                    </button>
                    <button
                      v-if="can('tenants.users.delete')"
                      class="btn btn-dashed color-4"
                      type="button"
                      @click="deleteUser(item)"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import TenantUserService from "~/services/TenantUserService";
import AlertService from "~/services/AlertService";
import { usersHeader } from "~/constants/tableHeaders/UsersHeader";
import { Constants } from "~/constants/Constants";

import type { IParamsTable } from "~/interfaces/IParamsTable";

const { run } = useApiHandler();
const { can, canAny } = useAuthorization();
const route = useRoute();

const tenantId = route.params.tenantId as string;

const usersData = ref<any[]>([]);
const usersTotal = ref(0);
const lastParams = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: "created_at",
  sortType: "desc",
  search: "",
});

const loadUsers = async (params: IParamsTable = lastParams.value) => {
  lastParams.value = params;
  const response = await run(TenantUserService.getUsers(tenantId, params));
  if (response) {
    usersData.value = response.data.data;
    usersTotal.value = response.data.total;
  }
};

const editUser = (item: any) => {
  if (!can("tenants.users.edit")) return;
  navigateTo(`/central/tenants/${tenantId}/users/edit/${item.id}`);
};

const deleteUser = async (item: any) => {
  if (!can("tenants.users.delete")) return;

  const result = await AlertService.showConfirmation(
    "¿Está seguro de realizar esta operación?",
    `¿Está seguro de eliminar el usuario: ${item.email}?`,
  );
  if (!result.isConfirmed) return;

  const response = await run(TenantUserService.deleteUser(tenantId, item.id), {
    showSuccess: true,
    successMessage: "Usuario eliminado correctamente",
  });

  if (response) {
    await loadUsers(lastParams.value);
  }
};

loadUsers();
</script>

<style scoped></style>
