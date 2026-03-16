import { error } from '@sveltejs/kit';
import { portfolio } from '$lib/portfolio';

export function entries() {
	return portfolio.map((p) => ({ slug: p.slug }));
}

export function load({ params }: { params: { slug: string } }) {
	const item = portfolio.find((p) => p.slug === params.slug);
	if (!item) {
		error(404, 'Portfolio item not found');
	}
  return { item };
}
