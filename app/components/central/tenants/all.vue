<template>
  <div class="page-body">
    <CommonBreadcrumb
      :title="sidebarData.sidebar[2].children[0].title"
      :page="sidebarData.sidebar[2].title"
    />
    <div class="container-fluid">
      <div class="row agent-section property-section user-lists">
        <div class="col-lg-12">
          <div class="property-grid-3 agent-grids ratio2_3">
            <div
              class="property-2 row column-sm property-label property-grid list-view"
            >
              <Table
                :headers="tenantsHeader"
                :items="tenantsData"
                @update="tenants"
                :server-items-length="tenantsTotal"
                @reload="reloadDataTable"
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

                <template #item-actions="item">
                  <div
                    v-if="
                      canAny([
                        'tenants.edit',
                        'tenants.delete',
                        'tenants.activate',
                        'tenants.deactivate',
                      ])
                    "
                    class="btn-group"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      v-if="
                        item.status?.name === Constants.ACTIVO &&
                        can('tenants.deactivate')
                      "
                      class="btn btn-dashed color-4"
                      type="button"
                      @click="deactivate(item)"
                    >
                      <i class="fas fa-ban"></i>
                    </button>
                    <button
                      v-if="
                        item.status?.name !== Constants.ACTIVO &&
                        can('tenants.activate')
                      "
                      class="btn btn-dashed color-3"
                      type="button"
                      @click="activate(item)"
                    >
                      <i class="fas fa-check"></i>
                    </button>
                    <button
                      v-if="can('tenants.edit')"
                      class="btn btn-dashed color-1"
                      type="button"
                      @click="edit(item)"
                    >
                      <i class="fas fa-pen"></i>
                    </button>

                    <!-- DOMAIN BUTTON -->
                    <a
                      v-if="item.domain"
                      :href="formatDomain(item.domain)"
                      class="btn btn-dashed color-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i class="fas fa-external-link-alt"></i>
                    </a>

                    <button
                      v-if="can('tenants.delete')"
                      class="btn btn-dashed color-4"
                      type="button"
                      @click="deleted(item)"
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
import sidebar from "@/../public/data/sidebar.json";
import TenantService from "@/services/TenantService";
import { useApiHandler } from "~/composables/useApiHandler";
import { Constants } from "~/constants/Constants";
import { tenantsHeader } from "~/constants/tableHeaders/TenantsHeader";
import AlertService from "~/services/AlertService";

import type { IParamsTable } from "~/interfaces/IParamsTable";

const { run } = useApiHandler();
const { can, canAny } = useAuthorization();

const sidebarData = ref(sidebar);
const tenantsData = ref([]);

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: "created_at",
  sortType: "desc",
  search: "",
});

const tenantsTotal = ref(0);

const tenants = async (params: IParamsTable) => {
  const response = await run(TenantService.getTenants(params));

  if (response) {
    tenantsData.value = response.data.data;
    tenantsTotal.value = response.data.total;
  }
};

const deleted = async (item: any) => {
  if (!can("tenants.delete")) return;

  const result = await AlertService.showConfirmation(
    "¿ Está seguro de realizar esta operación ?",
    `Esta seguro de eliminar el registro : ${item.name}`,
  );

  if (!result.isConfirmed) return;

  const response = await run(TenantService.deleteTenant(item.id), {
    showSuccess: true,
    successMessage: "Tenant eliminado correctamente",
  });

  if (response) {
    await tenants(paramsTable.value);
  }
};

const activate = async (item: any) => {
  if (!can("tenants.activate")) return;

  const response = await run(TenantService.activateTenant(item.id), {
    showSuccess: true,
    successMessage: "Tenant activado correctamente",
  });

  if (response) {
    await tenants(paramsTable.value);
  }
};

const deactivate = async (item: any) => {
  if (!can("tenants.deactivate")) return;

  const response = await run(TenantService.deactivateTenant(item.id), {
    showSuccess: true,
    successMessage: "Tenant desactivado correctamente",
  });

  if (response) {
    await tenants(paramsTable.value);
  }
};

const edit = (item: any) => {
  if (!can("tenants.edit")) return;

  navigateTo(`/central/tenants/edit/${item.id}`);
};

const formatDomain = (domain: string) => {
  if (!domain) return "";
  // If domain already contains protocol, return as-is
  if (/^https?:\/\//i.test(domain)) return domain;
  return `https://${domain}`;
};

const reloadDataTable = () => {
  tenants(paramsTable.value);
};

tenants(paramsTable.value);
</script>

<style scoped></style>
