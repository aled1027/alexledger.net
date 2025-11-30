import * as THREE from 'three';

export interface ThreeEffectOptions {
	clearColor?: string;
	clearAlpha?: number;
}

/**
 * Base class for Three.js post-processing effects.
 * Provides common functionality for effects that wrap WebGLRenderer.
 */
export abstract class ThreeEffect {
	public readonly domElement: HTMLCanvasElement;

	protected renderer: THREE.WebGLRenderer;
	protected clearColor: string;
	protected clearAlpha: number;
	protected width = 0;
	protected height = 0;

	constructor(renderer: THREE.WebGLRenderer, options: ThreeEffectOptions = {}) {
		this.renderer = renderer;
		this.clearColor = options.clearColor ?? '#000';
		this.clearAlpha = options.clearAlpha ?? 1.0;
		this.domElement = renderer.domElement;
	}

	/**
	 * Resize the effect.
	 */
	public setSize(width: number, height: number): void {
		this.width = width;
		this.height = height;
		this.renderer.setSize(width, height);
		this.onResize(width, height);
	}

	/**
	 * Render the scene with the effect applied.
	 */
	public render(scene: THREE.Scene, camera: THREE.Camera): void {
		this.renderer.setClearColor(this.clearColor, this.clearAlpha);
		this.applyEffect(scene, camera);
	}

	/**
	 * Called when the effect is resized. Override to handle resize logic.
	 */
	protected onResize(width: number, height: number): void {
		// Override in subclasses if needed
	}

	/**
	 * Apply the effect. Must be implemented by subclasses.
	 */
	protected abstract applyEffect(scene: THREE.Scene, camera: THREE.Camera): void;
}

