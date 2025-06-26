import * as THREE from 'three';
import { ParticleSystem } from './ParticleSystem';

export class SceneManager {
	private scene: THREE.Scene;
	private camera!: THREE.OrthographicCamera;
	private renderer!: THREE.WebGLRenderer;
	private particleSystem: ParticleSystem;

	constructor(container: HTMLDivElement) {
		this.scene = new THREE.Scene();
		this.setupCamera(container);
		this.setupRenderer(container);
		this.particleSystem = new ParticleSystem();
		this.scene.add(this.particleSystem.particles);
	}

	private setupCamera(container: HTMLDivElement) {
		const width = container.clientWidth;
		const height = container.clientHeight;
		const aspectRatio = width / height;
		const frustumSize = 10;

		this.camera = new THREE.OrthographicCamera(
			(frustumSize * aspectRatio) / -2,
			(frustumSize * aspectRatio) / 2,
			frustumSize / 2,
			frustumSize / -2,
			0.1,
			1000
		);

		// Position for true isometric view (equal angles from each axis)
		const distance = 7; // Adjusted for better view of the whole particle system
		const angle = (Math.PI / 180) * 35.264; // Classic isometric angle
		this.camera.position.set(distance * Math.cos(angle), distance, distance * Math.cos(angle));
		this.camera.lookAt(0, 0, 0);
	}

	private setupRenderer(container: HTMLDivElement) {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(this.renderer.domElement);
	}

	resize(width: number, height: number) {
		const aspectRatio = width / height;
		const frustumSize = 10;

		this.camera.left = (frustumSize * aspectRatio) / -2;
		this.camera.right = (frustumSize * aspectRatio) / 2;
		this.camera.top = frustumSize / 2;
		this.camera.bottom = frustumSize / -2;

		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
	}

	animate = () => {
		requestAnimationFrame(this.animate);
		this.particleSystem.update();
		this.renderer.render(this.scene, this.camera);
	};

	dispose() {
		this.renderer.dispose();
	}
}
