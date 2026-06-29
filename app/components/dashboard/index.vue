<template xmlns="http://www.w3.org/1999/html">
  <div class="page-body">
    <CommonBreadcrumb title="Dashboard" page="Dashboard" />
    <div class="container-fluid">
      <!-- Tarjetas de estadísticas -->
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <div class="card all-properties">
            <div class="card-body">
              <div class="media">
                <div class="stat-icon-wrap color-1">
                  <Icon
                    name="material-symbols:home-outline"
                    class="stat-icon"
                  />
                </div>
                <div class="media-body">
                  <h4 class="mb-0">{{ stats?.total_properties ?? "—" }}</h4>
                  <h6 class="light-font">Total propiedades</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="media">
                <div class="stat-icon-wrap color-2">
                  <Icon
                    name="material-symbols:star-outline"
                    class="stat-icon"
                  />
                </div>
                <div class="media-body">
                  <h4 class="mb-0">{{ stats?.featured_properties ?? "—" }}</h4>
                  <h6 class="light-font">Propiedades destacadas</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="media">
                <div class="stat-icon-wrap color-3">
                  <Icon
                    name="material-symbols:group-outline"
                    class="stat-icon"
                  />
                </div>
                <div class="media-body">
                  <h4 class="mb-0">{{ stats?.total_people ?? "—" }}</h4>
                  <h6 class="light-font">Personas / Clientes</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="media">
                <div class="stat-icon-wrap color-4">
                  <Icon
                    name="material-symbols:calendar-month-outline"
                    class="stat-icon"
                  />
                </div>
                <div class="media-body">
                  <h4 class="mb-0">
                    {{ stats?.properties_this_month ?? "—" }}
                  </h4>
                  <h6 class="light-font">Propiedades este mes</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado del inventario -->
      <div v-if="stats?.by_status?.length" class="row">
        <div class="col-xl-5 col-md-8 col-12">
          <div class="card">
            <div class="card-header pb-0">
              <h5>Estado de las propiedades</h5>
            </div>
            <div class="card-body pt-3">
              <div class="d-flex flex-wrap gap-3">
                <div
                  v-for="s in stats.by_status"
                  :key="s.name"
                  class="status-chip"
                >
                  <span class="status-chip__count">{{ s.total }}</span>
                  <span class="status-chip__label">{{ s.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Propiedades -->
      <div class="row">
        <div class="col-12">
          <Table
            :headers="propertiesHeader"
            :items="propertiesData"
            :server-items-length="propertiesTotal"
            sort-by="created_at"
            @update="loadProperties"
            @reload="loadProperties(lastParams)"
          >
            <template #item-actions="item">
              <div class="btn-group" role="group">
                <button
                  class="btn btn-dashed color-1"
                  type="button"
                  @click="navigateTo(`/properties/edit/${item.id}`)"
                >
                  <i class="fas fa-pen"></i>
                </button>
              </div>
            </template>
          </Table>
        </div>
      </div>

      <!--
        Pendiente de implementar (requieren módulos no existentes aún):
        <DashboardChart />         — necesita datos de series de tiempo (ventas/arriendos por mes)
        <DashboardSalesdetails />  — necesita módulo de facturas y pagos
        <DashboardTimeline />      — necesita módulo de eventos/actividades
        <DashboardMyproperties />  — pendiente de rediseño con datos reales
        <DashboardReport />        — necesita módulo de reportes
        <DashboardSoldout />       — necesita histórico de propiedades vendidas/arrendadas
      -->
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardService from "~/services/DashboardService";
import PropertyService from "~/services/PropertyService";
import { propertiesHeader } from "~/constants/tableHeaders/PropertiesHeader";
import type { IDashboard, IDashboardStats } from "~/interfaces/IDashboard";
import type { IParamsTable } from "~/interfaces/IParamsTable";

const { run } = useApiHandler();

const stats = ref<IDashboardStats | null>(null);
const propertiesData = ref([]);
const propertiesTotal = ref(0);
const lastParams = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: "created_at",
  sortType: "desc",
  search: "",
});

const loadProperties = async (params: IParamsTable = lastParams.value) => {
  lastParams.value = params;
  const response = await run(PropertyService.getProperties(params));
  if (response) {
    propertiesData.value = response.data.data;
    propertiesTotal.value = response.data.total;
  }
};

onMounted(async () => {
  const result = await run(DashboardService.getStats());
  if (result) {
    const data = (result as any).data as IDashboard;
    stats.value = data.stats;
  }
});

loadProperties();
</script>

<style scoped>
.media {
  display: flex;
  align-items: center;
  gap: 16px;
}

.media-body {
  flex: 1;
}

.stat-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon {
  font-size: 26px;
  width: 26px;
  height: 26px;
}

.color-1 {
  background-color: rgba(115, 102, 255, 0.12);
  color: #7366ff;
}
.color-2 {
  background-color: rgba(255, 193, 7, 0.15);
  color: #d4a017;
}
.color-3 {
  background-color: rgba(40, 167, 69, 0.12);
  color: #28a745;
}
.color-4 {
  background-color: rgba(13, 110, 253, 0.12);
  color: #0d6efd;
}

.status-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  min-width: 90px;
}

.status-chip__count {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--theme-default, #7366ff);
}

.status-chip__label {
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 2px;
  text-align: center;
}
</style>
