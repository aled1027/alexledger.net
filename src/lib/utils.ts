type RGB = { r: number; g: number; b: number };

// Parses #rgb, #rrggbb, and rgb(...) strings into numeric channels.
export function parseColor(color: string): RGB {
	if (color.startsWith('#')) {
		const hex = color.slice(1);
		const normalized =
			hex.length === 3
				? hex
						.split('')
						.map((char) => char + char)
						.join('')
				: hex;

		return {
			r: parseInt(normalized.slice(0, 2), 16),
			g: parseInt(normalized.slice(2, 4), 16),
			b: parseInt(normalized.slice(4, 6), 16)
		};
	}

	const rgbMatch = color.match(/\d+(?:\.\d+)?/g);
	if (!rgbMatch || rgbMatch.length < 3) {
		return { r: 0, g: 0, b: 0 };
	}

	return {
		r: Number(rgbMatch[0]),
		g: Number(rgbMatch[1]),
		b: Number(rgbMatch[2])
	};
}

// Linearly interpolates between two colors and returns an rgb(...) string.
// The input colors are any of the formats supported by parseColor.
export function mixColor(from: string, to: string, amount: number): string {
	const t = clamp(amount, 0, 1);
	const a = parseColor(from);
	const b = parseColor(to);

	const r = Math.round(a.r + (b.r - a.r) * t);
	const g = Math.round(a.g + (b.g - a.g) * t);
	const bCh = Math.round(a.b + (b.b - a.b) * t);

	return `rgb(${r}, ${g}, ${bCh})`;
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}
