// @ts-check
import { defineConfig } from 'astro/config';
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "server",     // REQUIRED for API routes
  adapter: netlify(),
});
