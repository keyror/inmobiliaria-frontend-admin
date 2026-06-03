<template>
  <div class="page-body">
    <CommonBreadcrumb page="Administrar lookups" title="Listado lookups" />

    <div class="container-fluid">
      <div class="card mb-3">
        <div class="card-header pb-0">
          <h5>Filtros</h5>
        </div>

        <div class="card-body admin-form">
          <div class="row gx-3 gy-2 align-items-end">
            <CommonInputfieldsSelectfield
              v-model="filters.category"
              :data="categoryOptions"
              :error="filterErrors.category"
              classes="col-12 col-md-6 col-xl-4"
              label="Categoría"
              searchable
              show="Todas las categorías"
            />

            <CommonInputfieldsTextfield
              v-model="filters.lang"
              :error="filterErrors.lang"
              :required="false"
              classes="col-12 col-md-6 col-xl-2"
              label="Idioma"
              placeholder="ES"
            />

            <CommonInputfieldsSelectfield
              v-model="filters.is_active"
              :data="statusOptions"
              :error="filterErrors.is_active"
              classes="col-12 col-md-6 col-xl-3"
              label="Estado"
              show="Todos"
            />
          </div>
          <div class="mt-3">
            <div class="d-flex flex-wrap gap-2 justify-content-xl-end">
              <button
                class="btn btn-pill btn-gradient color-4 lookup-filter-button"
                type="button"
                @click="applyFilters"
              >
                Filtrar
              </button>

              <button
                class="btn btn-pill btn-dashed color-4 lookup-filter-button"
                type="button"
                @click="clearFilters"
              >
                Limpiar
              </button>
            </div>
          </div>
          <div class="mt-3">
            <button
              class="btn btn-pill btn-gradient color-4"
              type="button"
              @click="createLookup"
            >
              Nuevo lookup
            </button>
          </div>
        </div>
      </div>

      <div class="row agent-section property-section user-lists">
        <div class="col-lg-12">
          <div class="property-grid-3 agent-grids ratio2_3">
            <div
              class="property-2 row column-sm property-label property-grid list-view"
            >
              <Table
                :headers="lookupsHeader"
                :items="lookupsData"
                :server-items-length="lookupsTotal"
                sort-by="category"
                @reload="reloadDataTable"
                @update="loadLookups"
              >
                <template #item-is_active="{ is_active }">
                  <span
                    v-if="is_active"
                    class="label label-light label-flat color-3 me-1"
                  >
                    Activo
                  </span>

                  <span v-else class="label label-light label-flat color-4">
                    Inactivo
                  </span>
                </template>

                <template #item-value="{ value }">
                  {{ value ?? "-" }}
                </template>

                <template #item-code="{ code }">
                  {{ code || "-" }}
                </template>

                <template #item-alias="{ alias }">
                  {{ alias || "-" }}
                </template>

                <template #item-actions="item">
                  <div aria-label="Acciones" class="btn-group" role="group">
                    <button
                      class="btn btn-dashed color-1"
                      type="button"
                      @click="editLookup(item)"
                    >
                      <i class="fas fa-pen"></i>
                    </button>

                    <button
                      class="btn btn-dashed color-4"
                      type="button"
                      @click="deleteLookup(item)"
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
import { useApiHandler } from "~/composables/useApiHandler";
import { lookupsHeader } from "~/constants/tableHeaders/LookupsHeader";
import AlertService from "~/services/AlertService";
import LookupAdminService from "~/services/LookupAdminService";

import type { ILookup } from "~/interfaces/ILookup";
import type {
  LookupIndexParams,
  LookupIndexResponse,
} from "~/interfaces/ILookupAdmin";
import type { IParamsTable } from "~/interfaces/IParamsTable";

interface LookupFilters {
  category: string;
  lang: string;
  is_active: "" | "true" | "false";
}

interface LookupFilterErrors {
  category?: string;
  is_active?: string;
  lang?: string;
}

const { run } = useApiHandler();

const lookupsData = ref<ILookup[]>([]);
const lookupsTotal = ref(0);
const categoryOptions = ref<ILookup[]>([]);
const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: "category",
  sortType: "asc",
  search: "",
});

const filters = reactive<LookupFilters>({
  category: "",
  lang: "",
  is_active: "",
});
const filterErrors = reactive<LookupFilterErrors>({});

