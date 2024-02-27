<script>
  let progress = 25;
</script>

<h1>Frontend Coding Challenge: Progress Indicator</h1>
<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin="0"
  aria-valuemax="100"
  class="progress"
  style="--progress: {progress}%"
>
  {progress}%
</div>
<input type="range" min="0" max="100" bind:value={progress} />

<p>
  This was my attempt (and semi-failure as I didn't know how to get started with
  searching codepen) at the progress indicator frontend coding challenge from
  <a href="https://piccalil.li/blog/challenge-009-progress-indicator/"
    >piccalil</a
  >.
</p>
<p>
  My approach was adapted from the CSS Circular Progress codepen from Mattia
  Astorino
  <a href="https://codepen.io/equinusocio/pen/OJMBpdK">link</a>. Instead of
  vanilla js, I used svelte for this. Big thanks to Mattia for the instructional
  codepen.
</p>

<style>
  .progress {
    /* the hue of the color to show progress */
    --hue: 220;

    /* the size of the hole in the indicator. A value of zero is a fully filled circled and a value of 100%
    means the hole takes the whole space, and there's no colored indicator visible.*/
    --holesize: 65%;

    /* the background of the indicator, shown when when still in progress */
    --track-bg: var(--stone-2);

    /* The amount of progress to render. Update this variable to update the rendering */
    /* --progress: 55%; */

    /* color: white; */
    /* background: blue; */
    block-size: 50vmin;
    inline-size: 50vmin;
    max-block-size: 400px;
    max-inline-size: 400px;
    font-size: max(10vmin, 1.4rem);

    /* center the div */
    margin-inline: auto;

    /* manage the content */
    display: flex;
    justify-content: center;
    align-items: center;

    /* make position relative for the circle */
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border-radius: 50%;
      /* z-index: -1; */

      /* Set the background to be a colored circle with a nice gradient based on the progress */
      background: conic-gradient(
        hsl(var(--hue) 100% 70%),
        hsl(var(--hue) 100% 40%),
        hsl(var(--hue) 100% 70%) var(--progress, 0%),
        var(--track-bg) var(--progress, 0%) 100%
      );

      /* Then mask the background to only reveal the progress */
      mask-image: radial-gradient(
        transparent var(--holesize),
        black calc(var(--holesize) + 0.5px)
      );
    }
  }

  input {
    display: block;
    margin-inline: auto;
    margin-block: 2rem;
    width: 50vmin;
  }
</style>
