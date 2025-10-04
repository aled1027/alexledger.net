<script lang="ts">
	import '../../../styles/open-props.css';
	import { onMount } from 'svelte';

	// TODO:
	// Make audio available offline

	// CONSTANTS
	const FEED_CACHE_KEY = 'podcast_feeds_cache';
	const FEED_CONFIGS_KEY = 'podcast_feed_configs';
	const FEED_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
	const FETCH_TIMEOUT = 10000; // 10 seconds
	
	// CORS Proxy - using a public CORS proxy service
	// This helps bypass CORS restrictions when fetching RSS feeds from different domains
	// We try direct fetch first, then fallback to proxy if CORS blocks the request
	const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

	// DEFAULT CONFIGURATION
	const DEFAULT_FEED_CONFIGS: FeedConfig[] = [
		{
			url: 'https://feeds.simplecast.com/BqbsxVfO',
			dateAdded: new Date().toISOString()
		}
	];

	const DATE_FORMAT_OPTIONS = {
		date: {
			weekday: 'long',
			month: 'long', 
			day: 'numeric'
		},
		time: {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		}
	} as const;

	// TYPES
	interface FeedConfig {
		url: string;
		dateAdded: string;
	}

	interface FeedEntry {
		title: string;
		description: string;
		date: string;
		time: string;
		author: string;
		state: 'watched' | 'unwatched';
		isSaved: boolean;
		tags: string[];
		enclosure?: {
			url: string;
			type: string;
			length: number;
			userLocation?: number; // Audio playback position in seconds
		};
	}

	interface Feed {
		title: string;
		feedUrl?: string;
		icon: string;
		numUnread: number;
		episodes: FeedEntry[];
	}

	interface RSSItem {
		title: string;
		description: string;
		pubDate: string;
		author?: string;
		guid?: string;
		enclosure?: {
			url: string;
			type: string;
			length: number;
		};
	}

	interface RSSFeed {
		title: string;
		description: string;
		icon?: string;
		items: RSSItem[];
	}

	// UTILITY FUNCTIONS
	function formatEpisodeDate(pubDate: string): { date: string; time: string } {
		const date = new Date(pubDate);
		
		if (isNaN(date.getTime())) {
			return { date: 'Invalid Date', time: 'Invalid Time' };
		}
		
		return {
			date: date.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS.date),
			time: date.toLocaleTimeString('en-US', DATE_FORMAT_OPTIONS.time)
		};
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	async function fetchRSSFeed(feedUrl: string): Promise<RSSFeed | null> {
		try {
			// Create abort controller for this request
			abortController = new AbortController();
			const timeoutId = setTimeout(() => abortController?.abort(), FETCH_TIMEOUT);
			
			// Try direct fetch first, then fallback to CORS proxy if needed
			let response: Response;
			let xmlText: string;
			
			try {
				// First attempt: direct fetch
				response = await fetch(feedUrl, {
					headers: {
						'Accept': 'application/rss+xml, application/xml, text/xml'
					},
					signal: abortController.signal
				});
				
				if (response.ok) {
					xmlText = await response.text();
				} else {
					throw new Error(`Direct fetch failed: ${response.statusText}`);
				}
			} catch (directError) {
				console.log('Direct fetch failed, trying CORS proxy:', directError);
				
				// Second attempt: use CORS proxy
				const proxyUrl = CORS_PROXY + encodeURIComponent(feedUrl);
				response = await fetch(proxyUrl, {
					headers: {
						'Accept': 'application/rss+xml, application/xml, text/xml'
					},
					signal: abortController.signal
				});
				
				if (!response.ok) {
					throw new Error(`CORS proxy fetch failed: ${response.statusText}`);
				}
				
				xmlText = await response.text();
			}
			
			clearTimeout(timeoutId);

			// Parse XML to extract feed data
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

			const channel = xmlDoc.querySelector('channel');
			if (!channel) {
				throw new Error('Invalid RSS feed format');
			}

			const title = channel.querySelector('title')?.textContent || 'Unknown Feed';
			const description = channel.querySelector('description')?.textContent || '';
			
			// Extract icon from various possible locations
			const icon = 
				channel.querySelector('image url')?.textContent ||
				channel.querySelector('image')?.getAttribute('href') ||
				channel.querySelector('itunes\\:image')?.getAttribute('href') ||
				channel.querySelector('atom\\:link[rel="icon"]')?.getAttribute('href') ||
				channel.querySelector('atom\\:link[rel="apple-touch-icon"]')?.getAttribute('href') ||
				undefined;

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

				// Extract enclosure data if present
				const enclosureElement = item.querySelector('enclosure');
				let enclosure = undefined;
				if (enclosureElement) {
					const url = enclosureElement.getAttribute('url') || '';
					const type = enclosureElement.getAttribute('type') || '';
					const lengthStr = enclosureElement.getAttribute('length') || '0';
					const length = parseInt(lengthStr, 10) || 0;

					if (url && type) {
						enclosure = {
							url,
							type,
							length
						};
					}
				}

				items.push({
					title: itemTitle,
					description: itemDescription,
					pubDate,
					author,
					guid,
					enclosure
				});
			});

			return {
				title,
				description,
				icon,
				items
			};
		} catch (error) {
			console.error('Error fetching RSS feed:', error);
			abortController = null;
			return null;
		}
	}

	function mapRSSFeedToFeed(rssFeed: RSSFeed, feedUrl: string): Feed {
		const episodes: FeedEntry[] = rssFeed.items.map((item) => {
			const { date: dateStr, time: timeStr } = formatEpisodeDate(item.pubDate);

			return {
				title: item.title,
				description: item.description,
				date: dateStr,
				time: timeStr,
				author: item.author || 'Unknown',
				state: 'unwatched',
				isSaved: false,
				tags: [], // Could be enhanced to extract tags from description
				enclosure: item.enclosure
			};
		});

		const numUnread = episodes.filter((ep) => ep.state === 'unwatched').length;

		return {
			title: rssFeed.title,
			feedUrl,
			icon: rssFeed.icon || '📻', // Fallback to default icon if none found
			numUnread,
			episodes
		};
	}

	function getCachedFeeds(): Feed[] | null {
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

	function cacheFeeds(feeds: Feed[]): void {
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

	function getFeedConfigs(): FeedConfig[] {
		try {
			const stored = localStorage.getItem(FEED_CONFIGS_KEY);
			if (!stored) {
				// Initialize with default configs
				const defaultConfigs = [...DEFAULT_FEED_CONFIGS];
				setFeedConfigs(defaultConfigs);
				return defaultConfigs;
			}
			return JSON.parse(stored);
		} catch (error) {
			console.error('Error reading feed configs:', error);
			return [...DEFAULT_FEED_CONFIGS];
		}
	}

	function setFeedConfigs(configs: FeedConfig[]): void {
		try {
			localStorage.setItem(FEED_CONFIGS_KEY, JSON.stringify(configs));
		} catch (error) {
			console.error('Error saving feed configs:', error);
		}
	}

	function addFeedConfig(url: string): void {
		const configs = getFeedConfigs();
		const newConfig: FeedConfig = {
			url,
			dateAdded: new Date().toISOString()
		};
		configs.push(newConfig);
		setFeedConfigs(configs);
	}

	function removeFeedConfig(url: string): void {
		const configs = getFeedConfigs();
		const filteredConfigs = configs.filter(config => config.url !== url);
		setFeedConfigs(filteredConfigs);
	}

	function saveUserData(): void {
		try {
			cacheFeeds(feeds);
		} catch (error) {
			console.error('Error saving user data:', error);
		}
	}

	async function loadFeeds(): Promise<void> {
		const feedConfigs = getFeedConfigs();
		const cachedFeeds = getCachedFeeds();
		
		// Start with cached feeds to preserve user data
		const existingFeeds = cachedFeeds || [];
		const existingUrls = new Set(existingFeeds.map(feed => feed.feedUrl));
		
		// Find new feeds that aren't in cache
		const newConfigs = feedConfigs.filter(config => !existingUrls.has(config.url));
		
		// If no new feeds and all configs exist in cache, use cached feeds
		if (newConfigs.length === 0 && feedConfigs.length === existingFeeds.length) {
			feeds = existingFeeds;
			return;
		}
		
		// Fetch new feeds and merge with existing ones
		const newFeeds: Feed[] = [];
		for (const config of newConfigs) {
			const rssFeed = await fetchRSSFeed(config.url);
			if (rssFeed) {
				const feed = mapRSSFeedToFeed(rssFeed, config.url);
				newFeeds.push(feed);
			}
		}
		
		// Merge existing feeds with new feeds, preserving user data
		const mergedFeeds = [...existingFeeds, ...newFeeds];
		
		// Filter out feeds that are no longer in configs (for removed feeds)
		const configUrls = new Set(feedConfigs.map(config => config.url));
		const finalFeeds = mergedFeeds.filter(feed => feed.feedUrl && configUrls.has(feed.feedUrl));
		
		feeds = finalFeeds;
		cacheFeeds(finalFeeds);
	}

	// Memory management
	let abortController: AbortController | null = null;

	// Load feeds on component mount
	onMount(() => {
		loadFeeds();
		
		return () => {
			// Cleanup on component destroy
			if (abortController) {
				abortController.abort();
			}
		};
	});

	let feeds: Feed[] = $state([]);
	let selectedFeedIdx: number = $state(0);
	let selectedFeedEntryIdx: number | null = $state(0);

	// Mobile navigation state
	let mobileView = $state<'feeds' | 'entries' | 'details'>('feeds');

	// Context menu state
	let contextMenuVisible = $state(false);
	let contextMenuPosition = $state({ x: 0, y: 0 });
	let contextMenuFeedIdx = $state(-1);

	// Feed management state
	let showAddFeedDialog = $state(false);
	let newFeedUrl = $state('');
	let showFeedSettings = $state(false);

	// Memoized computed values
	let totalUnreadCount = $derived(
		feeds.reduce((total, feed) => total + feed.numUnread, 0)
	);

	// Automatically save feeds data when it changes
	$effect(() => {
		if (feeds.length > 0) {
			saveUserData();
		}
	});

	let selectedFeed: Feed | null = $derived(feeds[selectedFeedIdx] || null);
	let selectedFeedEntry: FeedEntry | null = $derived(
		selectedFeed && selectedFeedEntryIdx !== null
			? selectedFeed.episodes[selectedFeedEntryIdx]
			: null
	);

	function toggleSaved() {
		if (selectedFeedEntryIdx !== null && selectedFeed) {
			feeds[selectedFeedIdx].episodes[selectedFeedEntryIdx].isSaved =
				!feeds[selectedFeedIdx].episodes[selectedFeedEntryIdx].isSaved;
		}
	}

	function setState(newState: 'watched' | 'unwatched') {
		if (selectedFeedEntryIdx === null || !selectedFeed) return;
		
		const episode = feeds[selectedFeedIdx].episodes[selectedFeedEntryIdx];
		episode.state = newState;
		
		// More efficient unread count calculation
		feeds[selectedFeedIdx].numUnread = feeds[selectedFeedIdx].episodes
			.filter(ep => ep.state === 'unwatched').length;
	}

	function markAllAsRead(feedIdx: number) {
		if (feeds[feedIdx]) {
			feeds[feedIdx].episodes.forEach((episode) => {
				episode.state = 'watched';
			});
			feeds[feedIdx].numUnread = 0;
		}
		contextMenuVisible = false;
	}

	function showContextMenu(event: MouseEvent, feedIdx: number) {
		event.preventDefault();
		event.stopPropagation();

		contextMenuPosition = { x: event.clientX, y: event.clientY };
		contextMenuFeedIdx = feedIdx;
		contextMenuVisible = true;
	}

	function hideContextMenu() {
		contextMenuVisible = false;
		contextMenuFeedIdx = -1;
	}

	async function addNewFeed() {
		if (!newFeedUrl.trim()) return;
		
		try {
			// Test if the URL is valid by fetching it
			const rssFeed = await fetchRSSFeed(newFeedUrl.trim());
			if (rssFeed) {
				addFeedConfig(newFeedUrl.trim());
				// Reload feeds to include the new one
				await loadFeeds();
				newFeedUrl = '';
				showAddFeedDialog = false;
			} else {
				alert('Invalid RSS feed URL. Please check that the URL points to a valid RSS/XML feed.');
			}
		} catch (error) {
			console.error('Error adding feed:', error);
			if (error instanceof Error && error.message.includes('CORS')) {
				alert('Unable to fetch feed due to CORS restrictions. The feed may not be accessible from this domain.');
			} else {
				alert('Error adding feed. Please check the URL and try again.');
			}
		}
	}

	async function removeFeed(feedUrl: string) {
		removeFeedConfig(feedUrl);
		// Reload feeds to remove the deleted one
		await loadFeeds();
		// Reset selection if needed
		if (selectedFeedIdx >= feeds.length) {
			selectedFeedIdx = Math.max(0, feeds.length - 1);
			selectedFeedEntryIdx = feeds[selectedFeedIdx]?.episodes.length > 0 ? 0 : null;
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
					{totalUnreadCount}
				</span>
			</div>
		</div>

		<!-- Main Layout -->
		<div class="main-layout">
			<!-- Left Column: Feeds/Feeds -->
			<div class="feeds-column" data-mobile-view={mobileView === 'feeds' ? 'visible' : 'hidden'}>
				<div class="mobile-header">
					<h1>Podcasts</h1>
				</div>
				<div class="feeds-list">
					<div class="add-feed-section">
						<button class="add-feed-btn" onclick={() => showAddFeedDialog = true}>
							<span class="add-icon">+</span>
							<span>Add Feed</span>
						</button>
					</div>
					{#if feeds.length === 0}
						<div class="loading-message">
							<span>Loading podcasts...</span>
						</div>
					{:else}
						{#each feeds as feed, feedIdx}
							<div 
								class="feed-item-container"
								data-selected={feedIdx === selectedFeedIdx}
								onclick={() => {
									selectedFeedIdx = feedIdx;
									if (feeds[selectedFeedIdx].episodes.length > 0) {
										selectedFeedEntryIdx = 0;
										mobileView = 'entries';
									} else {
										selectedFeedEntryIdx = null;
									}
								}}
								onkeydown={(e) => e.key === 'Enter' && (() => {
									selectedFeedIdx = feedIdx;
									if (feeds[selectedFeedIdx].episodes.length > 0) {
										selectedFeedEntryIdx = 0;
										mobileView = 'entries';
									} else {
										selectedFeedEntryIdx = null;
									}
								})()}
								role="button"
								tabindex="0"
								aria-label={`Select feed: ${feed.title}`}
							>
								<button class="feed-item">
									<span class="feed-icon">
										{#if feed.icon && feed.icon.startsWith('http')}
											<img src={feed.icon} alt={feed.title} class="feed-icon-img" />
										{:else}
											{feed.icon || '📻'}
										{/if}
									</span>
									<span class="feed-name">{feed.title}</span>
									{#if feed.numUnread > 0}
										<span class="badge">{feed.numUnread}</span>
									{/if}
								</button>
								<button
									class="feed-menu-btn"
									onclick={(e) => showContextMenu(e, feedIdx)}
									title="Feed options"
								>
									<span class="ellipses-icon">⋯</span>
								</button>
							</div>
						{/each}
					{/if}
				</div>
			</div>

			<!-- Context Menu -->
			{#if contextMenuVisible}
				<button
					class="context-menu-backdrop"
					onclick={hideContextMenu}
					onkeydown={(e) => e.key === 'Escape' && hideContextMenu()}
					aria-label="Close context menu"
				></button>
				<div
					class="context-menu"
					style="left: {contextMenuPosition.x}px; top: {contextMenuPosition.y}px;"
					role="menu"
				>
					<button class="context-menu-item" onclick={() => markAllAsRead(contextMenuFeedIdx)}>
						Mark all as read
					</button>
					<button class="context-menu-item" onclick={() => {
						if (feeds[contextMenuFeedIdx]) {
							removeFeed(feeds[contextMenuFeedIdx].feedUrl || '');
						}
						hideContextMenu();
					}}>
						Remove feed
					</button>
				</div>
			{/if}

			<!-- Add Feed Dialog -->
			{#if showAddFeedDialog}
				<button
					class="dialog-backdrop"
					onclick={() => {
						showAddFeedDialog = false;
						newFeedUrl = '';
					}}
					onkeydown={(e) => e.key === 'Escape' && (() => {
						showAddFeedDialog = false;
						newFeedUrl = '';
					})()}
					aria-label="Close add feed dialog"
				></button>
				<div class="add-feed-dialog" role="dialog">
					<div class="dialog-header">
						<h2>Add New Feed</h2>
						<button class="close-btn" onclick={() => {
							showAddFeedDialog = false;
							newFeedUrl = '';
						}}>&times;</button>
					</div>
					<div class="dialog-content">
						<label for="feed-url">RSS Feed URL:</label>
						<input
							id="feed-url"
							type="url"
							bind:value={newFeedUrl}
							placeholder="https://example.com/feed.xml"
							onkeydown={(e) => e.key === 'Enter' && addNewFeed()}
						/>
					</div>
					<div class="dialog-actions">
						<button class="action-btn-secondary" onclick={() => {
							showAddFeedDialog = false;
							newFeedUrl = '';
						}}>Cancel</button>
						<button class="action-btn-primary" onclick={addNewFeed}>Add Feed</button>
					</div>
				</div>
			{/if}

			<!-- Middle Column: FeedEntries -->
			<div
				class="episodes-column"
				data-mobile-view={mobileView === 'entries' ? 'visible' : 'hidden'}
			>
				<div class="mobile-header">
					<button class="back-btn" onclick={() => (mobileView = 'feeds')}>&larr;</button>
					<h1>{selectedFeed?.title || 'No Feed Selected'}</h1>
				</div>
				<div class="episodes-list">
					{#if selectedFeed}
						{#each selectedFeed.episodes as feedEntry, feedEntryIdx}
							<button
								class="episode-item"
								data-state={feedEntry.state}
								data-selected={feedEntryIdx === selectedFeedEntryIdx}
								onclick={() => {
									selectedFeedEntryIdx = feedEntryIdx;
									mobileView = 'details';
								}}
							>
								<div class="episode-indicator" data-state={feedEntry.state}></div>
								<div class="episode-content">
									<h4 class="episode-title">{feedEntry.title}</h4>
									<p class="episode-description">{@html feedEntry.description}</p>
									<div class="episode-meta">
										<span class="episode-date">{feedEntry.date}, {feedEntry.time}</span>
										<span class="episode-author">· {feedEntry.author}</span>
									</div>
								</div>
							</button>
						{/each}
					{:else}
						<div class="no-selection">
							<span>No feed selected</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Right Column: FeedEntry Details -->
			<div
				class="details-column"
				data-mobile-view={mobileView === 'details' ? 'visible' : 'hidden'}
			>
				<div class="mobile-header">
					<button class="back-btn" onclick={() => (mobileView = 'entries')}>&larr;</button>
					<h1>FeedEntry Details</h1>
				</div>
				<div class="episode-details-content">
					{#if selectedFeedEntry}
						<div class="episode-header">
							<div class="episode-title-section">
								<div class="episode-indicator-large" data-state={selectedFeedEntry.state}></div>
								<h2 class="episode-title-large">{selectedFeedEntry.title}</h2>
							</div>

							<div class="episode-actions-header">
								{#if selectedFeedEntry.state === 'watched'}
									<button class="action-btn-neutral" onclick={() => setState('unwatched')}
										>Mark as Unread</button
									>
								{:else}
									<button class="action-btn-primary" onclick={() => setState('watched')}
										>Mark as Read</button
									>
								{/if}
								{#if selectedFeedEntry.isSaved}
									<button class="action-btn-secondary" onclick={toggleSaved}>Unsave</button>
								{:else}
									<button class="action-btn-secondary" onclick={toggleSaved}>Save</button>
								{/if}
							</div>

							<div class="episode-meta-large">
								{selectedFeedEntry.date}, {selectedFeedEntry.time} · {selectedFeedEntry.author}
							</div>
							{#if selectedFeedEntry.enclosure}
								<div class="episode-enclosure">
									<div class="enclosure-header">
										<span class="enclosure-icon">🎵</span>
										<span class="enclosure-label">Audio</span>
									</div>
									<div class="enclosure-details">
										<div class="enclosure-type">{selectedFeedEntry.enclosure.type}</div>
										<div class="enclosure-size">
											{formatFileSize(selectedFeedEntry.enclosure.length)}
										</div>
									</div>

									<div class="audio-container">
										<audio controls preload="metadata">
											<source
												src={selectedFeedEntry.enclosure.url}
												type={selectedFeedEntry.enclosure.type}
											/>
											Your browser does not support the audio element.
										</audio>
									</div>
								</div>
							{/if}
							<div class="episode-tags">
								{#each selectedFeedEntry.tags as tag}
									<span class="tag">{tag}</span>
								{/each}
							</div>
						</div>

						<div class="episode-body">
							<p>{@html selectedFeedEntry.description}</p>
						</div>
					{:else}
						<div class="no-selection">
							<span>No feed entry selected</span>
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
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.feed-icon-img {
		width: var(--size-5);
		height: var(--size-5);
		border-radius: var(--radius-2);
		object-fit: cover;
	}

	.feed-item-container {
		display: flex;
		align-items: center;
		position: relative;
		gap: var(--size-1);
		width: 100%;
		padding-block: var(--size-2);
		padding-inline: var(--size-3) var(--size-1);
		background: none;
		border: none;
		color: var(--gray-9);
		cursor: pointer;
		text-align: left;
		font-size: var(--font-size-1);
		transition: background-color var(--t-ratio);
	}

	.feed-item-container:hover {
		background: var(--gray-4);
	}

	.feed-item-container[data-selected='true'] {
		background: var(--gray-5);
	}

	.feed-item {
		flex: 1;
		display: flex;
		align-items: center;
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
		text-align: left;
		font-size: inherit;
		gap: var(--size-2);
		padding: 0;
	}

	.feed-menu-btn {
		background: none;
		border: none;
		color: var(--gray-7);
		cursor: pointer;
		border-radius: var(--radius-2);
		transition: color var(--t-ratio);
		opacity: 1;
		flex-shrink: 0;
	}

	.feed-item-container:hover .feed-menu-btn {
		color: var(--gray-10);
	}

	.ellipses-icon {
		font-size: var(--font-size-2);
		font-weight: bold;
		line-height: 1;
		transform: rotate(90deg);
		display: inline-block;
	}

	.context-menu-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 999;
		background: transparent;
		border: none;
		cursor: default;
	}

	.context-menu {
		position: fixed;
		background: var(--gray-1);
		border: 1px solid var(--gray-4);
		border-radius: var(--radius-2);
		box-shadow: var(--shadow-3);
		z-index: 1000;
		min-width: 160px;
		padding: var(--size-1) 0;
	}

	.context-menu-item {
		display: block;
		width: 100%;
		padding: var(--size-2) var(--size-3);
		background: none;
		border: none;
		color: var(--gray-8);
		cursor: pointer;
		text-align: left;
		font-size: var(--font-size-1);
		transition: background-color var(--t-ratio);
	}

	.context-menu-item:hover {
		background: var(--gray-3);
		color: var(--gray-9);
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

	.episode-enclosure {
		background: var(--blue-1);
		border: 1px solid var(--blue-3);
		border-radius: var(--radius-3);
		padding: var(--size-3);
		margin-bottom: var(--size-3);
	}

	.enclosure-header {
		display: flex;
		align-items: center;
		gap: var(--size-2);
		margin-bottom: var(--size-2);
	}

	.enclosure-icon {
		font-size: var(--font-size-2);
	}

	.enclosure-label {
		font-size: var(--font-size-1);
		font-weight: var(--font-weight-6);
		color: var(--blue-9);
	}

	.enclosure-details {
		display: flex;
		gap: var(--size-3);
		margin-bottom: var(--size-3);
		font-size: var(--font-size-0);
		color: var(--blue-7);
	}

	.enclosure-type {
		font-family: var(--font-mono);
		background: var(--blue-2);
		padding: var(--size-1) var(--size-2);
		border-radius: var(--radius-2);
	}

	.enclosure-size {
		font-family: var(--font-mono);
		background: var(--blue-2);
		padding: var(--size-1) var(--size-2);
		border-radius: var(--radius-2);
	}

	.audio-container {
		margin: var(--size-3) 0;
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

		.feed-item-container {
			border-bottom: var(--border-size-1) solid var(--gray-3);
		}

		.feed-item {
			border-bottom: none;
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

		.feed-item-container {
			border-bottom: none;
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

	/* Add Feed Section */
	.add-feed-section {
		padding: var(--size-2) var(--size-3);
		border-bottom: var(--border-size-1) solid var(--gray-3);
	}

	.add-feed-btn {
		display: flex;
		align-items: center;
		gap: var(--size-2);
		width: 100%;
		padding: var(--size-2) var(--size-3);
		background: var(--blue-1);
		border: 1px solid var(--blue-3);
		border-radius: var(--radius-2);
		color: var(--blue-9);
		font-size: var(--font-size-1);
		font-weight: var(--font-weight-5);
		cursor: pointer;
		transition: all var(--t-ratio);
	}

	.add-feed-btn:hover {
		background: var(--blue-2);
		border-color: var(--blue-4);
	}

	.add-icon {
		font-size: var(--font-size-2);
		font-weight: var(--font-weight-6);
	}

	/* Dialog Styles */
	.dialog-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 999;
		background: rgba(0, 0, 0, 0.5);
		border: none;
		cursor: default;
	}

	.add-feed-dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: var(--gray-1);
		border: 1px solid var(--gray-4);
		border-radius: var(--radius-3);
		box-shadow: var(--shadow-4);
		z-index: 1000;
		min-width: 400px;
		max-width: 90vw;
	}

	.dialog-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--size-3) var(--size-4);
		border-bottom: var(--border-size-1) solid var(--gray-3);
	}

	.dialog-header h2 {
		margin: 0;
		font-size: var(--font-size-3);
		font-weight: var(--font-weight-6);
		color: var(--gray-9);
	}

	.close-btn {
		background: none;
		border: none;
		font-size: var(--font-size-4);
		color: var(--gray-6);
		cursor: pointer;
		padding: var(--size-1);
		border-radius: var(--radius-2);
		transition: color var(--t-ratio);
	}

	.close-btn:hover {
		color: var(--gray-8);
	}

	.dialog-content {
		padding: var(--size-4);
	}

	.dialog-content label {
		display: block;
		margin-bottom: var(--size-2);
		font-size: var(--font-size-1);
		font-weight: var(--font-weight-5);
		color: var(--gray-8);
	}

	.dialog-content input {
		width: 100%;
		padding: var(--size-2) var(--size-3);
		border: 1px solid var(--gray-4);
		border-radius: var(--radius-2);
		font-size: var(--font-size-1);
		background: var(--gray-0);
		color: var(--gray-9);
		transition: border-color var(--t-ratio);
	}

	.dialog-content input:focus {
		outline: none;
		border-color: var(--blue-6);
		box-shadow: 0 0 0 2px var(--blue-2);
	}

	.dialog-actions {
		display: flex;
		gap: var(--size-2);
		padding: var(--size-3) var(--size-4);
		border-top: var(--border-size-1) solid var(--gray-3);
		justify-content: flex-end;
	}

	/* Mobile dialog adjustments */
	@media (max-width: 768px) {
		.add-feed-dialog {
			min-width: unset;
			width: 90vw;
			max-width: 400px;
		}

		.dialog-actions {
			flex-direction: column;
		}

		.dialog-actions button {
			width: 100%;
		}
	}
</style>
