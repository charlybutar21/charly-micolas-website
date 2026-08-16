import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
  css: {
    modules: {
      classNameStrategy: 'non-scoped',
    },
  },
});
