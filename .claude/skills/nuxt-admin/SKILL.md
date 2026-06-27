---
name: nuxt-admin
description: "Build or refactor features in the Nuxt SPA admin panel (frontend/). Use for any task involving pages, components, composables, Pinia stores, API service classes, TypeScript interfaces, middleware, or layouts in the admin panel. Triggers when working on: creating CRUD pages, forms with validation, table components, authentication flows, permission-based UI, or connecting to the Laravel backend API."
---

# Nuxt Admin Panel — Skill

Use this skill when implementing features in `frontend/` (admin panel).

## Required First Steps

1. Read `frontend/docs/claude.md` for the entry point overview.
2. For components: read `frontend/docs/componentes.md`.
3. For API calls: read `frontend/docs/consumo-api.md`.
4. For stores: read `frontend/docs/stores-pinia.md`.
5. Inspect sibling files in the relevant folder before creating new ones.

## Stack Facts

- **Nuxt 4** with `ssr: false` (pure SPA)
- **TypeScript** everywhere — no plain JS files
- **Pinia** with composition API style (`defineStore('name', () => { ... })`)
- **`useApi`** wraps `$fetch` with auth token, loading state, and payload cleanup
- **`useApiHandler().run()`** wraps service calls for unified error/success handling
- **Services** are class-based singletons in `app/services/`

## Architectural Rules

- `<script setup lang="ts">` always — never Options API or class components
- Props: always typed with `interface Props` + `defineProps<Props>()`
- Emits: always typed with `defineEmits<{ (e: 'name', v: Type): void }>()`
- API calls: always through `XxxService` → `useApiHandler().run()` — never raw `$fetch` in components
- Store imports: explicit `import { useXxxStore } from '~/store/xxxStore'` — NOT auto-imported
- Composables: auto-imported by Nuxt — no import needed in components
- Components: auto-imported by Nuxt — no import needed in templates
- Interfaces: `IXxx.ts` in `app/interfaces/`, imported as `import type { IXxx } from '~/interfaces/IXxx'`

## Componentes comunes reutilizables (`components/common/inputfields/`)

**Antes de crear cualquier campo de formulario, verificar si ya existe en esta carpeta.**

| Componente (auto-import) | Archivo | Uso |
|---|---|---|
| `CommonInputfieldsTextfield` | `textfield.vue` | Input de texto |
| `CommonInputfieldsTextarea` | `textarea.vue` | Textarea |
| `CommonInputfieldsSelectfield` | `selectfield.vue` | Select / multiselect |
| `CommonInputfieldsNumberfield` | `numberfield.vue` | Input numérico |
| `CommonInputfieldsCheckbox` | `checkbox.vue` | Checkbox |
| `CommonInputfieldsStatusfield` | `statusfield.vue` | Campo de estado |
| `CommonInputfieldsPersonselect` | `personselect.vue` | Selector de persona |

Props comunes a todos: `v-model`, `label`, `name`, `classes` (col-md-X), `error`, `disabled`, `star` (para asterisco requerido).

**Regla:** Si la necesidad es genérica (un nuevo tipo de input), crear el componente en `common/inputfields/` y documentarlo aquí. Si es específica de un dominio, crearlo en `components/[feature]/`.

## Folder Conventions

| File type | Location | Naming |
|---|---|---|
| Page | `app/pages/[feature]/index.vue` | kebab-case |
| Component | `app/components/[feature]/FeatureName.vue` | PascalCase |
| Composable | `app/composables/useFeatureName.ts` | `useXxx` |
| Service | `app/services/FeatureService.ts` | PascalCase + Service |
| Interface | `app/interfaces/IFeature.ts` | `IXxx` |
| Store | `app/store/featureStore.ts` | camelCase |
| API URLs | `app/constants/ApiUrls.ts` | add to existing object |

## Permission Checks

```ts
// In components
const { hasPermission, hasAnyPermission } = usePermissions();

// In templates
<button v-if="hasPermission('create contracts')">Crear</button>
```

## Error Handling Pattern

```ts
const { run } = useApiHandler();
const errors = ref<Record<string, string>>({});

const result = await run(XxxService.create(payload), {
  showSuccess: true,
  setErrors: (errs) => { errors.value = errs; },
});
// result is null on error, response data on success
```

## Verificación post-cambio (OBLIGATORIA)

Después de aplicar cualquier cambio, **siempre**:

1. Levantar el proyecto con `npm run dev` desde `frontend/`
2. Observar la salida en busca de errores de compilación, TypeScript o Vite
3. Si hay errores: leerlos, identificar el archivo y línea, corregirlos
4. Repetir hasta que el servidor arranque sin errores en consola
5. Solo entonces reportar el trabajo como terminado

```powershell
# Desde admin/frontend/
npm run dev
```

Si el servidor ya está corriendo (error de puerto ocupado), revisar si el proceso existente tiene errores o simplemente ya está activo.

## When Done

- Verificación post-cambio ejecutada y sin errores de compilación
- TypeScript sin errores (no `any` sin justificación)
- API URLs agregadas a `constants/ApiUrls.ts`
- Interfaces nuevas en `interfaces/`
- Permission guards aplicados a acciones sensibles
