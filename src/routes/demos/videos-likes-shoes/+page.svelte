<script lang="ts">
	import * as THREE from 'three';
	import { onMount } from 'svelte';

	interface Config {
		gridCols: number;
		gridRows: number;
		itemSize: number;
	}

	const CONFIG: Config = {
		gridRows: 4,
		gridCols: 6,
		itemSize: 2
	};

	class Sketch {
		private container: HTMLDivElement;
		private scene: THREE.Scene;
		private camera: THREE.PerspectiveCamera;
		private renderer: THREE.WebGLRenderer;
		private animationId: number | null = null;

		constructor(container: HTMLDivElement) {
			this.container = container;
			this.scene = new THREE.Scene();
			this.scene.background = new THREE.Color('#0f0f12');

			this.camera = new THREE.PerspectiveCamera(
				60,
				container.clientWidth / container.clientHeight,
				0.1,
				100
			);
			this.camera.position.set(0, 0, 20);

			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);

			const itemSize = CONFIG.itemSize;
			const geometry = new THREE.BoxGeometry(itemSize, itemSize, 0.1);
			const material = new THREE.MeshNormalMaterial();

			// Put 10 cubes in a grid

			for (
				let x = -CONFIG.gridCols * itemSize + itemSize;
				x <= CONFIG.gridCols * itemSize - itemSize;
				x += 2 * itemSize
			) {
				for (
					let y = -CONFIG.gridRows * itemSize + itemSize;
					y <= CONFIG.gridRows * itemSize - itemSize;
					y += 2 * itemSize
				) {
					const cube = new THREE.Mesh(geometry, material);
					cube.position.set(x, y, 0);
					this.scene.add(cube);
				}
			}

			// put a tiny cube at 0 0 0 that's red
			// const tinySize = 2 * itemSize;
			// const tinyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
			// const tinyCube = new THREE.Mesh(
			// 	new THREE.BoxGeometry(tinySize, tinySize, tinySize),
			// 	tinyMaterial
			// );
			// tinyCube.position.set(0, 0, 0);
			// this.scene.add(tinyCube);

			this.animate();
		}

		private animate = (): void => {
			this.animationId = requestAnimationFrame(this.animate);
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
			this.renderer.dispose();
			if (this.container.contains(this.renderer.domElement)) {
				this.container.removeChild(this.renderer.domElement);
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
	<h2>Videos Likes Shoes</h2>
	<p>Description goes here</p>
</div>

<div class="sketch" bind:this={container}></div>

<style lang="scss">
	.page {
		padding: 1.5rem;
	}

	.sketch {
		width: 100%;
		height: 70vh;
		border-radius: 0.75rem;
		overflow: hidden;
	}
</style>
