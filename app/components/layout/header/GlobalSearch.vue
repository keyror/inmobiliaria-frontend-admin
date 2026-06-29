<template>
  <li ref="wrapperRef" class="search-wrapper">
    <!-- Botón móvil -->
    <div class="d-md-none mobile-search" @click="mobileOpen = !mobileOpen">
      <Icon name="uil:search" />
    </div>

    <!-- Input -->
    <div class="form-group search-form" :class="mobileOpen ? 'open' : ''">
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        class="form-control"
        placeholder="Buscar... (mín. 3 caracteres)"
        autocomplete="off"
        @keydown="onKeydown"
        @focus="onFocus"
      />
    </div>

    <!-- Dropdown -->
    <Transition name="search-fade">
      <div v-if="showDropdown" class="search-dropdown" role="listbox">
        <!-- Loading -->
        <div v-if="loading" class="search-state">
          <Icon name="material-symbols:progress-activity" class="spin" />
          <span>Buscando...</span>
        </div>

        <!-- Sin resultados -->
        <div
          v-else-if="!loading && hasQuery && totalItems === 0"
          class="search-state"
        >
          <Icon name="material-symbols:search-off" />
          <span>Sin resultados para "<strong>{{ query }}</strong>"</span>
        </div>

        <!-- Indicación inicial -->
        <div v-else-if="!hasQuery" class="search-state">
          <Icon name="material-symbols:keyboard" />
          <span>Escribe al menos 3 caracteres</span>
        </div>

        <!-- Resultados -->
        <template v-else>
          <!-- Módulos -->
          <template v-if="navItems.length">
            <div class="search-category">Módulos</div>
            <button
              v-for="(item, idx) in navItems"
              :key="'nav-' + item.link"
              class="search-item"
              :class="{ active: activeIndex === navOffset + idx }"
              type="button"
              @click="goToNav(item.link)"
              @mouseenter="activeIndex = navOffset + idx"
            >
              <div class="search-item__thumb search-item__thumb--nav">
                <Icon :name="item.icon" />
              </div>
              <div class="search-item__body">
                <span class="search-item__label">{{ item.title }}</span>
              </div>
              <Icon name="material-symbols:chevron-right" class="search-item__arrow" />
            </button>
          </template>

          <!-- Propiedades -->
          <template v-if="results.properties.length">
            <div class="search-category">Propiedades</div>
            <button
              v-for="(item, idx) in results.properties"
              :key="'p-' + item.id"
              class="search-item"
              :class="{ active: activeIndex === propOffset + idx }"
              type="button"
              @click="goToNav(`/properties/edit/${item.id}`)"
              @mouseenter="activeIndex = propOffset + idx"
            >
              <div class="search-item__thumb">
                <img v-if="item.cover_url" :src="item.cover_url" alt="" />
                <Icon v-else name="material-symbols:home-outline" />
              </div>
              <div class="search-item__body">
                <span class="search-item__label">{{ item.label }}</span>
                <span class="search-item__sub">
                  <code class="me-1">{{ item.code }}</code>{{ item.subtitle }}
                </span>
              </div>
              <Icon name="material-symbols:chevron-right" class="search-item__arrow" />
            </button>
          </template>

          <!-- Personas -->
          <template v-if="results.people.length">
            <div class="search-category">Personas / Clientes</div>
            <button
              v-for="(item, idx) in results.people"
              :key="'pe-' + item.id"
              class="search-item"
              :class="{ active: activeIndex === peopleOffset + idx }"
              type="button"
              @click="goToNav(`/people/edit/${item.id}`)"
              @mouseenter="activeIndex = peopleOffset + idx"
            >
              <div class="search-item__thumb search-item__thumb--icon">
                <Icon name="material-symbols:person-outline" />
              </div>
              <div class="search-item__body">
                <span class="search-item__label">{{ item.label }}</span>
                <span v-if="item.subtitle" class="search-item__sub">{{ item.subtitle }}</span>
              </div>
              <Icon name="material-symbols:chevron-right" class="search-item__arrow" />
            </button>
          </template>

          <!-- Empresa -->
          <template v-if="results.companies.length">
            <div class="search-category">Empresa</div>
            <button
              v-for="(item, idx) in results.companies"
              :key="'c-' + item.id"
              class="search-item"
              :class="{ active: activeIndex === companyOffset + idx }"
              type="button"
              @click="goToNav('/company')"
              @mouseenter="activeIndex = companyOffset + idx"
            >
              <div class="search-item__thumb search-item__thumb--icon">
                <Icon name="material-symbols:business" />
              </div>
              <div class="search-item__body">
                <span class="search-item__label">{{ item.label }}</span>
                <span v-if="item.subtitle" class="search-item__sub">{{ item.subtitle }}</span>
              </div>
              <Icon name="material-symbols:chevron-right" class="search-item__arrow" />
            </button>
          </template>
        </template>
      </div>
    </Transition>
  </li>
