<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Project } from '$lib/types';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	// @ts-ignore -- Image imports with query parameters
	import AnnaNeshyba from '$lib/assets/anna-neshyba.png?enhanced&format=webp';
	// @ts-ignore -- Image imports with query parameters
	import Metrion from '$lib/assets/metrion.png?enhanced&format=webp';
	// @ts-ignore -- Image imports with query parameters
	import Seastar from '$lib/assets/seastar.png?enhanced&format=webp';
	// @ts-ignore -- Image imports with query parameters
	import GiveMaxLife from '$lib/assets/give-max-life.png?enhanced&format=webp';
	// @ts-ignore -- Image imports with query parameters
	import Incontext from '$lib/assets/incontext.png?enhanced&format=webp';
	// @ts-ignore -- Image imports with query parameters
	import LittleCompass from '$lib/assets/little-compass.png?enhanced&format=webp';
	// @ts-ignore -- Image imports with query parameters
	import CatAndAlex from '$lib/assets/catandalex.png?enhanced&format=webp';
	// @ts-ignore -- Image imports with query parameters
	import LlmToolsAnki from '$lib/assets/llm-tools-anki.png?enhanced&format=webp';
	// @ts-ignore -- Image imports with query parameters
	import CatNeshyba from '$lib/assets/catneshyba.png?enhanced&format=webp';
	// @ts-ignore -- Image imports with query parameters
	import Vyx from '$lib/assets/vyx.png?enhanced&format=webp';
	// @ts-ignore -- Image imports with query parameters
	import MedicalNoteGenerator from '$lib/assets/medical-note-generator.png?enhanced&format=webp';

	const projects: Project[] = [
		{
			projectName: 'Anna Neshyba',
			imageUrl: AnnaNeshyba,
			imageAlt: 'Screenshot of the Anna Neshyba website',
			cardColor: '#D3DCD9',
			link: 'https://annaneshyba.com/'
		},
		{
			projectName: 'Metrion',
			imageUrl: Metrion,
			imageAlt: 'Screenshot of the Metrion website',
			cardColor: '#8992cb',
			link: 'https://metrion.space'
		},
		{
			projectName: 'Give Max Life',
			imageUrl: GiveMaxLife,
			imageAlt: 'Screenshot of the Give Max Life website',
			cardColor: '#9335D1',
			link: 'https://givemaxlife.com/'
		},
		{
			projectName: 'Vyx',
			imageUrl: Vyx,
			imageAlt: 'Screenshot of the Vyx website',
			cardColor: '#8B8B8B',
			link: 'https://vyx.gg'
		},
		{
			projectName: 'Medical Note Generator',
			imageUrl: MedicalNoteGenerator,
			imageAlt: 'Screenshot of the Medical Note Generator website',
			cardColor: '#E6E6E6',
			link: 'https://github.com/johnyquest7/rust_med',
		},
		{
			projectName: 'Seastar',
			imageUrl: Seastar,
			imageAlt: 'Screenshot of the Seastar website',
			cardColor: '#464D36',
			link: 'https://seastar-coaching.com'
		},
		{
			projectName: 'inContext Learning',
			imageUrl: Incontext,
			imageAlt: 'Screenshot of the incontext website',
			// cardColor: '#6546B8'
			cardColor: '#EDEFF2',
			link: 'https://incontextlearning.com'
		},
		{
			projectName: 'The Little Compass',
			imageUrl: LittleCompass,
			imageAlt: 'Screenshot of the Seastar website',
			cardColor: '#DDD4FD',
			link: 'https://thelittlecompass.com'
		},
		{
			projectName: "Cat & Alex's Wedding",
			imageUrl: CatAndAlex,
			imageAlt: 'Screenshot of the Cat and Alex website',
			cardColor: '#9080D0',
			link: 'https://catandalex.net'
		},
		{
			projectName: 'llm-tools-anki',
			imageUrl: LlmToolsAnki,
			imageAlt: 'Screenshot of the llm-tools-anki website',
			cardColor: '#1B883E',
			link: 'https://github.com/aled1027/llm-tools-anki'
		},
		{
			projectName: 'Cat Neshyba',
			imageUrl: CatNeshyba,
			imageAlt: 'Screenshot of the Cat Neshyba website',
			cardColor: '#CED2D5',
			link: 'https://catneshyba.com'
		}
	];
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
		<p>
			I'm a web designer and developer from Portland, Oregon. I work with businesses to design and
			build websites.
		</p>
		<p>
			I specialize in creating beautiful, functional websites that help businesses grow. I focus on
			combining good fundamentals— strong, clear copy and design— with a sprinkle of magic to make
			the experience fun and attention-grabbing.
		</p>
	</div>
</section>
<section>
	<h2 class="small-heading">MY WORK</h2>
	<div class="project-grid mt-l">
		{#each projects as project}
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
