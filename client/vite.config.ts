import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { config } from 'dotenv'
config()

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.APP_PORT) || 80
  }
})
