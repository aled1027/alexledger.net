<script lang="ts">
	//
	// 
	//

	let shows = $state([
		{
			title: '99% Invisible',
			url: 'https://example.com',
			numUnwatched: 1,
			episodes: [
				{
					title: 'The Power Broker 1',
					state: 'unwatched',
					isSaved: false
				},
				{
					title: 'The Power Broker 2',
					state: 'watched',
					isSaved: true
				}
			]
		},
		{
			title: 'The Daily',
			url: 'https://example.com',
			numUnwatched: 0,
			episodes: [
				{
					title: 'New Drug Cures Cancer',
					state: 'unwatched',
					isSaved: true
				},
				{
					title: 'Snowstorm in Boston',
					state: 'unwatched',
					isSaved: false
				}
			]
		},
		{
			title: 'The Zach Lowe Show',
			url: 'https://example.com',
			numUnwatched: 0,
			episodes: [
				{
					title: 'Lebron or Luka. Who gets the ball',
					state: 'watched',
					isSaved: false
				},
				{
					title: 'Steph Curry. Steph Curry.',
					state: 'watched',
					isSaved: false
				}
			]
		}
	]);
	let selectedShowIdx = $state(0);
	let selectedEpisodeIdx: null | number = $state(null);

	let selectedShow = $derived(shows[selectedShowIdx]);
	let selectedEpisode = $derived(
		selectedEpisodeIdx !== null ? selectedShow.episodes[selectedEpisodeIdx] : null
	);

	function toggleSaved() {
		if (selectedEpisodeIdx !== null) {
			shows[selectedShowIdx].episodes[selectedEpisodeIdx].isSaved =
				!shows[selectedShowIdx].episodes[selectedEpisodeIdx].isSaved;
		}
	}

	function setState(newState: string) {
		if (selectedEpisodeIdx !== null) {
			shows[selectedShowIdx].episodes[selectedEpisodeIdx].state = newState;
		}
		let numUnwatched = 0;
		for (const e of shows[selectedShowIdx].episodes) {
			if (e.state === 'unwatched') {
				numUnwatched += 1;
			}
		}
		shows[selectedShowIdx].numUnwatched = numUnwatched;
	}
</script>

<div class="mt-l">
	<h1>Podcasts</h1>
	<p>Not mobile friendly</p>
	<div class="layout mt-m">
		<div class="shows">
			{#each shows as show, showIdx}
				<button
					class="show"
					data-selected={showIdx === selectedShowIdx}
					onclick={() => {
						selectedShowIdx = showIdx;
						if (shows[selectedShowIdx].episodes.length > 0) {
							selectedEpisodeIdx = 0;
						} else {
							selectedEpisodeIdx = null;
						}
					}}
				>
					<span>{show.title}</span>
					<span class="badge">{show.numUnwatched}</span>
				</button>
			{/each}
		</div>
		<div class="episodes">
			{#each selectedShow.episodes as episode, episodeIdx}
				<button
					data-state={episode.state}
					class="episode"
					data-selected={episodeIdx === selectedEpisodeIdx}
					onclick={() => {
						selectedEpisodeIdx = episodeIdx;
					}}
				>
					<span>{episode.title}</span>
				</button>
			{/each}
		</div>
		<div class="focus-area">
			{#if selectedEpisode}
				<div class="actions">
					{#if selectedEpisode.state === 'watched'}
						<button data-type="action" onclick={() => setState('unwatched')}>mark unwatched</button>
					{:else}
						<button data-type="action" onclick={() => setState('watched')}>mark watched</button>
					{/if}
					{#if selectedEpisode.isSaved}
						<button data-type="action" onclick={toggleSaved}>unsave this episode</button>
					{:else}
						<button data-type="action" onclick={toggleSaved}>save this episode</button>
					{/if}
				</div>
				<div class="mt-s">
					<span>{selectedShow.title}</span>
					<h4 class="mt-3xs">{selectedEpisode.title}</h4>
				</div>
			{:else}
				<span>No episode selected</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: 300px 300px 1fr;
		gap: 0;
		margin-bottom: 30vh;
		border-collapse: collapse;
		background: var(--color-gray-100);
		text-wrap: pretty;
	}

	.shows,
	.episodes {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		border: 1px solid var(--color-gray-600);
	}

	.episodes > * {
		border-bottom: 1px solid var(--color-gray-600);
	}

	button {
		cursor: pointer;
		background: var(--color-gray-100);
		border: none;
	}
	button:hover {
		background: var(--color-gray-300);
	}
	button[data-type='action'] {
		border: 1px solid var(--color-gray-600);
		border-radius: 0.5rem;
		padding: 0.25rem 0.5rem;
	}
	button[data-type='action']:active {
		scale: 0.97;
	}

	.show {
		min-height: 1.5lh;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-inline: 1ch;
		padding-block: 0.5lh;
		&[data-selected='true']:not(:hover) {
			background: var(--color-gray-200);
		}
	}

	.episode {
		padding-inline-end: 1ch;
		min-height: 3lh;
		display: flex;
		align-items: center;
		text-align: left;
		&[data-selected='true']:not(:hover) {
			background: var(--color-gray-200);
		}
	}

	.episode::before {
		content: '';
		height: 1ch;
		width: 1ch;
		background: steelblue;
		border-radius: 100%;
		margin-inline: 1ch;
	}

	.episode[data-state='watched']::before {
		opacity: 40%;
	}

	.focus-area {
		padding: 1rem;
		border: 1px solid var(--color-gray-600);
		min-height: 30vh;
	}

	.actions {
		display: flex;
		gap: 1rem;
	}

	.badge {
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-size: 0.75em;
		background: #4781B455;
	}

</style>
