import { defineConfig } from "astro/config";
// import pagefind from "astro-pagefind";
import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: {
    smartypants: false
  },
  build: {
    format: "file"
  },
  site: "https://alexledger.net",
  integrations: [
  // pagefind(),
  sitemap({
    // filter: (page) => page !== 'https://stargazers.club/secret-vip-lounge/',
  }), mdx()]
});