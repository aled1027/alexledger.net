<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { spring } from "svelte/motion";

  let filling = false;
  let fillSpeed = 0.01; // New prop to control fill speed
  let fillLevel = spring(0, { stiffness: fillSpeed, damping: 0.25 });

  let canvas;
  let ctx;
  let animationId;

  onMount(() => {
    console.log("Mounting");
    canvas = document.getElementById("fluidCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;
  });

  function toggleFill() {
    console.log("Filling");
    filling = !filling;
    if (filling) {
      fillLevel.set(100);
    } else {
      fillLevel.set(0);
    }
  }

  function drawFluid(level) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 100, 255, 0.7)";

    const waveHeight = 10;
    const waveCount = 3;

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    for (let x = 0; x <= canvas.width; x++) {
      let y = canvas.height - (canvas.height * level) / 100;
      y += Math.sin(x / 30 + Date.now() / 200) * waveHeight;
      y += (Math.sin(x / 60 + Date.now() / 400) * waveHeight) / 2;
      y += (Math.sin(x / 90 + Date.now() / 600) * waveHeight) / 4;

      ctx.lineTo(x, y);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
  }

  function animate() {
    drawFluid($fillLevel);
    animationId = requestAnimationFrame(animate);
  }

  $: {
    if (canvas && ctx) {
      if (filling) {
        animate();
      } else {
        // cancelAnimationFrame(animationId);
        drawFluid($fillLevel);
      }
    }
  }

  onDestroy(() => {
    //   cancelAnimationFrame(animationId);
  });
</script>

<h2 class="heading-2">Projects</h2>

<button class="button" data-type="primary" on:click={toggleFill}
  >inContext</button
>

<div class="canvas-container">
  <canvas id="fluidCanvas"></canvas>
</div>

<style>
  .canvas-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  canvas {
    border: 1px solid #ccc;
  }
</style>
