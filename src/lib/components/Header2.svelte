<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { Menu, X } from '@lucide/svelte';

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
			onclick={() => (isMenuExpanded = !isMenuExpanded)}
		>
			{#if isMenuExpanded}
				<X color="#000" />
			{:else}
				<Menu color="#fff" />
			{/if}
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
		--z-header-menu: 101;
		--z-header-menu-button: 102;

		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: var(--z-header);
	}

	.header2__inner {
		display: flex;
		align-items: center;
	}

	.header2__inner .menu-toggle {
		border: none;
		z-index: var(--z-header-menu-button);
	}

	.header2__inner a {
		color: white;
		text-decoration: none;
	}

	.header2__nav {
		display: none;
	}

	.header2__nav[data-visible='true'] {
		display: block;
		position: fixed;
		z-index: var(--z-header-menu);
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
