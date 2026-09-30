import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/** Shared Vitest preset: jsdom + RTL matchers. */
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [new URL('./vitest.setup.mjs', import.meta.url).pathname],
    css: false,
    passWithNoTests: true,
  },
});