</template>

<script setup lang="ts">
import SearchService from "~/services/SearchService";
import type { ISearchResults } from "~/interfaces/ISearch";

const { run } = useApiHandler();
const { search: searchNav } = useNavSearch();

const query = ref("");
const loading = ref(false);
const mobileOpen = ref(false);
const showDropdown = ref(false);
const activeIndex = ref(-1);
const wrapperRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const results = ref<ISearchResults>({
  properties: [],
  people: [],
  companies: [],
});

const hasQuery = computed(() => query.value.trim().length >= 3);

// Módulos filtrados por query y permisos (síncrono)
const navItems = computed(() =>
  hasQuery.value ? searchNav(query.value) : []
);

// Offsets para el índice global de navegación por teclado
const navOffset = computed(() => 0);
const propOffset = computed(() => navItems.value.length);
const peopleOffset = computed(() => propOffset.value + results.value.properties.length);
const companyOffset = computed(() => peopleOffset.value + results.value.people.length);

const totalItems = computed(() =>
  navItems.value.length +
  results.value.properties.length +
  results.value.people.length +
  results.value.companies.length
);

// Lista plana para keyboard nav
const flatRoutes = computed(() => [
  ...navItems.value.map((n) => n.link),
  ...results.value.properties.map((p) => `/properties/edit/${p.id}`),
  ...results.value.people.map((p) => `/people/edit/${p.id}`),
  ...results.value.companies.map(() => `/company`),
]);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(query, (val) => {
  activeIndex.value = -1;
  if (debounceTimer) clearTimeout(debounceTimer);

  if (val.trim().length < 3) {
    results.value = { properties: [], people: [], companies: [] };
    loading.value = false;
    return;
  }

  loading.value = true;
  debounceTimer = setTimeout(async () => {
    const res = await run(SearchService.globalSearch(val.trim()));
    if (res) {
      results.value = res.data as ISearchResults;
    }
    loading.value = false;
  }, 300);
});

const onFocus = () => {
  showDropdown.value = true;
};

const onKeydown = (e: KeyboardEvent) => {
  if (!showDropdown.value) return;

  if (e.key === "Escape") {
    close();
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex.value = Math.min(activeIndex.value + 1, totalItems.value - 1);
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex.value = Math.max(activeIndex.value - 1, -1);
    return;
  }

  if (e.key === "Enter" && activeIndex.value >= 0) {
    e.preventDefault();
    const route = flatRoutes.value[activeIndex.value];
    if (route) goToNav(route);
    return;
  }
};

const goToNav = (route: string) => {
  close();
  navigateTo(route);
};

const close = () => {
  showDropdown.value = false;
  activeIndex.value = -1;
  inputRef.value?.blur();
};

const onClickOutside = (e: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    close();
  }
};

onMounted(() => document.addEventListener("mousedown", onClickOutside));
onUnmounted(() => {
  document.removeEventListener("mousedown", onClickOutside);
  if (debounceTimer) clearTimeout(debounceTimer);
});
</script>

<style scoped>
.search-wrapper {
  position: relative;
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 400px;
  background: var(--white, #fff);
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.13);
  z-index: 9999;
  max-height: 420px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
}

.search-category {
  padding: 8px 14px 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #adb5bd;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 14px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.12s;
}

.search-item:hover,
.search-item.active {
  background: #f8f9fa;
}

.search-item__thumb {
  width: 36px;
  height: 36px;
  border-radius: 7px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(115, 102, 255, 0.1);
  color: #7366ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-item__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-item__thumb--icon,
.search-item__thumb--nav {
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.search-item__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.search-item__label {
  font-size: 13px;
  font-weight: 500;
  color: #2c2c2c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-item__sub {
  font-size: 11px;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-item__arrow {
  color: #d1d5db;
  flex-shrink: 0;
}

.search-state {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 18px 14px;
  color: #9ca3af;
  font-size: 13px;
}

.spin {
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
