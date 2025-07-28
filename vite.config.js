import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 3000,
    strictPort: true,
    host: true,
    allowedHosts: [
      'bayern-brandschutz-production.up.railway.app',
      '.railway.app',
      'localhost'
    ]
  },
  server: {
    host: true,
    port: 5173
  }
})