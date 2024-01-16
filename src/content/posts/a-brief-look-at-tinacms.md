---
title: A Brief Look at TinaCMS
date: 2024-01-16
tags: [websites, writing]
---

## Introduction

One of my 2024 goals is to write more, both publicly and privately, and to assist others in publishing (e.g., at [catnesh.net](https://catnesh.net)). As such, I've been exploring more ways of writing, publishing, and tying it all together.

Earlier this year, I personally tried writing with [iA Writer](https://ia.net/writer) and [Scrivener](https://www.literatureandlatte.com/scrivener/overview), but I ended up rejecting both and I'm back to writing in VS Code. Scrivener I rejected because it didn't naturally output Markdown, and iA Writer I rejected because I had trouble purchasing it - it seemed like the only way to buy it was through the Mac store on my laptop, which I always have trouble using, and it wasn't good enough to justify jumping through hoops.

Both iA Writer and Scrivener would have been have useful for my own personal writing, but they aren't CMSs, helping me help others write and publish.

At my previous job at Playground Labs we used Django's CMS Wagtail, which I really didn't love. Its integration into Django was nice, because we could have direct foreign keys, but, otherwise, it was clunky and just not that fun to use. We also tried out Strapi for an experiment and that wasn't bad. I'd try out Strapi again in the future but I'm not sure I really understand its niche.

I've also tried Obsidian as a CMS in the past, but I didn't like how some of the Obsidian-specific syntax and plugins muddied the markdown files, and I didn't want to write a custom processor.[^1]

## Today I Tried TinaCMS

Today I tried [TinaCMS](https://tina.io/) with [Astro](https://astro.build/) (which this website is written in!). I made a little demo [repo](https://github.com/aled1027/tina-astro-demo) super fast following Astro's [documentation](https://docs.astro.build/en/getting-started/). I really liked it! I like the git-based workflow approach where files are stored in git.

I don't totally understand how a non-technical, non-git user would use TinaCMS, but it looks like Smashing Magazine has some approach that they outline [here](https://www.smashingmagazine.com/2023/09/smashing-magazine-tinacms-manage-editorial-workflow/). Maybe it's more obvious with the cloud version.

I'm strongly considering trying out TinaCMS for this website because it looks easy to rip out and it looks like it'd make it easier for me to write more, which as I said at the top is the goal here.

A few additional resources on TinaCMS:

- Tina home page: https://tina.io
- Has a cloud offering and self-hosted offering
  - Decent free hosted pricing tier - https://tina.io/pricing/
- Tina CMS YouTube channel: https://www.youtube.com/@TinaCMS
- Astro documentation: https://docs.astro.build/en/getting-started/
- Smashing magazine: https://www.smashingmagazine.com/2023/09/smashing-magazine-tinacms-manage-editorial-workflow/

[^1]: If you haven't used Obsidian, it has a cool note linking feature, but it references notes regardless of file path with `[[Name of Note]]` syntax, which isn't supported by most markdown processors.
