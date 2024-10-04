import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";

import lit from "@astrojs/lit";

// https://astro.build/config
export default defineConfig({
  markdown: {
    // https://docs.astro.build/en/guides/markdown-content/
    smartypants: false,
    shikiConfig: {
      // https://shiki.style/themes
      theme: "solarized-dark",
      defaultColor: false,
      langs: [],
      wrap: true,
      transformers: [],
    },
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
    svelte(),
    lit(),
  ],
});
