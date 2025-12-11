# ACME Meeting Booking Page

A modern, visually stunning meeting booking interface built for the ChaseLabs SDR platform. Features an interactive hexagon background, smooth GSAP animations, and Three.js effects for a premium user experience.

![Booking Interface](preview.png)

## 🎯 Overview

This project demonstrates a complete meeting booking flow where prospects can:

1. **Select a Date** — Browse a calendar showing available dates
2. **Choose a Time** — Pick from available 30-minute time slots
3. **Enter Details** — Provide contact information
4. **Confirm Booking** — Receive confirmation with celebratory animations

## 🛠 Tech Stack

- **Framework:** SvelteKit with Svelte 5 (Runes mode)
- **Language:** TypeScript
- **Animation:** GSAP + Three.js
- **Styling:** CSS with custom properties
- **Fonts:** DM Sans + Fraunces (Google Fonts)
- **Deployment:** Vercel
- **API:** MeetChase Calendar API (`calendar.meetchase.ai`)

## 📁 Project Structure

```
src/
├── lib/
│   ├── api/
│   │   └── calendar.ts              # API client for MeetChase endpoints
│   │
│   ├── components/
│   │   ├── BookingForm.svelte       # User details form
│   │   ├── Calendar.svelte          # Interactive date picker (GSAP ripple)
│   │   ├── Confirmation.svelte      # Success screen (GSAP checkmark draw)
│   │   ├── RepCard.svelte           # Sales rep info card
│   │   ├── TimeSlots.svelte         # Time slot selector (GSAP stagger)
│   │   ├── MagneticButton.svelte    # Button with magnetic hover effect
│   │   ├── BackgroundScene.svelte   # Three.js floating orbs
│   │   ├── ConfirmationScene.svelte # Three.js confetti burst
│   │   │
│   │   └── HexagonField/            # Interactive hexagon background
│   │       ├── HexagonField.svelte  # Main component wrapper
│   │       ├── engine.ts            # Canvas rendering engine
│   │       └── type.ts              # TypeScript definitions
│   │
│   ├── stores/
│   │   └── booking.svelte.ts        # Centralized state (Svelte 5 runes)
│   │
│   ├── types/
│   │   ├── CalendarDay.ts           # Calendar day interface
│   │   ├── constants.ts             # App constants (rep info, config)
│   │   ├── FormInfo.ts              # Form data types
│   │   ├── RepInfo.ts               # Sales rep interface
│   │
│   └── utils/
│       ├── utils.ts                 # Date formatting, slot parsing
│       └── animations.ts            # GSAP animation utilities
│
├── routes/
│   ├── +layout.svelte               # Root layout with HexagonField
│   ├── +page.svelte                 # Main booking page
│   ├── layout.css                   # Layout styles
│   └── page.css                     # Page-specific styles
│
└── app.html                         # HTML template
```

## ✨ Visual Features

### HexagonField Background

An interactive canvas-based hexagon grid that responds to mouse movement:

```svelte
<HexagonField
  rows={39}
  columns={32}
  baseScale={1}
  minScale={0.12}
  animateJiggle={true}
  jiggleDurationSec={2}
  fullScreenFixed={true}
  mouseRadiusDivisor={4}
  colorTransitionSec={1.2}
  colorEase="power2.inOut"
  jiggleEase="power1.inOut"
  jiggleScaleRange={[0.65, 0.85]}
  colors={['#667eea', '#764ba2', '#F6AD55', '#F5F3FF']}
>
  {@render children()}
</HexagonField>
```

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `number` | Number of hexagon columns |
| `rows` | `number` | Number of hexagon rows |
| `baseScale` | `number` | Default hexagon scale |
| `minScale` | `number` | Minimum scale when mouse hovers |
| `mouseRadiusDivisor` | `number` | Mouse influence area (viewport / divisor) |
| `colors` | `string[]` | Array of fill colors |
| `animateJiggle` | `boolean` | Enable breathing animation |
| `jiggleDurationSec` | `number` | Jiggle animation duration |
| `jiggleScaleRange` | `[number, number]` | Scale range for jiggle |
| `jiggleEase` | `string` | GSAP easing for jiggle |
| `jiggleRecolor` | `boolean` | Randomize colors on jiggle repeat |
| `colorTransitionSec` | `number` | Color transition duration |
| `colorEase` | `string` | GSAP easing for color transitions |
| `fullScreenFixed` | `boolean` | Fixed fullscreen positioning |

### GSAP Animations

Located in `src/lib/utils/animations.ts`:

