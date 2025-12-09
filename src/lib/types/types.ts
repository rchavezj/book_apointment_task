export interface RepInfo {
	name: string;
	title: string;
	avatar: string;
	email: string;
	meetingDuration: number;
}

export interface CalendarDay {
	date: number;
	isCurrentMonth: boolean;
	isPast: boolean;
	isWeekend?: boolean;
	fullDate?: string;
	isToday?: boolean;
}

export interface FormData {
	name: string;
	email: string;
	company: string;
	notes: string;
}

export type BookingStep = 'calendar' | 'form' | 'confirmed';
