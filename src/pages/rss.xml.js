import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

// Docs: https://docs.astro.build/en/guides/rss/

const postsCollection = await getCollection("posts");

export function GET(context) {
  return rss({
    title: "Alex Ledger's Website",
    description: "Alex Ledger's Website",
    site: "https://alexledger.net",
    items: postsCollection.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      //   description: "",
      //   customData: post.data.customData,
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}