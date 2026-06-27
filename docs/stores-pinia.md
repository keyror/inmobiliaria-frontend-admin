# Stores Pinia — Frontend Admin

## Stores existentes

| Store | Archivo | Propósito |
|---|---|---|
| `authStore` | `store/authStore.ts` | Token, usuario, roles, permisos, login/logout |
| `publicCompany` | `store/publicCompany.ts` | Datos de la empresa pública |
| `loading` | `store/loading.ts` | Estado global de carga |
| `costomizer` | `store/costomizer.ts` | Configuración del tema/UI |

## Patrón de store (composition API)

```ts
// store/exampleStore.ts
import { defineStore } from 'pinia';

export const useExampleStore = defineStore('example', () => {
  // Estado
  const items = ref<IExample[]>([]);
  const selected = ref<IExample | null>(null);

  // Getters computados
  const count = computed(() => items.value.length);

  // Actions
  const setItems = (data: IExample[]) => { items.value = data; };
  const selectItem = (item: IExample) => { selected.value = item; };
  const clear = () => { items.value = []; selected.value = null; };

  return { items, selected, count, setItems, selectItem, clear };
});
```

## Auth store — patrones clave

```ts
// Verificar autenticación
const auth = useAuthStore();
auth.isAuthenticated   // boolean
auth.user              // AuthUser | null
auth.token             // string | null

// Verificar permisos (o usar usePermissions())
auth.hasPermission('manage properties')
auth.hasAnyPermission(['create properties', 'update properties'])
auth.hasAllPermissions(['create', 'update'])

// Login/logout
await auth.login({ email, password, remember_me });
await auth.logout();
```

## Store con persistencia

```ts
export const useExampleStore = defineStore('example', () => {
  const preferences = ref<UserPreferences>({});
  return { preferences };
}, {
  persist: true,  // persiste en localStorage automáticamente
});
```

## Usar el store en componentes

```vue
<script setup lang="ts">
// Import explícito siempre (stores NO se auto-importan en Nuxt)
import { useExampleStore } from '~/store/exampleStore';

const exampleStore = useExampleStore();

// Acceder directamente — sin destructuring (pierde reactividad)
exampleStore.items;    // ✅
const { items } = exampleStore;  // ❌ pierde reactividad

// Si necesitas destructuring reactivo:
const { items } = storeToRefs(exampleStore);
</script>
```

## Cuándo usar store vs composable

| Store (Pinia) | Composable (`useXxx`) |
|---|---|
| Estado global compartido entre páginas | Lógica local o semi-local |
| Persistencia (localStorage) | Sin necesidad de persistir |
| Usuario, sesión, empresa | Formularios, filtros de tabla |
| `authStore`, `publicCompany` | `useApiHandler`, `useLookups` |
