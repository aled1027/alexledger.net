<script lang="ts">
	import type { Project } from '$lib/types';
	let { project, cardColor }: { project: Project; cardColor?: string } = $props();

	let theCardColor = $derived(cardColor || 'hsl(255.65, 45%, 90%)');
</script>

<div class="project-card" style="--card-color: {theCardColor}">
	<div class="project-card__title-wrapper">
		<h3 class="project-card__title">{project.projectName}</h3>
	</div>
	<div class="project-card__middle-entry project-card__scale-animation padding-4">
		<div class="project-card__asset-wrapper">
			<enhanced:img
				class="project-card__cover-asset"
				src={project.imageUrl}
				alt={project.imageAlt}
				sizes="(min-width: 768px) 50vw, 100vw"
			/>
		</div>
	</div>
</div>

<style>
	.project-card {
		--card-color: hsl(255.65, 45%, 90%);
		--card-border-color: hsl(from var(--card-color) h s 70%);
		--card-border-color-light: hsl(from var(--card-border-color) h s l / 0.5);
		--card-bg-color: hsl(from var(--card-color) h s l / 0.25);

		background: var(--card-bg-color);
		border: 0.125px solid var(--card-border-color);
		border-radius: 4px;
		width: 100%;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
		overflow: hidden;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 0;
	}

	.project-card__title-wrapper {
		/* Trying fibonaccia for fun */
		padding-block: 13px;
		padding-inline: 21px;
		border-bottom: 0.5px solid var(--card-border-color-light);
	}

	.project-card__title {
		font-size: var(--size-step--1);
		text-decoration: none;
	}

	.project-card__asset-wrapper {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		overflow: hidden;
		position: relative;

		transition:
			transform 0.3s ease-in-out,
			filter 0.3s ease-in-out;
	}

	.project-card:hover .project-card__asset-wrapper {
		transform: scale(1.03);
		filter: brightness(1.05);
	}

	.project-card__cover-asset {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
