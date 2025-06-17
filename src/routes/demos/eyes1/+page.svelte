<!-- FloatingEyes.svelte -->
<script lang="ts">
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
	import Stats from 'three/examples/jsm/libs/stats.module';
	import { onMount } from 'svelte';

	// https://github.com/bobbyroe/threejs-earth/blob/main/textures/00_earthmap1k.jpg
	// https://www.youtube.com/watch?v=FntV9iEJ0tU&ab_channel=RobotBobby
	// TODO: can spin on tilt (in youtube video around minute 7)
	// TODO: add background stars

	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let controls: OrbitControls;
	let earth: THREE.Mesh;
	let eyeModel: THREE.Group;
	let stats: Stats;
	let eyeGroup: THREE.Group = new THREE.Group();
	let frustum = new THREE.Frustum();
	let frustumMatrix = new THREE.Matrix4();
	let lastBlinkTime = 0; // Track when we last blinked
	const cameraPositionZ: number = 50; // Initial camera position on Z axis

	const earthRadius: number = 5; // Radius of the Earth sphere
	const eyeRadius: number = 1; // Radius of the eye model
	let isBlinking = false;
	let blinkStartTime = 0;
	const BLINK_DURATION = 150; // Duration of blink in milliseconds

	// So num eyes is latitudeBands * longitudeBands
	const latitudeBands = 8; // Number of latitude bands
	const longitudeBands = 8; // Number of longitude bands
	const LOD_DISTANCES = {
		HIGH: 10,
		MEDIUM: 20,
		LOW: 30
	};

	const earthTextureUrl: string = '/textures/earthmap.jpg';
	const eyeModelUrl: string = '/textures/blue_eye.glb';

	// Load the eye model once and reuse it
	const loadEyeModel = (): Promise<void> => {
		return new Promise((resolve) => {
			const loader: GLTFLoader = new GLTFLoader();
			loader.load(eyeModelUrl, (gltf) => {
				eyeModel = gltf.scene;

				// Optimize the geometry
				eyeModel.traverse((child) => {
					if (child instanceof THREE.Mesh) {
						if (child.geometry) {
							child.geometry.setDrawRange(0, Infinity);
							child.geometry.computeBoundingSphere();
							child.frustumCulled = true;
						}
						if (child.material) {
							child.material.side = THREE.FrontSide; // Only render front faces
						}
					}
				});

				// Compute the bounding sphere to get current radius
				const boundingBox: THREE.Box3 = new THREE.Box3().setFromObject(eyeModel);
				const boundingSphere: THREE.Sphere = new THREE.Sphere();
				boundingBox.getBoundingSphere(boundingSphere);

				// Scale the model to match desired radius
				const scale: number = eyeRadius / boundingSphere.radius;
				eyeModel.scale.set(scale, scale, scale);

				resolve();
			});
		});
	};

	async function init(): Promise<void> {
		await loadEyeModel();

		// Scene setup
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(
			75,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		camera.position.z = cameraPositionZ;

		// Optimize renderer
		renderer = new THREE.WebGLRenderer({
			antialias: true,
			powerPreference: 'high-performance',
			precision: 'mediump'
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		// Initialize Stats
		stats = new Stats();
		stats.dom.style.position = 'absolute';
		stats.dom.style.top = '0px';
		stats.dom.style.left = '0px';
		container.appendChild(stats.dom);

		// Controls
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);
		const pointLight = new THREE.PointLight(0xffffff, 1);
		pointLight.position.set(10, 10, 10);
		scene.add(pointLight);

		// Earth - optimize geometry
		const earthGeometry = new THREE.SphereGeometry(earthRadius, 32, 32); // Reduced segments
		const textureLoader = new THREE.TextureLoader();
		textureLoader.load(earthTextureUrl, (texture) => {
			texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
			const earthMaterial = new THREE.MeshStandardMaterial({
				map: texture,
				side: THREE.FrontSide
			});
			earth = new THREE.Mesh(earthGeometry, earthMaterial);
			earth.geometry.computeBoundingSphere();
			earth.frustumCulled = true;
			scene.add(earth);

			// Add eyes after Earth is loaded
			addEyes();
		});

		animate();
	}

	function addEyes(): void {
		for (let lat = 0; lat < latitudeBands; lat++) {
			// Convert lat index to angle in radians (-π/2 to π/2)
			const phi = (lat / (latitudeBands - 1)) * Math.PI - Math.PI / 2;

			// Adjust number of eyes in each latitude band based on circumference
			const circumference = Math.cos(phi) * 2 * Math.PI;
			const eyesInBand = Math.max(1, Math.floor(longitudeBands * Math.cos(phi)));

			for (let lon = 0; lon < eyesInBand; lon++) {
				// Convert lon index to angle in radians (0 to 2π)
				const theta = (lon / eyesInBand) * 2 * Math.PI;

				// Convert spherical coordinates to Cartesian
				const x = Math.cos(phi) * Math.cos(theta);
				const y = Math.sin(phi);
				const z = Math.cos(phi) * Math.sin(theta);

				const eyeDistance = earthRadius + 2 * eyeRadius;
				const direction = new THREE.Vector3(x, y, z);
				const position = direction.clone().multiplyScalar(eyeDistance);

				const eye = eyeModel.clone();
				eye.position.copy(position);
				eye.lookAt(0, 0, 0);
				eye.userData.originalScale = eye.scale.clone();

				eyeGroup.add(eye);
			}
		}
		earth.add(eyeGroup);
	}

	function updateLOD(): void {
		eyeGroup.children.forEach((eye) => {
			const distance = camera.position.distanceTo(eye.getWorldPosition(new THREE.Vector3()));

			// Calculate a smooth scale factor based on distance
			let scaleFactor: number;
			if (distance <= LOD_DISTANCES.HIGH) {
				scaleFactor = 1.0;
			} else if (distance >= LOD_DISTANCES.LOW) {
				scaleFactor = 0.5;
			} else {
				// Smooth interpolation between LOD levels
				const t = (distance - LOD_DISTANCES.HIGH) / (LOD_DISTANCES.LOW - LOD_DISTANCES.HIGH);
				scaleFactor = 1.0 - 0.5 * t; // Linearly interpolate from 1.0 to 0.5
			}

			// Preserve Y scale during blinks
			const currentYScale = eye.scale.y / eye.userData.originalScale.y;
			eye.scale.copy(eye.userData.originalScale).multiplyScalar(scaleFactor);
			if (isBlinking) {
				eye.scale.y = eye.userData.originalScale.y * 0.1 * scaleFactor;
			}
		});
	}

	function animate(): void {
		requestAnimationFrame(animate);
		stats.begin();

		// Update frustum for culling
		frustumMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
		frustum.setFromProjectionMatrix(frustumMatrix);

		// Update controls if enabled
		if (controls) controls.update();

		// Rotate earth
		if (earth) earth.rotation.y += 0.001;

		// Update LOD
		// updateLOD();

		// Handle blinking every second - do this last to preserve blink state
		blinkEyes();

		renderer.render(scene, camera);
		stats.end();
	}

	function blinkEyes(): void {
		const currentTime = performance.now();
		const timeSinceLastBlink = currentTime - lastBlinkTime;
		const isTimeToBlink = timeSinceLastBlink >= 4000;

		if (!isTimeToBlink && !isBlinking) return;

		if (!isBlinking) {
			startBlink(currentTime);
		} else {
			updateBlink(currentTime);
		}
	}

	function startBlink(currentTime: number): void {
		isBlinking = true;
		lastBlinkTime = currentTime;
		blinkStartTime = currentTime;
		setEyeScales(0.1);
	}

	function updateBlink(currentTime: number): void {
		if (currentTime - blinkStartTime >= BLINK_DURATION) {
			isBlinking = false;
			setEyeScales(1);
		}
	}

	function setEyeScales(yScaleFactor: number): void {
		eyeGroup.children.forEach((eye) => {
			const originalScale = eye.userData.originalScale;
			eye.scale.set(originalScale.x, originalScale.y * yScaleFactor, originalScale.z);
		});
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

	$effect(() => {
		init();
		stats = new Stats();
		stats.showPanel(0); // 0: fps, 1: ms
		container.appendChild(stats.dom);

		window.addEventListener('resize', resizeRenderer);
		return () => {
			window.removeEventListener('resize', resizeRenderer);
			container.innerHTML = '';
		};
	});
</script>

<div bind:this={container} class="three-container"></div>

<style>
	.three-container {
		width: 100%;
		height: 100vh;
		display: block;
		overflow: hidden;
	}
</style>
