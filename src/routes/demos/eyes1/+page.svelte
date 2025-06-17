<!-- FloatingEyes.svelte -->
<script>
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

	// https://github.com/bobbyroe/threejs-earth/blob/main/textures/00_earthmap1k.jpg
	// https://www.youtube.com/watch?v=FntV9iEJ0tU&ab_channel=RobotBobby
	// TODO: can spin on tilt (in youtube video around minute 7)
	// TODO: add background stars

	let container;
	let renderer, scene, camera, controls;
	let earth, eyeGroup;
	let eyeModel;

	const earthTextureUrl = '/textures/earthmap.jpg';
	const eyeModelUrl = '/textures/blue_eye.glb';

	// Load the eye model once and reuse it
	const loadEyeModel = () => {
		return new Promise((resolve) => {
			const loader = new GLTFLoader();
			loader.load(eyeModelUrl, (gltf) => {
				eyeModel = gltf.scene;
				// Make the model small enough to work with our scene
				eyeModel.scale.set(0.3, 0.3, 0.3);
				resolve();
			});
		});
	};

	async function init() {
		await loadEyeModel();

		// Scene setup
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(
			75,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		camera.position.z = 15;

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

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
		const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
		earth = new THREE.Mesh(earthGeometry, earthMaterial);
		// scene.add(earth);

		// Eyes
		const earthRadius = 5;
		const eyeDistance = earthRadius + 0.5; // Position eyes 0.5 units above earth's surface
		eyeGroup = new THREE.Group();

		const theta = Math.random() * 2 * Math.PI;
		const phi = Math.acos(2 * Math.random() - 1);

		// Calculate position on sphere
		const x = Math.sin(phi) * Math.cos(theta);
		const y = Math.sin(phi) * Math.sin(theta);
		const z = Math.cos(phi);

		// Create normalized direction vector for this position
		const direction = new THREE.Vector3(x, y, z);

		// Position for the eye
		const position = direction.clone().multiplyScalar(eyeDistance);

		// Clone the eye model for each instance
		const eye = eyeModel.clone();
		eye.position.copy(position);

		// Make it face outward (away from center)
		eye.up.set(0, 1, 0);
		eye.lookAt(position.clone().multiplyScalar(2));

		scene.add(eye);
		animate();
	}

	function animate() {
		requestAnimationFrame(animate);
		earth.rotation.y += 0.001;
		renderer.render(scene, camera);
	}

	function resizeRenderer() {
		if (container && renderer) {
			const width = container.clientWidth;
			const height = container.clientHeight;
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

<div bind:this={container} class="three-container"></div>

<style>
	.three-container {
		width: 100%;
		height: 100vh;
		display: block;
		overflow: hidden;
	}
</style>
