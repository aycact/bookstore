import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'
// https://vitejs.dev/config/
export default defineConfig({
  css: {
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%')),
    }
  },
  build: {
    cssMinify: 'lightningcss'
  },
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
})
