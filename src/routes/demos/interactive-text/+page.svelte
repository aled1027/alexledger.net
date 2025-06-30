<script lang="ts">
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { onMount, onDestroy } from 'svelte';
	import { ExposureShader } from 'three/examples/jsm/Addons.js';

	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let scene: THREE.Scene;
	let camera: THREE.OrthographicCamera;
	let controls: OrbitControls;

	// Animation loop
	function animate() {
		controls.update();
		renderer.render(scene, camera);
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
		scene.background = new THREE.Color(0xffffff);

		// Explore texture
		const shaderMaterial = new THREE.ShaderMaterial({
			uniforms: {
				uTexture: { value: new THREE.TextureLoader().load('/textures/explore.png') }
			},
			vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
			fragmentShader: `
                uniform sampler2D uTexture;
                void main() {
                    gl_FragColor = texture2D(uTexture, gl_PointCoord);
                }
            `
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

		// Controls setup
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;

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
		border: 1px solid red;
		cursor: grab;
	}
</style>
