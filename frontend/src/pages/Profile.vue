<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useProfileStore } from "../stores/book";

const profileStore = useProfileStore();
const isEditing = ref(false);
const editData = ref({
  name: "",
  favorite_genres: "",
  about_me: "",
});

onMounted(() => {
  profileStore.getProfile();
});

const startEdit = () => {
  if (profileStore.profile) {
    editData.value = {
      name: profileStore.profile.name || "",
      favorite_genres: profileStore.profile.favorite_genres || "",
      about_me: profileStore.profile.about_me || "",
    };
  }
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  editData.value = {
    name: "",
    favorite_genres: "",
    about_me: "",
  };
};

const saveEdit = async () => {
  try {
    await profileStore.updateProfile(editData.value);
    isEditing.value = false;
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1>👤 Мой профиль</h1>

      <div v-if="profileStore.isLoading" class="loading">
        Загрузка профиля...
      </div>

      <div v-else-if="profileStore.profile && !isEditing" class="profile-view">
        <div class="profile-field">
          <label>Имя:</label>
          <p>{{ profileStore.profile.name || "Не указано" }}</p>
        </div>

        <div class="profile-field">
          <label>Любимые жанры:</label>
          <p>{{ profileStore.profile.favorite_genres || "Не указаны" }}</p>
        </div>

        <div class="profile-field">
          <label>О себе:</label>
          <p>{{ profileStore.profile.about_me || "Не указано" }}</p>
        </div>

        <div class="profile-field">
          <label>Создан:</label>
          <p>{{ new Date(profileStore.profile.created_at).toLocaleDateString('ru-RU') }}</p>
        </div>

        <button @click="startEdit" class="btn-edit">Редактировать профиль</button>
      </div>

      <div v-else-if="isEditing" class="profile-edit">
        <div class="form-group">
          <label for="name">Имя</label>
          <input
            id="name"
            v-model="editData.name"
            type="text"
            maxlength="80"
            placeholder="Ваше имя"
          />
        </div>

        <div class="form-group">
          <label for="genres">Любимые жанры</label>
          <input
            id="genres"
            v-model="editData.favorite_genres"
            type="text"
            maxlength="200"
            placeholder="Например: Фантастика, Детектив"
          />
        </div>

        <div class="form-group">
          <label for="about">О себе</label>
          <textarea
            id="about"
            v-model="editData.about_me"
            maxlength="300"
            rows="4"
            placeholder="Расскажите о себе"
          ></textarea>
        </div>

        <div v-if="profileStore.error" class="error-message">
          {{ profileStore.error }}
        </div>

        <div class="button-group">
          <button @click="saveEdit" class="btn-save">Сохранить</button>
          <button @click="cancelEdit" class="btn-cancel">Отменить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
}

.profile-card {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.profile-card h1 {
  margin-bottom: 2rem;
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
}

.loading {
  text-align: center;
  color: #a0aec0;
  padding: 3rem 2rem;
  font-size: 1.1rem;
}

.profile-view {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.profile-field {
  display: flex;
  flex-direction: column;
}

.profile-field label {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.6rem;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-field p {
  color: #4a5568;
  padding: 1rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 8px;
  border-left: 3px solid #667eea;
  font-weight: 500;
  line-height: 1.6;
}

.profile-edit {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.6rem;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.error-message {
  background: linear-gradient(135deg, #fed7d7 0%, #fbb6ce 100%);
  color: #742a2a;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #fc8181;
  font-weight: 500;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-edit,
.btn-save,
.btn-cancel {
  padding: 0.9rem 1.8rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-edit,
.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex: 1;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.btn-edit:hover,
.btn-save:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.btn-cancel {
  background: #f7fafc;
  color: #667eea;
  border: 2px solid #cbd5e0;
  flex: 1;
}

.btn-cancel:hover {
  background: #edf2f7;
  border-color: #667eea;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-card {
    padding: 1.5rem;
  }

  .profile-card h1 {
    font-size: 1.5rem;
  }

  .button-group {
    flex-direction: column;
  }
}
</style>
