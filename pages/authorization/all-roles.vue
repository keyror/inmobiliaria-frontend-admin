<template>
  <div class="page-body">
    <CommonBreadcrumb :page="$t('authorization.breadCrumbPage')" :title="$t('authorization.breadCrumbTitle')"/>

    <div class="container-fluid">
      <nav>
        <div id="nav-tab" class="nav nav-tabs" role="tablist">
          <button
              :class="{ active: activeTab === 'roles' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('roles')"
          >
            Roles
          </button>
          <button
              :class="{ active: activeTab === 'permissions' }"
              class="nav-link text-dark"
              type="button"
              @click="switchTab('permissions')"
          >
            Permisos
          </button>
        </div>
      </nav>

      <div class="tab-content mt-4">
        <div v-show="activeTab === 'roles'">
          <AuthorizationRoles v-if="loadedTabs.roles"/>
        </div>
        <div v-show="activeTab === 'permissions'">
          <AuthorizationPermissions v-if="loadedTabs.permissions" @reload="reloadData"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref<string>('roles')

const loadedTabs = ref<{ [key: string]: boolean }>({
  roles: true,
  permissions: false
})

const switchTab = (tab: string) => {
  activeTab.value = tab
  // Marca como cargado cuando se activa, util cuando se carga data al hacer click a la pestaña
  loadedTabs.value[tab] = true
}

/**
 * Método para que recarga los roles pero con el permiso creado o actualizado
 * en la pestaña de permisos.
 */
const reloadData = () => {
  loadedTabs.value.roles = false // Desmonta el componente
  nextTick(() => {
    loadedTabs.value.roles = true // Remonta en el siguiente tick
  })
}

useHead({
  title: 'Gestión de Roles y Permisos'
})
</script>
