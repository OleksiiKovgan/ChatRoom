// file: client/vite.config.ts

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // IMPORTANT: We DO NOT set the 'root' option here,
  // because the default is the directory where this config file lives ('client/'),
  // which is correct for your project structure.

  plugins: [vue()],

  server: {
    port: 5173,
    // Proxy API and WebSocket requests to the backend server
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://localhost:8080',
        ws: true,
      },
    },
  },

  resolve: {
    alias: {
      // This alias helps resolve imports like '@/components/...'
      '@': path.resolve(__dirname, './src'),
    }
  }
})