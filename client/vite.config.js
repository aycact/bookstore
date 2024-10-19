import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import browserslist from 'browserslist';
import {browserslistToTargets} from 'lightningcss';
// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  css: {
    lightningcss: {
      targets: browserslistToTargets(browserslist('last 2 versions'))
    }
  },
  build: {
    cssMinify: 'lightningcss',
    minify: 'esbuild',
    sourcemap: 'hidden',
    manifest: true,
  }
})
