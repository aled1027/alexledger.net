<script lang="ts">
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
	import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
	import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
	import { onMount } from 'svelte';
	import { Text } from 'troika-three-text';

	class Sketch {
		private container: HTMLDivElement;
		private scene: THREE.Scene;
		private camera: THREE.PerspectiveCamera;
		private renderer: THREE.WebGLRenderer;
		private composer: EffectComposer;
		private controls: OrbitControls;
		private animationId: number | null = null;

		private text: Text;
		private bloomPass: UnrealBloomPass;
		private gooPass: ShaderPass;

		// Single master control: 0 = normal, 1 = very goopy
		private goopiness = 0.0;
		private targetGoopiness = 0.0;

		constructor(container: HTMLDivElement) {
			this.container = container;

			this.scene = new THREE.Scene();
			this.scene.background = null;

			this.camera = new THREE.PerspectiveCamera(
				60,
				container.clientWidth / container.clientHeight,
				0.1,
				100
			);
			this.camera.position.set(0, 0, 5);

			this.renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true
			});
			this.renderer.setClearColor(0x000000, 0);
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.renderer.setSize(container.clientWidth, container.clientHeight);

			// Bloom behaves better with tone mapping enabled.
			this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
			this.renderer.toneMappingExposure = 1.0;
			this.renderer.outputColorSpace = THREE.SRGBColorSpace;

			container.appendChild(this.renderer.domElement);

			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls.enableDamping = true;

			this.text = new Text();
			this.text.text = 'GOO';
			this.text.fontSize = 1.5;
			this.text.position.set(0, 0, 0);
			this.text.anchorX = 'center';
			this.text.anchorY = 'middle';
			this.text.color = 0x88ffff;
			this.text.letterSpacing = 0;
			this.text.material = new THREE.MeshBasicMaterial({
				color: 0x88ffff,
				transparent: true
			});
			this.scene.add(this.text);

			// Troika text layout/SDF generation is async.
			this.text.sync();

			this.composer = new EffectComposer(this.renderer);
			this.composer.addPass(new RenderPass(this.scene, this.camera));

			this.bloomPass = new UnrealBloomPass(
				new THREE.Vector2(container.clientWidth, container.clientHeight),
				0.0,
				0.05,
				0.95
			);
			this.composer.addPass(this.bloomPass);

			this.gooPass = new ShaderPass(
				new THREE.ShaderMaterial({
					uniforms: {
						tDiffuse: { value: null },
						uGoop: { value: 0.0 }
					},
					vertexShader: `
						varying vec2 vUv;

						void main() {
							vUv = uv;
							gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
						}
					`,
					fragmentShader: `
						uniform sampler2D tDiffuse;
						uniform float uGoop;
						varying vec2 vUv;

						void main() {
							vec4 base = texture2D(tDiffuse, vUv);

							// Derive a blob mask from post-bloom brightness.
							float brightness = max(max(base.r, base.g), base.b);

							float threshold = mix(0.92, 0.30, uGoop);
							float softness  = mix(0.015, 0.12, uGoop);
							float strength  = mix(0.0, 0.35, uGoop);

							float goo = smoothstep(
								threshold - softness,
								threshold + softness,
								brightness
							);

							// Preserve the original text and add goo on top.
							vec3 finalColor = base.rgb + goo * strength * base.rgb;
							float finalAlpha = max(base.a, goo * 0.35 * uGoop);

							gl_FragColor = vec4(finalColor, finalAlpha);
						}
					`,
					transparent: true
				}),
				'tDiffuse'
			);
			this.composer.addPass(this.gooPass);

			this.bindEvents();
			this.animate();
		}

		private bindEvents(): void {
			this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
			window.addEventListener('pointerup', this.onPointerUp);
			window.addEventListener('keydown', this.onKeyDown);
		}

		private unbindEvents(): void {
			this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
			window.removeEventListener('pointerup', this.onPointerUp);
			window.removeEventListener('keydown', this.onKeyDown);
		}

		private onPointerDown = (): void => {
			this.targetGoopiness = 1.0;
		};

		private onPointerUp = (): void => {
			this.targetGoopiness = 0.0;
		};

		private onKeyDown = (event: KeyboardEvent): void => {
			if (event.code === 'Space') {
				this.targetGoopiness = this.targetGoopiness > 0.5 ? 0.0 : 1.0;
			}
		};

		private animate = (): void => {
			this.animationId = requestAnimationFrame(this.animate);

			this.controls.update();

			// Smoothly ease toward the target.
			this.goopiness += (this.targetGoopiness - this.goopiness) * 0.08;

			// Map one value -> all bloom parameters
			this.bloomPass.strength = THREE.MathUtils.lerp(0.0, 1.35, this.goopiness);
			this.bloomPass.radius = THREE.MathUtils.lerp(0.05, 0.85, this.goopiness);
			this.bloomPass.threshold = THREE.MathUtils.lerp(0.95, 0.22, this.goopiness);

			// Pass one value into the goo shader
			const mat = this.gooPass.material as THREE.ShaderMaterial;
			mat.uniforms.uGoop.value = this.goopiness;

			// Pull letters closer together as they get goopier
			this.text.letterSpacing = THREE.MathUtils.lerp(0.0, -0.09, this.goopiness);

			// Optional subtle squash/wobble
			const wobble = Math.sin(performance.now() * 0.003) * 0.015 * this.goopiness;
			this.text.scale.set(1.0 + wobble, 1.0 - wobble, 1.0);

			this.text.sync();

			this.composer.render();
		};

		resize(): void {
			const width = this.container.clientWidth;
			const height = this.container.clientHeight;

			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();

			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.renderer.setSize(width, height);
			this.composer.setSize(width, height);
			this.bloomPass.setSize(width, height);
		}

		dispose(): void {
			if (this.animationId !== null) {
				cancelAnimationFrame(this.animationId);
			}

			this.unbindEvents();
			this.controls.dispose();
			this.text.dispose();
			this.renderer.dispose();

			if (this.container.contains(this.renderer.domElement)) {
				this.container.removeChild(this.renderer.domElement);
			}
		}
	}

	let container: HTMLDivElement;
	let sketch: Sketch;

	function onResize(): void {
		sketch?.resize();
	}

	onMount(() => {
		sketch = new Sketch(container);
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
			sketch?.dispose();
		};
	});
</script>

<div class="my-l">
	<h2>SDF Text</h2>
	<p>Hold mouse down or press space to increase goopiness.</p>
</div>

<div class="sketch" bind:this={container}></div>

<style lang="scss">
	.sketch {
		position: absolute;
		top: 30vh;
		bottom: 0;
		left: 0;
		right: 0;
		border-radius: 0.75rem;
		overflow: hidden;
		cursor: grab;

		&:active {
			cursor: grabbing;
		}
	}
</style>
