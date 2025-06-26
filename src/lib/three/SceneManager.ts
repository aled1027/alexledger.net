import * as THREE from 'three';
import { ParticleSystem } from './ParticleSystem';

export class SceneManager {
	private scene: THREE.Scene;
	private camera!: THREE.PerspectiveCamera;
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
		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		this.camera.position.z = 5;
	}

	private setupRenderer(container: HTMLDivElement) {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(this.renderer.domElement);
	}

	resize(width: number, height: number) {
		this.camera.aspect = width / height;
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
