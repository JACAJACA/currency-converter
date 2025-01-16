import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import globals from 'globals';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    include: ['src/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx}'],
    setupFiles: ['./src/setupTests.js'],
    deps: {
      inline: ['@testing-library/react', '@testing-library/jest-dom', '@testing-library/user-event'],
    },
  }
})
