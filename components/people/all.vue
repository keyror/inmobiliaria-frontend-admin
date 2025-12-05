<template>
  <div class="page-body">
    <CommonBreadcrumb title="Listado personas" page="Administrar personas"/>
    <div class="container-fluid">
      <div class="row agent-section property-section user-lists">
        <div class="col-lg-12">
          <div class="property-grid-3 agent-grids ratio2_3">
            <div class="property-2 row column-sm property-label property-grid list-view">
              <Table
                  :headers="peopleHeader"
                  :items="data"
                  @update="people"
                  :server-items-length="total"
                  :export-input="exportUsers"
                  @reload="reloadDataTable"
              >

                <template #item-actions="item">
                  <div class="btn-group" role="group" aria-label="Basic example">
                    <button class="btn btn-dashed color-1" type="button" @click="edit(item)">
                      <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn btn-dashed color-4" type="button" @click="deleteUser(item)">
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
import PersonService from "@/services/PersonService";
import AlertaService from "~/services/AlertService";
import type {IParamsTable} from "~/interfaces/IParamsTable";
import {peopleHeader} from "~/constants/tableHeaders/PeopleHeader";
import type {IExportOptions} from "~/interfaces/IExportOptions";
import {Constants} from "~/constants/Constants";
import {ApiUrls} from "~/constants/ApiUrls";
import LoadingService from "~/services/LoadingService";

const data = ref([]);

const exportUsers :IExportOptions = {
  name: "personas",
  pdf: {
    url: ApiUrls.USERS_EXPORT_TO_PDF_GET,
    extension: Constants.PDF,
  },
  excel :{
    url: ApiUrls.USERS_EXPORT_TO_EXCEL_GET,
    extension: Constants.EXCEL,
  }
}

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: 'created_at',
  sortType: 'desc',
  search: '',
})
const total = ref(0);

const people = async (paramsTable: IParamsTable) => {
  LoadingService.show()
  PersonService.getPeople(paramsTable)
      .then((response) => {
        data.value = response.data.data
        total.value = response.data.total
        LoadingService.hide()
      }).catch((error) => {
    LoadingService.hide()
    AlertaService.showError('Ha ocurrido un error', error);
  })
}

const edit = async (item:any) => {
  navigateTo(`/people/edit/${item.id}`)
}

const deleteUser = async (item:any) => {
  AlertaService.showConfirmation(
      '¿ Esta seguro de realizar esta operación ?',
      `Esta seguro de eliminar el registro : ${item.full_name}`)
      .then((result) => {
        if (result.isConfirmed) {
          LoadingService.show()
          PersonService.deletePerson(item.id)
              .then((response) => {
                AlertaService.showSuccess('Operación exitosa', response.message)
                LoadingService.hide()
                people(paramsTable.value)
              }).catch((error) => {
            LoadingService.hide()
            AlertaService.showError('Ha ocurrido un error', error);
          })
        }
      });
}

const reloadDataTable = () => {
  people(paramsTable.value);
}

people(paramsTable.value)

</script>

<style scoped>

</style>
