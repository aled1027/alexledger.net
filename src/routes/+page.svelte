<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Project } from '$lib/types';
	import { portfolio, type PortfolioItem } from '$lib/portfolio';
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	const projects: Project[] = portfolio
		.filter((item): item is PortfolioItem & { imageUrl: string; imageAlt: string; link: string } =>
			Boolean(item.imageUrl && item.imageAlt && item.link)
		)
		.map((item) => ({
			projectName: item.label,
			imageUrl: item.imageUrl,
			imageAlt: item.imageAlt,
			link: item.link,
			cardColor: item.cardColor
		}));

	let substackSection: HTMLElement;
	let iframeWidth = $state(200);
	function updateIFrameWidth() {
		if (substackSection) {
			iframeWidth = substackSection.offsetWidth;
		}
	}
	onMount(() => {
		window.addEventListener('resize', updateIFrameWidth);
		updateIFrameWidth();
	});

	onDestroy(() => {
		window.removeEventListener('resize', updateIFrameWidth);
	});
</script>

<section class="hero">
	<h1 class="font-decorative size-step-7">Alex Ledger</h1>
	<div class="size-step-2 hero-fade-in">
		<p>I’m a freelance web developer and designer based in Portland, Oregon.</p>
		<p>
			I create interactive, animated websites that help businesses clearly communicate what they do
			and what makes them different.
		</p>
	</div>
</section>
<section>
	<h2 id="portfolio" class="small-heading">MY WORK</h2>
	<div class="project-grid mt-l">
		{#each projects as project (project.projectName)}
			<ProjectCard {project} cardColor={project.cardColor} />
		{/each}
	</div>
</section>
<section class="center-children mt-3xl" bind:this={substackSection}>
	<iframe
		title="Alex Ledger's Substack Newsletter"
		src="https://alexledger.substack.com/embed"
		width={iframeWidth}
		height="320"
		style="border:1px solid #EEE; background:white;"
		frameborder="0"
		scrolling="no"
	></iframe>
</section>

<style>
	.hero p {
		max-width: 40ch;
		line-height: 1.4;
	}

	.hero-fade-in {
		opacity: 0;
		animation: fadeIn 1s forwards;
		transform: translateY(100px);
	}

	@keyframes fadeIn {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.project-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(clamp(16rem, 47%, 33rem), 1fr));
		gap: 1.5rem;
	}

	.small-heading {
		font-size: var(--size-step-0);
		font-weight: var(--font-bold);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
</style>
