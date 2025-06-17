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

	const earthRadius: number = 5; // Radius of the Earth sphere
	const eyeRadius: number = 1; // Radius of the eye model

	const earthTextureUrl: string = '/textures/earthmap.jpg';
	const eyeModelUrl: string = '/textures/blue_eye.glb';

	// Load the eye model once and reuse it
	const loadEyeModel = (): Promise<void> => {
		return new Promise((resolve) => {
			const loader: GLTFLoader = new GLTFLoader();
			loader.load(eyeModelUrl, (gltf) => {
				eyeModel = gltf.scene;

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

		renderer = new THREE.WebGLRenderer({ antialias: true });
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

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);
		const pointLight = new THREE.PointLight(0xffffff, 1);
		pointLight.position.set(10, 10, 10);
		scene.add(pointLight);

		// Earth
		const earthTexture = new THREE.TextureLoader().load(earthTextureUrl);
		const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
		const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
		earth = new THREE.Mesh(earthGeometry, earthMaterial);
		scene.add(earth);

		// Eyes

		for (let i = 0; i < 10; i++) {
			const theta = Math.random() * 2 * Math.PI;
			const phi = Math.acos(2 * Math.random() - 1);
			const x = Math.sin(phi) * Math.cos(theta);
			const y = Math.sin(phi) * Math.sin(theta);
			const z = -1 * Math.cos(phi);

			const eyeDistance = earthRadius + 2 * eyeRadius; // Position eyes 0.5 units above earth's surface
			const direction = new THREE.Vector3(x, y, z);
			const position = direction.clone().multiplyScalar(eyeDistance);

			// Create a copy of the eye model for this position
			const eye = eyeModel.clone();
			eye.position.copy(position);
			eye.lookAt(0, 0, 0);

			eyeGroup.add(eye);
		}
		earth.add(eyeGroup);

		animate();
	}

	function animate(): void {
		requestAnimationFrame(animate);
		stats.begin();
		earth.rotation.y += 0.001;
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
