<!-- FloatingEyes.svelte -->
<script lang="ts">
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
	import Stats from 'three/examples/jsm/libs/stats.module';

	// https://github.com/bobbyroe/threejs-earth/blob/main/textures/00_earthmap1k.jpg
	// https://www.youtube.com/watch?v=FntV9iEJ0tU&ab_channel=RobotBobby
	// TODO: can spin on tilt (in youtube video around minute 7)
	// TODO: add background stars
	// TODO: make the eyes different colors
	// I believe i used I downloaded this model. Tried by traversing over the mesh, but I
	// was only able to update the white parts, not the iris. I think because it's loaded in as a texture
	// from the model. I imagine this might be easy to change around in blender.
	// https://sketchfab.com/3d-models/blue-eye-922ad6f1f6034ba3beded5b709fd3703

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
	const cameraPositionZ: number = 20; // Initial camera position on Z axis
	let isBlinking = false;

	// Blinking configuration
	const BASE_BLINK_INTERVAL = 1750; // Base time between blink cycles
	const BLINK_INTERVAL_VARIANCE = 1500; // Random variance in blink timing
	const MIN_EYES_PER_BLINK = 1; // Minimum eyes to blink at once
	const MAX_EYES_PER_BLINK = 3; // Maximum eyes to blink at once
	const BASE_BLINK_DURATION = 150; // Base duration of a blink
	const BLINK_DURATION_VARIANCE = 50; // Random variance in blink duration
	const DOUBLE_BLINK_CHANCE = 0.2; // 20% chance of a double-blink
	const GROUP_BLINK_RADIUS = 2; // Radius for grouping nearby eyes for synchronized blinking
	const GROUP_BLINK_CHANCE = 0.5; // 50% chance to include nearby eyes in group blink

	const earthRadius: number = 5; // Radius of the Earth sphere
	const eyeRadius: number = 1; // Radius of the eye model

	// So num eyes is latitudeBands * longitudeBands
	const latitudeBands = 8; // Number of latitude bands
	const longitudeBands = 8; // Number of longitude bands
	const LOD_DISTANCES = {
		HIGH: 10,
		MEDIUM: 20,
		LOW: 30
	};

	// Track blinking eyes
	interface BlinkingEye {
		eye: THREE.Object3D;
		startTime: number;
		duration: number;
		isSecondBlink?: boolean;
	}
	let blinkingEyes: Map<number, BlinkingEye> = new Map();

	// Easing function for natural blink animation
	function easeInOutQuad(t: number): number {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}

	// Get random number between min and max
	function getRandomInRange(min: number, max: number): number {
		return min + Math.random() * (max - min);
	}

	// Find nearby eyes within radius
	function findNearbyEyes(sourceEye: THREE.Object3D, radius: number): THREE.Object3D[] {
		const sourcePos = new THREE.Vector3();
		sourceEye.getWorldPosition(sourcePos);

		return eyeGroup.children.filter((eye) => {
			if (eye === sourceEye) return false;
			const eyePos = new THREE.Vector3();
			eye.getWorldPosition(eyePos);
			return eyePos.distanceTo(sourcePos) < radius;
		});
	}

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
		stats.dom.style.top = 'auto';
		stats.dom.style.left = 'auto';
		stats.dom.style.bottom = '0px';
		stats.dom.style.right = '0px';
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
		eyeGroup.children
			.filter((eye) => blinkingEyes.has(eyeGroup.children.indexOf(eye)))
			.forEach((eye) => {
				// Check if the eye is blinking

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
		updateLOD();

		// Handle blinking every second - do this last to preserve blink state
		blinkEyes();

		renderer.render(scene, camera);
		stats.end();
	}

	function blinkEyes(): void {
		const currentTime = performance.now();
		const timeSinceLastBlink = currentTime - lastBlinkTime;
		const nextBlinkInterval = BASE_BLINK_INTERVAL + (Math.random() - 0.5) * BLINK_INTERVAL_VARIANCE;

		// Check if it's time to start new blinks
		if (timeSinceLastBlink >= nextBlinkInterval) {
			lastBlinkTime = currentTime;
			startNewBlinks(currentTime);
		}

		// Update all currently blinking eyes
		updateBlinkingEyes(currentTime);
	}

	function startNewBlinks(currentTime: number): void {
		// Get available eyes (those not currently blinking)
		const availableEyes = Array.from(eyeGroup.children.entries()).filter(
			([index]) => !blinkingEyes.has(index)
		);

		if (availableEyes.length === 0) return;

		// Randomly select initial eyes to blink
		const numEyes = Math.floor(getRandomInRange(MIN_EYES_PER_BLINK, MAX_EYES_PER_BLINK + 1));
		const selectedEyes = shuffleArray(availableEyes).slice(0, numEyes);

		// For each selected eye, possibly include nearby eyes
		const allEyesToBlink = new Set<[number, THREE.Object3D]>();
		selectedEyes.forEach((eyePair) => {
			allEyesToBlink.add(eyePair);

			// Randomly decide to include nearby eyes
			if (Math.random() < GROUP_BLINK_CHANCE) {
				const nearbyEyes = findNearbyEyes(eyePair[1], GROUP_BLINK_RADIUS);
				nearbyEyes.forEach((nearbyEye) => {
					const index = eyeGroup.children.indexOf(nearbyEye);
					if (index !== -1 && !blinkingEyes.has(index)) {
						allEyesToBlink.add([index, nearbyEye]);
					}
				});
			}
		});

		// Start blinking for all selected eyes
		Array.from(allEyesToBlink).forEach(([index, eye]) => {
			const duration = getRandomInRange(
				BASE_BLINK_DURATION - BLINK_DURATION_VARIANCE / 2,
				BASE_BLINK_DURATION + BLINK_DURATION_VARIANCE / 2
			);

			blinkingEyes.set(index, {
				eye,
				startTime: currentTime,
				duration,
				isSecondBlink: false
			});
			setEyeScale(eye, 0.9); // Start with a slight closure
		});
	}

	function updateBlinkingEyes(currentTime: number): void {
		blinkingEyes.forEach((blinkData, index) => {
			const blinkAge = currentTime - blinkData.startTime;

			if (blinkAge >= blinkData.duration) {
				// Finish blink
				setEyeScale(blinkData.eye, 1);

				// Check for double-blink
				if (!blinkData.isSecondBlink && Math.random() < DOUBLE_BLINK_CHANCE) {
					// Start second blink with slightly different timing
					blinkingEyes.set(index, {
						eye: blinkData.eye,
						startTime: currentTime,
						duration: blinkData.duration * 0.8, // Slightly faster second blink
						isSecondBlink: true
					});
				} else {
					blinkingEyes.delete(index);
				}
			} else {
				// Apply more natural easing for blink animation
				const t = Math.min(1, blinkAge / blinkData.duration);
				const easedScale = 1 - 0.9 * easeInOutQuad(t) * (1 - easeInOutQuad(t)) * 4;
				setEyeScale(blinkData.eye, easedScale);
			}
		});
	}

	function setEyeScale(eye: THREE.Object3D, yScaleFactor: number): void {
		const originalScale = eye.userData.originalScale;
		eye.scale.set(originalScale.x, originalScale.y * yScaleFactor, originalScale.z);
	}

	// Fisher-Yates shuffle algorithm
	function shuffleArray<T>(array: Array<T>): Array<T> {
		const shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
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

		window.addEventListener('resize', resizeRenderer);
		return () => {
			window.removeEventListener('resize', resizeRenderer);
			container.innerHTML = '';
		};
	});
