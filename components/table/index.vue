<template>
  <div class="row">
    <div class="col-12">
      <input
          v-model="searchValue"
          type="text"
          placeholder="Buscar..."
          class="mb-2 p-2 border rounded w-full"
      />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <EasyDataTable
          :headers="headers"
          :items="items"
          v-model:server-options="serverOptions"
          :server-items-length="serverItemsLength"
          :loading="loading"
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
  }
})

const emit = defineEmits<{
  (e: 'update', paramsTable: IParamsTable): void
}>()

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

const debouncedEmit = useDebounce(() => {
  emit('update', paramsTable.value)
}, 700)

watch(serverOptions, () => {
  emit('update', paramsTable.value)
}, { deep: true })

watch(searchValue, () => {
  debouncedEmit()
})

</script>

<style scoped >


</style>
