<script lang="ts">
	import Family from '$lib/assets/family.jpg';
	import LuccaAndRilke from '$lib/assets/lucca-and-rilke.png';
	import Lucca from '$lib/assets/lucca.png';
	import { onDestroy, onMount } from 'svelte';

	// - Use maine coon color palette
	// 1. Each row is a week in Lucca's life
	// 2. Stack rows vertically
	// 3. On click, see photos in a gallery
	// 4. Annotate notable events with popover api
	const baseImageUrl = 'https://assets.knowportland.org/Lucca/';
	const imageNames = Array.from({ length: 37 }, (_, i) => `${i}.webp`).map((name) => `${name}`);

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

	// onMount(() => {
	// 	window.addEventListener('keydown', handleKeyDown);
	// });

	// onDestroy(() => {
	// 	window.removeEventListener('keydown', handleKeyDown);
	// });

	const transformations = {
		'2.webp': 'transform: rotate(180deg)',
		'3.webp': 'transform: rotate(90deg)',
		'5.webp': 'transform: rotate(-90deg)',
		'8.webp': 'transform: rotate(180deg)',
		'9.webp': 'transform: rotate(180deg)',
		'28.webp': 'transform: rotate(90deg)'
	};
</script>

{#if curImage}
	<dialog open>
		<img src={baseImageUrl + curImage} alt="Lucca" style={transformations[curImage] ?? {}} />
		<button onclick={() => (curImage = null)}>Close</button>
	</dialog>
{/if}

<!-- TODO: add when lucca came into our lives and his years somewhere -->
<svelte:window onkeydown={handleKeyDown} />
<section class="flow">
	<div class="story flow">
		<h1>Lucca<span class="small-h1">(2007 to 2025)</span></h1>
		<span class="sub-heading">Lucca is always right</span>
		<p>
			Lucca was a Maine coon mix with an explorer's energy. He would wander the halls of the house,
			exploring every nook and cranny, not wanting to leave anything to the unknown. When stressed,
			he would meow up at corners, try to get as high as possible, and at times, spray to leave his
			scent so all knew of his presence. When happy, he would lie in the sun in his cat tree, eat
			until he could eat no more, and groom his younger brother Rilke.
		</p>
		<figure>
			<img src={Lucca} alt="Lucca on his cat tree bathing in the sun" />
			<figcaption>Lucca on his cat tree bathing in the sun.</figcaption>
		</figure>

		<p>
			One of my favorite Lucca memories is from 2022. We lived in the second floor of an apartment
			building near east Burnside in Portland, Oregon. One evening Lucca made it past our backdoor
			and found himself in the stairwell. He ran down the stairs with his trademark trill
			rhythmically bouncing up and down when step as he took. He reached bottom of the stairwell and
			encountered a door. With nowhere else to go, he ran back up the stairs, trilling the whole way
			back up, <em>trrl trrrl</em> until he returned to the apartment.
		</p>
		<figure>
			<img src={LuccaAndRilke} alt="Lucca and Rilke lying on a bed" />
			<figcaption>Lucca (left) and his brother Rilke (right) in September 2023.</figcaption>
		</figure>
		<p>
			When Lucca was young, he got into a scuffle with some neighborhood cats and ended up with a
			claw in his eyeball. His owner at the time opted to have his eye surgically corrected instead
			of enucleated (removed). His owner says:
		</p>
		<blockquote>
			The former option would have meant no more outdoor time for him which, as y'all well know,
			would not have worked well with Lucca's adventurous spirit (very glad we opted for surgery and
			that it went as well as it did).
		</blockquote>
		<p>
			Lucca was there on the best day of my life. On a night in June 2019, we sat on the couch in
			our living room and my partner Cat turned to me and said, "well we're all here". I was
			confused, and Cat said, "you, me, Lucca, and Rilke". That was my family. Through covid,
			surgeries, moving cross country, depression, anxiety, and everything life throws at you, we
			did it the four of us.
		</p>
		<figure>
			<img src={Family} alt="Lucca, Rilke,Cat, and me" />
			<figcaption>Lucca, Rilke, Cat, and me (Alex) on our couch in December 2018.</figcaption>
		</figure>
		<p>
			It took Cat and me a while to realize a fundamental truth: <em>Lucca is always right</em>.
			When Lucca refused to eat his food, and we would try everything we could to get him to eat, he
			was the one who was right: the food was utter crap and bad for him. Lucca had an instinct for
			people; when he'd warm to someone quickly, we knew they were kind and careful and someone we
			could trust. And even at the end, Lucca knew well before we did what was happening.
		</p>
		<p>
			Lucca lived to be over 17 years old. In his final days, he suffered from irritable bowel
			disease and a cancerous growth on the bridge of his nose. He continued to do many of the
			things that made him happiest until his last moments.
		</p>
		<figure>
			<video controls muted>
				<source src="/lucca-on-cats-legs.webm" type="video/webm" />
			</video>
			<figcaption>In Lucca's final afternoon, he lied on Cat's legs.</figcaption>
		</figure>
		<p>
			In his last afternoon, Lucca sat on Cat's lap for a few hours, his head hanging off the side,
			which seemed to the most comfortable position for his body at the time. Right before 7pm on
			April 7, 2025, Lucca took his final breaths.
		</p>
		<p>
			It's a needless detail for an obituary like this, but: He was lying on his rectangular
			cardboard in front of the couch when the vet arrived. He got up, greeted her, and then
			returned to his cardboard to lie down. Those were his last steps, his last greeting. Exploring
			until the very end.
		</p>
		<!-- Footnotes -->
		<p>
			Cat and I learned so much from Lucca. We learned how to be confident in ourselves, our
			feelings, and our situation. We learned how it's okay to feel anxious but still engage with
			the situation. We learned that it's good to express our anxieties and frustrations in way's
			that are natural to us. And we learned how to work with and interpret someone with such a
			strong sense of self and self-interest.
		</p>
	</div>
	<div class="gallery grid mt-xl">
		{#each imageNames as imageName}
			<button class="image-container" onclick={() => (curImage = imageName)}>
				<img src={baseImageUrl + imageName} alt="Lucca" style={transformations[imageName] ?? {}} />
			</button>
		{/each}
	</div>
</section>

<style>
	.story {
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
		transition: 0.3s scale;
		border-radius: 2px;
	}

	.story img {
		width: auto;
		max-height: 450px;
		margin-inline: auto;
		object-fit: contain;
	}

	.gallery .image-container {
		overflow: hidden;
		transition: 0.3s all;
		width: 100%;
		height: 100%;
		aspect-ratio: 1.2/1;
	}

	.gallery img {
		width: 100%;
		height: 100%;
		aspect-ratio: 1.2/1;
		object-fit: cover;
		object-position: center;
	}

	.gallery .image-container:hover {
		scale: 1.05;
	}

	.sub-heading {
		font-weight: 600;
		text-transform: uppercase;
		font-size: 0.875rem;
	}

	.story video {
		margin-inline: auto;
		max-width: 600px;
	}

	figcaption {
		font: inherit;
		font-size: 0.875em;
		text-align: center;
		margin-inline: auto;
	}

	.small-h1 {
		font-size: 1.5rem;
		margin-inline-start: 1ch;
	}
</style>
