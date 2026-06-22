<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="recommend-container">
    <div v-if="!auth.isAuthenticated()" class="auth-required">
      <div class="auth-card">
        <h2>🔐 Требуется авторизация</h2>
        <p>Для доступа к персональным рекомендациям нужно войти в аккаунт</p>
        <router-link to="/auth" class="btn-auth">Войти или зарегистрироваться</router-link>
      </div>
    </div>

    <div v-else class="dev-section">
      <div class="dev-card">
        <div class="dev-header">
          <div class="robot-icon">🤖</div>
          <h1>AI Рекомендации</h1>
          <div class="badge-dev">В разработке</div>
        </div>

        <div class="dev-content">
          <p class="lead-text">
            Умная система рекомендаций книг на основе искусственного интеллекта
          </p>

          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📚</div>
              <h3>Анализ вкусов</h3>
              <p>Система будет анализировать ваши избранные книги и предпочтения</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🧠</div>
              <h3>ИИ на основе Gemini</h3>
              <p>Мощные рекомендации с использованием передовых нейросетей</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🎯</div>
              <h3>Персональные подборки</h3>
              <p>Каждая рекомендация будет уникальна для вашего профиля</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>Быстрый поиск</h3>
              <p>Найдите идеальную книгу в считанные секунды</p>
            </div>
          </div>

          <div class="coming-soon">
            <h3>Скоро появится!</h3>
            <p>Функция рекомендаций находится в активной разработке и будет доступна очень скоро.</p>
            <button @click="goHome" class="btn-home">Вернуться на главную</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recommend-container {
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.auth-required {
  max-width: 600px;
  margin: 4rem auto;
}

.auth-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.auth-card h2 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.auth-card p {
  color: #718096;
  margin-bottom: 2rem;
  font-size: 1.05rem;
}

.btn-auth {
  display: inline-block;
  padding: 0.9rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-auth:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.dev-section {
  max-width: 1200px;
  margin: 0 auto;
}

.dev-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dev-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
  position: relative;
}

.robot-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

.dev-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.badge-dev {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.dev-content {
  padding: 3rem 2rem;
}

.lead-text {
  font-size: 1.2rem;
  color: #4a5568;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 500;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: #f7fafc;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #e2e8f0;
  transition: all 0.3s;
}

.feature-card:hover {
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #2d3748;
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
}

.feature-card p {
  color: #718096;
  font-size: 0.95rem;
  line-height: 1.6;
}

.coming-soon {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  padding: 2.5rem;
  border-radius: 12px;
  text-align: center;
  border-left: 4px solid #667eea;
}

.coming-soon h3 {
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 0.8rem;
}

.coming-soon p {
  color: #4a5568;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.btn-home {
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-home:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .recommend-container {
    padding: 1rem;
  }

  .dev-header {
    padding: 2rem 1rem;
  }

  .dev-header h1 {
    font-size: 1.8rem;
  }

  .robot-icon {
    font-size: 3rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .dev-content {
    padding: 1.5rem 1rem;
  }
}
</style>
