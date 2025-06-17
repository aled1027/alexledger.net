<script lang="ts">
	/** Warm up ideas
	 *
	 * */
	// https://ebisu.money/
</script>

<div class="full-bleed warmup-wrapper full-bleed pt-xl">
	<div class="warmup">
		<div class="top">
			<p>Welcome to Warmups</p>
		</div>

		<div class="logo">
			<h1>W</h1>
		</div>

		<nav class="menu">
			<ul>
				<li><a href="#exercises">Exercises</a></li>
				<li><a href="#routines">Routines</a></li>
				<li><a href="#progress">Progress</a></li>
			</ul>
		</nav>

		<div class="launch">
			<button>Start Workout</button>
		</div>

		<div class="marquee">
			<p class="m-0">Daily motivation • Stay consistent • Build strength • Feel great</p>
		</div>

		<main class="main">
			<h2>Featured Exercises</h2>
		</main>

		<div class="bottom">
			<p class="m-0">© 2025 Warmups</p>
		</div>
	</div>
</div>

<style lang="scss">
	.warmup-wrapper {
		--accent: #ed4e9b;
		--bg: #fcf7f3;
		--border: 1px solid rgba(0, 0, 0, 1);
		background: var(--bg);
		min-height: 100vh;
	}

	.warmup {
		display: grid;
		grid-template-areas:
			'top top top top top'
			'logo menu menu menu launch'
			'marquee marquee marquee marquee marquee'
			'main main main main main'
			'main main main main main'
			'main main main main main'
			'bottom bottom bottom bottom bottom';
		width: var(--content-width);
		margin-inline: auto;
		border: var(--border);
	}

	h1 {
		font-size: 2rem;
		font-weight: bold;
		color: var(--accent);
	}

	h3 {
		color: var(--accent);
		margin-bottom: 0.5rem;
	}

	.top {
		grid-area: top;
		padding: 1rem;
		text-align: center;
		border-bottom: var(--border);
	}

	.logo {
		grid-area: logo;
		display: flex;
		align-items: center;
		padding: 1rem;
	}

	.menu {
		grid-area: menu;
		padding: 1rem;
	}

	.menu ul {
		display: flex;
		gap: 2rem;
		list-style: none;
		justify-content: flex-end;
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
	}
	.launch button {
		background: var(--accent);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}

	.launch button:hover {
		opacity: 0.9;
	}

	.marquee {
		grid-area: marquee;
		padding: 1rem;
		background: var(--accent);
		color: white;
		overflow: hidden;
		white-space: nowrap;
	}

	.marquee p {
		animation: scroll 20s linear infinite;
	}

	.main {
		grid-area: main;
		padding: 2rem;
	}

	.bottom {
		grid-area: bottom;
		padding: 1rem;
		text-align: center;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
	}

	@keyframes scroll {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(-100%);
		}
	}
</style>
