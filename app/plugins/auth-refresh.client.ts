// plugins/auth-refresh.client.ts
import { useAuthStore } from "~/store/authStore";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", () => {
    const auth = useAuthStore();

    // Verificar expiración al montar
    if (auth.token && auth.expiresAt && auth.expiresAt < Date.now()) {
      console.warn("🔒 Token expirado, cerrando sesión automáticamente");
      auth.clearAuth();
      navigateTo("/authentication/login");
      return;
    }

    // Programar refresh
    const scheduleRefresh = () => {
      const now = Date.now();

      if (!auth.token || !auth.expiresAt || auth.expiresAt < now) {
        return;
      }

      const delay = auth.expiresAt - now - 60 * 1000; // 1 min antes

      console.log("⏳ Tiempo hasta el refresh (segundos):", delay / 1000);

      if (delay <= 0) {
        auth.refreshToken();
      } else {
        setTimeout(() => {
          auth.refreshToken();
        }, delay);
      }
    };

    scheduleRefresh();
  });
});
