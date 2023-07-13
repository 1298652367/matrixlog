import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://172.21.240.26:9999',
        changeOrigin: true,
        rewrite: (path: string) => {
          return path.replace(/^\/api/, '')
        }
      }
    }
  }
})
