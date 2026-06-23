<script setup lang="ts">
import { computed, ref } from "vue";
import { useMovieStore, useProfileStore } from "../stores/movie";
import { useAuthStore } from "../stores/auth";

const props = defineProps<{
  movie: any;
  demo?: boolean; // Можно оставить для обратной совместимости
  blur?: boolean;
}>();

const movieStore = useMovieStore();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const imgError = ref(false);
const isLoading = ref(false);
const showTooltip = ref(false);

const isLiked = computed(() =>
  props.movie?.id ? movieStore.likedMovies.some((m) => m.id === props.movie.id) : false
);

const hasName = computed(() => !!profileStore.profile?.name?.trim());

const posterSrc = computed(() => {
  if (imgError.value) return "/placeholder-poster.jpg"; // Заглушка
  return props.movie?.poster_image || "/placeholder-poster.jpg";
});

const toggleLike = async () => {
  if (!authStore.isAuthenticated() || !props.movie?.id) return;

  if (!hasName.value) {
    showTooltip.value = true;
    setTimeout(() => (showTooltip.value = false), 3000);
    return;
  }

  if (isLoading.value) return;

  isLoading.value = true;

  try {
    if (isLiked.value) {
      await movieStore.unlikeMovie(props.movie.id);
    } else {
      await movieStore.likeMovie(props.movie.id);
    }
  } catch (e) {
    console.error("Like error:", e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="movie-card" :class="{ 'is-blurred': blur }">
    <div class="poster-wrapper">
      <img
        class="poster"
        :src="posterSrc"
        :alt="movie.name_movie"
        @error="imgError = true"
      />

      <div class="card-overlay">
        <div class="overlay-top">
          <div class="spacer"></div>

          <div v-if="authStore.isAuthenticated() && movie.id" class="like-wrapper">
            <transition name="tooltip-fade">
              <div v-if="showTooltip" class="like-tooltip">
                ✏️ Укажите имя в <router-link to="/profile" class="tooltip-link">профиле</router-link>
              </div>
            </transition>

            <button
              class="like-btn"
              :class="{ liked: isLiked, 'no-name': !hasName, loading: isLoading }"
              @click.stop="toggleLike"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="like-spinner"></span>
              <template v-else>
                <span v-if="!hasName" class="like-icon lock-icon">🔒</span>
                <span v-else-if="isLiked" class="like-icon">♥</span>
                <span v-else class="like-icon">♡</span>
              </template>
            </button>
          </div>
        </div>
      </div>

      <div class="rating-badge">
        <span class="star">★</span>
        <span>{{ movie.rating }}</span>
      </div>
    </div>

    <div class="info">
      <h3 class="title">{{ movie.name_movie }}</h3>
      <div class="meta">
        <span class="year">{{ movie.year }}</span>
        <span class="dot">·</span>
        <span>{{ movie.movieLength }} мин</span>
      </div>
      <div class="genres">
        <span v-for="g in movie.genres" :key="g" class="genre">{{ g }}</span>
      </div>
      <p class="desc">{{ movie.description }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Стили остаются такими же, как раньше */
.movie-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}
.movie-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
}
.is-blurred {
  filter: blur(7px);
  pointer-events: none;
  opacity: 0.55;
}

.poster-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  background: #e2e8f0;
}
.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.movie-card:hover .poster { transform: scale(1.04); }

.card-overlay {
  position: absolute;
  inset: 0;
}
.overlay-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px;
}
.spacer { flex: 1; }

.like-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.like-tooltip {
  position: absolute;
  top: 44px;
  right: 0;
  background: rgba(26, 32, 44, 0.95);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  padding: 7px 12px;
  border-radius: 8px;
  white-space: nowrap;
  pointer-events: auto;
  z-index: 10;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}
.like-tooltip::before {
  content: '';
  position: absolute;
  top: -5px;
  right: 14px;
  width: 10px;
  height: 10px;
  background: rgba(26, 32, 44, 0.95);
  transform: rotate(45deg);
  border-radius: 2px;
}
.tooltip-link {
  color: #90cdf4;
  text-decoration: underline;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.tooltip-fade-enter-from,
.tooltip-fade-leave-to { opacity: 0; transform: translateY(-4px); }

.like-btn {
  background: rgba(0, 0, 0, 0.52);
  backdrop-filter: blur(6px);
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  line-height: 1;
  flex-shrink: 0;
}
.like-btn:hover:not(:disabled) {
  background: rgba(220, 38, 38, 0.72);
  transform: scale(1.12);
  box-shadow: 0 4px 16px rgba(220, 38, 38, 0.45);
}
.like-btn.liked {
  background: rgba(220, 38, 38, 0.82);
  border-color: rgba(255, 120, 120, 0.5);
  box-shadow: 0 4px 16px rgba(220, 38, 38, 0.4);
}
.like-btn.no-name {
  background: rgba(0, 0, 0, 0.45);
  cursor: pointer;
}
.like-btn.no-name:hover {
  background: rgba(0, 0, 0, 0.6);
  transform: scale(1.08);
  box-shadow: none;
}
.like-btn.loading { cursor: wait; opacity: 0.7; }

.like-icon {
  display: block;
  line-height: 1;
}
.lock-icon { font-size: 14px; }

.like-spinner {
  display: block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.rating-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 12px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%);
}
.star { color: #f6c90e; font-size: 14px; }

.info {
  padding: 14px 14px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.title {
  font-size: 15px;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.3;
  margin: 0;
}
.meta {
  font-size: 12px;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 5px;
}
.year { font-weight: 600; }
.dot { color: #cbd5e0; }
.genres { display: flex; flex-wrap: wrap; gap: 4px; }
.genre {
  font-size: 11px;
  background: #eef2ff;
  color: #4f46e5;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 500;
}
.desc {
  font-size: 12px;
  color: #718096;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>