<script lang="ts">
	import type { TimeSlot } from '$lib/utils/utils';
	import { staggerFadeIn } from '$lib/utils/animations';

	interface Props {
		availableSlots: TimeSlot[];
		selectedTime: string | null;
		formattedDate: string;
		isLoading?: boolean;
		onTimeSelect: (slot: TimeSlot) => void;
	}

	let { availableSlots, selectedTime, formattedDate, isLoading = false, onTimeSelect }: Props = $props();

	
	let previousSlotCount = $state(0);
	let slotsContainer = $state<HTMLDivElement | undefined>();

	// Animate slots when they change
	$effect(() => {
		if (availableSlots.length > 0 && availableSlots.length !== previousSlotCount && slotsContainer) {
			const slots = slotsContainer.querySelectorAll('.time-slot');
			staggerFadeIn(slots, { stagger: 0.04, y: 15, duration: 0.35 });
		}
		previousSlotCount = availableSlots.length;
	});
</script>

<div class="time-slots-wrapper">
	<div class="time-slots-header">
		<span class="selected-date-label">{formattedDate}</span>
		<span class="timezone">Local Time</span>
	</div>

	{#if isLoading}
		<div class="loading-slots">
			<div class="spinner"></div>
			<span>Loading available times...</span>
		</div>
	{:else if availableSlots.length === 0}
		<div class="no-slots">
			<span>No available times for this date</span>
		</div>
	{:else}
		<div class="time-slots" bind:this={slotsContainer}>
			{#each availableSlots as slot}
				<button
					class="time-slot"
					class:selected={selectedTime === slot.display}
					onclick={() => onTimeSelect(slot)}
				>
					{slot.display}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
	@keyframes spin { to { transform: rotate(360deg); } }
	.time-slots-wrapper { flex: 1; min-width: 180px; animation: slideIn 0.3s ease-out; }
	.time-slots-header { margin-bottom: 16px; }
	.selected-date-label { display: block; font-size: 14px; font-weight: 600; color: #1a1a2e; margin-bottom: 4px; }
	.timezone { font-size: 12px; color: #94a3b8; }
	.time-slots { display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; padding-right: 8px; }
	.time-slot { padding: 12px 16px; font-size: 14px; font-weight: 500; color: #475569; background: white; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; text-align: center; opacity: 0; }
	.time-slot:hover:not(.selected) { background: #f0f4ff; border-color: #667eea; transform: translateY(-2px); }
	.time-slot.selected { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-color: transparent; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); opacity: 1; }
	.loading-slots, .no-slots { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 40px 20px; color: #64748b; font-size: 14px; }
	.spinner { width: 24px; height: 24px; border: 3px solid #e2e8f0; border-top-color: #667eea; border-radius: 50%; animation: spin 0.8s linear infinite; }
	.no-slots { color: #94a3b8; }
</style>