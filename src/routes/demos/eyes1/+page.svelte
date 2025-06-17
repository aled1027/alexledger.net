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

	const earthRadius: number = 5; // Radius of the Earth sphere
	const eyeRadius: number = 1; // Radius of the eye model
	const numEyes: number = 20;
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
		camera.position.z = 25;

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
		for (let i = 0; i < numEyes; i++) {
			const theta = Math.random() * 2 * Math.PI;
			const phi = Math.acos(2 * Math.random() - 1);
			const x = Math.sin(phi) * Math.cos(theta);
			const y = Math.sin(phi) * Math.sin(theta);
			const z = -1 * Math.cos(phi);

			const eyeDistance = earthRadius + 2 * eyeRadius;
			const direction = new THREE.Vector3(x, y, z);
			const position = direction.clone().multiplyScalar(eyeDistance);

			const eye = eyeModel.clone();
			eye.position.copy(position);
			eye.lookAt(0, 0, 0);
			eye.userData.originalScale = eye.scale.clone();

			eyeGroup.add(eye);
		}
		earth.add(eyeGroup);
	}

	function updateLOD(): void {
		eyeGroup.children.forEach((eye) => {
			const distance = camera.position.distanceTo(eye.getWorldPosition(new THREE.Vector3()));

			if (distance < LOD_DISTANCES.HIGH) {
				eye.scale.copy(eye.userData.originalScale);
			} else if (distance < LOD_DISTANCES.MEDIUM) {
				eye.scale.copy(eye.userData.originalScale).multiplyScalar(0.75);
			} else {
				eye.scale.copy(eye.userData.originalScale).multiplyScalar(0.5);
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

		renderer.render(scene, camera);
		stats.end();
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
