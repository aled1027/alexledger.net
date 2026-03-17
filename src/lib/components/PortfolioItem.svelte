<script lang="ts">
	let { item } = $props();

	import { CornerDownLeft } from '@lucide/svelte';
	import DOMPurify from 'dompurify';
	import { marked } from 'marked';

	const descriptionHtml = $derived.by(() => {
		if (!item.description) {
			return '';
		}

		const parsed = marked.parse(item.description, { async: false });
		return DOMPurify.sanitize(parsed);
	});
</script>

<div
	class="custom-gradient-bg full-fixed"
	style="--bg-from: {item.bgFrom};
         --bg-to: {item.bgTo};
         --bg-glow: {item.bgGlow};"
></div>

<section class="item">
	<div class="item__header">
		<a href="/portfolio"><CornerDownLeft /></a>
		<a class="no-underline" href={item.link} target="_blank">
			<h1 class="item__title" style="view-transition-name: portfolio-title-{item.slug}">
				{item.label}
			</h1>
		</a>
	</div>

	{#if item.description}
		<div class="item__description my-m">{@html descriptionHtml}</div>
	{/if}

	<div class="grid my-l" data-layout="50-50">
		<img
			class="item__image"
			src={item.imageUrl}
			alt={item.imageAlt}
			style="view-transition-name: portfolio-image-{item.slug}"
		/>
		{#if item.videoUrl}
			<video class="item__video" src={item.videoUrl} controls autoplay muted loop> </video>
		{/if}
	</div>
</section>

<style lang="scss">
	.item {
		color: var(--color-gray-100);
	}

	.item__header {
		display: flex;
		align-items: baseline;
		gap: 1rem;
	}

	.item__title {
		font-size: var(--size-step-3);
		text-decoration: none;

		// TODO: remove
		font-family: 'Manrope', sans-serif;

		&:hover {
			text-decoration: underline;
		}
	}

	.item__image {
		max-width: 100%;
		max-height: 60vh;
		border-radius: 2px;
		box-shadow: var(--box-shadow);
		object-fit: contain;
	}

	.item__video {
		max-width: 100%;
		max-height: 60vh;
		border-radius: 2px;
		box-shadow: var(--box-shadow);
	}

	.item__description {
		max-width: 60ch;
	}

	.item__description :global(p) {
		margin: 0 0 1rem;
	}

	.item__description :global(a) {
		color: inherit;
		text-decoration: underline;
	}

	.item__description :global(blockquote) {
		margin: 1rem 0;
		padding-left: 1rem;
		border-left: 2px solid color-mix(in srgb, var(--color-gray-100) 40%, transparent);
	}
</style>
