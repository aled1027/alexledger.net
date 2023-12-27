import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: {
    smartypants: false,
  },
  build: {
    format: "file",
  },
  site: "https://alexledger.net",
  integrations: [
    sitemap({
      // filter: (page) => page !== 'https://stargazers.club/secret-vip-lounge/',
    }),
    mdx(),
  ],
});
