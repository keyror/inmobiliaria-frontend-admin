import { useAuthStore } from "@/store/authStore";

export function useAuthorization() {
  const auth = useAuthStore();

  const can = (permission: string): boolean => auth.hasPermission(permission);

  const canAny = (permissions: string | string[]): boolean =>
    auth.hasAnyPermission(permissions);

  const canAll = (permissions: string | string[]): boolean =>
    auth.hasAllPermissions(permissions);

  return {
    can,
    canAny,
    canAll,
  };
}
