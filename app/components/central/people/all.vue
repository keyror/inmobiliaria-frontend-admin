<template>
  <div class="page-body">
    <CommonBreadcrumb title="Listado personas" page="Administrar personas" />
    <div class="container-fluid">
      <div class="row agent-section property-section user-lists">
        <div class="col-lg-12">
          <div class="property-grid-3 agent-grids ratio2_3">
            <div
              class="property-2 row column-sm property-label property-grid list-view"
            >
              <Table
                :headers="peopleHeader"
                :items="data"
                :server-items-length="total"
                @update="fetchPeople"
                @reload="reloadDataTable"
              >
                <template #item-actions="item">
                  <div
                    v-if="can('people.edit') || can('people.delete')"
                    class="btn-group"
                    role="group"
                  >
                    <button
                      v-if="can('people.edit')"
                      class="btn btn-dashed color-1"
                      type="button"
                      @click="edit(item)"
                    >
                      <i class="fas fa-pen"></i>
                    </button>
                    <button
                      v-if="can('people.delete')"
                      class="btn btn-dashed color-4"
                      type="button"
                      @click="deletePerson(item)"
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
import PersonService from "@/services/central/PersonService";
import { useApiHandler } from "~/composables/useApiHandler";
import { peopleHeader } from "~/constants/tableHeaders/PeopleHeader";
import AlertService from "~/services/AlertService";

import type { IParamsTable } from "~/interfaces/IParamsTable";

const { run } = useApiHandler();
const { can } = useAuthorization();

const data = ref([]);
const total = ref(0);

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: "created_at",
  sortType: "desc",
  search: "",
});

const fetchPeople = async (params: IParamsTable) => {
  const response = await run(PersonService.getPeople(params));
  if (response) {
    data.value = response.data.data;
    total.value = response.data.total;
  }
};

const edit = (item: any) => {
  if (!can("people.edit")) return;
  navigateTo(`/central/people/edit/${item.id}`);
};

const deletePerson = async (item: any) => {
  if (!can("people.delete")) return;

  const result = await AlertService.showConfirmation(
    "¿Está seguro de realizar esta operación?",
    `Está seguro de eliminar el registro: ${item.full_name}`,
  );

  if (!result.isConfirmed) return;

  const response = await run(PersonService.deletePerson(item.id), {
    showSuccess: true,
    successMessage: "Persona eliminada correctamente",
  });

  if (response) {
    await fetchPeople(paramsTable.value);
  }
};

const reloadDataTable = () => {
  fetchPeople(paramsTable.value);
};

fetchPeople(paramsTable.value);
</script>
