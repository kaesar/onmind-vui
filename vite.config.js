import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    minify: 'terser',
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'CuiVue',
      formats: ['es'],
      fileName: 'vui'
    },
    rollupOptions: {
      external: ['vue', 'primevue', '@primevue/themes'],
      output: {
        globals: {
          vue: 'Vue',
          primevue: 'PrimeVue'
        },
        assetFileNames: 'vui.[ext]'
      }
    }
  }
})
