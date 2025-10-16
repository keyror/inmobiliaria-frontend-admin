<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header admin-form pb-0">
        <div class="row">
          <div class="col-8">
            <div class="col-md-6 col-sm-6 form-group">
              <CommonInputfieldsTextfield
                  v-model="searchValue"
                  classes=""
                  label=""
                  placeholder="Buscar..."
              />
            </div>
          </div>
          <div class="col-4">
            <div v-if="exportInput" class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button class="btn btn-solid color-3 btn-flat me-md-2" type="button"
                      @click="exportFile(exportInput.excel)">
                <i class="fas fa-file-excel"></i>
              </button>
              <button class="btn btn-gradient  btn-flat color-4" type="button" @click="exportFile(exportInput.pdf)">
                <i class="fas fa-file-pdf"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body admin-form">
        <div class="row">
          <div class="col">
            <EasyDataTable
                v-model:server-options="serverOptions"
                :headers="headers"
                :items="items"
                :loading="isLoading"
                :server-items-length="serverItemsLength"
                hide-footer
                table-class-name="shadow-sm p-3 bg-body rounded"
                theme-color="#f24451">
              <template #item-actions="{ ...item }">
                <slot :item="item" name="item-actions"/>
              </template>
            </EasyDataTable>

            <div class="d-flex justify-content-between align-items-center">
              <div class="listing-option">
                <div class="d-flex align-items-center">
                  <span class="me-2">Registros por página :</span>
                  <div style="width: 100px;">
                    <CommonInputfieldsStatusfield
                        :data="perPageOptions"
                        :modelValue="String(serverOptions.rowsPerPage)"
                        :show="String(serverOptions.rowsPerPage)"
                        @update:modelValue="updatePerPage"
                    />
                  </div>
                  <span class="ms-3">{{ paginationText }}</span>
                </div>
              </div>

              <nav class="theme-pagination">
                <ul class="pagination mb-0">
                  <li :class="{ disabled: serverOptions.page === 1 }" class="page-item">
                    <a aria-label="Previous" class="page-link" href="javascript:void(0)"
                       @click="changePage(serverOptions.page - 1)">
                      <span aria-hidden="true">«</span>
                    </a>
                  </li>
                  <li
                      v-for="page in totalPages"
                      :key="page"
                      :class="{ active: serverOptions.page === page }"
                      class="page-item"
                  >
                    <a class="page-link" href="javascript:void(0)" @click="changePage(page)">{{ page }}</a>
                  </li>
                  <li :class="{ disabled: serverOptions.page === totalPages }" class="page-item">
                    <a aria-label="Next" class="page-link" href="javascript:void(0)"
                       @click="changePage(serverOptions.page + 1)">
                      <span aria-hidden="true">»</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type {PropType} from 'vue'
import type {Header, Item, ServerOptions} from "vue3-easy-data-table";
import type {IParamsTable} from "~/interfaces/IParamsTable";
import {useDebounce} from "~/composables/useDebounce";
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
  exportInput: {
    type: Object as PropType<IExportOptions>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'update', paramsTable: IParamsTable): void
}>()

const internalLoading = ref(false)
const hasLoadedOnce = ref(false)

const isLoading = computed(() => {
  // Si nunca ha cargado Y no hay items, mostrar loading
  if (!hasLoadedOnce.value && props.items.length === 0) {
    return true
  }
  // Si está cargando internamente
  return internalLoading.value
})

const searchValue = ref('')
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 15,
  sortBy: props.sortBy,
  sortType: 'desc',
})

const updatePerPage = (value: string) => {
  const newRowsPerPage = Number(value)
  if (newRowsPerPage !== serverOptions.value.rowsPerPage) {
    serverOptions.value.page = 1
    serverOptions.value.rowsPerPage = newRowsPerPage
  }
}

const perPageOptions = ref<any[]>([10, 15, 25, 50, 100]);

const totalPages = computed(() =>
    Math.max(1, Math.ceil(props.serverItemsLength / serverOptions.value.rowsPerPage))
)

const paginationText = computed(() => {
  const start = (serverOptions.value.page - 1) * serverOptions.value.rowsPerPage + 1
  const end = Math.min(serverOptions.value.page * serverOptions.value.rowsPerPage, props.serverItemsLength)
  return `${start}–${end} de ${props.serverItemsLength}`
})

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    serverOptions.value.page = page
  }
}

const paramsTable = computed<IParamsTable>(() => ({
  page: serverOptions.value.page,
  perPage: serverOptions.value.rowsPerPage,
  sortBy: serverOptions.value.sortBy,
  sortType: serverOptions.value.sortType,
  search: searchValue.value
}))

const exportFile = async (exportOption: IExportOption) => {
  SaveFileFromBackService.getExport(paramsTable.value, exportOption.url)
      .then((response) => {
        AlertaService.showSuccess('Operación Exitosa','Archivo descargado correctamente.');
        SaveFileFromBackService.captureFile(response,exportOption.extension,'usuarios')
      }).catch((error) => {
    LoadingService.hide()
    AlertaService.showError('Ha ocurrido un error', error);
  })
}

const debouncedEmit = useDebounce(() => {
  emit('update', paramsTable.value)
}, 700)

watch(serverOptions, () => {
  internalLoading.value = true
  emit('update', paramsTable.value)
}, { deep: true })

watch(searchValue, () => {
  internalLoading.value = true
  serverOptions.value.page = 1
  debouncedEmit()
})

watch(() => props.items, (newItems) => {
  if (newItems) {
    hasLoadedOnce.value = true
    internalLoading.value = false
  }
})
</script>

<style scoped>
</style>
