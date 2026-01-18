# Alex Ledger

To view posts from before I updated alexledger.net: https://github.com/aled1027/alexledger.net/tree/c6257355cac26d7f3fa7214b7e5d6903b1da8eac/src/content/posts

## TODO:

## Checklist

- [ ] Add <title>
- [ ] Include meta description
- [ ] Update favicons
- [ ] Check sitemap.xml
- [ ] Check robots.txt
- [ ] Run lighthouse

## Quick reminders about this structure:

1. This repo uses CSS vars, not SCSS vars
2. utilities.scss should have most tailwind-style utilities that are needed, like:

- margins: mt-s, mx-s,
- padding:
- font-sizes: size-step-s
- font styles: bold, etc.

3. For client websites, just toss styles right into the page/component because we don't need to worry too much about re-use and organization
4. If you want anything like a grid or flex, and it's weird at all, just go ahead and make it specific and in the file.
5. Videos & images

- Put images and videos in src/lib/assets. Vite should handle them from there.
- Then use enhanced:img and basic video

6. Icons: Use @lucide/svelte. See below.
7. Components are built out in src/lib/components

## Icons

Using Lucide

```
<script>
  import { Camera } from '@lucide/svelte';
</script>

<Camera color="#ff3e98" />
```

---

https://youtu.be/JBkkqDKoccU?t=2955

```
this.material.positionNode = Fn(()=>{
  let pos = positionLocal.toVar);
  let radius = -0.8;
  let center = vec3(0.,0., radius);
  let posSpherical = positionLocal. toVar();
  posSpherical = posSpherical.sub(center);
  posSpherical.yz = posSpherical.yz.normalize();

  let fastScale = smoothstep(0.,0.3, progress)
  let fastScaleBack = smoothstep(0.7,1, progress).oneMinus();

  posSpherical = posSpherical.mul(vec3(0.5,0.4,0.4))
  posSpherical = rotate(posSpherical, vec3(easeInOutQuad (progress) -mul (2*3. 1415), 0,0));
  let finalpos = mix(pos, posSpherical, fastScale-mul(fastScaleBack));
  return finalPos;
```
