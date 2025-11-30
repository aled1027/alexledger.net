<script lang="ts">
	import * as THREE from 'three';

	// @ts-ignore
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

	import { onMount } from 'svelte';
	import { ThreeEffect, type ThreeEffectOptions } from '$lib/three/utils';

	let container: HTMLDivElement;

	interface MoebiusEffectOptions extends ThreeEffectOptions {
		strength?: number;
	}

	/**
	 * A custom effect implemented in the same architectural style
	 * as Three.js's AsciiEffect — a wrapper around WebGLRenderer.
	 */
	class MoebiusEffect extends ThreeEffect {
		private strength: number;

		// Internal rendering system
		private sceneColor: THREE.WebGLRenderTarget;
		private scene: THREE.Scene;
		private camera: THREE.OrthographicCamera;
		private material: THREE.ShaderMaterial;

		constructor(
			renderer: THREE.WebGLRenderer,
			scene: THREE.Scene,
			camera: THREE.OrthographicCamera,
			options: MoebiusEffectOptions = {}
		) {
			super(renderer, options);
			this.strength = options.strength ?? 0.5;
			this.scene = scene;
			this.camera = camera;

			this.sceneColor = new THREE.WebGLRenderTarget(1, 1);
			const plane = new THREE.PlaneGeometry(2, 2);

			this.material = new THREE.ShaderMaterial({
				uniforms: {
					tDiffuse: { value: null as THREE.Texture | null },
					strength: { value: this.strength }
				},
				vertexShader: `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = vec4(position, 1.0);
				}
			`,
				fragmentShader: `
				varying vec2 vUv;
				uniform sampler2D tDiffuse;
				uniform float strength;

				void main() {
					vec2 uv = vUv;

					float angle = uv.x * 6.283185;  // 2π
					float radius = uv.y;

					radius += sin(angle * 2.0) * 0.05 * strength;

					vec2 warpedUV = vec2(
						( sin(angle) * radius * 0.5 ) + 0.5,
						( cos(angle) * radius * 0.5 ) + 0.5
					);

					gl_FragColor = texture2D(tDiffuse, warpedUV);
				}`,
			});

			const quad = new THREE.Mesh(plane, this.material);
			this.scene.add(quad);
		}

		protected onResize(width: number, height: number): void {
			this.sceneColor.setSize(width, height);
		}

		protected applyEffect(scene: THREE.Scene, camera: THREE.Camera): void {
			// Render scene → render target
			this.renderer.setRenderTarget(this.sceneColor);
			this.renderer.clear();
			this.renderer.render(scene, camera);

			// Use the render target texture for the warp pass
			this.applyMoebiusWarp();
		}

		private applyMoebiusWarp(): void {
			this.material.uniforms.tDiffuse.value = this.sceneColor.texture;

			// Render fullscreen quad to screen
			this.renderer.setRenderTarget(null);
			this.renderer.clear();
			this.renderer.render(this.scene, this.camera);
		}
	}

	onMount(() => {
		const scene = new THREE.Scene();
		const aspect = container.clientWidth / container.clientHeight;
		const frustumSize = 5;
		const camera = new THREE.OrthographicCamera(
			(-frustumSize * aspect) / 2,
			(frustumSize * aspect) / 2,
			frustumSize / 2,
			-frustumSize / 2,
			0.1,
			1000
		);
		camera.position.z = 5;
		scene.add(camera);

		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		scene.background = null; // Make background transparent

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		const moebiusEffect = new MoebiusEffect(renderer, scene, camera);
		moebiusEffect.setSize(container.clientWidth, container.clientHeight);
		moebiusEffect.render(scene, camera);
		const controls = new OrbitControls(camera, renderer.domElement);

		function animate() {
			requestAnimationFrame(animate);
			controls.update();
			moebiusEffect.render(scene, camera);
		}
		animate();
	});
</script>

<div class="my-l">
	<h2>Moebius Style Shaders</h2>
	<p>
		Based on <a
			target="_blank"
			href="https://blog.maximeheckel.com/posts/moebius-style-post-processing/">this blog post</a
		>
		by Maxime Heckel, which is itself based on
		<a target="_blank" href="https://www.youtube.com/watch?v=jlKNOirh66E&ab_channel=UselessGameDev"
			>this video</a
		> by Useless Game Dev.
	</p>

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
