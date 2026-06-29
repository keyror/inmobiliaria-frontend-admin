<template>
  <div class="page-body">
    <CommonBreadcrumb title="Planes" page="Planes SaaS" />
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <Table
            :headers="plansHeader"
            :items="plansData"
            :server-items-length="plansTotal"
            @update="loadPlans"
            @reload="loadPlans(lastParams)"
          >
            <template #item-is_active="{ is_active }">
              <span
                class="label label-light label-flat"
                :class="is_active ? 'color-3' : 'color-4'"
              >
                {{ is_active ? "Activo" : "Inactivo" }}
              </span>
            </template>

            <template #item-price="{ price }">
              {{ Number(price).toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }) }}
            </template>

            <template #item-actions="item">
              <div
                v-if="canAny(['plans.edit', 'plans.delete'])"
                class="btn-group"
                role="group"
              >
                <button
                  v-if="can('plans.edit')"
                  class="btn btn-dashed color-1"
                  type="button"
                  @click="navigateTo(`/plans/edit/${item.id}`)"
                >
                  <i class="fas fa-pen"></i>
                </button>
                <button
                  v-if="can('plans.delete')"
                  class="btn btn-dashed color-4"
                  type="button"
                  @click="deletePlan(item)"
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
</template>

<script setup lang="ts">
import PlanService from "~/services/PlanService";
import AlertService from "~/services/AlertService";
import { plansHeader } from "~/constants/tableHeaders/PlansHeader";
import type { IParamsTable } from "~/interfaces/IParamsTable";

const { run } = useApiHandler();
const { can, canAny } = useAuthorization();

const plansData = ref([]);
const plansTotal = ref(0);
const lastParams = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: "created_at",
  sortType: "desc",
  search: "",
});

const loadPlans = async (params: IParamsTable = lastParams.value) => {
  lastParams.value = params;
  const response = await run(PlanService.getPlans(params));
  if (response) {
    plansData.value = response.data.data;
    plansTotal.value = response.data.total;
  }
};

const deletePlan = async (item: any) => {
  if (!can("plans.delete")) return;

  const result = await AlertService.showConfirmation(
    "¿Está seguro de eliminar este plan?",
    `Los tenants asignados a "${item.name}" perderán su plan asignado.`,
  );

  if (!result.isConfirmed) return;

  const response = await run(PlanService.deletePlan(item.id), {
    showSuccess: true,
    successMessage: "Plan eliminado correctamente",
  });

  if (response) {
    await loadPlans(lastParams.value);
  }
};

loadPlans();
</script>

<style scoped></style>
