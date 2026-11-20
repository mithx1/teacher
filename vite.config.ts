import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base + hash routing lets the static build work on GitHub Pages
// (https://mithx1.github.io/teacher/) or any other static host (ADR-013).
export default defineConfig({
  base: './',
  plugins: [react()],
});
