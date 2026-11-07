# TRUQEN Client Management System (CRM)

A premium, modern, commercial-grade Client Management System (CRM) engineered for **TRUQEN**, a web and software development company. Designed for managing potential client leads captured through Google Maps, Google Search, local directories, and outbound outreach.

---

## 🚀 Key Highlights & Features

### 1. Executive Dashboard
- **Dynamic Metric Cards (9 Required Metrics)**:
  - Total Clients
  - New Leads
  - Contacted
  - Interested
  - Demo Requested
  - Demo Approved
  - Demo Rejected
  - Converted
  - Not Interested
- **Visual Analytics**: Interactive client status progression bar and business category distribution.
- **Activity Feed**: Real-time chronological audit trail of client interactions, calls, and demo approvals.
- **Follow-up Reminders**: Instant notification banner for overdue and due-today scheduled calls.

### 2. Client Management & Data Table
- **Responsive Data Table**: 11 detailed columns with sortable headers.
- **Global & Column Search**: Instant search by Company Name, Contact Person, Mobile Number, or Location.
- **Advanced Filtering**: By business category, website availability, contact status, demo status, and project pipeline stage.
- **Bulk Operations**: Multi-row selection with bulk deletion and selected record export.
- **CSV Export**: One-click spreadsheet export for reporting and external CRM migration.
- **Pagination**: Configurable rows per page (10, 25, 50) with pagination controls.

### 3. Duplicate Mobile Number Detection (Critical Security Feature)
- **Normalization**: Automatically strips spaces, hyphens, brackets, country codes, and formatting.
- **Instant Collision Warning**: If a mobile number already exists, saving is blocked and an actionable warning modal displays:
  - Existing Company Name
  - Contact Person & Mobile Number
  - Current Project Status
  - Direct "View Existing Record" button

### 4. Client Details & Activity Timeline
- Comprehensive business, website, and outreach cards with direct links to Google Maps, Instagram, and live websites.
- Interactive **Activity Timeline** allowing staff to log calls, meeting remarks, and status changes on the fly.
- Inline edit mode using `ClientForm`.
- Safe deletion with two-step confirmation.

### 5. Follow-up Management
- Dedicated scheduling dashboard categorized into:
  - **Today's Calls**
  - **Overdue**
  - **Upcoming (Next 7 Days)**
  - **All Scheduled**
- One-click "Mark Done" and "Reschedule" modals.

### 6. Demo Project Management
- Dedicated board for custom demo websites designed for client conversion.
- Filter by Demo Status (*Not Started*, *In Progress*, *Sent to Client*, *Approved*, *Rejected*).
- Live preview links and demo URL update controls.

### 7. Converted Clients
- Dedicated portfolio view highlighting won deals, closed dates, and production website URLs.

### 8. Premium SaaS UI & Theming
- Built with Tailwind CSS, Lucide React, and Inter typography.
- **Dark Mode & Light Mode**: Seamless toggle persisted in `localStorage`.
- Collapsible sidebar for desktop + responsive mobile drawer with backdrop.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Custom SaaS Utility Classes
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Persistence**: Local demo engine; Supabase schema and environment setup are provided

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Running Locally
```bash
cd "c:\Users\LOQ\clints\clint manegement system\truqen-crm"
npm install
npm run dev
```

Visit: `http://localhost:5173`

Sign-in uses Supabase Auth. Create/authenticate users through the Supabase project before using the login screen.

---

## Supabase setup

1. In Supabase, open **Project Settings → API** and copy the Project URL and publishable key (or legacy anon key). Never use the database password or service-role key in frontend code.
2. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Run `supabase/schema.sql` in the Supabase SQL Editor.
4. Restart the Vite dev server. Settings shows whether the public project configuration is present.

The CRM signs in with Supabase Auth and stores client records in `public.clients`; row-level security limits records to their owner. Activity history is stored with each client record. The legacy browser demo data is cleared when the CRM starts. The Settings reset control only clears legacy browser data and does not delete remote records.

---

## 📁 Project Architecture

```
truqen-crm/
├── supabase/schema.sql            # Supabase tables, indexes, and RLS policies
├── src/
│   ├── components/
│   │   ├── clients/              # ClientForm, ClientTable, ClientFilters
│   │   ├── common/               # Pagination
│   │   ├── dashboard/            # StatCard, StatusOverviewChart, CategoryDistribution, ActivityFeed, FollowUpAlerts
│   │   ├── layout/               # Sidebar, Header, DashboardLayout
│   │   └── ui/                   # StatusBadge, Modal, ConfirmDialog, DuplicateWarningModal, EmptyState, LoadingSpinner
│   ├── context/
│   │   ├── AuthContext.tsx       # Auth session & demo login provider
│   │   ├── ClientContext.tsx     # Full CRUD, duplicate check, and localStorage sync
│   │   └── ThemeContext.tsx      # Dark / light theme provider
│   ├── data/
│   │   └── mockData.ts           # 16 realistic businesses across diverse categories
│   ├── pages/
│   │   ├── AddClient.tsx         # Client onboarding form
│   │   ├── AllClients.tsx        # Filterable client table & CSV export
│   │   ├── ClientDetails.tsx     # Client profile & activity timeline
│   │   ├── ConvertedClients.tsx  # Won deals showcase
│   │   ├── Dashboard.tsx         # Executive KPI dashboard
│   │   ├── DemoProjects.tsx      # Demo website tracking
│   │   ├── FollowUps.tsx         # Follow-up calendar & overdue alerts
│   │   ├── Login.tsx             # Authentication screen
│   │   ├── NotFound.tsx          # 404 handler
│   │   └── Settings.tsx          # Themes, backup JSON, & Supabase status
│   ├── services/
│   │   ├── authService.ts        # Authentication abstraction
│   │   └── supabase.ts           # Supabase client configuration
│   ├── types/
│   │   └── index.ts              # Strict TypeScript domain interfaces
│   └── utils/
│       └── helpers.ts            # Normalization, calculations, CSV export
└── index.html
```
