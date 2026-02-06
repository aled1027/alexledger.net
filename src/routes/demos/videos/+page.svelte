<script lang="ts">
	import * as THREE from 'three';
	// @ts-ignore
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { onMount } from 'svelte';

	const videos = [
		{ videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/anna-neshyba-edited.mp4', label: 'Anna Neshyba' },
		{ videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/ethyca-animation-demo-video.mp4', label: 'Ethyca Product Animation' },
		{ videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/maxlifefoundation.mp4', label: 'Max Life Foundation' },
		{ videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/incontextlearning.mp4', label: 'Incontext Learning' },
		{ videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/catandalex.mp4', label: 'Cat and Alex' },
		{ videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/catnesh.mp4', label: 'Cat Nesh' },
		{ videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/cosmicfronter-v0.mp4', label: 'Cosmic Fronter' },
		{ videoUrl: 'https://pub-57309283dfae43be93171f41b37f356c.r2.dev/vyx.mp4', label: 'Vyx' }
	];

	// BoxGeometry face normals in local space (right, left, top, bottom, front, back)
	const FACE_NORMALS = [
		new THREE.Vector3(1, 0, 0),
		new THREE.Vector3(-1, 0, 0),
		new THREE.Vector3(0, 1, 0),
		new THREE.Vector3(0, -1, 0),
		new THREE.Vector3(0, 0, 1),
		new THREE.Vector3(0, 0, -1)
	];

	class Sketch {
		private scene: THREE.Scene;
		private camera: THREE.PerspectiveCamera;
		private renderer: THREE.WebGLRenderer;
		private container: HTMLDivElement;
		private animationId: number | null = null;
		private cube: THREE.Mesh;
		private controls: OrbitControls;
		private videoElements: HTMLVideoElement[] = [];
		private videoTextures: THREE.VideoTexture[] = [];
		private materials: THREE.MeshBasicMaterial[] = [];
		private geometry: THREE.BoxGeometry;
		private cycleOffset = 0;
		private lastCycleTime = 0;
		private readonly CYCLE_INTERVAL_MS = 8000;
		private pos = new THREE.Vector3(0, 0, 0);
		private vel: THREE.Vector3;
		private readonly MOVE_BOUNDS = 2.5;
		private moveSpeed = 0.0015;
		private rotSpeedX = 0.002;
		private rotSpeedY = 0.002;
		private rotSpeedZ = 0.001;
		private reducedMotion = false;
		private visible = true;
		private onFrontFaceLabel: (label: string) => void;

		constructor(container: HTMLDivElement, onFrontFaceLabel: (label: string) => void) {
			this.container = container;
			this.onFrontFaceLabel = onFrontFaceLabel;
			this.scene = new THREE.Scene();
			this.scene.background = new THREE.Color(0x0a0a0a);

			this.camera = new THREE.PerspectiveCamera(
				75,
				container.clientWidth / container.clientHeight,
				0.1,
				1000
			);
			this.camera.position.z = 3;
			this.scene.add(this.camera);

			this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(this.renderer.domElement);

			const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
			const size = 1.5;
			this.geometry = new THREE.BoxGeometry(size, size, size);

			for (let i = 0; i < 8; i++) {
				const video = document.createElement('video');
				video.src = videos[i].videoUrl;
				video.crossOrigin = 'anonymous';
				video.loop = true;
				video.muted = true;
				video.autoplay = true;
				video.playsInline = true;
				video.style.display = 'none';
				document.body.appendChild(video);
				this.videoElements.push(video);

				const videoTexture = new THREE.VideoTexture(video);
				videoTexture.minFilter = THREE.LinearFilter;
				videoTexture.magFilter = THREE.LinearFilter;
				videoTexture.anisotropy = maxAnisotropy;
				this.videoTextures.push(videoTexture);

				video.addEventListener('loadedmetadata', () => this.setTextureCover(videoTexture, video));
				video.addEventListener('loadeddata', () => this.setTextureCover(videoTexture, video));
			}

			// Cube shows first 6 videos; we cycle which 6 via material.map
			this.materials = this.videoTextures.slice(0, 6).map(
				(texture) => new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide })
			);
			this.updateMaterialMaps();

			this.cube = new THREE.Mesh(this.geometry, this.materials);
			this.scene.add(this.cube);

			const moveDirX = 0.005;
			const moveDirY = 0.005;
			const moveDirLen = Math.hypot(moveDirX, moveDirY) || 1;
			this.vel = new THREE.Vector3((this.moveSpeed * moveDirX) / moveDirLen, (this.moveSpeed * moveDirY) / moveDirLen, 0);

			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls.enableDamping = true;
			this.controls.dampingFactor = 0.05;

			this.animate();
		}

		private setMotionSpeeds(reduced: boolean): void {
			this.reducedMotion = reduced;
			this.moveSpeed = reduced ? 0 : 0.0015;
			this.rotSpeedX = reduced ? 0 : 0.002;
			this.rotSpeedY = reduced ? 0 : 0.002;
			this.rotSpeedZ = reduced ? 0 : 0.001;
		}

		setReducedMotion(reduced: boolean): void {
			this.setMotionSpeeds(reduced);
			const moveDirX = 0.005;
			const moveDirY = 0.005;
			const moveDirLen = Math.hypot(moveDirX, moveDirY) || 1;
			this.vel.set((this.moveSpeed * moveDirX) / moveDirLen, (this.moveSpeed * moveDirY) / moveDirLen, 0);
		}

		setVisible(visible: boolean): void {
			this.visible = visible;
			this.videoElements.forEach((v) => {
				if (visible) v.play().catch(() => {});
				else v.pause();
			});
		}

		private setTextureCover(texture: THREE.VideoTexture, video: HTMLVideoElement): void {
			const w = video.videoWidth;
			const h = video.videoHeight;
			if (!w || !h) return;
			const r = w / h;
			texture.offset.set(0, 0);
			texture.repeat.set(1, 1);
			if (r > 1) {
				texture.offset.set((1 - 1 / r) / 2, 0);
				texture.repeat.set(1 / r, 1);
			} else if (r < 1) {
				texture.offset.set(0, (1 - r) / 2);
				texture.repeat.set(1, r);
			}
		}

		private updateMaterialMaps(): void {
			for (let i = 0; i < 6; i++) {
				this.materials[i].map = this.videoTextures[(this.cycleOffset + i) % 8];
			}
		}

		private getFrontFaceIndex(): number {
			const worldQuaternion = new THREE.Quaternion();
			this.cube.getWorldQuaternion(worldQuaternion);
			const toCamera = new THREE.Vector3().subVectors(this.camera.position, this.cube.position).normalize();
			let maxDot = -Infinity;
			let frontIndex = 0;
			for (let i = 0; i < 6; i++) {
				const worldNormal = FACE_NORMALS[i].clone().applyQuaternion(worldQuaternion);
				const dot = worldNormal.dot(toCamera);
				if (dot > maxDot) {
					maxDot = dot;
					frontIndex = i;
				}
			}
			return frontIndex;
		}

		resize(): void {
			this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
		}

		private animate = (): void => {
			this.animationId = requestAnimationFrame(this.animate);

			const now = performance.now();
			if (this.visible) {
				// Cycle which 6 of 8 videos are on the cube
				if (now - this.lastCycleTime >= this.CYCLE_INTERVAL_MS) {
					this.lastCycleTime = now;
					this.cycleOffset = (this.cycleOffset + 1) % 8;
					this.updateMaterialMaps();
				}

				// Screensaver motion (skip when reduced motion)
				if (!this.reducedMotion) {
					this.pos.add(this.vel);
					if (this.pos.x <= -this.MOVE_BOUNDS) {
						this.pos.x = -this.MOVE_BOUNDS;
						this.vel.x = Math.abs(this.vel.x);
					}
					if (this.pos.x >= this.MOVE_BOUNDS) {
						this.pos.x = this.MOVE_BOUNDS;
						this.vel.x = -Math.abs(this.vel.x);
					}
					if (this.pos.y <= -this.MOVE_BOUNDS) {
						this.pos.y = -this.MOVE_BOUNDS;
						this.vel.y = Math.abs(this.vel.y);
					}
					if (this.pos.y >= this.MOVE_BOUNDS) {
						this.pos.y = this.MOVE_BOUNDS;
						this.vel.y = -Math.abs(this.vel.y);
					}
					this.cube.position.copy(this.pos);

					this.cube.rotation.x += this.rotSpeedX;
					this.cube.rotation.y += this.rotSpeedY;
					this.cube.rotation.z += this.rotSpeedZ;
				}

				// Update video textures only when frame data is ready
				for (let i = 0; i < this.videoElements.length; i++) {
					if (this.videoElements[i].readyState >= 2) {
						this.videoTextures[i].needsUpdate = true;
					}
				}

				const frontFace = this.getFrontFaceIndex();
				const videoIndex = (this.cycleOffset + frontFace) % 8;
				this.onFrontFaceLabel(videos[videoIndex].label);
			}

			this.controls.update();
			this.renderer.render(this.scene, this.camera);
		};

		dispose(): void {
			if (this.animationId !== null) {
				cancelAnimationFrame(this.animationId);
			}
			this.videoElements.forEach((v) => {
				v.pause();
				v.src = '';
				v.remove();
			});
			this.videoTextures.forEach((t) => t.dispose());
			this.materials.forEach((m) => m.dispose());
			this.geometry.dispose();
			this.renderer.dispose();
			if (this.container.contains(this.renderer.domElement)) {
				this.container.removeChild(this.renderer.domElement);
			}
		}
	}

	let container: HTMLDivElement;
	let sketch: Sketch;
	let frontFaceLabel = $state('');
	let reducedMotion = $state(false);

	function handleResize(): void {
		sketch?.resize();
	}

	onMount(() => {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = query.matches;
		const onMatch = (e: MediaQueryListEvent) => {
			reducedMotion = e.matches;
			sketch?.setReducedMotion(e.matches);
		};
		query.addEventListener('change', onMatch);

		sketch = new Sketch(container, (label) => {
			frontFaceLabel = label;
		});
		sketch.setReducedMotion(reducedMotion);
		sketch.resize();

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				sketch?.setVisible(entry?.isIntersecting ?? true);
			},
			{ threshold: 0.1 }
		);
		observer.observe(container);

		window.addEventListener('resize', handleResize);

		return () => {
			query.removeEventListener('change', onMatch);
			observer.disconnect();
			window.removeEventListener('resize', handleResize);
			sketch?.dispose();
		};
	});
</script>

<div class="my-l">
	<h2>The Video Screensaver</h2>
	<p class="description">Drag to rotate the cube. All 8 videos cycle onto the six faces.</p>

	<div class="mt-xl three-container" bind:this={container}>
		{#if frontFaceLabel}
			<div class="face-label" aria-live="polite">{frontFaceLabel}</div>
		{/if}
	</div>

	<ul class="video-list" aria-label="Videos on the cube">
		{#each videos as v}
			<li class:current={v.label === frontFaceLabel}>{v.label}</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	.description {
		max-width: 55rem;
	}

	.three-container {
		position: relative;
		width: 100%;
		max-width: 900px;
		height: 60vh;
		margin-inline: auto;
		cursor: grab;
		border: 1px solid rgba(0, 0, 0, 0.2);
		border-radius: 8px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

		&:active {
			cursor: grabbing;
		}
	}

	.face-label {
		position: absolute;
		bottom: 0.75rem;
		left: 0.75rem;
		padding: 0.35rem 0.6rem;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		font-size: 0.9rem;
		border-radius: 4px;
		pointer-events: none;
	}

	.video-list {
		margin-top: 1rem;
		padding-left: 1.25rem;
		max-width: 55rem;
		font-size: 0.95rem;
		list-style: none;

		li {
			padding: 0.2rem 0;
			&.current {
				font-weight: 600;
			}
		}
	}
</style>
