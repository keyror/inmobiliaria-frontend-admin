/**
 * URLs centralizadas de la API
 */
export class ApiUrls {
    // Authentication URLs
    static readonly AUTH_LOGIN_POST = '/auth/login';
    static readonly AUTH_LOGOUT_POST = '/auth/logout';
    static readonly AUTH_ME_GET = '/auth/me';
    static readonly AUTH_REFRESH_POST = '/auth/refresh';
    static readonly AUTH_SEND_RESET_EMAIL_POST = '/auth/send-reset-email';
    static readonly AUTH_RESET_PASSWORD_POST = '/auth/reset-password';

    // Users URLs
    static readonly USERS_GET = '/users';
    static readonly USERS_SHOW_GET = '/users';
    static readonly USERS_UPDATE_PUT = '/users';
    static readonly USERS_DELETE_DELETE = '/users';
    static readonly USERS_CREATE_POST = '/users';
    static readonly USERS_EXPORT_TO_EXCEL_GET: string = 'users/export/excel';
    static readonly USERS_EXPORT_TO_PDF_GET: string = 'users/export/pdf';

    // Tenants URLs
    static readonly TENANTS_GET = '/tenants';
    static readonly TENANTS_SHOW_GET = '/tenants';
    static readonly TENANTS_UPDATE_PUT = '/tenants';
    static readonly TENANTS_DELETE_DELETE = '/tenants';
    static readonly TENANTS_CREATE_POST = '/tenants';
    static readonly TENANTS_ACTIVATE_PATCH = '/tenants';
    static readonly TENANTS_DEACTIVATE_PATCH = '/tenants';
}
