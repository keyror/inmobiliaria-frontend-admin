<template>
  <div class="page-body">
    <CommonBreadcrumb :title="sidebarData.sidebar[2].children[0].title" :page="sidebarData.sidebar[2].title"/>
    <div class="container-fluid">
      <div class="row agent-section property-section user-lists">
        <div class="col-lg-12">
          <div class="property-grid-3 agent-grids ratio2_3">
            <div class="property-2 row column-sm property-label property-grid list-view">
              <Table
                  :headers="tenantsHeader"
                  :items="tenantsData"
                  @update="tenants"
                  :server-items-length="tenantsTotal"
              >

                <template #item-actions="{ item }">
                  <div class="btn-group" role="group" aria-label="Basic example">
                    <button class="btn btn-dashed color-1" type="button" @click="edit(item)">
                      <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn btn-dashed color-4" type="button" @click="deleted(item)">
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
import TenantService from "@/services/TenantService";
import AlertaService from "~/services/AlertService";
import type {IParamsTable} from "~/interfaces/IParamsTable";
import {tenantsHeader} from "~/constants/tableHeaders/TenantsHeader";
import sidebar from '@/public/data/sidebar.json';
import type {IExportOptions} from "~/interfaces/IExportOptions";
import {Constants} from "~/constants/Constants";
import LoadingService from "~/services/LoadingService";

const sidebarData = ref(sidebar);
const tenantsData = ref([]);

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: 'created_at',
  sortType: 'desc',
  search: '',
})

const exports :IExportOptions = {
  pdf: {
    url: '',
    extension: Constants.PDF,
  },
  excel :{
    url: '',
    extension: Constants.EXCEL,
  }
}

const tenantsTotal = ref(0);

const tenants = async (paramsTable: IParamsTable) => {
  LoadingService.show()
  TenantService.getTenants(paramsTable)
      .then((response) => {
        tenantsData.value = response.data.data
        tenantsTotal.value = response.data.total
        LoadingService.hide()
      }).catch((error) => {
        LoadingService.hide()
        AlertaService.showError('Ha ocurrido un error', error);
  })
}

const deleted = async (item:any) => {
  AlertaService.showConfirmation(
      '¿ Esta seguro de realizar esta operación ?',
      `Esta seguro de eliminar el registro : ${item.name}`)
  .then((result) => {
    if (result.isConfirmed) {
      LoadingService.show()
      TenantService.deleteTenant(item.id)
          .then((response) => {
            AlertaService.showSuccess('Operación exitosa', response.message)
            LoadingService.hide()
            tenants(paramsTable.value)
          }).catch((error) => {
            LoadingService.hide()
            AlertaService.showError('Ha ocurrido un error', error);
      })
    }
  });
}

const edit = async (item:any) => {
  navigateTo(`/central/tenants/edit/${item.id}`)
}

tenants(paramsTable.value)

</script>

<style scoped>

</style>
