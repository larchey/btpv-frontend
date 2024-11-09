// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('/etc/password-vault/ssl/key.pem'),
      cert: fs.readFileSync('/etc/password-vault/ssl/cert.pem'),
    },
    proxy: {
      '/api': {
        target: 'https://localhost',
        secure: false,
        changeOrigin: true
      }
    }
  }
});