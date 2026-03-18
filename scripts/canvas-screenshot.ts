#!/usr/bin/env npx tsx
import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

function parseArgs() {
	const args = process.argv.slice(2);
	const result: { out?: string; port?: number; fullPage?: boolean; headless?: boolean } = {};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		const next = args[i + 1];

		switch (arg) {
			case '--out':
				result.out = next;
				i++;
				break;
			case '--port':
				result.port = parseInt(next, 10);
				i++;
				break;
			case '--full-page':
				result.fullPage = true;
				break;
			case '--headless':
				result.headless = true;
				break;
			case '--help':
			case '-h':
				console.log(`
Capture screenshot from the agent-loop demo.

Usage:
  npx tsx scripts/canvas-screenshot.ts [options]

Options:
  --out <file>      Output file (default: screenshots/agent-loop-canvas.png)
  --port <number>   Dev server port (default: 5173)
  --full-page       Capture the entire page instead of just the canvas
  --headless        Run without opening a browser window (may fail for WebGL)
`);
				process.exit(0);
		}
	}

	return result;
}

async function main() {
	const args = parseArgs();
	const port = args.port ?? 5173;
	const outputPath = args.out ?? 'screenshots/agent-loop-canvas.png';
	const url = `http://localhost:${port}/demos/agent-loop`;

	const browser = await chromium.launch({ headless: args.headless ?? false });
	const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

	try {
		console.log('Opening:', url);
		await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

		const canvas = page.locator('.three-container canvas');
		await canvas.waitFor({ state: 'visible', timeout: 30000 });

		// Allow GLTF load + first WebGL frames to settle
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
