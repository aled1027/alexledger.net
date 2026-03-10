<script lang="ts">
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { onMount } from 'svelte';
	import { Text } from 'troika-three-text';

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
			this.camera.position.set(0, 0, 10);

			const text = new Text();
			text.text = 'Hello World';
			text.fontSize = 1;
			text.position.set(0, 0, 0);
			text.anchorX = 'center';
			text.anchorY = 'middle';
			text.color = 0xffffff;
			this.scene.add(text);

			this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			this.renderer.setClearColor(0x000000, 0);
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);

			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls.enableDamping = true;

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
	<h2>SDF Text</h2>
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
