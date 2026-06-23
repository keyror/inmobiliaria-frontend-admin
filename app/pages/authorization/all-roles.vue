<template>
  <div class="page-body">
    <CommonBreadcrumb
      :page="$t('authorization.breadCrumbPage')"
      :title="$t('authorization.breadCrumbTitle')"
    />

    <div class="container-fluid">
      <nav class="admin-theme-tabs">
        <div id="nav-tab" class="nav nav-tabs" role="tablist">
          <button
            v-if="can('roles.view')"
            :class="{ active: activeTab === 'roles' }"
            class="nav-link"
            type="button"
            @click="switchTab('roles')"
          >
            Roles
          </button>
          <button
            v-if="can('permissions.view')"
            :class="{ active: activeTab === 'permissions' }"
            class="nav-link"
            type="button"
            @click="switchTab('permissions')"
          >
            Permisos
          </button>
        </div>
      </nav>

      <div class="tab-content mt-4">
        <div v-show="activeTab === 'roles'">
          <AuthorizationRoles v-if="loadedTabs.roles" />
        </div>
        <div v-show="activeTab === 'permissions'">
          <AuthorizationPermissions
            v-if="loadedTabs.permissions"
            @reload="reloadData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  permission: ["roles.view", "permissions.view"],
});

const { can } = useAuthorization();

const activeTab = ref<string>(can("roles.view") ? "roles" : "permissions");

const loadedTabs = ref<{ [key: string]: boolean }>({
  roles: can("roles.view"),
  permissions: !can("roles.view") && can("permissions.view"),
});

const switchTab = (tab: string) => {
  if (tab === "roles" && !can("roles.view")) return;
  if (tab === "permissions" && !can("permissions.view")) return;

  activeTab.value = tab;
  // Marca como cargado cuando se activa, util cuando se carga data al hacer click a la pestaña
  loadedTabs.value[tab] = true;
};

/**
 * Método para que recarga los roles pero con el permiso creado o actualizado
 * en la pestaña de permisos.
 */
const reloadData = () => {
  loadedTabs.value.roles = false; // Desmonta el componente
  nextTick(() => {
    loadedTabs.value.roles = true; // Remonta en el siguiente tick
  });
};

useHead({
  title: "Gestión de Roles y Permisos",
});
</script>
