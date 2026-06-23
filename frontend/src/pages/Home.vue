<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useMovieStore, DEMO_MOVIES } from "../stores/movie";
import { useAuthStore } from "../stores/auth";
import MovieCard from "../components/MovieCard.vue";

const movieStore = useMovieStore();
const authStore = useAuthStore();
const searchQuery = ref("");

onMounted(() => {
  if (authStore.isAuthenticated()) {
    movieStore.getLikedMovies();
  }
});

const filteredMovies = computed(() => {
  const list = movieStore.catalogMovies;
  if (!searchQuery.value.trim()) return list;

  const q = searchQuery.value.toLowerCase();
  return list.filter(
    (m) =>
      m.name_movie.toLowerCase().includes(q) ||
      m.genres.some((g) => g.toLowerCase().includes(q)) ||
      (m.description?.toLowerCase().includes(q) ?? false)
  );
});

const isDemo = (movie: (typeof DEMO_MOVIES)[0]) =>
  !movie.id || !movieStore.likedMovies.some((l) => l.id === movie.id);
</script>

<template>
  <div class="home-container">
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-gradient"></div>
        <div class="hero-circle hero-circle-1"></div>
        <div class="hero-circle hero-circle-2"></div>
        <div class="hero-circle hero-circle-3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-kicker">MovieSearch</div>
        <h1>MovieSearch</h1>
        <p>AI-рекомендации и быстрый подбор по жанрам — выбери настроение</p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">{{ movieStore.likedMovies.length }}</span>
            <span class="stat-label">В избранном</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ DEMO_MOVIES.length }}</span>
            <span class="stat-label">Демо-подборка</span>
          </div>
        </div>
        <router-link to="/recommend" class="btn-recommend">
          🤖 Получить AI-рекомендации
        </router-link>
      </div>
    </section>

    <section class="search-section">
      <div class="search-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 Поиск по названию или жанру..."
          class="search-input"
        />
        <div class="search-hint">
          Локальный поиск по каталогу. Для умных подборок — раздел «Рекомендации».
        </div>
      </div>

      <div v-if="filteredMovies.length > 0" class="movies-grid">
        <MovieCard
          v-for="(movie, index) in filteredMovies"
          :key="movie.id ?? `demo-${index}`"
          :movie="movie"
          :demo="isDemo(movie)"
          :blur="!authStore.isAuthenticated()"
        />
      </div>
      <div v-else class="no-results">
        <p>🎬 Фильмы не найдены</p>
        <p class="secondary">Попробуй другой запрос или перейди в рекомендации</p>
        <router-link to="/recommend" class="link-recommend">Перейти к рекомендациям</router-link>
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

.hero {
  text-align: center;
  margin-bottom: 3rem;
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.25);
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.hero-gradient {
  position: absolute;
  top: -20%;
  left: -20%;
  width: 150%;
  height: 150%;
  background: radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.4) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(245, 101, 101, 0.3) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(234, 88, 207, 0.2) 0%, transparent 40%);
  animation: gradientShift 15s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
}

.hero-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  animation: float 20s ease-in-out infinite;
}

.hero-circle-1 {
  width: 300px;
  height: 300px;
  background: #667eea;
  top: -50px;
  left: -50px;
  animation-delay: 0s;
}

.hero-circle-2 {
  width: 400px;
  height: 400px;
  background: #f56565;
  bottom: -100px;
  right: -100px;
  animation-delay: 5s;
}

.hero-circle-3 {
  width: 250px;
  height: 250px;
  background: #ea580c;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1.2rem;
  font-weight: 800;
  letter-spacing: -1px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f56565 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleFloat 6s ease-in-out infinite;
}

@keyframes titleFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.hero p {
  font-size: 1.25rem;
  color: #4a5568;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  gap: 4rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 1rem;
  color: #718096;
  font-weight: 500;
}

.btn-recommend {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ea580c 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.btn-recommend::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn-recommend:hover::before {
  left: 100%;
}

.btn-recommend:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.5);
}

.search-section {
  margin-bottom: 3rem;
}

.search-wrapper {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 1.3rem 1.5rem;
  border: 3px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1.1rem;
  font-family: inherit;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.search-hint {
  font-size: 0.9rem;
  color: #a0aec0;
  margin-top: 0.75rem;
  margin-left: 0.25rem;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
}

.no-results {
  text-align: center;
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 20px;
  border: 3px dashed #cbd5e0;
}

.no-results p {
  color: #4a5568;
  font-size: 1.3rem;
  margin: 0;
  font-weight: 700;
}

.no-results p.secondary {
  color: #a0aec0;
  font-size: 1rem;
  margin-top: 0.75rem;
  font-weight: 400;
}

.link-recommend {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s;
}

.link-recommend:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }

  .hero {
    padding: 2.5rem 1rem;
  }

  .hero h1 {
    font-size: 2.5rem;
  }

  .hero-stats {
    gap: 2rem;
  }

  .stat-number {
    font-size: 2.2rem;
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }
}
</style>
