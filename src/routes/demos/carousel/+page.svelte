<script lang="ts">
	import { onMount } from 'svelte';
	// Step 1: Layout
	// - I want to play with elements being at the bottom of the screen
	//   that often feels artsy
	// - I want to follow a grid-like system
	// Step 2: Ambience and Mileue
	// Step 3: Transitions
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
	let carouselEl: HTMLElement | null = null;
	let progress = $state(0);
	let curItemIdx = $derived(Math.min(Math.floor(progress * items.length), items.length - 1));

	let itemProgresses = $derived.by(() => {
		const numItems = items.length;
		// split progress evenly into numItems segments
		const segmentSize = 1.0 / numItems;

		const result = [];
		for (let i = 0; i < numItems; i++) {
			const segStart = i * segmentSize;
			const segEnd = (i + 1) * segmentSize;

			let segProgress = 0;
			if (segStart <= progress && progress < segEnd) {
				segProgress = clamp((progress - segStart) / (segEnd - segStart), 0, 1);
			} else if (segEnd <= progress && progress < segEnd + segmentSize) {
				// If we're in the next segement, then lower it
				const start = segEnd;
				const end = segEnd + segmentSize;
				segProgress = 1 - clamp((progress - start) / (end - start), 0, 1);
			} else if (segStart - segmentSize <= progress && progress < segStart) {
				// if we're in the previous segment
				const start = segStart - segmentSize;
				const end = segStart;
				segProgress = 1 - clamp((progress - start) / (end - start), 0, 1);
			}

			result.push(segProgress);
		}
		return result;
	});

	$inspect(itemProgresses);

	function clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	}

	function updateCarousel() {
		if (!carouselEl) return;

		const rect = carouselEl.getBoundingClientRect();
		const viewportHeight = window.innerHeight - headerHeight;
		const totalScrollable = rect.height - viewportHeight;

		if (totalScrollable <= 0) {
			curItemIdx = 0;
			return;
		}

		const rawProgress = -rect.top / totalScrollable;
		progress = clamp(rawProgress, 0, 1);
	}

	onMount(() => {
		const headerElement = document.querySelector('header');
		if (headerElement) {
			headerHeight = headerElement.offsetHeight;
		}

		updateCarousel();

		window.addEventListener('scroll', updateCarousel, { passive: true });
		window.addEventListener('resize', updateCarousel);

		return () => {
			window.removeEventListener('scroll', updateCarousel);
			window.removeEventListener('resize', updateCarousel);
		};
	});
</script>

<div
	bind:this={carouselEl}
	class="carousel full-bleed"
	style="--header-height: {headerHeight}px; --items: {items.length}"
>
	<div class="carousel__inner">
		<h2 class="carousel__title">Carousel</h2>
		<div class="carousel__asset">
			{#each items as item, idx (idx)}
				<img style="--item-progress: {itemProgresses[idx]}" src={item.src} alt={item.alt} />
			{/each}
		</div>
		<div class="carousel__label">
			{#each items as item, idx (idx)}
				<p data-cur-item={idx === curItemIdx}>{item.label}</p>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.carousel {
		--carousel-font-size: var(--size-1);
		--carousel-font-weight: 400;
		--step-height: 100vh;

		position: relative;
		height: calc(var(--items) * var(--step-height));
	}
	.carousel__inner {
		position: sticky;
		top: var(--header-height, 0px);
		bottom: 0;
		left: 0;
		right: 0;
		height: calc(100vh - var(--header-height, 0px));

		display: grid;
		grid-template-areas:
			'asset asset asset asset title . '
			'asset asset asset asset ..... . '
			'asset asset asset asset label . ';
		grid-template-rows: auto 1fr auto;
		overflow: hidden;
	}

	.carousel__title {
		grid-area: title;
		text-align: right;
		padding-block-start: 2rem;
		margin: 0;
		width: fit-content;
		justify-self: end;

		font-size: var(--carousel-font-size);
		font-weight: var(--carousel-font-weight);
	}

	.carousel__asset {
		grid-area: asset;
		position: relative;
		overflow: hidden;

		img {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;

			opacity: 1;
			pointer-events: none;
			width: calc(100% * var(--item-progress));
		}
	}
	.carousel__label {
		grid-area: label;
		align-self: end;
		text-align: right;
		padding-block-end: 2rem;

		font-size: var(--carousel-font-size);
		font-weight: var(--carousel-font-weight);

		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		p {
			margin: 0;
			opacity: 0.35;
		}

		p[data-cur-item='true'] {
			font-weight: 700;
			opacity: 1;
		}
	}
</style>
