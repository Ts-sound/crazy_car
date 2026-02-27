import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  root: resolve(__dirname, '../src'),
  test: {
    environment: 'jsdom',
    globals: true,
    include: [resolve(__dirname, '../tests/**/*.test.js')],
  },
  build: {
    outDir: resolve(__dirname, '../dist'),
    rollupOptions: {
      input: {
        main: resolve(__dirname, '../src/index.html'),
      },
    },
  },
  plugins: [viteSingleFile()],
});
