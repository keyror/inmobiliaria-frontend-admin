import { useAuthStore } from "@/store/authStore";
import { useAppContext } from "@/composables/useAppContext";

// Routes that belong exclusively to one context.
// Unauthenticated navigation is handled by auth.global.ts first.
const CENTRAL_ONLY = ["/central/", "/plans/", "/tenants/"];
const TENANT_ONLY = [
  "/properties/",
  "/rents/",
  "/people/",
  "/reports/",
  "/realstate/",
  "/contract-templates/",
  "/branches/",
];

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  if (!auth.isAuthenticated) return;

  const { isCentral } = useAppContext();

  if (isCentral.value && to.path === "/") {
    return navigateTo("/central");
  }

  if (!isCentral.value && CENTRAL_ONLY.some((r) => to.path.startsWith(r))) {
    return navigateTo("/");
  }

  if (isCentral.value && TENANT_ONLY.some((r) => to.path.startsWith(r))) {
    return navigateTo("/");
  }
});
