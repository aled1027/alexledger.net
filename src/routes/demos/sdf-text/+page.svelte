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

		private text: Text;
		private goopiness = 0;
		private targetGoopiness = 0;

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
			this.camera.position.set(0, 0, 5);

			this.renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true
			});
			this.renderer.setClearColor(0x000000, 0);
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.renderer.setSize(container.clientWidth, container.clientHeight);
			this.renderer.outputColorSpace = THREE.SRGBColorSpace;
			container.appendChild(this.renderer.domElement);

			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls.enableDamping = true;

			this.text = new Text();
			this.text.text = 'GOO';
			this.text.fontSize = 1.6;
			this.text.anchorX = 'center';
			this.text.anchorY = 'middle';
			this.text.position.set(0, 0, 0);

			// Higher glyph resolution helps the edges stay nice as we blur/outline them.
			this.text.sdfGlyphSize = 128;

			// Base fill color
			this.text.color = 0x00ffff;

			// Troika SDF-native styling; these get animated by "goopiness"
			this.text.fillOpacity = 1;
			this.text.strokeColor = 0x00ffff;
			this.text.strokeWidth = 0;
			this.text.strokeOpacity = 1;

			this.text.outlineColor = 0x00ffff;
			this.text.outlineWidth = '0%';
			this.text.outlineBlur = '0%';
			this.text.outlineOpacity = 1;

			this.text.letterSpacing = 0;
			this.text.material = new THREE.MeshBasicMaterial({
				color: 0x00ffff,
				transparent: true
			});

			this.scene.add(this.text);
			this.text.sync();

			this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
			window.addEventListener('pointerup', this.onPointerUp);
			window.addEventListener('keydown', this.onKeyDown);

			this.animate();
		}

		private onPointerDown = (): void => {
			this.targetGoopiness = 1;
		};

		private onPointerUp = (): void => {
			this.targetGoopiness = 0;
		};

		private onKeyDown = (event: KeyboardEvent): void => {
			if (event.code === 'Space') {
				event.preventDefault();
				this.targetGoopiness = this.targetGoopiness > 0.5 ? 0 : 1;
			}
		};

		private applyGoopiness(): void {
			const g = this.goopiness;

			// Pull letters together
			this.text.letterSpacing = THREE.MathUtils.lerp(0.0, -0.11, g);

			// Add inner body thickness
			this.text.strokeWidth = `${THREE.MathUtils.lerp(0, 7, g).toFixed(2)}%`;

			// Add outer field / halo that helps neighboring letters visually connect
			this.text.outlineWidth = `${THREE.MathUtils.lerp(0, 10, g).toFixed(2)}%`;
			this.text.outlineBlur = `${THREE.MathUtils.lerp(0, 1, g).toFixed(2)}%`;
			// Troika recommends sync after layout-affecting changes.
			this.text.sync();
		}

		private animate = (): void => {
			this.animationId = requestAnimationFrame(this.animate);

			this.controls.update();

			// Ease goopiness
			this.goopiness += (this.targetGoopiness - this.goopiness) * 0.08;

			this.applyGoopiness();
			this.renderer.render(this.scene, this.camera);
		};

		resize(): void {
			const width = this.container.clientWidth;
			const height = this.container.clientHeight;

			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();

			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.renderer.setSize(width, height);
		}

		dispose(): void {
			if (this.animationId !== null) {
				cancelAnimationFrame(this.animationId);
			}

			this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
			window.removeEventListener('pointerup', this.onPointerUp);
			window.removeEventListener('keydown', this.onKeyDown);

			this.controls.dispose();
			this.text.dispose();
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
	<h2>Troika SDF Goo</h2>
	<p>Hold mouse down or press space to increase goopiness.</p>
	<p>
		This demo uses Troika's signed distance field (SDF) text rendering to animate letter spacing,
		stroke, and outline blur so the characters morph into a gooey connected shape.
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
