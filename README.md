# Driving License Management Center — Frontend

React 19 SPA for a government driving license management platform. Digitizes the full licensing workflow — from citizen registration and three-stage testing through license issuance, renewal, detention, and international permits — with bilingual Arabic/English support, role-based access, and a real-time operational dashboard.

> **Backend →** [driving-license-management-back-end](https://github.com/MoathEssa/driving-license-management-back-end) — ASP.NET Core 10 Clean Architecture API with CQRS

---

## Live Demo

|                       | URL                                                |
| --------------------- | -------------------------------------------------- |
| **Frontend**          | https://black-mud-0f1ed5a0f.4.azurestaticapps.net/ |
| **Backend API**       | https://dvld-api.azurewebsites.net/                |
| **API Docs (Scalar)** | https://dvld-api.azurewebsites.net/api-docs        |

---

## Implemented Features

### Authentication & Session Management

- **Login / Registration** — JWT-based authentication with email and password. Access tokens stored in memory, refresh tokens handled as HttpOnly cookies by the backend — never exposed to JavaScript.
- **Automatic token refresh** — When a session expires mid-use, the app silently refreshes the access token and retries the failed request. A mutex lock prevents race conditions when multiple API calls expire simultaneously.
- **Cross-tab logout** — Logging out in one browser tab immediately signs out all other open tabs via the BroadcastChannel API, preventing stale sessions from making authenticated requests.
- **Invitation-based user onboarding** — Admins create user accounts that trigger email invitations. Invited users land on a password-setup page with a tokenized link — no self-service admin access.
- **Forgot / Reset password flow** — Email-based password recovery with token validation.

### Driving License Lifecycle

- **Application submission** — Users create local driving license applications by selecting a person and license class. The system validates eligibility (age, existing applications, duplicate checks) before submission.
- **Three-stage test pipeline** — Each application progresses through vision, written, and practical exams. The UI tracks which tests are passed, allows scheduling appointments, and records pass/fail results. Failed tests automatically generate retake applications with fees.
- **First-time license issuance** — After all three tests pass, clerks can issue the license directly from the application detail view. The system creates the driver record (if first license) and the license atomically.
- **License renewal** — Preview screen shows expiry status, eligibility, and fees before submission. The old license is deactivated and a new one issued.
- **License replacement** — Handles lost and damaged scenarios with separate tracking. Same preview → confirm flow as renewal.
- **License detention** — Law enforcement can detain active licenses with recorded fine amounts. Separate release workflow with its own application and fee.
- **International licenses** — Validates that the applicant holds an active, non-expired local license before allowing international permit issuance. 1-year validity with independent management views.

### People Management

- **Full CRUD for person records** — Create, view, update, and delete persons with fields for national ID, contact info, nationality, gender, and date of birth.
- **Image upload** — Person photos uploaded via multipart form-data and stored in Azure Blob Storage, displayed throughout the application.

### User & Admin Management

- **User listing with status control** — Admins view all system users and can activate/deactivate accounts instantly.
- **Email actions** — Resend invitation emails or send custom messages to users directly from the management view.
- **Fee configuration** — Admins can update fees for application types and test types. Changes take effect immediately for new transactions.

### Dashboard & Analytics

- **KPI cards** — At-a-glance counts for total people, drivers, active licenses, and applications.
- **Monthly trend chart** — Line chart showing application volume over time to identify seasonal patterns.
- **Application distribution** — Breakdown by type (new, renewal, replacement, international) and by status (new, completed, cancelled).
- **Test pass rates** — Bar chart comparing pass/fail rates across vision, written, and practical exams.
- **License issuance breakdown** — Distribution by reason (first-time, renewal, lost replacement, damaged replacement).
- **Detention statistics** — Active vs. released detained licenses.

### Bilingual Support (Arabic / English)

- **Full RTL/LTR layout switching** — Not just translated strings. The entire layout direction, input alignment, sidebar position, and component ordering flip between Arabic (RTL) and English (LTR).
- **Localized form validation** — Zod validation errors render in the active language using `zod-i18n-map` with custom per-locale overrides. Users see "هذا الحقل مطلوب" instead of "Required" when the app is in Arabic.
- **Feature-scoped translations** — Each feature owns its own translation files (en.json / ar.json), merged at initialization. No monolithic translation files to maintain.

### Theme System

- **Dark and light modes** — OKLCH-based color system with smooth switching. System preference auto-detection on first visit, with manual toggle persisted to localStorage.

---

## Tech Stack

| Layer            | Technologies                                                             |
| ---------------- | ------------------------------------------------------------------------ |
| **Framework**    | React 19, TypeScript 5.8 (strict mode)                                   |
| **State & Data** | Redux Toolkit, RTK Query (tag-based cache invalidation)                  |
| **Routing**      | React Router v7 with auth/guest guards                                   |
| **Forms**        | React Hook Form + Zod (schema-first validation with i18n error messages) |
| **UI**           | shadcn/ui + Radix UI, Tailwind CSS v4 (OKLCH color system)               |
| **i18n**         | i18next + react-i18next + zod-i18n-map                                   |
| **Charts**       | Recharts                                                                 |
| **Build**        | Vite 7                                                                   |

---

## Architecture

Feature-based architecture — each domain feature is a self-contained module with its own pages, components, API slice, validation schemas, and translations.

```
src/
├── app/
│   ├── providers/    Redux, Theme, i18n, Auth, Toast (layered hierarchy)
│   ├── router/       Route config, AuthGuard, GuestGuard
│   └── store/        Redux store, error notification middleware, language slice
├── features/
│   ├── auth/         Login, Register, Set Password, Forgot/Reset Password, Account Settings
│   ├── applications/ Local DL applications, Application types management
│   ├── people/       Person CRUD with image upload
│   ├── users/        Admin user management with invitation flow
│   ├── drivers/      License issuance, renewal, replacement, detention
│   ├── tests/        Test types, appointments, results
│   ├── international/  International license issuance and management
│   └── dashboard/    KPIs, charts, system statistics
└── shared/
    ├── api/          Base RTK Query config with auth interceptor + mutex
    ├── components/   Layout, sidebar, reusable data table
    ├── hooks/        Custom hooks (mobile detection, debounce)
    ├── lib/          i18n setup, localStorage service, utilities
    ├── types/        Shared TypeScript interfaces
    └── ui/           30+ shadcn/ui primitives
```

### Key Technical Decisions

- **RTK Query with tag-based cache invalidation** — Mutations automatically invalidate related caches across features. Issuing a license invalidates Driver, License, Application, and Dashboard queries without manual refetch logic.
- **Centralized error middleware** — A single RTK middleware intercepts all API responses and shows toast notifications by HTTP status (400 validation, 401 logout, 403 forbidden, 409 conflict, 500 error). Zero per-component error handling boilerplate.
- **Auth interceptor with mutex** — Prevents concurrent 401 responses from triggering duplicate token refresh requests. First 401 acquires the lock, refreshes, and all queued requests retry with the new token.
- **Standardized API envelope** — Every backend response follows `{ statusCode, succeeded, message, errors, data }`. One generic `IGenericApiResponse<T>` type handles all endpoints consistently.

---

## Pages & Routing

### Public Routes (GuestGuard)

| Path                    | Description                 |
| ----------------------- | --------------------------- |
| `/auth/sign-in`         | Email/password login        |
| `/auth/register`        | Self-registration           |
| `/auth/set-password`    | Invited user password setup |
| `/auth/forgot-password` | Initiate password reset     |
| `/auth/reset-password`  | Complete password reset     |

### Protected Routes (AuthGuard)

| Path                                 | Description                                   |
| ------------------------------------ | --------------------------------------------- |
| `/`                                  | Dashboard — KPIs, trend charts, distributions |
| `/people`                            | Person management with image upload           |
| `/drivers`                           | Driver list with license history              |
| `/applications/local`                | Local driving license applications            |
| `/applications/international`        | Issue international licenses                  |
| `/applications/manage/international` | Manage international licenses                 |
| `/applications/renew`                | License renewal workflow                      |
| `/applications/replacement`          | Lost/damaged license replacement              |
| `/applications/detain`               | Detain license with fine                      |
| `/applications/release-detained`     | Release detained licenses                     |
| `/admin/users`                       | User management (Admin only)                  |
| `/admin/applications/types`          | Configure application fees (Admin only)       |
| `/admin/tests/types`                 | Configure test fees (Admin only)              |
| `/account/settings`                  | User profile settings                         |

---

## How to Run

### Prerequisites

- [Node.js 20+](https://nodejs.org/) with npm
- Backend API running at `http://localhost:5277`

### Setup

```bash
npm install
npm run dev
```

The app starts at `http://127.0.0.1:5173`.

### Available Scripts

| Script            | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR                   |
| `npm run build`   | Production build (TypeScript check + Vite build) |
| `npm run preview` | Preview production build locally                 |
| `npm run lint`    | ESLint check                                     |

---

## Deployment

**Live URL:** https://black-mud-0f1ed5a0f.4.azurestaticapps.net/

The frontend is deployed to **Azure Static Web Apps** with infrastructure defined as code and fully automated CI/CD.

| Concern            | Tool                                    | Location                                    |
| ------------------ | --------------------------------------- | ------------------------------------------- |
| **Infrastructure** | Azure Bicep                             | `infra/main.bicep`, `infra/main.bicepparam` |
| **CI/CD**          | GitHub Actions                          | `.github/workflows/deploy.yml`              |
| **Hosting**        | Azure Static Web Apps (Free tier)       | Resource created by Bicep                   |
| **Secrets**        | GitHub Actions Secrets → Build-time env | No secrets in source control                |

**How it works:**

1. Push to `main` triggers the GitHub Actions workflow.
2. The workflow installs dependencies and runs `npm run build` with `VITE_API_BASE_URL` injected from GitHub Secrets.
3. Bicep deploys (or updates) the Static Web App resource.
4. The `dist/` output is deployed to Azure Static Web Apps using the deployment token.

SPA routing is handled via `staticwebapp.config.json` with a navigation fallback to `index.html`.

### GitHub Actions Secrets (Frontend)

| Secret              | Description                                                               |
| ------------------- | ------------------------------------------------------------------------- |
| `AZURE_CREDENTIALS` | Azure service principal JSON for `azure/login`                            |
| `API_BASE_URL`      | Deployed backend API URL (e.g. `https://dvld-api.azurewebsites.net/api/`) |
