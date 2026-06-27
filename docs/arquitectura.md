# Arquitectura Frontend Admin — Nuxt SPA

## Stack
- Nuxt 4 con `ssr: false` (SPA pura)
- TypeScript en todos los archivos `.ts` y `<script setup lang="ts">`
- Pinia para estado global
- `$fetch` / `ofetch` envuelto en composable `useApi`

## Flujo de datos

```
Página/Componente
    → useApiHandler().run(XxxService.method(), options)
        → XxxService (clase singleton)
            → useApi(url, options)       ← maneja auth, loading, limpieza de payload
                → $fetch (ofetch)
                    → Backend API
```

## Estructura de archivos

```
app/
├── pages/
│   └── properties/
│       ├── index.vue      # Lista → ruta /properties
│       └── [id].vue       # Detalle → ruta /properties/:id
├── components/
│   ├── property/
│   │   ├── PropertyForm.vue
│   │   └── PropertyCard.vue
│   └── shared/
│       └── DataTable.vue
├── composables/
│   ├── useApi.ts          # Wrapper de $fetch con auth + loading
│   ├── useApiHandler.ts   # Manejo de errores/éxito unificado
│   ├── usePermissions.ts  # hasPermission(), hasAnyPermission()
│   └── useLookups.ts      # Carga de opciones de BD
├── store/
│   ├── authStore.ts       # Token, user, roles, permissions
│   └── loading.ts         # Estado global de carga
├── services/
│   └── PropertyService.ts # Clase singleton
├── interfaces/
│   └── IProperty.ts       # Interface TypeScript
├── constants/
│   └── ApiUrls.ts         # Objeto/enum con todas las URLs
└── middleware/
    └── auth.ts            # Redirige si no autenticado
```

## Nuxt auto-imports

En Nuxt 4, lo siguiente se importa automáticamente:
- `composables/` → `useXxx()` disponible en todo el proyecto
- `components/` → componentes disponibles sin import
- `store/` → NO se auto-importa; requiere import explícito

## Páginas y rutas

```
pages/index.vue          → /
pages/properties/index.vue → /properties
pages/properties/[id].vue  → /properties/:id
pages/authentication/login.vue → /authentication/login
```

## Layouts

```
layouts/default.vue  → Layout principal con sidebar y nav
layouts/auth.vue     → Layout para login (sin sidebar)
```

Asignar layout en página:
```vue
<script setup>
definePageMeta({ layout: 'auth' });
</script>
```

## Middleware de autenticación

```ts
// middleware/auth.ts — se ejecuta antes de cada ruta protegida
defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) {
        return navigateTo('/authentication/login');
    }
});
```

Aplicar en página:
```vue
<script setup>
definePageMeta({ middleware: 'auth' });
</script>
```
