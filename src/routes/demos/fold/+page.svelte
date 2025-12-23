<script lang="ts">
	import * as THREE from 'three';

	// @ts-ignore
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

	import { onMount } from 'svelte';

	class Sketch {
		private scene: THREE.Scene;
		private camera!: THREE.PerspectiveCamera;
		private renderer!: THREE.WebGLRenderer;
		private container: HTMLDivElement;
		private animationId: number | null = null;
		private mesh: THREE.Mesh | null = null;

		constructor(container: HTMLDivElement) {
			this.container = container;
			this.scene = new THREE.Scene();
			this.scene.background = null;

			this.addObjects();
			this.setupCameraAndRenderer();
			this.animate();
		}

		private setupCameraAndRenderer(): void {
			const aspect = this.container.clientWidth / this.container.clientHeight;
			this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
			this.camera.position.set(0, 0, 10);
			this.camera.lookAt(0, 0, 0);
			this.scene.add(this.camera);

			this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			this.renderer.setPixelRatio(window.devicePixelRatio);
			this.renderer.setClearColor(0x000000, 0);
			this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
			this.container.appendChild(this.renderer.domElement);

			const controls = new OrbitControls(this.camera, this.renderer.domElement);
			controls.enableDamping = true;
			controls.dampingFactor = 0.05;
		}

		private addObjects(): void {
			const texturePath = '/textures/lucca-and-rilke.png';
			const texture = new THREE.TextureLoader().load(texturePath);
			const shaderMaterial = new THREE.ShaderMaterial({
				side: THREE.DoubleSide,
				vertexShader: `
				varying vec2 vUv;
				uniform float uProgress;

				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
				fragmentShader: `
				varying vec2 vUv;
				uniform sampler2D uTexture;
				uniform float uProgress;

				void main() {
					gl_FragColor = texture2D(uTexture, vec2(vUv.x, vUv.y));
				}
			`,
				uniforms: {
					uTexture: { value: texture },
					uProgress: { value: 0 }
				}
			});

			const planeAspect = 1.289;
			this.mesh = new THREE.Mesh(
				new THREE.PlaneGeometry(10 * planeAspect, 10, 10, 10),
				shaderMaterial
			);
			this.scene.add(this.mesh);
		}

		private animate(): void {
			this.animationId = requestAnimationFrame(() => this.animate());
			if (this.mesh) {
				(this.mesh.material as THREE.ShaderMaterial).uniforms.uProgress.value = progress;
			}
			this.renderer.render(this.scene, this.camera);
		}

		public dispose(): void {
			if (this.animationId !== null) {
				cancelAnimationFrame(this.animationId);
			}
			this.renderer.dispose();
		}
	}

	let sketch: Sketch;
	let container: HTMLDivElement;
	let progress = $state(0);

	onMount(() => {
		sketch = new Sketch(container);
		return () => {
			sketch.dispose();
		};
	});
</script>

<div class="my-l demo-container">
	<h1>Fold</h1>
	<p>
		<a
			target="_blank"
			href="https://github.com/aled1027/alexledger.net/tree/main/src/routes/demos/fold/%2Bpage.svelte"
			>Demo code</a
		>
	</p>
	<div class="my-l">
		{progress}
		<input type="range" bind:value={progress} min="0" max="1" step="0.01" />
	</div>
	<div class="mt-xl three-container" bind:this={container}></div>
</div>

<style lang="scss">
	.three-container {
		position: relative;
		width: 100%;
		height: 60vh;
		margin-inline: auto;
		cursor: pointer;
		border: 1px solid black;
	}

	p {
		max-width: 55rem;
	}
</style>
