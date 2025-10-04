<script lang="ts">
	import '../../../styles/open-props.css';
	import { onMount } from 'svelte';

	interface Episode {
		title: string;
		description: string;
		date: string;
		time: string;
		author: string;
		state: 'watched' | 'unwatched';
		isSaved: boolean;
		tags: string[];
	}

	interface Show {
		title: string;
		feedUrl?: string;
		icon: string;
		numUnread: number;
		episodes: Episode[];
	}

	interface RSSItem {
		title: string;
		description: string;
		pubDate: string;
		author?: string;
		guid?: string;
	}

	interface RSSFeed {
		title: string;
		description: string;
		items: RSSItem[];
	}

	// RSS Feed Management
	const FEED_CACHE_KEY = 'podcast_feeds_cache';
	const FEED_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

	async function fetchRSSFeed(feedUrl: string): Promise<RSSFeed | null> {
		try {
			const response = await fetch(feedUrl);

			if (!response.ok) {
				throw new Error(`Failed to fetch feed: ${response.statusText}`);
			}

			const xmlText = await response.text();

			// Parse XML to extract feed data
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

			const channel = xmlDoc.querySelector('channel');
			if (!channel) {
				throw new Error('Invalid RSS feed format');
			}

			const title = channel.querySelector('title')?.textContent || 'Unknown Feed';
			const description = channel.querySelector('description')?.textContent || '';

			const items: RSSItem[] = [];
			const itemElements = channel.querySelectorAll('item');

			itemElements.forEach((item) => {
				const itemTitle = item.querySelector('title')?.textContent || 'Untitled';
				const itemDescription = item.querySelector('description')?.textContent || '';
				const pubDate = item.querySelector('pubDate')?.textContent || '';
				const author =
					item.querySelector('author')?.textContent ||
					item.querySelector('itunes\\:author')?.textContent ||
					item.querySelector('dc\\:creator')?.textContent ||
					'';
				const guid = item.querySelector('guid')?.textContent || '';

				items.push({
					title: itemTitle,
					description: itemDescription,
					pubDate,
					author,
					guid
				});
			});

			return {
				title,
				description,
				items
			};
		} catch (error) {
			console.error('Error fetching RSS feed:', error);
			return null;
		}
	}

	function mapRSSFeedToShow(rssFeed: RSSFeed, feedUrl: string, icon: string): Show {
		const episodes: Episode[] = rssFeed.items.map((item) => {
			const pubDate = new Date(item.pubDate);
			const dateStr = pubDate.toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric'
			});
			const timeStr = pubDate.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
			});

			return {
				title: item.title,
				description: item.description,
				date: dateStr,
				time: timeStr,
				author: item.author || 'Unknown',
				state: 'unwatched',
				isSaved: false,
				tags: [] // Could be enhanced to extract tags from description
			};
		});

		const numUnread = episodes.filter((ep) => ep.state === 'unwatched').length;

		return {
			title: rssFeed.title,
			feedUrl,
			icon,
			numUnread,
			episodes
		};
	}

	function getCachedFeeds(): Show[] | null {
		try {
			const cached = localStorage.getItem(FEED_CACHE_KEY);
			if (!cached) return null;

			const { data, timestamp } = JSON.parse(cached);
			const now = Date.now();

			// Check if cache is expired
			if (now - timestamp > FEED_CACHE_EXPIRY) {
				localStorage.removeItem(FEED_CACHE_KEY);
				return null;
			}

			return data;
		} catch (error) {
			console.error('Error reading cached feeds:', error);
			return null;
		}
	}

	function cacheFeeds(feeds: Show[]): void {
		try {
			const cacheData = {
				data: feeds,
				timestamp: Date.now()
			};
			localStorage.setItem(FEED_CACHE_KEY, JSON.stringify(cacheData));
		} catch (error) {
			console.error('Error caching feeds:', error);
		}
	}

	async function loadFeeds(): Promise<void> {
		// Check local storage first
		const cachedFeeds = getCachedFeeds();
		if (cachedFeeds) {
			shows = cachedFeeds;
			return;
		}

		// If no cache, fetch feeds
		const feedConfigs = [
			{
				url: 'https://feeds.simplecast.com/BqbsxVfO',
				icon: '📻',
				title: '99% Invisible'
			}
		];

		const fetchedShows: Show[] = [];

		for (const config of feedConfigs) {
			const rssFeed = await fetchRSSFeed(config.url);
			if (rssFeed) {
				const show = mapRSSFeedToShow(rssFeed, config.url, config.icon);
				fetchedShows.push(show);
			}
		}

		if (fetchedShows.length > 0) {
			shows = fetchedShows;
			cacheFeeds(fetchedShows);
		}
	}

	// Load feeds on component mount
	onMount(() => {
		loadFeeds();
	});

	let shows: Show[] = $state([]);
	let selectedShowIdx: number = $state(0);
	let selectedEpisodeIdx: number | null = $state(0);

	// Mobile navigation state
	let mobileView = $state<'feeds' | 'episodes' | 'details'>('feeds');

	let selectedShow: Show | null = $derived(shows[selectedShowIdx] || null);
	let selectedEpisode: Episode | null = $derived(
		selectedShow && selectedEpisodeIdx !== null ? selectedShow.episodes[selectedEpisodeIdx] : null
	);

	function toggleSaved() {
		if (selectedEpisodeIdx !== null && selectedShow) {
			shows[selectedShowIdx].episodes[selectedEpisodeIdx].isSaved =
				!shows[selectedShowIdx].episodes[selectedEpisodeIdx].isSaved;
		}
	}

	function setState(newState: 'watched' | 'unwatched') {
		if (selectedEpisodeIdx !== null && selectedShow) {
			shows[selectedShowIdx].episodes[selectedEpisodeIdx].state = newState;
		}
		if (selectedShow) {
			let numUnread = 0;
			for (const e of shows[selectedShowIdx].episodes) {
				if (e.state === 'unwatched') {
					numUnread += 1;
				}
			}
			shows[selectedShowIdx].numUnread = numUnread;
		}
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
					{#if shows.length === 0}
						<div class="loading-message">
							<span>Loading podcasts...</span>
						</div>
					{:else}
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
					{/if}
				</div>
			</div>

			<!-- Middle Column: Episodes -->
			<div
				class="episodes-column"
				data-mobile-view={mobileView === 'episodes' ? 'visible' : 'hidden'}
			>
				<div class="mobile-header">
					<button class="back-btn" onclick={() => (mobileView = 'feeds')}>&larr;</button>
					<h1>{selectedShow?.title || 'No Show Selected'}</h1>
				</div>
				<div class="episodes-list">
					{#if selectedShow}
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
					{:else}
						<div class="no-selection">
							<span>No show selected</span>
						</div>
					{/if}
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

	.loading-message {
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
