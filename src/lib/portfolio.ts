export interface PortfolioItem {
	// Human-readable label
	label: string;
	// URL to a demo video, usually about 60 seconds long.
	videoUrl?: string;
	// Preview image used in the homepage project grid.
	imageUrl?: any;
	// Accessible alt text for the preview image.
	imageAlt?: string;
	// External or internal project URL.
	link?: string;
	// Card background color for project grid cards.
	cardColor?: string;
	// Gradient start color (top-left / leading edge of the base linear gradient).
	bgFrom: string;
	// Gradient end color (bottom-right / trailing edge of the base linear gradient).
	bgTo: string;
	// Accent color used by radial glow layers to add depth and atmosphere.
	bgGlow: string;
}

// @ts-expect-error -- Image imports with query parameters
import AnnaNeshyba from '$lib/assets/anna-neshyba.png?enhanced&format=webp';
// @ts-expect-error -- Image imports with query parameters
import Metrion from '$lib/assets/metrion.png?enhanced&format=webp';
// @ts-expect-error -- Image imports with query parameters
import Seastar from '$lib/assets/seastar.png?enhanced&format=webp';
// @ts-expect-error -- Image imports with query parameters
import GiveMaxLife from '$lib/assets/give-max-life.png?enhanced&format=webp';
// @ts-expect-error -- Image imports with query parameters
import Incontext from '$lib/assets/incontext.png?enhanced&format=webp';
// @ts-expect-error -- Image imports with query parameters
import LittleCompass from '$lib/assets/little-compass.png?enhanced&format=webp';
// @ts-expect-error -- Image imports with query parameters
import CatAndAlex from '$lib/assets/catandalex.png?enhanced&format=webp';
// @ts-expect-error -- Image imports with query parameters
import LlmToolsAnki from '$lib/assets/llm-tools-anki.png?enhanced&format=webp';
// @ts-expect-error -- Image imports with query parameters
import CatNeshyba from '$lib/assets/catneshyba.png?enhanced&format=webp';
// @ts-expect-error -- Image imports with query parameters
import Vyx from '$lib/assets/vyx.png?enhanced&format=webp';
// @ts-expect-error -- Image imports with query parameters
import MedicalNoteGenerator from '$lib/assets/medical-note-generator.png?enhanced&format=webp';
// @ts-expect-error -- Image imports with query parameters
import Ethyca from '$lib/assets/ethyca.png?enhanced&format=webp';

export const portfolio: PortfolioItem[] = [
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/anna-neshyba-edited.webm',
		label: 'Anna Neshyba',
		imageUrl: AnnaNeshyba,
		imageAlt: 'Screenshot of the Anna Neshyba website',
		link: 'https://annaneshyba.com/',
		cardColor: '#D3DCD9',
		bgFrom: '#31453f',
		bgTo: '#161c1f',
		bgGlow: '#93c6b3'
	},
	{
		label: 'Metrion',
		imageUrl: Metrion,
		imageAlt: 'Screenshot of the Metrion website',
		link: 'https://metrion.space',
		cardColor: '#8992cb',
		bgFrom: '#323656',
		bgTo: '#171a2b',
		bgGlow: '#8992cb'
	},
	{
		videoUrl:
			'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/ethyca-animation-demo-video.webm',
		label: 'Ethyca Product Animation',
		imageUrl: Ethyca,
		imageAlt: 'Screenshot of the Ethyca Product Animation',
		link: '/ethyca.mp4',
		cardColor: '#E8E8E8',
		bgFrom: '#364052',
		bgTo: '#171b24',
		bgGlow: '#8aa7d8'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/maxlifefoundation.webm',
		label: 'Give Max Life',
		imageUrl: GiveMaxLife,
		imageAlt: 'Screenshot of the Give Max Life website',
		link: 'https://givemaxlife.com/',
		cardColor: '#9335D1',
		bgFrom: '#57367b',
		bgTo: '#1e1731',
		bgGlow: '#cb94ff'
	},
	{
		label: 'Medical Note Generator',
		imageUrl: MedicalNoteGenerator,
		imageAlt: 'Screenshot of the Medical Note Generator website',
		link: 'https://github.com/johnyquest7/rust_med',
		cardColor: '#E6E6E6',
		bgFrom: '#767676',
		bgTo: '#2a2a2a',
		bgGlow: '#d8d8d8'
	},
	{
		label: 'Seastar',
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/cosmicfronter-v0.webm',
		imageUrl: Seastar,
		imageAlt: 'Screenshot of the Seastar website',
		link: 'https://seastar-coaching.com',
		cardColor: '#464D36',
		bgFrom: '#46533a',
		bgTo: '#1a1f16',
		bgGlow: '#9db07f'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/incontextlearning.webm',
		label: 'inContext Learning',
		imageUrl: Incontext,
		imageAlt: 'Screenshot of the incontext website',
		link: 'https://incontextlearning.com',
		cardColor: '#EDEFF2',
		bgFrom: '#7a6e63',
		bgTo: '#27211d',
		bgGlow: '#dbc2a7'
	},
	{
		label: 'The Little Compass',
		imageUrl: LittleCompass,
		imageAlt: 'Screenshot of the Seastar website',
		link: 'https://thelittlecompass.com',
		cardColor: '#DDD4FD',
		bgFrom: '#5b4e8a',
		bgTo: '#211a34',
		bgGlow: '#c9bbff'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/catandalex.webm',
		label: "Cat & Alex's Wedding",
		imageUrl: CatAndAlex,
		imageAlt: 'Screenshot of the Cat and Alex website',
		link: 'https://catandalex.net',
		cardColor: '#9080D0',
		bgFrom: '#644183',
		bgTo: '#221632',
		bgGlow: '#d8b0ff'
	},
	{
		label: 'llm-tools-anki',
		imageUrl: LlmToolsAnki,
		imageAlt: 'Screenshot of the llm-tools-anki website',
		link: 'https://github.com/aled1027/llm-tools-anki',
		cardColor: '#1B883E',
		bgFrom: '#235f36',
		bgTo: '#0e2415',
		bgGlow: '#7fd39d'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/catnesh.webm',
		label: 'Cat Neshyba',
		imageUrl: CatNeshyba,
		imageAlt: 'Screenshot of the Cat Neshyba website',
		link: 'https://catneshyba.com',
		cardColor: '#CED2D5',
		bgFrom: '#4f5b3e',
		bgTo: '#1b2115',
		bgGlow: '#b7ce8e'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/vyx.webm',
		label: 'Vyx',
		imageUrl: Vyx,
		imageAlt: 'Screenshot of the Vyx website',
		link: 'https://vyx.gg',
		cardColor: '#8B8B8B',
		bgFrom: '#535a62',
		bgTo: '#1a1d21',
		bgGlow: '#d5dde7'
	}
];
