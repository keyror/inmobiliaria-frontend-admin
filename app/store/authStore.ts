import { ref, computed } from "vue";

import { defineStore } from "pinia";

import AutenticacionService from "@/services/AuthenticationService";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref<string | null>(null);
    const user = ref<Record<string, any> | null>(null);
    const expiresAt = ref<number | null>(null);

    const isAuthenticated = computed(() => !!token.value && !!user.value);

    // LOGIN
    const login = async (credentials: {
      email: string;
      password: string;
      remember_me: boolean;
    }) => {
      const response = await AutenticacionService.login(credentials);

      token.value = response.access_token;
      user.value = response.data;
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

      user.value = response.data;

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
      user.value = null;
      expiresAt.value = null;
    };

    return {
      token,
      user,
      expiresAt,
      isAuthenticated,
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
