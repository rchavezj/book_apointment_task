<script lang="ts">
	import { T, Canvas } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import { browser } from '$app/environment';

	const colors = [0x667eea, 0x764ba2, 0x8b5cf6, 0x6366f1, 0xa78bfa];

	// Generate random orb data
	const orbs = Array.from({ length: 5 }, (_, i) => ({
		id: i,
		color: colors[i % colors.length],
		size: 2 + Math.random() * 3,
		position: [
			(Math.random() - 0.5) * 20,
			(Math.random() - 0.5) * 30,
			(Math.random() - 0.5) * 10 - 5
		] as [number, number, number],
		opacity: 0.15 + Math.random() * 0.1,
		floatSpeed: 1 + Math.random() * 2,
		floatIntensity: 1 + Math.random() * 2,
		rotationSpeed: [
			Math.random() * 0.5,
			Math.random() * 0.5,
			Math.random() * 0.25
		] as [number, number, number]
	}));

	// Generate particle positions
	const particleCount = 50;
	const particlePositions = new Float32Array(particleCount * 3);
	for (let i = 0; i < particleCount * 3; i += 3) {
		particlePositions[i] = (Math.random() - 0.5) * 40;
		particlePositions[i + 1] = (Math.random() - 0.5) * 50;
		particlePositions[i + 2] = (Math.random() - 0.5) * 20 - 10;
	}
</script>

{#if browser}
	<div class="background-scene">
		<Canvas>
			<T.PerspectiveCamera makeDefault position={[0, 0, 30]} fov={75} />

			<!-- Floating Orbs -->
			{#each orbs as orb (orb.id)}
				<Float
					speed={orb.floatSpeed}
					floatIntensity={orb.floatIntensity}
					rotationSpeed={orb.rotationSpeed}
				>
					<T.Mesh position={orb.position}>
						<T.IcosahedronGeometry args={[orb.size, 1]} />
						<T.MeshBasicMaterial
							color={orb.color}
							transparent
							opacity={orb.opacity}
						/>
					</T.Mesh>
				</Float>
			{/each}

			<!-- Ambient Particles -->
			<T.Points>
				<T.BufferGeometry>
					<T.BufferAttribute
						attach="attributes-position"
						args={[particlePositions, 3]}
					/>
				</T.BufferGeometry>
				<T.PointsMaterial
					color={0x667eea}
					size={0.15}
					transparent
					opacity={0.4}
					sizeAttenuation
				/>
			</T.Points>
		</Canvas>
	</div>
{/if}

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
</style>