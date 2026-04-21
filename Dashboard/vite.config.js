import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr' //for svg image use as react componnet
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' //tailwind



// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), tailwindcss(), svgr()
  ],
  

})
