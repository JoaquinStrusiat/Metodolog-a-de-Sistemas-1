import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'localhost',
      '.ngrok-free.app' // Permite cualquier subdominio de ngrok-free.app
    ]
  } 
})
