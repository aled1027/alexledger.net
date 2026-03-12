<script lang="ts">
	import { onMount } from 'svelte';
	import Header2 from '$lib/components/Header2.svelte';

	// TODO: convert to webm
	// Make these gradients or bgs more alive. Perhaps with a shader.
	// Add a 3-d curve the movements
	// Make the right side more of a rolodex

	interface Item {
		// Human-readable label shown in the right-side list.
		label: string;
		// Source URL for the looping video shown in the carousel stack.
		videoUrl: string;
		// Gradient start color (top-left / leading edge of the base linear gradient).
		bgFrom: string;
		// Gradient end color (bottom-right / trailing edge of the base linear gradient).
		bgTo: string;
		// Accent color used by radial glow layers to add depth and atmosphere.
		bgGlow: string;
	}

	function clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	}

	// Simple RGB shape for color interpolation.
	type RGB = { r: number; g: number; b: number };

	// Parses #rgb, #rrggbb, and rgb(...) strings into numeric channels.
	function parseColor(color: string): RGB {
		if (color.startsWith('#')) {
			const hex = color.slice(1);
			const normalized =
				hex.length === 3
					? hex
							.split('')
							.map((char) => char + char)
							.join('')
					: hex;

			return {
				r: parseInt(normalized.slice(0, 2), 16),
				g: parseInt(normalized.slice(2, 4), 16),
				b: parseInt(normalized.slice(4, 6), 16)
			};
		}

		const rgbMatch = color.match(/\d+(?:\.\d+)?/g);
		if (!rgbMatch || rgbMatch.length < 3) {
			return { r: 0, g: 0, b: 0 };
		}

		return {
			r: Number(rgbMatch[0]),
			g: Number(rgbMatch[1]),
			b: Number(rgbMatch[2])
		};
	}

	// Linearly interpolates between two colors and returns an rgb(...) string.
	function mixColor(from: string, to: string, amount: number): string {
		const t = clamp(amount, 0, 1);
		const a = parseColor(from);
		const b = parseColor(to);

		const r = Math.round(a.r + (b.r - a.r) * t);
		const g = Math.round(a.g + (b.g - a.g) * t);
		const bCh = Math.round(a.b + (b.b - a.b) * t);

		return `rgb(${r}, ${g}, ${bCh})`;
	}

	const items: Item[] = [
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/anna-neshyba-edited.webm',
			label: 'Anna Neshyba',
			bgFrom: '#31453f',
			bgTo: '#161c1f',
			bgGlow: '#93c6b3'
		},
		{
			videoUrl:
				'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/ethyca-animation-demo-video.webm',
			label: 'Ethyca Product Animation',
			bgFrom: '#364052',
			bgTo: '#171b24',
			bgGlow: '#8aa7d8'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/maxlifefoundation.webm',
			label: 'Max Life Foundation',
			bgFrom: '#57367b',
			bgTo: '#1e1731',
			bgGlow: '#cb94ff'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/incontextlearning.webm',
			label: 'Incontext Learning',
			bgFrom: '#7a6e63',
			bgTo: '#27211d',
			bgGlow: '#dbc2a7'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/catandalex.webm',
			label: 'Cat and Alex',
			bgFrom: '#644183',
			bgTo: '#221632',
			bgGlow: '#d8b0ff'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/catnesh.webm',
			label: 'Cat Nesh',
			bgFrom: '#4f5b3e',
			bgTo: '#1b2115',
			bgGlow: '#b7ce8e'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/cosmicfronter-v0.webm',
			label: 'Cosmic Fronter',
			bgFrom: '#171f3d',
			bgTo: '#070910',
			bgGlow: '#6f87ff'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/vyx.webm',
			label: 'Vyx',
			bgFrom: '#535a62',
			bgTo: '#1a1d21',
			bgGlow: '#d5dde7'
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

	// Blend background colors between adjacent items using fractional scroll progress.
	// This keeps gradient transitions smooth instead of snapping at item boundaries.
	let activeBg = $derived.by(() => {
		const lowerIdx = clamp(Math.floor(stepProgress), 0, items.length - 1);
		const upperIdx = clamp(Math.ceil(stepProgress), 0, items.length - 1);
		const t = stepProgress - lowerIdx;
		const lower = items[lowerIdx];
		const upper = items[upperIdx];

		return {
			from: mixColor(lower.bgFrom, upper.bgFrom, t),
			to: mixColor(lower.bgTo, upper.bgTo, t),
			glow: mixColor(lower.bgGlow, upper.bgGlow, t)
		};
	});

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
		const headerElement = document.querySelector('.site-header');
		if (headerElement) {
			headerElement.style.display = 'none';
			headerHeight = 0;
			// headerHeight = headerElement.offsetHeight;
		}

		const main = document.querySelector('main');
		if (main) {
			main.style.marginTop = `${headerHeight}px`;
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

<Header2 />

<div
	bind:this={carouselEl}
	class="carousel"
	style="--header-height: {headerHeight}px; --items: {items.length};
	--bg-from: {activeBg.from};
	--bg-to: {activeBg.to};
	--bg-glow: {activeBg.glow};"
>
	<div class="carousel__inner">
		<div class="carousel__asset">
			{#each items as item, idx (idx)}
				<video
					autoplay
					muted
					loop
					playsinline
					crossorigin="anonymous"
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
		--video-gap: 3vh;
		--video-step: calc(var(--video-height) + var(--video-gap));

		/* One viewport to show the sticky stage + one step per transition */
		height: calc((100vh - var(--header-height, 0px)) + ((var(--items) - 1) * var(--video-step)));
		position: relative;

		font-family: 'Manrope', sans-serif;
	}

	.carousel__inner {
		position: sticky;
		top: var(--header-height, 0px);
		height: calc(100vh - var(--header-height));
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

		video {
			position: absolute;
			top: 50%;
			left: 0;
			width: 100%;
			height: var(--video-height);
			object-fit: cover;
			pointer-events: none;
			transform-origin: left center;
			border: 1px solid var(--color-color-300);
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

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

		color: white;
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
		opacity: 0.55;

		&[data-cur-item='true'] {
			font-weight: 700;
			opacity: 1;
		}
	}
</style>
