<template>
  <div class="page-body">
    <CommonBreadcrumb title="Sucursales" page="Gestión de sucursales" />
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Sucursales</h5>
              <button
                v-if="can('companies.create')"
                class="btn btn-pill btn-gradient color-4"
                type="button"
                @click="openCreate"
              >
                + Nueva sucursal
              </button>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table branch-table mb-0">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Código</th>
                      <th>NIT</th>
                      <th>Tipo</th>
                      <th>Estado</th>
                      <th v-if="can('companies.edit') || can('companies.delete')">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="!branches.length">
                      <td colspan="6" class="text-center py-4 text-muted">
                        No hay sucursales registradas
                      </td>
                    </tr>
                    <tr v-for="branch in branches" :key="branch.id">
                      <td>
                        <div class="branch-name-cell">
                          <span>{{ branch.company_name }}</span>
                          <span v-if="branch.tradename" class="branch-tradename">{{ branch.tradename }}</span>
                        </div>
                      </td>
                      <td>{{ branch.branch_code ?? '—' }}</td>
                      <td>{{ branch.nit ?? '—' }}</td>
                      <td>
                        <span v-if="branch.is_headquarters" class="label label-light label-flat color-4">
                          Sede principal
                        </span>
                        <span v-else class="label label-light label-flat color-3">
                          Sucursal
                        </span>
                      </td>
                      <td>
                        <span
                          class="label label-light label-flat"
                          :class="branch.is_active ? 'color-3' : 'color-1'"
                        >
                          {{ branch.is_active ? 'Activa' : 'Inactiva' }}
                        </span>
                      </td>
                      <td v-if="can('companies.edit') || can('companies.delete')">
                        <div class="btn-group" role="group">
                          <button
                            v-if="can('companies.edit')"
                            class="btn btn-dashed color-4"
                            type="button"
                            @click="openEdit(branch)"
                          >
                            <i class="fas fa-pen"></i>
                          </button>
                          <button
                            v-if="can('companies.delete') && !branch.is_headquarters"
                            class="btn btn-dashed color-1"
                            type="button"
                            @click="deactivate(branch)"
                          >
                            <i class="fas fa-ban"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BranchForm
      v-model:show="showForm"
      :branch="selectedBranch"
      @saved="onSaved"
    />
  </div>
</template>

<script setup lang="ts">
import BranchService from "~/services/BranchService";
import AlertService from "~/services/AlertService";
import { useBranchStore } from "~/store/branchStore";
import type { IBranch } from "~/interfaces/IBranch";

const { run } = useApiHandler();
const { can } = useAuthorization();
const branchStore = useBranchStore();

const branches = ref<IBranch[]>([]);
const showForm = ref(false);
const selectedBranch = ref<IBranch | null>(null);

const loadBranches = async () => {
  const res = await run(BranchService.getAll());
  if (res?.data?.data) {
    branches.value = res.data.data;
  } else if (Array.isArray(res?.data)) {
    branches.value = res.data;
  }
};

const openCreate = () => {
  selectedBranch.value = null;
  showForm.value = true;
};

const openEdit = (branch: IBranch) => {
  selectedBranch.value = branch;
  showForm.value = true;
};

const deactivate = async (branch: IBranch) => {
  const result = await AlertService.showConfirmation(
    "¿Desactivar sucursal?",
    `La sucursal "${branch.company_name}" quedará inactiva.`,
  );

  if (!result.isConfirmed) return;

  const res = await run(BranchService.deactivate(branch.id), {
    showSuccess: true,
    successMessage: "Sucursal desactivada",
  });

  if (res) {
    await loadBranches();
    await branchStore.load();
  }
};

const onSaved = async () => {
  await loadBranches();
  await branchStore.load();
};

loadBranches();
</script>

<style scoped>
.branch-name-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.branch-tradename {
  font-size: 12px;
  opacity: 0.6;
}

.branch-table th {
  background: #f7f7fe;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(88, 97, 103, 0.12);
}

.branch-table td {
  padding: 12px 16px;
  vertical-align: middle;
  border-bottom: 1px solid rgba(88, 97, 103, 0.06);
}

:global(body.dark-layout) .branch-table {
  --bs-table-color: rgba(255, 255, 255, 0.82);
  --bs-table-bg: #232323;
  --bs-table-border-color: #383434;
}

:global(body.dark-layout) .branch-table th {
  background-color: #1b1b1b;
  border-bottom-color: #383434;
  color: rgba(255, 255, 255, 0.92);
}

:global(body.dark-layout) .branch-table td {
  border-bottom-color: #383434;
}
</style>
