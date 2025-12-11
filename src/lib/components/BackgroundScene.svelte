<script lang="ts">
    import * as THREE from 'three';
	import { onMount, onDestroy } from 'svelte';
	

	let container: HTMLDivElement;
	let animationId: number;
	let renderer: THREE.WebGLRenderer | null = null;
	let prefersReducedMotion = false;

	onMount(() => {
		prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion || !container) return;

		// Scene setup
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
		camera.position.z = 30;

		// Renderer
		renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		container.appendChild(renderer.domElement);

		// Create gradient orbs
		const orbs: THREE.Mesh[] = [];
		const orbData: { speed: THREE.Vector3; rotationSpeed: THREE.Vector3; floatOffset: number }[] = [];

		const colors = [
			new THREE.Color(0x667eea), // Primary purple
			new THREE.Color(0x764ba2), // Secondary purple
			new THREE.Color(0x8b5cf6), // Violet
			new THREE.Color(0x6366f1), // Indigo
			new THREE.Color(0xa78bfa), // Light purple
		];

		for (let i = 0; i < 5; i++) {
			const geometry = new THREE.IcosahedronGeometry(2 + Math.random() * 3, 1);
			const material = new THREE.MeshBasicMaterial({
				color: colors[i % colors.length],
				transparent: true,
				opacity: 0.15 + Math.random() * 0.1,
				wireframe: false,
			});

			const orb = new THREE.Mesh(geometry, material);
			orb.position.set(
				(Math.random() - 0.5) * 20,
				(Math.random() - 0.5) * 30,
				(Math.random() - 0.5) * 10 - 5
			);

			orbs.push(orb);
			scene.add(orb);

			orbData.push({
				speed: new THREE.Vector3(
					(Math.random() - 0.5) * 0.005,
					(Math.random() - 0.5) * 0.005,
					(Math.random() - 0.5) * 0.002
				),
				rotationSpeed: new THREE.Vector3(
					Math.random() * 0.002,
					Math.random() * 0.002,
					Math.random() * 0.001
				),
				floatOffset: Math.random() * Math.PI * 2
			});
		}

		// Add soft ambient particles
		const particleCount = 50;
		const particleGeometry = new THREE.BufferGeometry();
		const positions = new Float32Array(particleCount * 3);

		for (let i = 0; i < particleCount * 3; i += 3) {
			positions[i] = (Math.random() - 0.5) * 40;
			positions[i + 1] = (Math.random() - 0.5) * 50;
			positions[i + 2] = (Math.random() - 0.5) * 20 - 10;
		}

		particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		const particleMaterial = new THREE.PointsMaterial({
			color: 0x667eea,
			size: 0.15,
			transparent: true,
			opacity: 0.4,
			sizeAttenuation: true
		});

		const particles = new THREE.Points(particleGeometry, particleMaterial);
		scene.add(particles);

		let time = 0;

		// Animation loop
		function animate() {
			animationId = requestAnimationFrame(animate);
			time += 0.01;

			// Animate orbs
			orbs.forEach((orb, i) => {
				const data = orbData[i];
				
				// Gentle floating motion
				orb.position.x += Math.sin(time + data.floatOffset) * 0.02;
				orb.position.y += Math.cos(time * 0.7 + data.floatOffset) * 0.015;
				
				// Slow rotation
				orb.rotation.x += data.rotationSpeed.x;
				orb.rotation.y += data.rotationSpeed.y;

				// Subtle scale pulsing
				const scale = 1 + Math.sin(time * 0.5 + data.floatOffset) * 0.05;
				orb.scale.setScalar(scale);
			});

			// Rotate particles slowly
			particles.rotation.y += 0.0003;
			particles.rotation.x += 0.0001;

			renderer?.render(scene, camera);
		}

		animate();

		// Handle resize
		const handleResize = () => {
			if (!container || !renderer) return;
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	onDestroy(() => {
		if (animationId) cancelAnimationFrame(animationId);
		if (renderer) {
			renderer.dispose();
			renderer.forceContextLoss();
		}
	});
</script>

<div class="background-scene" bind:this={container}></div>

<style>
	.background-scene {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
		opacity: 0.2;
	}

	.background-scene :global(canvas) {
		display: block;
	}
</style>