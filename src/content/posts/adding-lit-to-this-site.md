---
title: "Adding Lit to this Site"
draft: false
date: 2024-03-08T08:00:00.000Z
tags:
  - frontend
  - javascript
  - lit
  - web-components
  - astro
  - html
---

I've been wanting a little info icon that when clicked would render a dialog with more information.
<info-button>something like like this :)</info-button>

Yesterday, I implemented a version of this an astro component, but, at least as far as I'm aware, it's not possible to use that in a `.md` files in an astro project.
So today, I ported the functionality into a lit web component.

I first tried following the [Astro tutorial for integrating Lit](https://docs.astro.build/en/guides/integrations-guide/lit/), but (again afaict) that was doing server-side rendering and I didn't how to get the component easily imported into `.md` files. I got a few hacks to work but it was violating the intent of the code I was writing.

I decided to simply write a `.js` file, and import that as a script into my template. Now any `.md` or `.mdx`, or any HTML for that matter, can use the info button component.

Here it is in use: <info-button>You're seeing this after you click on the info button</info-button>

And here's the _markdown_ for that line:

```md
Here it is in use: <info-button>You're seeing this after you click on the info button</info-button>
```

---

Postscript 1: I think it's not quite implemented correctly because not all HTML is being correctly rendered inside the dialog, and there are some inconsistencies between usage in `.md` files and `.mdx` files.
