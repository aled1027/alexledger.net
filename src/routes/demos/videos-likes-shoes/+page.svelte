<script lang="ts">
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { onMount } from 'svelte';

	interface Config {
		itemSize: number;
		icosahedronRadius: number;
		icosahedronDetail: number;
		minCubeY: number;
	}

	const CONFIG: Config = {
		itemSize: 0.75,
		icosahedronRadius: 6,
		icosahedronDetail: 3,
		minCubeY: 3
	};

	class Sketch {
		private container: HTMLDivElement;
		private scene: THREE.Scene;
		private camera: THREE.PerspectiveCamera;
		private renderer: THREE.WebGLRenderer;
		private controls: OrbitControls;
		private animationId: number | null = null;

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

			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);

			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls.enableDamping = true;

			const itemSize = CONFIG.itemSize;
			const geometry = new THREE.BoxGeometry(itemSize, itemSize, 0.1);
			const material = new THREE.MeshNormalMaterial();

			const icosahedronGeometry = new THREE.IcosahedronGeometry(
				CONFIG.icosahedronRadius,
				CONFIG.icosahedronDetail
			);
			const icosPositions = icosahedronGeometry.attributes.position;
			console.log(icosPositions);

			// Put 10 cubes in a grid
			const cubePositions = [];
			for (let i = 0; i < icosPositions.count; i++) {
				const x = icosPositions.getX(i);
				const y = icosPositions.getY(i);
				const z = icosPositions.getZ(i);
				if (z >= CONFIG.minCubeY) {
					cubePositions.push(new THREE.Vector3(x, y, z));
				}
			}

			for (const pos of cubePositions) {
				const cube = new THREE.Mesh(geometry, material);
				cube.position.set(pos.x, pos.y, pos.z);
				this.scene.add(cube);
			}
			this.animate();
		}

		private animate = (): void => {
			this.animationId = requestAnimationFrame(this.animate);
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
		cursor: grab;

		&:active {
			cursor: grabbing;
		}
	}
</style>
