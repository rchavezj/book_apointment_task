import type { RepInfo } from './types';

export const ACME_REP: RepInfo = {
	name: 'Sarah Chen',
	title: 'Account Executive',
	avatar: 'SC',
	email: 'sarah.chen@acme.io',
	meetingDuration: 30
};

export const TIME_SLOTS = [
	'9:00 AM',
	'9:30 AM',
	'10:00 AM',
	'10:30 AM',
	'11:00 AM',
	'11:30 AM',
	'1:00 PM',
	'1:30 PM',
	'2:00 PM',
	'2:30 PM',
	'3:00 PM',
	'3:30 PM',
	'4:00 PM',
	'4:30 PM'
];

export const UNAVAILABLE_SLOTS: Record<string, string[]> = {
	'2025-01-15': ['9:00 AM', '10:30 AM', '2:00 PM'],
	'2025-01-16': ['11:00 AM', '1:30 PM', '3:00 PM', '3:30 PM'],
	'2025-01-17': ['9:30 AM', '10:00 AM', '4:00 PM']
};

export const MONTH_NAMES = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

export const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
