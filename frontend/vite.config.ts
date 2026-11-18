import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Konfigurasi Vite: plugin React untuk JSX dan plugin Tailwind untuk CSS
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
