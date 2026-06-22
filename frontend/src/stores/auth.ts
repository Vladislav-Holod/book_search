import { defineStore } from "pinia";
import { api } from "../api/axios";
import { ref } from "vue";

interface User {
  id: number;
  email: string;
  is_active: boolean;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const accessToken = ref(localStorage.getItem("access_token") || "");
  const refreshToken = ref(localStorage.getItem("refresh_token") || "");
  const isLoading = ref(false);
  const error = ref("");

  const isAuthenticated = () => !!accessToken.value;

  const initProfile = async () => {
    if (isAuthenticated()) {
      // Пытаемся загрузить профиль при инициализации
      try {
        const { useProfileStore } = await import('./book');
        const profileStore = useProfileStore();
        await profileStore.getProfile();
      } catch (err) {
        // Пропускаем ошибку, профиль загрузится позже
        console.log('Profile init skipped');
      }
    }
  };

  const register = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = "";
    try {
      const res = await api.post("/users/", { email, password });
      return res.data;
    } catch (err: any) {
      error.value = err.response?.data?.detail || "Ошибка регистрации";
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

      const res = await api.post("/users/token", form, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      accessToken.value = res.data.access_token;
      refreshToken.value = res.data.refresh_token;

      localStorage.setItem("access_token", accessToken.value);
      localStorage.setItem("refresh_token", refreshToken.value);

      user.value = { id: 0, email, is_active: true };
    } catch (err: any) {
      error.value = err.response?.data?.detail || "Ошибка входа";
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
      const res = await api.post("/users/refresh-token", {
        refresh_token: refreshToken.value,
      });
      accessToken.value = res.data.access_token;
      localStorage.setItem("access_token", accessToken.value);
    } catch (err) {
      logout();
      throw err;
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
