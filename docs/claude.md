# FRONTEND (Admin) — Guía para Claude

## Contexto
- **Stack**: Nuxt 4 SPA (SSR: false) + Pinia + TypeScript
- **Skill**: `frontend/.claude/skills/nuxt-admin` — activar para cualquier tarea de código en este proyecto
- **Ubicación**: `/frontend`

---

## Cuándo leer qué

| Tarea | Leer primero |
|---|---|
| Entender módulos, páginas existentes, archivos por módulo | [dominio.md](./dominio.md) |
| Crear componente | [arquitectura.md](./arquitectura.md) + [componentes.md](./componentes.md) |
| Crear store Pinia | [stores-pinia.md](./stores-pinia.md) |
| Consumir API del backend | [consumo-api.md](./consumo-api.md) |
| Crear composable | [arquitectura.md](./arquitectura.md) |
| Galería con imágenes / marca de agua | Ver sección [Componente Gallery](#componente-gallery) abajo |
| Store de empresa / favicon / logo | Ver sección [Store publicCompany](#store-publiccompany) abajo |
| Constructor de plantillas de contrato | Ver sección [Módulo contract-templates](#módulo-contract-templates) abajo |
| Módulo sucursales, `branchStore`, selector de sucursal | Ver sección [Módulo Sucursales](#módulo-sucursales) abajo |
| Firma electrónica, modal firmantes, página `/firmar` | Ver sección [Módulo Firma Electrónica](#módulo-firma-electrónica) abajo |
| Drawer lateral dentro de listados (patrón anti-conflicto modal) | Ver sección [Patrón Drawer en listados](#patrón-drawer-en-listados) abajo |
| Auditoría / audit module | `backend/docs/auditoria.md` + `constants/AuditFieldLabels.ts` + `components/audit/` |
| Módulo central (company, person, dashboard) | Ver sección [Módulos Central](#módulos-central) abajo |

---

## Estructura de carpetas clave

```
app/
├── pages/
│   ├── central/      # Páginas del panel central SaaS
│   └── ...           # Páginas del panel tenant
├── layouts/          # Layouts (default, auth)
├── components/
│   ├── central/      # Componentes exclusivos del panel central
│   └── ...           # Componentes del panel tenant / compartidos
├── composables/      # useXxx.ts
├── store/            # Pinia stores (carpeta SINGULAR — diferente al frontend-public)
├── services/
│   ├── central/      # Servicios exclusivos del panel central
│   └── XxxService.ts # Servicios del panel tenant
├── interfaces/       # IXxx.ts
├── constants/        # ApiUrls.ts, AuditFieldLabels.ts, etc.
├── schemas/          # Validación de formularios
└── middleware/       # Middleware de rutas Nuxt
```

---

## Reglas de código (resumen rápido)

1. Siempre `<script setup lang="ts">` en componentes
2. Props tipadas con `interface` + `defineProps<Props>()`
3. Emits: `defineEmits<{ (e: 'update', v: string): void }>()`
4. Llamadas API siempre via `useApiHandler().run()` — nunca `$fetch` directo
5. Interfaces en `~/interfaces/IXxx.ts` · URLs en `~/constants/ApiUrls`

> Los patrones completos (servicio singleton, store Pinia, consumo de API) están en el skill `nuxt-admin` y en `arquitectura.md` / `consumo-api.md`.

---

## Componente Gallery

`components/gallery/index.vue` — subida, orden (drag), portada y eliminación de imágenes.

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `watermark` | `boolean` | `false` | Aplica marca de agua del logo (solo usar en Properties) |
| `maxImages` | `number` | `10` | Máximo de imágenes |
| `showCover` | `boolean` | `true` | Selector de portada |
| `dimensions` | `string` | `""` | Texto de ayuda |

`composables/useWatermark.ts` — implementación Canvas API:
- Logo cacheado a nivel de módulo (una carga por sesión)
- Tamaño: 45% del lado más corto · Opacidad: 0.52 logo + 0.18 fondo blanco
- Fallo silencioso: retorna imagen original si el logo no carga
- Usa `toSameOriginUrl()` para cross-origin en desarrollo

---

## Store publicCompany

`store/publicCompany.ts` — carga `/api/public/company` una vez y expone:

| Propiedad | Descripción |
|---|---|
| `logoUrl` | URL del logo principal |
| `faviconUrl` | `favicon_url` del site-settings o `logoUrl` como fallback |
| `displayName` | Nombre de la empresa |

`faviconUrl` se usa en `app.vue` para el favicon del panel admin.

---

## DevProxy (solo desarrollo)

`nuxt.config.ts` > `nitro.devProxy`:
```ts
"/api":     { target: "http://localhost:8000/api",     changeOrigin: true },
"/storage": { target: "http://localhost:8000/storage", changeOrigin: true },
```
**Regla crítica**: el target debe incluir el mismo prefijo que la key. Nitro elimina el prefijo antes de concatenar — si el target no lo repone, la URL queda incompleta. En producción (Docker + Traefik) no se necesita proxy.

---

## Módulo contract-templates

`pages/contract-templates/index.vue` — editor de plantillas con drag&drop.

```
pages/contract-templates/index.vue
components/contract-templates/
  SectionBlock.vue          # bloque individual (compact/edit view)
  editors/
    ClauseEditor.vue        # editor Tiptap (clause/observation)
    ConfigEditor.vue        # checkboxes party/property/contract_info
    SignatureEditor.vue     # configurador de firmantes
```

**`admin-form` en el root**: `SectionBlock.vue` y `ConfigEditor.vue` tienen `admin-form` en su **elemento raíz**. Sin esto, los `CommonInputfields*` muestran estilos Bootstrap crudos.

**Toggle activo — gotcha CSS**: usar `:deep(.common-checkbox-text) { display: none }` para ocultar solo el label text, no el input que vive dentro de `<label>`.

**Seeder de secciones** (para tenants existentes):
```bash
php artisan tenants:seed               # todos
php artisan tenants:seed --tenants=ID  # uno específico
```
`TemplateSectionsSeeder` + `DocumentTemplatesSeeder` usan `firstOrCreate` — idempotentes.

---

## Módulo Sucursales

`store/branchStore.ts` — persiste `activeCompanyId` en localStorage; se carga en `onMounted` del sidebar.

`composables/useApi.ts` — inyecta el header `X-Company-Id` con `getActivePinia()` (sin dependencia circular).

`components/layout/header/BranchSelector.vue` — dropdown click-based en el header. Solo se muestra si `uses_branches = true`.

**Reglas:**
- En cualquier listado tenant que deba filtrarse por sucursal: observar `watch(branchStore.activeCompanyId, loadData)`.
- `BranchService.ts` consume `/api/branches`. El backend mapea esto a `Company` con `parent_company_id`.
- Permiso `companies.switch` — permite ver la lista de sucursales en el selector sin acceso a la página de gestión.
- Permiso `companies.view_all` — desactiva el scoping; el usuario ve todos los datos de todas las sucursales.

---

## Módulo Firma Electrónica

Archivos relevantes:
```
interfaces/IDocumentSignatory.ts          # IDocumentSignatory, ISigningPageData, tipos
services/DocumentSignatoryService.ts      # 7 métodos: privados (admin) + públicos (firmante)
constants/ApiUrls.ts                      # DOCUMENT_SIGNATORIES_BASE, SIGN_BASE
components/rents/documents/index.vue      # modal firmantes integrado
pages/firmar/[token].vue                  # página pública de firma
```

**Regla de layout para la página pública:**
```ts
definePageMeta({ layout: 'login', auth: false })
```
Sin esto, el middleware global `auth.global.ts` redirige al login antes de cargar la página.

**Regla de estado del documento:**
El botón "Firma electrónica" solo aparece cuando `doc.status?.alias === 'generado'`. Un documento borrador, enviado, firmado o archivado no puede iniciar un nuevo flujo de firma.

**`DocumentSignatoryService`** — diferencia entre rutas:
- Métodos privados (`getSignatories`, `storeSignatories`, etc.) → requieren token de auth → `useApiHandler().run()`
- Métodos públicos (`getSigningPage`, `getDocumentBlob`, `submitSignature`) → sin auth → `useApi` con `{ auth: false }` o similar

**Validación de email en frontend antes de enviar a firmar:**
Los firmantes propuestos pueden tener `email: ""`. `ConvertEmptyStringsToNull` del backend convierte `""` → `null`, lo que hace fallar `required|email`. Por eso `saveSignatories()` pre-valida en frontend y muestra error antes de llamar a la API.

---

## Patrón Drawer en listados

Cuando un listado necesita abrir un componente que internamente usa `CommonModal`, **no usar `CommonModal` como contenedor externo** — provoca conflicto de z-index (ambos usan `z-index: 1050/1055`).

**Solución**: drawer lateral con Teleport y z-index inferior:

```vue
<Teleport to="body">
  <div class="drawer-backdrop" style="z-index: 1040" @click="close" />
  <div class="drawer-panel" style="z-index: 1045">
    <ComponentQueUsaCommonModal />
  </div>
</Teleport>
```

Los `CommonModal` que el componente embebido abra (z-index 1050/1055) flotan encima del drawer (1045) sin conflicto.

**Implementado en:** `components/rents/all.vue` — drawer de documentos del contrato con `RentsDocuments` embebido.

---

## Módulos Central

El panel central (rutas `pages/central/`) tiene sus propios servicios y componentes que evolucionan de forma independiente al panel tenant. **Nunca importar servicios o componentes de tenant en páginas central.**

### Dónde vive cada cosa

| Tipo | Tenant | Central |
|---|---|---|
| Servicio | `services/XxxService.ts` | `services/central/XxxService.ts` |
| Componente | `components/xxx/` | `components/central/xxx/` |
| Página | `pages/xxx/` | `pages/central/xxx/` |

### Módulos separados actualmente

| Módulo | Servicio | Componentes principales |
|---|---|---|
| Person | `services/central/PersonService.ts` | `components/central/people/all.vue`, `base-form/`, `add/`, `edit/` |
| Company | `services/central/CompanyService.ts` | `components/central/company/base-form/`, `general/`, `settings/` |

### Reglas del contexto central

1. **Sin `useBranchStore`** — el panel central no tiene sucursales. No importar ni usar `branchStore` en ningún componente central.
2. **Sin `watch(branchStore.activeCompanyId, ...)`** — cargar datos en `onMounted`, no en watch de branch.
3. **Sin `uses_branches`** — el campo no existe en la empresa central. No enviar ese campo al backend.
4. **Componentes `general/` y `settings/`** — las versiones centrales eliminan las secciones condicionales de `isHeadquarters` porque la empresa central siempre es sede única.
5. **Duplicar, no reutilizar** — si un módulo tenant y central comparten lógica hoy, igual se duplica. La separación permite que evolucionen sin acoplarse.

### Naming — auto-import Nuxt

Los componentes en `components/central/people/all.vue` se auto-nombran `<CentralPeopleAll />`. La carpeta central actúa como prefijo de namespace. No hace falta registrar manualmente.
