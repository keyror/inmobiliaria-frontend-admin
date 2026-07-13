<template>
  <div class="page-body">
    <CommonBreadcrumb title="Listado de contratos" page="Administrar contratos" />
    <div class="container-fluid">
      <div class="row agent-section property-section user-lists">
        <div class="col-lg-12">
          <div class="property-grid-3 agent-grids ratio2_3">
            <div
              class="property-2 row column-sm property-label property-grid list-view"
            >
              <Table
                :headers="rentsHeader"
                :items="data"
                @update="loadRents"
                :server-items-length="total"
                @reload="reloadDataTable"
              >
                <template #item-property="item">
                  <span v-if="item.property">
                    <strong>{{ item.property.code }}</strong> — {{ item.property.title }}
                  </span>
                  <span v-else>-</span>
                </template>

                <template #item-status="item">
                  <span
                    class="badge"
                    :class="{
                      'bg-success': item.status === 'activo',
                      'bg-warning': item.status === 'pendiente',
                      'bg-danger': item.status === 'terminado',
                      'bg-secondary': !['activo', 'pendiente', 'terminado'].includes(item.status),
                    }"
                  >
                    {{ item.status }}
                  </span>
                </template>

                <template #item-canon="item">
                  {{ formatCOP(item.canon) }}
                </template>

                <template #item-actions="item">
                  <div
                    v-if="can('rents.edit') || can('rents.delete')"
                    class="btn-group"
                    role="group"
                  >
                    <button
                      v-if="can('rents.edit')"
                      class="btn btn-dashed color-1"
                      type="button"
                      @click="edit(item)"
                    >
                      <i class="fas fa-pen"></i>
                    </button>
                    <button
                      v-if="can('rents.delete')"
                      class="btn btn-dashed color-4"
                      type="button"
                      @click="deleteRent(item)"
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
import RentService from "@/services/RentService";
import { useApiHandler } from "~/composables/useApiHandler";
import { rentsHeader } from "~/constants/tableHeaders/RentsHeader";
import AlertService from "~/services/AlertService";

import type { IParamsTable } from "~/interfaces/IParamsTable";

const { run } = useApiHandler();
const { can } = useAuthorization();
const route = useRoute();

const data = ref([]);
const total = ref(0);

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: "created_at",
  sortType: "desc",
  search: (route.query.q as string) ?? "",
});

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

const formatCOP = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "-";
  return copFormatter.format(Number(value));
};

const loadRents = async (params: IParamsTable) => {
  const response = await run(RentService.getRents(params));
  if (response) {
    data.value = response.data.data;
    total.value = response.data.total;
  }
};

const edit = (item: any) => {
  if (!can("rents.edit")) return;
  navigateTo(`/rents/edit/${item.id}`);
};

const deleteRent = async (item: any) => {
  if (!can("rents.delete")) return;

  const result = await AlertService.showConfirmation(
    "¿Está seguro de realizar esta operación?",
    `Está seguro de eliminar el contrato: ${item.contract_number ?? item.id}`,
  );

  if (!result.isConfirmed) return;

  const response = await run(RentService.deleteRent(item.id), {
    showSuccess: true,
    successMessage: "Contrato eliminado correctamente",
  });

  if (response) {
    await loadRents(paramsTable.value);
  }
};

const reloadDataTable = () => {
  loadRents(paramsTable.value);
};

loadRents(paramsTable.value);
</script>

<style scoped></style>
