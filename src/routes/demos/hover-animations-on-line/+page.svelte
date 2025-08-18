<script lang="ts">
	// Based on https://tympanus.net/Development/LineTextHoverAnimations/
	import gsap from 'gsap';
	import { SplitText } from 'gsap/dist/SplitText';
	import { onMount } from 'svelte';

	const lettersAndSymbols = [
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z',
		'!',
		'@',
		'#',
		'$',
		'%',
		'^',
		'&',
		'*',
		'-',
		'_',
		'+',
		'=',
		';',
		':',
		'<',
		'>',
		','
	];

	class TextAnimation {
		node: HTMLElement;
		splitter: globalThis.SplitText;
		originalChars: string[];
		constructor(node: HTMLElement) {
			this.node = node;
			this.splitter = SplitText.create(node, { type: 'words, chars' });
			this.originalChars = this.splitter.chars.slice().map((char) => char.textContent || '');
		}

		randomChar() {
			return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
		}

		animate() {
			this.reset();

			// An animation that for each char:
			// Sets the character to a random letter and symbol every 0.04 seconds
			this.splitter.chars.forEach((char, index) => {
				let isFirstRepeat = true;
				gsap.fromTo(
					char,
					{
						opacity: 0
					},
					{
						onStart: () => {
							char.classList.add('cursor');
							gsap.set(char, { '--cursor-opacity': 1 });
						},
						duration: 0.03,
						delay: (1 + index) * 0.09,
						opacity: 1,
						repeat: 3,
						repeatDelay: 0.04,
						repeatRefresh: true,
						onRepeat: () => {
							let html = this.randomChar();
							if (isFirstRepeat) {
								gsap.set(char, { '--cursor-opacity': 0 });
								isFirstRepeat = false;
							}
							gsap.set(char, { innerHTML: html });
						},

						onComplete: () => {
							gsap.set(char, { innerHTML: this.originalChars[index], delay: 0.15 });
						}
					}
				);
			});
		}

		reset() {
			const chars = this.splitter.chars;
			chars.forEach((char, index) => {
				gsap.killTweensOf(char);
				char.innerHTML = this.originalChars[index];
			});
		}
	}

	// Action for hover
	function hover(node: HTMLElement): Any {
		// We want to do this for each text child of the node
		const children = Array.from(node.children).filter(
			(child) => child instanceof HTMLElement
		) as HTMLElement[];

		const animations = children.map((child) => new TextAnimation(child));

		function onEnter() {
			animations.forEach((animation) => {
				animation.animate();
			});
		}

		node.addEventListener('mouseenter', onEnter);
		return {
			destroy() {
				node.removeEventListener('mouseenter', onEnter);
			}
		};
	}

	onMount(() => {
		gsap.registerPlugin(SplitText);
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
		rel="stylesheet"
	/>

	<style>
	</style>
</svelte:head>

<div class="my-l demo-container">
	<h2 class="size-step-2">Hover Animations on Line</h2>
	<p>
		<a
			target="_blank"
			href="https://github.com/aled1027/alexledger.net/tree/main/src/routes/demos/hover-animations-on-line/%2Bpage.svelte"
			>Demo code</a
		>
	</p>
	<p>Hover over the list items to see the animations.</p>
	<p>
		This was built from Codrop's <a href="https://tympanus.net/Development/LineTextHoverAnimations/"
			>Line Text Hover Animations</a
		>
		demo. I reimplemented what they had to learn more about gsap.
	</p>
	<p>
		The idea behind this is pretty fun. When the user hovers over a list item, a gsap animation
		begins. Where each the text is split using gsap's splittext, and then each character is animated
		to a random letter and symbol. The characters cycle until ending at their original character.
		Further, the animation is staggered, so the characters animate in a wave-like pattern. Finally,
		a little cursor-like element is added to the character to give the feel of a typewriter.
	</p>

	<div class="animation-container">
		<h3 class="mt-l mb-s size-step-1">Volcanic Eruptions</h3>
		<ul class="list">
			<li use:hover class="line-item">
				<span>Mount Vespera</span>
				<span>Planet Thalassa</span>
				<span>2157-03-14</span>
				<span>6</span>
			</li>
			<li use:hover class="line-item">
				<span>Mauna Loa</span>
				<span>Hawaii</span>
				<span>1984-03-25</span>
				<span>4</span>
			</li>
			<li use:hover class="line-item">
				<span>Mount St. Helens</span>
				<span>Washington, USA</span>
				<span>1980-05-18</span>
				<span>5</span>
			</li>
			<li use:hover class="line-item">
				<span>Mount Fuji</span>
				<span>Japan</span>
				<span>1707-12-16</span>
				<span>3</span>
			</li>
			<li use:hover class="line-item">
				<span>Mount Vesuvius</span>
				<span>Italy</span>
				<span>1944-03-18</span>
				<span>4</span>
			</li>
		</ul>
	</div>
</div>

<style lang="scss">
	.demo-container {
		font-family: 'JetBrains Mono', monospace;
		font-optical-sizing: auto;
		font-style: normal;
		text-transform: uppercase;
		font-weight: 400;
		font-size: 1rem;
	}

	p {
		max-width: 85ch;
	}

	.list {
		counter-reset: list-counter;
		list-style: none;
		padding: 0;
	}

	.list li {
		counter-increment: list-counter;
		display: grid;
		grid-template-columns: 1fr 3fr 3fr 2fr 1fr;
		gap: 1em;
		font-weight: 300;
		margin-block-start: 0.325em;
	}

	.list li::before {
		content: counter(list-counter, decimal-leading-zero);
		font-weight: 600;
	}

	:global {
		// Class the variable managed in the gsap code
		.cursor {
			--cursor-opacity: 0;
		}

		.cursor::after {
			content: '';
			height: 1lh;
			width: 1ch;
			background: rgba(0, 0, 0, 0.75);
			position: absolute;
			margin-inline-start: 0em;
			opacity: var(--cursor-opacity);
		}
	}
</style>
