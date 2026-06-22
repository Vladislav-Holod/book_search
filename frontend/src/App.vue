<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import Navbar from "./components/Navbar.vue";

const auth = useAuthStore();

onMounted(() => {
  auth.initProfile();
});
</script>

<template>
  <div id="app">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f5f5;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

button {
  font-family: inherit;
}

input,
textarea,
select {
  font-family: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

router-link {
  color: inherit;
  text-decoration: none;
}
</style>