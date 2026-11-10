import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages (Organisation beauty1010): https://beauty1010.github.io/
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: { target: 'es2019', cssCodeSplit: false, assetsInlineLimit: 0 },
});
