import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { config } from 'dotenv'
config()

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: Number(process.env.APP_PORT) || 81
  }
})
