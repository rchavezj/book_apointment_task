<script lang="ts">
	import './page.css';
	import { onMount } from 'svelte';
	import { ACME_REP } from '$lib/types/constants';
	import type { CalendarDay } from '$lib/types/CalendarDay';
	import RepCard from '$lib/components/RepCard.svelte';
	import Calendar from '$lib/components/Calendar.svelte';
	import TimeSlots from '$lib/components/TimeSlots.svelte';
	import BookingForm from '$lib/components/BookingForm.svelte';
	import Confirmation from '$lib/components/Confirmation.svelte';
	import BackgroundScene from '$lib/components/BackgroundScene.svelte';
	import ConfirmationScene from '$lib/components/ConfirmationScene.svelte';
	import { createBookingState, today } from '$lib/stores/booking.svelte';
	import { getAvailability, scheduleMeeting } from '$lib/client/CalendarAPI';
	import {
		generateCalendarDays,
		formatSelectedDate,
		getMonthDateRange,
		parseAvailabilityToSlots,
		getDatesWithAvailability
	} from '$lib/utils/utils';

	export const ssr = false;
	
	const booking = createBookingState();

	const formattedDate = $derived(formatSelectedDate(booking.selectedDate));
	const calendarDays = $derived(generateCalendarDays(booking.currentMonth, today));
	const datesWithAvailability = $derived(getDatesWithAvailability(booking.availability));

	// Check if running in browser (for Three.js)
	let isBrowser = $state(false);

	onMount(() => {
		isBrowser = true;
		fetchMonthAvailability();
	});

	async function fetchMonthAvailability() {
		booking.isLoadingSlots = true;
		booking.error = null;
		try {
			const { start, end } = getMonthDateRange(booking.currentMonth);
			const slots = await getAvailability(start, end);
			booking.availability = slots;
		} catch (err) {
			booking.error = err instanceof Error ? err.message : 'Failed to load availability';
			console.error('Failed to fetch availability:', err);
		} finally {
			booking.isLoadingSlots = false;
		}
	}

	function updateAvailableSlots() {
		if (booking.selectedDate && booking.availability.length > 0) {
			const slots = parseAvailabilityToSlots(
				booking.availability,
				booking.selectedDate,
				ACME_REP.meetingDuration
			);
			booking.availableSlots = slots;
		} else {
			booking.availableSlots = [];
		}
	}

	$effect(() => {
		if (booking.selectedDate) {
			updateAvailableSlots();
		}
	});

	$effect(() => {
		booking.currentMonth;
		if (isBrowser) {
			fetchMonthAvailability();
		}
	});

	function handleDateSelect(day: CalendarDay) {
		if (!day.isCurrentMonth || day.isPast || day.isWeekend || !day.fullDate) return;
		if (!datesWithAvailability.has(day.fullDate)) return;
		booking.selectedDate = day.fullDate;
		booking.resetTimeSelection();
	}

	function handleTimeSelect(slot: { display: string; startISO: string; endISO: string }) {
		booking.selectedSlot = slot;
	}

	function handleContinue() {
		if (booking.selectedDate && booking.selectedSlot) {
			booking.step = 'form';
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!booking.selectedSlot) return;

		booking.isSubmitting = true;
		booking.error = null;

		try {
			await scheduleMeeting({
				start: booking.selectedSlot.startISO,
				end: booking.selectedSlot.endISO,
				attendees: [
					{
						email: booking.formData.email,
						name: booking.formData.name
					}
				]
			});
			booking.step = 'confirmed';
		} catch (err) {
			booking.error = err instanceof Error ? err.message : 'Failed to schedule meeting';
			console.error('Failed to schedule meeting:', err);
		} finally {
			booking.isSubmitting = false;
		}
	}

	function handleBack() {
		booking.step = 'calendar';
		booking.error = null;
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="page-wrapper">
	<div class="container">
		<header class="header">
			<div class="logo-section">
				<div class="logo">ACME</div>
				<span class="logo-tagline">Sales Team</span>
			</div>
		</header>

		<div class="main-content">
			<aside class="left-panel">
				{#if isBrowser}
					<BackgroundScene />
				{/if}
				<div class="left-panel-content">
					<RepCard rep={ACME_REP} />
				</div>
			</aside>

			<main class="right-panel">
				{#if booking.error}
					<div class="error-banner">
						<span>{booking.error}</span>
						<button onclick={() => booking.clearError()}>✕</button>
					</div>
				{/if}

				{#if booking.step === 'calendar'}
					<div class="booking-section">
						<h1 class="section-title">Select a Date & Time</h1>
						<p class="section-subtitle">Choose a time that works for you</p>

						<div class="calendar-wrapper">
							<Calendar
								currentMonth={booking.currentMonth}
								{calendarDays}
								selectedDate={booking.selectedDate}
								{datesWithAvailability}
								isLoading={booking.isLoadingSlots}
								onDateSelect={handleDateSelect}
								onPrevMonth={() => booking.prevMonth()}
								onNextMonth={() => booking.nextMonth()}
							/>

							{#if booking.selectedDate}
								<TimeSlots
									availableSlots={booking.availableSlots}
									selectedTime={booking.selectedTime}
									formattedDate={formattedDate}
									isLoading={booking.isLoadingSlots}
									onTimeSelect={handleTimeSelect}
								/>
							{/if}
						</div>

						<button
							class="continue-btn"
							onclick={handleContinue}
							disabled={!booking.selectedDate || !booking.selectedSlot}
						>
							Continue
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</button>
					</div>
				{:else if booking.step === 'form'}
					<BookingForm
						formData={booking.formData}
						{formattedDate}
						selectedTime={booking.selectedTime}
						isSubmitting={booking.isSubmitting}
						onBack={handleBack}
						onSubmit={handleSubmit}
						onUpdateForm={(data) => (booking.formData = data)}
					/>
				{:else if booking.step === 'confirmed'}
					<div class="confirmation-wrapper">
						{#if isBrowser}
							<ConfirmationScene />
						{/if}
						<div class="confirmation-content">
							<Confirmation
								email={booking.formData.email}
								{formattedDate}
								selectedTime={booking.selectedTime}
								rep={ACME_REP}
							/>
						</div>
					</div>
				{/if}
			</main>
		</div>

		<footer class="footer">
			<span>Powered by</span>
			<span class="footer-brand">ChaseLabs</span>
		</footer>
	</div>
</div>

<style>
	.error-banner {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
	}

	.error-banner button {
		background: none;
		border: none;
		color: #dc2626;
		cursor: pointer;
		font-size: 16px;
		padding: 0 4px;
	}

	.left-panel {
		position: relative;
		overflow: hidden;
	}

	.left-panel-content {
		position: relative;
		z-index: 1;
	}

	.confirmation-wrapper {
		position: relative;
		min-height: 400px;
	}

	.confirmation-content {
		position: relative;
		z-index: 1;
	}
</style>