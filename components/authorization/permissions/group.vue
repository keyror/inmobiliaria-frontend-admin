<script setup>
const props = defineProps({
  permissions: {
    type: Array,
    required: true
  },
  selectedPermissions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:selectedPermissions'])

// Buscador
const searchTerm = ref('')

// Agrupar permisos por módulo
const grouped = computed(() => {
  const groups = {}
  props.permissions.forEach(perm => {
    const module = perm.name.split('.')[0]
    if (!groups[module]) groups[module] = []
    groups[module].push(perm)
  })
  return groups
})

const filteredModules = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return grouped.value

  const filtered = {}
  for (const module in grouped.value) {
    if (module.toLowerCase().includes(term)) {
      filtered[module] = grouped.value[module]
    } else {
      const perms = grouped.value[module].filter(p =>
          p.name.toLowerCase().includes(term)
      )
      if (perms.length > 0) {
        filtered[module] = perms
      }
    }
  }
  return filtered
})

// Obtener todos los IDs de permisos filtrados
const filteredPermissionIds = computed(() => {
  const ids = []
  for (const module in filteredModules.value) {
    filteredModules.value[module].forEach(perm => {
      ids.push(perm.id)
    })
  }
  return ids
})

// Verificar si todos los permisos filtrados están seleccionados
const allFilteredSelected = computed(() => {
  if (filteredPermissionIds.value.length === 0) return false
  return filteredPermissionIds.value.every(id =>
      props.selectedPermissions.includes(id)
  )
})

// Alternar selección individual
const toggle = (id) => {
  const selected = [...props.selectedPermissions]
  const index = selected.indexOf(id)
  if (index > -1) selected.splice(index, 1)
  else selected.push(id)
  emit('update:selectedPermissions', selected)
}

// Verificar si hay permisos seleccionados que NO están en el filtro
const hasSelectedOutsideFilter = computed(() => {
  if (!searchTerm.value.trim()) return false
  const filtered = filteredPermissionIds.value
  return props.selectedPermissions.some(id => !filtered.includes(id))
})

// Botón con 3 comportamientos
const toggleSmart = () => {
  const hasFilter = searchTerm.value.trim() !== ''

  if (!hasFilter) {
    const allIds = props.permissions.map(p => p.id)
    const allSelected = allIds.every(id => props.selectedPermissions.includes(id))
    emit('update:selectedPermissions', allSelected ? [] : allIds)
  } else {
    const filtered = filteredPermissionIds.value

    if (allFilteredSelected.value && !hasSelectedOutsideFilter.value) {
      emit('update:selectedPermissions', [])
    } else if (hasSelectedOutsideFilter.value) {
      emit('update:selectedPermissions', [...filtered])
    } else {
      let selected = [...props.selectedPermissions]
      filtered.forEach(id => {
        if (!selected.includes(id)) selected.push(id)
      })
      emit('update:selectedPermissions', selected)
    }
  }
}

// Alternar un módulo completo
const toggleModule = (module) => {
  const moduleIds = filteredModules.value[module].map(p => p.id)
  const allSelected = moduleIds.every(id => props.selectedPermissions.includes(id))
  let selected = [...props.selectedPermissions]

  if (allSelected) {
    selected = selected.filter(id => !moduleIds.includes(id))
  } else {
    moduleIds.forEach(id => {
      if (!selected.includes(id)) selected.push(id)
    })
  }

  emit('update:selectedPermissions', selected)
}

// Saber si todos los permisos están seleccionados
const allSelected = computed(() =>
    props.permissions.length > 0 &&
    props.permissions.every(p => props.selectedPermissions.includes(p.id))
)

// Texto dinámico del botón según el contexto
const buttonText = computed(() => {
  const hasFilter = searchTerm.value.trim() !== ''

  if (!hasFilter) {
    return allSelected.value
        ? 'Deseleccionar todos'
        : 'Seleccionar todos'
  } else {
    if (allFilteredSelected.value && !hasSelectedOutsideFilter.value) {
      return 'Deseleccionar filtrados'
    } else if (hasSelectedOutsideFilter.value) {
      return 'Solo filtrados'
    } else {
      return 'Seleccionar filtrados'
    }
  }
})

// Estado del botón según el contexto
const buttonActive = computed(() => {
  const hasFilter = searchTerm.value.trim() !== ''
  if (!hasFilter) {
    return allSelected.value
  } else {
    return allFilteredSelected.value && !hasSelectedOutsideFilter.value
  }
})

// Contar permisos seleccionados por módulo
const getSelectedCount = (module) => {
  const modulePerms = filteredModules.value[module]
  return modulePerms.filter(p => props.selectedPermissions.includes(p.id)).length
}
</script>

