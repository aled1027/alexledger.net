<script lang="ts">
	import { portfolio } from '$lib/portfolio';
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const degree = -360 / portfolio.length;

		gsap
			.timeline()
			.set('.ring', { rotationX: -90 })
			//set initial rotationY so the parallax jump happens off screen
			.set('.item', {
				// apply transform rotations to each image
				rotateX: (i) => i * degree,
				transformOrigin: '50% 50% -250px',
				z: 250,
				backfaceVisibility: 'hidden'
			})
			.set('.ring', { rotationX: 60 });

		gsap.to('.ring', {
			rotationX: '+=1440',
			ease: 'none',
			scrollTrigger: {
				trigger: '.stage',
				pin: true,
				scrub: 0.75,
				start: 'top top',
				end: '+=2000'
			}
		});
	});
</script>

<h2>Ring Demo</h2>
<p>
	A vertical ring of text items based on <a
		href="https://codepen.io/GreenSock/pen/eYKWzwv?editors=1000">this pen</a
	>.
</p>

<div class="stage">
	<div class="container">
		<ul class="ring">
			{#each portfolio as item (item.label)}
				<li class="item">
					<a href={item.link}>{item.label}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style lang="scss">
	.stage {
		position: absolute;
		height: 100%;
		width: 100%;
		transform-style: preserve-3d;
		user-select: none;
		overflow: hidden;
	}

	.container {
		position: absolute;
		perspective: 2000px;
		width: 30ch;

		// Height doesn't really matter
		/* height: 3lh; */
		// Center it
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.ring {
		position: absolute;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		user-select: none;

		list-style: none;
	}

	.item {
		position: absolute;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		user-select: none;
	}
</style>
