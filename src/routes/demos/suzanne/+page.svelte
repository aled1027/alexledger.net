<script lang="ts">
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

	// @ts-ignore
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

	import { onMount } from 'svelte';

	let container: HTMLDivElement;
	let mosaic: number = $state(10);
	let progress: number = $state(0.0);

	class Sketch {
		private scene: THREE.Scene;
		private camera: THREE.PerspectiveCamera;
		private renderer: THREE.WebGLRenderer;
		private animationId: number | null = null;
		private controls: OrbitControls;
		private suzanneMaterial: THREE.ShaderMaterial;
		private startTimeMs: number;

		constructor(container: HTMLDivElement) {
			this.scene = new THREE.Scene();
			this.scene.background = null;

			this.camera = new THREE.PerspectiveCamera(
				75,
				container.clientWidth / container.clientHeight,
				0.1,
				1000
			);
			this.camera.position.z = 2;
			this.scene.add(this.camera);

			this.suzanneMaterial = new THREE.ShaderMaterial({
				uniforms: {
					uTime: { value: 0 },
					uMosaic: { value: mosaic },
					uProgress: { value: progress }
				},
				vertexShader: `
				varying vec2 vUv;
				uniform float uTime;
				uniform float uMosaic;
				uniform float uProgress;
				void main() {
				    vec3 pos = position;
					vec3 posPixelated = floor(pos * uMosaic) / uMosaic;
					pos = mix(pos, posPixelated, uProgress);

					gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);


					vUv = uv;
				}
			`,
				fragmentShader: `
				varying vec2 vUv;
				uniform float uTime;
				uniform float uMosaic;
				uniform float uProgress;
				void main() {
					gl_FragColor = vec4(vUv.y, 0.5, 0.8, 1.0);
				}
			`
			});

			const loader = new GLTFLoader();
			loader.load('/models/Suzanne.gltf', (gltf: any) => {
				const suzanneMesh = gltf.scene.getObjectByProperty('type', 'Mesh');
				const suzanneGeometry = suzanneMesh.geometry.clone();
				suzanneGeometry.computeVertexNormals();
				const suzanne = new THREE.Mesh(suzanneGeometry, this.suzanneMaterial);
				this.scene.add(suzanne);

			});

			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);

			this.controls = new OrbitControls(this.camera, this.renderer.domElement);

			this.startTimeMs = Date.now();
			this.animate();
		}

		resize(): void {
			this.camera.aspect = container.clientWidth / container.clientHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(container.clientWidth, container.clientHeight);
		}

		animate = (): void => {
			const timeSeconds = (Date.now() - this.startTimeMs) / 1000;
			this.suzanneMaterial.uniforms.uTime.value = timeSeconds;
			this.suzanneMaterial.uniforms.uMosaic.value = mosaic;
			this.suzanneMaterial.uniforms.uProgress.value = progress;

			this.animationId = requestAnimationFrame(this.animate);
			this.controls.update();
			this.renderer.render(this.scene, this.camera);
		};

		dispose(): void {
			if (this.animationId !== null) {
				cancelAnimationFrame(this.animationId);
			}
			this.renderer.dispose();
		}
	}

	let sketch: Sketch;

	onMount(() => {
		// We'll do something
		sketch = new Sketch(container);
		sketch.resize();

		window.addEventListener('resize', () => {
			sketch.resize();
		});
		return () => {
			sketch.dispose();
			window.removeEventListener('resize', () => {
				sketch.resize();
			});
		};
	});
</script>

<div class="my-l">
	<h2>Moebius Style Shaders</h2>
	<p>Description</p>
	<div class="my-l">
		<label for="mosaic">Mosaic ({mosaic})</label>
		<input id="mosaic" type="range" bind:value={mosaic} min={1} max={20} step={1} />
		<label for="progress">Progress ({progress})</label>
		<input id="progress" type="range" bind:value={progress} min={0} max={1} step={0.01} />
	</div>

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
