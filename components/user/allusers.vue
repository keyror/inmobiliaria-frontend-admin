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
                              :loading="loading">

                            <template #item-actions="{ item }">
                              <button @click="editUser(item)" class="btn btn-sm btn-primary me-2">
                                <i class="fas fa-pen"></i>
                              </button>
                              <button @click="deleteUser(item)" class="btn btn-sm btn-danger">
                                <i class="fa fa-trash"></i>
                              </button>
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
import LoadingService from "~/services/LoadingService";
import AlertaService from "~/services/AlertService";
import type {IParamsTable} from "~/interfaces/IParamsTable";
import {usersHeader} from "~/constants/tableHeaders/UsersHeader";

const usersData = ref([]);

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
    //loading.value = false;
    LoadingService.hide()
    AlertaService.showError('Ha ocurrido un error', error);
  })
}

const editUser = async (item:any) => {
  console.log("edit ", item)
}

const deleteUser = async (item:any) => {
  console.log("delete ", item)
}

users(paramsTable.value)

</script>

<style scoped>

</style>
