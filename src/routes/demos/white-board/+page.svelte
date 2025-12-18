<script lang="ts">
	import * as THREE from 'three';

	// @ts-ignore
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

	import { onMount } from 'svelte';

	let container: HTMLDivElement;

	onMount(() => {
		// We'll do something

		const numRows = 20;
		const numColumns = 20;
		const z = 0;
		const scene = new THREE.Scene();

		// Calculate the bounding box of the grid of points
		const gridWidth = numColumns - 1;
		const gridHeight = numRows - 1;

		const aspect = container.clientWidth / container.clientHeight;
		const margin = 3;

		// Set camera so all points are visible, considering FOV and aspect ratio
		const camera = new THREE.PerspectiveCamera(
			75,
			aspect,
			0.1,
			1000
		);

		// Figure out the maximum extent of the grid from center on both axes
		const maxGridExtent = Math.max(gridWidth / 2, gridHeight / 2);

		// Use some trigonometry to set the camera z position so all points fit the view vertically
		const fovRadians = (camera.fov * Math.PI) / 180;
		const gridHalfHeight = gridHeight / 2;
		const gridHalfWidth = gridWidth / 2;

		// To fit vertically, need z = gridHalfHeight / tan(fov/2)
		const fitZVert = (gridHalfHeight + margin) / Math.tan(fovRadians / 2);
		// To fit horizontally, need z = gridHalfWidth / (tan(fov/2) * aspect)
		const fitZHoriz = (gridHalfWidth + margin) / (Math.tan(fovRadians / 2) * aspect);

		// Choose the further distance to ensure both axes fit
		const fitZ = Math.max(fitZVert, fitZHoriz);

		camera.position.set(0, 0, fitZ);
		camera.lookAt(0, 0, 0);
		scene.add(camera);

		const points = [];
		const xOffset = (numColumns - 1) / 2;
		const yOffset = (numRows - 1) / 2;
		for (let row = 0; row < numRows; row++) {
			for (let column = 0; column < numColumns; column++) {
				points.push(new THREE.Vector3(column - xOffset, row - yOffset, z));
			}
		}


		const pointsBuffer = new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]));
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.BufferAttribute(pointsBuffer, 3));
		const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.5 });
		const mesh = new THREE.Points(geometry, material);

		scene.add(mesh);

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
	<h2>White Board</h2>
	<p>
		This is a demo of a white board that I made using Three.js. It's a simple white board that you
		can write on with your mouse. On mouse over and click, the particles are toggled between white
		and black.
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
