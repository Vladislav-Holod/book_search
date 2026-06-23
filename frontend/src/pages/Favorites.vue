<script setup lang="ts">
import { onMounted } from "vue";
import { useMovieStore } from "../stores/movie";
import MovieCard from "../components/MovieCard.vue";

const movieStore = useMovieStore();

onMounted(() => {
  movieStore.getLikedMovies();
});
</script>

<template>
  <div class="favorites-container">
    <h1>❤️ Избранные фильмы</h1>
    <p class="subtitle">Фильмы, которые вы добавили через рекомендации</p>

    <div v-if="movieStore.isLoading" class="loading">Загрузка...</div>

    <div v-else-if="movieStore.likedMovies.length > 0" class="movies-grid">
      <MovieCard
        v-for="movie in movieStore.likedMovies"
        :key="movie.id"
        :movie="movie"
      />
    </div>

    <div v-else class="no-favorites">
      <div class="empty-icon">🎬</div>
      <p>У вас пока нет избранных фильмов</p>
      <p class="hint">
        Получите рекомендации и нажмите «Добавить в избранное» на понравившихся фильмах.
        Не забудьте указать имя в профиле.
      </p>
      <div class="actions">
        <router-link to="/recommend" class="link">Получить рекомендации</router-link>
        <router-link to="/profile" class="link secondary">Заполнить профиль</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.favorites-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.favorites-container h1 {
  margin-bottom: 0.5rem;
  color: #2d3748;
  font-size: 2rem;
}

.subtitle {
  color: #718096;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  color: #a0aec0;
  padding: 3rem;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
}

.no-favorites {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-favorites p {
  color: #4a5568;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.no-favorites .hint {
  color: #a0aec0;
  font-size: 0.95rem;
  max-width: 480px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s;
}

.link.secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.link:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}
</style>
