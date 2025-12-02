# A. Title

Gordon College YoFinder — Lost & Found Platform (Dashboard + Admin)


# B. Introduction

YoFinder is a modern, full‑stack web application designed to streamline lost‑and‑found workflows for Gordon College. It enables students to report lost or found items, receive notifications, converse with potential match owners, and track the status of submissions. Admin users moderate items, manage approvals, and view platform analytics.

The application emphasizes speed, accessibility, and reliability, with a responsive UI, real‑time notifications, and server‑side persistence of user preferences. It is built on Next.js 15 (App Router) and leverages a clean separation between client components, server handlers, and API routes.


# C. Statement of the Problem

Traditional lost‑and‑found processes are manual, slow, and error‑prone. Students often have no centralized way to:
- Report and browse items efficiently
- Receive timely notifications about potential matches
- Communicate with other users in a safe, structured environment

Administrators likewise face friction moderating submissions, maintaining data quality, and understanding platform trends. YoFinder addresses these pain points through a unified, responsive platform with auditable flows and robust moderation tools.


# D. Methodology and System Design

YoFinder follows a layered architecture that separates concerns and enables rapid iteration.

- Client UI
  - Student dashboard: `component/dashboard/...`
  - Admin dashboard: `component/admin/...`
  - Shared clients: `clients/DashboardClient.tsx`, `clients/AdminClient.tsx`
  - Styling: Tailwind utility classes, lucide‑react icons, framer‑motion for micro‑interactions
  - Charts: `recharts` for bar/pie charts in admin analytics

- State and Preferences
  - Local UI state in React function components
  - Global language via `contexts/TranslationProvider.tsx`
  - User preferences persisted both client‑side (localStorage) and server‑side (MongoDB)

- Server/API
  - Next.js App Router API routes under `app/api/...`
  - Business logic in `server/handlers/...` (e.g., `DashboardHandlers.ts`)
  - Data models in `server/models/...` (e.g., `UserSchema.ts`)
  - Access control via `getUserFromRequest` in `services/Access`

- Notifications
  - User header dropdown with unread badge and "Mark all as read" action
  - Client filters respect user notification preferences (match/message) and update instantly
  - Event bridge uses lightweight `CustomEvent` dispatch/listen to sync unread counts and filters

- Responsiveness
  - Mobile‑first adjustments for headers, dropdowns, tables, filters, and cards
  - Admin sidebar behaves like the user dashboard: fixed on desktop, drawer overlay on mobile, sign‑out placed structurally at bottom

- Persistence Model
  - `preferences` embedded in user document (`server/models/UserSchema.ts`)
  - API endpoint `/api/dashboard/settings` (GET/POST) reads/writes preferences atomically


# E. Implementation Details and Technical Challenges

- Preferences Schema
  - `UserSchema.preferences` stores:
    - `notifications`: `{ email, match, message }`
    - `privacy`: `{ profileVisibility, showEmail, showContactInfo }`
    - `display`: `{ theme, textSize, reduceMotion }`
    - `language`: `'en' | 'fil'`
  - Defaults chosen to be safe and accessible, with server‑side normalization

- Settings API
  - `GET /api/dashboard/settings` returns the normalized preferences for the authenticated user
  - `POST /api/dashboard/settings` accepts partial updates and applies `$set` on nested paths
  - Handlers: `getUserSettingsByID` and `updateUserSettingsByID` in `server/handlers/DashboardHandlers.ts`

- Client Wiring
  - Settings page loads preferences on mount from server, mirrors to localStorage, and applies UI effects (theme, font size, reduce motion)
  - Each toggle/select calls the settings API to persist immediately
  - Dashboard notifications read local preferences and re‑filter lists live on change

- Notifications UX
  - Header dropdown has a "Mark all as read" action calling `/api/notifications` PUT, then dispatches an `unreadCountUpdate`
  - Preferences changes dispatch a `notificationPreferencesChanged` event; clients refresh visible notifications accordingly

- Responsive Adjustments
  - Notifications dropdown: fixed full‑width on small screens with increased scroll area
  - My Items: stacked filters and responsive grid; image preview scaled for mobile
  - Settings: stacked forms and full‑width actions on mobile
  - Admin: header dropdowns responsive; pages (Activity, All, Active) have stacked headers and full‑width actions; sidebar transforms to a mobile drawer; recent items table becomes horizontally scrollable on phones

- Technical Challenges and Resolutions
  - Balancing local vs. server persistence: mirrored writes ensure immediate UX while maintaining roaming preferences across devices
  - Table overflow on small screens: enforced minimum widths in tables and added horizontal scroll wrappers
  - Sidebar placement and sign‑out UX: used flex column containers with `mt-auto` rather than absolute positioning, keeping the footer action anchored properly
  - Keeping UI responsive without layout shifts: guarded desktop margins with `md:ml-64` and mobile drawers that do not push content


# F. Conclusion and Future Recommendations

YoFinder delivers a cohesive lost‑and‑found experience with responsive UIs, real‑time notifications, and synchronized user preferences. The admin area provides moderation tools and analytics to keep the platform healthy.

Recommended next steps:
- Add automated tests (unit, integration, and E2E) covering preferences, notifications, and admin flows
- Introduce a typed, unified event layer for notifications (e.g., WebSocket/SSE) with graceful fallbacks
- Expand accessibility auditing: focus management for drawers/modals, ARIA labeling for charts
- Implement role‑based policy checks on more endpoints and add audit logs for moderator actions
- Enhance analytics: time‑series dashboards, per‑category heatmaps, and export formats
- Performance tuning: bundle analysis, code splitting for heavy pages, and image optimizations for item cards

YoFinder is positioned to grow with the needs of Gordon College, offering a scalable foundation and a user‑first experience.
