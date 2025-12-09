# ACME Meeting Booking Page

A modern, responsive meeting booking interface built for the ChaseLabs SDR platform. This application allows prospects to easily schedule meetings with sales representatives, reducing back-and-forth communication and accelerating the sales process.

## 🎯 Overview

This project demonstrates a complete meeting booking flow where prospects can:

1. **Select a Date** — Browse a calendar showing available dates
2. **Choose a Time** — Pick from available 30-minute time slots
3. **Enter Details** — Provide contact information
4. **Confirm Booking** — Receive confirmation with calendar integration options

## 🛠 Tech Stack

- **Framework:** SvelteKit with Svelte 5 (Runes mode)
- **Language:** TypeScript
- **Styling:** CSS with custom properties
- **Fonts:** DM Sans + Fraunces (Google Fonts)
- **Deployment:** Vercel
- **API:** MeetChase Calendar API (`calendar.meetchase.ai`)

## 📁 Project Structure

```
src/
├── lib/
│   ├── api/
│   │   └── calendar.ts          # API client for MeetChase endpoints
│   │
│   ├── components/
│   │   ├── BookingForm.svelte   # User details form (name, email, company)
│   │   ├── Calendar.svelte      # Interactive date picker
│   │   ├── Confirmation.svelte  # Success screen with calendar links
│   │   ├── RepCard.svelte       # Sales rep info card
│   │   └── TimeSlots.svelte     # Available time slot selector
│   │
│   ├── stores/
│   │   └── booking.svelte.ts    # Centralized state management (Svelte 5 runes)
│   │
│   ├── types/
│   │   ├── CalendarDay.ts       # Calendar day interface
│   │   ├── constants.ts         # App constants (rep info, config)
│   │   ├── FormInfo.ts          # Form data types
│   │   ├── RepInfo.ts           # Sales rep interface
│   │   └── types.ts             # Shared type definitions
│   │
│   └── utils/
│       └── utils.ts             # Helper functions (date formatting, slot parsing)
│
├── routes/
│   ├── +layout.svelte           # Root layout
│   ├── +page.svelte             # Main booking page
│   └── page.css                 # Page-specific styles
│
└── app.html                     # HTML template
```

## 🔌 API Integration

The application integrates with the MeetChase Calendar API:

### GET `/api/availability`

Fetches available time slots for a date range.

**Parameters:**
- `start` (string): Start date in `YYYY-MM-DD` format
- `end` (string): End date in `YYYY-MM-DD` format

**Response:**
```json
[
  {
    "start": "2024-03-15T09:00:00+01:00",
    "end": "2024-03-15T11:00:00+01:00"
  },
  {
    "start": "2024-03-15T13:15:00+01:00",
    "end": "2024-03-15T17:00:00+01:00"
  }
]
```

### POST `/api/meetings`

Schedules a meeting if the requested time slot is available.

**Request Body:**
```json
{
  "start": "2024-03-15T10:00:00+01:00",
  "end": "2024-03-15T11:00:00+01:00",
  "attendees": [
    {
      "email": "john.doe@example.com",
      "name": "John Doe"
    }
  ]
}
```

**Response:** `201 Created` with confirmation string

## 🧩 Key Components

### `booking.svelte.ts` (State Store)

Centralized state using Svelte 5 runes:

```typescript
const booking = createBookingState();

// State properties
booking.currentMonth      // Current calendar month
booking.selectedDate      // Selected date (YYYY-MM-DD)
booking.selectedSlot      // Selected time slot with ISO timestamps
booking.selectedTime      // Display time (e.g., "9:00 AM")
booking.step              // Current step: 'calendar' | 'form' | 'confirmed'
booking.availability      // Raw API availability data
booking.availableSlots    // Parsed time slots for selected date
booking.isSubmitting      // Form submission state
booking.isLoadingSlots    // API loading state
booking.error             // Error message
booking.formData          // User form data

// Methods
booking.prevMonth()       // Navigate to previous month
booking.nextMonth()       // Navigate to next month
booking.resetTimeSelection()
booking.clearError()
```

### `utils.ts` (Helper Functions)

| Function | Description |
|----------|-------------|
| `generateCalendarDays()` | Creates calendar grid with day metadata |
| `formatSelectedDate()` | Formats date for display (e.g., "Monday, March 15, 2024") |
| `formatDateForApi()` | Formats date as `YYYY-MM-DD` |
| `getMonthDateRange()` | Gets first/last day of month for API calls |
| `parseAvailabilityToSlots()` | Converts API availability to 30-min time slots |
| `getDatesWithAvailability()` | Returns Set of dates that have available slots |

### `calendar.ts` (API Client)

| Function | Description |
|----------|-------------|
| `getAvailability(start, end)` | Fetches available slots from API |
| `scheduleMeeting(meeting)` | Books a meeting via API |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd book_appointment_task

# Install dependencies
bun install
# or: npm install

# Start development server
bun run dev
# or: npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Building for Production

```bash
bun run build
bun run preview
```

## 📝 Configuration

### Sales Rep Configuration

Edit `src/lib/types/constants.ts` to customize the sales rep:

```typescript
export const ACME_REP: RepInfo = {
  name: 'Sarah Chen',
  title: 'Account Executive',
  avatar: 'SC',
  email: 'sarah.chen@acme.io',
  meetingDuration: 30  // minutes
};
```

### API Base URL

Edit `src/lib/api/calendar.ts` to change the API endpoint:

```typescript
const API_BASE = 'https://calendar.meetchase.ai';
```

## 🎨 Styling

The app uses a refined, professional aesthetic with:

- **Primary gradient:** `#667eea` → `#764ba2` (purple)
- **Typography:** Fraunces (headings) + DM Sans (body)
- **Animations:** Subtle slide-in and fade effects
- **Responsive:** Mobile-friendly with breakpoint at 900px

Custom CSS variables can be added to `page.css` for theming.

## 📱 Responsive Design

The layout adapts to different screen sizes:

- **Desktop (>900px):** Side-by-side layout with rep card on left
- **Mobile (<900px):** Stacked layout with rep card on top

## ⚠️ Error Handling

The application handles various error states:

- **API fetch failures:** Shows error banner with dismiss button
- **No availability:** Displays "No available times" message
- **Booking conflicts:** Shows error if slot becomes unavailable
- **Validation errors:** Displays API validation messages

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        +page.svelte                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  onMount / month change                              │   │
│  │         ↓                                            │   │
│  │  getAvailability(start, end)  ←── calendar.ts API   │   │
│  │         ↓                                            │   │
│  │  booking.availability = response                     │   │
│  │         ↓                                            │   │
│  │  parseAvailabilityToSlots()   ←── utils.ts          │   │
│  │         ↓                                            │   │
│  │  booking.availableSlots = slots                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Calendar │→ │TimeSlots │→ │  Form    │→ │Confirmation│  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────┘  │
│       ↑              ↑             ↓                        │
│       └──────────────┴─────────────┘                        │
│              booking.svelte.ts (state)                      │
└─────────────────────────────────────────────────────────────┘
```

## 🧪 Testing

```bash
# Run tests
bun run test

# Run e2e tests
bun run test:e2e
```

## 📄 License

This project was created as part of the ChaseLabs Design Engineer Assessment.

---

Built with ❤️ using SvelteKit and the MeetChase API
