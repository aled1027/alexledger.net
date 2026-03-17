<script lang="ts">
	import { onMount } from 'svelte';
	import { portfolio } from '$lib/portfolio';
	import { mixColor, clamp } from '$lib/utils';

	// This is a carousel-like component that displays my portfolio.
	// It's a two column grid.
	// The left side has a stack layout. Where we are in that stack is computed by
	// `updateProgress` which updates the stepProgress rune. When stepProgress is 3.5 that means
	// we're halfway between showing the 3rd and 4th items in the stack.
	// The right side of the column shows the label of the carousel item.

	// The carousel html element. Used for detecting scroll position.
	let carouselEl: HTMLElement;

	// A number (float) between 0 and portfolio.length - 1 (inclusive)
	let stepProgress = $state(0);

	// The index of the current item in the portfolio (rounded from stepProgress)
	let curItemIdx = $derived(clamp(Math.round(stepProgress), 0, portfolio.length - 1));

	// Signed offset in "item steps"
	// 0 = centered, -1 = one step below, 1 = one step above
	let itemOffsets = $derived.by(() => portfolio.map((_, i) => stepProgress - i));

	// Blend background colors between adjacent portfolio using fractional scroll progress.
	// This keeps gradient transitions smooth instead of snapping at item boundaries.
	// TODO: Perhaps shaderify the backgrounds so the move with time or mouse
	let activeBg = $derived.by(() => {
		const lowerIdx = clamp(Math.floor(stepProgress), 0, portfolio.length - 1);
		const upperIdx = clamp(Math.ceil(stepProgress), 0, portfolio.length - 1);
		const t = stepProgress - lowerIdx;
		const lower = portfolio[lowerIdx];
		const upper = portfolio[upperIdx];

		return {
			from: mixColor(lower.bgFrom, upper.bgFrom, t),
			to: mixColor(lower.bgTo, upper.bgTo, t),
			glow: mixColor(lower.bgGlow, upper.bgGlow, t)
		};
	});

	function updateProgress() {
		// updateProgress runs when we scroll or resize the window to update `stepProgress`, the rune
		// that captures which portfolio item is currently in view.
		if (!carouselEl) return;

		const rect = carouselEl.getBoundingClientRect();
		const viewportHeight = window.innerHeight; // assumes no header height
		const totalScrollable = rect.height - viewportHeight;

		if (totalScrollable <= 0) {
			stepProgress = 0;
			return;
		}

		const normalized = clamp(-rect.top / totalScrollable, 0, 1);
		stepProgress = normalized * (portfolio.length - 1);
	}

	onMount(() => {
		const main = document.querySelector('main');
		if (main) {
			main.style.marginTop = `${0}px`;
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
	style="--items: {portfolio.length};
	--bg-from: {activeBg.from};
	--bg-to: {activeBg.to};
	--bg-glow: {activeBg.glow};"
>
	<div class="carousel__inner">
		<div class="carousel__asset">
			{#each portfolio as item, idx (idx)}
				<div
					class="carousel__asset__item"
					style="
				--item-offset: {itemOffsets[idx]};
				--item-dist: {Math.min(Math.abs(itemOffsets[idx]), 1)};"
				>
					<img
						src={item.imageUrl}
						alt={item.imageAlt}
						style="view-transition-name: portfolio-image-{item.slug}"
					/>

					<a href="/portfolio/{item.slug}" class="carousel__asset__button">Explore Project</a>
				</div>
			{/each}
		</div>

		<div class="carousel__labels">
			<p class="carousel__title">Portfolio</p>
			{#each portfolio as item, idx (idx)}
				{@const distFromCur = idx - curItemIdx}
				{@const opacity = clamp(1 - Math.abs(distFromCur) / 5, 0, 1)}
				{@const scale = clamp(1 - Math.abs(distFromCur) * 0.08, 0.7, 1)}
				<p
					class="carousel__label"
					data-cur-item={idx === curItemIdx}
					style="
						--opacity: {opacity};
						--scale: {scale};
						view-transition-name: portfolio-title-{item.slug};
					"
				>
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
		--item-asset-height: 50vh;
		--item-asset-gap: 8vh;
		--item-asset-step: calc(var(--item-asset-height) + var(--item-asset-gap));

		/* One viewport to show the sticky stage + one step per transition */
		height: calc(100vh + ((var(--items) - 1) * var(--item-asset-step)));
		position: relative;

		// TODO: maybe change font-family everywhere
		font-family: 'Manrope', sans-serif;
	}

	.carousel__inner {
		position: sticky;
		top: 0;
		height: 100vh;
		isolation: isolate;

		display: grid;
		grid-template-areas:
			'asset asset asset .'
			'asset asset asset label'
			'asset asset asset .';
		grid-template-rows: auto 1fr auto;
	}

	/* Gradient backdrop: two soft glow layers + one directional base gradient. */
	.carousel__inner::before {
		content: '';
		display: block;
		position: absolute;
		z-index: -2;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: calc(50% - 50vw);
		background:
			radial-gradient(
				70% 55% at 15% 20%,
				color-mix(in srgb, var(--bg-glow) 42%, transparent),
				transparent 70%
			),
			radial-gradient(
				55% 45% at 85% 75%,
				color-mix(in srgb, var(--bg-glow) 28%, transparent),
				transparent 75%
			),
			linear-gradient(135deg, var(--bg-from) 0%, var(--bg-to) 100%);
		filter: saturate(1.05) contrast(1.03);
		transition:
			background 1s ease,
			filter 1s ease;
	}

	/* Subtle grain overlay to avoid flat digital gradients. */
	.carousel__inner::after {
		content: '';
		display: block;
		position: absolute;
		z-index: -1;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: calc(50% - 50vw);
		pointer-events: none;
		opacity: 0.07;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
	}

	.carousel__asset {
		grid-area: asset;
		position: relative;
		overflow: hidden;
	}

	.carousel__asset__item {
		/* Full width at center, narrower away from center */
		--scale: calc(1 - var(--item-dist) * 0.3);

		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		height: var(--item-asset-height);
		transform-origin: left center;
		border: 1px solid var(--color-color-300);
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

		transform: translateY(calc(-50% + (var(--item-offset) * -1 * var(--item-asset-step))))
			scale(var(--scale));

		img {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.carousel__labels {
		grid-area: label;
		align-self: center;
		text-align: right;

		color: var(--color-gray-100);
		mix-blend-mode: difference;
		transition: color 0.5s ease-in;

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
		opacity: var(--opacity);
		scale: var(--scale);
		transform-origin: right;
		transition:
			scale 250ms linear,
			opacity 250ms linear;

		&[data-cur-item='true'] {
			font-weight: 700;
			opacity: 1;
		}
	}

	.carousel__asset__button {
		position: absolute;
		bottom: -4.5rem;
		left: 50%;
		transform: translateX(-50%);
		width: fit-content;
		height: 4rem;
		padding: 0.5rem;
		background-color: var(--color-color-300);
		font-size: var(--size-step--1);
		font-weight: 400;
		background: transparent;
		color: var(--color-gray-100);
		mix-blend-mode: difference;
		border: none;

		&:hover {
			text-decoration: underline;
			cursor: pointer;
		}
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
