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
| Auditoría / audit module | `backend/docs/auditoria.md` + `constants/AuditFieldLabels.ts` + `components/audit/` |

---

## Estructura de carpetas clave

```
app/
├── pages/            # Rutas automáticas Nuxt
├── layouts/          # Layouts (default, auth)
├── components/       # Componentes reutilizables
├── composables/      # useXxx.ts
├── store/            # Pinia stores (carpeta SINGULAR — diferente al frontend-public)
├── services/         # Clases singleton: XxxService.ts
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
