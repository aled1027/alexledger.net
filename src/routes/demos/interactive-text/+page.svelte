<script lang="ts">
	import * as THREE from 'three';
	import { onMount, onDestroy } from 'svelte';

	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let scene: THREE.Scene;
	let camera: THREE.OrthographicCamera;
	let raycaster: THREE.Raycaster;
	let pointer: THREE.Vector2;
	let sphereMesh: THREE.Mesh;
	let hitMesh: THREE.Mesh;

	// Animation loop
	function animate() {
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}

	function onPointerMove(event: MouseEvent) {
		if (!pointer) {
			pointer = new THREE.Vector2();
		}

		if (!raycaster) {
			raycaster = new THREE.Raycaster();
		}

		// Calculate pointer coordinates relative to the container, not the window
		const rect = container.getBoundingClientRect();
		pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		raycaster.setFromCamera(pointer, camera);
		const intersects = raycaster.intersectObjects([hitMesh]);
		if (intersects.length > 0) {
			sphereMesh.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
		}
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

		// Set up a hit mesh that covers the whole canvas, but isn't visible
		const hitGeometry = new THREE.PlaneGeometry(aspect * cameraDistance * 4, cameraDistance * 4);
		const hitMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
		hitMesh = new THREE.Mesh(hitGeometry, hitMaterial);
		hitMesh.position.set(0, 0, 0);
		scene.add(hitMesh);

		// Set up a sphere that follows the mouse
		const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
		const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphereMesh.position.set(0, 0, 0);
		scene.add(sphereMesh);

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		container.appendChild(renderer.domElement);

		window.addEventListener('pointermove', onPointerMove);

		animate();
	});

	onDestroy(() => {
		if (renderer) {
			renderer.dispose();
		}
		window.removeEventListener('pointermove', onPointerMove);
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
		cursor: grab;
	}
</style>
