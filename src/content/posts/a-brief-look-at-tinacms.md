---
title: A Brief Look at TinaCMS
date: 2024-01-16
tags: [websites, writing, obsidian]
---

## Introduction

One of my 2024 goals is to write more, both publicly and privately, and to assist others in publishing (e.g., at [catnesh.net](https://catnesh.net)). As such, I've been exploring more ways of writing, publishing, and tying it all together.

Earlier this year, I personally tried writing with [iA Writer](https://ia.net/writer) and [Scrivener](https://www.literatureandlatte.com/scrivener/overview), but I ended up rejecting both and I'm back to writing in VS Code. Scrivener I rejected because it didn't naturally output Markdown, and iA Writer I rejected because I had trouble purchasing it - it seemed like the only way to buy it was through the Mac store on my laptop, which I always have trouble using, and it wasn't good enough to justify jumping through hoops.

Both iA Writer and Scrivener would have been have useful for my own personal writing, but they aren't CMSs, helping me help others write and publish.

At my previous job at Playground Labs we used Django's CMS Wagtail, which I really didn't love. Its integration into Django was nice, because we could have direct foreign keys, but, otherwise, it was clunky and just not that fun to use. We also tried out Strapi for an experiment and that wasn't bad. I'd try out Strapi again in the future but I'm not sure I really understand its niche.

I've also tried Obsidian as a CMS in the past, but I didn't like how some of the Obsidian-specific syntax and plugins muddied the markdown files, and I didn't want to write a custom processor.[^1]

## Today I Tried TinaCMS

Today I tried [TinaCMS](https://tina.io/) with [Astro](https://astro.build/) (which this website is written in!). I made a little demo [repo](https://github.com/aled1027/tina-astro-demo) super fast following Astro's [documentation](https://docs.astro.build/en/guides/cms/tina-cms/). I really liked it! I like the git-based workflow approach where files are stored in git.

I don't totally understand how a non-technical, non-git user would use TinaCMS, but it looks like Smashing Magazine has some approach that they outline [here](https://www.smashingmagazine.com/2023/09/smashing-magazine-tinacms-manage-editorial-workflow/). Maybe it's more obvious with the cloud version.

I'm strongly considering trying out TinaCMS for this website because it looks easy to rip out and it looks like it'd make it easier for me to write more, which as I said at the top is the goal here.

A few additional resources on TinaCMS:

- Tina home page: https://tina.io
- Has a cloud offering and self-hosted offering
  - Decent free hosted pricing tier - https://tina.io/pricing/
- Tina CMS YouTube channel: https://www.youtube.com/@TinaCMS
- Astro documentation: https://docs.astro.build/en/getting-started/
- Smashing magazine: https://www.smashingmagazine.com/2023/09/smashing-magazine-tinacms-manage-editorial-workflow/

## Update After Adding to alexledger.net

Everything basically worked out of the box except datetime fields, which were put into the markdown files as strings, like so

```yaml
date: "2024-01-17T08:00:00.000Z"
```

And my config.ts for the collection had:

```javascript
export const collections = {
  posts: defineCollection({
    schema: z.object({
      title: z.string(),
      date: z.date(),
      tags: z.array(z.string()).default([]),
    }),
  }),
  ...
};

```

When the date would be processed, astro wouldn't be able to convert the date in a string to a date. This was the error:

```text
posts → notes-2024-01-17.md.md frontmatter does not match collection schema.
date: Expected type "date", received "string"
```

A solution after some research was to coerce the date in zod:

```javascript
export const collections = {
  posts: defineCollection({
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
    }),
  }),
  ...
};
```

Zod docs: https://zod.dev/?id=you-can-use-pipe-to-fix-common-issues-with-zcoerce. A better solution looks like it'd use pipe instead of coerce, but I'm happy that I got this to work with relative ease.

[^1]: If you haven't used Obsidian, it has a cool note linking feature, but it references notes regardless of file path with `[[Name of Note]]` syntax, which isn't supported by most markdown processors.
