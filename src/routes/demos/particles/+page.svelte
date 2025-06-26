<!-- FloatingEyes.svelte -->
<script lang="ts">
	import * as THREE from 'three';
	import { onMount } from 'svelte';
	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let particles: THREE.Points;
	let particleCount = 200;
	let particleSize = 0.5;

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
		const velocities = new Float32Array(particleCount * 3);
		for (let i = 0; i < particleCount; i++) {
			const x = (Math.random() - 0.5) * 10;
			const y = (Math.random() - 0.5) * 10;
			const z = (Math.random() - 0.5) * 10;
			positions.set([x, y, z], i * 3);

			// Add random velocities
			const vx = (Math.random() - 0.5) * 0.02;
			const vy = (Math.random() - 0.5) * 0.02;
			const vz = (Math.random() - 0.5) * 0.02;
			velocities.set([vx, vy, vz], i * 3);
		}
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

		const material = new THREE.PointsMaterial({
			size: particleSize,
			color: 0xffffff,
			transparent: true,
			map: new THREE.TextureLoader().load('/textures/eye.png'),
			alphaTest: 0.5
		});
		material.sizeAttenuation = true;

		particles = new THREE.Points(geometry, material);
		scene.add(particles);
		animate();
	}

	function animate() {
		requestAnimationFrame(animate);

		// Rotate the entire particle system
		particles.rotation.x += 0.001;
		particles.rotation.y += 0.002;

		// Update particle positions
		const positions = particles.geometry.attributes.position.array as Float32Array;
		const velocities = particles.geometry.attributes.velocity.array as Float32Array;

		for (let i = 0; i < particleCount; i++) {
			const i3 = i * 3;

			// Update positions based on velocities
			positions[i3] += velocities[i3];
			positions[i3 + 1] += velocities[i3 + 1];
			positions[i3 + 2] += velocities[i3 + 2];

			// Bounce off boundaries
			const bounds = 5;
			for (let j = 0; j < 3; j++) {
				if (Math.abs(positions[i3 + j]) > bounds) {
					velocities[i3 + j] *= -1;
				}
			}
		}

		particles.geometry.attributes.position.needsUpdate = true;

		renderer.render(scene, camera);
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
