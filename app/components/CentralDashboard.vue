<template>
  <div class="container-fluid">
    <div class="page-title">
      <div class="row">
        <div class="col-12">
          <h3>Panel SaaS</h3>
          <p class="text-muted mb-0">Resumen de la plataforma</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="row">
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status" />
      </div>
    </div>

    <template v-else-if="data">
      <!-- Métricas principales -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-xl-3">
          <div class="card widget-card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3">
                <div class="widget-icon bg-primary-subtle rounded-3 p-3">
                  <Icon class="fs-4 text-primary" name="lucide:grid-2x2" />
                </div>
                <div>
                  <p class="mb-1 text-muted small">Total tenants</p>
                  <h4 class="mb-0 fw-bold">{{ data.total }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6 col-xl-3">
          <div class="card widget-card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3">
                <div class="widget-icon bg-success-subtle rounded-3 p-3">
                  <Icon class="fs-4 text-success" name="lucide:user-plus" />
                </div>
                <div>
                  <p class="mb-1 text-muted small">Nuevos este mes</p>
                  <h4 class="mb-0 fw-bold">{{ data.new_this_month }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6 col-xl-3">
          <div class="card widget-card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3">
                <div class="widget-icon bg-warning-subtle rounded-3 p-3">
                  <Icon class="fs-4 text-warning" name="lucide:clock" />
                </div>
                <div>
                  <p class="mb-1 text-muted small">Vencen en 30 días</p>
                  <h4 class="mb-0 fw-bold">{{ data.expiring_soon }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6 col-xl-3">
          <div class="card widget-card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3">
                <div class="widget-icon bg-danger-subtle rounded-3 p-3">
                  <Icon class="fs-4 text-danger" name="lucide:x-circle" />
                </div>
                <div>
                  <p class="mb-1 text-muted small">Suscripción vencida</p>
                  <h4 class="mb-0 fw-bold">{{ data.expired }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <!-- Por plan -->
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-header">
              <h6 class="mb-0">
                <Icon class="me-2" name="lucide:credit-card" />
                Distribución por plan
              </h6>
            </div>
            <div class="card-body">
              <div v-if="data.by_plan.length === 0" class="text-muted small">
                Sin datos
              </div>
              <ul v-else class="list-unstyled mb-0">
                <li
                  v-for="item in data.by_plan"
                  :key="item.name"
                  class="d-flex justify-content-between align-items-center py-2 border-bottom"
                >
                  <span>{{ item.name }}</span>
                  <span class="badge bg-primary-subtle text-primary fw-semibold">
                    {{ item.count }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Por estado -->
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-header">
              <h6 class="mb-0">
                <Icon class="me-2" name="lucide:activity" />
                Por estado
              </h6>
            </div>
            <div class="card-body">
              <div
                v-if="Object.keys(data.by_status).length === 0"
                class="text-muted small"
              >
                Sin datos
              </div>
              <ul v-else class="list-unstyled mb-0">
                <li
                  v-for="(count, status) in data.by_status"
                  :key="status"
                  class="d-flex justify-content-between align-items-center py-2 border-bottom"
                >
                  <span>{{ status }}</span>
                  <span class="badge bg-success-subtle text-success fw-semibold">
                    {{ count }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Tenants recientes -->
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h6 class="mb-0">
                <Icon class="me-2" name="lucide:clock" />
                Recientes
              </h6>
              <nuxt-link class="btn btn-sm btn-light" to="/central/tenants/all">
                Ver todos
              </nuxt-link>
            </div>
            <div class="card-body p-0">
              <ul class="list-group list-group-flush">
                <li
                  v-for="tenant in data.recent"
                  :key="tenant.id"
                  class="list-group-item px-3 py-2"
                >
                  <div class="d-flex justify-content-between">
                    <div>
                      <p class="mb-0 fw-semibold small">{{ tenant.name }}</p>
                      <p class="mb-0 text-muted" style="font-size: 0.75rem">
                        {{ tenant.domain }}
                      </p>
                    </div>
                    <span class="text-muted" style="font-size: 0.7rem; white-space: nowrap">
                      {{ formatDate(tenant.created_at) }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ApiUrls } from "~/constants/ApiUrls";

interface PlanStat {
  name: string;
  count: number;
}

interface RecentTenant {
  id: string;
  name: string;
  domain: string;
  created_at: string;
}

interface CentralStats {
  total: number;
  new_this_month: number;
  expiring_soon: number;
  expired: number;
  by_plan: PlanStat[];
  by_status: Record<string, number>;
  recent: RecentTenant[];
}

const { run } = useApiHandler();
const loading = ref(true);
const data = ref<CentralStats | null>(null);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
  });

onMounted(async () => {
  const res = await run($fetch<{ status: boolean; data: CentralStats }>(ApiUrls.DASHBOARD_GET));
  if (res?.status) data.value = res.data;
  loading.value = false;
});
</script>
