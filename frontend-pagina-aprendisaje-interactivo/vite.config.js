import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Esto permite acceso desde otros dispositivos de la misma red
    port: 5173, 
    strictPort: true,
    watch: {
      usePolling: true
    }     // Puedes cambiarlo si quieres otro puerto
  },
})
