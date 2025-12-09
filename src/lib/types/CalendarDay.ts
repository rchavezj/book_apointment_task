
export interface CalendarDay {
	date: number;
	isCurrentMonth: boolean;
	isPast: boolean;
	isWeekend?: boolean;
	fullDate?: string;
	isToday?: boolean;
}
