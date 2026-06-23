<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useMovieStore } from "../stores/movie";
import { useProfileStore } from "../stores/movie";
import { useAuthStore } from "../stores/auth";
import MovieCard from "../components/MovieCard.vue";

const movieStore = useMovieStore();
const profileStore = useProfileStore();
const authStore = useAuthStore();

const prompt = ref("");
const serviceUnavailable = ref(false);

const SUGGESTIONS = [
  "Фильмы про космос и будущее человечества",
  "Лёгкая комедия для вечера с друзьями",
  "Детективы с неожиданной развязкой",
  "Классика советского кино",
];

onMounted(() => {
  if (authStore.isAuthenticated()) {
    profileStore.getProfile();
    movieStore.getLikedMovies();
  }
});

const handleSubmit = async () => {
  if (prompt.value.trim().length < 10) {
    movieStore.error = "Запрос должен содержать минимум 10 символов";
    return;
  }

  serviceUnavailable.value = false;
  movieStore.clearRecommendations();

  try {
    await movieStore.getRecommendations(prompt.value.trim());
  } catch {
    serviceUnavailable.value = true;
  }
};

const useSuggestion = (text: string) => {
  prompt.value = text;
};

const reset = () => {
  prompt.value = "";
  serviceUnavailable.value = false;
  movieStore.clearRecommendations();
};
</script>

<template>
  <div class="recommend-container">
    <div class="page-header">
      <h1>🤖 AI Рекомендации</h1>
      <p>Опишите, какие фильмы хотите найти — система подберёт подборку</p>
    </div>

    <!-- PROMPT (всегда доступен) -->
    <div class="prompt-section">
      <form @submit.prevent="handleSubmit">
        <textarea
          v-model="prompt"
          rows="4"
          maxlength="300"
          placeholder="Например: атмосферный sci-fi про время..."
        />

        <div>
          <span>{{ prompt.length }}/300</span>

          <button
            v-if="movieStore.recommendations || serviceUnavailable"
            type="button"
            @click="reset"
          >
            Сбросить
          </button>

          <button
            type="submit"
            :disabled="movieStore.isLoading || prompt.trim().length < 10"
          >
            {{ movieStore.isLoading ? "Ищем..." : "Получить рекомендации" }}
          </button>
        </div>
      </form>

      <div class="suggestions">
        <button
          v-for="s in SUGGESTIONS"
          :key="s"
          @click="useSuggestion(s)"
        >
          {{ s }}
        </button>
      </div>
    </div>

    <!-- 🔒 BLUR ТОЛЬКО ДЛЯ AI -->
    <div
      class="ai-wrapper"
      :class="{ blurred: !authStore.isAuthenticated() }"
    >
      <div v-if="!authStore.isAuthenticated()" class="lock-overlay">
        <h2>🔒 AI рекомендации доступны только после входа</h2>
      </div>

      <div v-if="movieStore.error">
        ⚠️ {{ movieStore.error }}
      </div>

      <div v-if="serviceUnavailable">
        🚧 Сервис временно недоступен
      </div>

      <div v-else-if="movieStore.recommendations">
        <h2>{{ movieStore.recommendations.title }}</h2>

        <p>
          Запрос: «{{ movieStore.recommendations.prompt }}»
        </p>

        <div class="movies-grid">
          <MovieCard
            v-for="m in movieStore.recommendations.movies"
            :key="m.id"
            :movie="m"
          />
        </div>
      </div>

      <div v-else class="info">
        <p>Введите запрос для получения рекомендаций</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-wrapper {
  position: relative;
}

.blurred {
  filter: blur(6px);
  pointer-events: none;
  opacity: 0.6;
}

.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background: rgba(255,255,255,0.6);
  font-weight: 700;
}
</style>