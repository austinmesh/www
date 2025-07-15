// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import webmanifest from 'astro-webmanifest';

// https://astro.build/config
export default defineConfig({
  site: 'https://austinmesh.org',
  integrations: [
    icon(),
    webmanifest({
      name: 'Austin Mesh',
      icon: 'src/images/android-chrome-512x512.png',
      short_name: 'Austin Mesh',
      description: 'Austin Mesh is a community of mesh networking enthusiasts in Austin, Texas. We build and maintain a free, open-source, decentralized mesh network for public and private communication.',
      start_url: '/',
      theme_color: '#67EA94',
      background_color: '#222222',
      display: 'browser',
    }),
  ],
  vite: {
    server:{
      allowedHosts: ['localhost', '95d09d8539b0.ngrok.app'],
    }
  },
});
