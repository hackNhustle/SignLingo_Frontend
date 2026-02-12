import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  assetsInclude: ['**/*.glb'],
  server: {
    port: 3000,
    allowedHosts: ["7236-2401-4900-ab8f-ffc3-b141-2639-aa95-4ebf.ngrok-free.app"],
    proxy: {
      '/api/v1': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        secure: false,
      },
      '/model-api': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/model-api/, ''),
      },
      '/asl-api': {
        target: 'http://localhost:8005',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/asl-api/, ''),
      }
    }
  }
})
