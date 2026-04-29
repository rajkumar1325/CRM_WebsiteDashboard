import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr' //for svg image use as react componnet
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' //tailwind



// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), tailwindcss(), svgr()
  ],

  // helps in local sharing
  server: {
    // solves CORS issues by proxying API requests to Cloudflare's API
    proxy: {
      '/cf-ai': {
        target: 'https://api.cloudflare.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cf-ai/, '/client/v4'),
      }
    },
    // allows access from the localtunnel domain
    host: true,
    allowedHosts: ['slick-guests-think.loca.lt'] 
  }

})
