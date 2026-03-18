#!/usr/bin/env npx tsx
import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

type CliMarker = {
	pos: [number, number, number];
	color?: string;
	size?: number;
};

function parseVector3(input: string, flagName: string): [number, number, number] {
	const parts = input.split(',').map((v) => Number.parseFloat(v.trim()));
	if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
		throw new Error(`Invalid ${flagName} value "${input}". Expected format: x,y,z`);
	}
	return [parts[0], parts[1], parts[2]];
}

function parseMarker(input: string): CliMarker {
	// x,y,z,color,size  (color and size optional)
	const parts = input.split(',').map((v) => v.trim());
	if (parts.length < 3) {
		throw new Error(`Invalid --marker value "${input}". Expected: x,y,z[,color][,size]`);
	}

	const pos = [
		Number.parseFloat(parts[0]),
		Number.parseFloat(parts[1]),
		Number.parseFloat(parts[2])
	] as [number, number, number];

	if (pos.some((n) => !Number.isFinite(n))) {
		throw new Error(`Invalid --marker position in "${input}". Expected numeric x,y,z.`);
	}

	let color: string | undefined;
	let size: number | undefined;

	if (parts[3]) {
		// If 4th slot is numeric, treat as size; otherwise treat as color.
		const maybeSize = Number.parseFloat(parts[3]);
		if (Number.isFinite(maybeSize)) {
			size = maybeSize;
		} else {
			color = parts[3];
		}
	}

	if (parts[4]) {
		const parsedSize = Number.parseFloat(parts[4]);
		if (!Number.isFinite(parsedSize) || parsedSize <= 0) {
			throw new Error(`Invalid --marker size in "${input}". Size must be > 0.`);
		}
		size = parsedSize;
	}

	return { pos, color, size };
}

function parseArgs() {
	const args = process.argv.slice(2);
	const result: {
		out?: string;
		port?: number;
		fullPage?: boolean;
		headless?: boolean;
		route?: string;
		selector?: string;
		angle?: string;
		pos?: [number, number, number];
		lookAt?: [number, number, number];
		zoom?: number;
		markersFile?: string;
		inlineMarkers: CliMarker[];
	} = { inlineMarkers: [] };

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		const next = args[i + 1];

		switch (arg) {
			case '--out':
				result.out = next;
				i++;
				break;
			case '--port':
				result.port = Number.parseInt(next, 10);
				i++;
				break;
			case '--route':
				result.route = next;
				i++;
				break;
			case '--selector':
				result.selector = next;
				i++;
				break;
			case '--full-page':
				result.fullPage = true;
				break;
			case '--headless':
				result.headless = true;
				break;
			case '--angle':
				result.angle = next;
				i++;
				break;
			case '--pos':
				result.pos = parseVector3(next, '--pos');
				i++;
				break;
			case '--look-at':
				result.lookAt = parseVector3(next, '--look-at');
				i++;
				break;
			case '--zoom':
				result.zoom = Number.parseFloat(next);
				i++;
				break;
			case '--markers':
				result.markersFile = next;
				i++;
				break;
			case '--marker':
				result.inlineMarkers.push(parseMarker(next));
				i++;
				break;
			case '--help':
			case '-h':
				console.log(`
Capture screenshot from a canvas route.

Usage:
  npx tsx scripts/canvas-screenshot.ts [options]

Core options:
  --out <file>          Output file (default: screenshots/agent-loop-canvas.png)
  --port <number>       Dev server port (default: 5173)
  --route <path>        Route path (default: /demos/agent-loop)
  --selector <css>      Canvas selector (default: .three-container canvas)
  --full-page           Capture full page instead of canvas
  --headless            Run without opening browser window (WebGL may fail)

Camera options (forwarded as query params):
  --angle <preset>      front|back|left|right|top|bottom|iso|iso-back|iso-left|iso-right
  --pos "x,y,z"         Explicit camera position
  --look-at "x,y,z"     OrbitControls target / look-at point
  --zoom <number>       Zoom multiplier (>1 zooms in)

Debug marker options:
  --markers <file>      JSON file of markers
  --marker "x,y,z,color,size"
                        Add inline marker (repeatable). color/size optional.

Examples:
  npx tsx scripts/canvas-screenshot.ts --angle iso --out screenshots/iso.png
  npx tsx scripts/canvas-screenshot.ts --pos "2,1,2" --look-at "0,0,0" --zoom 1.5
  npx tsx scripts/canvas-screenshot.ts --marker "0,0,0,red,0.08" --marker "1,0,0,cyan,0.05"
`);
				process.exit(0);
		}
	}

	return result;
}

function loadMarkersFromFile(filePath: string): CliMarker[] {
	const absolute = path.resolve(filePath);
	const raw = fs.readFileSync(absolute, 'utf8');
	const parsed = JSON.parse(raw);

	const toMarker = (value: any): CliMarker | null => {
		if (!value || !value.pos || !Array.isArray(value.pos) || value.pos.length !== 3) return null;
		const [x, y, z] = value.pos.map((n: unknown) => Number.parseFloat(String(n)));
		if (![x, y, z].every((n) => Number.isFinite(n))) return null;
		const marker: CliMarker = { pos: [x, y, z] };
		if (typeof value.color === 'string') marker.color = value.color;
		if (typeof value.size === 'number' && Number.isFinite(value.size) && value.size > 0)
			marker.size = value.size;
		return marker;
	};

	if (Array.isArray(parsed)) {
		return parsed.map(toMarker).filter((m): m is CliMarker => m !== null);
	}

	if (typeof parsed === 'object' && parsed !== null) {
		return Object.values(parsed)
			.map((value) => toMarker(value))
			.filter((m): m is CliMarker => m !== null);
	}

	return [];
}

async function main() {
	const args = parseArgs();
	const port = args.port ?? 5173;
	const route = args.route ?? '/demos/agent-loop';
	const selector = args.selector ?? '.three-container canvas';
	const outputPath = args.out ?? 'screenshots/agent-loop-canvas.png';

	const params = new URLSearchParams();
	if (args.angle) params.set('angle', args.angle);
	if (args.pos) params.set('pos', args.pos.join(','));
	if (args.lookAt) params.set('lookAt', args.lookAt.join(','));
	if (typeof args.zoom === 'number' && Number.isFinite(args.zoom) && args.zoom > 0) {
		params.set('zoom', String(args.zoom));
	}

	let allMarkers: CliMarker[] = [];
	if (args.markersFile) {
		allMarkers = allMarkers.concat(loadMarkersFromFile(args.markersFile));
	}
	allMarkers = allMarkers.concat(args.inlineMarkers);
	if (allMarkers.length > 0) {
		const encoded = Buffer.from(JSON.stringify(allMarkers)).toString('base64');
		params.set('markers', encoded);
	}

	const query = params.toString();
	const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
	const url = `http://localhost:${port}${normalizedRoute}${query ? `?${query}` : ''}`;

	const browser = await chromium.launch({ headless: args.headless ?? false });
	const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

	try {
		console.log('Opening:', url);
		await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

		const canvas = page.locator(selector);
		await canvas.waitFor({ state: 'visible', timeout: 30000 });
		await page.waitForTimeout(1500);

		const outputDir = path.dirname(outputPath);
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		if (args.fullPage) {
			await page.screenshot({ path: outputPath, fullPage: true });
		} else {
			await canvas.screenshot({ path: outputPath });
		}

		console.log('Screenshot saved to:', outputPath);
	} catch (e) {
		console.error('Capture failed:', e);
		process.exit(1);
	} finally {
		await browser.close();
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
