import * as THREE from 'three';

export class ParticleSystem {
	particles: THREE.Points;
	particleCount: number;
	particleSize: number;

	constructor(particleCount: number = 200, particleSize: number = 0.5) {
		this.particleCount = particleCount;
		this.particleSize = particleSize;
		this.particles = this.createParticles();
	}

	private createParticles(): THREE.Points {
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(this.particleCount * 3);
		const velocities = new Float32Array(this.particleCount * 3);

		for (let i = 0; i < this.particleCount; i++) {
			const x = (Math.random() - 0.5) * 10;
			const y = (Math.random() - 0.5) * 10;
			const z = (Math.random() - 0.5) * 10;
			positions.set([x, y, z], i * 3);

			const vx = (Math.random() - 0.5) * 0.02;
			const vy = (Math.random() - 0.5) * 0.02;
			const vz = (Math.random() - 0.5) * 0.02;
			velocities.set([vx, vy, vz], i * 3);
		}

		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

		const material = new THREE.PointsMaterial({
			size: this.particleSize,
			color: 0xffffff,
			transparent: true,
			map: new THREE.TextureLoader().load('/textures/eye.png'),
			alphaTest: 0.5,
			sizeAttenuation: true
		});

		return new THREE.Points(geometry, material);
	}

	update() {
		this.particles.rotation.x += 0.001;
		this.particles.rotation.y += 0.002;

		const positions = this.particles.geometry.attributes.position.array as Float32Array;
		const velocities = this.particles.geometry.attributes.velocity.array as Float32Array;

		for (let i = 0; i < this.particleCount; i++) {
			const i3 = i * 3;

			positions[i3] += velocities[i3];
			positions[i3 + 1] += velocities[i3 + 1];
			positions[i3 + 2] += velocities[i3 + 2];

			const bounds = 5;
			for (let j = 0; j < 3; j++) {
				if (Math.abs(positions[i3 + j]) > bounds) {
					velocities[i3 + j] *= -1;
				}
			}
		}

		this.particles.geometry.attributes.position.needsUpdate = true;
	}
}
