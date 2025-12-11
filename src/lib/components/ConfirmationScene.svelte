<script lang="ts">
	import { T, Canvas, useTask } from '@threlte/core';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	// Confetti colors
	const colors = [0x667eea, 0x764ba2, 0x10b981, 0xfbbf24, 0xf472b6, 0x60a5fa, 0xa78bfa];

	// Geometry types for variety
	const geometryTypes = ['box', 'tetra', 'octa', 'plane'] as const;

	interface ConfettiParticle {
		id: number;
		type: typeof geometryTypes[number];
		color: number;
		position: [number, number, number];
		rotation: [number, number, number];
		velocity: { x: number; y: number; z: number };
		rotationSpeed: { x: number; y: number; z: number };
		gravity: number;
		opacity: number;
		life: number;
		maxLife: number;
	}

	// Generate confetti particles
	let particles = $state<ConfettiParticle[]>([]);

	onMount(() => {
		// Create burst of particles
		const newParticles: ConfettiParticle[] = [];
		
		for (let i = 0; i < 80; i++) {
			const angle = Math.random() * Math.PI * 2;
			const elevation = (Math.random() - 0.3) * Math.PI;
			const speed = 0.3 + Math.random() * 0.5;

			newParticles.push({
				id: i,
				type: geometryTypes[Math.floor(Math.random() * geometryTypes.length)],
				color: colors[Math.floor(Math.random() * colors.length)],
				position: [
					(Math.random() - 0.5) * 5,
					(Math.random() - 0.5) * 5,
					(Math.random() - 0.5) * 5
				],
				rotation: [
					Math.random() * Math.PI * 2,
					Math.random() * Math.PI * 2,
					Math.random() * Math.PI * 2
				],
				velocity: {
					x: Math.cos(angle) * Math.cos(elevation) * speed,
					y: Math.sin(elevation) * speed * 1.5,
					z: Math.sin(angle) * Math.cos(elevation) * speed
				},
				rotationSpeed: {
					x: (Math.random() - 0.5) * 0.2,
					y: (Math.random() - 0.5) * 0.2,
					z: (Math.random() - 0.5) * 0.2
				},
				gravity: 0.008 + Math.random() * 0.004,
				opacity: 1,
				life: 0,
				maxLife: 150 + Math.random() * 100
			});
		}

		particles = newParticles;
	});

	// Generate sparkle positions
	const sparkleCount = 30;
	const sparklePositions = new Float32Array(sparkleCount * 3);
	for (let i = 0; i < sparkleCount; i++) {
		sparklePositions[i * 3] = (Math.random() - 0.5) * 60;
		sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
		sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
	}

	let sparkleOpacity = $state(0.8);
</script>

<!-- Confetti Particle Component -->
{#snippet ConfettiMesh(particle: ConfettiParticle)}
	<T.Mesh
		position={particle.position}
		rotation={particle.rotation}
	>
		{#if particle.type === 'box'}
			<T.BoxGeometry args={[0.8, 0.8, 0.8]} />
		{:else if particle.type === 'tetra'}
			<T.TetrahedronGeometry args={[0.6]} />
		{:else if particle.type === 'octa'}
			<T.OctahedronGeometry args={[0.5]} />
		{:else}
			<T.PlaneGeometry args={[1, 0.5]} />
		{/if}
		<T.MeshBasicMaterial
			color={particle.color}
			transparent
			opacity={particle.opacity}
			side={2}
		/>
	</T.Mesh>
{/snippet}

{#if browser}
	<div class="confirmation-scene">
		<Canvas>
			<T.PerspectiveCamera makeDefault position={[0, 0, 50]} fov={60} />

			<!-- Animation Controller -->
			<T.Group
				oncreate={({ }) => {
					let frame = 0;
					const animate = () => {
						frame++;
						
						// Update particles
						particles = particles.map(p => {
							const newLife = p.life + 1;
							const lifeRatio = newLife / p.maxLife;
							
							return {
								...p,
								position: [
									p.position[0] + p.velocity.x,
									p.position[1] + p.velocity.y,
									p.position[2] + p.velocity.z
								] as [number, number, number],
								rotation: [
									p.rotation[0] + p.rotationSpeed.x,
									p.rotation[1] + p.rotationSpeed.y,
									p.rotation[2] + p.rotationSpeed.z
								] as [number, number, number],
								velocity: {
									x: p.velocity.x * 0.99 + (p.type === 'plane' ? Math.sin(frame * 0.1 + p.life) * 0.005 : 0),
									y: (p.velocity.y - p.gravity) * 0.99,
									z: p.velocity.z * 0.99 + (p.type === 'plane' ? Math.cos(frame * 0.1 + p.life) * 0.005 : 0)
								},
								opacity: lifeRatio > 0.7 ? 1 - ((lifeRatio - 0.7) / 0.3) : p.opacity,
								life: newLife
							};
						});

						// Twinkle sparkles
						sparkleOpacity = 0.5 + Math.sin(frame * 0.1) * 0.3;

						requestAnimationFrame(animate);
					};
					animate();
				}}
			/>

			<!-- Confetti Particles -->
			{#each particles as particle (particle.id)}
				{@render ConfettiMesh(particle)}
			{/each}

			<!-- Sparkles -->
			<T.Points>
				<T.BufferGeometry>
					<T.BufferAttribute
						attach="attributes-position"
						args={[sparklePositions, 3]}
					/>
				</T.BufferGeometry>
				<T.PointsMaterial
					color={0xffffff}
					size={1.5}
					transparent
					opacity={sparkleOpacity}
					sizeAttenuation
				/>
			</T.Points>
		</Canvas>
	</div>
{/if}

<style>
	.confirmation-scene {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}
</style>