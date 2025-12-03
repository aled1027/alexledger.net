<script lang="ts">
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	let container: HTMLDivElement;
	let overlayEle: HTMLDivElement;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Set the target height of the overlay. The site-header is fixed so work around it.
		const overlayHeight = document.querySelector(".site-header")?.clientHeight ?? 0;
		console.log(overlayHeight);
		overlayEle.style.height = `calc(100vh - ${overlayHeight}px)`;

		// Animate the overlay to scale up as we scroll down.
		gsap.to(overlayEle, {
			ease: "none",
			scale: 1,
			once: false,
			scrollTrigger: {
				trigger: container,
				start: "-200vh top", // No idea why -200vh
				end: "+=300vh",
				scrub: true,
				markers: true,
			},
		});


	});
</script>

<div class="pioneer-wrapper">
	<div class="content1">
		<h2>Pioneer Labs Style</h2>
		<p>
			<a href="https://www.pioneer-labs.org/" target="_blank">Pioneer Labs</a> scroll effect.
		</p>
		<p>Scroll down, if you please.</p>
		<div class="mt-xl" bind:this={container}></div>
	</div>
	<div bind:this={overlayEle} class="overlay"></div>
</div>

<style lang="scss">
	.pioneer-wrapper {
		position: relative;
		min-height: 500vh;
		border: 1px solid green;
		z-index: 1;
	}

	.content1 {
		position: fixed;
		top: 150px;
		left: 80px;
	}


	.overlay {
		position: fixed;
		bottom: 0;
		left: 0;
		transform: translateX(-50%);
		width: 100vw;
		height: calc(100vh - 100px);
		background: rgba(0, 255, 0, 0.5);
		scale: 0;
		transform-origin: bottom center;
	}
</style>
