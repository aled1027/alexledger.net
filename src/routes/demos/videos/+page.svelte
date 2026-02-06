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

		// Create video elements and textures for each face (6 faces total)
		const videoTextures: THREE.VideoTexture[] = [];
		const videoElements: HTMLVideoElement[] = [];

		// Create 6 video elements, one for each face of the cube
		for (let i = 0; i < 6; i++) {
			const video = document.createElement('video');
			video.src = videos[i].videoUrl;
			video.crossOrigin = 'anonymous';
			video.loop = true;
			video.muted = true;
			video.autoplay = true;
			video.playsInline = true;
			video.style.display = "none";
			document.body.appendChild(video);
			video.play();
			videoElements.push(video);

			// Create a THREE texture from the video
			const videoTexture = new THREE.VideoTexture(video);
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;
			videoTexture.format = THREE.RGBAFormat;
			videoTextures.push(videoTexture);
		}

		const geometry = new THREE.BoxGeometry(1, 1, 1);

		// Create an array of 6 materials, each using a different video texture
		const materials = videoTextures.map(texture => 
			new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide })
		);

		const cube = new THREE.Mesh(geometry, materials);
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
	<h2>The Video Screensaver</h2>

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
