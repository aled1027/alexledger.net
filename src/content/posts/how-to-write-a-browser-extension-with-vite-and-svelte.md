---
title: "How to Write a Browser Extension with Vite and Svelte"
draft: false
date: 2024-08-08T08:00:00.000Z
includeToc: true
tags:
  - svelte
  - vite
  - browser-extension
---

For a project - I'll do a write-up soon - I needed to write a browser extension. I wanted to use Svelte because I've been loving svelte lately. This post goes over how some basics of browser extensions and how to write a basic extension with Svelte and Vite.

## The Basics

This is my basic understanding of a browser extension.

There are three main parts:

| What               | Description                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The content script | Code that gets injected into web pages as you visit them and can make modifications                                                                    |
| The service worker | A thread that runs in the background, serving as a connecting bus between the other components, as well as servicing offline work, caching, and so on. |
| The popup          | The code that runs when you "open" a chrome extension - the little popup.                                                                              |

## A Svelte & Vite Browser Extension

My project structure looked like the following:

```
.
├── index.html
├── vite.config.js
├── svelte.config.js
├── public
│   ├── manifest.json
│   ├── content-script.js
│   └── service-worker.js
|   └── images
|   └── styles
└── src
    ├── App.svelte
    ├── index.ts
    └── ...
```

I didn't use sveltekit because I wanted to keep things simple and the extension needs to be statically built.

## The Files

### index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>inContext</title>
    <link rel="icon" type="image/svg+xml" href="/images/logo.svg" />
    <link rel="stylesheet" href="/styles/styles.css" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/index.ts"></script>
  </body>
</html>
```

### vite.config.js

```js
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  plugins: [typescript(), svelte()],
});
```

### svelte.config.js

```js
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
};
```

### public/manifest.json

There's plenty of information on writing a manifest and the documentation is good, so I'm not going to cover it.

### public/content-script.js

```js
// Write javascript that you want to run in the page
// Like this to change the body to be red
document.body.style.backgroundColor = "red";
```

### public/service-worker.js

```js
// Write javascript that you want to run in the background
// For me, this was communications between the content script and the popup
// so I had a message listener.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "ACTION1") {
    // do something
  } else if (message.action === "ACTION2") {
    // do something else
    (async () => {
      // do something async
      sendResponse({ data: "some data" });
    })();
  }
  return true; // say keep the channel open for sendResponse
});
```

### src/index.ts and src/App.svelte

These files weren't any different from a typical svelte project.

#### src/index.ts:

```js
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
```

#### src/App.svelte:

```svelte
<script lang="ts">
</script>

<h1> Hello world!</h1>
<style>

h1 {
  color: rgb(18, 18, 18);
}

```
