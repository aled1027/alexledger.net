<script lang="ts">
	import * as THREE from 'three';
	import { onMount, onDestroy } from 'svelte';

	// https://tympanus.net/codrops/2015/11/04/rain-water-effect-experiments/

	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let scene: THREE.Scene;
	let camera: THREE.OrthographicCamera;

	function animate() {
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}

	onMount(() => {
		const aspect = container.clientWidth / container.clientHeight;
		const cameraDistance = 8;
		camera = new THREE.OrthographicCamera(
			-aspect * cameraDistance,
			aspect * cameraDistance,
			cameraDistance,
			-cameraDistance,
			1,
			1000
		);
		camera.position.set(0, -10, 5);
		camera.lookAt(0, 0, 0);
		scene = new THREE.Scene();

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		container.appendChild(renderer.domElement);

		animate();
	});

	onDestroy(() => {
		if (renderer) {
			renderer.dispose();
		}
	});
</script>

<div class="my-l">
	<h2>Rain</h2>
	<p>
		<a
			target="_blank"
			href="https://github.com/aled1027/alexledger.net/tree/main/src/routes/demos/rain/%2Bpage.svelte"
			>Demo code</a
		>
	</p>
	<div class="mt-xl three-container" bind:this={container}></div>
</div>

<style>
	.three-container {
		position: relative;
		width: 100%;
		height: 60vh;
		margin-inline: auto;
	}
</style>
