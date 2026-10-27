# PawExcellence Pet Show Architecture & Folder Structure

This application is decoupled into two primary top-level folders: **`client`** (React frontend) and **`server`** (Node.js & MongoDB backend), with full JWT and bcrypt authentication.

---

## 1. Directory Structure

```
├── client/                               # Frontend Application
│   ├── assets/
│   │   └── images/                      # Championship show photography assets
│   ├── components/
│   │   ├── admin/
│   │   │   └── RegistrationsDirectory.tsx # Exhibitor roster & Judge check-in authority console
│   │   ├── auth/
│   │   │   └── AuthModal.tsx             # Exhibitor/Judge login & register modal with 1-click demo logins
│   │   ├── calendar/
│   │   │   ├── CompetitionDetailsModal.tsx # Full schedule, rules, judges, and 'View on Map' action
│   │   │   └── EventCalendar.tsx         # Event calendar with search bar & venue filters
│   │   ├── common/
│   │   │   ├── Footer.tsx                # Compliance, database status & affiliations
│   │   │   └── Navbar.tsx                # Strict Top Bar Contract with active user session badge
│   │   ├── gallery/
│   │   │   ├── PhotoGallery.tsx          # Photo showcase with category tabs & live vote counter
│   │   │   ├── PhotoLightboxModal.tsx    # High-res photo inspection with ribbons & pedigree
│   │   │   └── SubmitPhotoModal.tsx      # Exhibitor photo upload & category selection modal
│   │   ├── home/
│   │   │   └── Hero.tsx                  # Split-screen hero with champion photo & trust KPI strip
│   │   ├── judging/
│   │   │   └── LiveLeaderboard.tsx       # Grand circuit leaderboard, rosettes & judging rubric
│   │   └── registration/
│   │       ├── DigitalPassModal.tsx      # Printable competitor ring pass with barcode & pass ID
│   │       └── RegistrationSection.tsx   # 4-step wizard with auto-prefill for logged-in exhibitors
│   ├── services/
│   │   └── api.ts                       # Typed REST client with automatic JWT Bearer headers
│   ├── types/
│   │   └── index.ts                     # Shared TypeScript interfaces
│   ├── App.tsx                          # Root application component coordinating state & views
│   ├── main.tsx                         # React DOM mount point
│   └── index.css                        # Tailwind CSS styling and theme typography
│
├── server/                               # Backend Application
│   ├── db/
│   │   └── mongodb.ts                   # MongoDB connection pool, driver client & seed data
│   ├── models/
│   │   └── types.ts                     # Database schemas & TypeScript model definitions
│   ├── routes/
│   │   ├── auth.routes.ts               # JWT auth, bcrypt hashing, demo accounts & session verification
│   │   ├── competitions.routes.ts       # Competition calendar, ring schedules & judge rosters
│   │   ├── gallery.routes.ts            # Photo showcase submissions, categories & community voting
│   │   └── registrations.routes.ts      # Multi-step exhibitor entries, pass generation & check-in
│   └── index.ts                         # Server entry point
│
├── server.ts                            # Full-stack root entry point mounting Express & Vite
├── vite.config.ts                       # Vite build configuration
├── package.json                         # Project dependencies and full-stack scripts
└── metadata.json                        # Applet identity and capabilities
```

---

## 2. Authentication System Details

### Security & Token Architecture
- **Password Encryption**: Passwords are securely hashed with `bcryptjs` using 10 salt rounds before persisting to MongoDB.
- **Session Tokens**: Uses signed JSON Web Tokens (`jsonwebtoken`) containing user identity, role, and email, with a 7-day validity.
- **Bearer Header**: The frontend `client/services/api.ts` attaches `Authorization: Bearer <token>` to all authenticated requests.
- **Session Re-Hydration (`/api/auth/me`)**: Validates token on application load to restore user permissions and profile state.

### User Roles & Permissions
- **Exhibitor**:
  - Automatically pre-fills owner name and email during pet registration.
  - Generates official Digital Competitor Ring Passes.
  - Submits photos to the Championship Gallery.
- **Official Ring Judge**:
  - Grants ring check-in authority in the Exhibitor Roster.
  - Unlocks judge status badge and conformation rubric evaluations.
- **1-Click Demo Accounts**:
  - **Dr. Arthur Sterling**: `judge.sterling@pawexcellence.org` (Senior AKC All-Breed Judge)
  - **Katherine Miller**: `kmiller@breederkennels.com` (Purebred Golden Retriever Exhibitor)
