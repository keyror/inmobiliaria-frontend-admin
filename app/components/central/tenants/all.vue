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
                <template #item-actions="item">
                  <div
                    class="btn-group"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      class="btn btn-dashed color-1"
                      type="button"
                      @click="edit(item)"
                    >
                      <i class="fas fa-pen"></i>
                    </button>
                    <button
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
import { tenantsHeader } from "~/constants/tableHeaders/TenantsHeader";
import AlertService from "~/services/AlertService";

import type { IParamsTable } from "~/interfaces/IParamsTable";

const { run } = useApiHandler();

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

const edit = (item: any) => {
  navigateTo(`/central/tenants/edit/${item.id}`);
};

const reloadDataTable = () => {
  tenants(paramsTable.value);
};

tenants(paramsTable.value);
</script>

<style scoped></style>
