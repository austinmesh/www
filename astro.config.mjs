// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import webmanifest from 'astro-webmanifest';

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon(),
    webmanifest({
      name: 'Austin Mesh',
      icon: 'src/images/android-chrome-512x512.png',
      short_name: 'Austin Mesh',
      description: 'Here is your app description',
      start_url: '/',
      theme_color: '#67EA94',
      background_color: '#222222',
      display: 'standalone',
    }),
  ],
  vite: {
    server:{
      allowedHosts: ['localhost', '95d09d8539b0.ngrok.app'],
    }
  },
});
