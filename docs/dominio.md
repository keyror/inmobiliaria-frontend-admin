# Dominio del negocio — Frontend Admin

## Qué es este proyecto

Panel de administración SPA (sin SSR) para agentes de la inmobiliaria. Consume la API del backend Laravel. Acceso restringido por autenticación JWT + permisos Spatie. Los agentes gestionan propiedades, personas, empresa, configuración y contratos.

---

## Módulos activos y sus páginas

| Módulo | Páginas | Permisos necesarios | Endpoint backend |
|---|---|---|---|
| **Properties** | `pages/properties/all.vue`, `add.vue`, `edit/[id].vue` | `properties.*` | `GET/POST/PUT /api/properties` |
| **People** | `pages/people/all.vue`, `add.vue`, `edit/[id].vue` | `people.*` | `GET/POST/PUT /api/people` |
| **Users** | `pages/users/all.vue`, `add.vue`, `edit/[id].vue` | `users.*` | `GET/POST/PUT /api/users` |
| **Lookups** | `pages/lookups/all.vue`, `add.vue`, `edit/[id].vue` | `lookups.*` | `POST /api/lookups`, `GET/PUT/DELETE /api/lookups/{id}` |
| **Roles** | `pages/authorization/all-roles.vue` | `roles.*` | `GET/POST/PUT/DELETE /api/roles` |
| **Company** | `pages/company/index.vue` | `companies.*` | `GET/POST/PUT /api/companies` |
| **Realstate Site** | `pages/realstate/site-management.vue` | `site-settings.*` | `GET/PUT /api/admin/realstate/site-*` |
| **Plans** (central) | `pages/plans/all.vue`, `add.vue`, `edit/[id].vue` | `plans.*` | `GET/POST/PUT /api/plans` |
| **Tenants** (central) | `pages/central/tenants/` | `tenants.*` | `GET/POST/PUT /api/tenants` |
| **Audit** | `pages/audit/index.vue` | `audit.view` | `GET /api/audit` |
| **Search** | `pages/search/index.vue` | — | `GET /api/search/global` |
| **Dashboard** | `pages/index.vue` | `dashboard.view` | `GET /api/dashboard` |

---

## Módulo Properties — particularidades UI

- **Galería de imágenes**: usar `<Gallery :watermark="true">` — aplica el logo de empresa como marca de agua vía Canvas API (único módulo que lo usa).
- **Código**: el código `PROP-000001` lo genera el backend automáticamente; el frontend no lo envía en el store.
- **Sub-entidades en el formulario**: áreas, precios, características, obligaciones, canales de publicación, propietarios (con porcentaje de participación), contactos, dirección — se envían como arrays dentro del payload.
- **Dos estados separados**: `status_id` (publicación) y `status_property_id` (estado físico del inmueble) — ambos desplegables desde Lookup.

## Módulo People — particularidades UI

- **DV**: el dígito de verificación (`dv`) lo calcula el backend automáticamente al guardar `document_number`; el frontend solo lo muestra.
- **Tipo de persona**: `organization_type_id` (Lookup) determina si mostrar campos de persona natural o jurídica.
- **Sub-entidades**: contactos, direcciones, cuentas bancarias — se envían en el payload como arrays.

## Módulo Company — particularidades UI

- Solo existe **una empresa** por tenant. El formulario hace `GET /api/companies/current` para cargar, y `PUT /api/companies` para actualizar.
- **Logo**: se sube via el endpoint de imágenes (`/api/images`) con `imageable_type=company`.
- Sub-entidades: contactos, direcciones.

## Módulo Lookups — particularidades UI

- La creación y edición manejan todos los campos: `name`, `alias`, `category`, `value`, `code`, `icon`, `is_active`.
- Los desplegables (selects) del resto de módulos se cargan desde `POST /api/lookups` filtrando por `category`.

## Módulo Realstate Site — particularidades UI

- Gestión del sitio público: template visual + páginas de contenido.
- Cuando se guarda, el backend invalida dos caches: `publicRealstateSite` y `publicCompany`.
- El favicon que se gestiona aquí también afecta el panel admin (cargado via `store/publicCompany`).

---

## Datos globales (stores transversales)

| Store | Archivo | Qué guarda | Cuándo se carga |
|---|---|---|---|
| `publicCompany` | `store/publicCompany.ts` | `logoUrl`, `faviconUrl`, `displayName` | Al iniciar la app |
| Auth | `store/auth.ts` | Usuario autenticado, token JWT | Al login |
| Permisos | en auth store | Array de permisos del usuario | Al login |

---

## Módulo de Rent (arriendo) — próximo

El backend tiene el modelo `Rent` y la tabla pivot `rent_tenant_codebtor`. En el frontend aún no existe módulo de arriendo. Cuando se implemente:
- Página: `pages/rents/all.vue`, `add.vue`, `edit/[id].vue`
- Permiso esperado: `rents.*`
- Debe permitir seleccionar propiedades (desde `/api/properties`), arrendatarios y codeudores (desde `/api/people`)

---

## Convención de naming para futuras páginas de módulo

```
pages/{modulo}/all.vue       → listado con filtros y paginación
pages/{modulo}/add.vue       → formulario de creación
pages/{modulo}/edit/[id].vue → formulario de edición (carga el registro por ID)
```

Interfaces TypeScript en `interfaces/I{Modulo}.ts`. URLs de API en `constants/ApiUrls.ts`.
