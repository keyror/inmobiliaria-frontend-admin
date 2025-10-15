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

  // Filtra módulos o permisos que coincidan con el término
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
    // Sin filtro: seleccionar/deseleccionar todos
    const allIds = props.permissions.map(p => p.id)
    const allSelected = allIds.every(id => props.selectedPermissions.includes(id))
    emit('update:selectedPermissions', allSelected ? [] : allIds)
  } else {
    const filtered = filteredPermissionIds.value

    // Con filtro: 3 estados posibles
    if (allFilteredSelected.value && !hasSelectedOutsideFilter.value) {
      // Estado 1: Todos los filtrados están seleccionados y no hay otros
      // Acción: Deseleccionar los filtrados
      emit('update:selectedPermissions', [])
    } else if (hasSelectedOutsideFilter.value) {
      // Estado 2: Hay permisos seleccionados fuera del filtro
      // Acción: Mantener SOLO los filtrados
      emit('update:selectedPermissions', [...filtered])
    } else {
      // Estado 3: No todos los filtrados están seleccionados
      // Acción: Agregar los filtrados a la selección actual
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
    // Con filtro, 3 estados
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
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <input
          v-model="searchTerm"
          class="form-control search-input"
          placeholder="Buscar módulo o permiso (ej: .view, .create)..."
          type="text"
      />

      <!-- Botón súper inteligente único -->
      <button
          :class="[
            'btn btn-pill',
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

    <!-- Mostrar resultados filtrados en 2 columnas -->
    <div v-if="Object.keys(filteredModules).length > 0" class="row g-3">
      <div
          v-for="(perms, module) in filteredModules"
          :key="module"
          class="col-12 col-lg-6"
      >
        <div class="module-card border rounded p-3 h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="color-4 text-capitalize mb-0">
              <i class="bi bi-folder-fill me-2"></i>{{ module }}
            </h6>
            <button
                :class="perms.every(p => selectedPermissions.includes(p.id))
                    ? 'btn btn-sm btn-pill btn-dashed color-4'
                    : 'btn btn-sm btn-pill btn-gradient color-4'"
                type="button"
                @click="toggleModule(module)"
            >
              {{
                perms.every(p => selectedPermissions.includes(p.id))
                    ? 'Deseleccionar'
                    : 'Seleccionar'
              }}
            </button>
          </div>

          <div class="permissions-list">
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

    <!-- Si no hay coincidencias -->
    <div v-else class="text-muted text-center p-4 border rounded bg-light">
      <i class="bi bi-search mb-2" style="font-size: 2rem;"></i>
      <p class="mb-0">No se encontraron módulos o permisos que coincidan con "<strong>{{ searchTerm }}</strong>".</p>
    </div>
  </div>
</template>

<style scoped>
.search-input {
  max-width: 400px;
  min-width: 250px;
}

.module-card {
  background-color: #fafafa;
  transition: transform 0.2s, box-shadow 0.2s;
}

.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

h6 {
  font-weight: 600;
  font-size: 1rem;
}

.permissions-list {
  max-height: 400px;
  overflow-y: auto;
}

.permission-label {
  display: flex;
  align-items: center;
  padding: 0.4rem 0;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 4px;
  padding-left: 0.5rem;
  margin-bottom: 0.25rem;
}

.permission-label:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.permission-name {
  font-size: 0.9rem;
  margin-left: 0.5rem;
}

.gap-2 {
  gap: 0.5rem;
}

/* Estilos para el scroll */
.permissions-list::-webkit-scrollbar {
  width: 6px;
}

.permissions-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.permissions-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.permissions-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive */
@media (max-width: 768px) {
  .search-input {
    max-width: 100%;
  }

  .d-flex.justify-content-between {
    flex-direction: column;
    align-items: stretch !important;
  }

  .d-flex.justify-content-between button {
    width: 100%;
  }
}

/* Efecto de brillo cuando hay permisos fuera del filtro */
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
</style>
