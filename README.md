# ACME Meeting Booking Page

A modern, visually stunning meeting booking interface built for the ChaseLabs SDR platform. Features an interactive hexagon background, smooth GSAP animations, and Threlte (Svelte + Three.js) effects for a premium user experience.

![Booking Interface](https://github.com/rchavezj/book_apointment_task/blob/main/static/version-2.png)

## 🎯 Overview

This project demonstrates a complete meeting booking flow where prospects can:

1. **Select a Date** — Browse a calendar showing available dates
2. **Choose a Time** — Pick from available 30-minute time slots
3. **Enter Details** — Provide contact information
4. **Confirm Booking** — Receive confirmation with celebratory 3D animations

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | SvelteKit with Svelte 5 (Runes mode) |
| **Language** | TypeScript |
| **3D Graphics** | Threlte (Svelte + Three.js) |
| **Animation** | GSAP |
| **Styling** | Tailwind CSS + Custom CSS |
| **Fonts** | DM Sans + Fraunces (Google Fonts) |
| **Deployment** | Vercel |
| **API** | MeetChase Calendar API |

## 📁 Project Structure

```
src/
├── lib/
│   ├── api/
│   │   └── CalendarAPI.ts           # API client for MeetChase endpoints
│   │
│   ├── components/
│   │   ├── BookingForm.svelte       # User details form
│   │   ├── Calendar.svelte          # Interactive date picker (GSAP ripple)
│   │   ├── Confirmation.svelte      # Success screen (GSAP checkmark draw)
│   │   ├── RepCard.svelte           # Sales rep info card
│   │   ├── TimeSlots.svelte         # Time slot selector (GSAP stagger)
│   │   ├── MagneticButton.svelte    # Button with magnetic hover effect
│   │   │
│   │   ├── BackgroundScene.svelte   # Threlte floating orbs (3D)
│   │   ├── ConfirmationScene.svelte # Threlte confetti burst (3D)
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
│   │   └── types.ts                 # Shared type definitions
│   │
│   └── utils/
│       ├── utils.ts                 # Date formatting, slot parsing
│       └── animations.ts            # GSAP animation utilities
│
├── routes/
│   ├── +layout.svelte               # Root layout with HexagonField
│   ├── +page.svelte                 # Main booking page
│   ├── layout.css                   # Layout styles (Tailwind imports)
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

### Threlte 3D Effects

The app uses [Threlte](https://threlte.xyz/) — a Svelte-native Three.js wrapper that provides:

- **SSR Safety** — No manual browser guards needed
- **Declarative Syntax** — Write 3D scenes like Svelte components
- **Automatic Cleanup** — Memory management handled automatically
- **Svelte Reactivity** — 3D objects respond to state changes

#### BackgroundScene.svelte

Floating gradient orbs with ambient particles:

```svelte
<Canvas>
  <T.PerspectiveCamera makeDefault position={[0, 0, 30]} fov={75} />
  
  {#each orbs as orb}
    <Float speed={orb.floatSpeed} floatIntensity={orb.floatIntensity}>
      <T.Mesh position={orb.position}>
        <T.IcosahedronGeometry args={[orb.size, 1]} />
        <T.MeshBasicMaterial color={orb.color} transparent opacity={orb.opacity} />
      </T.Mesh>
    </Float>
  {/each}
  
  <T.Points><!-- Ambient particles --></T.Points>
</Canvas>
```

#### ConfirmationScene.svelte

Celebratory confetti burst with physics:

- 80 confetti particles (boxes, tetrahedrons, octahedrons, planes)
- Gravity and air resistance simulation
- Fade-out over particle lifetime
- Twinkling sparkle particles

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

## 🔌 API Integration

The application integrates with the MeetChase Calendar API (`calendar.meetchase.ai`):

### GET `/api/availability`

Fetches available time slots for a date range.

```typescript
const slots = await getAvailability('2025-01-01', '2025-01-31');
```

**Response:**
```json
[
  {
    "start": "2025-01-15T09:00:00+01:00",
    "end": "2025-01-15T11:00:00+01:00"
  }
]
```

### POST `/api/meetings`

Schedules a meeting if the requested time slot is available.

```typescript
await scheduleMeeting({
  start: "2025-01-15T10:00:00+01:00",
  end: "2025-01-15T10:30:00+01:00",
  attendees: [{ email: "john@example.com", name: "John Doe" }]
});
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

# Install required packages
bun add gsap three @threlte/core @threlte/extras
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

Edit `src/lib/api/CalendarAPI.ts`:

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

### 3D Scene Colors

Edit the color arrays in `BackgroundScene.svelte` and `ConfirmationScene.svelte`:

```typescript
const colors = [0x667eea, 0x764ba2, 0x8b5cf6, 0x6366f1, 0xa78bfa];
```

## 🎨 Styling

The app uses a refined, professional aesthetic with:

- **Primary gradient:** `#667eea` → `#764ba2` (purple)
- **Accent colors:** `#F6AD55` (orange), `#F5F3FF` (light purple)
- **Typography:** Fraunces (headings) + DM Sans (body)
- **Animations:** GSAP-powered micro-interactions + Threlte 3D
- **Responsive:** Mobile-friendly with breakpoint at 900px

### Tailwind Integration

The project uses Tailwind CSS v4 with plugins:

```css
/* layout.css */
@import 'tailwindcss';
@plugin '@tailwindcss/forms';
@plugin '@tailwindcss/typography';
```

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
│  │  getAvailability(start, end)  ←── CalendarAPI.ts       │ │
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
│  │          │  │          │  │          │  │ [Threlte]  │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘ │
│       ↑              ↑             ↓                       │
│       └──────────────┴─────────────┘                       │
│              booking.svelte.ts (state)                     │
└─────────────────────────────────────────────────────────────┘
```

## 🧪 Testing

```bash
# Run unit tests
bun run test

# Run e2e tests
bun run test:e2e
```

### Test File

```typescript
// page.svelte.spec.ts
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
  it('should render h1', async () => {
    render(Page);
    const heading = page.getByRole('heading', { level: 1 });
    await expect.element(heading).toBeInTheDocument();
  });
});
```

## 📦 Dependencies

### Production

| Package | Purpose |
|---------|---------|
| `svelte` / `@sveltejs/kit` | Framework |
| `gsap` | Animation library |
| `three` | 3D graphics engine |
| `@threlte/core` | Svelte Three.js wrapper |
| `@threlte/extras` | Threlte utilities (Float, etc.) |

### Development

| Package | Purpose |
|---------|---------|
| `typescript` | Type safety |
| `@types/three` | Three.js types |
| `vite` | Build tool |
| `tailwindcss` | Utility CSS |
| `vitest` | Testing |

## 🚧 Deployment Notes

### Vercel

The app deploys seamlessly to Vercel. If you encounter issues:

1. **Paraglide i18n error:** If you see `project.inlang/settings.json` error, either create the config or remove `@inlang/paraglide-sveltekit` from `vite.config.ts`

2. **SSR with Three.js:** The Threlte components are SSR-safe, but if you add custom Three.js code, wrap it with:
   ```svelte
   <script>
     import { browser } from '$app/environment';
   </script>
   
   {#if browser}
     <!-- Three.js content -->
   {/if}
   ```

## 📄 License

This project was created as part of the ChaseLabs Design Engineer Assessment.

---

Built with ❤️ using SvelteKit, Threlte, GSAP, and the MeetChase API
