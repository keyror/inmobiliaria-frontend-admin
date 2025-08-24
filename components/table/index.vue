<template>
  <div class="row">
    <div class="col-8">
      <input
          v-model="searchValue"
          type="text"
          placeholder="Buscar..."
          class="mb-2 p-2 border rounded w-full"
      />
    </div>
    <div class="col-4">
      <div v-if="exportInput" class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button class="btn btn-success me-md-2" type="button" @click="exportFile(exportInput.excel)">
          <i class="fas fa-file-excel"></i>
        </button>
        <button class="btn btn-danger" type="button"  @click="exportFile(exportInput.pdf)">
          <i class="fas fa-file-pdf"></i>
        </button>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <EasyDataTable
          :headers="headers"
          :items="items"
          v-model:server-options="serverOptions"
          :server-items-length="serverItemsLength"
          :loading="isLoading"
          theme-color="#f24451"
          buttons-pagination>
        <template #item-actions="{ ...item }">
          <slot name="item-actions" :item="item" />
        </template>
      </EasyDataTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
import type { Header, Item, ServerOptions  } from "vue3-easy-data-table";
import type {IParamsTable} from "~/interfaces/IParamsTable";
import {useDebounce} from "~/composable/useDebounce";
import type {IExportOption, IExportOptions} from '@/interfaces/IExportOptions';
import LoadingService from "~/services/LoadingService";
import AlertaService from "~/services/AlertService";
import SaveFileFromBackService from "~/services/SaveFileFromBackService";

const props = defineProps({
  headers: {
    type: Array as PropType<Header[]>,
    required: true
  },
  items: {
    type: Array as PropType<Item[]>,
    required: true
  },
  serverItemsLength: {
    type: Number,
    required: true
  },
  sortBy: {
    type: String,
    default: 'created_at'
  },
  loading: {
    type: Boolean,
    default: false
  },
  exportInput: {
    type: Object as PropType<IExportOptions>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'update', paramsTable: IParamsTable): void
}>()
const isLoading = ref(props.loading);
const searchValue = ref('')
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 10,
  sortBy: props.sortBy,
  sortType: 'asc',
})

const paramsTable = computed<IParamsTable>(() => ({
  page: serverOptions.value.page,
  perPage: serverOptions.value.rowsPerPage,
  sortBy: serverOptions.value.sortBy,
  sortType: serverOptions.value.sortType,
  search: searchValue.value
}))

const exportFile = async (exportOption: IExportOption) => {
  isLoading.value = true;
  SaveFileFromBackService.getExport(paramsTable.value, exportOption.url)
      .then((response) => {
        AlertaService.showSuccess('Operación Exitosa','Archivo descargado correctamente.');
        isLoading.value = false;
        SaveFileFromBackService.captureFile(response,exportOption.extension,'usuarios')
      }).catch((error) => {
    isLoading.value = false;
    LoadingService.hide()
    AlertaService.showError('Ha ocurrido un error', error);
  })
}

const debouncedEmit = useDebounce(() => {
  emit('update', paramsTable.value)
}, 700)

watch(serverOptions, () => {
  emit('update', paramsTable.value)
}, { deep: true })

watch(searchValue, () => {
  debouncedEmit()
})

watch(() => props.loading, (newVal) => {
  isLoading.value = newVal;
});
</script>

<style scoped >


</style>
