import { ref, computed } from "vue";

import { defineStore } from "pinia";

import AutenticacionService from "@/services/AuthenticationService";

type AuthUser = Record<string, any> & {
  roles?: string[];
  permissions?: string[];
};

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref<string | null>(null);
    const user = ref<AuthUser | null>(null);
    const roles = ref<string[]>([]);
    const permissions = ref<string[]>([]);
    const expiresAt = ref<number | null>(null);

    const isAuthenticated = computed(() => !!token.value && !!user.value);
    const hasPermission = (permission: string) =>
      permissions.value.includes(permission);
    const hasAnyPermission = (requiredPermissions: string | string[]) => {
      const permissionList = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      return permissionList.some((permission) => hasPermission(permission));
    };
    const hasAllPermissions = (requiredPermissions: string | string[]) => {
      const permissionList = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      return permissionList.every((permission) => hasPermission(permission));
    };

    const setUserSession = (authUser: AuthUser | null) => {
      user.value = authUser;
      roles.value = authUser?.roles ?? [];
      permissions.value = authUser?.permissions ?? [];
    };

    // LOGIN
    const login = async (credentials: {
      email: string;
      password: string;
      remember_me: boolean;
    }) => {
      const response = await AutenticacionService.login(credentials);

      token.value = response.access_token;
      setUserSession(response.data);
      expiresAt.value = Date.now() + response.expires_in * 1000;

      return response;
    };

    //  LOGOUT
    const logout = async () => {
      const response = await AutenticacionService.logout();

      clearAuth();

      return response;
    };

    //  GET USER
    const getUser = async () => {
      const response = await AutenticacionService.getUser();

      setUserSession(response.data);

      return response;
    };

    //  REFRESH TOKEN
    const refreshToken = async () => {
      const response = await AutenticacionService.refresh();

      token.value = response.access_token;
      expiresAt.value = Date.now() + response.expires_in * 1000;

      return response;
    };

    //  CLEAR AUTH (sin async, no lo necesita)
    const clearAuth = () => {
      token.value = null;
      setUserSession(null);
      expiresAt.value = null;
    };

    return {
      token,
      user,
      roles,
      permissions,
      expiresAt,
      isAuthenticated,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      login,
      logout,
      getUser,
      refreshToken,
      clearAuth,
    };
  },
  {
    persist: true,
  },
);
