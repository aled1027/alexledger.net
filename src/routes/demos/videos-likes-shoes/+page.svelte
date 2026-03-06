<script lang="ts">
	import * as THREE from 'three';
	import { onMount } from 'svelte';

	class Sketch {
		private container: HTMLDivElement;
		private scene: THREE.Scene;
		private camera: THREE.PerspectiveCamera;
		private renderer: THREE.WebGLRenderer;
		private cube: THREE.Mesh;
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
			this.camera.position.z = 3;

			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);

			const geometry = new THREE.BoxGeometry(1, 1, 1);
			const material = new THREE.MeshNormalMaterial();
			this.cube = new THREE.Mesh(geometry, material);
			this.scene.add(this.cube);

			this.animate();
		}

		private animate = (): void => {
			this.animationId = requestAnimationFrame(this.animate);
			this.cube.rotation.x += 0.01;
			this.cube.rotation.y += 0.01;
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
			(this.cube.geometry as THREE.BufferGeometry).dispose();
			(this.cube.material as THREE.Material).dispose();
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
