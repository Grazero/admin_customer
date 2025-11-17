import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import moment from 'moment';
import { fileURLToPath, URL } from 'node:url'
// https://vite.dev/config/

export default defineConfig({
  base: '/admin_customer/',
  plugins: [vue(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
  },
  build:{
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  
});
