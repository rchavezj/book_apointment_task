const API_BASE = 'https://calendar.meetchase.ai';

export interface AvailabilitySlot {
	start: string; // ISO 8601 format e.g., "2024-03-15T09:00:00+01:00"
	end: string;   // ISO 8601 format e.g., "2024-03-15T11:00:00+01:00"
}

export interface MeetingAttendee {
	email: string;
	name?: string;
}

export interface MeetingRequest {
	start: string;  // ISO 8601 format
	end: string;    // ISO 8601 format
	attendees: MeetingAttendee[];
}

export interface ApiError {
	detail: Array<{
		loc: (string | number)[];
		msg: string;
		type: string;
	}>;
}

/**
 * Fetches available time slots between start and end dates
 * GET /api/availability?start=YYYY-MM-DD&end=YYYY-MM-DD
 */
export async function getAvailability(
	startDate: string,
	endDate: string
): Promise<AvailabilitySlot[]> {
	const params = new URLSearchParams({ start: startDate, end: endDate });
	const response = await fetch(`${API_BASE}/api/availability?${params}`);

	if (!response.ok) {
		if (response.status === 400) {
			throw new Error('Invalid date range: start date must be before end date');
		}
		if (response.status === 422) {
			const error: ApiError = await response.json();
			throw new Error(`Validation error: ${error.detail[0]?.msg || 'Invalid request'}`);
		}
		throw new Error(`Failed to fetch availability: ${response.statusText}`);
	}

    // console.log(response.json());
	return response.json();
}

/**
 * Schedules a meeting if the requested time slot is available
 * POST /api/meetings
 */
export async function scheduleMeeting(meeting: MeetingRequest): Promise<string> {
	const response = await fetch(`${API_BASE}/api/meetings`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(meeting)
	});

	if (!response.ok) {
		if (response.status === 400) {
			throw new Error('The requested meeting time is not available');
		}
		if (response.status === 422) {
			const error: ApiError = await response.json();
			throw new Error(`Validation error: ${error.detail[0]?.msg || 'Invalid request'}`);
		}
		throw new Error(`Failed to schedule meeting: ${response.statusText}`);
	}

    //console.log(response.json());
	return response.json();
}