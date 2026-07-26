import { defineConfig } from "vite";
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [ solidPlugin(), libInjectCss() ],
    build: {
      minify: 'terser',
      lib: {
        entry: 'src/index.ts',
        formats: ["es"],
      },
      rollupOptions: {
        external: mode === "production" ? "" : /^solid-js/,
        output: {
          chunkFileNames: 'chunks/[name].[hash].js',
          assetFileNames: 'vui[extname]',
          entryFileNames: 'vui.js',
        },
      },
    },
  };
});
