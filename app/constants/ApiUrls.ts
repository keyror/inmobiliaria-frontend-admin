/**
 * URLs centralizadas de la API
 */
export class ApiUrls {
  // Authentication URLs
  static readonly AUTH_LOGIN_POST = "/auth/login";
  static readonly AUTH_LOGOUT_POST = "/auth/logout";
  static readonly AUTH_ME_GET = "/auth/me";
  static readonly AUTH_REFRESH_POST = "/auth/refresh";
  static readonly AUTH_SEND_RESET_EMAIL_POST = "/auth/send-reset-email";
  static readonly AUTH_RESET_PASSWORD_POST = "/auth/reset-password";

  // Users URLs
  static readonly USERS_GET = "/users";
  static readonly USERS_SHOW_GET = "/users";
  static readonly USERS_UPDATE_PUT = "/users";
  static readonly USERS_DELETE_DELETE = "/users";
  static readonly USERS_CREATE_POST = "/users";
  static readonly USERS_EXPORT_TO_EXCEL_GET: string = "users/export/excel";
  static readonly USERS_EXPORT_TO_PDF_GET: string = "users/export/pdf";

  // Tenants URLs
  static readonly TENANTS_GET = "/tenants";
  static readonly TENANTS_SHOW_GET = "/tenants";
  static readonly TENANTS_UPDATE_PUT = "/tenants";
  static readonly TENANTS_DELETE_DELETE = "/tenants";
  static readonly TENANTS_CREATE_POST = "/tenants";
  static readonly TENANTS_ACTIVATE_PATCH = "/tenants";
  static readonly TENANTS_DEACTIVATE_PATCH = "/tenants";

  // Roles URLs
  static readonly ROLES_GET = "/roles";
  static readonly ROLES_UPDATE_PUT = "/roles";
  static readonly ROLES_DELETE_DELETE = "/roles";
  static readonly ROLES_CREATE_POST = "/roles";
  static readonly ROLES_PERMISSIONS_ASSIGN_POST = "/roles/assign-permissions";

  // Permissions URLs
  static readonly PERMISSIONS_GET = "/permissions";
  static readonly PERMISSIONS_UPDATE_PUT = "/permissions";
  static readonly PERMISSIONS_DELETE_DELETE = "/permissions";
  static readonly PERMISSIONS_CREATE_POST = "/permissions";

  // People URLs
  static readonly PEOPLE_GET = "/people";
  static readonly PEOPLE_SHOW_GET = "/people";
  static readonly PEOPLE_CREATE_POST = "/people";
  static readonly PEOPLE_UPDATE_PUT = "/people";
  static readonly PEOPLE_DELETE_DELETE = "/people";

  // Fiscal Profiles URLs
  static readonly FISCAL_PROFILES_CREATE_POST = "/fiscal-profiles";
  static readonly FISCAL_PROFILES_UPDATE_PUT = "/fiscal-profiles";
  static readonly FISCAL_PROFILES_DELETE_DELETE = "/fiscal-profiles";

  // Desplegables
  static readonly LOOKUPS_POST = "/lookups";
  static readonly LOOKUPS_COUNTRY_COLOMBIA = "/lookups/co";
  static readonly LOOKUPS_ADMIN_GET = "/lookups";
  static readonly LOOKUPS_ADMIN_SHOW_GET = "/lookups";
  static readonly LOOKUPS_ADMIN_CREATE_POST = "/lookups/manage";
  static readonly LOOKUPS_ADMIN_UPDATE_PUT = "/lookups";
  static readonly LOOKUPS_ADMIN_DELETE_DELETE = "/lookups";
  static readonly LOOKUPS_ADMIN_CATEGORIES_GET = "/lookups/categories";

  // Rents URLs
  static readonly RENTS_GET = "/rents";
  static readonly RENTS_SHOW_GET = "/rents";
  static readonly RENTS_CREATE_POST = "/rents";
  static readonly RENTS_UPDATE_PUT = "/rents";
  static readonly RENTS_DELETE_DELETE = "/rents";
  static readonly RENTS_DOCUMENTS_GET = "/rents";
  static readonly RENTS_DOCUMENTS_CREATE_POST = "/rents";
  static readonly RENTS_DOCUMENTS_UPDATE_PUT = "/rents";
  static readonly RENTS_DOCUMENTS_DELETE_DELETE = "/rents";
  static readonly RENTS_DOCUMENTS_GENERATE_POST = "/rents";
  static readonly RENTS_DOCUMENTS_DOWNLOAD_GET = "/rents";

  // Properties URLs
  static readonly PROPERTIES_GET = "/properties";
  static readonly PROPERTIES_SHOW_GET = "/properties";
  static readonly PROPERTIES_CREATE_POST = "/properties";
  static readonly PROPERTIES_UPDATE_PUT = "/properties";
  static readonly PROPERTIES_DELETE_DELETE = "/properties";

  // Companies URLs
  static readonly PUBLIC_COMPANY_GET = "/public/company";
  static readonly COMPANIES_CURRENT_GET = "/companies/current";
  static readonly COMPANIES_CREATE_POST = "/companies";
  static readonly COMPANIES_UPDATE_PUT = "/companies";

