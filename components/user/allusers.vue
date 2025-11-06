<template>
    <div class="page-body">
        <CommonBreadcrumb title="All users" page="Manage users"/>
        <div class="container-fluid">
            <div class="row agent-section property-section user-lists">
                <div class="col-lg-12">
                    <div class="property-grid-3 agent-grids ratio2_3">
                        <div class="property-2 row column-sm property-label property-grid list-view">
                          <Table
                              :headers="usersHeader"
                              :items="usersData"
                              @update="users"
                              :server-items-length="usersTotal"
                              :export-input="exportUsers"
                              @reload="reloadDataTable"
                          >

                            <template #item-actions="{ item }">
                              <div class="btn-group" role="group" aria-label="Basic example">
                                <button class="btn btn-dashed color-1" type="button" @click="editUser(item)">
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
import UserService from "@/services/UserService";
import PersonService from "@/services/PersonService";
import AlertaService from "~/services/AlertService";
import type {IParamsTable} from "~/interfaces/IParamsTable";
import {usersHeader} from "~/constants/tableHeaders/UsersHeader";
import type {IExportOptions} from "~/interfaces/IExportOptions";
import {Constants} from "~/constants/Constants";
import {ApiUrls} from "~/constants/ApiUrls";
import LoadingService from "~/services/LoadingService";
import TenantService from "~/services/TenantService";

const usersData = ref([]);

const exportUsers :IExportOptions = {
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
const usersTotal = ref(0);

const users = async (paramsTable: IParamsTable) => {
  LoadingService.show()
  PersonService.getPeople(paramsTable)
      .then((response) => {
        usersData.value = response.data.data
        usersTotal.value = response.data.total
        LoadingService.hide()
      }).catch((error) => {
    LoadingService.hide()
        AlertaService.showError('Ha ocurrido un error', error);
  })
}

const editUser = async (item:any) => {
  navigateTo(`/users/edit/${item.id}`)
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
                users(paramsTable.value)
              }).catch((error) => {
            LoadingService.hide()
            AlertaService.showError('Ha ocurrido un error', error);
          })
        }
      });
}

const reloadDataTable = () => {
  users(paramsTable.value);
}

users(paramsTable.value)

</script>

<style scoped>

</style>
