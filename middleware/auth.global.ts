import { useAuthStore } from '@/store/authStore'

export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore()

    // Si la ruta no requiere autenticación
    if (to.meta.auth === false) {
        // Evitar acceso al login si ya está autenticado
        if (auth.isAuthenticated && to.path === '/Authentication/login') {
            return navigateTo('/')
        }
        return
    }

    // Si no está autenticado, redirigir al login
    if (!auth.isAuthenticated) {
        return navigateTo('/Authentication/login')
    }
})
