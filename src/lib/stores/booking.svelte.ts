import type { TimeSlot } from '$lib/utils/utils';
import type { AvailabilitySlot } from '$lib/client/CalendarAPI';
import type { BookingStep, FormData } from '$lib/types/FormInfo';

export const today = new Date();

export function createBookingState() {
	let currentMonth = $state(new Date());
	let selectedDate = $state<string | null>(null);
	let selectedSlot = $state<TimeSlot | null>(null);
	let step = $state<BookingStep>('calendar');
	let isSubmitting = $state(false);
	let isLoadingSlots = $state(false);
	let availability = $state<AvailabilitySlot[]>([]);
	let availableSlots = $state<TimeSlot[]>([]);
	let error = $state<string | null>(null);
	let formData = $state<FormData>({
		name: '',
		email: '',
		company: '',
		notes: ''
	});

	return {
		get currentMonth() { return currentMonth; },
		set currentMonth(value: Date) { currentMonth = value; },
		
		get selectedDate() { return selectedDate; },
		set selectedDate(value: string | null) { selectedDate = value; },
		
		get selectedSlot() { return selectedSlot; },
		set selectedSlot(value: TimeSlot | null) { selectedSlot = value; },
		
		// Keep selectedTime for backward compatibility with UI
		get selectedTime() { return selectedSlot?.display ?? null; },
		
		get step() { return step; },
		set step(value: BookingStep) { step = value; },
		
		get isSubmitting() { return isSubmitting; },
		set isSubmitting(value: boolean) { isSubmitting = value; },
		
		get isLoadingSlots() { return isLoadingSlots; },
		set isLoadingSlots(value: boolean) { isLoadingSlots = value; },
		
		get availability() { return availability; },
		set availability(value: AvailabilitySlot[]) { availability = value; },
		
		get availableSlots() { return availableSlots; },
		set availableSlots(value: TimeSlot[]) { availableSlots = value; },
		
		get error() { return error; },
		set error(value: string | null) { error = value; },
		
		get formData() { return formData; },
		set formData(value: FormData) { formData = value; },

		prevMonth() {
			currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
		},
		nextMonth() {
			currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
		},
		resetTimeSelection() {
			selectedSlot = null;
		},
		clearError() {
			error = null;
		}
	};
}