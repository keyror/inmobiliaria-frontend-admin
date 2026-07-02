<template>
  <div class="page-body">
    <CommonBreadcrumb title="Auditoría" page="Registro de actividad" />
    <div class="container-fluid">

      <!-- Filtros -->
      <div class="row mb-3">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body admin-form">
              <form class="row gx-3" autocomplete="off" @submit.prevent="applyFilters">
                <CommonInputfieldsSelectfield
                  v-model="filters.log_name"
                  :data="MODULE_OPTIONS"
                  label="Módulo"
                  name="log_name"
                  classes="col-md-3 col-sm-6"
                  show="Todos los módulos"
                />
                <CommonInputfieldsSelectfield
                  v-model="filters.event"
                  :data="EVENT_OPTIONS"
                  label="Acción"
                  name="event"
                  classes="col-md-2 col-sm-6"
                  show="Todas las acciones"
                />
                <CommonInputfieldsTextfield
                  v-model="filters.causer_email"
                  label="Email del usuario"
                  name="causer_email"
                  classes="col-md-3 col-sm-6"
                  :required="false"
                />
                <div class="form-group col-md-2 col-sm-6">
                  <label>Desde</label>
                  <VueDatePicker
                    v-model="filters.date_from"
                    format="yyyy-MM-dd"
                    model-type="yyyy-MM-dd"
                    :enable-time-picker="false"
                    placeholder="Fecha inicio"
                    auto-apply
                  />
                </div>
                <div class="form-group col-md-2 col-sm-6">
                  <label>Hasta</label>
                  <VueDatePicker
                    v-model="filters.date_to"
                    format="yyyy-MM-dd"
                    model-type="yyyy-MM-dd"
                    :enable-time-picker="false"
                    placeholder="Fecha fin"
                    auto-apply
                  />
                </div>
                <div class="col-12 d-flex gap-2 mt-2">
                  <button class="btn btn-pill btn-dashed color-1" type="submit">
                    <i class="fa fa-search me-1"></i> Buscar
                  </button>
                  <button class="btn btn-pill btn-dashed color-4" type="button" @click="clearFilters">
                    <i class="fa fa-times me-1"></i> Limpiar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="row">
        <div class="col-lg-12">
          <div class="property-grid-3 agent-grids ratio2_3">
            <div class="property-2 row column-sm property-label property-grid list-view">
              <Table
                :headers="auditHeader"
                :items="logsData"
                :server-items-length="logsTotal"
                @update="loadLogs"
                @reload="loadLogs(lastParams)"
              >
                <template #item-event="{ event }">
                  <span
                    class="label label-light label-flat"
                    :class="eventClass(event)"
                  >
                    {{ eventLabel(event) }}
                  </span>
                </template>

                <template #item-actions="item">
                  <button
                    class="btn btn-dashed color-1"
                    type="button"
                    title="Ver detalle"
                    @click="openDetail(item)"
                  >
                    <i class="fa fa-eye"></i>
                  </button>
                </template>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal detalle -->
    <CommonModal v-model:show="showDetail" title="Detalle de auditoría" size="lg">
      <template v-if="selectedLog">
        <div class="row g-3">
          <div class="col-md-6">
            <small class="text-muted d-block">Módulo</small>
            <strong>{{ selectedLog.module_label }}</strong>
          </div>
          <div class="col-md-3">
            <small class="text-muted d-block">Acción</small>
            <span class="label label-light label-flat" :class="eventClass(selectedLog.event)">
              {{ eventLabel(selectedLog.event) }}
            </span>
          </div>
          <div class="col-md-3">
            <small class="text-muted d-block">Tipo de registro</small>
            <strong>{{ selectedLog.subject_type ?? '—' }}</strong>
          </div>
          <div class="col-md-6">
            <small class="text-muted d-block">Usuario</small>
            <strong>{{ selectedLog.causer_email ?? '—' }}</strong>
          </div>
          <div class="col-md-6">
            <small class="text-muted d-block">Fecha</small>
            <strong>{{ selectedLog.created_at }}</strong>
          </div>

          <template v-if="selectedLog.properties?.old && Object.keys(selectedLog.properties.old).length">
            <div class="col-12">
              <hr class="my-1" />
              <p class="mb-2 fw-semibold">Cambios realizados</p>
              <div class="table-responsive">
                <table class="table table-sm table-bordered mb-0">
                  <thead>
                    <tr>
                      <th>Campo</th>
                      <th class="text-danger">Antes</th>
                      <th class="text-success">Después</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(oldVal, key) in selectedLog.properties.old" :key="String(key)">
                      <td>{{ key }}</td>
                      <td class="text-danger font-monospace small">{{ formatValue(oldVal) }}</td>
                      <td class="text-success font-monospace small">{{ formatValue(selectedLog.properties?.attributes?.[key]) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>

          <template v-else-if="selectedLog.properties?.attributes && Object.keys(selectedLog.properties.attributes).length">
            <div class="col-12">
              <hr class="my-1" />
              <p class="mb-2 fw-semibold">Valores registrados</p>
              <div class="table-responsive">
                <table class="table table-sm table-bordered mb-0">
                  <thead>
                    <tr>
                      <th>Campo</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(val, key) in selectedLog.properties.attributes" :key="String(key)">
                      <td>{{ key }}</td>
                      <td class="font-monospace small">{{ formatValue(val) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </div>
      </template>
    </CommonModal>
  </div>
</template>

<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import AuditService from "~/services/AuditService";
import { auditHeader } from "~/constants/tableHeaders/AuditHeader";
import type { IAuditLog } from "~/interfaces/IAuditLog";
import type { ILookup } from "~/interfaces/ILookup";
import type { IParamsTable } from "~/interfaces/IParamsTable";

const NONE = "none";

const MODULE_OPTIONS: ILookup[] = [
  { id: NONE,            category: "", name: "Todos los módulos",        alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "people",        category: "", name: "Personas",                 alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "companies",     category: "", name: "Empresa",                  alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "users",         category: "", name: "Usuarios",                 alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "properties",    category: "", name: "Propiedades",              alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "plans",         category: "", name: "Planes",                   alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "roles",         category: "", name: "Roles",                    alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "site-settings", category: "", name: "Configuración del sitio",  alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "lookups",       category: "", name: "Lookups",                  alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
];

const EVENT_OPTIONS: ILookup[] = [
  { id: NONE,      category: "", name: "Todas las acciones", alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "created", category: "", name: "Creado",             alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "updated", category: "", name: "Actualizado",        alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "deleted", category: "", name: "Eliminado",          alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
];

const { run } = useApiHandler();

const logsData = ref<IAuditLog[]>([]);
const logsTotal = ref(0);
const lastParams = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: "created_at",
  sortType: "desc",
});

const filters = ref({
  log_name: NONE,
  event: NONE,
  causer_email: "",
  date_from: null as string | null,
  date_to: null as string | null,
});

const activeFilters = ref<Record<string, string>>({});

const showDetail = ref(false);
const selectedLog = ref<IAuditLog | null>(null);

const loadLogs = async (params: IParamsTable = lastParams.value) => {
  lastParams.value = params;
  const response = await run(
    AuditService.getAuditLogs({ ...params, ...activeFilters.value }),
  );
  if (response) {
    logsData.value = response.data.data;
    logsTotal.value = response.data.total;
  }
};

const applyFilters = () => {
  const applied: Record<string, string> = {};
  if (filters.value.log_name && filters.value.log_name !== NONE) applied.log_name = filters.value.log_name;
  if (filters.value.event && filters.value.event !== NONE) applied.event = filters.value.event;
  if (filters.value.causer_email) applied.causer_email = filters.value.causer_email;
  if (filters.value.date_from) applied.date_from = filters.value.date_from;
  if (filters.value.date_to) applied.date_to = filters.value.date_to;
  activeFilters.value = applied;
  loadLogs({ ...lastParams.value, page: 1 });
};

const clearFilters = () => {
  filters.value = { log_name: NONE, event: NONE, causer_email: "", date_from: null, date_to: null };
  activeFilters.value = {};
  loadLogs({ ...lastParams.value, page: 1 });
};

const openDetail = (item: any) => {
  selectedLog.value = item as IAuditLog;
  showDetail.value = true;
};

const eventClass = (event: string | null) => ({
  "color-3": event === "created",
  "color-2": event === "updated",
  "color-4": event === "deleted",
  "color-7": event === "restored",
});

const eventLabel = (event: string | null) => {
  const map: Record<string, string> = {
    created: "Creado",
    updated: "Actualizado",
    deleted: "Eliminado",
    restored: "Restaurado",
  };
  return event ? (map[event] ?? event) : "—";
};

const formatValue = (val: unknown): string => {
  if (val === null || val === undefined) return "—";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
};

loadLogs();
</script>

<style scoped></style>
