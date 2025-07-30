
import {useApi} from "~/composable/useApi";

class AutenticacionService {
    async login(data: any): Promise<any> {
        return useApi('/auth/login', {
            method: 'POST',
            body: data,
        })
    }

    async logout(): Promise<any> {
        return useApi('/auth/logout', { method: 'POST' })
    }

    async getUser(): Promise<any> {
        return useApi('/auth/me')
    }

    async refresh(): Promise<any> {
        return useApi('/auth/refresh', { method: 'POST' })
    }

    async sendResetEmail(email: string): Promise<any> {
        return useApi('/auth/send-reset-email', {
            method: 'POST',
            body: { email },
        });
    }

    async resetPassword(data: { email: string, token: string, password: string, password_confirmation: string }): Promise<any> {
        return useApi('/auth/reset-password', {
            method: 'POST',
            body: data,
        });
    }
}

export default new AutenticacionService()
