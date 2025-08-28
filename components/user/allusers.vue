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
                              :loading="loading"
                              :export-input="exportUsers"
                          >

                            <template #item-actions="{ item }">
                              <div class="btn-group" role="group" aria-label="Basic example">
                                <button @click="editUser(item)" type="button" class="btn btn-sm btn-primary">
                                  <i class="fas fa-pen"></i>
                                </button>
                                <button @click="deleteUser(item)" type="button" class="btn btn-sm btn-danger">
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
import AlertaService from "~/services/AlertService";
import type {IParamsTable} from "~/interfaces/IParamsTable";
import {usersHeader} from "~/constants/tableHeaders/UsersHeader";
import type {IExportOptions} from "~/interfaces/IExportOptions";
import {Constants} from "~/constants/Constants";
import {ApiUrls} from "~/constants/ApiUrls";

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
const loading = ref(false);
const users = async (paramsTable: IParamsTable) => {
 // LoadingService.show()
  loading.value = true;
  UserService.getUsers(paramsTable)
      .then((response) => {
        usersData.value = response.data.data
        usersTotal.value = response.data.total
        //LoadingService.hide()
        loading.value = false;
      }).catch((error) => {
        loading.value = false;
        //LoadingService.hide()
        AlertaService.showError('Ha ocurrido un error', error);
  })
}

const editUser = async (item:any) => {
  navigateTo(`/users/edit/${item.id}`)
}

const deleteUser = async (item:any) => {
  console.log("delete ", item)
}

users(paramsTable.value)

</script>

<style scoped>

</style>
