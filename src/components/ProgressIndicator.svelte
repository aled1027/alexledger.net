<script>
  import { writable, derived } from "svelte/store";

  // The color of the track, showed for the pending amount
  let trackBg = "#989ea9";

  // The color of the track of the completed amount
  let trackFg = "#1f1a38";

  // Background color of the circle while we're in a pending state
  let circleBgPendingColor = "#ffffff";

  // Background color of the circle while we're in a complete state
  let circleBgCompleteColor = "#76f7bf";

  // The size of the hole in the indicator. A value of zero is a fully filled circled and a value of 100%
  // means the hole takes the whole space, and there's no colored indicator visible.
  let holeSize = "65%";

  // Storage
  const progress = writable(25);
  const circleBg = derived(progress, ($progress) => {
    return $progress === 100 ? circleBgCompleteColor : circleBgPendingColor;
  });
</script>

<h1>Frontend Coding Challenge: Progress Indicator</h1>
<div
  role="progressbar"
  aria-valuenow={$progress}
  aria-valuemin="0"
  aria-valuemax="100"
  class="progress"
  style="
  --progress: {$progress}%;
  --track-fg: {trackFg};
  --circle-bg: {$circleBg};
  --track-bg: {trackBg};
  --holesize: {holeSize};
  --font-base: 'Space Mono', monospace;
  "
>
  <div class="progress-inner">
    {#if $progress < 100}
      {$progress}%
    {:else}
      <!-- TODO: if progress is 100 then show checkmark -->
      <div class="checkbox-wrapper">
        <sl-icon name="check-lg"></sl-icon>
      </div>
    {/if}
  </div>
</div>
<input type="range" min="0" max="100" bind:value={$progress} />

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
  vanilla JavaScript, I used svelte for this. Big thanks to Mattia for the
  instructional codepen.
</p>
<h3>Considering the questions that Piccalil asks:</h3>
<ul>
  <li>
    Q: What is the experience when JavaScript isn't enabled? A: I'm not sure.
    Need to check.
  </li>
  <li>
    Q: What technology is best suited for this component? A: This could be done
    with vanilla JavaScript, HTML and CSS, per Mattia's codepen example above,
    but I liked using Svelte because it makes it easy to react and manage
    different state changes. The only real _state_ that changes is the progress
    meter, and everything else is derived from that.
  </li>
  <li>
    Q: How can JavaScript and CSS communicate well? A: I decided to have
    JavaScript communicate to CSS via CSS variables that in the style section of
    a div. The svelte engine is tracking the state and re-rendering the div with
    the appropriate variables. In the CSS, there's some calculations made based
    on the progress, but some of the colors are also chosen in the JavaScript
    and passed via variables because that was easier for me to write, read and
    reason about.
  </li>
</ul>

<style>
  .progress {
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
  }

  .progress::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 50%;
    /* z-index: -1; */ /* not sure if this is needed and why */

    /* Set the background to be a colored circle with a nice gradient based on the progress */
    background: conic-gradient(
      var(--track-fg) var(--progress, 0%),
      var(--track-bg) var(--progress, 0%) 100%
    );

    /* Then mask the background to only reveal the progress */
    mask-image: radial-gradient(
      transparent var(--holesize),
      var(--track-fg) calc(var(--holesize) + 0.5px)
    );
  }

  .progress-inner {
    background: var(--circle-bg);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: background 2s;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  input {
    display: block;
    margin-inline: auto;
    margin-block: 2rem;
    width: 50vmin;
  }

  .checkbox-wrapper {
    display: flex;
    font-size: 12rem;
    animation: fadeIn ease-in 1s;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
