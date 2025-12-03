<script lang="ts">
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	let overlayEle: HTMLDivElement;
	let overlayContentEle: HTMLDivElement;
	let pioneerWrapper: HTMLDivElement; // Add this

	/* 
	 * TODO:
	 * - why are the vhs not adding up like I expect them to?
	 * - Why is this so bad on mobile?
	 */

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Set the target height of the overlay. The site-header is fixed so work around it.
		const overlayHeight = document.querySelector('.site-header')?.clientHeight ?? 0;
		overlayEle.style.height = `calc(100vh - ${overlayHeight}px)`;

		// Animate the overlay to scale up as we scroll down.
		gsap.to(overlayEle, {
			ease: 'none',
			scale: 1,
			borderRadius: '0',
			scrollTrigger: {
				trigger: '.pioneer-wrapper',
				start: '0vh top',
				end: '+=300vh',
				scrub: true
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
				scrub: true
			}
		});

		// Hide the overlay after animations complete so normal scrolling can continue
		gsap.to(overlayEle, {
			// Change from overlayEle to pioneerWrapper
			ease: 'none',
			y: '-100vh',
			scrollTrigger: {
				trigger: '.pioneer-wrapper',
				start: '500vh top',
				end: '+=400vh',
				scrub: true
			}
		});

		gsap.set('.content1', {
			scrollTrigger: {
				trigger: '.pioneer-wrapper',
				start: '600vh top',
				end: '+=1vh',
				scrub: true,
				onUpdate: (self) => {
					gsap.set('.content1', { opacity: 1 - self.progress });
				}
			}
		});

		gsap.set('.content2', {
			scrollTrigger: {
				trigger: '.pioneer-wrapper',
				start: '600vh top',
				end: '+=1vh',
				scrub: true,
				onUpdate: (self) => {
					gsap.set('.content2', { opacity: self.progress });
				}
			}
		});
	});
</script>

<div class="pioneer-wrapper" bind:this={pioneerWrapper}>
	<div bind:this={overlayEle} class="overlay">
		<div bind:this={overlayContentEle} class="overlay-content">
			<br />
			<br />
			<h3>Space</h3>
			<p>Your mission, should you choose to accept it, is to engineer microbes for Mars.</p>
		</div>
	</div>
	<div class="content1">
		<h2>Pioneer Labs Style</h2>
		<p>
			<a href="https://www.pioneer-labs.org/" target="_blank">Pioneer Labs</a> scroll effect.
		</p>
		<p>Scroll down, if you please.</p>
	</div>
	<div class="content2">
		<h2>And more content!</h2>
		<p>pretty fun, no?</p>
	</div>
</div>

<style lang="scss">
	.pioneer-wrapper {
		position: relative;
		height: 300vh;
		margin-block-end: 10vh;
	}

	.overlay {
		z-index: 1;
		position: fixed;
		bottom: 0;
		left: 0;
		transform: translateX(-50%);
		width: 100vw;
		height: calc(100vh - 100px);
		background: url('/textures/sky-base.jpg') no-repeat center center;
		scale: 0;
		transform-origin: bottom center;
		border-top-left-radius: 80%;
		border-top-right-radius: 80%;
	}

	.overlay-content {
		opacity: 0;
		color: white;
		filter: blur(10px);

		width: max-content;
		margin-inline: auto;
		padding: 1rem;
	}

	.content1 {
		position: fixed;
		top: 150px;
		z-index: 0;
		opacity: 1;

		width: max-content;
		margin-inline: auto;

	}

	.content2 {
		position: fixed;
		top: 150px;
		width: max-content;
		margin-inline: auto;
		z-index: 0;
		opacity: 0;
	}
</style>
