import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

// Docs: https://docs.astro.build/en/guides/rss/

const postsCollection = await getCollection("posts");
const posts = postsCollection.filter((p) => !p.data.draft);

/* eslint-disable no-unused-vars */
export function GET(context) {
  return rss({
    title: "Alex Ledger's Website",
    description: "Alex Ledger's Website",
    site: "https://alexledger.net",
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      content: sanitizeHtml(parser.render(post.body)),
      //   description: "",
      //   customData: post.data.customData,
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
/* eslint-enable no-unused-vars */
