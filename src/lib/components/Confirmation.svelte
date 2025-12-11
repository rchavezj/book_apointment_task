<script lang="ts">
	import { onMount } from 'svelte';
	import type { RepInfo } from '$lib/types/RepInfo';
	import { drawCheckmark, celebrationBurst, staggerFadeIn } from '$lib/utils/animations';

	interface Props {
		email: string;
		formattedDate: string;
		selectedTime: string | null;
		rep: RepInfo;
	}

	let { email, formattedDate, selectedTime, rep }: Props = $props();

	let successIcon: HTMLDivElement;
	let checkmarkSvg: SVGElement;
	let detailsContainer: HTMLDivElement;

	onMount(() => {
		// Animate checkmark drawing
		if (checkmarkSvg) {
			drawCheckmark(checkmarkSvg);
		}

		// Celebration burst
		if (successIcon) {
			setTimeout(() => celebrationBurst(successIcon), 300);
		}

		// Stagger in the details
		if (detailsContainer) {
			const items = detailsContainer.querySelectorAll('.confirm-item');
			staggerFadeIn(items, { delay: 0.5, stagger: 0.1, y: 15 });
		}
	});
</script>

<div class="confirmation-section">
	<div class="success-icon" bind:this={successIcon}>
		<svg 
			bind:this={checkmarkSvg}
			width="48" 
			height="48" 
			viewBox="0 0 24 24" 
			fill="none" 
			stroke="currentColor" 
			stroke-width="2"
		>
			<circle cx="12" cy="12" r="10" class="circle" />
			<polyline points="8 12 11 15 16 9" class="checkmark" />
		</svg>
	</div>

	<h1 class="confirm-title">You're all set!</h1>
	<p class="confirm-subtitle">
		A calendar invitation has been sent to <strong>{email}</strong>
	</p>

	<div class="confirm-details" bind:this={detailsContainer}>
		<div class="confirm-item">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2">
				<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
				<line x1="16" y1="2" x2="16" y2="6" />
				<line x1="8" y1="2" x2="8" y2="6" />
				<line x1="3" y1="10" x2="21" y2="10" />
			</svg>
			<span>{formattedDate}</span>
		</div>
		<div class="confirm-item">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2">
				<circle cx="12" cy="12" r="10" />
				<polyline points="12 6 12 12 16 14" />
			</svg>
			<span>{selectedTime} Local Time</span>
		</div>
		<div class="confirm-item">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2">
				<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
				<circle cx="12" cy="7" r="4" />
			</svg>
			<span>{rep.name}</span>
		</div>
	</div>

	<div class="add-to-calendar">
		<span class="add-to-calendar-label">Add to calendar</span>
		<div class="calendar-buttons">
			<button class="calendar-btn">Google</button>
			<button class="calendar-btn">Outlook</button>
			<button class="calendar-btn">Apple</button>
		</div>
	</div>
</div>

<style>
	.confirmation-section { text-align: center; padding-top: 40px; max-width: 600px; }
	
	.success-icon {
		width: 80px;
		height: 80px;
		margin: 0 auto 24px;
		background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: visible;
	}

	.success-icon svg { z-index: 1; }
	.success-icon .circle { stroke: #667eea; }
	.success-icon .checkmark { stroke: #667eea; }

	.confirm-title {
		font-family: 'Fraunces', serif;
		font-size: 32px;
		font-weight: 600;
		color: #1a1a2e;
		margin: 0 0 12px 0;
	}

	.confirm-subtitle {
		font-size: 15px;
		color: #64748b;
		margin: 0 0 32px 0;
	}

	.confirm-details {
		background: #f8fafc;
		border-radius: 16px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 32px;
		text-align: left;
	}

	.confirm-item {
		display: flex;
		align-items: center;
		gap: 14px;
		font-size: 15px;
		color: #374151;
		opacity: 0;
	}

	.add-to-calendar {
		border-top: 1px solid #e2e8f0;
		padding-top: 24px;
	}

	.add-to-calendar-label {
		display: block;
		font-size: 13px;
		color: #94a3b8;
		margin-bottom: 12px;
	}

	.calendar-buttons {
		display: flex;
		gap: 12px;
		justify-content: center;
	}

	.calendar-btn {
		padding: 10px 20px;
		font-size: 13px;
		font-weight: 500;
		color: #475569;
		background: white;
		border: 2px solid #e2e8f0;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.calendar-btn:hover {
		border-color: #667eea;
		color: #667eea;
		transform: translateY(-2px);
	}
</style>