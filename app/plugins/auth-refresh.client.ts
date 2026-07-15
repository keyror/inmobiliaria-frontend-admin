import { useAuthStore } from "~/store/authStore";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", async () => {
    const auth = useAuthStore();

    if (!auth.token) return;

    try {
      await auth.getUser();
    } catch {
      auth.clearAuth();
      await navigateTo("/authentication/login");
    }
  });
});
