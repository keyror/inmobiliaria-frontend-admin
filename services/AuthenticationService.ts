
import {useApi} from "~/composable/useApi";
import {ApiUrls} from "~/constants/ApiUrls";

class AuthenticationService {
    async login(data: any): Promise<any> {
        return useApi(ApiUrls.AUTH_LOGIN, {
            method: 'POST',
            body: data,
        })
    }

    async logout(): Promise<any> {
        return useApi(ApiUrls.AUTH_LOGOUT, { method: 'POST' })
    }

    async getUser(): Promise<any> {
        return useApi(ApiUrls.AUTH_ME)
    }

    async refresh(): Promise<any> {
        return useApi(ApiUrls.AUTH_REFRESH, { method: 'POST' })
    }

    async sendResetEmail(email: string): Promise<any> {
        return useApi(ApiUrls.AUTH_SEND_RESET_EMAIL, {
            method: 'POST',
            body: { email },
        });
    }

    async resetPassword(data: { email: string, token: string, password: string, password_confirmation: string }): Promise<any> {
        return useApi(ApiUrls.AUTH_RESET_PASSWORD, {
            method: 'POST',
            body: data,
        });
    }
}

export default new AuthenticationService()
