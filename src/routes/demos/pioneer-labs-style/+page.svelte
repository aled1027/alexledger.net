<script lang="ts">
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	let container: HTMLDivElement;
	let overlayEle: HTMLDivElement;
	let overlayContentEle: HTMLDivElement;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Set the target height of the overlay. The site-header is fixed so work around it.
		const overlayHeight = document.querySelector('.site-header')?.clientHeight ?? 0;
		overlayEle.style.height = `calc(100vh - ${overlayHeight}px)`;

		// Animate the overlay to scale up as we scroll down.
		gsap.to(overlayEle, {
			ease: 'none',
			scale: 1,
			borderRadius: "0",
			scrollTrigger: {
				trigger: '.pioneer-wrapper',
				start: '0vh top', // No idea why -200vh
				end: '+=300vh',
				scrub: true,
				markers: true
			}
		});

		// Animate the overlay content to fade in as we scroll down
		gsap.to(overlayContentEle, {
			ease: 'none',
			opacity: 1,
			filter: 'blur(0px)',
			scrollTrigger: {
				trigger: '.pioneer-wrapper',
				start: '200vh top',
				end: '+=200vh',
				scrub: true,
				markers: true
			}
		});


	});
</script>

<div class="pioneer-wrapper">
	<div bind:this={overlayEle} class="overlay">
		<div bind:this={overlayContentEle} class="overlay-content">
			<br />
			<br />
			<h3>Space</h3>
			<p>Your mission, should you choose to accept it, is to engineer microbes for Mars. </p>
		</div>
	</div>
	<div class="content1">
		<h2>Pioneer Labs Style</h2>
		<p>
			<a href="https://www.pioneer-labs.org/" target="_blank">Pioneer Labs</a> scroll effect.
		</p>
		<p>Scroll down, if you please.</p>
		<div class="" bind:this={container}></div>
	</div>
	<p>more content</p>
</div>


<style lang="scss">
	.pioneer-wrapper {
		position: relative;
		min-height: 300vh;
	}

	.content1 {
		position: fixed;
		top: 150px;
		left: 80px;
		z-index: 0;
	}

	.overlay {
		z-index: 1;
		position: fixed;
		bottom: 0;
		left: 0;
		transform: translateX(-50%);
		width: 100vw;
		height: calc(100vh - 100px);
		background: url("/textures/sky-base.jpg") no-repeat center center;
		scale: 0;
		transform-origin: bottom center;
		border-top-left-radius: 80%;
		border-top-right-radius: 80%;
	}

	.overlay-content {
		opacity: 0;
		color: white;
		filter: blur(10px);
	}
</style>
