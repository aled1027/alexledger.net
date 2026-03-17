<script lang="ts">
	import { portfolio } from '$lib/portfolio';
	import { markdownToHtml } from '$lib/utils';
	import { MoveUpRight } from '@lucide/svelte';

	// Inspired by: https://joffreyspitzer.com/works/aerleum/

	let curItem = portfolio[0];
	let curDescription = markdownToHtml(curItem.description ?? '');
</script>

<div class="portfolio" data-portfolio>
	<div class="feature">
		<img class="feature__image" src={curItem.imageUrl} alt={curItem.imageAlt} />
	</div>
	<div class="images">
		{#each portfolio as item, idx (idx)}
			<img src={item.imageUrl} alt={item.imageAlt} />
		{/each}
	</div>
	<div class="info">
		<div class="info__inner">
			<div class="description">{@html curDescription}</div>
			<a class="info__link mt-m" href={curItem.link}
				>Visit
				<MoveUpRight size={16} />
			</a>
			<h3 class="mt-m">{curItem.label}</h3>
		</div>
	</div>
</div>

<style lang="scss">
	.portfolio {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		// 5 feature, 3 images, 4 info for a 12 column grid
		grid-template-areas: 'feature feature feature feature feature images images images info info info info';
		gap: 1rem;
		height: 100%;
		min-height: 100vh;

		position: relative;
	}
	.images {
		grid-area: images;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 5svh;
		margin-top: 66svh;

		img {
			max-width: 100%;
			height: auto;
			scale: 0.8;
			transform-origin: left center;
		}
	}

	.feature {
		grid-area: feature;
		position: sticky;
		top: 0;
		max-height: calc(100svh - 2rem);

		.feature__image {
			position: absolute;
			bottom: 0;
			aspect-ratio: 16 / 9;
			height: 100%;
			width: 100%;

			object-fit: contain;
			object-position: left bottom;
			z-index: 1;
		}
	}

	.info {
		grid-area: info;
		position: sticky;
		top: 0;
		max-height: calc(100svh - 2rem);

		.info__inner {
			position: absolute;
			bottom: 0;
		}

		.info__link {
			font-size: var(--size-step--1);
			text-decoration: none;
			border-bottom: 1px solid currentColor;
			display: inline-flex;
			align-items: center;
			gap: 4px;
			transition: font-weight 150ms ease;

			&:hover {
				font-weight: 500;
			}
		}
		.description {
			padding-inline-end: 1rem;
			text-wrap: balance;
			max-width: 60ch;
			font-size: var(--size-step--1);
		}

		.description :global(p) {
			margin: 0 0 1em;
		}

		.description :global(a) {
			color: inherit;
			text-decoration: underline;
		}

		.description :global(blockquote) {
			margin: 1em 0;
			padding-left: 1em;
			border-left: 2px solid color-mix(in srgb, var(--color-gray-100) 40%, transparent);
		}
	}
</style>
