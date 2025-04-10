import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { config } from 'dotenv'
config()

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.APP_PORT) || 80,
    fs: {
      allow: [
        path.resolve(__dirname, '..'),
        path.resolve(__dirname, '.'),
	      path.resolve(__dirname, 'client')
      ],
    },
    allowedHosts: [
      '*.tank-food.io.vn',
      '*.tank-travel.io.vn'
    ]
  }
})