---
title: "Cheatsheet for Sveltekit Files"
date: 2024-10-23T08:00:00.000Z
draft: false
includeToc: false
tags:
  - cheatsheet
  - javascript
  - svelte
  - sveltekit
  - websites
---

[Svelte 5 is live](https://svelte.dev/blog/svelte-5-is-alive)!

To celebrate, I thought I'd write up a cheatsheet for all the different types of routing files you can have in a [Sveltekit](https://kit,svelte) project because I think it's one the tricker conceptual parts when you're getting started writing more complex, full-stack applications with Sveltekit.

| File              | Description                                                                                                                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pages**         |                                                                                                                                                                                                                             |
| +page.svelte      | The page to be rendered.                                                                                                                                                                                                    |
| +page.ts          | Loads the "page data" for the page. Typically used for fetching data from an API. This will run either server-side or client-side depending on settings and how the page is navigated to.                                   |
| +page.server.ts   | This also loads page data, but it's always run server-side. This is commonly used for running logic that must be run server side for security reasons, like a secret API key is required or something else must be trusted. |
| **Layouts**       |                                                                                                                                                                                                                             |
| +layout.svelte    | The layout page, which wraps around the page.                                                                                                                                                                               |
| +layout.ts        | The layout data for the layout page, which is also propagated to child pages. You'll commonly see this used for the session and user objects, which can then be used in the page to inform rendering.                       |
| +layout.server.ts | Layout page data that must be run server-side. Not commonly used.                                                                                                                                                           |
| **Server/API**    |                                                                                                                                                                                                                             |
| +server.ts        | An API route that is run server-side and not associated with any particular page.                                                                                                                                           |
| **Hooks**         |                                                                                                                                                                                                                             |
| hooks.ts          | Middleware that wraps requests that are run on both client and server requests.                                                                                                                                             |
| hooks.server.ts   | Middleware that only wraps server requests. Commonly used for checking user auth server-side and injecting the user object into locals, a place for custom data on the request.                                             |
| hooks.client.ts   | Hooks that are only run client-side. Not commonly used.                                                                                                                                                                     |
