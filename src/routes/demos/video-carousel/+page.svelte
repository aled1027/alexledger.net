<script lang="ts">
	import { onMount } from 'svelte';

	interface Item {
		label: string;
		videoUrl: string;
	}

	function clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	}

	const items: Item[] = [
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/anna-neshyba-edited.mp4',
			label: 'Anna Neshyba'
		},
		{
			videoUrl:
				'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/ethyca-animation-demo-video.mp4',
			label: 'Ethyca Product Animation'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/maxlifefoundation.mp4',
			label: 'Max Life Foundation'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/incontextlearning.mp4',
			label: 'Incontext Learning'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/catandalex.mp4',
			label: 'Cat and Alex'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/catnesh.mp4',
			label: 'Cat Nesh'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/cosmicfronter-v0.mp4',
			label: 'Cosmic Fronter'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/vyx.mp4',
			label: 'Vyx'
		}
	];

	let headerHeight = $state(0);
	let carouselEl: HTMLElement;
	let stepProgress = $state(0);

	// Current centered-ish item
	let curItemIdx = $derived(clamp(Math.round(stepProgress), 0, items.length - 1));

	// Signed offset in "item steps"
	// 0 = centered, -1 = one step below, 1 = one step above
	let itemOffsets = $derived.by(() => items.map((_, i) => stepProgress - i));

	function updateProgress() {
		if (!carouselEl) return;

		const rect = carouselEl.getBoundingClientRect();
		const viewportHeight = window.innerHeight - headerHeight;
		const totalScrollable = rect.height - viewportHeight;

		if (totalScrollable <= 0) {
			stepProgress = 0;
			return;
		}

		const normalized = clamp(-rect.top / totalScrollable, 0, 1);
		stepProgress = normalized * (items.length - 1);
	}

	onMount(() => {
		const headerElement = document.querySelector('header');
		if (headerElement) {
			headerHeight = headerElement.offsetHeight;
		}

		updateProgress();

		window.addEventListener('scroll', updateProgress, { passive: true });
		window.addEventListener('resize', updateProgress);

		return () => {
			window.removeEventListener('scroll', updateProgress);
			window.removeEventListener('resize', updateProgress);
		};
	});
</script>

<div
	bind:this={carouselEl}
	class="carousel"
	style="--header-height: {headerHeight}px; --items: {items.length}"
>
	<div class="carousel__inner">
		<div class="carousel__asset">
			{#each items as item, idx (idx)}
				<video
					autoplay
					muted
					loop
					playsinline
					src={item.videoUrl}
					style="
						--item-offset: {itemOffsets[idx]};
						--item-dist: {Math.min(Math.abs(itemOffsets[idx]), 1)};
					"
				></video>
			{/each}
		</div>

		<div class="carousel__labels">
			<p class="carousel__title">Portfolio</p>
			{#each items as item, idx (idx)}
				<p class="carousel__label" data-cur-item={idx === curItemIdx}>
					{item.label}
				</p>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.carousel {
		--carousel-font-size: var(--size-1);
		--carousel-font-weight: 400;

		/* Tune these */
		--video-height: 50vh;
		--video-gap: 5vh;
		--video-step: calc(var(--video-height) + var(--video-gap));

		position: relative;

		/* One viewport to show the sticky stage + one step per transition */
		height: calc((100vh - var(--header-height, 0px)) + ((var(--items) - 1) * var(--video-step)));
	}

	.carousel__inner {
		position: sticky;
		top: var(--header-height, 0px);
		height: calc(100vh - var(--header-height));

		display: grid;
		grid-template-areas:
			'asset asset asset .'
			'asset asset asset label'
			'asset asset asset .';
		grid-template-rows: auto 1fr auto;
		overflow: hidden;
	}

	.carousel__asset {
		grid-area: asset;
		position: relative;
		overflow: hidden;

		video {
			position: absolute;
			top: 50%;
			left: 0;
			width: 100%;
			height: var(--video-height);
			object-fit: cover;
			pointer-events: none;
			transform-origin: left center;

			/* Full width at center, narrower away from center */
			--scale: calc(1 - var(--item-dist) * 0.3);

			transform: translateY(calc(-50% + (var(--item-offset) * -1 * var(--video-step))))
				scale(var(--scale));
		}
	}

	.carousel__labels {
		grid-area: label;
		align-self: center;
		text-align: right;

		font-size: var(--carousel-font-size);
		font-weight: var(--carousel-font-weight);

		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.carousel__title {
		margin: 0;
		font-size: var(--carousel-font-size);
		font-weight: var(--carousel-font-weight);
	}

	.carousel__label {
		margin: 0;
		opacity: 0.35;

		&[data-cur-item='true'] {
			font-weight: 700;
			opacity: 1;
		}
	}
</style>
