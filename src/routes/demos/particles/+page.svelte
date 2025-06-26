<!-- FloatingEyes.svelte -->
<script lang="ts">
	import * as THREE from 'three';
	import { onMount } from 'svelte';
	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let particles: THREE.Points;
	let particleCount = 1000;
	let particleSize = 0.1;

	function init() {
		// Create scene
		scene = new THREE.Scene();

		// Create camera
		const width = container.clientWidth;
		const height = container.clientHeight;
		camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		camera.position.z = 5;

		// Create renderer
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);
		container.appendChild(renderer.domElement);

		// Create particles
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(particleCount * 3);
		for (let i = 0; i < particleCount; i++) {
			const x = (Math.random() - 0.5) * 10;
			const y = (Math.random() - 0.5) * 10;
			const z = (Math.random() - 0.5) * 10;
			positions.set([x, y, z], i * 3);
		}
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		const material = new THREE.PointsMaterial({ size: particleSize, color: 0xffffff });
		material.sizeAttenuation = true;

		particles = new THREE.Points(geometry, material);
		scene.add(particles);
	}

	function resizeRenderer(): void {
		if (container && renderer) {
			const width: number = container.clientWidth;
			const height: number = container.clientHeight;
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		}
	}

	onMount(() => {
		init();
		resizeRenderer();

		window.addEventListener('resize', resizeRenderer);
		return () => {
			window.removeEventListener('resize', resizeRenderer);
			container.innerHTML = '';
		};
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
		border: 1px solid black;
		margin-inline: auto;
		cursor: grab;
	}
</style>
