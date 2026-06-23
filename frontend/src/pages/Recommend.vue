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

    <!-- NOT AUTH — показываем только баннер, форму скрываем -->
    <div v-if="!authStore.isAuthenticated()" class="auth-banner">
      <div class="lock-icon">🔒</div>
      <h2>AI рекомендации доступны после входа</h2>
      <p>Войдите или зарегистрируйтесь, чтобы получить персональный подбор фильмов</p>
      <router-link to="/auth" class="btn-auth">Войти или зарегистрироваться</router-link>
    </div>

    <!-- AUTH — форма и результаты -->
    <template v-else>
      <div class="prompt-section">
        <textarea
          v-model="prompt"
          rows="4"
          maxlength="300"
          placeholder="Например: атмосферный sci-fi про время..."
          class="prompt-textarea"
        />

        <div class="prompt-footer">
          <span class="char-count">{{ prompt.length }}/300</span>
          <div class="prompt-actions">
            <button
              v-if="movieStore.recommendations || serviceUnavailable"
              type="button"
              class="btn-reset"
              @click="reset"
            >
              Сбросить
            </button>
            <button
              type="button"
              class="btn-submit"
              :disabled="movieStore.isLoading || prompt.trim().length < 10"
              @click="handleSubmit"
            >
              {{ movieStore.isLoading ? "Ищем..." : "Получить рекомендации" }}
            </button>
          </div>
        </div>

        <div class="suggestions">
          <button
            v-for="s in SUGGESTIONS"
            :key="s"
            class="suggestion-chip"
            @click="useSuggestion(s)"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <div v-if="movieStore.error" class="alert alert-error">
        ⚠️ {{ movieStore.error }}
      </div>

      <div v-if="serviceUnavailable" class="alert alert-warning">
        🚧 Сервис временно недоступен. Попробуйте позже.
      </div>

      <div v-if="movieStore.isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Подбираем фильмы по вашему запросу...</p>
      </div>

      <div v-else-if="movieStore.recommendations" class="results">
        <div class="results-header">
          <h2>{{ movieStore.recommendations.title }}</h2>
          <p class="results-prompt">Запрос: «{{ movieStore.recommendations.prompt }}»</p>
        </div>
        <div class="movies-grid">
          <MovieCard
            v-for="m in movieStore.recommendations.movies"
            :key="m.id"
            :movie="m"
          />
        </div>
      </div>

      <div v-else-if="!movieStore.isLoading && !movieStore.error" class="empty-hint">
        <div class="empty-icon">✨</div>
        <p>Введите запрос и нажмите «Получить рекомендации»</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.recommend-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}
.page-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 0.5rem;
}
.page-header p {
  color: #718096;
  margin: 0;
}

/* AUTH BANNER */
.auth-banner {
  background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%);
  border: 2px solid #c7d2fe;
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
}
.lock-icon { font-size: 3rem; margin-bottom: 1rem; }
.auth-banner h2 {
  color: #1a202c;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 0.75rem;
}
.auth-banner p {
  color: #718096;
  margin: 0 0 2rem;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}
.btn-auth {
  display: inline-block;
  padding: 0.9rem 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
}
.btn-auth:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 40px rgba(102, 126, 234, 0.45);
}

/* PROMPT */
.prompt-section {
  background: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
.prompt-textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: vertical;
  font-size: 1rem;
  font-family: inherit;
  color: #2d3748;
  line-height: 1.6;
  padding: 0;
  min-height: 90px;
  background: transparent;
  box-sizing: border-box;
}
.prompt-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f4f8;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.char-count { font-size: 12px; color: #a0aec0; }
.prompt-actions { display: flex; gap: 0.75rem; }

.btn-reset {
  padding: 0.65rem 1.2rem;
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-reset:hover { background: #edf2f7; }

.btn-submit {
  padding: 0.65rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  transition: opacity 0.2s, transform 0.2s;
}
.btn-submit:hover:not(:disabled) { transform: translateY(-2px); }
.btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 1rem;
}
.suggestion-chip {
  background: #f0f4ff;
  color: #4f46e5;
  border: 1px solid #c7d2fe;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.suggestion-chip:hover { background: #e0e7ff; transform: translateY(-1px); }

/* ALERTS */
.alert {
  padding: 1rem 1.25rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  font-weight: 500;
}
.alert-error { background: #fff5f5; color: #c53030; border-left: 4px solid #fc8181; }
.alert-warning { background: #fffbeb; color: #92400e; border-left: 4px solid #fbbf24; }

/* RESULTS */
.results-header { margin-bottom: 1.5rem; }
.results-header h2 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 0.4rem;
}
.results-prompt { font-size: 0.9rem; color: #a0aec0; margin: 0; font-style: italic; }

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.75rem;
}

/* EMPTY / LOADING */
.empty-hint { text-align: center; padding: 3rem 2rem; color: #a0aec0; }
.empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: #718096;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .recommend-container { padding: 1rem; }
  .movies-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
  .prompt-footer { flex-direction: column; align-items: stretch; }
  .prompt-actions { justify-content: flex-end; }
}
</style>
