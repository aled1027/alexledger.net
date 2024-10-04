# alexledger.net

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## SCSS

Styles were copied from https://github.com/kevin-powell/astro-sass-template-no-scoped-styles, and modified were from there.

They follow [CUBE](https://cube.fyi/).

## Svelte

If using a svelte component, remember to add `client:load` when invoking the component so that it appropriately runs client-side.

## TODO:

- Remove default.astro
- /posts page doesn't look centered on mobile
  - I think this could be related to overflow on the munich blog post
  - Hmm something is weird is happening with the sizing.
  - Coupled/complicated by view transitions
  - To repro:
    - Home -> Posts -> Munich Page -> Refresh Munich Page
- footer isn't centered on mobile
- update tag links in landing page top text
- I think move up Alex Ledger on mobile, so it's slightly higher.
- Convert projectcard to an astro component
- Address TODOs
- Check all posts and pages and make sure they look good