<template>
  <div>
    <!-- Barra de búsqueda y botón principal -->
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <div class="row w-100 g-2">
        <div class="col-12 col-md-8">
          <CommonInputfieldsTextfield
              v-model="searchTerm"
              classes=""
              label=""
              placeholder="Buscar módulo o permiso..."
          />
        </div>
        <div class="col-12 col-md-4 d-flex align-items-end">
          <button
              :class="[
                'btn btn-pill w-100',
                buttonActive ? 'btn-dashed color-4' : 'btn-gradient color-4',
                hasSelectedOutsideFilter ? 'btn-warning-glow' : ''
              ]"
              :title="hasSelectedOutsideFilter
                ? 'Tienes permisos seleccionados fuera de esta búsqueda. Click para mantener solo los filtrados.'
                : ''"
              type="button"
              @click="toggleSmart"
          >
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>

    <!-- Acordeón con módulos en 2 columnas -->
    <div v-if="Object.keys(filteredModules).length > 0" class="row g-3">
      <div
          v-for="(perms, module, index) in filteredModules"
          :key="module"
          class="col-12 col-lg-6"
      >
        <div class="accordion accordion-compact" :id="`accordion-${module}`">
          <div class="accordion-item">
            <h2 class="accordion-header" :id="`heading-${module}`">
              <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="`#collapse-${module}`"
                  aria-expanded="false"
                  :aria-controls="`collapse-${module}`"
              >
                <div class="d-flex justify-content-between align-items-center w-100 me-2">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-folder-fill me-2 color-4"></i>
                    <span class="text-capitalize fw-semibold module-name">{{ module }}</span>
                    <span class="badge ms-2" :class="getSelectedCount(module) === perms.length ? 'bg-success' : 'bg-secondary'">
                      {{ getSelectedCount(module) }}/{{ perms.length }}
                    </span>
                  </div>
                  <button
                      :class="perms.every(p => selectedPermissions.includes(p.id))
                          ? 'btn btn-sm btn-pill btn-dashed color-4'
                          : 'btn btn-sm btn-pill btn-gradient color-4'"
                      type="button"
                      @click.stop="toggleModule(module)"
                  >
                    <i :class="perms.every(p => selectedPermissions.includes(p.id)) ? 'fas fa-check-double' : 'fas fa-plus'"></i>
                  </button>
                </div>
              </button>
            </h2>
            <div
                :id="`collapse-${module}`"
                class="accordion-collapse collapse"
                :aria-labelledby="`heading-${module}`"
                :data-bs-parent="`#accordion-${module}`"
            >
              <div class="accordion-body p-2">
                <div class="permissions-list-compact">
                  <div class="form-group mb-0">
                    <div class="additional-checkbox">
                      <label
                          v-for="perm in perms"
                          :key="perm.id"
                          :for="`perm-${perm.id}`"
                          class="permission-label"
                      >
                        <input
                            :id="`perm-${perm.id}`"
                            :checked="selectedPermissions.includes(perm.id)"
                            class="checkbox_animated color-4"
                            type="checkbox"
                            @change="toggle(perm.id)"
                        >
                        <span class="permission-name">{{ perm.name }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Si no hay coincidencias -->
    <div v-else class="text-muted text-center p-4 border rounded bg-light">
      <i class="bi bi-search mb-2" style="font-size: 2rem;"></i>
      <p class="mb-0">No se encontraron módulos o permisos que coincidan con "<strong>{{ searchTerm }}</strong>".</p>
    </div>
  </div>
</template>

<style scoped>
.accordion-button {
  background-color: #fafafa;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
}

.accordion-button:not(.collapsed) {
  background-color: #f0f0f0;
  color: inherit;
  box-shadow: none;
}

.accordion-button:focus {
  box-shadow: none;
  border-color: rgba(0,0,0,.125);
}

.accordion-item {
  border-radius: 0.375rem !important;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.accordion-body {
  padding: 0.75rem;
  background-color: #fefefe;
}

.permissions-list-compact {
  max-height: 250px;
  overflow-y: auto;
}

.permission-label {
  display: flex;
  align-items: center;
  padding: 0.35rem 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 4px;
  margin-bottom: 0.15rem;
}

.permission-label:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.permission-name {
  font-size: 0.875rem;
  margin-left: 0.5rem;
}

.module-name {
  font-size: 0.95rem;
}

.badge {
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
}

.permissions-list-compact::-webkit-scrollbar {
  width: 5px;
}

.permissions-list-compact::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.permissions-list-compact::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.permissions-list-compact::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.btn-warning-glow {
  animation: pulse-warning 2s infinite;
  border: 2px solid #ffc107 !important;
}

@keyframes pulse-warning {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(255, 193, 7, 0);
  }
}

@media (max-width: 991px) {
  .col-lg-6 {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 768px) {
  .accordion-button {
    font-size: 0.85rem;
    padding: 0.65rem 0.75rem;
  }

  .accordion-button .btn {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }

  .module-name {
    font-size: 0.85rem;
  }

  .permission-name {
    font-size: 0.8rem;
  }
}
</style>
