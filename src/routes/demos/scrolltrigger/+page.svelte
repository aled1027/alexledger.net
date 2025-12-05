<script lang="ts">
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/ScrollTrigger';

	let headerHeight = $state(0);

	ScrollTrigger.defaults({
		toggleActions: 'restart pause resume none',
		markers: true
	});
	gsap.registerPlugin(ScrollTrigger);

	$effect(() => {
		// Set header height as a CSS variable
		headerHeight = document.querySelector('.site-header')?.clientHeight ?? 0;
		document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
	});

	$effect(() => {
		const panels: HTMLElement[] = gsap.utils.toArray('.panel');
		panels.forEach((panel, index) => {
			// Calculate end point: for rolodex effect, each panel should unpin
			// when the next panel's bottom reaches the top
			let end: number;
			if (index < panels.length - 1) {
				// For all panels except the last, unpin when next panel's bottom reaches the top
				const nextPanel = panels[index + 1];
				const nextPanelRect = nextPanel.getBoundingClientRect();
				const nextPanelBottom = nextPanelRect.bottom + window.scrollY;
				end = nextPanelBottom - headerHeight;
			} else {
				// Last panel: unpin when its own bottom reaches the top
				const panelRect = panel.getBoundingClientRect();
				const panelBottom = panelRect.bottom + window.scrollY;
				end = panelBottom - headerHeight;
			}

			gsap.to(panel, {
				scrollTrigger: {
					trigger: panel,
					start: `top ${headerHeight}px`,
					end: end,
					pin: true,
					pinSpacing: false
				}
			});

			const content = panel.querySelector('h2');
			gsap.to(content, {
				opacity: 1,
				scrollTrigger: {
					trigger: panel,
					start: `top ${headerHeight}px`,
					end: '+=50%',
					scrub: true,
					markers: true
				}
			});
		});
	});
</script>

<div class="panel-container">
	<div class="panel a" style="background: red"><h2>A</h2></div>
	<div class="panel b" style="background: blue"><h2>B</h2></div>
	<div class="panel c" style="background: yellow"><h2>C</h2></div>
</div>
<p>More content!</p>

<style lang="scss">
	.panel {
		height: calc(100vh - var(--header-height, 0px));
		width: 100vw;
		margin-inline: calc(50% - 50vw);
		border: 1px solid black;
		margin-block-end: 200%;
	}


	h2 {
		opacity: 0;
	}
</style>
