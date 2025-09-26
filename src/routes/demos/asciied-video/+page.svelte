<script lang="ts">
	// FROM https://github.com/mrdoob/three.js/blob/dev/examples/jsm/effects/AsciiEffect.js

	import * as THREE from 'three';
	import { onMount } from 'svelte';
	import { AsciiEffect } from '../../../lib/three/AsciiEffect.js';

	let camera: THREE.PerspectiveCamera,
		scene: THREE.Scene,
		renderer: THREE.WebGLRenderer,
		effect: any,
		sphere: THREE.Mesh,
		plane: THREE.Mesh,
		videoPlane: THREE.Mesh; // Add videoPlane
	const start: number = Date.now();

	function init(): void {
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.y = 50;
		camera.position.z = 800;

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0, 0, 0);

		const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0);
		pointLight1.position.set(500, 500, 500);
		scene.add(pointLight1);

		const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
		pointLight2.position.set(-500, -500, -500);
		scene.add(pointLight2);

		// Sphere that bounces
		sphere = new THREE.Mesh(
			new THREE.SphereGeometry(200, 20, 10),
			new THREE.MeshPhongMaterial({ flatShading: true })
		);
		// scene.add(sphere);

		// Plane that's under the bouncing ball
		// plane = new THREE.Mesh(
		// 	new THREE.PlaneGeometry(400, 400),
		// 	new THREE.MeshBasicMaterial({ color: 0xe0e0e0 })
		// );
		// plane.position.y = -200;
		// plane.rotation.x = -Math.PI / 2;
		// scene.add(plane);

		// --- VIDEO TEXTURE SETUP ---
		const video = document.createElement('video');
		video.src = 'https://assets.knowportland.org/alexledgernet/pickleball.mp4';
		video.crossOrigin = 'anonymous';
		video.loop = true;
		video.muted = true;
		video.autoplay = true;
		video.playsInline = true;
		video.style.display = 'none';
		document.body.appendChild(video);
		video.play();

		const videoTexture = new THREE.VideoTexture(video);
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		videoTexture.format = THREE.RGBFormat;

		videoPlane = new THREE.Mesh(
			new THREE.PlaneGeometry(1024, 576),
			new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide })
		);
		videoPlane.position.set(0, 0, 0); // Center the video in the scene
		scene.add(videoPlane);
		// --- END VIDEO TEXTURE SETUP ---

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setAnimationLoop(animate);

		effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
		effect.setSize(window.innerWidth, window.innerHeight);
		effect.domElement.style.color = 'white';
		effect.domElement.style.backgroundColor = 'black';

		// Special case: append effect.domElement, instead of renderer.domElement.
		// AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

		document.body.appendChild(effect.domElement);

		window.addEventListener('resize', onWindowResize);
	}

	function onWindowResize(): void {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
		effect.setSize(window.innerWidth, window.innerHeight);
	}

	//

	function animate(): void {
		const timer = Date.now() - start;

		sphere.position.y = Math.abs(Math.sin(timer * 0.002)) * 150;
		sphere.rotation.x = timer * 0.0003;
		sphere.rotation.z = timer * 0.0002;

		effect.render(scene, camera);
	}

	onMount((): void => {
		init();
	});
</script>

<div class="my-l demo-container">
	<h2 class="size-step-2">ASCII Video Effect</h2>
	<p>
		<a
			target="_blank"
			href="https://github.com/aled1027/alexledger.net/tree/main/src/routes/demos/asciied-video/%2Bpage.svelte"
			>Demo code</a
		>
	</p>
	<p><strong>Note:</strong> This demo is best viewed on big screens for the full ASCII effect experience.</p>
	<p>
		This demo uses Three.js with a custom ASCII effect to render video content as ASCII characters.
		The effect converts the video frames into a grid of characters, creating a retro terminal aesthetic.
		The ASCII characters are mapped based on brightness values, with darker areas using denser characters
		like '@' and '#', while lighter areas use sparser characters like '.' and ' '.
	</p>
	<p>
		The ASCII effect implementation is based on mrdoob's Three.js examples from the 
		<a href="https://github.com/mrdoob/three.js/blob/dev/examples/jsm/effects/AsciiEffect.js"
			>Three.js repository</a
		>.
	</p>
</div>

<div class="canvas-container"></div>
