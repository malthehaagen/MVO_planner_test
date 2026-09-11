import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/*
 * Relative asset paths, so the built site works at a domain root and under a
 * project path such as /MVO_planner_test/ alike.
 * Tests use vitest.config.ts.
 */
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
  },
});
