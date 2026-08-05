import { useAuthStore } from "@/store/authStore";

export const useAppContext = () => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  const isCentral = computed(() => {
    const centralDomains = ((config.public.centralDomains as string) || "")
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    // Si hay dominios configurados vía env, usar detección por hostname (Docker/prod).
    // Fallback a detección por permiso para desarrollo sin NUXT_PUBLIC_CENTRAL_DOMAINS.
    if (centralDomains.length > 0 && import.meta.client) {
      return centralDomains.includes(window.location.hostname);
    }

    return authStore.hasPermission("tenants.view");
  });

  const isTenant = computed(() => !isCentral.value);

  return { isCentral, isTenant };
};
