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
	let isHome = $derived(currentPage === '/');

	onNavigate(() => {
		isMenuExpanded = false;
	});
</script>

<header class="site-header">
	<div class="site-header__inner repel" data-is-home={isHome}>
		<a class="skip-link visually-hidden" href="#content">Skip to main content</a>
		<div class="site-header__logo">
			<a href="/" class="site-header__logo-link">Alex Ledger</a>
		</div>
		<div class="site-header__nav-wrapper">
			<button
				class="site-header__nav-toggle"
				type="button"
				aria-label={isMenuExpanded ? 'Close menu' : 'Open menu'}
				aria-controls="primary-nav"
				aria-expanded={isMenuExpanded}
				onclick={() => (isMenuExpanded = !isMenuExpanded)}
			>
				<span class="visually-hidden" aria-hidden="true">Menu</span>
				{#if isMenuExpanded}
					<X color="#000" />
				{:else}
					<Menu color="#000" />
				{/if}
			</button>
			<nav class="site-header__nav" id="primary-nav">
				<ul role="list" class="site-header__nav-list" data-visible={isMenuExpanded}>
					{#each navItems as item}
						<li>
							<a href={item.href} data-current={item.isCurrent} class="site-header__nav-list-item">
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	</div>
</header>