  // Central site management URLs
  static readonly CENTRAL_SITE_THEME_GET = "/central/site-theme";
  static readonly CENTRAL_SITE_THEME_PUT = "/central/site-theme";

  // Realstate site management URLs
  static readonly REALSTATE_SITE_TEMPLATE_GET =
    "/admin/realstate/site-template";
  static readonly REALSTATE_SITE_TEMPLATE_PUT =
    "/admin/realstate/site-template";
  static readonly REALSTATE_SITE_PAGES_GET = "/admin/realstate/site-pages";
  static readonly REALSTATE_SITE_PAGES_PUT = "/admin/realstate/site-pages";
  static readonly REALSTATE_SITE_TEMPLATE_RESTORE_POST =
    "/admin/realstate/site-template/restore";
  static readonly REALSTATE_SITE_PAGE_RESTORE_POST =
    "/admin/realstate/site-pages";
  static readonly REALSTATE_SITE_RESTORE_ALL_POST =
    "/admin/realstate/site/restore-all";

  static readonly IMAGES = "/images";
  static readonly IMAGE_COVER = "cover";

  // Dashboard
  static readonly DASHBOARD_GET = "/dashboard";

  // Search
  static readonly SEARCH_GLOBAL_GET = "/search/global";

  // Audit URLs
  static readonly AUDIT_GET = "/audit";
  static readonly AUDIT_BATCH_GET = "/audit/batch";

  // Tenant Users URLs (central manages users of a tenant)
  static readonly TENANT_USERS_BASE = "/tenants";

  // Template Sections (editable document template sections)
  static readonly TEMPLATE_SECTIONS_GET = "/contract-clauses";
  static readonly TEMPLATE_SECTIONS_META_GET = "/contract-clauses/meta";
  static readonly TEMPLATE_SECTIONS_POST = "/contract-clauses";
  static readonly TEMPLATE_SECTIONS_PUT = "/contract-clauses";
  static readonly TEMPLATE_SECTIONS_DELETE = "/contract-clauses";
  static readonly TEMPLATE_SECTIONS_REORDER_POST = "/contract-clauses/reorder";
  static readonly TEMPLATE_SECTIONS_RESET_POST = "/contract-clauses/reset";
  static readonly TEMPLATE_SECTIONS_PREVIEW_GET = "/contract-clauses/preview";

  /** @deprecated Use TEMPLATE_SECTIONS_* */
  static readonly CONTRACT_CLAUSES_GET = "/contract-clauses";
  /** @deprecated Use TEMPLATE_SECTIONS_* */
  static readonly CONTRACT_CLAUSES_META_GET = "/contract-clauses/meta";
  /** @deprecated Use TEMPLATE_SECTIONS_* */
  static readonly CONTRACT_CLAUSES_POST = "/contract-clauses";
  /** @deprecated Use TEMPLATE_SECTIONS_* */
  static readonly CONTRACT_CLAUSES_PUT = "/contract-clauses";
  /** @deprecated Use TEMPLATE_SECTIONS_* */
  static readonly CONTRACT_CLAUSES_DELETE = "/contract-clauses";
  /** @deprecated Use TEMPLATE_SECTIONS_* */
  static readonly CONTRACT_CLAUSES_REORDER_POST = "/contract-clauses/reorder";
  /** @deprecated Use TEMPLATE_SECTIONS_* */
  static readonly CONTRACT_CLAUSES_RESET_POST = "/contract-clauses/reset";
  /** @deprecated Use TEMPLATE_SECTIONS_* */
  static readonly CONTRACT_CLAUSES_PREVIEW_GET = "/contract-clauses/preview";

  // Branches (Sucursales) URLs
  static readonly BRANCHES_GET = "/branches";
  static readonly BRANCHES_SHOW_GET = "/branches";
  static readonly BRANCHES_CREATE_POST = "/branches";
  static readonly BRANCHES_UPDATE_PUT = "/branches";
  static readonly BRANCHES_DELETE_DELETE = "/branches";
  static readonly BRANCH_SWITCH_POST = "/branch/switch";

  // Plans URLs
  static readonly PLANS_GET = "/plans";
  static readonly PLANS_SHOW_GET = "/plans";
  static readonly PLANS_SELECT_GET = "/plans/select";
  static readonly PLANS_CREATE_POST = "/plans";
  static readonly PLANS_UPDATE_PUT = "/plans";
  static readonly PLANS_DELETE_DELETE = "/plans";

  // Document Signatories URLs
  static readonly DOCUMENT_SIGNATORIES_BASE = "/rents";

  // Public Sign / Verify URLs (no auth)
  static readonly SIGN_BASE = "/sign";
  static readonly DOCUMENT_VERIFY_BASE = "/public/documents";

  // Reports URLs
  static readonly REPORTS_GET = "/reports";
  static readonly REPORTS_POST = "/reports";
  static readonly REPORTS_PUT = "/reports";
  static readonly REPORTS_DELETE = "/reports";
  static readonly REPORTS_VARIABLES_GET = "/reports/variables";
}
