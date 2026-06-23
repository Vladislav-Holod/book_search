import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "../api/axios";
import type {
  Movie,
  RecommendResponse,
  UserProfile,
  UserUpdateProfile,
} from "../types";

/**
 * DEMO фильмы (локальный каталог)
 * Используются только если нет данных с backend
 */
export const DEMO_MOVIES: Movie[] = [
  {
    id: 1,
    name_movie: "Interstellar",
    year: 2014,
    genres: ["Фантастика", "Драма"],
    description:
      "Группа исследователей отправляется через червоточину в поисках нового дома для человечества.",
    poster_image:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/daf5de47-6c50-4d78-a4e1-f2d7028af7c8/300x450",
    movieLength: 169,
    rating: 8.6,
  },
  {
    id: 2,
    name_movie: "Начало",
    year: 2010,
    genres: ["Фантастика", "Триллер"],
    description:
      "Профессиональный вор проникает в сны людей, чтобы украсть или внедрить идею.",
    poster_image:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/daf5de47-6c50-4d78-a4e1-f2d7028af7c8/300x450",
    movieLength: 148,
    rating: 8.7,
  },
  {
    id: 3,
    name_movie: "Матрица",
    year: 1999,
    genres: ["Фантастика", "Боевик"],
    description:
      "Хакер узнаёт, что реальность — симуляция, и присоединяется к восстанию против машин.",
    poster_image:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/daf5de47-6c50-4d78-a4e1-f2d7028af7c8/300x450",
    movieLength: 136,
    rating: 8.5,
  },
  {
    id: 4,
    name_movie: "Бегущий по лезвию 2049",
    year: 2017,
    genres: ["Фантастика", "Детектив"],
    description:
      "Офицер полиции Лос-Анджелеса раскрывает давно похороненную тайну.",
    poster_image:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/daf5de47-6c50-4d78-a4e1-f2d7028af7c8/300x450",
    movieLength: 164,
    rating: 8.0,
  },
];

export const useMovieStore = defineStore("movie", () => {
  const movies = ref<Movie[]>([]);
  const likedMovies = ref<Movie[]>([]);
  const recommendations = ref<RecommendResponse | null>(null);
  const isLoading = ref(false);
  const error = ref("");

  /**
   * Каталог = лайкнутые + демо (без дублей)
   */
  const catalogMovies = computed(() => {
    const liked = likedMovies.value.filter((m) => m.id != null);
    const seen = new Set(liked.map((m) => m.id));

    const demos = DEMO_MOVIES.filter((m) => !seen.has(m.id));

    return [...liked, ...demos];
  });

  /**
   * Получить AI-рекомендации
   */
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

  /**
   * Лайк фильма
   */
  const likeMovie = async (movieId: number) => {
    try {
      const res = await api.post<Movie>(`/actions/like/${movieId}`);
      return res.data;
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } }).response?.data
          ?.detail;

      error.value = detail || "Ошибка при добавлении в избранное";
      throw err;
    }
  };

  /**
   * Получить избранные фильмы
   */
  const getLikedMovies = async () => {
    try {
      const res = await api.get<Movie[]>("/actions/like/my");
      likedMovies.value = res.data;
    } catch {
      likedMovies.value = [];
    }
  };

  /**
   * Проверка лайка
   */
  const isLiked = computed(() => {
    return (movieId: number) =>
      likedMovies.value.some((m) => m.id === movieId);
  });

  /**
   * Очистка рекомендаций
   */
  const clearRecommendations = () => {
    recommendations.value = null;
    error.value = "";
  };

  return {
    movies,
    likedMovies,
    recommendations,
    isLoading,
    error,
    catalogMovies,
    getRecommendations,
    likeMovie,
    getLikedMovies,
    isLiked,
    clearRecommendations,
  };
});

/**
 * PROFILE STORE
 */
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