const createLookupFilterOption = (id: string, name: string): ILookup => ({
  id,
  category: "lookup_filter",
  name,
  alias: null,
  value: null,
  code: null,
  icon: null,
  is_active: true,
  lang: "ES",
});

const allCategoryOption = createLookupFilterOption("", "Todas las categorías");

const statusOptions: ILookup[] = [
  createLookupFilterOption("", "Todos"),
  createLookupFilterOption("true", "Activo"),
  createLookupFilterOption("false", "Inactivo"),
];

const syncCategoryNames = (categoryNames: string[]) => {
  const existingCategories = categoryOptions.value
    .map((item) => item.id)
    .filter((category) => category.trim());
  const incomingCategories = categoryNames.filter((category) =>
    category.trim(),
  );
  const categories = Array.from(
    new Set([...existingCategories, ...incomingCategories]),
  ).sort((first, second) => first.localeCompare(second));

  categoryOptions.value = [
    allCategoryOption,
    ...categories.map((category) =>
      createLookupFilterOption(category, category),
    ),
  ];
};

const buildParams = (params: IParamsTable): LookupIndexParams => {
  const nextParams: LookupIndexParams = {
    page: params.page,
    perPage: params.perPage,
    sortBy: params.sortBy,
    sortType: params.sortType,
    search: params.search,
  };

  if (filters.category.trim()) {
    nextParams.category = filters.category.trim();
  }

  if (filters.lang.trim()) {
    nextParams.lang = filters.lang.trim();
  }

  if (filters.is_active) {
    nextParams.is_active = filters.is_active === "true" ? 1 : 0;
  }

  return nextParams;
};

const clearFilterErrors = () => {
  filterErrors.category = undefined;
  filterErrors.is_active = undefined;
  filterErrors.lang = undefined;
};

const setFilterErrors = (errors: Record<string, string>) => {
  filterErrors.category = errors.category;
  filterErrors.is_active = errors.is_active;
  filterErrors.lang = errors.lang;
};

const getResponseItems = (response: LookupIndexResponse): ILookup[] => {
  if (Array.isArray(response.data)) return response.data;

  return response.data.data ?? [];
};

const getResponseTotal = (
  response: LookupIndexResponse,
  items: ILookup[],
): number => {
  if (typeof response.meta?.total === "number") return response.meta.total;
  if (
    !Array.isArray(response.data) &&
    typeof response.data.total === "number"
  ) {
    return response.data.total;
  }

  return items.length;
};

const syncCategoryOptions = (items: ILookup[]) => {
  syncCategoryNames(items.map((item) => item.category));
};

const loadCategoryOptions = async () => {
  const response = await run(LookupAdminService.getCategories());

  if (!response) return;

  syncCategoryNames(response.data ?? []);
};

const loadLookups = async (params: IParamsTable) => {
  paramsTable.value = params;
  clearFilterErrors();

  const response = await run(LookupAdminService.index(buildParams(params)), {
    setErrors: setFilterErrors,
  });
  if (!response) return;

  const items = getResponseItems(response);
  lookupsData.value = items;
  lookupsTotal.value = getResponseTotal(response, items);
  syncCategoryOptions(items);
};

const reloadDataTable = () => {
  loadLookups(paramsTable.value);
};

const applyFilters = () => {
  loadLookups({
    ...paramsTable.value,
    page: 1,
  });
};

const clearFilters = () => {
  filters.category = "";
  filters.lang = "";
  filters.is_active = "";
  clearFilterErrors();
  applyFilters();
};

const createLookup = () => {
  navigateTo("/lookups/add");
};

const editLookup = (item: ILookup) => {
  navigateTo(`/lookups/edit/${item.id}`);
};

const deleteLookup = async (item: ILookup) => {
  const result = await AlertService.showConfirmation(
    "¿Está seguro de realizar esta operación?",
    `¿Eliminar el lookup: ${item.name}?`,
  );

  if (!result.isConfirmed) return;

  const response = await run(LookupAdminService.destroy(item.id), {
    showSuccess: true,
    successMessage: "Lookup eliminado correctamente",
  });

  if (response) {
    await loadLookups(paramsTable.value);
  }
};

loadLookups(paramsTable.value);
loadCategoryOptions();
</script>

<style scoped>
.lookup-filter-button {
  min-width: 105px;
}

@media (max-width: 575.98px) {
  .lookup-filter-actions .lookup-filter-button {
    flex: 1 1 100%;
  }
}
</style>
