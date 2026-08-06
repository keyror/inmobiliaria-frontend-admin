# Dominio del negocio — Frontend Admin

Panel de administración SPA (sin SSR). Consume la API del backend Laravel. Acceso restringido por autenticación JWT + permisos Spatie.

---

## Módulos activos

| Módulo | Páginas (`app/pages/`) | Servicio (`app/services/`) | Permisos | Endpoint backend |
|---|---|---|---|---|
| **Properties** | `properties/` (all, add, edit/[id]) | `PropertyService.ts` | `properties.*` | `/api/properties` |
| **People** | `people/` (all, add, edit/[id]) | `PersonService.ts` | `people.*` | `/api/people` |
| **Company** | `company/index.vue` | `CompanyService.ts` | `companies.*` | `/api/companies` |
| **Branches** | `branches/index.vue` | `BranchService.ts` | `companies.*` | `/api/branches` |
| **Users** | `users/` (all, add, edit/[id]) | `UserService.ts` | `users.*` | `/api/users` |
| **Roles** | `authorization/all-roles.vue` | `RolePermissionService.ts` | `roles.*` | `/api/roles` |
| **Lookups** | `lookups/` (all, add, edit/[id]) | `LookupService.ts` | `lookups.*` | `/api/lookups` |
| **Rents** | `rents/` (all, add, edit/[id]) | `RentService.ts` | `rents.*` | `/api/rents` |
| **Documents** | tab en `rents/edit/[id].vue` · drawer en `rents/all.vue` | `DocumentSignatoryService.ts` | `documents.*` | `/api/rents/{id}/documents` |
| **Firma electrónica** | `firmar/[token].vue` (pública, auth: false) | `DocumentSignatoryService.ts` | ninguno (token) | `/api/sign/{token}` |
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

### Branches (sucursales)
- Una sucursal **es** un `Company` con `parent_company_id != null`. El endpoint es `/api/branches` pero el modelo es `Company`.
- `branchStore.ts` persiste `activeCompanyId` y lo inyecta como header `X-Company-Id` en cada request via `useApi.ts`.
- `BranchSelector.vue` vive en el header del layout; `BranchList.vue` en la página de gestión.
- En componentes tenant: siempre observar `branchStore.activeCompanyId` para recargar datos al cambiar sucursal.
- El componente de empresa (`CompanyService.ts`) llama `branchStore.load(true)` después de guardar para refrescar el selector.

### Rents
- **Sub-entidades en payload**: `rent_tenants` (arrendatarios/codeudores), `rent_obligations` (obligaciones).
- Al actualizar la pestaña de arrendatarios, se envía `rent_tenants`; al actualizar obligaciones, `rent_obligations`. Cada pestaña es independiente.
- Auditoría: todos los cambios (Rent + RentObligation + RentTenantCodebtor + Liability) quedan en un batch `log_name='rents'`.
- **Pestaña Documentos**: `components/rents/documents/index.vue` — acciones via `CommonActionsDropdown`, modal de firmantes integrado.
- **Drawer de documentos en el listado**: `components/rents/all.vue` contiene un drawer lateral (slide-in desde la derecha) con `RentsDocuments` embebido. Usa z-index 1040/1045 (menor que `CommonModal` 1050/1055) para que los modales internos del componente de documentos floten encima sin conflicto.

### Documentos y Firma Electrónica
- `DocumentSignatoryService.ts` maneja tanto las rutas privadas (gestión de firmantes) como las rutas públicas (página de firma).
- **Página pública** `pages/firmar/[token].vue`: `definePageMeta({ layout: 'login', auth: false })` — sin autenticación. Canvas táctil + upload de imagen, PDF embebido via blob URL.
- **Solo documentos en estado `generado`** pueden enviarse a firmar — el botón "Firma electrónica" en `docActions()` valida `doc.status?.alias === 'generado'`.
- `IDocumentSignatory.ts` define `SignatoryRole`, `SignatoryStatus`, `SignatureType`, `IDocumentSignatory`, `ISigningPageData`.

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
