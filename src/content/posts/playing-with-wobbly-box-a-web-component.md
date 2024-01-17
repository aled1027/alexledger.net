---
title: "Playing with Wobbly Box, A Web Component"
date: 2024-01-17
tags: [websites, web-components, html, frontend]
---

[Dave Rupert](https://daverupert.com/) just posted about a web component he made called WobblyBox - post [here](https://daverupert.com/2024/01/wobblybox/).

Partially from influence from Dave, I've been trying to use to Web Components more in my websites, but I've had mixed results, largely due to loading issues that feel like user error somehow on my side, probably me misunderstanding something in the lifecycle. Most of my experience so far is with [Shoelace](https://shoelace.style/), where I've ended up slowly pulling Shoelace out after the prototype phase of projects.

So to expand my horizons I'm going to try out Dave's Wobbly Box!

Here we go:

1. I downloaded the js file and put it at /public/misc in my astro site.
2. I added `<script type="module" src="/misc/wobbly-box.js"></script>` to this file.
3. Add the code for the wobbly box: `<wobbly-box>Any content goes here</wobbly-box>`
4. See that it worked (look right below this) - the box is wobbly!
   - And it's slightly different on each load, which is neat

<script type="module" src="/misc/wobbly-box.js"></script>
<wobbly-box>
	Any content goes here
</wobbly-box>

^ The full code supporting that is this (copied from Dave's post):

```html
<script type="module" src="/misc/wobbly-box.js"></script>
<wobbly-box> Any content goes here </wobbly-box>
```
