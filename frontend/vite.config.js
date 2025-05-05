import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://192.168.1.65:5220',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      "lib": path.resolve(__dirname, "src/lib")
    },
  },
  css: {
    postcss: '/postcss.config.js',
  },

})