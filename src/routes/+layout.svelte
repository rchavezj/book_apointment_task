<script lang="ts" module>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { browser } from '$app/environment';
	import HexagonField from "$lib/components/HexagonField/HexagonField.svelte";

	
	
</script>


<script lang="ts">
	let { children } = $props();
	let RerenderKey:number = $state<number>(0);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if browser}
	{#key RerenderKey}
		<HexagonField
			rows={39}
			columns={32}
			baseScale={1}
			minScale={0.12}
			animateJiggle={true}
			jiggleDurationSec={2}
			fullScreenFixed={true}
			mouseRadiusDivisor={4}
			colorTransitionSec={1.2}
			colorEase="power2.inOut"
			background="transparent"
			wrapperClass="bg-canvas"
			jiggleEase="power1.inOut"
			jiggleScaleRange={[0.65, 0.85]}
			canvasClass="bg-canvas__canvas"
			colors={['#667eea', '#764ba2','#F6AD55', '#F5F3FF']}
		>
			{@render children()}
		</HexagonField>
	{/key}
{:else}
	{@render children()}
{/if}