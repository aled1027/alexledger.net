<script lang="ts">
	import * as THREE from 'three';

	// @ts-ignore
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

	import { onMount } from 'svelte';

	let container: HTMLDivElement;

	const videos = [
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/anna-neshyba-edited.mp4',
			label: 'Anna Neshyba'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/ethyca-animation-demo-video.mp4',
			label: 'Ethyca Product Animation'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/maxlifefoundation.mp4',
			label: 'Max Life Foundation'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/incontextlearning.mp4',
			label: 'Incontext Learning'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/catandalex.mp4',
			label: 'Cat and Alex'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/catnesh.mp4',
			label: 'Cat Nesh'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/cosmicfronter-v0.mp4',
			label: 'Cosmic Fronter'
		},
		{
			videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/vyx.mp4',
			label: 'Vyx'
		}
	];

	onMount(() => {
		// We'll do something
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		camera.position.z = 5;
		scene.add(camera);

		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		const controls = new OrbitControls(camera, renderer.domElement);

		function animate() {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		}
		animate();
	});
</script>

<div class="my-l">
	<h2>Moebius Style Shaders</h2>
	<p>Description</p>
	{#each videos as video}
		<div>
			<video src={video.videoUrl} controls></video>
			<p>{video.label}</p>
		</div>
	{/each}

	<div class="mt-xl three-container" bind:this={container}></div>
</div>

<style lang="scss">
	.three-container {
		position: relative;
		width: 100%;
		height: 60vh;
		margin-inline: auto;
		cursor: grab;
		border: 1px solid black;
	}
</style>
