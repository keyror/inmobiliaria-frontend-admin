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

        <!-- Cabecera del registro principal -->
        <div class="row g-2 mb-3">
          <div class="col-6">
            <small class="text-muted d-block">Módulo</small>
            <strong>{{ selectedLog.module_label }}</strong>
          </div>
          <div class="col-3">
            <small class="text-muted d-block">Acción</small>
            <span class="label label-light label-flat" :class="eventClass(selectedLog.event)">
              {{ eventLabel(selectedLog.event) }}
            </span>
          </div>
          <div class="col-3">
            <small class="text-muted d-block">Fecha</small>
            <strong>{{ selectedLog.created_at }}</strong>
          </div>
          <div class="col-12">
            <small class="text-muted d-block">Usuario</small>
            <strong class="audit-email">{{ selectedLog.causer_email ?? '—' }}</strong>
          </div>
        </div>

        <!-- Tabs por sub-módulo (si hay batch) -->
        <template v-if="batchTabs.length > 1">
          <hr class="my-2 audit-modal-separator" />
          <nav class="admin-theme-tabs mb-3">
            <div class="nav nav-tabs" role="tablist">
              <button
                v-for="tab in batchTabs"
                :key="tab.key"
                class="nav-link audit-tab-btn"
                :class="{ active: activeTab === tab.key }"
                type="button"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
                <span class="audit-tab-count">{{ tab.logs.length }}</span>
              </button>
            </div>
          </nav>

          <div v-if="batchLoading" class="text-center py-3">
            <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
          </div>

          <template v-else>
            <div v-for="tab in batchTabs" :key="tab.key">
              <div v-if="activeTab === tab.key">
                <div
                  v-for="(log, i) in tab.logs"
                  :key="log.id"
                  class="mb-3"
                  :class="{ 'border-top pt-3': i > 0 }"
                >
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="label label-light label-flat" :class="eventClass(log.event)">
                      {{ eventLabel(log.event) }}
                    </span>
                  </div>
                  <AuditChangesTable :log="log" />
                </div>
              </div>
            </div>
          </template>
        </template>

        <!-- Vista simple sin batch -->
        <template v-else>
          <AuditChangesTable :log="selectedLog" />
        </template>

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
const batchLogs = ref<IAuditLog[]>([]);
const batchLoading = ref(false);
const activeTab = ref("");

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

const SUBJECT_LABELS: Record<string, string> = {
  Property: "Propiedad",
  PropertyFeature: "Características",
  PropertyPerson: "Propietarios",
  PropertyObligation: "Obligaciones",
  PropertyArea: "Áreas",
  PropertyPrice: "Precios",
  PublishChannel: "Canales de publicación",
  Address: "Direcciones",
  Contact: "Contactos",
  AccountBank: "Cuentas bancarias",
  Person: "Persona",
  Company: "Empresa",
  User: "Usuario",
};

const batchTabs = computed(() => {
  const source = batchLogs.value.length ? batchLogs.value : (selectedLog.value ? [selectedLog.value] : []);
  const grouped = new Map<string, IAuditLog[]>();

  for (const log of source) {
    const key = log.subject_type ?? "General";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(log);
  }

  return Array.from(grouped.entries()).map(([key, logs]) => ({
    key,
    label: SUBJECT_LABELS[key] ?? key,
    logs,
  }));
});

const openDetail = async (item: any) => {
  selectedLog.value = item as IAuditLog;
  batchLogs.value = [];
  showDetail.value = true;

  if (item.batch_uuid) {
    batchLoading.value = true;
    const response = await run(AuditService.getBatch(item.batch_uuid));
    if (response) {
      batchLogs.value = response.data as IAuditLog[];
    }
    batchLoading.value = false;
  }

  await nextTick();
  activeTab.value = batchTabs.value[0]?.key ?? selectedLog.value?.subject_type ?? "";
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

loadLogs();
</script>

<style scoped>
.audit-email {
  word-break: break-all;
  overflow-wrap: anywhere;
}
</style>

<style>
body.dark-layout .audit-modal-separator {
  border-color: #383434;
}

body.dark-layout .audit-log-item {
  border-color: #383434 !important;
}

/* badge de notificación en tabs de auditoría */
.audit-tab-btn {
  padding-right: 34px !important;
}

.audit-tab-count {
  position: absolute;
  top: 5px;
  right: 7px;
  min-width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border-radius: 9px;
  font-size: 0.65em;
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: #fff !important;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.5);
}

.audit-tab-btn.active .audit-tab-count {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

body.dark-layout .audit-tab-count {
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
}
</style>