</script>

<div class="my-l">
	<h2>Eyes Watching the Universe</h2>
	<p>
		<a
			target="_blank"
			href="https://github.com/aled1027/alexledger.net/tree/main/src/routes/demos/eyes/%2Bpage.svelte"
			>Demo code</a
		>
	</p>

	<p>
		This is a Three.js demo I made for a project I'm working on for a space telescope organization.
		The concept, which the organization conceived of, is that space telescopes are like eyeballs
		orbiting the earth, watching the universe.
	</p>
	<p>
		For the earth, I used <a href="https://github.com/bobbyroe/threejs-earth/tree/main"
			>bobbyroe's approach</a
		>, which used an earth texture map from
		<a href="https://planetpixelemporium.com/earth.html">Planet Pixel Emporium</a>. The eye model I
		downloaded from
		<a href="https://sketchfab.com/3d-models/blue-eye-922ad6f1f6034ba3beded5b709fd3703">Sketchfab</a
		>.
	</p>
	<p>
		The eyes are laid out in a lattice structure around the Earth, each looking out into the
		universe. The eyes blink at random intervals to give a sense of liveness.
	</p>
	<p>To build on this demo, I'd love to explore the following ideas:</p>
	<ul>
		<li>Tilt the Earth have it rotate around its tilted axis</li>
		<li>Users could add and remove eyes, like launching a new space telescope</li>
		<li>Have the eyes respond to events (e.g. a comet passing by)</li>
		<li>Groups of eyes would look together interesting events</li>
		<li>Give the eyes different colors and sizes, to reflect different types of telescopes.</li>
		<li>
			The current blinking implementation is quite crude, in that the eyes scale to flat
			temporarily, so exploring better blinking would be fun.
		</li>
	</ul>

	<div class="mt-xl three-container" bind:this={container}></div>
</div>

<style>
	.three-container {
		position: relative;
		width: 100%;
		height: 60vh;
	}
</style>
