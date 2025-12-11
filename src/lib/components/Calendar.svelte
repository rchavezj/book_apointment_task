<script lang="ts">
	import { onMount } from 'svelte';
	import type { CalendarDay } from '$lib/types/CalendarDay';
	import { MONTH_NAMES, WEEK_DAYS } from '$lib/types/constants';
	import { calendarRippleIn } from '$lib/utils/animations';

	interface Props {
		currentMonth: Date;
		calendarDays: CalendarDay[];
		selectedDate: string | null;
		datesWithAvailability?: Set<string>;
		isLoading?: boolean;
		onDateSelect: (day: CalendarDay) => void;
		onPrevMonth: () => void;
		onNextMonth: () => void;
	}

	let {
		currentMonth,
		calendarDays,
		selectedDate,
		datesWithAvailability = new Set(),
		isLoading = false,
		onDateSelect,
		onPrevMonth,
		onNextMonth
	}: Props = $props();

	let gridElement: HTMLDivElement;
	let previousMonth = $state<number | null>(null);

	function hasAvailability(day: CalendarDay): boolean {
		return day.fullDate ? datesWithAvailability.has(day.fullDate) : false;
	}

	function isDisabled(day: CalendarDay): boolean {
		return !day.isCurrentMonth || day.isPast || day.isWeekend || !hasAvailability(day);
	}

	$effect(() => {
		const newMonth = currentMonth.getMonth();
		if (previousMonth !== null && previousMonth !== newMonth && gridElement) {
			const days = gridElement.querySelectorAll('.calendar-day');
			calendarRippleIn(days);
		}
		previousMonth = newMonth;
	});

	onMount(() => {
		if (gridElement) {
			const days = gridElement.querySelectorAll('.calendar-day');
			calendarRippleIn(days);
		}
	});
</script>

<div class="calendar">
	<div class="calendar-header">
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button class="nav-btn" onclick={onPrevMonth} disabled={isLoading}>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M15 18l-6-6 6-6" />
			</svg>
		</button>
		<span class="month-year">
			{MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
			{#if isLoading}<span class="loading-indicator"></span>{/if}
		</span>
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button class="nav-btn" onclick={onNextMonth} disabled={isLoading}>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M9 18l6-6-6-6" />
			</svg>
		</button>
	</div>

	<div class="week-days">
		{#each WEEK_DAYS as day}<div class="week-day">{day}</div>{/each}
	</div>

	<div class="calendar-grid" bind:this={gridElement}>
		{#each calendarDays as day}
			<button
				class="calendar-day"
				class:disabled={isDisabled(day)}
				class:selected={selectedDate === day.fullDate}
				class:today={day.isToday}
				class:has-availability={hasAvailability(day) && !day.isPast && !day.isWeekend}
				onclick={() => onDateSelect(day)}
				disabled={isDisabled(day)}
			>
				{day.date}
				{#if hasAvailability(day) && day.isCurrentMonth && !day.isPast && !day.isWeekend}
					<span class="availability-dot"></span>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	@keyframes spin { to { transform: rotate(360deg); } }
	.calendar { flex: 0 0 auto; }
	.calendar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
	.nav-btn { width: 36px; height: 36px; border: none; background: transparent; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #475569; transition: all 0.2s ease; }
	.nav-btn:hover:not(:disabled) { background: #f0f4ff; }
	.nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }
	.month-year { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; color: #1a1a2e; display: flex; align-items: center; gap: 8px; }
	.loading-indicator { width: 16px; height: 16px; border: 2px solid #e2e8f0; border-top-color: #667eea; border-radius: 50%; animation: spin 0.8s linear infinite; }
	.week-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 8px; }
	.week-day { text-align: center; font-size: 12px; font-weight: 600; color: #94a3b8; padding: 8px 0; text-transform: uppercase; letter-spacing: 0.5px; }
	.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
	.calendar-day { width: 44px; height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 14px; font-weight: 500; color: #1a1a2e; background: transparent; border: none; border-radius: 12px; cursor: pointer; transition: all 0.2s ease; position: relative; }
	.calendar-day:hover:not(.disabled) { background: #667eea; color: white; transform: scale(1.08); }
	.calendar-day.disabled { color: #cbd5e1; cursor: not-allowed; }
	.calendar-day.today { border: 2px solid #667eea; font-weight: 600; }
	.calendar-day.selected { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 600; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); }
	.calendar-day.has-availability:not(.disabled) { color: #1a1a2e; font-weight: 600; }
	.availability-dot { position: absolute; bottom: 4px; width: 4px; height: 4px; background: #10b981; border-radius: 50%; }
	.calendar-day.selected .availability-dot, .calendar-day:hover:not(.disabled) .availability-dot { background: white; }
</style>