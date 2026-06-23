<script setup lang="ts">
const posterFallback = "";

import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useMovieStore } from "../stores/movie";
import { useProfileStore } from "../stores/movie";
import { useAuthStore } from "../stores/auth";
import type { Movie } from "../types";

const props = defineProps<{
  movie: Movie;
  demo?: boolean;
  blur?: boolean;
}>();

const movieStore = useMovieStore();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const router = useRouter();

const likeError = ref("");
const isLiking = ref(false);

const isLiked = computed(() =>
  props.movie.id ? movieStore.isLiked(props.movie.id) : false
);

const genresText = computed(() => props.movie.genres?.join(", ") || "");

const handleLike = async () => {
  if (!authStore.isAuthenticated()) {
    router.push("/auth");
    return;
  }
  if (!profileStore.hasName) {
    likeError.value = "Укажите имя в профиле, чтобы добавить фильмы";
    return;
  }
  if (!props.movie.id) return;

  isLiking.value = true;
  likeError.value = "";
  try {
    await movieStore.likeMovie(props.movie.id);
    await movieStore.getLikedMovies();
  } catch {
    likeError.value = movieStore.error;
  } finally {
    isLiking.value = false;
  }
};

const posterSrc = computed(() => props.movie.poster_image || undefined);
const showLikeButton = computed(() => !!props.movie.id);
</script>

<template>
  <div class="movie-card" :class="{ 'is-blurred': blur }">
    <div class="movie-image">
      <img
        :src="posterSrc"
        :alt="movie.name_movie"
        loading="lazy"
      />
      <span v-if="demo" class="badge-demo">Демо</span>
      <span v-if="movie.rating" class="badge-rating">★ {{ movie.rating.toFixed(1) }}</span>

      <div v-if="blur" class="blur-overlay">
        <div class="blur-hint">Просмотр</div>
      </div>
    </div>

    <div class="movie-content">
      <h3 class="movie-title">{{ movie.name_movie }}</h3>

      <p v-if="movie.year" class="movie-year">{{ movie.year }}</p>

      <p v-if="genresText" class="movie-genres">{{ genresText }}</p>

      <p v-if="movie.description" class="movie-description">
        {{ movie.description }}
      </p>

      <p v-if="likeError" class="like-error">{{ likeError }}</p>

      <button
        v-if="showLikeButton"
        @click="handleLike"
        :disabled="isLiking || isLiked"
        :class="{ liked: isLiked }"
        class="btn-like"
      >
        {{
          isLiking
            ? "Добавляем..."
            : isLiked
              ? "В избранном"
              : "Добавить в избранное"
        }}
      </button>

      <router-link
        v-else-if="movie.id"
        to="/auth"
        class="btn-like btn-auth-link"
      >
        Войти, чтобы сохранить
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #e2e8f0;
}

.movie-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.movie-card.is-blurred {
  filter: saturate(0.85);
}

.movie-image {
  width: 100%;
  height: 280px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.movie-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.movie-card:hover .movie-image img {
  transform: scale(1.05);
}

.blur-overlay {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.blur-hint {
  background: rgba(0, 0, 0, 0.55);
  color: white;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
}

.badge-demo {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-rating {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
}

.movie-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.movie-title {
  margin: 0 0 0.4rem;
  color: #2d3748;
  font-size: 1.1rem;
  line-height: 1.4;
  font-weight: 600;
}

.movie-year {
  color: #a0aec0;
  font-size: 0.85rem;
  margin: 0 0 0.5rem;
}

.movie-genres {
  color: #667eea;
  font-size: 0.8rem;
  margin: 0 0 0.8rem;
  padding: 0.35rem 0.7rem;
  background: #f7fafc;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.movie-description {
  color: #718096;
  font-size: 0.85rem;
  margin: 0 0 1rem;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.6;
}

.like-error {
  color: #c53030;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.btn-like {
  margin-top: auto;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  background: white;
  color: #667eea;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9rem;
  text-align: center;
  text-decoration: none;
  display: block;
}

.btn-like:hover:not(:disabled) {
  border-color: #667eea;
  background: #f7fafc;
  transform: translateY(-2px);
}

.btn-like.liked,
.btn-like:disabled.liked {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  cursor: default;
  transform: none;
}

.btn-auth-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}
</style>

