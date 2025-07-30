
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
}

export default new AutenticacionService()