| Function | Used In | Effect |
|----------|---------|--------|
| `staggerFadeIn()` | TimeSlots, Confirmation | Items cascade in with delay |
| `calendarRippleIn()` | Calendar | Days ripple from center on month change |
| `createMagneticButton()` | MagneticButton | Button follows cursor on hover |
| `buttonClickEffect()` | MagneticButton | Squish effect on click |
| `drawCheckmark()` | Confirmation | SVG draws itself on success |
| `celebrationBurst()` | Confirmation | DOM particle burst |
| `shakeAnimation()` | Error states | Shake effect for errors |
| `fieldFocusAnimation()` | Form inputs | Glow effect on focus |

### Three.js Effects

| Component | Effect |
|-----------|--------|
| `BackgroundScene.svelte` | Floating purple gradient orbs with particles |
| `ConfirmationScene.svelte` | 3D confetti burst on booking success |

Features:
- Respects `prefers-reduced-motion`
- WebGL fallback for unsupported browsers
- Proper memory cleanup on destroy
- HiDPI/Retina support

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
| `formatSelectedDate()` | Formats date for display |
| `formatDateForApi()` | Formats date as `YYYY-MM-DD` |
| `getMonthDateRange()` | Gets first/last day of month for API calls |
| `parseAvailabilityToSlots()` | Converts API availability to 30-min time slots |
| `getDatesWithAvailability()` | Returns Set of dates that have available slots |

### HexagonField Engine (`engine.ts`)

The hexagon background uses a custom canvas rendering engine:

```typescript
const engine = createHexFieldEngine(options);

engine.attach(canvasElement);  // Bind to canvas
engine.start();                // Start animation loop
engine.updateOptions({...});   // Update options reactively
engine.stop();                 // Pause animation
engine.destroy();              // Full cleanup
```

**Key Features:**
- GSAP-powered animations for smooth scaling and color transitions
- Mouse-reactive hexagon scaling based on proximity
- Per-shape "jiggle" breathing animation with random desync
- Dynamic color palette with animated transitions
- HiDPI canvas rendering
- Automatic resize handling

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

# Install animation libraries
bun add gsap three
bun add -d @types/three

# Start development server
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Building for Production

```bash
bun run build
bun run preview
```

## 📝 Configuration

### Sales Rep Configuration

Edit `src/lib/types/constants.ts`:

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

Edit `src/lib/api/calendar.ts`:

```typescript
const API_BASE = 'https://calendar.meetchase.ai';
```

### HexagonField Theme

Edit `src/routes/+layout.svelte`:

```svelte
<HexagonField
  colors={['#667eea', '#764ba2', '#F6AD55', '#F5F3FF']}
  <!-- ... other props -->
>
```

## 🎨 Styling

The app uses a refined, professional aesthetic with:

- **Primary gradient:** `#667eea` → `#764ba2` (purple)
- **Accent colors:** `#F6AD55` (orange), `#F5F3FF` (light purple)
- **Typography:** Fraunces (headings) + DM Sans (body)
- **Animations:** GSAP-powered micro-interactions
- **Responsive:** Mobile-friendly with breakpoint at 900px

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
│                      +layout.svelte                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              HexagonField (background)                 │ │
│  │  - Canvas rendering via engine.ts                      │ │
│  │  - GSAP ticker for smooth 60fps animation              │ │
│  │  - Mouse-reactive hexagon scaling                      │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                 │
│                    +page.svelte                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  onMount / month change                                │ │
│  │         ↓                                              │ │
│  │  getAvailability(start, end)  ←── calendar.ts API      │ │
│  │         ↓                                              │ │
│  │  booking.availability = response                       │ │
│  │         ↓                                              │ │
│  │  parseAvailabilityToSlots()   ←── utils.ts             │ │
│  │         ↓                                              │ │
│  │  booking.availableSlots = slots                        │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ↓                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │ Calendar │→ │TimeSlots │→ │  Form    │→ │Confirmation│ │
│  │ (ripple) │  │(stagger) │  │          │  │(confetti)  │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘ │
│       ↑              ↑             ↓                       │
│       └──────────────┴─────────────┘                       │
│              booking.svelte.ts (state)                     │
└─────────────────────────────────────────────────────────────┘
```

## 🧪 Testing

```bash
# Run tests
bun run test

# Run e2e tests
bun run test:e2e
```

## 📦 Dependencies

### Production
- `svelte` / `@sveltejs/kit` — Framework
- `gsap` — Animation library
- `three` — 3D graphics (optional effects)

### Development
- `typescript` — Type safety
- `@types/three` — Three.js types
- `vite` — Build tool

## 🚧 Known Issues

- **Paraglide i18n:** If deploying to Vercel and encountering `project.inlang/settings.json` error, either create the config or remove `@inlang/paraglide-sveltekit` from `vite.config.ts`

## 📄 License

This project was created as part of the ChaseLabs Design Engineer Assessment.

---

Built with ❤️ using SvelteKit, GSAP, Three.js, and the MeetChase API