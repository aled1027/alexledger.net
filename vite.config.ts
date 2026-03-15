import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson()],

	// See https://vite.dev/config/shared-options#css-preprocessoroptions
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern'
			}
		}
	}
});
