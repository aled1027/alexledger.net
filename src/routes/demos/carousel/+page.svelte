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

	onMount(() => {
		const headerElement = document.querySelector('header');
		if (headerElement) {
			headerHeight = headerElement.offsetHeight;
		}
	});
</script>

<div class="carousel" style="--header-height: {headerHeight}px">
	<h2 class="carousel__title">Carousel</h2>
	<div class="carousel__asset">
		{#each items as item, idx (idx)}
			<img src={item.src} alt={item.alt} />
		{/each}
	</div>
	<div class="carousel__label">
		{#each items as item, idx (idx)}
			<p data-cur-item={idx === curItemIdx}>{item.label}</p>
		{/each}
	</div>
</div>

<style lang="scss">
	.carousel {
		--carousel-font-size: var(--size-1);
		--carousel-font-weight: 400;

		position: absolute;
		top: var(--header-height, 0);
		bottom: 0;
		left: 0;
		right: 0;
		height: calc(100vh - var(--header-height, 0px));
		max-height: calc(100vh - var(--header-height, 0px));

		display: grid;
		grid-template-areas:
			'asset asset asset title title . '
			'asset asset asset ..... ..... . '
			'asset asset asset label label . ';
		grid-template-rows: auto 1fr auto;
		overflow: hidden;
	}

	.carousel__title {
		padding-block-start: 2rem;
		grid-area: title;
		text-align: right;

		font-size: var(--carousel-font-size);
		font-weight: var(--carousel-font-weight);
	}

	.carousel__asset {
		grid-area: asset;
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
		}

		p[data-cur-item='true'] {
			font-weight: 700;
		}
	}
</style>
