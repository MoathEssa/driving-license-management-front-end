# 🚗 Driving License Management Center — Frontend

A modern, fully-featured **React 19 + TypeScript** single-page application for managing driving licenses. Built with **Redux Toolkit**, **React Router v7**, and **shadcn/ui**, this frontend delivers a polished, accessible, and responsive interface for license operations — from applicant registration and testing to international license issuance.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Application Features](#application-features)
- [Pages & Routes](#pages--routes)
- [Architecture](#architecture)
- [State Management](#state-management)
- [Form Validation](#form-validation)
- [Internationalization](#internationalization)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)

---

## Overview

The Driving License Management Center frontend is a comprehensive administrative SPA that communicates with the [ASP.NET Core backend API](https://github.com/MoathEssa/DrivingLicenseManagementCenterBk). It provides dedicated workflows for every stage of the driving license lifecycle:

- Registering citizens and creating applications
- Managing three-stage driving tests (Vision → Theory → Street Driving)
- Issuing, renewing, and replacing licenses
- Detaining and releasing licenses with fine tracking
- Issuing international driving permits

The interface is designed for internal staff use, with route guards, authenticated contexts, and a clean sidebar-driven navigation layout.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 7 | Build tool & dev server |
| React Router DOM | 7 | Client-side routing with nested layouts |
| Redux Toolkit | 2 | Global state management |
| React Hook Form | 7 | Performant form handling |
| Zod | 3 | Schema-based form validation |
| Tailwind CSS | 4 | Utility-first styling |
| shadcn/ui (Radix UI) | Latest | Accessible, unstyled UI components |
| TanStack Table | 8 | Headless data tables with sorting & filtering |
| Recharts | 3 | Dashboard charts and graphs |
| i18next + react-i18next | 25/16 | Multi-language support |
| date-fns | 4 | Date formatting and manipulation |
| sonner | 2 | Toast notification system |
| next-themes | 0.4 | Dark / light mode theming |
| dnd-kit | 6/10 | Drag and drop interactions |
| lucide-react | 0.575 | Icon library |

---

## Application Features

### 🔐 Authentication

- **Sign In** — Email/password login with access token stored in Redux state
- **Register** — Create a new system user account
- **Forgot Password** — Request a reset email
- **Set / Reset Password** — Complete password change via secure email token
- **Account Settings** — Update personal information and change password
- **Auth Guards** — `GuestGuard` prevents logged-in users from seeing auth pages; `AuthGuard` protects all application routes
- **Silent Token Refresh** — Axios interceptors automatically refresh the JWT access token using the HttpOnly cookie before requests fail with 401

### 📊 Dashboard

A real-time statistics page populated from the backend aggregate query, displaying:
- Total applications and status breakdown
- Total drivers registered
- Total licenses issued
- Test pass/fail rates
- Detained and released license counts
- International licenses issued

Visualized with **Recharts** bar/pie charts for immediate operational insight.

### 👤 People Management

- Searchable, sortable data table of all registered citizens
- Add new person with full profile: name, national ID, date of birth, address, country/nationality
- Edit existing person records
- People lookup before creating license applications

### 📄 Local Driving License Applications

- **Application List** — Browse all active applications; each row shows the applicant name, license class, status, and how many of the 3 tests they have passed
- **New Application** — Select an existing person and a license class to open a new application
- **Application Details** — Deep-dive view: applicant info, test appointment history, passed/failed counts, current status
- **Cancel Application** — Soft-cancel a `New` application before any tests are recorded

### 🧪 Testing Workflow

The testing module follows a strict sequential flow:

```
Vision Test  →  Theory Test  →  Street Driving Test  →  Issue License
```

For each test type:
- **View Appointments** — See the history of all appointments for a given application + test type
- **Schedule Appointment** — Pick a test type and appointment date; the system auto-creates a paid retake application if the applicant is coming back after a failure
- **Record Result** — Mark the appointment as passed or failed with optional notes; once recorded, the result is locked and cannot be changed
- **Retake Tracking** — Failed tests are tracked across appointments with separate fee payments per attempt

### 🪪 Drivers & License Operations

Once all three tests are passed, the application unlocks the license issuance workflow:

- **Issue License (First Time)** — Create the driver record and issue the first license for the correct class
- **Renew License** — Extend an expiring or expired license; displays a preview of the new expiration date before confirmation
- **Replace License** — Issue a replacement for a lost or damaged license; selects the reason code and generates a new license record
- **Detain License** — Mark a license as confiscated by traffic authority; enter fine amount
- **Drivers List** — Browse all registered drivers with their license counts and current status

### 🔒 Detained Licenses

- **Detained Licenses List** — View all currently detained licenses across the system
- **Release License** — Process the release of a detained license after fine payment; creates a release application linked to the original detain record

### 🌍 International Licenses

- **Apply for International License** — Enter a local license ID for validation; the system checks the license is active and not expired; upon confirmation issues a 1-year international permit
- **International Licenses List** — Browse all issued international licenses with driver and date information
- **Per-Driver View** — Check all international licenses for a specific driver

### ⚙️ Administration

- **Users Management** — Create and manage system user accounts (admin-only area)
- **Application Types** — View and manage lookup values for application types
- **Test Types** — View and update test type fees for Vision, Theory, and Street Driving tests

---

## Pages & Routes

### Public / Auth Routes

| Route | Description |
|---|---|
| `/auth/sign-in` | Login page (GuestGuard protected) |
| `/auth/register` | Registration page (GuestGuard protected) |
| `/auth/forgot-password` | Forgot password form |
| `/auth/set-password` | Complete password reset (token link) |
| `/auth/reset-password` | Reset password |
| `/auth/forbidden` | 403 error page |

### Protected Routes (inside ApplicationLayout with sidebar)

| Route | Description |
|---|---|
| `/` | Dashboard — statistics overview |
| `/people` | People registry |
| `/drivers` | Drivers list |
| `/applications/local` | Local driving license applications |
| `/applications/international` | Apply for international license |
| `/applications/manage/international` | Manage / list international licenses |
| `/applications/renew` | License renewal workflow |
| `/applications/replacement` | License replacement workflow |
| `/applications/detain` | Detain a license |
| `/applications/release-detained` | Release detained license |
| `/admin/users` | User management (admin) |
| `/admin/applications/types` | Application type settings (admin) |
| `/admin/tests/types` | Test type fee settings (admin) |
| `/auth/account-settings` | User account settings |

---

## Architecture

The project follows a **Feature-Sliced** structure where each domain feature owns its own components, pages, store slices, API calls, validation schemas, and i18n translations.

```
src/
├── app/                    → App-level concerns
│   ├── providers/          → React context providers (Redux, Theme, i18n)
│   ├── router/             → Route definitions and auth guards
│   └── store/              → Redux store root and middleware
│
├── features/               → Feature-sliced modules
│   ├── auth/               → Login, Register, Auth guards, Account settings
│   ├── dashboard/          → Stats page and chart components
│   ├── people/             → People CRUD
│   ├── applications/       → LDLA + Application types
│   ├── tests/              → Test scheduling and result entry
│   ├── drivers/            → License issuance, renewal, replace, detain, release
│   ├── international/      → International license apply and manage
│   └── users/              → Admin user management
│
└── shared/                 → Shared utilities used across features
    ├── api/                → Axios instance with interceptors
    ├── components/         → Layout shell, reusable data tables
    ├── constants/          → App-wide constants
    ├── hooks/              → Custom React hooks
    ├── lib/                → i18n setup, utility functions
    ├── types/              → Shared TypeScript types
    └── ui/                 → shadcn/ui component exports
```

Each feature module is self-contained:

```
features/drivers/
├── components/         → Reusable UI pieces for this feature
├── i18n/               → English translation strings
├── pages/              → Route-level page components
├── store/              → RTK slice (state + thunks/queries)
└── index.ts            → Public barrel export
```

---

## State Management

Global state is managed with **Redux Toolkit**:

| Slice | Description |
|---|---|
| `auth` | Authenticated user, access token, loading states |
| `language` | Active UI language (i18n) |
| Each feature | Local UI state, cached API data, loading/error flags |

**Axios interceptors** in `shared/api/` handle:
- Attaching the Bearer token to every outgoing request
- Automatically calling `/auth/refresh-token` on 401 responses
- Clearing the auth state and redirecting to sign-in if the refresh also fails

---

## Form Validation

All forms use **React Hook Form** with **Zod** resolver for schema-based validation:

- Schemas are defined per feature in `features/{name}/schemas/`
- Zod schemas serve as both runtime validators and TypeScript type sources (`z.infer<typeof schema>`)
- Validation messages are localized through the `zod-i18n-map` package
- Errors are displayed inline under each field with accessible labels

---

## Internationalization

The app supports multiple languages using **i18next** and **react-i18next**:

- Translation files are co-located inside each feature: `features/{name}/i18n/`
- The active language is persisted in Redux (`languageSlice`) and applied app-wide
- Zod validation messages are also translated via `zod-i18n-map`
- Language switching is available in the app header

---

## Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Backend API running](https://github.com/MoathEssa/DrivingLicenseManagementCenterBk) locally

### 1. Clone the repository

```bash
git clone https://github.com/MoathEssa/DrivingLicenseManagementCenterFr.git
cd DrivingLicenseManagementCenterFr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser. The app will connect to the backend and prompt you to sign in.

### 4. Build for production

```bash
npm run build
```

The output will be in the `dist/` directory, ready to be served by any static host or CDN.

---

## Project Structure

```
DrivingLicenseManagementCenterFr/
├── public/                     → Static public assets
├── src/
│   ├── app/
│   │   ├── providers/          → Wraps the app in Redux, Theme, i18n providers
│   │   ├── router/
│   │   │   ├── config.tsx      → All route definitions
│   │   │   ├── guards/         → GuestGuard & AuthGuard components
│   │   │   └── index.ts
│   │   └── store/
│   │       ├── index.ts        → Redux store configuration
│   │       ├── middleware/     → Custom Redux middleware
│   │       └── slices/         → Global slices (languageSlice)
│   │
│   ├── features/
│   │   ├── auth/               → Login, Register, Password reset, Account settings
│   │   ├── dashboard/          → Statistics page + charts
│   │   ├── people/             → People CRUD
│   │   ├── applications/       → LDLA + ApplicationTypes
│   │   ├── tests/              → Test appointments and results
│   │   ├── drivers/            → License issuance, renewal, replace, detain, release
│   │   ├── international/      → International licenses
│   │   └── users/              → Admin user management
│   │
│   ├── shared/
│   │   ├── api/                → Axios instance + request/response interceptors
│   │   ├── components/
│   │   │   ├── layout/         → ApplicationLayout (sidebar, header, breadcrumbs)
│   │   │   └── data-table-v2/  → Reusable TanStack Table wrapper
│   │   ├── constants/          → API URLs, app constants
│   │   ├── hooks/              → useAppDispatch, useAppSelector, custom hooks
│   │   ├── lib/
│   │   │   └── i18n.ts         → i18next initialization and language config
│   │   ├── types/              → Shared TypeScript interfaces and enums
│   │   └── ui/                 → Re-exported shadcn/ui components
│   │
│   ├── assets/                 → Images, SVGs
│   ├── index.css               → Tailwind CSS base + custom CSS variables
│   ├── main.tsx                → React root render
│   └── App.tsx                 → Root component — providers + router
│
├── index.html
├── vite.config.ts
├── tsconfig.app.json
├── tsconfig.json
└── package.json
```

---

## Backend

The RESTful API that powers this frontend is available at:
👉 [DrivingLicenseManagementCenterBk](https://github.com/MoathEssa/DrivingLicenseManagementCenterBk)
