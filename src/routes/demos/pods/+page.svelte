<script lang="ts">
	import '../../../styles/open-props.css';

	// Next:
	// - Connect to RSS feeds
	// --> feed cache. and then store some "user data" about episodes
    //   - like isSaved, state, playback time, etc.
	//   - maybe ad in progress as a state
	// - Support audio player
	// - Remember time in audio player for next time so resuming is good
	// - Support downloading episodes

	let shows = $state([
		{
			title: '99% Invisible',
			icon: '📻',
			numUnread: 3,
			episodes: [
				{
					title: 'Get Played with Roman Mars and Ben Brock Johnson',
					description:
						'Hidden Levels explores the hidden stories behind video games, featuring Heather Anne Campbell (Rick and Morty) and Matt Apodaca discussing controllers, culture, and video games.',
					date: 'Yesterday, October 3rd',
					time: '1:30pm',
					author: 'Heather Anne Campbell, Matt Apodaca, Ben Brock Johnson',
					state: 'unwatched',
					isSaved: false,
					tags: ['video games', 'design', 'storytelling']
				},
				{
					title: 'The Power Broker #13: Drop Dead City',
					description:
						'In a Colorado meatpacking town, refugees fleeing persecution find themselves in some of the most dangerous jobs in America.',
					date: 'Tuesday, September 23rd',
					time: '1:30pm',
					author: 'Elliott Kalan',
					state: 'unwatched',
					isSaved: true,
					tags: ['labor', 'immigration', 'meatpacking']
				},
				{
					title: 'The New Jungle',
					description:
						'This episode was produced in partnership with the Food & Environment Reporting Network, an independent, nonprofit news organization.',
					date: 'September 15th',
					time: '2:00pm',
					author: 'Esther Honig',
					state: 'watched',
					isSaved: false,
					tags: ['food', 'environment', 'labor']
				}
			]
		},
		{
			title: 'The Daily',
			icon: '📰',
			numUnread: 2,
			episodes: [
				{
					title: 'New Drug Cures Cancer',
					description:
						'A breakthrough in cancer treatment shows promising results in early clinical trials.',
					date: 'Today',
					time: '6:00am',
					author: 'Michael Barbaro',
					state: 'unwatched',
					isSaved: true,
					tags: ['health', 'medicine', 'cancer']
				},
				{
					title: 'Snowstorm in Boston',
					description: 'The latest winter weather report and its impact on the Boston area.',
					date: 'Today',
					time: '6:00am',
					author: 'Michael Barbaro',
					state: 'unwatched',
					isSaved: false,
					tags: ['weather', 'boston', 'snow']
				}
			]
		},
		{
			title: 'The Zach Lowe Show',
			icon: '🏀',
			numUnread: 1,
			episodes: [
				{
					title: 'Lebron or Luka. Who gets the ball',
					description: 'Breaking down the clutch time decision making between two NBA superstars.',
					date: 'Monday',
					time: '11:30am',
					author: 'Zach Lowe',
					state: 'unwatched',
					isSaved: false,
					tags: ['basketball', 'lebron', 'luka']
				},
				{
					title: 'Steph Curry. Steph Curry.',
					description:
						"An analysis of Stephen Curry's incredible shooting display and its impact on modern basketball.",
					date: 'Friday',
					time: '11:30am',
					author: 'Zach Lowe',
					state: 'watched',
					isSaved: false,
					tags: ['basketball', 'stephen curry', 'shooting']
				}
			]
		},
		{
			title: 'Marketing Ideas',
			icon: '💡',
			numUnread: 2,
			episodes: [
				{
					title: 'The Psychology of Color in Branding',
					description: 'How colors affect consumer behavior and brand perception.',
					date: 'Wednesday',
					time: '3:00pm',
					author: 'Sarah Miller',
					state: 'unwatched',
					isSaved: false,
					tags: ['psychology', 'branding', 'marketing']
				}
			]
		}
	]);
	let selectedShowIdx = $state(0);
	let selectedEpisodeIdx: null | number = $state(0);

	// Mobile navigation state
	let mobileView = $state<'feeds' | 'episodes' | 'details'>('feeds');

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
		let numUnread = 0;
		for (const e of shows[selectedShowIdx].episodes) {
			if (e.state === 'unwatched') {
				numUnread += 1;
			}
		}
		shows[selectedShowIdx].numUnread = numUnread;
	}
