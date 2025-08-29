export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    // Detectar host actual
    const host = window.location.host

    // Si estamos en localhost usamos la URL de desarrollo, si no usamos el subdominio actual
    config.public.apiBase = host.includes('localhost')
        ? 'http://localhost:8000/api'      // valor por defecto para dev
        : `http://${host}/api`             // dominio/subdominio dinámico
})
