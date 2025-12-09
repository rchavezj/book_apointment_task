export interface FormData {
	name: string;
	email: string;
	company: string;
	notes: string;
}

export type BookingStep = 'calendar' | 'form' | 'confirmed';
