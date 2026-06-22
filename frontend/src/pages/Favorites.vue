<script setup lang="ts">
import { onMounted } from "vue";
import { useBookStore } from "../stores/book";
import BookCard from "../components/BookCard.vue";

const bookStore = useBookStore();

onMounted(() => {
  bookStore.getLikedBooks();
});
</script>

<template>
  <div class="favorites-container">
    <h1>❤️ Избранные книги</h1>

    <div v-if="bookStore.likedBooks.length > 0" class="books-grid">
      <BookCard
        v-for="book in bookStore.likedBooks"
        :key="book.id"
        :book="book"
      />
    </div>
    <div v-else class="no-favorites">
      <p>У вас еще нет избранных книг</p>
      <router-link to="/" class="link">Найти книги</router-link>
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
  margin-bottom: 2rem;
  color: #2d3748;
  font-size: 2rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2.5rem;
  margin-top: 2rem;
}

.no-favorites {
  text-align: center;
  padding: 3rem 2rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.no-favorites p {
  color: #999;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
}

.link:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}
</style>
