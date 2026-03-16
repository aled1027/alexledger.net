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
	// Markdown description for the project.
	description?: string;
	// Slug
	slug: string;
	// Card background color for project grid cards.
	cardColor?: string;
	// Gradient start color (top-left / leading edge of the base linear gradient).
	bgFrom: string;
	// Gradient end color (bottom-right / trailing edge of the base linear gradient).
	bgTo: string;
	// Accent color used by radial glow layers to add depth and atmosphere.
	bgGlow: string;
}

export let portfolio: PortfolioItem[] = [
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/anna-neshyba-edited.webm',
		label: 'Anna Neshyba',
		imageUrl: '/portfolio/anna-neshyba.webp',
		imageAlt: 'Screenshot of the Anna Neshyba website',
		link: 'https://annaneshyba.com/',
		description: `Anna Neshyba is an illustrator from the Pacific Northwest. Together we built a really neat website for her work. The idea of the website, [as I wrote on substack a few months ago,](https://alexledger.substack.com/p/illustrator-anna-neshybas-website) is to bring the reader into her imaginative world.`,
		slug: 'anna-neshyba',
		cardColor: '#D3DCD9',
		bgFrom: '#31453f',
		bgTo: '#161c1f',
		bgGlow: '#93c6b3'
	},
	{
		label: 'Metrion',
		imageUrl: '/portfolio/metrion.webp',
		imageAlt: 'Screenshot of the Metrion website',
		link: 'https://metrion.space',
		description: `Metrion is a data consultancy that turns complex geospatial data into clear insights that help organizations understand and prepare for location-specific risks. They specialize in building-level analytics that combine artificial intelligence, remotely sensed data, and human-guided workflows to support investment and planning decisions.`,
		slug: 'metrion',
		cardColor: '#8992cb',
		bgFrom: '#323656',
		bgTo: '#171a2b',
		bgGlow: '#8992cb'
	},
	{
		videoUrl:
			'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/ethyca-animation-demo-video.webm',
		label: 'Ethyca Product Animation',
		imageUrl: '/portfolio/ethyca.webp',
		imageAlt: 'Screenshot of the Ethyca Product Animation',
		link: '/ethyca.mp4',
		description: `[Ethyca](https://ethyca.com/) collaborated with an agency to rework their website. As part of that effort, I worked with them to create animations of their product suite.

Their products support data privacy and management initiatives for organizations like the New York Times. So when you visit the NYT, Ethyca determines how your data should be managed based on your cookie preferences, subscription status, regulations from your locality, and more.

The animations of the products show how data flows through their platform: how that data is sorted, partitioned, filtered, and organized.`,
		slug: 'ethyca-product-animation',
		cardColor: '#E8E8E8',
		bgFrom: '#364052',
		bgTo: '#171b24',
		bgGlow: '#8aa7d8'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/maxlifefoundation.webm',
		label: 'Give Max Life',
		imageUrl: '/portfolio/give-max-life.webp',
		imageAlt: 'Screenshot of the Give Max Life website',
		link: 'https://givemaxlife.com/',
		description: `Max Life Foundation is a foundation for supporting pediatric cancer treatment started by Sam and Natalia Peurifoy. The website has a playful, childlike feel, while still maintaining a seriousness and cultivating trust.`,
		slug: 'give-max-life',
		cardColor: '#9335D1',
		bgFrom: '#57367b',
		bgTo: '#1e1731',
		bgGlow: '#cb94ff'
	},
	{
		label: 'Medical Note Generator',
		imageUrl: '/portfolio/medical-note-generator.webp',
		imageAlt: 'Screenshot of the Medical Note Generator website',
		link: 'https://github.com/johnyquest7/rust_med',
		description: `[Dr. Johnson Thomas](https://johnsonthomasmd.substack.com/) and I built a Tauri app for local medical note generation. The idea is that a doctor can install the app on their device and then record their conversation with their patient. After the visit, the app generates a transcript of the conversation and a conformant SOAP medical note.

The data processing is entirely local and uses a specialized LLM tailored to this exact task.`,
		slug: 'medical-note-generator',
		cardColor: '#E6E6E6',
		bgFrom: '#767676',
		bgTo: '#2a2a2a',
		bgGlow: '#d8d8d8'
	},
	{
		label: 'Seastar',
		videoUrl: '',
		imageUrl: '/portfolio/seastar.webp',
		imageAlt: 'Screenshot of the Seastar website',
		link: 'https://seastar-coaching.com',
		slug: 'seastar',
		cardColor: '#464D36',
		bgFrom: '#46533a',
		bgTo: '#1a1f16',
		bgGlow: '#9db07f'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/incontextlearning.webm',
		label: 'inContext Learning',
		imageUrl: '/portfolio/incontext.webp',
		imageAlt: 'Screenshot of the incontext website',
		link: 'https://incontextlearning.com',
		description: `inContext is a collaboration with Miguel Conner that rethinks how language learning works in the AI era.

Here’s our description from the website:

> Welcome to your inContext Notebook – a daily 5-minute language learning challenge designed just for you. Every day, you’ll read a short, engaging text tailored to your exact level, along with comprehension questions and vocabulary cards. The best part? You pick the content you love—making learning personalized, interesting, and enjoyable. Dive into native materials and watch the barriers disappear with your daily inContext Notebook.`,
		slug: 'incontext-learning',
		cardColor: '#EDEFF2',
		bgFrom: '#7a6e63',
		bgTo: '#27211d',
		bgGlow: '#dbc2a7'
	},
	{
		label: 'The Little Compass',
		imageUrl: '/portfolio/little-compass.webp',
		imageAlt: 'Screenshot of the Seastar website',
		link: 'https://thelittlecompass.com',
		slug: 'the-little-compass',
		cardColor: '#DDD4FD',
		bgFrom: '#5b4e8a',
		bgTo: '#211a34',
		bgGlow: '#c9bbff'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/catandalex.webm',
		label: "Cat & Alex's Wedding",
		imageUrl: '/portfolio/catandalex.webp',
		imageAlt: 'Screenshot of the Cat and Alex website',
		link: 'https://catandalex.net',
		description: `Cat and I had our wedding this year! ([You can read my vows here](https://alexledger.substack.com/p/my-vows-to-cat).)

So of course we needed a website to tell people what’s going on, collect RSVPs, and most importantly, to tell them about our story.

Cat and I are most proud of the [story page](https://catandalex.net/story/). It’s a short but very sweet and sentimental story, about how we ultimately arrived at the wedding day. The ups and downs, places we lived, and the people and animals we shared time with.

My big goal with our wedding website was to set a tone for our wedding early. I wanted the wedding to feel communal, collaborative, more about bringing people together than centering Cat and me. Sure, technically everyone is there to celebrate us, but they’re going to be spending most of their time hanging out with not-us. They’re going to be catching up with old friends, seeing family, and making new friends. And we wanted this website to set the tone for that experience early.

By the way, if you want a wedding website and don’t have the biggest budget, send me a quick message anyway. There are some pretty cool ways to build a wedding website on the cheap, so you don’t just have to use Zola; you can make your website reflect the vibe that you want in your wedding.

Big shoutout to [Mason Joel](https://masonjoelphotography.com/) who absolutely crushed the photography at our wedding. We highly recommend him if you’re having a wedding soon!`,
		slug: 'cat-and-alex-wedding',
		cardColor: '#9080D0',
		bgFrom: '#644183',
		bgTo: '#221632',
		bgGlow: '#d8b0ff'
	},
	{
		label: 'llm-tools-anki',
		imageUrl: '/portfolio/llm-tools-anki.webp',
		imageAlt: 'Screenshot of the llm-tools-anki website',
		link: 'https://github.com/aled1027/llm-tools-anki',
		slug: 'llm-tools-anki',
		cardColor: '#1B883E',
		bgFrom: '#235f36',
		bgTo: '#0e2415',
		bgGlow: '#7fd39d'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/catnesh.webm',
		label: 'Cat Neshyba',
		imageUrl: '/portfolio/catneshyba.webp',
		imageAlt: 'Screenshot of the Cat Neshyba website',
		link: 'https://catneshyba.com',
		description: `Cat Neshyba is writer of romance, fantasy, and personal essays.

On their website, we wanted to emphasize the word. The visitor’s eyes are drawn towards the writing, and then move away, and then come back again to the words. To that end, we started with a nice big paragraph next to a photo that has angles pointing to the writing. The photo has a lot of empty space and is not very kinetic.

We then flow into quotations from Cat’s work, as little samples that keep the user thinking about words and their expressions. And finally, we list out Cat’s works in stylized lists.

The typeface is similar to what you’d find in a book--it’s Source Serif 4--but we made it bigger and thinner to increase the stylized feel.`,
		slug: 'cat-neshyba',
		cardColor: '#CED2D5',
		bgFrom: '#4f5b3e',
		bgTo: '#1b2115',
		bgGlow: '#b7ce8e'
	},
	{
		videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/vyx.webm',
		label: 'Vyx',
		imageUrl: '/portfolio/vyx.webp',
		imageAlt: 'Screenshot of the Vyx website',
		link: 'https://vyx.gg',
		description: `In collaboration with [Entropic](https://entropic.vc/), I led the development of Vyx, a tool for getting crypto projects off the ground by providing tools for launching on-chain and off-chain incentive campaigns.`,
		slug: 'vyx',
		cardColor: '#8B8B8B',
		bgFrom: '#535a62',
		bgTo: '#1a1d21',
		bgGlow: '#d5dde7'
	}
];
