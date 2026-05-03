import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  server: {
    proxy: {
      '/api':            'http://localhost:8080',
      '/regForm':        'http://localhost:8080',
      '/loginForm':      'http://localhost:8080',
      '/empLoginForm':   'http://localhost:8080',
      '/adminLoginForm': 'http://localhost:8080',
    }
  }
})