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
                  <CommonActionsDropdown :actions="rentActions(item)" />
                </template>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawer lateral de documentos — z-index menor que CommonModal (1050/1055) -->
    <Teleport to="body">
      <Transition name="drawer-backdrop">
        <div
          v-if="showDocsDrawer"
          class="docs-drawer-backdrop"
          @click="closeDocsDrawer"
        />
      </Transition>
      <Transition name="drawer-panel">
        <div v-if="showDocsDrawer" class="docs-drawer-panel">
          <div class="docs-drawer-header">
            <div>
              <h6 class="mb-0">Documentos del contrato</h6>
              <small v-if="drawerRent" class="text-muted">
                {{ drawerRent.contract_number ?? drawerRent.id }}
              </small>
            </div>
            <button
              type="button"
              class="btn-close"
              aria-label="Cerrar"
              @click="closeDocsDrawer"
            />
          </div>
          <div class="docs-drawer-body">
            <RentsDocuments
              v-if="drawerRent"
              :rent-id="drawerRent.id"
              :lookups="docLookups"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import RentService from "@/services/RentService";
import { useApiHandler } from "~/composables/useApiHandler";
import { rentsHeader } from "~/constants/tableHeaders/RentsHeader";
import AlertService from "~/services/AlertService";
import { Constants } from "~/constants/Constants";
import { useLookups } from "~/composables/useLookups";
import { RentsDocuments } from "#components";

import type { IParamsTable } from "~/interfaces/IParamsTable";
import type { IDropdownAction } from "~/interfaces/IDropdownAction";

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

// ── Drawer de documentos ──────────────────────────────────────────────────────

const showDocsDrawer = ref(false);
const drawerRent = ref<any>(null);

const { lookups } = useLookups([
  Constants.DOCUMENT_CATEGORY,
  Constants.DOCUMENT_STATUS,
  Constants.DOCUMENT_TEMPLATE_TYPE,
]);

const docLookups = computed(() => ({
  documentCategories: lookups.value[Constants.DOCUMENT_CATEGORY] ?? [],
  documentStatuses: lookups.value[Constants.DOCUMENT_STATUS] ?? [],
  documentTemplateTypes: lookups.value[Constants.DOCUMENT_TEMPLATE_TYPE] ?? [],
}));

const openDocsDrawer = (item: any) => {
  drawerRent.value = item;
  showDocsDrawer.value = true;
};

const closeDocsDrawer = () => {
  showDocsDrawer.value = false;
  drawerRent.value = null;
};

// ── Acciones por fila ─────────────────────────────────────────────────────────

const rentActions = (item: any): IDropdownAction[] => [
  {
    label: "Editar",
    icon: "fas fa-pen",
    show: can("rents.edit"),
    onClick: () => edit(item),
  },
  {
    label: "Documentos",
    icon: "fas fa-file-alt",
    show: can("rents.edit"),
    onClick: () => openDocsDrawer(item),
  },
  {
    divider: true,
    show: can("rents.delete"),
  },
  {
    label: "Eliminar",
    icon: "fa fa-trash",
    variant: "danger",
    show: can("rents.delete"),
    onClick: () => deleteRent(item),
  },
];

// ── COP ───────────────────────────────────────────────────────────────────────

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

const formatCOP = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "-";
  return copFormatter.format(Number(value));
};

// ── Carga de datos ────────────────────────────────────────────────────────────

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

<style scoped>
/* ── Drawer lateral ─────────────────────────────────────────────────────────── */

.docs-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  /* Por debajo del backdrop de CommonModal (1050) */
  z-index: 1040;
}

.docs-drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100dvh;
  width: min(720px, 96vw);
  background: var(--bs-body-bg, #fff);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* Por debajo del backdrop de CommonModal (1050) */
  z-index: 1045;
}

.docs-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--bs-border-color, #dee2e6);
  flex-shrink: 0;
}

.docs-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
}

/* ── Transiciones ───────────────────────────────────────────────────────────── */

.drawer-backdrop-enter-active,
.drawer-backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.drawer-backdrop-enter-from,
.drawer-backdrop-leave-to {
  opacity: 0;
}

.drawer-panel-enter-active,
.drawer-panel-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-panel-enter-from,
.drawer-panel-leave-to {
  transform: translateX(100%);
}

/* ── Dark mode ──────────────────────────────────────────────────────────────── */

@media (prefers-color-scheme: dark) {
  .docs-drawer-panel {
    background: var(--bs-body-bg, #1a1a2e);
  }
}

:root[data-theme="dark"] .docs-drawer-panel {
  background: var(--bs-body-bg, #1a1a2e);
}
</style>
