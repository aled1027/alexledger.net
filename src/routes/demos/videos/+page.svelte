<script lang="ts">
	import * as THREE from 'three';
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
		camera.position.z = 3;
		scene.add(camera);

		// Create renderer first so we can use its capabilities for texture quality
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

		// Create video elements and textures for each face (6 faces total)
		const videoTextures: THREE.VideoTexture[] = [];
		const videoElements: HTMLVideoElement[] = [];

		// Stretch video texture to cover the whole square face (center-crop, no letterboxing)
		function setTextureCover(texture: THREE.VideoTexture, video: HTMLVideoElement) {
			const w = video.videoWidth;
			const h = video.videoHeight;
			if (!w || !h) return;
			const r = w / h;
			texture.offset.set(0, 0);
			texture.repeat.set(1, 1);
			if (r > 1) {
				// Landscape: crop sides to get a square
				texture.offset.set((1 - 1 / r) / 2, 0);
				texture.repeat.set(1 / r, 1);
			} else if (r < 1) {
				// Portrait: crop top/bottom to get a square
				texture.offset.set(0, (1 - r) / 2);
				texture.repeat.set(1, r);
			}
			texture.needsUpdate = true;
		}

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
			videoTexture.anisotropy = maxAnisotropy;
			videoTexture.format = THREE.RGBAFormat;
			videoTextures.push(videoTexture);

			// When metadata loads, stretch texture to cover the face (no letterboxing)
			video.addEventListener('loadedmetadata', () => setTextureCover(videoTexture, video));
			// Some sources only report dimensions after playing
			video.addEventListener('loadeddata', () => setTextureCover(videoTexture, video));
		}

		const size = 1.5;
		const geometry = new THREE.BoxGeometry(size, size, size);

		// Create an array of 6 materials, each using a different video texture
		const materials = videoTextures.map(texture =>
			new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide })
		);

		const cube = new THREE.Mesh(geometry, materials);
		scene.add(cube);

		// ——— Screensaver parameters (adjust these) ———
		const MOVE_BOUNDS = 2.5;           // half-width of movement box (keep cube in frame)
		const MOVE_SPEED = 0.0015;            // units per frame
		const MOVE_DIR_X = 0.005;             // velocity direction X (normalized with Y)
		const MOVE_DIR_Y = 0.005;             // velocity direction Y
		const ROT_SPEED_X = 0.0020;          // radians per frame
		const ROT_SPEED_Y = 0.0020;
		const ROT_SPEED_Z = 0.0010;
		// —————————————————————————————————────────————

		const moveDirLen = Math.hypot(MOVE_DIR_X, MOVE_DIR_Y) || 1;
		const velX = (MOVE_SPEED * MOVE_DIR_X) / moveDirLen;
		const velY = (MOVE_SPEED * MOVE_DIR_Y) / moveDirLen;

		let pos = new THREE.Vector3(0, 0, 0);
		const vel = new THREE.Vector3(velX, velY, 0);

		function animate() {
			requestAnimationFrame(animate);

			pos.add(vel);
			if (pos.x <= -MOVE_BOUNDS) {
				pos.x = -MOVE_BOUNDS;
				vel.x = Math.abs(vel.x);
			}
			if (pos.x >= MOVE_BOUNDS) {
				pos.x = MOVE_BOUNDS;
				vel.x = -Math.abs(vel.x);
			}
			if (pos.y <= -MOVE_BOUNDS) {
				pos.y = -MOVE_BOUNDS;
				vel.y = Math.abs(vel.y);
			}
			if (pos.y >= MOVE_BOUNDS) {
				pos.y = MOVE_BOUNDS;
				vel.y = -Math.abs(vel.y);
			}
			cube.position.copy(pos);

			cube.rotation.x += ROT_SPEED_X;
			cube.rotation.y += ROT_SPEED_Y;
			cube.rotation.z += ROT_SPEED_Z;

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
		cursor: default;
		border: 1px solid black;
	}
</style>
