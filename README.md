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

## Adding a youtube video or iframe?

Use this structure:

```html
<div class="youtube-wrapper">
  <iframe
    width="100%"
    height="100%"
    src="https://www.youtube.com/embed/ncwV3cJinC8?si=CAY9FaDqG431jPYf"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen></iframe>
</div>
```

## TODOs:

- update tag links in landing page top text
- Update tables (see http://localhost:4321/posts/electric_vehicles )
- Address TODOs
- Check all posts and pages and make sure they look good

## Notes for rewrite

- Inspo: https://pudding.cool/
- Bento boxes
-
