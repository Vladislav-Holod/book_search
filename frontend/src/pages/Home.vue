<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useMovieStore } from "../stores/movie";
import { useAuthStore } from "../stores/auth";
import MovieCard from "../components/MovieCard.vue";

const movieStore = useMovieStore();
const authStore = useAuthStore();
const searchQuery = ref("");

onMounted(async () => {
  console.log("🚀 Загружаем фильмы...");
  
  // Сначала загружаем фильмы из БД
  await movieStore.fetchMovies();
  
  console.log("📦 Фильмы загружены:", movieStore.movies.length);
  
  //  Потом загружаем лайкнутые, если пользователь авторизован
  if (authStore.isAuthenticated()) {
    await movieStore.getLikedMovies();
    console.log("❤️ Лайкнутые загружены:", movieStore.likedMovies.length);
  }
});

const filteredMovies = computed(() => {
  const list = movieStore.catalogMovies;
  if (!searchQuery.value.trim()) return list;
  const q = searchQuery.value.toLowerCase();
  return list.filter(
    (m) =>
      m.name_movie.toLowerCase().includes(q) ||
      m.genres.some((g: string) => g.toLowerCase().includes(q)) ||
      (m.description?.toLowerCase().includes(q) ?? false)
  );
});
</script>

<template>
  <div class="home-container">
    <!-- ═══ HERO ═══ -->
    <section class="hero">
      <div class="hero-bg" aria-hidden="true">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
      </div>

      <div class="hero-content">
        <p class="kicker">Твой личный кинозал</p>

        <h1 class="hero-title">
          Movie<span class="accent">Search</span>
        </h1>

        <p class="hero-sub">
          AI-подбор фильмов, жанровые каталоги и избранное — всё в одном месте
        </p>
        <div class="hero-actions">
          <router-link to="/recommend" class="btn-primary">
            AI-рекомендации
          </router-link>
          <div v-if="authStore.isAuthenticated()" class="hero-stat">
            <span class="stat-n">{{ movieStore.likedMovies.length }}</span>
            <span class="stat-l">в избранном</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ SEARCH & CATALOGUE ═══ -->
    <section class="catalogue">
      <div class="search-row">
        <div class="search-field">
          <span class="search-icon"></span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск по названию или жанру..."
            class="search-input"
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
        </div>
        <p class="search-hint">Локальный поиск по каталогу · Умные подборки — в разделе «Рекомендации»</p>
      </div>

      <!-- Показываем лоадер при загрузке -->
      <div v-if="movieStore.isFetchingMovies" class="loading-state">
        <div class="spinner"></div>
        <p>Загружаем фильмы...</p>
      </div>

      <!-- Показываем фильмы (даже если есть ошибка, но фильмы загружены) -->
      <div v-else-if="filteredMovies.length > 0" class="movies-grid">
        <MovieCard
          v-for="movie in filteredMovies"
          :key="movie.id"
          :movie="movie"
          :blur="!authStore.isAuthenticated()"
        />
      </div>

      <!--  Показываем ошибку только если фильмов НЕТ -->
      <div v-else-if="movieStore.error" class="error-state">
        <div class="empty-icon">⚠️</div>
        <p class="empty-title">{{ movieStore.error }}</p>
        <button @click="movieStore.fetchMovies" class="btn-secondary">Повторить</button>
      </div>

      <!--  Пустое состояние -->
      <div v-else class="empty-state">
        <div class="empty-icon">🎬</div>
        <p class="empty-title">Фильмы не найдены</p>
        <p class="empty-sub">Попробуй другой запрос или перейди в рекомендации</p>
        <router-link to="/recommend" class="btn-secondary">Перейти к рекомендациям</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* ─── HERO ─── */
.hero {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%);
  border: 1px solid rgba(102, 126, 234, 0.15);
  box-shadow: 0 8px 40px rgba(102, 126, 234, 0.12);
  padding: 0;
}

.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.45;
  animation: blobFloat ease-in-out infinite;
}

.blob-1 {
  width: 380px; height: 380px;
  background: #c7d2fe;
  top: -100px; left: -80px;
  animation-duration: 18s;
}
.blob-2 {
  width: 300px; height: 300px;
  background: #ddd6fe;
  bottom: -80px; right: -60px;
  animation-duration: 24s;
  animation-direction: reverse;
}
.blob-3 {
  width: 220px; height: 220px;
  background: #fbcfe8;
  top: 40%; left: 45%;
  animation-duration: 14s;
  animation-delay: -5s;
}

@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.06); }
  66% { transform: translate(-20px, 20px) scale(0.94); }
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 3.5rem 3rem;
  max-width: 700px;
}

.kicker {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #667eea;
  margin: 0 0 0.75rem;
}

.hero-title {
  font-size: clamp(2.8rem, 5.5vw, 4rem);
  font-weight: 900;
  line-height: 1.05;
  margin: 0 0 1rem;
  letter-spacing: -1.5px;
  color: #1a202c;
}

.accent {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: 1.1rem;
  color: #4a5568;
  margin: 0 0 1.75rem;
  line-height: 1.65;
  max-width: 520px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.9rem 2.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 8px 28px rgba(102, 126, 234, 0.38);
}
.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 40px rgba(102, 126, 234, 0.48);
}

.hero-stat { display: flex; flex-direction: column; gap: 1px; }
.stat-n {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  line-height: 1;
}
.stat-l {
  font-size: 11px;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

/* ─── CATALOGUE ─── */
.search-row { margin-bottom: 2rem; }

.search-field {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  padding: 0 1.2rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-field:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.search-icon { font-size: 18px; color: #a0aec0; flex-shrink: 0; }
.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 1.1rem 0;
  font-size: 1rem;
  font-family: inherit;
  color: #2d3748;
  background: transparent;
}
.search-clear {
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  border-radius: 50%;
  transition: color 0.2s;
}
.search-clear:hover { color: #4a5568; }

.search-hint {
  font-size: 0.8rem;
  color: #a0aec0;
  margin: 0.6rem 0.25rem 0;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
}

/* Loading state */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error state */
.error-state {
  text-align: center;
  padding: 3rem 2rem;
  background: #fff5f5;
  border-radius: 16px;
  border: 2px solid #fed7d7;
}
.error-state p {
  color: #c53030;
  margin-bottom: 1rem;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: #f7fafc;
  border-radius: 16px;
  border: 2px dashed #cbd5e0;
}
.empty-icon { font-size: 3rem; margin-bottom: 1rem; }
.empty-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.4rem;
}
.empty-sub { font-size: 0.95rem; color: #a0aec0; margin: 0 0 1.5rem; }

.btn-secondary {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  cursor: pointer;
}
.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .home-container { padding: 1rem; }
  .hero-content { padding: 2rem 1.5rem; }
  .hero-title { font-size: 2.4rem; }
  .hero-actions { gap: 1.2rem; }
  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.2rem;
  }
}
</style>