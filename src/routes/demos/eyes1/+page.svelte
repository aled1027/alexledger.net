<!-- FloatingEyes.svelte -->
<script>
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

	let container;
	let renderer, scene, camera, controls;
	let earth, eyeGroup;

	function init() {
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
		// const earthTexture = new THREE.TextureLoader().load('/textures/earth.jpg');
		// const earthTexture = new THREE.TextureLoader().load('/textures/earth.png');
		// https://github.com/bobbyroe/threejs-earth/blob/main/textures/00_earthmap1k.jpg
		const earthTexture = new THREE.TextureLoader().load('/textures/earthmap.jpg');

		const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
		const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
		earth = new THREE.Mesh(earthGeometry, earthMaterial);
		scene.add(earth);

		// Eyes
		const eyeTexture = new THREE.TextureLoader().load('/textures/eye.png');
		const eyeMaterial = new THREE.MeshStandardMaterial({ map: eyeTexture });
		const eyeGeometry = new THREE.SphereGeometry(0.3, 32, 32);

		const eyeCount = 30;
		const radius = 6;
		eyeGroup = new THREE.Group();

		for (let i = 0; i < eyeCount; i++) {
			const theta = Math.random() * 2 * Math.PI;
			const phi = Math.acos(2 * Math.random() - 1);

			const x = radius * Math.sin(phi) * Math.cos(theta);
			const y = radius * Math.sin(phi) * Math.sin(theta);
			const z = radius * Math.cos(phi);

			const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
			eye.position.set(x, y, z);
			eye.lookAt(0, 0, 0);

			eyeGroup.add(eye);
		}

		scene.add(eyeGroup);

		animate();
	}

	function animate() {
		requestAnimationFrame(animate);
		earth.rotation.y += 0.001;
		eyeGroup.rotation.y += 0.0005;
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
