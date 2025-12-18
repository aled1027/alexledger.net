<script lang="ts">
	import type { Project } from '$lib/types';
	let { project, cardColor }: { project: Project; cardColor?: string } = $props();

	let theCardColor = $derived(cardColor || 'hsl(255.65, 45%, 90%)');
</script>

<article class="project-card" style="--card-color: {theCardColor}">
	{#if project.link}
		<a href={project.link} target="_blank" rel="noopener noreferrer">
			<div class="project-card__middle-entry project-card__scale-animation padding-4">
				<div class="project-card__asset-wrapper">
					<enhanced:img
						class="project-card__cover-asset"
						src={project.imageUrl}
						alt={project.imageAlt}
						sizes="(min-width: 768px) 50vw, 100vw"
					/>
				</div>
				<div class="project-card__title-wrapper">
					<h3 class="project-card__title">{project.projectName}</h3>
				</div>
			</div>
		</a>
	{:else}
		<div>
			<div class="project-card__middle-entry project-card__scale-animation padding-4">
				<div class="project-card__asset-wrapper">
					<enhanced:img
						class="project-card__cover-asset"
						src={project.imageUrl}
						alt={project.imageAlt}
						sizes="(min-width: 768px) 50vw, 100vw"
					/>
				</div>
				<div class="project-card__title-wrapper">
					<h3 class="project-card__title">{project.projectName}</h3>
				</div>
			</div>
		</div>
	{/if}
</article>

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

		position: relative;
	}

	.project-card:hover {
		box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
	}

	.project-card__title-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		max-width: 100%;
		max-height: 0;
		transition: max-height 0.3s linear;

		/* Glass */
		--bg-glass-color: var(--card-border-color-light);
		--bg-glass-opacity: 0.2;
		--bg-glass-blur: 16px;

		background: rgb(from var(--bg-glass-color) r g b / var(--bg-glass-opacity));
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(var(--bg-glass-blur));
		-webkit-backdrop-filter: blur(var(--bg-glass-blur));
	}

	.project-card:hover .project-card__title-wrapper {
		width: 100%;
		max-height: calc(1rem + 26px);
	}

	.project-card__title {
		text-align: center;
		font-size: var(--size-step--1);
		text-decoration: none;

		max-width: 100%;

		/* Trying fibonaccia for fun */
		padding-block: 13px;
		padding-inline: 21px;
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
		filter: brightness(1.05);
		transform: translateY(calc((1rem + 26px) * 0.33));
	}

	.project-card__cover-asset {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
