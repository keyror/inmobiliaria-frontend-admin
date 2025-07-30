// plugins/auth-refresh.client.ts
export default defineNuxtPlugin(() => {
    const auth = useAuthStore()

    if (auth.token && auth.expiresAt && auth.expiresAt < Date.now()) {
        console.warn('🔒 Token expirado, cerrando sesión automáticamente')
        auth.clearAuth();
        return
    }
    // Función que programa el refresh si hay un token y expiresAt
    const scheduleRefresh = () => {
        const now = Date.now()

        if (!auth.token || !auth.expiresAt || auth.expiresAt < now) {
            return
        }

        const delay = auth.expiresAt - now - 60 * 1000 // 1 minuto antes

        console.log('⏳ Tiempo hasta el refresh (segundos):', delay / 1000)

        if (delay <= 0) {
            auth.refreshToken()
        } else {
            setTimeout(() => {
                auth.refreshToken()
            }, delay)
        }
    }

    // Programar al cargar la app
    scheduleRefresh()
})
