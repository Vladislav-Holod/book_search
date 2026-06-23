import { defineStore } from "pinia";
import { api } from "../api/axios";
import { ref } from "vue";
import type { User } from "../types";
import { useProfileStore } from "./movie";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const accessToken = ref(localStorage.getItem("access_token") || "");
  const refreshToken = ref(localStorage.getItem("refresh_token") || "");
  const isLoading = ref(false);
  const error = ref("");

  const isAuthenticated = () => !!accessToken.value;

  const initProfile = async () => {
    if (isAuthenticated()) {
      try {
        const profileStore = useProfileStore();
        await profileStore.getProfile();
      } catch {
        // профиль загрузится при переходе на страницу
      }
    }
  };

  const register = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = "";
    try {
      const res = await api.post<User>("/user/", { email, password });
      return res.data;
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      error.value = detail || "Ошибка регистрации";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = "";
    try {
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);

      const res = await api.post("/user/token", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      accessToken.value = res.data.access_token;
      refreshToken.value = res.data.refresh_token;

      localStorage.setItem("access_token", accessToken.value);
      localStorage.setItem("refresh_token", refreshToken.value);

      user.value = { id: 0, email, is_active: true };
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      error.value = detail || "Ошибка входа";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    accessToken.value = "";
    refreshToken.value = "";
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  const refreshAccessToken = async () => {
    try {
      const res = await api.post("/user/refresh-token", {
        refresh_token: refreshToken.value,
      });
      accessToken.value = res.data.access_token;
      refreshToken.value = res.data.refresh_token;
      localStorage.setItem("access_token", accessToken.value);
      localStorage.setItem("refresh_token", refreshToken.value);
    } catch {
      logout();
      throw new Error("Session expired");
    }
  };

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    isAuthenticated,
    initProfile,
    register,
    login,
    logout,
    refreshAccessToken,
  };
});