</script>

<div class="full-bleed">
	<div class="podcast-app">
		<!-- Top Bar -->
		<div class="top-bar">
			<div class="user-info">
				<span>Podcasts</span>
				<span class="unread-count">
					{shows.reduce((total, show) => total + show.numUnread, 0)}
				</span>
			</div>
		</div>

		<!-- Main Layout -->
		<div class="main-layout">
			<!-- Left Column: Feeds/Shows -->
			<div class="feeds-column" data-mobile-view={mobileView === 'feeds' ? 'visible' : 'hidden'}>
				<div class="mobile-header">
					<h1>Podcasts</h1>
				</div>
				<div class="feeds-list">
					{#each shows as show, showIdx}
						<button
							class="feed-item"
							data-selected={showIdx === selectedShowIdx}
							onclick={() => {
								selectedShowIdx = showIdx;
								if (shows[selectedShowIdx].episodes.length > 0) {
									selectedEpisodeIdx = 0;
									mobileView = 'episodes';
								} else {
									selectedEpisodeIdx = null;
								}
							}}
						>
							<span class="feed-icon">{show.icon}</span>
							<span class="feed-name">{show.title}</span>
							{#if show.numUnread > 0}
								<span class="badge">{show.numUnread}</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>

			<!-- Middle Column: Episodes -->
			<div
				class="episodes-column"
				data-mobile-view={mobileView === 'episodes' ? 'visible' : 'hidden'}
			>
				<div class="mobile-header">
					<button class="back-btn" onclick={() => (mobileView = 'feeds')}>&larr;</button>
					<h1>{selectedShow.title}</h1>
				</div>
				<div class="episodes-list">
					{#each selectedShow.episodes as episode, episodeIdx}
						<button
							class="episode-item"
							data-state={episode.state}
							data-selected={episodeIdx === selectedEpisodeIdx}
							onclick={() => {
								selectedEpisodeIdx = episodeIdx;
								mobileView = 'details';
							}}
						>
							<div class="episode-indicator" data-state={episode.state}></div>
							<div class="episode-content">
								<h4 class="episode-title">{episode.title}</h4>
								<p class="episode-description">{episode.description}</p>
								<div class="episode-meta">
									<span class="episode-date">{episode.date}, {episode.time}</span>
									<span class="episode-author">· {episode.author}</span>
								</div>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Right Column:
 Episode Details -->
			<div
				class="details-column"
				data-mobile-view={mobileView === 'details' ? 'visible' : 'hidden'}
			>
				<div class="mobile-header">
					<button class="back-btn" onclick={() => (mobileView = 'episodes')}>&larr;</button>
					<h1>Episode Details</h1>
				</div>
				<div class="episode-details-content">
					{#if selectedEpisode}
						<div class="episode-header">
							<div class="episode-title-section">
								<div class="episode-indicator-large" data-state={selectedEpisode.state}></div>
								<h2 class="episode-title-large">{selectedEpisode.title}</h2>
							</div>
							
							<div class="episode-actions-header">
								{#if selectedEpisode.state === 'watched'}
									<button class="action-btn-neutral" onclick={() => setState('unwatched')}
										>Mark as Unread</button
									>
								{:else}
									<button class="action-btn-primary" onclick={() => setState('watched')}
										>Mark as Read</button
									>
								{/if}
								{#if selectedEpisode.isSaved}
									<button class="action-btn-secondary" onclick={toggleSaved}>Unsave</button>
								{:else}
									<button class="action-btn-secondary" onclick={toggleSaved}>Save</button>
								{/if}
							</div>
							
							<div class="episode-meta-large">
								{selectedEpisode.date}, {selectedEpisode.time} · {selectedEpisode.author}
							</div>
							<div class="episode-tags">
								{#each selectedEpisode.tags as tag}
									<span class="tag">{tag}</span>
								{/each}
							</div>
						</div>

						<div class="episode-body">
							<p>{selectedEpisode.description}</p>
						</div>
					{:else}
						<div class="no-selection">
							<span>No episode selected</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.podcast-app {
		min-height: 100vh;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: var(--gray-0);
	}

	/* Top Bar */
	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--size-2) var(--size-3);
		background: var(--gray-1);
		border-bottom: var(--border-size-1) solid var(--gray-3);
		font-size: var(--font-size-1);
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: var(--size-2);
	}

	.unread-count {
		color: var(--gray-6);
		font-family: var(--font-mono);
	}

	/* Main Layout */
	.main-layout {
		display: grid;
		grid-template-columns: var(--size-fluid-9) 1fr var(--size-fluid-10);
		height: calc(100vh - var(--size-6));
		background: var(--gray-1);
	}

	/* Left Column - Feeds */
	.feeds-column {
		background: var(--gray-2);
		color: var(--gray-9);
		display: flex;
		flex-direction: column;
		border-right: var(--border-size-1) solid var(--gray-6);
	}

	.feeds-list {
		flex: 1;
		overflow-y: auto;
		padding: var(--size-2) 0;
	}

	.feed-item {
		display: flex;
		align-items: center;
		width: 100%;
		padding: var(--size-2) var(--size-3);
		background: none;
		border: none;
		color: var(--gray-9);
		cursor: pointer;
		text-align: left;
		font-size: var(--font-size-1);
		gap: var(--size-2);
	}

	.feed-item:hover {
		background: var(--gray-4);
	}

	.feed-item[data-selected='true'] {
		background: var(--gray-5);
	}

	.feed-name {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.feed-icon {
		font-size: var(--font-size-2);
		width: var(--size-5);
		text-align: center;
	}

	/* Middle Column - Episodes */
	.episodes-column {
		background: var(--gray-1);
		border-right: var(--border-size-1) solid var(--gray-3);
		overflow-y: auto;
	}

	.episode-item {
		display: flex;
		width: 100%;
		padding: var(--size-3) var(--size-3);
		background: none;
		border: none;
		border-bottom: var(--border-size-1) solid var(--gray-3);
		cursor: pointer;
		text-align: left;
		gap: var(--size-3);
	}

	.episode-item:hover {
		background: var(--gray-2);
	}

	.episode-item[data-selected='true'] {
		background: var(--yellow-3);
	}

	.episode-indicator {
		width: var(--size-3);
		height: var(--size-3);
		border-radius: var(--radius-round);
		flex-shrink: 0;
		margin-top: var(--size-2);
	}

	.episode-indicator[data-state='unwatched'] {
		background: var(--blue-7);
	}

	.episode-indicator[data-state='watched'] {
		background: var(--gray-6);
		opacity: var(--opacity-30);
	}

	.episode-content {
		flex: 1;
		min-width: 0;
	}

	.episode-title {
		font-size: var(--font-size-2);
		font-weight: var(--font-weight-6);
		margin: 0 0 var(--size-1) 0;
		color: var(--gray-8);
		line-height: var(--font-lineheight-2);
	}

	.episode-description {
		font-size: var(--font-size-1);
		color: var(--gray-6);
		margin: 0 0 var(--size-2) 0;
		line-height: var(--font-lineheight-3);
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.episode-meta {
		font-size: var(--font-size-0);
		color: var(--gray-5);
	}

	.episode-date {
		font-weight: var(--weight-5);
	}

	.episode-author {
		color: var(--gray-4);
	}

	/* Right Column - Details */
	.details-column {
		background: var(--gray-2);
		padding: var(--size-5);
		overflow-y: auto;
	}

	.episode-header {
		border-bottom: var(--border-size-1) solid var(--gray-3);
		padding-bottom: var(--size-3);
		margin-bottom: var(--size-3);
	}

	.episode-title-section {
		display: flex;
		align-items: flex-start;
		gap: var(--size-3);
		margin-bottom: var(--size-3);
	}

	.episode-indicator-large {
		width: var(--size-4);
		height: var(--size-4);
		border-radius: var(--radius-round);
		flex-shrink: 0;
		margin-top: var(--size-1);
	}

	.episode-indicator-large[data-state='unwatched'] {
		background: var(--blue-7);
	}

	.episode-indicator-large[data-state='watched'] {
		background: var(--gray-6);
		opacity: var(--opacity-30);
	}

	.episode-title-large {
		font-size: var(--font-size-4);
		font-weight: var(--font-weight-6);
		margin: 0;
		color: var(--gray-9);
		line-height: var(--font-lineheight-2);
		flex: 1;
	}

	.episode-actions-header {
		display: flex;
		gap: var(--size-2);
		margin-bottom: var(--size-2);
		flex-wrap: wrap;
		align-items: stretch;
	}

	.action-btn-primary,
	.action-btn-secondary,
	.action-btn-neutral {
		min-width: 120px;
		text-align: center;
		white-space: nowrap;
	}

	.action-btn-primary,
	.action-btn-neutral {
		min-width: 150px;
	}

	.episode-meta-large {
		font-size: var(--font-size-1);
		color: var(--gray-6);
		margin-bottom: var(--size-3);
	}

	.episode-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-2);
		margin-bottom: var(--size-3);
	}

	.tag {
		background: var(--gray-4);
		color: var(--gray-9);
		padding: var(--size-1) var(--size-2);
		border-radius: var(--radius-3);
		font-size: var(--font-size-0);
		font-weight: var(--font-weight-5);
	}

	.episode-body p {
		font-size: var(--font-size-2);
		line-height: var(--line-height-loose);
		color: var(--gray-7);
		margin-bottom: var(--size-5);
	}

	.action-btn-primary {
		background: var(--blue-6);
		outline: none;
		border: none;
		color: white;
		padding: var(--size-2) var(--size-3);
		border-radius: var(--radius-2);
		font-size: var(--font-size-1);
		font-weight: var(--font-weight-5);
		cursor: pointer;
		transition: background-color var(--t-ratio);
		transition-timing-function: var(--ease-2);
	}

	.action-btn-primary:hover {
		background: var(--blue-7);
	}

	.action-btn-secondary {
		background: var(--gray-1);
		outline: none;
		border: 1px solid var(--gray-4);
		color: var(--gray-7);
		padding: var(--size-2) var(--size-3);
		border-radius: var(--radius-2);
		font-size: var(--font-size-1);
		font-weight: var(--font-weight-4);
		cursor: pointer;
		transition: all var(--t-ratio);
		transition-timing-function: var(--ease-2);
	}

	.action-btn-secondary:hover {
		background: var(--gray-2);
		border-color: var(--gray-5);
		color: var(--gray-8);
	}

	.action-btn-neutral {
		background: var(--gray-1);
		outline: none;
		border: 1px solid var(--gray-4);
		color: var(--gray-7);
		padding: var(--size-2) var(--size-3);
		border-radius: var(--radius-2);
		font-size: var(--font-size-1);
		font-weight: var(--font-weight-4);
		cursor: pointer;
		transition: all var(--t-ratio);
		transition-timing-function: var(--ease-2);
	}

	.action-btn-neutral:hover {
		background: var(--gray-2);
		border-color: var(--gray-5);
		color: var(--gray-8);
	}

	.no-selection {
		display: flex;
		align-items: center;
		justify-content: center;
		height: var(--size-fluid-11);
		color: var(--gray-6);
		font-style: italic;
	}

	.badge {
		background: var(--gray-6);
		color: var(--gray-1);
		font-size: var(--font-size-0);
		font-weight: var(--font-weight-6);
		padding: var(--size-1) var(--size-2);
		border-radius: var(--radius-3);
		min-width: var(--size-5);
		text-align: center;
		flex-shrink: 0;
	}

	/* Mobile Header Styles */
	.mobile-header {
		display: none;
		padding: var(--size-3) var(--size-3);
		border-bottom: var(--border-size-1) solid var(--gray-3);
		background: var(--gray-2);
		align-items: center;
		gap: var(--size-3);
	}

	.mobile-header h1 {
		margin: 0;
		font-size: var(--font-size-3);
		font-weight: var(--font-weight-6);
		color: var(--gray-9);
	}

	.back-btn {
		background: none;
		border: none;
		font-size: var(--font-size-3);
		color: var(--gray-7);
		cursor: pointer;
		padding: var(--size-2);
		border-radius: var(--radius-2);
		transition: background-color var(--t-ratio);
	}

	.back-btn:hover {
		background: var(--gray-4);
	}

	.episodes-list {
		flex: 1;
		overflow-y: auto;
	}

	.episode-details-content {
		flex: 1;
		overflow-y: auto;
		padding: var(--size-3);
	}

	/* Mobile Responsive Design */
	@media (max-width: 768px) {
		.mobile-header {
			display: flex;
		}

		.main-layout {
			grid-template-columns: 1fr;
			height: calc(100vh - var(--size-6));
		}

		.feeds-column,
		.episodes-column,
		.details-column {
			background: var(--gray-1);
			border-right: none;
			border-bottom: none;
			display: flex;
			flex-direction: column;
			height: 100%;
		}

		.feeds-column[data-mobile-view='hidden'],
		.episodes-column[data-mobile-view='hidden'],
		.details-column[data-mobile-view='hidden'] {
			display: none;
		}

		.feeds-list {
			padding: 0;
			flex: 1;
		}

		.feed-item {
			border-bottom: var(--border-size-1) solid var(--gray-3);
		}

		.episode-item {
			border-bottom: var(--border-size-1) solid var(--gray-3);
		}

		.no-selection {
			display: flex;
			align-items: center;
			justify-content: center;
			height: var(--size-fluid-11);
			color: var(--gray-6);
			font-style: italic;
		}

		/* Mobile-specific episode header styling */
		.episode-title-section {
			flex-direction: column;
			gap: var(--size-2);
		}

		.episode-title-large {
			font-size: var(--font-size-3);
		}

		.episode-actions-header {
			gap: var(--size-3);
			justify-content: stretch;
		}

		.action-btn-primary,
		.action-btn-secondary,
		.action-btn-neutral {
			padding: var(--size-2) var(--size-2);
			font-size: var(--font-size-1);
			border-radius: var(--radius-2);
			min-width: unset;
			flex: 1;
		}
	}

	/* Desktop - Ensure mobile elements are hidden */
	@media (min-width: 769px) {
		.mobile-header {
			display: none !important;
		}

		.main-layout {
			/* grid-template-columns: var(--size-fluid-9) var(--size-fluid-10) max(var(--size-fluid-10), auto); */
			grid-template-columns: var(--size-fluid-9) var(--size-fluid-10) auto;
		}

		.feeds-column,
		.episodes-column,
		.details-column {
			display: flex !important;
			flex-direction: column;
		}

		[data-mobile-view='visible'] {
			display: flex !important;
		}

		.feeds-column {
			background: var(--gray-2);
			border-right: var(--border-size-1) solid var(--gray-6);
		}

		.episodes-column {
			background: var(--gray-1);
			border-right: var(--border-size-1) solid var(--gray-3);
		}

		.details-column {
			background: var(--gray-2);
		}

		.feeds-list {
			padding: var(--size-2) 0;
		}

		.feed-item {
			border-bottom: none;
		}

		.episode-item {
			border-bottom: var(--border-size-1) solid var(--gray-3);
		}

		.episode-details-content {
			padding: 0;
		}
	}
</style>
