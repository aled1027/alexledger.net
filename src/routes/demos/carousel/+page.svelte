<script lang="ts">
	import { onMount } from 'svelte';
	// Step 1: Layout
	// - I want to play with elements being at the bottom of the screen
	//   that often feels artsy
	// - I want to follow a grid-like system
	// Step 2: Ambience and Mileue
	// Step 3: Transitions

	function clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	}
	interface Item {
		label: string;
		alt: string;
		src: string;
	}

	const items: Item[] = [
		{
			label: 'Vyx',
			alt: '',
			src: 'https://picsum.photos/id/11/800/600'
		},
		{
			label: 'Metrion',
			alt: '',
			src: 'https://picsum.photos/id/12/800/600'
		},
		{
			label: 'Linda Drake Studio',
			alt: '',
			src: 'https://picsum.photos/id/13/800/600'
		},
		{
			label: 'Cosmic Frontier',
			alt: '',
			src: 'https://picsum.photos/id/14/800/600'
		}
	];

	let headerHeight = $state(0);
	let carouselEl: HTMLElement;
	let progress = $state(0);
	let curItemIdx = $derived(Math.min(Math.floor(progress * items.length), items.length - 1));

	let itemProgresses = $derived.by(() => {
		const numItems = items.length;

		if (numItems === 0) return [];
		if (numItems === 1) return [0];

		const segmentSize = 1 / numItems;
		const res = items.map((_, i) => {
			// Center each item within its scroll segment
			// Use -1 for entering, 0 for centered, 1 for leaving
			const center = (i + 0.5) * segmentSize;
			const offset = progress - center;
			return clamp(offset / segmentSize, -1, 1);
		});

		return res;
	});

	function updateProgress() {
		if (!carouselEl) return;

		const rect = carouselEl.getBoundingClientRect();
		const viewportHeight = window.innerHeight - headerHeight;
		const totalScrollable = rect.height - viewportHeight;

		if (totalScrollable > 0) {
			progress = clamp(-rect.top / totalScrollable, 0, 1);
		}
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
				<img style="--item-progress: {itemProgresses[idx]}" src={item.src} alt={item.alt} />
			{/each}
		</div>
		<div class="carousel__labels">
			<p class="carousel__title">Portfolio</p>
			{#each items as item, idx (idx)}
				<p class="carousel__label" data-cur-item={idx === curItemIdx}>{item.label}</p>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.carousel {
		--carousel-font-size: var(--size-1);
		--carousel-font-weight: 400;
		--item-height: calc(100vh - var(--header-height, 0px));

		position: relative;
		height: calc(var(--items) * var(--item-height));
	}
	.carousel__inner {
		position: sticky;
		top: var(--header-height, 0px);
		bottom: 0;
		left: 0;
		right: 0;
		height: var(--item-height);

		display: grid;
		grid-template-areas:
			'asset asset asset . '
			'asset asset asset label '
			'asset asset asset . ';
		grid-template-rows: auto 1fr auto;
		overflow: hidden;
	}

	.carousel__asset {
		grid-area: asset;
		position: relative;
		overflow: hidden;

		img {
			position: absolute;
			inset: 25% 0;
			width: 100%;
			height: 50%;
			object-fit: cover;

			opacity: 1;
			pointer-events: none;
			/* transform: translateY(calc(160% * -1 * var(--item-progress))); */
			/* width: calc(calc(1 - abs(var(--item-progress))) * 100%); */
			transform-origin: left center;

			/* how far from center */
			--dist: abs(var(--item-progress));

			/* horizontal scaling */
			--scale-x: calc(1 - var(--dist) * 0.4);

			transform: translateY(calc(160% * -1 * var(--item-progress))) scaleX(var(--scale-x));
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
