<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useBookStore } from "../stores/book";
import BookCard from "../components/BookCard.vue";

const bookStore = useBookStore();
const searchQuery = ref("");

onMounted(() => {
  bookStore.getBooks();
  bookStore.getLikedBooks();
});

const filteredBooks = computed(() => {
  if (!searchQuery.value) return bookStore.books;
  return bookStore.books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (book.author?.toLowerCase().includes(searchQuery.value.toLowerCase()) ?? false)
  );
});
</script>

<template>
  <div class="home-container">
    <section class="hero">
      <div class="hero-content">
        <h1>Открой мир книг</h1>
        <p>Найди и добавь в избранное любимые книги</p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">{{ bookStore.books.length }}</span>
            <span class="stat-label">Книг в библиотеке</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ bookStore.likedBooks.length }}</span>
            <span class="stat-label">В избранном</span>
          </div>
        </div>
      </div>
    </section>

    <section class="search-section">
      <div class="search-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 Поиск по названию или автору..."
          class="search-input"
        />
        <div class="search-hint">
          Начни вводить название или имя автора
        </div>
      </div>

      <div v-if="bookStore.error" class="error-message">
        ⚠️ {{ bookStore.error }}
      </div>

      <div v-if="filteredBooks.length > 0" class="books-grid">
        <BookCard
          v-for="book in filteredBooks"
          :key="book.id"
          :book="book"
        />
      </div>
      <div v-else class="no-results">
        <p>📭 Книги не найдены</p>
        <p class="secondary">Попробуй другой поисковый запрос</p>
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
  margin-bottom: 4rem;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: -1px;
}

.hero p {
  font-size: 1.3rem;
  opacity: 0.95;
  margin-bottom: 2.5rem;
}

.hero-stats {
  display: flex;
  gap: 3rem;
  justify-content: center;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.95rem;
  opacity: 0.9;
}

.search-section {
  margin-bottom: 3rem;
}

.search-wrapper {
  position: relative;
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 1.2rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1.05rem;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.search-hint {
  font-size: 0.85rem;
  color: #a0aec0;
  margin-top: 0.5rem;
  margin-left: 0.25rem;
}

.error-message {
  background: linear-gradient(135deg, #fed7d7 0%, #fbb6ce 100%);
  color: #742a2a;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-left: 4px solid #fc8181;
  font-weight: 500;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2.5rem;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 12px;
  border: 2px dashed #cbd5e0;
}

.no-results p {
  color: #4a5568;
  font-size: 1.2rem;
  margin: 0;
  font-weight: 600;
}

.no-results p.secondary {
  color: #a0aec0;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  font-weight: 400;
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }

  .hero {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .hero-stats {
    gap: 1.5rem;
  }

  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }
}
</style>

  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-recommend:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-reset {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-reset:hover {
  background: #667eea;
  color: white;
}

.search-section {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.results-section {
  margin-bottom: 2rem;
}

.results-section h2 {
  margin-bottom: 2rem;
  color: #333;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .button-group {
    flex-direction: column;
  }
}
