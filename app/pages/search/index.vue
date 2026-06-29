<template>
  <div class="page-body">
    <CommonBreadcrumb title="Resultados de búsqueda" page="Búsqueda" />
    <div class="container-fluid">

      <div v-if="!query" class="text-center py-5 text-muted">
        <Icon name="material-symbols:search" style="font-size:48px;" />
        <p class="mt-2">Escribe algo en el buscador del encabezado para ver resultados.</p>
      </div>

      <template v-else>
        <div class="mb-4">
          <h5 class="text-muted">
            Resultados para: <strong class="text-dark">{{ query }}</strong>
          </h5>
        </div>

        <div class="row">
          <!-- Propiedades -->
          <div class="col-xl-6">
            <div class="card">
              <div class="card-header pb-0 d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                  Propiedades
                  <span class="badge badge-light-primary ms-1">{{ propertiesTotal }}</span>
                </h6>
                <nuxt-link
                  v-if="propertiesTotal > 0"
                  :to="`/properties/all?q=${encodeURIComponent(query)}`"
                  class="f-12 text-muted"
                >
                  Ver todas
                </nuxt-link>
              </div>
              <div class="card-body p-0">
                <div v-if="loadingProperties" class="text-center py-4 text-muted">
                  <Icon name="material-symbols:progress-activity" class="spin" /> Buscando...
                </div>
                <div v-else-if="!properties.length" class="text-center py-4 text-muted">
                  Sin resultados
                </div>
                <ul v-else class="search-result-list">
                  <li v-for="p in properties" :key="p.id">
                    <nuxt-link :to="`/properties/edit/${p.id}`" class="search-result-item">
                      <div class="search-result-icon">
                        <Icon name="material-symbols:home-outline" />
                      </div>
                      <div class="search-result-body">
                        <span class="f-w-600">{{ p.code }}</span>
                        <span class="text-muted ms-2 f-12">{{ p.title }}</span>
                      </div>
                      <Icon name="material-symbols:chevron-right" class="text-muted" />
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Personas -->
          <div class="col-xl-6">
            <div class="card">
              <div class="card-header pb-0 d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                  Personas / Clientes
                  <span class="badge badge-light-primary ms-1">{{ peopleTotal }}</span>
                </h6>
                <nuxt-link
                  v-if="peopleTotal > 0"
                  to="/people/all"
                  class="f-12 text-muted"
                >
                  Ver todas
                </nuxt-link>
              </div>
              <div class="card-body p-0">
                <div v-if="loadingPeople" class="text-center py-4 text-muted">
                  <Icon name="material-symbols:progress-activity" class="spin" /> Buscando...
                </div>
                <div v-else-if="!people.length" class="text-center py-4 text-muted">
                  Sin resultados
                </div>
                <ul v-else class="search-result-list">
                  <li v-for="person in people" :key="person.id">
                    <nuxt-link :to="`/people/edit/${person.id}`" class="search-result-item">
                      <div class="search-result-icon">
                        <Icon name="material-symbols:person-outline" />
                      </div>
                      <div class="search-result-body">
                        <span class="f-w-600">{{ person.full_name ?? person.name }}</span>
                        <span v-if="person.email" class="text-muted ms-2 f-12">{{ person.email }}</span>
                      </div>
                      <Icon name="material-symbols:chevron-right" class="text-muted" />
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import PropertyService from "~/services/PropertyService";
import PersonService from "~/services/PersonService";

useHead({ title: "Búsqueda" });

const route = useRoute();
const { run } = useApiHandler();

const query = computed(() => (route.query.q as string) ?? "");

const properties = ref<any[]>([]);
const propertiesTotal = ref(0);
const loadingProperties = ref(false);

const people = ref<any[]>([]);
const peopleTotal = ref(0);
const loadingPeople = ref(false);

const doSearch = async (q: string) => {
  if (!q.trim()) return;

  const params = { page: 1, perPage: 8, search: q };

  loadingProperties.value = true;
  loadingPeople.value = true;

  const [propRes, peopleRes] = await Promise.all([
    run(PropertyService.getProperties(params)),
    run(PersonService.getPeople(params)),
  ]);

  if (propRes) {
    properties.value = propRes.data.data ?? [];
    propertiesTotal.value = propRes.data.total ?? 0;
  }
  loadingProperties.value = false;

  if (peopleRes) {
    people.value = peopleRes.data.data ?? [];
    peopleTotal.value = peopleRes.data.total ?? 0;
  }
  loadingPeople.value = false;
};

watch(query, (q) => doSearch(q), { immediate: true });
</script>

<style scoped>
.search-result-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 1px solid #f1f3f5;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s;
}

.search-result-item:hover {
  background: #f8f9fa;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(115, 102, 255, 0.1);
  color: #7366ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.search-result-body {
  flex: 1;
  min-width: 0;
}

.spin {
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
