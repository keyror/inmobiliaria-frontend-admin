<template>
  <div class="page-body">
    <CommonBreadcrumb
      title="Listado propiedades"
      page="Administrar propiedades"
    />
    <div class="container-fluid">
      <div class="row agent-section property-section user-lists">
        <div class="col-lg-12">
          <div class="property-grid-3 agent-grids ratio2_3">
            <div
              class="property-2 row column-sm property-label property-grid list-view"
            >
              <Table
                :headers="propertiesHeader"
                :items="data"
                @update="properties"
                :server-items-length="total"
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
                      @click="deleteProperty(item)"
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
import PropertyService from "@/services/PropertyService";
import { useApiHandler } from "~/composables/useApiHandler";
import { propertiesHeader } from "~/constants/tableHeaders/PropertiesHeader";
import AlertService from "~/services/AlertService";

import type { IParamsTable } from "~/interfaces/IParamsTable";

const { run } = useApiHandler();

const data = ref([]);

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: "created_at",
  sortType: "desc",
  search: "",
});
const total = ref(0);

const properties = async (params: IParamsTable) => {
  const response = await run(PropertyService.getProperties(params));

  if (response) {
    data.value = response.data.data;
    total.value = response.data.total;
  }
};

const edit = (item: any) => {
  navigateTo(`/properties/edit/${item.id}`);
};

const deleteProperty = async (item: any) => {
  const result = await AlertService.showConfirmation(
    "¿ Está seguro de realizar esta operación ?",
    `Esta seguro de eliminar el registro : ${item.title}`,
  );

  if (!result.isConfirmed) return;

  const response = await run(PropertyService.deleteProperty(item.id), {
    showSuccess: true,
    successMessage: "Propiedad eliminada correctamente",
  });

  if (response) {
    await properties(paramsTable.value);
  }
};

const reloadDataTable = () => {
  properties(paramsTable.value);
};

properties(paramsTable.value);
</script>

<style scoped></style>
