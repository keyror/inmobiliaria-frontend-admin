
import {useApi} from "~/composables/useApi";
import {ApiUrls} from "~/constants/ApiUrls";

class AuthenticationService {
    async login(data: any): Promise<any> {
        return useApi(ApiUrls.AUTH_LOGIN_POST, {
            method: 'POST',
            body: data,
        })
    }

    async logout(): Promise<any> {
        return useApi(ApiUrls.AUTH_LOGOUT_POST, { method: 'POST' })
    }

    async getUser(): Promise<any> {
        return useApi(ApiUrls.AUTH_ME_GET, { method: 'GET' })
    }

    async refresh(): Promise<any> {
        return useApi(ApiUrls.AUTH_REFRESH_POST, { method: 'POST' })
    }

    async sendResetEmail(email: string): Promise<any> {
        return useApi(ApiUrls.AUTH_SEND_RESET_EMAIL_POST, {
            method: 'POST',
            body: { email },
        });
    }

    async resetPassword(data: { email: string, token: string, password: string, password_confirmation: string }): Promise<any> {
        return useApi(ApiUrls.AUTH_RESET_PASSWORD_POST, {
            method: 'POST',
            body: data,
        });
    }
}

export default new AuthenticationService()
