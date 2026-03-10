<script lang="ts">
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { onMount } from 'svelte';
	import { Text } from 'troika-three-text';

	let gooVelocity = 0.002;
	let targetGooiness = $state(0.5);

	class Sketch {
		private container: HTMLDivElement;
		private scene: THREE.Scene;
		private camera: THREE.PerspectiveCamera;
		private renderer: THREE.WebGLRenderer;
		private controls: OrbitControls;
		private animationId: number | null = null;

		private text: Text;
		private gooiness = 0;

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

			// Troika SDF-native styling; these get animated by "gooiness"
			this.text.letterSpacing = 0;
			this.text.fillOpacity = 1;
			this.text.color = '#7CFF00';
			this.text.strokeColor = '#7CFF00';
			this.text.strokeWidth = 0;
			this.text.strokeOpacity = 1;

			this.text.outlineColor = '#7CFF00';
			this.text.outlineWidth = '0%';
			this.text.outlineBlur = '0%';
			this.text.outlineOpacity = 1;

			this.scene.add(this.text);
			this.text.sync();

			this.animate();
		}

		private applyGooiness(): void {
			const g = this.gooiness;

			// Pull letters together
			this.text.letterSpacing = THREE.MathUtils.lerp(0.0, -0.11, g);

			// Add inner body thickness
			this.text.strokeWidth = `${THREE.MathUtils.lerp(0, 17, g).toFixed(2)}%`;

			// Add outer field / halo that helps neighboring letters visually connect
			this.text.outlineWidth = `${THREE.MathUtils.lerp(0, 12, g).toFixed(2)}%`;
			this.text.outlineBlur = `${THREE.MathUtils.lerp(0, 1, g).toFixed(2)}%`;
			// Troika recommends sync after layout-affecting changes.
			this.text.sync();
		}

		private animate = (): void => {
			this.animationId = requestAnimationFrame(this.animate);

			targetGooiness = targetGooiness + gooVelocity;
			if (targetGooiness > 1) {
				gooVelocity *= -1;
				targetGooiness = 1;
			} else if (targetGooiness < 0) {
				gooVelocity *= -1;
				targetGooiness = 0;
			}

			this.controls.update();

			// Ease gooiness
			this.gooiness += (targetGooiness - this.gooiness) * 0.08;

			this.applyGooiness();
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

<div class="isolate">
	<div class="my-l anchor">
		<h2>Gooey Text</h2>
		<p>Uses Troika's SDF text rendering to create gooey text.</p>
		<div class="my-s">
			<label for="gooiness"
				>Gooiness
				{` (${targetGooiness.toFixed(2)})`}
			</label>
			<input type="range" min="0" max="1" step="0.01" bind:value={targetGooiness} id="gooiness" />
		</div>
	</div>

	<div class="sketch" bind:this={container}></div>
</div>

<style lang="scss">
	.isolate {
		position: relative;
		isolation: isolate;
		min-height: 85lvh;
	}
	.anchor {
		anchor-name: --sketch-anchor;
	}

	.sketch {
		position: absolute;
		position-anchor: --sketch-anchor;
		top: anchor(--sketch-anchor bottom);
		left: 0;
		right: 0;
		bottom: 0;
		cursor: grab;

		&:active {
			cursor: grabbing;
		}
	}
</style>
