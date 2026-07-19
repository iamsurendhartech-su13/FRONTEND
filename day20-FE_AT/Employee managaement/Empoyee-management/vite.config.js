import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3001,       // Fixed port for Selenium automation (config.properties: baseUrl=http://localhost:3001)
    strictPort: true, // Fail if port 3001 is already in use (rather than silently using another port)
  }
})
