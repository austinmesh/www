import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.austinmesh.org',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.includes('/search/') }),
  ],
});
