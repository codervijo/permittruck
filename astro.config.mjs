// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://permittruck.xyz',
  integrations: [sitemap()],
  output: 'static',
});
