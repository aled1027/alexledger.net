<script lang="ts">
	const logo1 = 'https://picsum.photos/id/231/200';
	const logo2 = 'https://picsum.photos/id/232/200';
	const logo3 = 'https://picsum.photos/id/233/200';
	const logo4 = 'https://picsum.photos/id/234/200';
	const logo5 = 'https://picsum.photos/id/235/200';
	const logo6 = 'https://picsum.photos/id/236/200';
</script>

<div class="mt-l">
	<h1>Marquee</h1>
	<p>
		<a
			target="_blank"
			href="https://github.com/aled1027/alexledger.net/tree/main/src/routes/demos/marquee/%2Bpage.svelte"
			>Demo code</a
		>
	</p>
	<p>
		This is a marquee effect that scrolls logos, or this demo images, from right to left. This
		version is built with only html and CSS. (It's in a svelte repo, but no svelte features are
		used.) On hover, the images grow and rotate.
	</p>
	<p>
		I used this marquee implementation in the <a target="_blank" href="https://metrion.space"
			>metrion.space</a
		> "TRUSTED BY" section.
	</p>
</div>

<div class="marquee mt-xl">
	<div class="marquee__content marquee__scroll">
		<div>
			<img src={logo1} alt="Logo 1" />
		</div>
		<div>
			<img src={logo2} alt="Logo 2" />
		</div>
		<div>
			<img src={logo3} alt="Logo 3" />
		</div>
		<div>
			<img src={logo4} alt="Logo 4" />
		</div>
		<div>
			<img src={logo5} alt="Logo 5" />
		</div>
		<div>
			<img src={logo6} alt="Logo 5" />
		</div>
	</div>
	<div class="marquee__content marquee__scroll">
		<div>
			<img src={logo1} alt="Logo 1" />
		</div>
		<div>
			<img src={logo2} alt="Logo 2" />
		</div>
		<div>
			<img src={logo3} alt="Logo 3" />
		</div>
		<div>
			<img src={logo4} alt="Logo 4" />
		</div>
		<div>
			<img src={logo5} alt="Logo 5" />
		</div>
		<div>
			<img src={logo6} alt="Logo 6" />
		</div>
	</div>
</div>

<style>
	.marquee {
		--marquee-gutter: 60px;
		--marquee-item-width: 250px;
		--marquee-item-height: 180px;
		--marquee-scroll-duration: 15s;
		--marquee-gradient-color: var(--body-bg);

		display: flex;
		align-items: stretch;
		justify-content: space-between;
		grid-column-gap: var(--marquee-gutter);
		grid-row-gap: var(--marquee-gutter);
		width: 100%;
		max-width: 100vw;
		overflow: hidden;
		position: relative;
		padding: 40px 0; /* Add padding to ensure hover effects don't get cut off */
	}

	.marquee::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			var(--marquee-gradient-color) 0%,
			transparent 35%,
			transparent 65%,
			var(--marquee-gradient-color) 100%
		);
		pointer-events: none;
	}

	.marquee__content {
		grid-column-gap: var(--marquee-gutter);
		flex-flow: row;
		flex: none;
		justify-content: space-around;
		align-items: stretch;
		min-width: 100%;
		display: flex;
	}

	.marquee__content > div {
		width: var(--marquee-item-width);
		height: var(--marquee-item-height);
		transition: transform 0.3s ease;
		position: relative; /* Ensure z-index works properly */
	}

	.marquee__content > div:hover {
		transform: scale(1.1) rotate(5deg);
		z-index: 1;
		cursor: pointer;
	}

	.marquee__content img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 8px;
	}

	.marquee__scroll {
		animation: marquee__scroll var(--marquee-scroll-duration) linear infinite;
	}

	@keyframes marquee__scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-100% - var(--marquee-gutter)));
		}
	}

	p {
		max-width: 55rem;
	}
</style>
