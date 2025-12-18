<script lang="ts">
	import * as THREE from 'three';

	import { onMount } from 'svelte';

	let container: HTMLDivElement;

	onMount(() => {
		// We'll do something

		const numRows = 100;
		const numColumns = 100;
		const z = 0;
		const scene = new THREE.Scene();
		// Transparent background
		scene.background = null;
		const pointSize = 0.9;

		// Calculate the bounding box of the grid of points
		const gridWidth = numColumns - 1;
		const gridHeight = numRows - 1;
		const pointColor = 0x020202;

		const aspect = container.clientWidth / container.clientHeight;
		const margin = pointSize / 2;

		// Set camera so all points are visible, considering FOV and aspect ratio
		const camera = new THREE.PerspectiveCamera(
			75,
			aspect,
			0.1,
			1000
		);

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
		
		// Create color buffer - each point has RGB values (0-1 range)
		const numPoints = points.length;
		const colors = new Float32Array(numPoints * 3);
		const blackColor = [0.007, 0.007, 0.007]; // 0x020202 normalized
		const whiteColor = [1, 1, 1];
		
		// Initialize all points to black
		for (let i = 0; i < numPoints; i++) {
			colors[i * 3] = blackColor[0];
			colors[i * 3 + 1] = blackColor[1];
			colors[i * 3 + 2] = blackColor[2];
		}
		
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
		const material = new THREE.PointsMaterial({ 
			size: pointSize,
			vertexColors: true // Enable per-vertex colors
		});
		const mesh = new THREE.Points(geometry, material);

		scene.add(mesh);

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearColor(0x000000, 0); // transparent background
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		// Set up raycasting for mouse interaction
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		let lastHoveredIndex: number | null = null;

		function onMouseMove(event: MouseEvent) {
			const rect = container.getBoundingClientRect();
			mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

			raycaster.setFromCamera(mouse, camera);
			const intersects = raycaster.intersectObject(mesh);

			if (intersects.length > 0) {
				const intersect = intersects[0];
				if (intersect.index !== undefined) {
					const index = intersect.index;
					
					// Only toggle if we've moved to a different point
					if (lastHoveredIndex !== index) {
						// Check current color and toggle
						const r = colors[index * 3];
						const g = colors[index * 3 + 1];
						const b = colors[index * 3 + 2];
						
						// Check if point is currently black (or very dark)
						const isBlack = r < 0.5 && g < 0.5 && b < 0.5;
						
						if (isBlack) {
							// Change to white
							colors[index * 3] = whiteColor[0];
							colors[index * 3 + 1] = whiteColor[1];
							colors[index * 3 + 2] = whiteColor[2];
						} else {
							// Change to black
							colors[index * 3] = blackColor[0];
							colors[index * 3 + 1] = blackColor[1];
							colors[index * 3 + 2] = blackColor[2];
						}
						
						geometry.attributes.color.needsUpdate = true;
						lastHoveredIndex = index;
					}
				}
			} else {
				// Reset tracking when mouse leaves canvas
				lastHoveredIndex = null;
			}
		}

		container.addEventListener('mousemove', onMouseMove);

		function animate() {
			requestAnimationFrame(animate);
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
		// border: 1px solid black;
	}
</style>
