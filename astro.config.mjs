// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [icon()],
  vite: {
    server:{
      allowedHosts: ['localhost', '95d09d8539b0.ngrok.app'],
    }
  },
});
