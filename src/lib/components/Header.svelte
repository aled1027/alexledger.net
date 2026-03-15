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
			label: 'Other',
			href: '/other',
			isCurrent: currentPage === '/other'
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

	// CSS custom-property inputs for the radial reveal animation.
	let menuCenterX = $state(0);
	let menuCenterY = $state(0);
	let menuRadius = $state(0);
	let menuMinRadius = $state(0);

	function updateVariables() {
		menuCenterX = window.innerWidth;
		menuCenterY = 0;
		// Radius must be large enough to reach the furthest viewport corner.
		menuRadius = Math.hypot(window.innerWidth, window.innerHeight);
	}

	function toggleMenu() {
		updateVariables();
		isMenuExpanded = !isMenuExpanded;
	}

	onMount(() => {
		updateVariables();
		// Don't set for this 1 second after load to prevent some flashing
		setTimeout(() => {
			menuMinRadius = 120;
		}, 1000);
	});

	onNavigate(() => {
		isMenuExpanded = false;
	});

	$effect(() => {
		// Lock background scrolling while the fullscreen menu is open.
		document.body.style.overflow = isMenuExpanded ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<header class="header">
	<a class="skip-link visually-hidden" href="#content">Skip to main content</a>
	<div class="header__inner">
		<a href="/">Alex Ledger</a>
		<button
			class="button menu-toggle"
			data-type="ghost"
			type="button"
			aria-label={isMenuExpanded ? 'Close menu' : 'Open menu'}
			aria-controls="primary-nav"
			aria-expanded={isMenuExpanded}
			data-expanded={isMenuExpanded}
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
	class="header__nav"
	id="primary-nav"
	data-visible={isMenuExpanded}
	style={`--menu-origin-x: ${menuCenterX}px; --menu-origin-y: ${menuCenterY}px; --menu-radius: ${menuRadius}px; --menu-min-radius: ${menuMinRadius}px;`}
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
	.header {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: var(--z-header-inner);
		color: #fff;
		mix-blend-mode: difference;
	}

	.header__inner {
		display: flex;
		align-items: center;
	}

	.header__inner .menu-toggle {
		border: none;
		color: currentColor;
	}

	.header__inner .menu-toggle .menu-icon {
		display: block;
		width: 1.5rem;
		height: 1.5rem;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
	}

	.header__inner .menu-toggle .line {
		transform-box: fill-box;
		transform-origin: center;
		transition:
			transform 200ms ease,
			opacity 200ms ease;
	}

	.header__inner .menu-toggle[data-expanded='true'] .line--top {
		transform: translateY(6px) rotate(45deg);
	}

	.header__inner .menu-toggle[data-expanded='true'] .line--middle {
		opacity: 0;
	}

	.header__inner .menu-toggle[data-expanded='true'] .line--bottom {
		transform: translateY(-6px) rotate(-45deg);
	}

	.header__inner a {
		color: currentColor;
		text-decoration: none;
	}

	.header__nav {
		position: fixed;
		z-index: var(--z-header-nav);
		inset: 0;
		background: var(--color-gray-900);
		color: var(--color-gray-100);

		// Keep a small visible circle at the button center when collapsed.
		// that's what menu-min-radius does
		// Don't set menu-min-radius directly, set it in onMount, so we dont get a flash
		// on page load
		clip-path: circle(var(--menu-min-radius) at var(--menu-origin-x) var(--menu-origin-y));
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		will-change: clip-path, opacity;
		transition:
			clip-path 500ms ease-in,
			// Fade only near the end so close feels less jumpy.
			opacity 300ms ease-in 350ms,
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

	.header__nav[data-visible='true'] {
		// Expand to the computed viewport-covering radius.
		clip-path: circle(var(--menu-radius) at var(--menu-origin-x) var(--menu-origin-y));
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
		transition:
			clip-path 500ms ease-out,
			opacity 300ms ease-out,
			visibility 0ms;
	}

	@media (max-width: 48rem) {
		// On small viewports, disable the clip-path reveal and make open/close instant.
		.header__nav {
			clip-path: none;
			will-change: auto;
			transition: none;
		}

		.header__nav[data-visible='true'] {
			clip-path: none;
			transition: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.header__nav,
		.header__nav[data-visible='true'] {
			clip-path: none;
			transition: none;
		}
	}
</style>
