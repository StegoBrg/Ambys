import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      includeAssets: ['ambys.svg'],
      manifest: {
        name: 'Ambys',
        short_name: 'Ambys',
        description: 'Your personal health tracking app',
        theme_color: '#242424',
        background_color: '#242424',
        display: 'standalone',
        icons: [
          {
            src: '/ambys-192-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/ambys-512-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/ambys-512-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
