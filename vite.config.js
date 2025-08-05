import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: 'localhost',
  },
  base: '/obs-overlay-01/',
  plugins: [react()],
})
