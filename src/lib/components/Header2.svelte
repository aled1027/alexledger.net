<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';

	// A good, but dense, guide for menus is this:
	// https://piccalil.li/blog/build-a-fully-responsive-progressively-enhanced-burger-menu/
	const currentPage = $derived(page.url.pathname);
	const navItems = $derived([
		{
			label: 'Home',
			href: '/',
			isCurrent: currentPage === '/'
		},
		{
			label: 'Demos',
			href: '/demos',
			isCurrent: currentPage === '/demos'
		},
		{
			label: 'About',
			href: '/about',
			isCurrent: currentPage === '/about'
		},
		{
			label: 'Contact',
			href: '/contact',
			isCurrent: currentPage === '/contact'
		}
	]);
	let isMenuExpanded = $state(false);

	onNavigate(() => {
		isMenuExpanded = false;
	});
</script>

<header class="header2">
	<a class="skip-link visually-hidden" href="#content">Skip to main content</a>
	<div class="header2__inner">
		<a href="/">Alex Ledger</a>
		<button
			class="button menu-toggle"
			data-type="ghost"
			type="button"
			aria-label={isMenuExpanded ? 'Close menu' : 'Open menu'}
			aria-controls="primary-nav"
			aria-expanded={isMenuExpanded}
			data-expanded={isMenuExpanded}
			onclick={() => (isMenuExpanded = !isMenuExpanded)}
		>
			<svg class="menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<line class="line line--top" x1="3" y1="6" x2="21" y2="6" />
				<line class="line line--middle" x1="3" y1="12" x2="21" y2="12" />
				<line class="line line--bottom" x1="3" y1="18" x2="21" y2="18" />
			</svg>
		</button>
	</div>

	<nav class="header2__nav" id="primary-nav" data-visible={isMenuExpanded}>
		<ul role="list">
			{#each navItems as item (item.href)}
				<li>
					<a href={item.href} data-current={item.isCurrent}>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style lang="scss">
	.header2 {
		--z-header: 100;

		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: var(--z-header);
		color: #fff;
		mix-blend-mode: difference;
	}

	.header2__inner {
		display: flex;
		align-items: center;
		color: inherit;
	}

	.header2__inner .menu-toggle {
		border: none;
		color: currentColor;
	}

	.header2__inner .menu-toggle .menu-icon {
		display: block;
		width: 1.5rem;
		height: 1.5rem;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
	}

	.header2__inner .menu-toggle .line {
		transform-box: fill-box;
		transform-origin: center;
		transition:
			transform 200ms ease,
			opacity 200ms ease;
	}

	.header2__inner .menu-toggle[data-expanded='true'] .line--top {
		transform: translateY(6px) rotate(45deg);
	}

	.header2__inner .menu-toggle[data-expanded='true'] .line--middle {
		opacity: 0;
	}

	.header2__inner .menu-toggle[data-expanded='true'] .line--bottom {
		transform: translateY(-6px) rotate(-45deg);
	}

	.header2__inner a {
		color: currentColor;
		text-decoration: none;
	}

	.header2__nav {
		display: none;
	}

	.header2__nav[data-visible='true'] {
		display: block;
		position: fixed;
		z-index: calc(var(--z-header) - 1);
		inset: 0;
		// TODO: can make this radiate out
		background: var(--body-bg);

		& ul {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 1rem;
			height: 100%;
		}

		& a {
			text-decoration: none;
		}

		& a:hover {
			text-decoration: underline;
		}
	}
</style>
