# Dominio del negocio — Frontend Admin

Panel de administración SPA (sin SSR). Consume la API del backend Laravel. Acceso restringido por autenticación JWT + permisos Spatie.

---

## Módulos activos

| Módulo | Páginas (`app/pages/`) | Servicio (`app/services/`) | Permisos | Endpoint backend |
|---|---|---|---|---|
| **Properties** | `properties/` (all, add, edit/[id]) | `PropertyService.ts` | `properties.*` | `/api/properties` |
| **People** | `people/` (all, add, edit/[id]) | `PersonService.ts` | `people.*` | `/api/people` |
| **Company** | `company/index.vue` | `CompanyService.ts` | `companies.*` | `/api/companies` |
| **Users** | `users/` (all, add, edit/[id]) | `UserService.ts` | `users.*` | `/api/users` |
| **Roles** | `authorization/all-roles.vue` | `RolePermissionService.ts` | `roles.*` | `/api/roles` |
| **Lookups** | `lookups/` (all, add, edit/[id]) | `LookupService.ts` | `lookups.*` | `/api/lookups` |
| **Rents** | `rents/` (all, add, edit/[id]) | `RentService.ts` | `rents.*` | `/api/rents` |
| **Reports** | `reports/index.vue` | `ReportService.ts` | `reports.view` | `/api/report-templates` |
| **ContractTemplates** | `contract-templates/index.vue` | `TemplateSectionService.ts`, `ContractClauseService.ts` | — | `/api/admin/template-sections` |
| **RealstateSite** | `realstate/site-management.vue` | `RealstateSiteManagementService.ts` | `site-settings.*` | `/api/admin/realstate/site-*` |
| **Audit** | `audit/index.vue` | `AuditService.ts` | `audit.view` | `/api/audit` |
| **Dashboard** | `index.vue` | `DashboardService.ts` | `dashboard.view` | `/api/dashboard` |
| **Search** | `search/index.vue` | `SearchService.ts` | — | `/api/search/global` |
| **Plans** (central) | `plans/` | `PlanService.ts` | `plans.*` | `/api/plans` |
| **Tenants** (central) | `central/tenants/` | `TenantService.ts` | `tenants.*` | `/api/tenants` |

---

## Particularidades por módulo

### Properties
- **Galería**: `<Gallery :watermark="true">` — solo módulo que usa watermark. Ver `claude.md#componente-gallery`.
- **Código**: `PROP-000001` lo genera el backend; el frontend solo lo muestra.
- **Sub-entidades en payload**: áreas, precios, características, obligaciones, canales, propietarios (con % participación), contactos, dirección.
- **Dos estados**: `status_id` (publicación) y `status_property_id` (estado físico) — ambos Lookup.

### People
- **DV**: lo calcula el backend automáticamente; el frontend solo lo muestra.
- **Tipo de persona**: `organization_type_id` (Lookup) determina si mostrar campos de natural o jurídica.
- **Sub-entidades en payload**: contactos, direcciones, cuentas bancarias + perfil fiscal (actividades económicas, tipos de impuesto).

### Company
- Solo existe **una empresa** por tenant: `GET /api/companies/current` para cargar, `PUT /api/companies` para actualizar.
- **Logo**: via `/api/images` con `imageable_type=company`.

### Lookups
- Campos: `name`, `alias`, `category`, `value`, `code`, `icon`, `is_active`.
- Los selects del resto de módulos usan `POST /api/lookups` filtrando por `category`.
- Servicio auxiliar `LookupAdminService.ts` para operaciones CRUD; `LookupService.ts` para cargar catálogos en formularios.

### Rents
- **Sub-entidades en payload**: `rent_tenants` (arrendatarios/codeudores), `rent_obligations` (obligaciones).
- Al actualizar la pestaña de arrendatarios, se envía `rent_tenants`; al actualizar obligaciones, `rent_obligations`. Cada pestaña es independiente.
- Auditoría: todos los cambios (Rent + RentObligation + RentTenantCodebtor + Liability) quedan en un batch `log_name='rents'`.

### Reports
- `ReportService.ts` consume el CRUD de plantillas (`/api/report-templates`) + preview + export Excel.
- El módulo usa `components/report/` para la UI del constructor de columnas.

### RealstateSite
- Al guardar, el backend invalida dos caches: `publicRealstateSite` y `publicCompany`.
- El favicon gestionado aquí afecta también el panel admin (cargado via `store/publicCompany`).

---

## Datos globales (stores transversales)

| Store | Archivo | Qué guarda |
|---|---|---|
| `publicCompany` | `store/publicCompany.ts` | `logoUrl`, `faviconUrl`, `displayName` |
| Auth | `store/auth.ts` | Usuario autenticado, token JWT, array de permisos |

---

## Convención de naming

```
pages/{modulo}/all.vue       → listado con filtros y paginación
pages/{modulo}/add.vue       → formulario de creación
pages/{modulo}/edit/[id].vue → formulario de edición
```

Interfaces TypeScript en `interfaces/I{Modulo}.ts`. URLs de API en `constants/ApiUrls.ts`.
