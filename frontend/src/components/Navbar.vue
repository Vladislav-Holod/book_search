<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useRouter, useRoute } from "vue-router";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const handleLogout = () => {
  auth.logout();
  router.push("/auth");
};

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-logo">
        📚 BookSearch
      </router-link>

      <div class="nav-links">
        <router-link
          to="/"
          :class="{ active: isActive('/') }"
          class="nav-link"
        >
          Главная
        </router-link>

        <router-link
          v-if="auth.isAuthenticated()"
          to="/favorites"
          :class="{ active: isActive('/favorites') }"
          class="nav-link"
        >
          ❤️ Избранное
        </router-link>

        <router-link
          to="/recommend"
          :class="{ active: isActive('/recommend') }"
          class="nav-link"
        >
          🤖 Рекомендации
        </router-link>

        <router-link
          v-if="auth.isAuthenticated()"
          to="/profile"
          :class="{ active: isActive('/profile') }"
          class="nav-link"
        >
          👤 Профиль
        </router-link>

        <button
          v-if="auth.isAuthenticated()"
          @click="handleLogout"
          class="nav-link logout"
        >
          Выход
        </button>

        <router-link
          v-else
          to="/auth"
          :class="{ active: isActive('/auth') }"
          class="nav-link btn-auth"
        >
          Вход / Регистрация
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.2rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 1.6rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: transform 0.3s, filter 0.3s;
  letter-spacing: -0.5px;
}

.nav-logo:hover {
  transform: scale(1.05);
  filter: brightness(1.2);
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.nav-link {
  color: #4a5568;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem 0;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #667eea;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link.active {
  color: #667eea;
}

.nav-link.active::after {
  width: 100%;
}

.btn-auth {
  padding: 0.6rem 1.4rem !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  border-radius: 6px !important;
  border: none !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s;
}

.btn-auth:hover {
  opacity: 1 !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-auth::after {
  display: none !important;
}

.logout {
  padding: 0.6rem 1.4rem !important;
  background: #fee8ec !important;
  color: #c33 !important;
  border-radius: 6px !important;
  font-weight: 600 !important;
  transition: all 0.3s;
}

.logout:hover {
  background: #fdd4da !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(204, 51, 51, 0.2);
}

.logout::after {
  display: none !important;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: row;
    gap: 1rem;
    padding: 1rem;
  }

  .nav-links {
    gap: 0.8rem;
  }

  .nav-link {
    font-size: 0.85rem;
    padding: 0.3rem 0;
  }

  .btn-auth,
  .logout {
    padding: 0.5rem 1rem !important;
    font-size: 0.85rem;
  }
}
</style>
