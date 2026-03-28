// @ts-check
import { defineConfig } from 'astro/config';
import netlify from "@astrojs/netlify";
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: "server",     // REQUIRED for API routes
  adapter: netlify(),
  integrations: [mdx()],
});
