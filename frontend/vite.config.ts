import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/users': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/profile': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/books': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/actions': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
