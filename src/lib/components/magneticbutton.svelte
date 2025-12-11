<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Snippet } from 'svelte';
	import { createMagneticButton, buttonClickEffect } from '$lib/utils/animations';


	interface Props {
		onclick?: () => void;
		disabled?: boolean;
		type?: 'button' | 'submit';
		class?: string;
		children: Snippet;
	}

	let { onclick, disabled = false, type = 'button', class: className = '', children }: Props = $props();

	let buttonElement: HTMLButtonElement;
	let cleanup: (() => void) | null = null;

	onDestroy(() => {
		cleanup?.();
	});

	function handleClick() {
		if (disabled) return;
		if (buttonElement) {
			buttonClickEffect(buttonElement);
		}
		onclick?.();
	}

	$effect(() => {
		if (buttonElement && !disabled) {
			cleanup = createMagneticButton(buttonElement);
		}
	});

	// Re-initialize when disabled changes
	$effect(() => {
		if (buttonElement) {
			cleanup?.();
			if (!disabled) {
				cleanup = createMagneticButton(buttonElement);
			}
		}
	});
</script>

<button
	bind:this={buttonElement}
	{type}
	{disabled}
	class="magnetic-btn {className}"
	onclick={handleClick}
>
	{@render children()}
</button>

<style>
	.magnetic-btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 16px 24px;
		font-size: 16px;
		font-weight: 600;
		color: white;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: box-shadow 0.3s ease;
		box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
		will-change: transform;
	}

	.magnetic-btn:hover:not(:disabled) {
		box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
	}

	.magnetic-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>