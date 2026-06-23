// plugins/auth-refresh.client.ts
import { useAuthStore } from "~/store/authStore";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", async () => {
    const auth = useAuthStore();

    // Verificar expiración al montar
    if (auth.token && auth.expiresAt && auth.expiresAt < Date.now()) {
      auth.clearAuth();
      navigateTo("/authentication/login");
      return;
    }

    if (auth.token) {
      try {
        await auth.getUser();
      } catch {
        auth.clearAuth();
        navigateTo("/authentication/login");
        return;
      }
    }

    // Programar refresh
    const scheduleRefresh = () => {
      const now = Date.now();

      if (!auth.token || !auth.expiresAt || auth.expiresAt < now) {
        return;
      }

      const delay = auth.expiresAt - now - 60 * 1000; // 1 min antes

      if (delay <= 0) {
        void auth.refreshToken();
      } else {
        setTimeout(() => {
          void auth.refreshToken();
        }, delay);
      }
    };

    scheduleRefresh();
  });
});
