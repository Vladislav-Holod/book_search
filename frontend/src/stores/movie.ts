import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "../api/axios";
import type {
  Movie,
  RecommendResponse,
  UserProfile,
  UserUpdateProfile,
} from "../types";

export const useMovieStore = defineStore("movie", () => {
  const movies = ref<Movie[]>([]); // ✅ Реальные фильмы из БД
  const likedMovies = ref<Movie[]>([]);
  const recommendations = ref<RecommendResponse | null>(null);
  const isLoading = ref(false);
  const isFetchingMovies = ref(false); // ✅ Отдельный флаг загрузки фильмов
  const error = ref("");

  // ✅ Каталог теперь показывает фильмы из БД
  const catalogMovies = computed(() => {
    return movies.value;
  });

  // ✅ Загрузка фильмов из базы данных
  const fetchMovies = async () => {
    isFetchingMovies.value = true;
    error.value = "";

    try {
      const res = await api.get<Movie[]>("/movie");
      movies.value = res.data;
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } }).response?.data
          ?.detail;

      error.value = detail || "Ошибка при загрузке фильмов";
      movies.value = [];
    } finally {
      isFetchingMovies.value = false;
    }
  };

  const getRecommendations = async (prompt: string) => {
    isLoading.value = true;
    error.value = "";

    try {
      const res = await api.post<RecommendResponse>("/movie/recommend", {
        prompt,
      });

      recommendations.value = res.data;
      return res.data;
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } }).response?.data
          ?.detail;

      error.value = detail || "Сервис рекомендаций временно недоступен";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const likeMovie = async (movieId: number) => {
    try {
      await api.post(`/actions/like/${movieId}`);
      await getLikedMovies();
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } }).response?.data
          ?.detail;

      error.value = detail || "Ошибка при добавлении в избранное";
      throw err;
    }
  };

  const unlikeMovie = async (movieId: number) => {
    try {
      await api.delete(`/actions/like/${movieId}`);

      likedMovies.value = likedMovies.value.filter(
        (movie) => movie.id !== movieId
      );
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } }).response?.data
          ?.detail;

      error.value = detail || "Ошибка при удалении из избранного";
      throw err;
    }
  };

  const getLikedMovies = async () => {
    try {
      const res = await api.get<Movie[]>("/actions/like/my");
      likedMovies.value = res.data;
    } catch {
      likedMovies.value = [];
    }
  };

  const isLiked = computed(() => {
    return (movieId: number) =>
      likedMovies.value.some((m) => m.id === movieId);
  });

  const clearRecommendations = () => {
    recommendations.value = null;
    error.value = "";
  };

  return {
    movies,
    likedMovies,
    recommendations,
    isLoading,
    isFetchingMovies, // ✅ Экспортируем новый флаг
    error,
    catalogMovies,
    fetchMovies, // ✅ Экспортируем метод загрузки
    getRecommendations,
    likeMovie,
    unlikeMovie,
    getLikedMovies,
    isLiked,
    clearRecommendations,
  };
});

export const useProfileStore = defineStore("profile", () => {
  const profile = ref<UserProfile | null>(null);
  const isLoading = ref(false);
  const error = ref("");

  const hasName = computed(() => !!profile.value?.name?.trim());

  const getProfile = async () => {
    isLoading.value = true;
    error.value = "";

    try {
      const res = await api.get<UserProfile>("/profile/me");
      profile.value = res.data;
    } catch {
      profile.value = null;
      error.value = "Ошибка при загрузке профиля";
    } finally {
      isLoading.value = false;
    }
  };

  const updateProfile = async (data: UserUpdateProfile) => {
    try {
      const res = await api.put<UserProfile>("/profile/me", data);
      profile.value = res.data;
      return res.data;
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } }).response?.data
          ?.detail;

      error.value = detail || "Ошибка при обновлении профиля";
      throw err;
    }
  };

  return {
    profile,
    isLoading,
    error,
    hasName,
    getProfile,
    updateProfile,
  };
});