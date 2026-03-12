<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

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
	let menuToggleButton: HTMLButtonElement | null = null;
	// CSS custom-property inputs for the radial reveal animation.
	let menuCenterX = $state(0);
	let menuCenterY = $state(0);
	let menuRadius = $state(0);

	function toggleMenu() {
		isMenuExpanded = !isMenuExpanded;
	}

	onMount(() => {
		if (menuToggleButton) {
			const { left, top, width, height } = menuToggleButton.getBoundingClientRect();
			// Reveal should originate from the center of the menu button.
			const centerX = left + width / 2;
			const centerY = top + height / 2;

			menuCenterX = centerX;
			menuCenterY = centerY;
			// Radius must be large enough to reach the furthest viewport corner.
			menuRadius = Math.hypot(
				Math.max(centerX, window.innerWidth - centerX),
				Math.max(centerY, window.innerHeight - centerY)
			);
		}
	});

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
			bind:this={menuToggleButton}
			onclick={toggleMenu}
		>
			<svg class="menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<line class="line line--top" x1="3" y1="6" x2="21" y2="6" />
				<line class="line line--middle" x1="3" y1="12" x2="21" y2="12" />
				<line class="line line--bottom" x1="3" y1="18" x2="21" y2="18" />
			</svg>
		</button>
	</div>
</header>

<nav
	class="header2__nav"
	id="primary-nav"
	data-visible={isMenuExpanded}
	style={`--menu-origin-x: ${menuCenterX}px; --menu-origin-y: ${menuCenterY}px; --menu-radius: ${menuRadius}px;`}
>
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

<style lang="scss">
	.header2 {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: var(--z-header-inner);
		color: #fff;
		mix-blend-mode: difference;
	}

	.header2__inner {
		display: flex;
		align-items: center;
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
		position: fixed;
		z-index: var(--z-header-nav);
		inset: 0;
		background: var(--color-gray-900);
		color: var(--color-gray-100);
		// Keep a small visible circle at the button center when collapsed.
		--menu-min-radius: 5rem;
		clip-path: circle(var(--menu-min-radius) at var(--menu-origin-x) var(--menu-origin-y));
		visibility: hidden;
		pointer-events: none;
		will-change: clip-path;
		// Closing uses the reverse-feeling easing.
		/* --menu-clip-ease: cubic-bezier(0.5, 0, 0.75, 0); */
		transition:
			clip-path 500ms ease-in,
			visibility 0ms linear 500ms;

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

	.header2__nav[data-visible='true'] {
		// Expand to the computed viewport-covering radius.
		clip-path: circle(var(--menu-radius) at var(--menu-origin-x) var(--menu-origin-y));
		visibility: visible;
		pointer-events: auto;
		transition:
			clip-path 500ms ease-out,
			visibility 0ms;
	}

	@media (prefers-reduced-motion: reduce) {
		.header2__nav,
		.header2__nav[data-visible='true'] {
			clip-path: none;
			transition: none;
		}
	}
</style>
