import { defineConfig, passthroughImageService } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";

import lit from "@astrojs/lit";

// https://astro.build/config
export default defineConfig({
  image: {
    // After updating astro, I started getting the error:
    // "title: 'Could not find Sharp.'". According to the docs,
    // this disables Sharp, the image processor.
    service: passthroughImageService(),
  },
  markdown: {
    // https://docs.astro.build/en/guides/markdown-content/
    shikiConfig: {
      // https://shiki.style/themes
      theme: "solarized-dark",
      wrap: true,
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
