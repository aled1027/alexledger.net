<script lang="ts">
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/ScrollTrigger';

	let headerHeight = $state(0);

	ScrollTrigger.defaults({
		toggleActions: 'restart pause resume none',
		markers: true
	});
	gsap.registerPlugin(ScrollTrigger);

	$effect(() => {
		headerHeight = document.querySelector('.site-header')?.clientHeight ?? 0;
		// Set header height as a CSS variable
		document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
	});

	$effect(() => {
		const panels: HTMLElement[] = gsap.utils.toArray('.panel');
		panels.forEach((panel) => {
			gsap.to(panel, {
				scrollTrigger: {
					trigger: panel,
					start: `top ${headerHeight}px`,
					pin: true,
				}
			});
		});
	});
</script>

<div class="my-l cont">
	<div class="panel a">A</div>
	<div class="panel b">B</div>
	<div class="panel c">C</div>
</div>

<style lang="scss">
	.panel {
		height: calc(40vh - var(--header-height, 0px));
		width: 100vw;
		margin-inline: calc(50% - 50vw);
		background-color: red;

		margin-block: 0;
		border: 1px solid black;
		position: sticky;
		top: 0;
	}

	.b {
		background-color: blue;
	}

	.c {
		background-color: yellow;
	}

	.cont {
		margin-block-end: 200vh;
	}
</style>
