import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vitejs.dev/config/

import 'dotenv/config'
const apiURL = process.env.API_URL
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `${apiURL}/api`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
})
