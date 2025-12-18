<script lang="ts">
	import * as THREE from 'three';

	import { onMount } from 'svelte';

	let container: HTMLDivElement;

	class WhiteBoard {
		private scene: THREE.Scene;
		private camera!: THREE.PerspectiveCamera;
		private renderer!: THREE.WebGLRenderer;
		private mesh!: THREE.Points;
		private raycaster: THREE.Raycaster;
		private mouse: THREE.Vector2;
		private colors!: Float32Array;
		private geometry!: THREE.BufferGeometry;
		private lastHoveredIndex: number | null = null;
		private animationId: number | null = null;
		private container: HTMLDivElement;
		private boundOnMouseMove!: (event: MouseEvent) => void;

		private readonly numRows = 100;
		private readonly numColumns = 100;
		private readonly z = 0;
		private readonly pointSize = 0.9;
		private readonly blackColor = [0.007, 0.007, 0.007]; // 0x020202 normalized
		private readonly whiteColor = [1, 1, 1];

		constructor(container: HTMLDivElement) {
			this.container = container;
			this.scene = new THREE.Scene();
			this.scene.background = null;
			this.mouse = new THREE.Vector2();
			this.raycaster = new THREE.Raycaster();

			this.setupCamera();
			this.setupMesh();
			this.setupRenderer();
			this.setupEventListeners();
			this.animate();
		}

		private setupCamera(): void {
			const gridWidth = this.numColumns - 1;
			const gridHeight = this.numRows - 1;
			const aspect = this.container.clientWidth / this.container.clientHeight;
			const margin = this.pointSize / 2;

			this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

			const fovRadians = (this.camera.fov * Math.PI) / 180;
			const gridHalfHeight = gridHeight / 2;
			const gridHalfWidth = gridWidth / 2;

			// Determine the z that's needed for the camera to fit the grid vertically and horizontally
			const fitZVert = (gridHalfHeight + margin) / Math.tan(fovRadians / 2);
			const fitZHoriz = (gridHalfWidth + margin) / (Math.tan(fovRadians / 2) * aspect);
			const z = Math.max(fitZVert, fitZHoriz);

			this.camera.position.set(0, 0, z);
			this.camera.lookAt(0, 0, 0);
			this.scene.add(this.camera);
		}

		private setupMesh(): void {
			const points: THREE.Vector3[] = [];
			const xOffset = (this.numColumns - 1) / 2;
			const yOffset = (this.numRows - 1) / 2;

			for (let row = 0; row < this.numRows; row++) {
				for (let column = 0; column < this.numColumns; column++) {
					points.push(new THREE.Vector3(column - xOffset, row - yOffset, this.z));
				}
			}

			const pointsBuffer = new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]));
			this.geometry = new THREE.BufferGeometry();
			this.geometry.setAttribute('position', new THREE.BufferAttribute(pointsBuffer, 3));

			const numPoints = points.length;
			this.colors = new Float32Array(numPoints * 3);

			// Initialize all points to black
			for (let i = 0; i < numPoints; i++) {
				this.colors[i * 3] = this.blackColor[0];
				this.colors[i * 3 + 1] = this.blackColor[1];
				this.colors[i * 3 + 2] = this.blackColor[2];
			}

			this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
			const material = new THREE.PointsMaterial({
				size: this.pointSize,
				vertexColors: true
			});
			this.mesh = new THREE.Points(this.geometry, material);
			this.scene.add(this.mesh);
		}

		private setupRenderer(): void {
			this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			this.renderer.setPixelRatio(window.devicePixelRatio);
			this.renderer.setClearColor(0x000000, 0);
			this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
			this.container.appendChild(this.renderer.domElement);
		}

		private setupEventListeners(): void {
			this.boundOnMouseMove = this.onMouseMove.bind(this);
			this.container.addEventListener('mousemove', this.boundOnMouseMove);
		}

		private onMouseMove(event: MouseEvent): void {
			const rect = this.container.getBoundingClientRect();
			this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

			this.raycaster.setFromCamera(this.mouse, this.camera);
			const intersects = this.raycaster.intersectObject(this.mesh);

			if (intersects.length > 0) {
				const intersect = intersects[0];
				if (intersect.index !== undefined) {
					const index = intersect.index;

					if (this.lastHoveredIndex !== index) {
						const r = this.colors[index * 3];
						const g = this.colors[index * 3 + 1];
						const b = this.colors[index * 3 + 2];

						const isBlack = r < 0.5 && g < 0.5 && b < 0.5;

						if (isBlack) {
							this.colors[index * 3] = this.whiteColor[0];
							this.colors[index * 3 + 1] = this.whiteColor[1];
							this.colors[index * 3 + 2] = this.whiteColor[2];
						} else {
							this.colors[index * 3] = this.blackColor[0];
							this.colors[index * 3 + 1] = this.blackColor[1];
							this.colors[index * 3 + 2] = this.blackColor[2];
						}

						this.geometry.attributes.color.needsUpdate = true;
						this.lastHoveredIndex = index;
					}
				}
			} else {
				this.lastHoveredIndex = null;
			}
		}

		private animate(): void {
			this.animationId = requestAnimationFrame(() => this.animate());
			this.renderer.render(this.scene, this.camera);
		}

		public dispose(): void {
			if (this.animationId !== null) {
				cancelAnimationFrame(this.animationId);
			}
			this.container.removeEventListener('mousemove', this.boundOnMouseMove);
			this.renderer.dispose();
			this.geometry.dispose();
		}
	}

	let whiteBoard: WhiteBoard;

	onMount(() => {
		whiteBoard = new WhiteBoard(container);

		return () => {
			whiteBoard.dispose();
		};
	});
</script>

<div class="my-l demo-container">
	<h1>Whiteboard</h1>
	<p>
		<a
			target="_blank"
			href="https://github.com/aled1027/alexledger.net/tree/main/src/routes/demos/white-board/%2Bpage.svelte"
			>Demo code</a
		>
	</p>
	<p>
		This demo uses Three.js to create a whiteboard-style grid of particles that you can write on
		with your mouse. On mouse over, the color of the particle under the mouse is toggled between
		white and black.
	</p>

	<div class="mt-xl three-container" bind:this={container}></div>
</div>

<style lang="scss">
	.three-container {
		position: relative;
		width: 100%;
		height: 60vh;
		margin-inline: auto;
		cursor: pointer;
	}

	p {
		max-width: 55rem;
	}
</style>
