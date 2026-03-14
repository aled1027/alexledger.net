interface PortfolioItem {
	// Human-readable label
	label: string;
	// URL to a demo video, usually about 60 seconds long.
	videoUrl: string;
	// Gradient start color (top-left / leading edge of the base linear gradient).
	bgFrom: string;
	// Gradient end color (bottom-right / trailing edge of the base linear gradient).
	bgTo: string;
	// Accent color used by radial glow layers to add depth and atmosphere.
	bgGlow: string;
}

export const portfolio: PortfolioItem[] = [
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/anna-neshyba-edited.webm',
		label: 'Anna Neshyba',
		bgFrom: '#31453f',
		bgTo: '#161c1f',
		bgGlow: '#93c6b3'
	},
	{
		videoUrl:
			'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/ethyca-animation-demo-video.webm',
		label: 'Ethyca Product Animation',
		bgFrom: '#364052',
		bgTo: '#171b24',
		bgGlow: '#8aa7d8'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/maxlifefoundation.webm',
		label: 'Max Life Foundation',
		bgFrom: '#57367b',
		bgTo: '#1e1731',
		bgGlow: '#cb94ff'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/incontextlearning.webm',
		label: 'Incontext Learning',
		bgFrom: '#7a6e63',
		bgTo: '#27211d',
		bgGlow: '#dbc2a7'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/catandalex.webm',
		label: 'Cat and Alex',
		bgFrom: '#644183',
		bgTo: '#221632',
		bgGlow: '#d8b0ff'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/catnesh.webm',
		label: 'Cat Nesh',
		bgFrom: '#4f5b3e',
		bgTo: '#1b2115',
		bgGlow: '#b7ce8e'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/cosmicfronter-v0.webm',
		label: 'Cosmic Frontier',
		bgFrom: '#171f3d',
		bgTo: '#070910',
		bgGlow: '#6f87ff'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/vyx.webm',
		label: 'Vyx',
		bgFrom: '#535a62',
		bgTo: '#1a1d21',
		bgGlow: '#d5dde7'
	}
];
