<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header admin-form pb-0">
        <div class="row g-2 align-items-center">
          <!-- Búsqueda -->
          <div class="col-12 col-md-8 col-lg-6">
            <CommonInputfieldsTextfield
                v-model="searchValue"
                classes=""
                label=""
                placeholder="Buscar..."
            />
          </div>

          <!-- Botones de acción -->
          <div class="col-12 col-md-4 col-lg-6">
            <div class="d-flex gap-2 justify-content-start justify-content-md-end flex-wrap">
              <!-- Botón Actualizar -->
              <button
                  class="btn btn-gradient btn-pill color-1"
                  type="button"
                  @click="reloadData"
                  title="Actualizar"
              >
                <i class="fas fa-sync"></i>
                <span class="d-inline d-sm-none ms-1">Actualizar</span>
              </button>

              <!-- Botones de exportación -->
              <template v-if="exportInput">
                <button
                    class="btn btn-solid color-3 btn-flat"
                    type="button"
                    @click="exportFile(exportInput.excel)"
                    title="Exportar a Excel"
                >
                  <i class="fas fa-file-excel"></i>
                  <span class="d-inline d-sm-none ms-1">Excel</span>
                </button>
                <button
                    class="btn btn-gradient btn-flat color-4"
                    type="button"
                    @click="exportFile(exportInput.pdf)"
                    title="Exportar a PDF"
                >
                  <i class="fas fa-file-pdf"></i>
                  <span class="d-inline d-sm-none ms-1">PDF</span>
                </button>
              </template>
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
                must-sort
                table-class-name="shadow-sm p-3 bg-body rounded"
                theme-color="#f24451">
              <template #item-actions="{ ...item }">
                <slot :item="item" name="item-actions"/>
              </template>
            </EasyDataTable>

            <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <!-- Opciones de listado -->
              <div class="listing-option w-100 w-md-auto">
                <div class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
                  <span class="text-nowrap">Registros por página:</span>
                  <div style="width: 100px;">
                    <CommonInputfieldsStatusfield
                        :data="perPageOptions"
                        :modelValue="String(serverOptions.rowsPerPage)"
                        :show="String(serverOptions.rowsPerPage)"
                        @update:modelValue="updatePerPage"
                    />
                  </div>
                  <span class="text-nowrap">{{ paginationText }}</span>
                </div>
              </div>

              <!-- Paginación -->
              <nav class="theme-pagination w-100 w-md-auto d-flex justify-content-center justify-content-md-end">
                <ul class="pagination mb-0 flex-wrap">
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
  (e: 'update', paramsTable: IParamsTable): void,
  (e: 'reload', reload: boolean): void
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
  sortBy: props.sortBy ?? 'created_at',
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
  LoadingService.show()
  SaveFileFromBackService.getExport(paramsTable.value, exportOption.url)
      .then((response) => {
        SaveFileFromBackService.captureFile(response,exportOption.extension,props.exportInput?.name ?? 'archivo')
        LoadingService.hide()
        AlertaService.showSuccess('Operación Exitosa','Archivo descargado correctamente.');
      }).catch((error) => {
    LoadingService.hide()
    AlertaService.showError('Ha ocurrido un error', error);
  })
}

const reloadData = async () => {
  emit('reload', true)
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
