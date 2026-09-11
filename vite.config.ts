import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/*
 * The dev entry lives in site/index.html so that the built site can be written
 * to the repository root, which is what GitHub Pages serves for this branch.
 * Asset names are stable (no content hash) so each build replaces the previous
 * files instead of leaving old ones behind in the repository.
 *
 * Tests use vitest.config.ts, which keeps the normal project root.
 */
export default defineConfig({
  plugins: [react()],
  root: 'site',
  base: './',
  build: {
    outDir: '..',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/app.[ext]',
      },
    },
  },
});
