<template>
  <div class="page-body">
    <CommonBreadcrumb title="Listado propiedades" page="Administrar propiedades"/>
    <div class="container-fluid">
      <div class="row agent-section property-section user-lists">
        <div class="col-lg-12">
          <div class="property-grid-3 agent-grids ratio2_3">
            <div class="property-2 row column-sm property-label property-grid list-view">
              <Table
                  :headers="propertiesHeader"
                  :items="data"
                  @update="properties"
                  :server-items-length="total"
                  @reload="reloadDataTable"
              >

                <template #item-actions="item">
                  <div class="btn-group" role="group" aria-label="Basic example">
                    <button class="btn btn-dashed color-1" type="button" @click="edit(item)">
                      <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn btn-dashed color-4" type="button" @click="deletePerson(item)">
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
import PropertyService from "@/services/PropertyService";
import AlertaService from "~/services/AlertService";
import type {IParamsTable} from "~/interfaces/IParamsTable";
import type {IExportOptions} from "~/interfaces/IExportOptions";
import {Constants} from "~/constants/Constants";
import LoadingService from "~/services/LoadingService";
import {propertiesHeader} from "~/constants/tableHeaders/PropertiesHeader";

const data = ref([]);

const exportProperties :IExportOptions = {
  name: "Propiedades",
  pdf: {
    url: "",
    extension: Constants.PDF,
  },
  excel :{
    url: "",
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

const properties = async (paramsTable: IParamsTable) => {
  LoadingService.show()
  PropertyService.getProperties(paramsTable)
      .then((response) => {
        data.value = response.data.data
        total.value = response.data.total
        LoadingService.hide()
      }).catch((error) => {
    LoadingService.hide()
    AlertaService.showError('Ha ocurrido un error', error);
  })
}
//TODO::
const edit = async (item:any) => {
  navigateTo(`/properties/edit/${item.id}`)
}

const deletePerson = async (item:any) => {
  AlertaService.showConfirmation(
      '¿ Esta seguro de realizar esta operación ?',
      `Esta seguro de eliminar el registro : ${item.full_name}`)
      .then((result) => {
        if (result.isConfirmed) {
          LoadingService.show()
          PropertyService.deleteProperty(item.id)
              .then((response) => {
                LoadingService.hide()
                AlertaService.showSuccess('Operación exitosa', response.message).then((response) => {
                  if (response.isConfirmed) {
                    properties(paramsTable.value)
                  }
                })
              }).catch((error) => {
            LoadingService.hide()
            AlertaService.showError('Ha ocurrido un error', error);
          })
        }
      });
}

const reloadDataTable = () => {
  properties(paramsTable.value);
}

properties(paramsTable.value)

</script>

<style scoped>

</style>
