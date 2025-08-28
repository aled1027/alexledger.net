<script lang="ts">
	import { onMount } from 'svelte';

	/** Warm up ideas
	 *
	 * */
	// https://ebisu.money/

	const demos = [
		{
			title: 'Marquee',
			date: 'June 17, 2025',
			link: '/demos/marquee'
		},
		{
			title: 'Eyes Watching the Universe',
			date: 'June 18, 2025',
			link: '/demos/eyes'
		},
		{
			title: 'Ripple Text',
			date: 'June 30, 2025',
			link: '/demos/ripple-text'
		},
		{
			title: 'Hover Animations on Line',
			date: 'August 18, 2025',
			link: '/demos/hover-animations-on-line'
		}
	];

	let randomLink = demos[0].link; // Default to the first demo link
	onMount(() => {
		const randomIndex = Math.floor(Math.random() * demos.length);
		randomLink = demos[randomIndex].link;
	});
</script>

<div class="full-bleed demo-wrapper full-bleed pt-xl">
	<div class="demo">
		<div class="logo">
			<h1>Demos</h1>
		</div>
		<div class="launch">
			<a class="demo-button" href={randomLink}>Random</a>
		</div>

		<div class="marquee">
			<p class="m-0">Fun demos exploring new ideas and technologies.</p>
		</div>

		<div class="main">
			<ol>
				{#each demos as demo}
					<li>
						<a href={demo.link}>{demo.title}</a>
						<span class="size-step--2">&nbsp;{demo.date}</span>
					</li>
				{/each}
			</ol>
		</div>

		<div class="bottom"></div>
	</div>
</div>

<style>
	.demo-wrapper {
		--accent: #364b7c;
		/* --bg: #fcf7f3; */
		--border: 1px solid rgba(0, 0, 0, 0.6);
		background: var(--bg);
		min-height: 100vh;
		border-collapse: collapse;
		font-weight: 300;
	}

	.demo {
		display: grid;
		grid-template-areas:
			'logo . . . launch'
			'marquee marquee marquee marquee marquee'
			'main main main main main'
			'bottom bottom bottom bottom bottom';
		grid-template-rows: auto auto auto auto;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		width: var(--content-width);
		margin-inline: auto;
		border: var(--border);
		overflow: auto;
	}

	h1 {
		font-size: 2rem;
		font-weight: bold;
		color: var(--accent);
	}

	.logo {
		grid-area: logo;
		display: flex;
		align-items: center;
		padding-block: 1rem;
		padding-inline: 2rem;
	}

	.launch {
		grid-area: launch;
		display: flex;
		align-items: center;
		justify-content: center;
		border-left: var(--border);
	}

	.demo-button {
		/* background: var(--accent); */
		border: none;
		padding: 8px 13px;
		border-radius: 3px;
		cursor: pointer;
		text-decoration: none;
		font-weight: 300;
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
	}

	.demo-button::after {
		content: '';
		display: inline-block;
		vertical-align: middle;
		width: 1.5em;
		height: 1.5em;
		margin-left: 0.25em;
		background: no-repeat center/contain
			url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h8M10 5l3 3-3 3"/></svg>');
	}

	.demo-button:hover {
		opacity: 0.9;
	}

	.marquee {
		grid-area: marquee;
		padding: 1rem;
		overflow: hidden;
		white-space: nowrap;
		border-top: var(--border);
		border-bottom: var(--border);
	}

	.marquee p {
		animation: scroll 30s linear infinite;
		width: 100%;
		font-size: 0.875rem;
		white-space: nowrap;
	}

	.main {
		grid-area: main;
		padding-block-start: 1rem;
		padding-inline-start: 1rem;
		min-height: 50vh;
	}

	.main li {
		padding-inline-start: 1ch;
		margin-block-start: 0.5ch;
	}

	.bottom {
		grid-area: bottom;
		padding: 1rem;
		text-align: center;
		border-top: var(--border);
	}

	@keyframes scroll {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(-100%);
		}
	}

	.m-0 {
		margin: 0;
	}
</style>
