<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useProfileStore } from "../stores/movie";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isLogin = ref(true);

const auth = useAuthStore();
const router = useRouter();
const profileStore = useProfileStore();

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await auth.login(email.value, password.value);
      await profileStore.getProfile();
    } else {
      if (password.value !== confirmPassword.value) {
        auth.error = "Пароли не совпадают";
        return;
      }
      await auth.register(email.value, password.value);
      // После регистрации автоматически логинимся
      await auth.login(email.value, password.value);
    }
    router.push("/profile");
  } catch (err) {
    console.error(err);
  }
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
  auth.error = "";
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>{{ isLogin ? "Вход" : "Регистрация" }}</h1>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Минимум 8 символов"
            :minlength="8"
            required
          />
        </div>

        <div v-if="!isLogin" class="form-group">
          <label for="confirmPassword">Повторите пароль</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            required
          />
        </div>

        <div v-if="auth.error" class="error-message">
          {{ auth.error }}
        </div>

        <button type="submit" :disabled="auth.isLoading" class="btn-submit">
          {{ auth.isLoading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться" }}
        </button>
      </form>

      <div class="toggle-mode">
        <p>
          {{ isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?" }}
          <button @click="toggleMode" class="link-button">
            {{ isLogin ? "Зарегистрироваться" : "Войти" }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.auth-card h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-mode {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.link-button {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 500;
  padding: 0;
}

.link-button:hover {
  color: #764ba2;
}
</style>
