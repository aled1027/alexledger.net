<script lang="ts">
	import * as THREE from 'three';
	import { onMount, onDestroy } from 'svelte';

	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let scene: THREE.Scene;
	let camera: THREE.OrthographicCamera;

	// Animation loop
	function animate() {
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}

	onMount(() => {
		const aspect = container.clientWidth / container.clientHeight;
		const cameraDistance = 8;
		camera = new THREE.OrthographicCamera(
			-aspect * cameraDistance,
			aspect * cameraDistance,
			cameraDistance,
			-cameraDistance,
			1,
			1000
		);
		camera.position.set(0, -10, 5);
		camera.lookAt(0, 0, 0);
		scene = new THREE.Scene();

		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load('/textures/explore.png');
		const shaderMaterial = new THREE.ShaderMaterial({
			uniforms: {
				uTexture: { value: texture }
			},
			vertexShader: `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform sampler2D uTexture;
				varying vec2 vUv;
				void main() {
					vec4 texColor = texture2D(uTexture, vUv);
					gl_FragColor = texColor;
				}
			`,
			transparent: true
		});

		const exploreGeometry = new THREE.PlaneGeometry(15, 15, 10, 10);
		const exploreMesh = new THREE.Mesh(exploreGeometry, shaderMaterial);
		exploreMesh.position.set(0, 0, 0);
		exploreMesh.rotation.z = Math.PI / 4;
		scene.add(exploreMesh);

		// Renderer setup
		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		container.appendChild(renderer.domElement);

		animate();
	});

	onDestroy(() => {
		if (renderer) {
			renderer.dispose();
		}
	});
</script>

<div class="my-l">
	<div class="mt-xl three-container" bind:this={container}></div>
</div>

<style>
	.three-container {
		position: relative;
		width: 100%;
		height: 60vh;
		margin-inline: auto;
		border: 1px solid steelblue;
		cursor: grab;
	}
</style>
