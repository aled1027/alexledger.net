<script lang="ts">
	/** Warm up ideas
	 *
	 * */
	// https://ebisu.money/
	let randomLink = '/demos';
</script>

<div class="full-bleed demo-wrapper full-bleed pt-xl">
	<div class="demo">
		<div class="logo">
			<h1>Demos</h1>
		</div>

		<nav class="menu">
			<ul>
				<!-- <li><a href="#exercises">Exercises</a></li> -->
				<!-- <li><a href="#routines">Routines</a></li> -->
				<!-- <li><a href="#progress">Progress</a></li> -->
			</ul>
		</nav>

		<div class="launch">
			<a class="demo-button" href={randomLink}>Random</a>
		</div>

		<div class="marquee">
			<p class="m-0">Fun demos to explore new ideas and technologies.</p>
		</div>

		<div class="main">
			<ol>
				<li>
					June 17, 2025: <a href="/demos">Setting up this page</a>
				</li>
			</ol>
		</div>

		<div class="bottom">
			<p class="m-0"></p>
		</div>
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
			'logo menu menu menu launch'
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

	.menu {
		grid-area: menu;
	}

	.menu ul {
		display: flex;
		gap: 2rem;
		list-style: none;
		justify-content: flex-end;
		padding-inline: 2rem;
	}

	.menu ul a {
		color: #333;
		text-decoration: none;
	}

	.menu ul a:hover {
		opacity: 0.8;
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
		animation: scroll 18s linear infinite;
		width: max-content;
		font-size: 0.875rem;
	}

	.main {
		grid-area: main;
		padding-block-start: 1rem;
		padding-inline-start: 1rem;
		min-height: 50vh;
	}

	.main li {
		padding-inline-start: 1ch;
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
