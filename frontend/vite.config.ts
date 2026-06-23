import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/user': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/profile': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/movie': {
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
