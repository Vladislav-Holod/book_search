<script setup lang="ts">
import { computed } from "vue";
import { useBookStore, type Book } from "../stores/book";

const props = defineProps<{
  book: Book;
}>();

const bookStore = useBookStore();
const isLiked = computed(() => bookStore.isLiked(props.book.id || 0));

const handleLike = async () => {
  try {
    if (props.book.id) {
      await bookStore.likeBook(props.book.id);
      await bookStore.getLikedBooks();
    }
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <div class="book-card">
    <div class="book-image">
      <img
        v-if="book.image_url"
        :src="book.image_url"
        :alt="book.title"
        onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'"
      />
      <div v-else class="no-image">📖</div>
    </div>

    <div class="book-content">
      <h3 class="book-title">{{ book.title }}</h3>

      <p v-if="book.author" class="book-author">{{ book.author }}</p>

      <p v-if="book.genres" class="book-genres">{{ book.genres }}</p>

      <p v-if="book.description" class="book-description">
        {{ book.description }}
      </p>

      <button
        v-if="book.id"
        @click="handleLike"
        :class="{ liked: isLiked }"
        class="btn-like"
      >
        {{ isLiked ? "❤️ В избранном" : "🤍 Добавить в избранное" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.book-card {
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

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.book-image {
  width: 100%;
  height: 240px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.book-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.book-card:hover .book-image::after {
  opacity: 1;
}

.book-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.book-card:hover .book-image img {
  transform: scale(1.05);
}

.no-image {
  font-size: 4rem;
}

.book-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  margin: 0 0 0.8rem 0;
  color: #2d3748;
  font-size: 1.1rem;
  line-height: 1.4;
  min-height: 2.4rem;
  font-weight: 600;
}

.book-author {
  color: #667eea;
  font-size: 0.9rem;
  margin: 0.4rem 0;
  font-weight: 600;
}

.book-genres {
  color: #a0aec0;
  font-size: 0.8rem;
  margin: 0.6rem 0;
  padding: 0.4rem 0.8rem;
  background: #f7fafc;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.book-description {
  color: #718096;
  font-size: 0.85rem;
  margin: 0.8rem 0;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.6;
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
}

.btn-like:hover {
  border-color: #667eea;
  background: #f7fafc;
  transform: translateY(-2px);
}

.btn-like.liked {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-like.liked:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}
</style>
