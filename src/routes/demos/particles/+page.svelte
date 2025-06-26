<!-- FloatingEyes.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { SceneManager } from '$lib/three/SceneManager';

	let container: HTMLDivElement;
	let sceneManager: SceneManager;

	function resizeRenderer(): void {
		if (container && sceneManager) {
			sceneManager.resize(container.clientWidth, container.clientHeight);
		}
	}

	onMount(() => {
		sceneManager = new SceneManager(container);
		sceneManager.animate();
		resizeRenderer();

		window.addEventListener('resize', resizeRenderer);
		return () => {
			window.removeEventListener('resize', resizeRenderer);
			sceneManager.dispose();
			container.innerHTML = '';
		};
	});
</script>

<div class="my-l">
	<div class="mt-xl three-container" bind:this={container}></div>
</div>

<style>
	.three-container {
		position: relative;
		width: 100%;
		height: 60vh;
		border: 1px solid black;
		margin-inline: auto;
		cursor: grab;
	}
</style>
