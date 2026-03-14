<script lang="ts">
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { onMount } from 'svelte';
	import { portfolio, type PortfolioItem } from '$lib/portfolio';

	interface Config {
		itemSize: number;
		icosahedronRadius: number;
		icosahedronDetail: number;
		minCubeY: number;
	}

	const CONFIG: Config = {
		itemSize: 3,
		icosahedronRadius: 8,
		icosahedronDetail: 4,
		minCubeY: 4
	};

	const videos = portfolio.filter((item): item is PortfolioItem & { videoUrl: string } =>
		Boolean(item.videoUrl)
	);

	function randomInt(min: number, max: number): number {
		// Min is inclusive and max is exclusive
		return Math.floor(Math.random() * (max - min)) + min;
	}

	class Sketch {
		private container: HTMLDivElement;
		private scene: THREE.Scene;
		private camera: THREE.PerspectiveCamera;
		private renderer: THREE.WebGLRenderer;
		private controls: OrbitControls;
		private animationId: number | null = null;
		private videoElements: HTMLVideoElement[] = [];
		private videoTextures: THREE.VideoTexture[] = [];
		private videoMaterials: THREE.MeshBasicMaterial[] = [];

		constructor(container: HTMLDivElement) {
			this.container = container;
			this.scene = new THREE.Scene();
			this.scene.background = null;

			this.camera = new THREE.PerspectiveCamera(
				60,
				container.clientWidth / container.clientHeight,
				0.1,
				100
			);
			this.camera.position.set(0, 0, 20);

			this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			this.renderer.setClearColor(0x000000, 0);
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);

			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls.enableDamping = true;

			const itemSize = CONFIG.itemSize;
			const itemGeometry = new THREE.BoxGeometry(itemSize, itemSize, 0.1);

			const icosahedronGeometry = new THREE.IcosahedronGeometry(
				CONFIG.icosahedronRadius,
				CONFIG.icosahedronDetail
			);
			const icosPositions = icosahedronGeometry.attributes.position;
			console.log(icosPositions);

			// Put 10 cubes in a grid
			const itemPositions = [];
			for (let i = 0; i < icosPositions.count; i++) {
				const x = icosPositions.getX(i);
				const y = icosPositions.getY(i);
				const z = icosPositions.getZ(i);
				if (z >= CONFIG.minCubeY) {
					itemPositions.push(new THREE.Vector3(x, y, z));
				}
			}

			const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();

			for (let i = 0; i < videos.length; i++) {
				const video = document.createElement('video');
				video.src = videos[i].videoUrl;
				video.crossOrigin = 'anonymous';
				video.loop = true;
				video.muted = true;
				video.autoplay = true;
				video.playsInline = true;
				video.style.display = 'none';
				document.body.appendChild(video);
				this.videoElements.push(video);
				video.play().catch((err) => {
					console.warn('Video playback blocked until user interaction:', err);
				});

				const videoTexture = new THREE.VideoTexture(video);
				videoTexture.minFilter = THREE.LinearFilter;
				videoTexture.magFilter = THREE.LinearFilter;
				videoTexture.anisotropy = maxAnisotropy;
				this.videoTextures.push(videoTexture);

				video.loop = true;
				video.muted = true;
				video.autoplay = true;
				video.playsInline = true;

				video.addEventListener('loadedmetadata', () => {
					// if we want to start at a random time:
					// video.currentTime = Math.random() * video.duration;
					this.setTextureCover(videoTexture, video);
				});
				video.addEventListener('loadeddata', () => this.setTextureCover(videoTexture, video));

				const videoMaterial = new THREE.MeshBasicMaterial({
					map: videoTexture,
					side: THREE.FrontSide
				});
				this.videoMaterials.push(videoMaterial);
			}

			for (let i = 0; i < itemPositions.length; i++) {
				const pos = itemPositions[i];
				// I don't understand why, but the video selections look unevenly distributed. Very much so
				// Like everything in the same column has the same video
				const material = this.videoMaterials[i % this.videoMaterials.length];
				const cube = new THREE.Mesh(itemGeometry, material);
				cube.position.set(2 * pos.x, 2 * pos.y, pos.z);
				this.scene.add(cube);
			}
			this.animate();
		}

		private animate = (): void => {
			this.animationId = requestAnimationFrame(this.animate);

			// Update the video textures
			for (const videoTexture of this.videoTextures) {
				videoTexture.needsUpdate = true;
			}

			this.controls.update();
			this.renderer.render(this.scene, this.camera);
		};

		resize(): void {
			this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
		}

		dispose(): void {
			if (this.animationId !== null) {
				cancelAnimationFrame(this.animationId);
			}
			this.controls.dispose();
			this.renderer.dispose();
			if (this.container.contains(this.renderer.domElement)) {
				this.container.removeChild(this.renderer.domElement);
			}
		}

		private setTextureCover(texture: THREE.VideoTexture, video: HTMLVideoElement): void {
			const w = video.videoWidth;
			const h = video.videoHeight;
			if (!w || !h) return;
			const r = w / h;
			texture.offset.set(0, 0);
			texture.repeat.set(1, 1);
			if (r > 1) {
				texture.offset.set((1 - 1 / r) / 2, 0);
				texture.repeat.set(1 / r, 1);
			} else if (r < 1) {
				texture.offset.set(0, (1 - r) / 2);
				texture.repeat.set(1, r);
			}
		}
	}

	let container: HTMLDivElement;
	let sketch: Sketch;

	function onResize(): void {
		sketch?.resize();
	}

	onMount(() => {
		sketch = new Sketch(container);
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
			sketch?.dispose();
		};
	});
</script>

<div class="my-l">
	<h2>Video Grid</h2>
	<p>
		This demo explored a verison of <a
			href="https://tympanus.net/codrops/2026/02/24/from-flat-to-spatial-creating-a-3d-product-grid-with-react-three-fiber/"
			>3d shoe grid</a
		> but videos instead of shoes.
	</p>
</div>

<div class="sketch" bind:this={container}></div>

<style lang="scss">
	.sketch {
		position: absolute;
		top: 30vh;
		bottom: 0;
		left: 0;
		right: 0;
		border-radius: 0.75rem;
		overflow: hidden;
		cursor: grab;

		&:active {
			cursor: grabbing;
		}
	}
</style>
