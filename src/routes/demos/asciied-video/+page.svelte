<script lang="ts">
	// FROM https://github.com/mrdoob/three.js/blob/dev/examples/jsm/effects/AsciiEffect.js

	import * as THREE from 'three';
	import { onMount } from 'svelte';
	import { AsciiEffect } from '../../../lib/three/AsciiEffect.js';

	let camera: THREE.PerspectiveCamera,
		scene: THREE.Scene,
		renderer: THREE.WebGLRenderer,
		effect: any,
		videoPlane: THREE.Mesh;
	let container: HTMLDivElement;

	function init(): void {
		const width = window.innerWidth;
		const height = window.innerHeight;

		camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
		camera.position.y = 0;
		camera.position.z = 0;

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0, 0, 0);

		const video = document.createElement('video');
		video.src = 'https://assets.knowportland.org/alexledgernet/pickleball.mp4';
		video.crossOrigin = 'anonymous';
		video.loop = true;
		video.muted = true;
		video.autoplay = true;
		video.playsInline = true;
		video.style.display = 'none';
		container.appendChild(video);
		video.play();

		const videoTexture = new THREE.VideoTexture(video);
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		videoTexture.format = THREE.RGBFormat;

		const distance = 100;
		const fov = camera.fov * (Math.PI / 180);
		const planeHeight = 2 * Math.tan(fov / 2) * distance;
		const planeWidth = planeHeight * camera.aspect;

		videoPlane = new THREE.Mesh(
			new THREE.PlaneGeometry(planeWidth, planeHeight),
			new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide })
		);
		videoPlane.position.set(0, 0, -distance); // Position in front of camera
		scene.add(videoPlane);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(width, height);
		renderer.setAnimationLoop(() => {
			effect.render(scene, camera);
		});

		effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
		effect.setSize(width, height);
		effect.domElement.style.color = 'white';
		effect.domElement.style.backgroundColor = 'black';
		effect.domElement.style.width = '100%';
		effect.domElement.style.height = '100%';
		effect.domElement.style.zIndex = '10';
		container.appendChild(effect.domElement);
		window.addEventListener('resize', onWindowResize);
	}

	function onWindowResize(): void {
		const width = window.innerWidth;
		const height = window.innerHeight;

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		const distance = 100;
		const fov = camera.fov * (Math.PI / 180);
		const planeHeight = 2 * Math.tan(fov / 2) * distance;
		const planeWidth = planeHeight * camera.aspect;

		videoPlane.geometry.dispose();
		videoPlane.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

		renderer.setSize(width, height);
		effect.setSize(width, height);
	}

	onMount(() => {
		init();
		return () => {
			window.removeEventListener('resize', onWindowResize);
			if (container) {
				container.innerHTML = '';
			}
		};
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
	<p>
		This demo uses Three.js with a custom ASCII effect to render video content as ASCII characters.
		The effect converts the video frames into a grid of characters, creating a retro terminal
		aesthetic. The ASCII characters are mapped based on brightness values, with darker areas using
		denser characters like '@' and '#', while lighter areas use sparser characters like '.' and ' '.
	</p>
	<p>
		The ASCII effect implementation is based on mrdoob's Three.js examples from the
		<a href="https://github.com/mrdoob/three.js/blob/dev/examples/jsm/effects/AsciiEffect.js"
			>Three.js repository</a
		>.
	</p>
</div>
<div class="canvas-container" bind:this={container}></div>
