import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins:[vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('-')
      }
    },
    customElement: true
  })],
  build: {
    minify: 'terser',
    lib: {
      entry: resolve(__dirname, 'src/main.ce.js'),
      formats: ['es']
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  }
})
