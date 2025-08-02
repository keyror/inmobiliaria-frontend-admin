import { defineStore } from 'pinia'
import { ref } from 'vue'
import AutenticacionService from '~/services/AuthenticationService';
import LoadingService from "@/services/LoadingService";
import AlertaService from "@/services/AlertService";

export const useAuthStore = defineStore(
    'auth',
    () => {
        const token = ref<string | null>(null)
        const user = ref<Record<string, any> | null>(null)
        const expiresAt = ref<number | null>(null)
        const isAuthenticated = computed(() => !!token.value && !!user.value)

        const login = async (credentials: { email: string; password: string; remember_me: boolean }) => {
            LoadingService.show()
            AutenticacionService.login(credentials)
                .then((response) => {
                    token.value = response.access_token
                    user.value = response.data
                    expiresAt.value = Date.now() + response.expires_in * 1000
                    LoadingService.hide()
                    navigateTo('/')
            }).catch((error) => {
                LoadingService.hide()
                AlertaService.showError('Ha ocurrido un error', error);
            })
        }

        const logout = async () => {
            LoadingService.show()
             AutenticacionService.logout()
                .then((response) => {
                    clearAuth()
                    AlertaService.showSuccess('Operación exitosa', response.message).then((result) => {
                        if (result.isConfirmed) {
                            LoadingService.hide()
                            navigateTo('/Authentication/login')
                        }
                    });
                }).catch((error) => {
                    clearAuth()
                    AlertaService.showError('Ha ocurrido un error', error);
                })
        }

        const getUser = async () => {
            AutenticacionService.getUser()
                .then((response) => {
                    user.value = response.data
                }).catch((error) => {
                console.log(error)
            })
        }

        const refreshToken = async () => {
            AutenticacionService.refresh()
                .then((response) => {
                    token.value = response.access_token
                    expiresAt.value = Date.now() + response.expires_in * 1000
                }).catch((error) => {
                logout()
                console.log(error)
            })
        }

        const clearAuth = async () =>{
            token.value = null
            user.value = null
            expiresAt.value = null
        }

        return {
            token,
            user,
            login,
            logout,
            getUser,
            refreshToken,
            isAuthenticated,
            expiresAt,
            clearAuth
        }
    },
    {
        persist: true,
        /**persist: {
            storage: piniaPluginPersistedstate.localStorage(),
        },**/
    },
)
