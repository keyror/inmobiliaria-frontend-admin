/**
 * URLs centralizadas de la API
 */
export class ApiUrls {
    // Authentication URLs
    static readonly AUTH_LOGIN = '/auth/login';
    static readonly AUTH_LOGOUT = '/auth/logout';
    static readonly AUTH_ME = '/auth/me';
    static readonly AUTH_REFRESH = '/auth/refresh';
    static readonly AUTH_SEND_RESET_EMAIL = '/auth/send-reset-email';
    static readonly AUTH_RESET_PASSWORD = '/auth/reset-password';

    // Users URLs
    static readonly USERS = '/users';
    static readonly USERS_SHOW = '/users';
    static readonly USERS_UPDATE = '/users';
    static readonly USERS_DELETE = '/users';
    static readonly USERS_CREATE = '/users';
    static readonly USERS_EXPORT_TO_EXCEL: string = 'users/export/excel';
    static readonly USERS_EXPORT_TO_PDF: string = 'users/export/pdf';
}
