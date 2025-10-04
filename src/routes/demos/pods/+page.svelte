<script lang="ts">
	//
	// 
	//

	let shows = $state([
		{
			title: '99% Invisible',
			icon: '📻',
			url: 'https://example.com',
			numUnread: 3,
			episodes: [
				{
					title: 'Get Played with Roman Mars and Ben Brock Johnson',
					description: 'Hidden Levels explores the hidden stories behind video games, featuring Heather Anne Campbell (Rick and Morty) and Matt Apodaca discussing controllers, culture, and video games.',
					date: 'Yesterday, October 3rd',
					time: '1:30pm',
					author: 'Heather Anne Campbell, Matt Apodaca, Ben Brock Johnson',
					state: 'unwatched',
					isSaved: false,
					tags: ['video games', 'design', 'storytelling']
				},
				{
					title: 'The Power Broker #13: Drop Dead City',
					description: 'In a Colorado meatpacking town, refugees fleeing persecution find themselves in some of the most dangerous jobs in America.',
					date: 'Tuesday, September 23rd',
					time: '1:30pm',
					author: 'Elliott Kalan',
					state: 'unwatched',
					isSaved: true,
					tags: ['labor', 'immigration', 'meatpacking']
				},
				{
					title: 'The New Jungle',
					description: 'This episode was produced in partnership with the Food & Environment Reporting Network, an independent, nonprofit news organization.',
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
			url: 'https://example.com',
			numUnread: 2,
			episodes: [
				{
					title: 'New Drug Cures Cancer',
					description: 'A breakthrough in cancer treatment shows promising results in early clinical trials.',
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
			url: 'https://example.com',
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
					description: 'An analysis of Stephen Curry\'s incredible shooting display and its impact on modern basketball.',
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
			url: 'https://example.com',
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

<div class="podcast-app">
	<!-- Top Bar -->
	<div class="top-bar">
		<div class="user-info">
			<span class="avatar">👤</span>
			<span class="username">aled1027</span>
			<span class="unread-count">o {shows.reduce((total, show) => total + show.numUnread, 0)} o 0</span>
		</div>
		<div class="controls">
			<button class="control-btn">🔊</button>
			<button class="control-btn">←</button>
			<button class="control-btn">⏸️</button>
			<select class="control-select">
				<option>ALL - NEWEST</option>
			</select>
			<button class="control-btn">🔍</button>
			<button class="control-btn">➕</button>
			<button class="control-btn">↑</button>
			<span class="next-unread">o Next unread ↓</span>
		</div>
	</div>

	<!-- Main Layout -->
	<div class="main-layout">
		<!-- Left Column: Feeds/Shows -->
		<div class="feeds-column">
			<div class="nav-section">
				<div class="nav-item active">📺 NewsBlur Dashboard</div>
				<div class="nav-item">⚙️ Infrequent Site Stories</div>
				<div class="nav-item">🌐 All Site Stories</div>
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
				
				<div class="folder-section">
					<div class="folder">
						<span class="folder-name">📁 Know Portland</span>
						<span class="badge">298</span>
					</div>
					<div class="folder">
						<span class="folder-name">📁 Español</span>
						<span class="badge">29</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Middle Column: Episodes -->
		<div class="episodes-column">
			{#each selectedShow.episodes as episode, episodeIdx}
				<button
					class="episode-item"
					data-state={episode.state}
					data-selected={episodeIdx === selectedEpisodeIdx}
					onclick={() => {
						selectedEpisodeIdx = episodeIdx;
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

		<!-- Right Column: Episode Details -->
		<div class="details-column">
			{#if selectedEpisode}
				<div class="episode-header">
					<div class="episode-indicator-large" data-state={selectedEpisode.state}></div>
					<h2 class="episode-title-large">{selectedEpisode.title}</h2>
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
					
					<div class="episode-actions">
						{#if selectedEpisode.state === 'watched'}
							<button class="action-btn" onclick={() => setState('unwatched')}>Mark as Unread</button>
						{:else}
							<button class="action-btn" onclick={() => setState('watched')}>Mark as Read</button>
						{/if}
						{#if selectedEpisode.isSaved}
							<button class="action-btn" onclick={toggleSaved}>Remove from Saved</button>
						{:else}
							<button class="action-btn" onclick={toggleSaved}>Save Episode</button>
						{/if}
					</div>
				</div>
			{:else}
				<div class="no-selection">
					<span>No episode selected</span>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.podcast-app {
		min-height: 100vh;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #f8f9fa;
	}

	/* Top Bar */
	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 16px;
		background: white;
		border-bottom: 1px solid #e1e5e9;
		font-size: 14px;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.avatar {
		width: 24px;
		height: 24px;
		background: #6c757d;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
	}

	.username {
		font-weight: 500;
	}

	.unread-count {
		color: #6c757d;
		font-family: monospace;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.control-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		font-size: 16px;
		color: #6c757d;
	}

	.control-btn:hover {
		color: #495057;
	}

	.control-select {
		border: 1px solid #e1e5e9;
		border-radius: 4px;
		padding: 4px 8px;
		font-size: 14px;
		background: white;
	}

	.next-unread {
		color: #6c757d;
		font-size: 14px;
	}

	/* Main Layout */
	.main-layout {
		display: grid;
		grid-template-columns: 280px 1fr 400px;
		height: calc(100vh - 50px);
		background: white;
	}

	/* Left Column - Feeds */
	.feeds-column {
		background: #343a40;
		color: white;
		display: flex;
		flex-direction: column;
		border-right: 1px solid #495057;
	}

	.nav-section {
		padding: 12px 0;
		border-bottom: 1px solid #495057;
	}

	.nav-item {
		padding: 8px 16px;
		cursor: pointer;
		font-size: 14px;
		color: #adb5bd;
	}

	.nav-item.active {
		color: white;
		background: rgba(255, 255, 255, 0.1);
	}

	.nav-item:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	.feeds-list {
		flex: 1;
		overflow-y: auto;
		padding: 8px 0;
	}

	.feed-item {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 6px 16px;
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		text-align: left;
		font-size: 14px;
		gap: 8px;
	}

	.feed-item:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	.feed-item[data-selected='true'] {
		background: rgba(255, 255, 255, 0.15);
	}

	.feed-name {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.feed-icon {
		font-size: 16px;
		width: 20px;
		text-align: center;
	}

	.folder-section {
		margin-top: 16px;
		border-top: 1px solid #495057;
		padding-top: 8px;
	}

	.folder {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px 16px;
		color: #adb5bd;
		font-size: 14px;
		cursor: pointer;
	}

	.folder:hover {
		background: rgba(255, 255, 255, 0.05);
		color: white;
	}

	.folder-name {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	/* Middle Column - Episodes */
	.episodes-column {
		background: #fff3cd;
		border-right: 1px solid #ffeaa7;
		overflow-y: auto;
	}

	.episode-item {
		display: flex;
		width: 100%;
		padding: 12px 16px;
		background: none;
		border: none;
		border-bottom: 1px solid #ffeaa7;
		cursor: pointer;
		text-align: left;
		gap: 12px;
	}

	.episode-item:hover {
		background: rgba(255, 234, 167, 0.3);
	}

	.episode-item[data-selected='true'] {
		background: rgba(255, 234, 167, 0.5);
	}

	.episode-indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		flex-shrink: 0;
		margin-top: 6px;
	}

	.episode-indicator[data-state='unwatched'] {
		background: #007bff;
	}

	.episode-indicator[data-state='watched'] {
		background: #6c757d;
		opacity: 0.3;
	}

	.episode-content {
		flex: 1;
		min-width: 0;
	}

	.episode-title {
		font-size: 16px;
		font-weight: 600;
		margin: 0 0 4px 0;
		color: #495057;
		line-height: 1.3;
	}

	.episode-description {
		font-size: 14px;
		color: #6c757d;
		margin: 0 0 8px 0;
		line-height: 1.4;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.episode-meta {
		font-size: 12px;
		color: #868e96;
	}

	.episode-date {
		font-weight: 500;
	}

	.episode-author {
		color: #adb5bd;
	}

	/* Right Column - Details */
	.details-column {
		background: white;
		padding: 20px;
		overflow-y: auto;
	}

	.episode-header {
		border-bottom: 1px solid #e9ecef;
		padding-bottom: 16px;
		margin-bottom: 16px;
	}

	.episode-indicator-large {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		margin-bottom: 12px;
	}

	.episode-indicator-large[data-state='unwatched'] {
		background: #007bff;
	}

	.episode-indicator-large[data-state='watched'] {
		background: #6c757d;
		opacity: 0.3;
	}

	.episode-title-large {
		font-size: 24px;
		font-weight: 600;
		margin: 0 0 8px 0;
		color: #212529;
		line-height: 1.2;
	}

	.episode-meta-large {
		font-size: 14px;
		color: #6c757d;
		margin-bottom: 12px;
	}

	.episode-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 16px;
	}

	.tag {
		background: #f8f9fa;
		color: #495057;
		padding: 4px 8px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 500;
	}

	.episode-body p {
		font-size: 16px;
		line-height: 1.6;
		color: #495057;
		margin-bottom: 20px;
	}

	.episode-actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.action-btn {
		background: #007bff;
		outline: none;
		border: none;
		color: white;
		padding: 8px 16px;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.15s;
	}

	.action-btn:hover {
		background: #0056b3;
	}

	.no-selection {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 200px;
		color: #6c757d;
		font-style: italic;
	}

	.badge {
		background: #6c757d;
		color: white;
		font-size: 12px;
		font-weight: 600;
		padding: 2px 8px;
		border-radius: 10px;
		min-width: 20px;
		text-align: center;
		flex-shrink: 0;
	}

</style>
