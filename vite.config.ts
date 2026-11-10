import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages: https://zwolfros-debug.github.io/beauty1010/
// Bei eigener Domain: base auf '/' setzen.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/beauty1010/',
  plugins: [react()],
  build: { target: 'es2019', cssCodeSplit: false, assetsInlineLimit: 0 },
});
