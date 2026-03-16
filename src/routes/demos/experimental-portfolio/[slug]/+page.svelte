<script lang="ts">
	let { data } = $props();
	let item = data.item;
	import { CornerDownLeft } from '@lucide/svelte';
</script>

<div
	class="custom-gradient-bg full-absolute"
	style="--bg-from: {item.bgFrom};
         --bg-to: {item.bgTo};
         --bg-glow: {item.bgGlow};"
></div>

<section class="item">
	<div class="item__header">
		<a href="/demos/experimental-portfolio" class="item__back"><CornerDownLeft /></a>
		<h1 class="item__title" style="view-transition-name: portfolio-title-{item.slug}">
			{item.label}
		</h1>
	</div>
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
	<p>{item.description}</p>

	<!-- <p>{item.description}</p> -->
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

	.item__back {
	}

	.item__title {
		font-size: var(--size-step-3);
		// TODO: remove
		font-family: 'Manrope', sans-serif;
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
</style>
