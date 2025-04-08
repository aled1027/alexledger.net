<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	// - Use maine coon color palette
	// 1. Each row is a week in Lucca's life
	// 2. Stack rows vertically
	// 3. On click, see photos in a gallery
	// 4. Annotate notable events with popover api
	const baseImageUrl = 'https://assets.knowportland.org/lucca-2025/';
	const imageNames = Array.from({ length: 52 }, (_, i) => `${i + 9}.webp`).map(
		(name) => `${baseImageUrl}${name}`
	);

	let curImage: string | null = $state(null);

	function handleKeyDown(event: KeyboardEvent) {
		if (!curImage) return;
		const curImageIndex = imageNames.indexOf(curImage);
		if (event.key === 'ArrowLeft') {
			const newIndex = curImageIndex > 0 ? curImageIndex - 1 : imageNames.length - 1;
			curImage = imageNames[newIndex];
		} else if (event.key === 'ArrowRight') {
			const newIndex = curImageIndex < imageNames.length - 1 ? curImageIndex + 1 : 0;
			curImage = imageNames[newIndex];
		} else if (event.key === 'Escape') {
			curImage = null;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeyDown);
	});
</script>

{#if curImage}
	<dialog open>
		<img src={curImage} alt="Lucca" />
		<button onclick={() => (curImage = null)}>Close</button>
	</dialog>
{/if}

<section class="flow">
	<h1>Lucca</h1>
	<p>
		Lucca was a Maine coon mix with a explorer's energy. He would wander the halls of the house,
		exploring every nook and cranny, not wanting to leave anything to the unknown. When stressed, he
		would meow up at corners, try to get as high as possible, and at times, spray to leave his scent
		so all knew of his presence. When happy, he would lie in the sun in his cat tree, eat until he
		could eat no more, and groom his younger brother Rilke.
	</p>
	<p>
		Lucca lived to be over 17 years old. In his final days, he suffered from irritable bowel disease
		and a cancerous growth on the bridge of his nose. He continued to do many of the things that
		made him happiest until his final days, when the pain from his disease overwhelmed him.
	</p>
	<p>
		In his last afternoon, he sat on Cat's lap for a few hours, his head hanging off the side, which
		seemed to the most comfortable for his body at the time. He was calm most of the day, even
		though it wouldn't be described as a good day.
	</p>
	<p>
		One of my favorite Lucca memories was from 2022. We lived in the second floor of an apartment
		building near east Burnside in Portland, Oregon. One evening Lucca made it past our backdoor and
		found himself in the stairwell. He ran down the stairs with his trademark trill rhythmically
		moving up and down when step as he took. He reached bottom of the stairwell and encountered a
		door. With nowhere else to go, he ran back up the stairs, trilling the whole way back up, <em
			>trrl trrrl</em
		> until he returned to the apartment.
	</p>
	<p>
		When Lucca was young, he got into a scuffle with some neighborhood cats and ended up with a claw
		in his eyeball. His owner at the time opted to have his eye surgically corrected instead of
		enucleated (removed). His owner says:
	</p>
	<blockquote>
		The former option would have meant no more outdoor time for him which, as y'all well know, would
		not have worked well with Lucca's adventurous spirit (very glad we opted for surgery and that it
		went as well as it did).
	</blockquote>
	<div class="grid mt-xl">
		{#each imageNames as imageName}
			<button onclick={() => (curImage = imageName)}>
				<img src={imageName} alt="Lucca" />
			</button>
		{/each}
	</div>
</section>

<style>
	p,
	blockquote {
		max-width: 65ch;
		text-wrap: pretty;
	}

	blockquote {
		padding-inline-start: 1em;
		border-inline-start: 2px solid black;
	}
	button {
		border: none;
		background: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
	}

	dialog {
		border: none;
		background: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
		/* overflow: hidden; */
		position: fixed;
		inset: 0;
		top: 0;
		z-index: 100;
		height: 100vh;
		width: 100vw;
		display: grid;
		place-content: center;
		background: rgba(0, 0, 0, 0.5);
	}

	dialog img {
		max-width: 90vw;
		max-height: 90vh;
	}

	dialog button {
		background: white;
		padding-inline: 1.5em;
		padding-block: 1em;
		border: none;
		cursor: pointer;
		font-size: 1.5rem;
	}

	img {
		transition: 0.3s all;
		border-radius: 2px;
	}

	:not(dialog) img:hover {
		scale: 1.05;
	}
</style>
