import type { CalendarDay } from '$lib/types/CalendarDay';
import type { AvailabilitySlot } from '$lib/api/calendar';

export function generateCalendarDays(currentMonth: Date, today: Date): CalendarDay[] {
	const year = currentMonth.getFullYear();
	const month = currentMonth.getMonth();
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const startPadding = firstDay.getDay();
	const days: CalendarDay[] = [];

	const prevMonthLastDay = new Date(year, month, 0).getDate();
	for (let i = startPadding - 1; i >= 0; i--) {
		days.push({ date: prevMonthLastDay - i, isCurrentMonth: false, isPast: true });
	}

	for (let i = 1; i <= lastDay.getDate(); i++) {
		const date = new Date(year, month, i);
		const isPast = date < today;
		const isWeekend = date.getDay() === 0 || date.getDay() === 6;
		days.push({
			date: i,
			isCurrentMonth: true,
			isPast,
			isWeekend,
			fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
			isToday: date.toDateString() === today.toDateString()
		});
	}

	const remaining = 42 - days.length;
	for (let i = 1; i <= remaining; i++) {
		days.push({ date: i, isCurrentMonth: false, isPast: false });
	}

	return days;
}

export function formatSelectedDate(selectedDate: string | null): string {
	if (!selectedDate) return '';
	const date = new Date(selectedDate + 'T12:00:00');
	return date.toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

export function formatDateForApi(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function getMonthDateRange(date: Date): { start: string; end: string } {
	const year = date.getFullYear();
	const month = date.getMonth();
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	return {
		start: formatDateForApi(firstDay),
		end: formatDateForApi(lastDay)
	};
}

export interface TimeSlot {
	display: string;  // e.g., "9:00 AM"
	startISO: string; // Full ISO string for API
	endISO: string;   // Full ISO string for API
}

/**
 * Parses API availability slots into 30-minute time slots for a specific date
 */
export function parseAvailabilityToSlots(
	availability: AvailabilitySlot[],
	selectedDate: string,
	slotDurationMinutes: number = 30
): TimeSlot[] {
	const slots: TimeSlot[] = [];

	for (const slot of availability) {
		const startDate = new Date(slot.start);
		const endDate = new Date(slot.end);
		const slotDateStr = formatDateForApi(startDate);

		// Only process slots for the selected date
		if (slotDateStr !== selectedDate) continue;

		// Generate slots within this availability window
		let current = new Date(startDate);
		while (current < endDate) {
			const slotEnd = new Date(current.getTime() + slotDurationMinutes * 60 * 1000);
			if (slotEnd <= endDate) {
				slots.push({
					display: formatTimeDisplay(current),
					startISO: current.toISOString(),
					endISO: slotEnd.toISOString()
				});
			}
			current = slotEnd;
		}
	}

	return slots.sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());
}

function formatTimeDisplay(date: Date): string {
	return date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

/**
 * Get all dates that have availability
 */
export function getDatesWithAvailability(availability: AvailabilitySlot[]): Set<string> {
	const dates = new Set<string>();
	for (const slot of availability) {
		const date = new Date(slot.start);
		dates.add(formatDateForApi(date));
	}
	return dates;
}