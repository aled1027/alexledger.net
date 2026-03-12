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
	let curItemIdx = $state(0);
	let carouselEl: HTMLElement | null = null;

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
		const progress = Math.min(Math.max(rawProgress, 0), 1);
		curItemIdx = Math.min(Math.floor(progress * items.length), items.length - 1);
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
				<img src={item.src} alt={item.alt} data-cur-item={idx === curItemIdx} />
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
			'asset asset asset title title . '
			'asset asset asset ..... ..... . '
			'asset asset asset label label . ';
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

			opacity: 0.5;
			transform: scale(1.03);
			transition:
				opacity 300ms ease,
				transform 300ms ease;
			pointer-events: none;
		}

		img[data-cur-item='true'] {
			opacity: 1;
			transform: scale(1);
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
