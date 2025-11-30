<script lang="ts">
	import * as THREE from 'three';

	// @ts-ignore
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

	import { onMount } from 'svelte';
	import { ThreeEffect, type ThreeEffectOptions } from '$lib/three/utils';

	let container: HTMLDivElement;

	class MoebiusEffect extends ThreeEffect {
		private strength: number;
		
		// Scene color is an off-screen buffer that's a virtual canvas
		private sceneColor: THREE.WebGLRenderTarget;
		private scene: THREE.Scene;
		private camera: THREE.OrthographicCamera;
		private material: THREE.ShaderMaterial;

		constructor(
			renderer: THREE.WebGLRenderer,
			scene: THREE.Scene,
			camera: THREE.OrthographicCamera,
			strength: number
		) {
			super(renderer);
			this.strength = strength;
			this.scene = scene;
			this.camera = camera;

			this.sceneColor = new THREE.WebGLRenderTarget(1, 1);
			console.log('sceneColor', this.sceneColor);
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
		scene.background = new THREE.Color(0x4E44BB);
		const aspect = container.clientWidth / container.clientHeight;
		const camera = new THREE.PerspectiveCamera(
			65, // fov
			aspect, // aspect
			0.1, // near
			1000 // far
		);
		camera.position.set(0, 5, 10);
		camera.lookAt(0, 0, 0);
		scene.add(camera);

		// A a directional light
		const directionalLight = new THREE.DirectionalLight(0xffffff, 4.5);
		directionalLight.position.set(10, 10, 10);
		directionalLight.lookAt(0, 0, 0);
		directionalLight.castShadow = true;
		scene.add(directionalLight);

		// Ambient light
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
		scene.add(ambientLight);

		// Add Sphere
		const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
		const sphereColor = new THREE.Color("orange");
		const sphereMaterial = new THREE.MeshStandardMaterial({ color: sphereColor });
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.castShadow = true;
		sphere.position.set(-1, 2, 1);
		scene.add(sphere);

		// Add ground
		const groundGeometry = new THREE.PlaneGeometry(10, 10, 100, 100);
		const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
		const ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.position.set(0, 0, 0);
		ground.rotation.x = -Math.PI / 2;
		scene.add(ground);


		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);


		// const moebiusEffect = new MoebiusEffect(renderer, scene, camera, 0.1);
		// moebiusEffect.setSize(container.clientWidth, container.clientHeight);
		// moebiusEffect.render(scene, camera);

		const controls = new OrbitControls(camera, renderer.domElement);

		function animate() {
			requestAnimationFrame(animate);
			controls.update();
			// moebiusEffect.render(scene, camera);
			renderer.render(scene, camera);
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
