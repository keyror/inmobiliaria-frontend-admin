<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header pb-0">
            <h5>Agregar permiso</h5>
          </div>
          <div class="card-body admin-form">
            <form class="row gx-3" @submit.prevent="savePermission" novalidate>
              <CommonInputfieldsTextfield
                  v-model="name"
                  :error="errors.name"
                  classes="col-md-6 col-sm-6"
                  label="Nombre del permiso"
                  placeholder="Ingrese el nombre del permiso"
                  star="*"
              />

              <div class="form-btn mt-3">
                <button class="btn btn-pill btn-gradient color-4" type="submit">{{
                    isEditing ? 'Actualizar' : 'Guardar'
                  }}
                </button>
                <button class="btn btn-pill btn-dashed color-4" type="button" @click="resetPermissionForm">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="row agent-section property-section user-lists">
      <div class="col-lg-12">
        <div class="property-grid-3 agent-grids ratio2_3">
          <div class="property-2 row column-sm property-label property-grid list-view">
            <Table
                :headers="permissionsHeader"
                :items="allPermissions"
                :server-items-length="permissionsTotal"
                @update="loadPermissions"
                @reload="reloadDataTable"
            >
              <template #item-actions="item">
                <div aria-label="Acciones" class="btn-group" role="group">
                  <button class="btn btn-dashed color-1" type="button" @click="editPermission(item)">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button class="btn btn-dashed color-4" type="button" @click="deletePermission(item)">
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
</template>

<script lang="ts" setup>
import RolePermissionService from "@/services/RolePermissionService";
import { useApiHandler } from '~/composables/useApiHandler'
import { usePermissionForm } from '~/composables/forms/usePermissionForm'
import type {IParamsTable} from "~/interfaces/IParamsTable";
import {permissionsHeader} from "~/constants/tableHeaders/PermissionsHeader";
import { usePermissions } from '~/composables/usePermissions';
import AlertaService from "~/services/AlertService";

const { run } = useApiHandler()
const { usePermissionCreateForm } = usePermissionForm()

const { allPermissions, loadPermissions, total } = usePermissions()

const emit = defineEmits<{
  (e: 'reload', reload: boolean): void
}>()

const permissionsTotal = ref(total);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const {
  handleSubmit,
  errors,
  defineField,
  resetForm,
  setErrors
} = usePermissionCreateForm()

const [name] = defineField('name')

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 15,
  sortBy: 'created_at',
  sortType: 'desc',
  search: '',
})

const savePermission = handleSubmit(async (values) => {

  const promise = isEditing.value
      ? RolePermissionService.updatePermission(editingId.value, values)
      : RolePermissionService.createPermission(values)

  const response = await run(promise, {
    setErrors,
    showSuccess: true,
    successMessage: isEditing.value
        ? 'Permiso actualizado correctamente'
        : 'Permiso creado correctamente'
  })

  if (response) {
    resetPermissionForm()
    isEditing.value = false
    await loadPermissions(paramsTable.value)
    emit('reload', true)
  }
})

const editPermission = (item: any) => {
  isEditing.value = true
  editingId.value = item.id

  resetForm({
    values: {
      name: item.name
    }
  })
}


const resetPermissionForm = () => {
  isEditing.value = false
  editingId.value = null

  resetForm({
    values: {
      name: ''
    }
  })
}

const deletePermission = async (item: any) => {
  const result = await AlertaService.showConfirmation(
      '¿Está seguro de realizar esta operación?',
      `¿Eliminar el permiso: ${item.name}?`
  )

  if (!result.isConfirmed) return

  const response = await run(
      RolePermissionService.deletePermission(item.id),
      {
        showSuccess: true,
        successMessage: 'Permiso eliminado correctamente'
      }
  )

  if (response) {
    await loadPermissions(paramsTable.value)
  }
}

const reloadDataTable = () => {
  loadPermissions(paramsTable.value)
}

await loadPermissions(paramsTable.value)
</script>

<style scoped>
</style>
