<script lang="ts">
	import * as THREE from 'three';
	import { onMount, onDestroy } from 'svelte';

	// Based on https://tympanus.net/codrops/2025/03/24/animating-letters-with-shaders-interactive-text-effect-with-three-js-glsl/

	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let scene: THREE.Scene;
	let camera: THREE.OrthographicCamera;
	let raycaster: THREE.Raycaster;
	let sphereMesh: THREE.Mesh;
	let hitMesh: THREE.Mesh;
	let exploreShaderMaterial: THREE.ShaderMaterial;
	let rippleTime = 0;
	let ripples: Array<{ position: THREE.Vector3; startTime: number; duration: number }> = [];

	// TODO: add shadow

	function getMouseIntersectionPoint(event: MouseEvent): THREE.Vector3 | null {
		if (!raycaster) {
			raycaster = new THREE.Raycaster();
		}

		// Calculate pointer coordinates relative to the container, not the window
		const rect = container.getBoundingClientRect();
		const pointer = new THREE.Vector2();
		pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		raycaster.setFromCamera(pointer, camera);
		const intersects = raycaster.intersectObjects([hitMesh]);

		if (intersects.length > 0) {
			return intersects[0].point;
		}

		return null;
	}

	function onClick(event: MouseEvent) {
		const point = getMouseIntersectionPoint(event);
		if (point) {
			// Create a ripple effect at the clicked point
			ripples.push({
				position: point.clone(),
				startTime: rippleTime,
				duration: 2.0 // 2 seconds duration
			});
		}
	}

	function onPointerMove(event: MouseEvent) {
		const point = getMouseIntersectionPoint(event);
		if (point) {
			sphereMesh.position.set(point.x, point.y, point.z);
			exploreShaderMaterial.uniforms.uDisplacement.value.set(point.x, point.y, point.z);
		} else {
			exploreShaderMaterial.uniforms.uDisplacement.value.set(40, 40, 40);
		}
	}

	function animate() {
		rippleTime += 0.016; // Approximate 60fps

		// Clean up expired ripples
		ripples = ripples.filter((ripple) => rippleTime - ripple.startTime < ripple.duration);

		// Update shader with ripple data
		if (exploreShaderMaterial) {
			exploreShaderMaterial.uniforms.uRippleTime.value = rippleTime;
			exploreShaderMaterial.uniforms.uRippleCount.value = ripples.length;

			// Update ripple positions and times
			const positions: THREE.Vector3[] = [];
			const times: number[] = [];

			ripples.forEach((ripple) => {
				const timeSinceStart = rippleTime - ripple.startTime;
				positions.push(ripple.position);
				times.push(timeSinceStart);
			});

			// Pad arrays to match shader expectations
			while (positions.length < 10) {
				positions.push(new THREE.Vector3(0, 0, 0));
				times.push(0);
			}

			exploreShaderMaterial.uniforms.uRipplePositions.value = positions;
			exploreShaderMaterial.uniforms.uRippleTimes.value = times;
		}

		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}

	onMount(() => {
		const aspect = container.clientWidth / container.clientHeight;
		const cameraDistance = 8;
		camera = new THREE.OrthographicCamera(
			-aspect * cameraDistance,
			aspect * cameraDistance,
			cameraDistance,
			-cameraDistance,
			1,
			1000
		);
		camera.position.set(0, -10, 5);
		camera.lookAt(0, 0, 0);
		scene = new THREE.Scene();

		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load('/textures/explore.png');

		exploreShaderMaterial = new THREE.ShaderMaterial({
			uniforms: {
				uTexture: { value: texture },
				uDisplacement: { value: new THREE.Vector3(0, 0, 0) },
				uRippleTime: { value: 0 },
				uRippleCount: { value: 0 },
				uRipplePositions: { value: [] },
				uRippleTimes: { value: [] }
			},
			vertexShader: `
				varying vec2 vUv;
				varying vec3 vWorldPosition;
				uniform vec3 uDisplacement;
				uniform float uRippleTime;
				uniform int uRippleCount;
				uniform vec3 uRipplePositions[10];
				uniform float uRippleTimes[10];

                float easeInOutCubic(float x) {
                    return x < 0.5 ? 4. * x * x * x : 1. - pow(-2. * x + 2., 3.) / 2.;
                }

                float map(float value, float min1, float max1, float min2, float max2) {
                    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
                }

				void main() {
					vUv = uv;
                    vec3 new_position = position;

                    vec4 localPosition = vec4( position, 1.);
                    vec4 worldPosition = modelMatrix * localPosition;
                    vWorldPosition = worldPosition.rgb;
                    float dist = (length(uDisplacement - worldPosition.rgb));

                    float min_distance = 5.;
                    if (dist < min_distance) {
                        float distance_mapped = map(dist, 0., min_distance, 1., 0.);
                        float zDiff = easeInOutCubic(distance_mapped) * 1.; //1 is the max height of displacement
                        new_position.z += zDiff;
                    }

                    // Add ripple effects
                    float rippleDisplacement = 0.0;
                    for (int i = 0; i < 10; i++) {
                        if (i >= uRippleCount) break;
                        
                        float rippleDist = length(uRipplePositions[i] - worldPosition.rgb);
                        float rippleAge = uRippleTimes[i];
                        float rippleRadius = rippleAge * 8.0; // Increased from 3.0 to 8.0 for faster expansion
                        float rippleWidth = 2.0; // Width of the ripple wave
                        
                        float rippleEffect = 0.0;
                        if (rippleAge < 2.0) { // Only active ripples
                            float distFromRipple = abs(rippleDist - rippleRadius);
                            if (distFromRipple < rippleWidth) {
                                float rippleIntensity = 1.0 - (rippleAge / 2.0); // Fade out over time
                                rippleEffect = rippleIntensity * (1.0 - distFromRipple / rippleWidth) * 0.5;
                            }
                        }
                        rippleDisplacement += rippleEffect;
                    }
                    
                    new_position.z += rippleDisplacement;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(new_position,1.0);
				}
			`,
			fragmentShader: `
				uniform sampler2D uTexture;
				uniform float uRippleTime;
				uniform int uRippleCount;
				uniform vec3 uRipplePositions[10];
				uniform float uRippleTimes[10];
				varying vec2 vUv;
				varying vec3 vWorldPosition;
				
				void main() {
					vec4 texColor = texture2D(uTexture, vUv);
					
					// Calculate ripple color effect using actual world position
					float greenEffect = 0.0;
					for (int i = 0; i < 10; i++) {
						if (i >= uRippleCount) break;
						
						// Use the actual world position from vertex shader
						float rippleDist = length(uRipplePositions[i] - vWorldPosition);
						float rippleAge = uRippleTimes[i];
						float rippleRadius = rippleAge * 8.0;
						float rippleWidth = 2.0;
						
						if (rippleAge < 2.0) {
							float distFromRipple = abs(rippleDist - rippleRadius);
							if (distFromRipple < rippleWidth) {
								float rippleIntensity = 1.0 - (rippleAge / 2.0);
								greenEffect += rippleIntensity * (1.0 - distFromRipple / rippleWidth) * 0.8;
							}
						}
					}
					
					// Apply green tint where ripples are active
					vec3 greenTint = vec3(0.0, 1.0, 0.0);
					vec3 finalColor = mix(texColor.rgb, greenTint, greenEffect);
					
					gl_FragColor = vec4(finalColor, texColor.a);
				}
			`,
			transparent: true
		});

		const exploreGeometry = new THREE.PlaneGeometry(20, 20, 20, 20);
		const exploreMesh = new THREE.Mesh(exploreGeometry, exploreShaderMaterial);
		exploreMesh.position.set(0, 0, 0);
		exploreMesh.rotation.z = Math.PI / 4;
		scene.add(exploreMesh);

		// Set up a hit mesh that covers the whole canvas, but isn't visible
		const hitGeometry = new THREE.PlaneGeometry(aspect * cameraDistance * 4, cameraDistance * 4);
		const hitMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
		hitMesh = new THREE.Mesh(hitGeometry, hitMaterial);
		hitMesh.position.set(0, 0, 0);
		scene.add(hitMesh);

		// Set up a sphere that follows the mouse
		const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
		const sphereMaterial = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			transparent: true,
			opacity: 0
		});
		sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphereMesh.position.set(0, 0, 0);
		scene.add(sphereMesh);

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		container.appendChild(renderer.domElement);

		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('click', onClick);

		animate();
	});

	onDestroy(() => {
		if (renderer) {
			renderer.dispose();
		}
		window.removeEventListener('pointermove', onPointerMove);
	});
</script>

<div class="my-l">
	<div class="mt-xl three-container" bind:this={container}></div>
</div>

<style>
	.three-container {
		position: relative;
		width: 100%;
		height: 60vh;
		margin-inline: auto;
	}
</style>
