import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "../api/axios";

export interface Book {
  id?: number;
  title: string;
  author: string | null;
  image_url: string | null;
  description: string | null;
  genres: string | null;
}

export interface RecommendResponse {
  prompt: string;
  topic: string;
  books: Book[];
}

export interface UserProfile {
  id: number;
  name: string | null;
  favorite_genres: string | null;
  about_me: string | null;
  user_id: number;
  created_at: string;
}

const fallbackBooks: Book[] = [
  {
    id: 1,
    title: "1984",
    author: "Джордж Оруэлл",
    image_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
    description: "Антиутопический роман о контроле, истории и свободе личности.",
    genres: "Антиутопия, Классика",
  },
  {
    id: 2,
    title: "Мастер и Маргарита",
    author: "Михаил Булгаков",
    image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    description: "Мистический роман о добре, зле и великой любви в Москве.",
    genres: "Мистика, Классика",
  },
  {
    id: 3,
    title: "Преступление и наказание",
    author: "Фёдор Достоевский",
    image_url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    description: "Классика, исследующая нравственность, вину и искупление.",
    genres: "Драма, Классика",
  },
];

export const useBookStore = defineStore("book", () => {
  const books = ref<Book[]>([]);
  const likedBooks = ref<Book[]>([]);
  const recommendations = ref<RecommendResponse | null>(null);
  const isLoading = ref(false);
  const error = ref("");

  const getBooks = async () => {
    isLoading.value = true;
    error.value = "";
    try {
      const res = await api.get("/books");
      books.value = res.data;
    } catch (err: any) {
      books.value = fallbackBooks;
      error.value = "Не удалось загрузить книги с сервера, показываем примеры";
    } finally {
      isLoading.value = false;
    }
  };

  const createBook = async (book: Book) => {
    try {
      const res = await api.post("/books/create", book);
      books.value.push(res.data);
      return res.data;
    } catch (err: any) {
      error.value = err.response?.data?.detail || "Ошибка при создании книги";
      throw err;
    }
  };

  const getRecommendations = async (prompt: string) => {
    isLoading.value = true;
    error.value = "";
    try {
      const res = await api.post("/books/recommend", { prompt });
      recommendations.value = res.data;
      return res.data;
    } catch (err: any) {
      error.value = err.response?.data?.detail || "Ошибка при получении рекомендаций";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const likeBook = async (bookId: number) => {
    try {
      const res = await api.post(`/actions/like/${bookId}`);
      return res.data;
    } catch (err: any) {
      error.value = err.response?.data?.detail || "Ошибка при добавлении в избранное";
      throw err;
    }
  };

  const getLikedBooks = async () => {
    try {
      const res = await api.get("/actions/like/my");
      likedBooks.value = res.data;
    } catch (err: any) {
      error.value = "Ошибка при загрузке избранного";
    }
  };

  const isLiked = computed(() => {
    return (bookId: number) => likedBooks.value.some((b) => b.id === bookId);
  });

  return {
    books,
    likedBooks,
    recommendations,
    isLoading,
    error,
    getBooks,
    createBook,
    getRecommendations,
    likeBook,
    getLikedBooks,
    isLiked,
  };
});

export const useProfileStore = defineStore("profile", () => {
  const profile = ref<UserProfile | null>(null);
  const isLoading = ref(false);
  const error = ref("");

  const getProfile = async () => {
    isLoading.value = true;
    error.value = "";
    try {
      const res = await api.get("/profile/me");
      profile.value = res.data;
    } catch (err: any) {
      error.value = "Ошибка при загрузке профиля";
    } finally {
      isLoading.value = false;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const res = await api.put("/profile/me", data);
      profile.value = res.data;
      return res.data;
    } catch (err: any) {
      error.value = err.response?.data?.detail || "Ошибка при обновлении профиля";
      throw err;
    }
  };

  return {
    profile,
    isLoading,
    error,
    getProfile,
    updateProfile,
  };
});
