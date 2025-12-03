<script lang="ts">
	import * as THREE from 'three';

	// @ts-ignore
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

	import { onMount } from 'svelte';

	let container: HTMLDivElement;

	onMount(() => {
		// We'll do something
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
		camera.position.z = 5;
		scene.add(camera);

		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);


		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		const controls = new OrbitControls(camera, renderer.domElement);

		function animate() {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		}
		animate();

	});
</script>

<div class="my-l">
	<h2>Moebius Style Shaders</h2>
	<p>
		Description
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
