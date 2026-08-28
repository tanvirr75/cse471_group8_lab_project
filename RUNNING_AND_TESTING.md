# SkillSync — Running & Testing Guide (with Seed Data)

**SkillSync** is a career intelligence & recruitment platform (CSE471 Group 8 Lab Project). It is a
monorepo with two independent apps:

```
sowad/
└── cse471_group8_lab_project/
    ├── backend/     Node.js + Express + MongoDB (Mongoose)       — port 5002
    │   └── src/
    │       ├── routes/        REST endpoints
    │       ├── controllers/   request handlers
    │       ├── models/        Mongoose schemas
    │       ├── services/      AI + recommendation engines
    │       ├── config/        DB, Gemini, Cloudinary
    │       ├── middlewares/   JWT auth
    │       ├── seed/          seed scripts
    │       └── utils/         helpers
    ├── frontend/    Next.js 16 (App Router) + React 19 + Tailwind v4  — port 3000
    └── linkedin.html (unrelated scratch file)
```

---

## 1. Prerequisites

- **Node.js** v18+ (the repo was used with v22)
- **npm**
- **MongoDB** — a running instance (local `mongodb://localhost:27017` or an Altas/MongoDB Compass cluster)

Optional (needed only for AI features):
- **Google Gemini API key** — required for **Feature 6 (Roadmap)** and **Feature 2 (Resume)** (now wired to Gemini with heuristic fallback)
- **NewsAPI key** — for Career Hub / industry trends
- **GitHub token** — for GitHub analysis (higher rate limits)
- **Cloudinary** credentials — configured but resume upload currently stores a local filename (not used)

> **Critical:** No `.env` files are committed (they are gitignored). You must create them first — see below.
> Without a `MONGO_URI` and `JWT_SECRET`, the app cannot start.

---

## 2. Environment Setup

### Backend — `backend/.env`

```dotenv
# Required
MONGO_URI=mongodb://localhost:27017/skillsync
JWT_SECRET=your_secret_key_here

# Optional — AI & integrations
PORT=5002
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
NEWS_API_KEY=your_newsapi_key
GITHUB_TOKEN=your_github_token

# Optional — Cloudinary (not currently active)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

> - `MONGO_URI` defaults are NOT set in code — **required**.
> - `JWT_SECRET` is **required** — auth/login/register will fail without it.

### Frontend — `frontend/.env.local` (optional)

```dotenv
# Defaults to http://127.0.0.1:5002 if omitted
BACKEND_API_URL=http://127.0.0.1:5002
```

---

## 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## 4. Seed the Database

Run these **in order** from the `backend/` directory. All seed scripts connect using `MONGO_URI`
and **clear the affected collections** before inserting, so they are safe to re-run.

### Step 4.1 — Users & Profiles

```bash
npm run seed
```
or, equivalently:
```bash
node src/seed/seedUsers.js
```

This seeds:

| Login email | Password | Role | Notes |
|-------------|----------|------|-------|
| `admin@skillsync.com` | `password123` | admin | |
| `career@techuniversity.edu` | `password123` | university | Tech University |
| `recruiter@techcorp.com` | `password123` | recruiter | TechCorp |
| `student1@skillsync.com` … `student25@skillsync.com` | `password123` | student | 25 students of Tech University with random departments/skills/employability scores |

### Step 4.2 — Jobs

```bash
node src/seed/seedJobs.js
```

Seeds 3 sample **open** jobs (Junior Frontend Developer, MERN Stack Developer, Software Engineering Intern).

> ⚠️ This deletes any existing jobs, including the one created by `seedApplications.js`. Run it **before**
> `seedApplications.js` if you want to keep the sample jobs.

### Step 4.3 — Applications (optional, recruiter workflow demo)

```bash
node src/seed/seedApplications.js
```

Requires the users seeded in step 4.1 (`recruiter@techcorp.com` and `student1@skillsync.com`). Creates:
- A `Software Engineer Intern` job under TechCorp
- An `under_review` application for `student1` with `matchPercentage: 92`

> ⚠️ This deletes **all** jobs and applications. Run it **after** `seedJobs.js` if you want both.

---

## 5. Start the Servers

Run each in its own terminal.

### Backend (terminal 1)

```bash
cd backend
npm run dev      # nodemon — auto-restarts on change
# or
npm start        # node server.js
```

- Server listens on **http://localhost:5002**
- Health check: open `http://localhost:5002/` → should return `"SkillSync API is running..."`

### Frontend (terminal 2)

```bash
cd frontend
npm run dev      # Next.js dev server
```

- App available at **http://localhost:3000**
- The frontend proxies `/api/*` → `http://127.0.0.1:5002` (see `frontend/next.config.mjs`), so it should
  work out of the box if the backend is on 5002.

---

## 6. Logging In & Testing Each Role

Log in at **http://localhost:3000/login** (or register a new account). Use the seeded credentials:

| Role | Email | Redirect goes to |
|------|-------|------------------|
| Student | `student1@skillsync.com` | `/student/dashboard` |
| Recruiter | `recruiter@techcorp.com` | `/recruiter/dashboard` |
| University | `career@techuniversity.edu` | `/university/dashboard` |
| Admin | `admin@skillsync.com` | `/admin/dashboard` |

> All passwords are `password123`.

---

## 7. Feature-by-Feature Test Checklist

### Student features (logged in as `student1@skillsync.com`)

| Feature | Path | What to verify | Needs key? |
|---------|------|----------------|------------|
| **Job seeking / matches** | `/jobs` | Jobs ranked with match %; filter by type/workplace/location; sort | No |
| **Smart recommendations** | `/recommendations` | Persisted ranked jobs, circular match rings, 60s auto-refresh, reasons + matched/missing skills, "NEW" since last visit | No |
| **Feature 12 — Job match notification** | `/student/notifications` | After recommendations score a job ≥80%, a `job_match` notification appears (title + match % + deadline + link to `/jobs/:id`). Deduped — only once per job | No |
| **Feature 2 — Resume analysis** | `/student/resume` | Upload a real PDF resume → score, feedback, top fixes, sections shown. Uses Gemini if `GEMINI_API_KEY` set, else heuristic fallback | Yes (else fallback) |
| **Feature 6 — Skill gap & roadmap** | `/student/readiness` | Pick target role + skills → Gemini-generated roadmap, readiness %, missing skills, steps with skills/projects/resources. Requires student auth | **Yes** |
| **Feature 11 integration** | `/applications` | Kanban tracker for submitted applications | No |
| **GitHub analysis** | student dashboard / onboarding | Language breakdown from a GitHub username | No (token recommended) |
| **Career Hub / news** | `/student/news` | Real remote jobs + tech trends | No (news key for trends) |
| **Portfolio** | `/student/portfolio` | CRUD public portfolio | No |
| **Onboarding** | `/student/onboarding` | Connect GitHub/LinkedIn, upload resume, complete | No |

### Recruiter features (logged in as `recruiter@techcorp.com`)

| Feature | Path | What to verify | Needs key? |
|---------|------|----------------|------------|
| Recruiter dashboard | `/recruiter/dashboard` | Metrics, active posts, top candidates | No |
| Create job posting | `/recruiter/jobs/new` | Create job with skills + match preview, publish/draft | No |
| My job posts | `/recruiter/jobs` | List of posted jobs | No |
| Candidates | `/recruiter/applications` (+ `/applications/:id`) | Candidate table, match/employability rings, shortlist | No |
| **Feature 13 — Shortlisting** | `/recruiter/shortlist` | Toggle shortlist, view grid | No |
| **Feature 14 — Interview** | candidate detail | Schedule interview → creates `interview` notification for student | No |
| Interview invitations | `/recruiter/interviews` | Accept/pending/declined metrics | No |

### University & Admin

| Role | Path | What to verify |
|------|------|----------------|
| University | `/university/dashboard` | KPI cards, department distribution, trending skills (from seeded 25 students) |
| Admin | `/admin/dashboard` | Recruiter verification + system monitoring placeholders |

---

## 8. Common Issues & Troubleshooting

| Symptom | Cause / Fix |
|---------|-------------|
| Backend won't start, `MongooseError: The `uri` parameter to mongoose.connect()` | `MONGO_URI` missing or empty in `backend/.env`, or MongoDB not running |
| Login/register returns JWT error | `JWT_SECRET` missing in `backend/.env` |
| Frontend fetches fail (proxy) | Backend not running on 5002, or set `BACKEND_API_URL` in `frontend/.env.local` |
| Roadmap/readiness returns 500 | `GEMINI_API_KEY` missing/invalid. **Resume** now **falls back** to heuristic, but **roadmap does not** |
| Feature 12 — no notification appears | Recommendations only notify jobs that are **stale** to the student. Log in as the student, open `/recommendations` (or `/jobs`) once so matching runs, then check `/student/notifications` |
| Seed script errors | Run scripts **from the `backend/` directory**; ensure users seeded before applications |

---

## 9. Available npm Scripts

**Backend** (`backend/package.json`):
```bash
npm start    # node server.js
npm run dev  # nodemon server.js
npm run seed # node src/seed/seedUsers.js
npm test     # placeholder — no real tests
```

**Frontend** (`frontend/package.json`):
```bash
npm run dev    # next dev
npm run build  # next build
npm run start  # next start (after build)
npm run lint   # eslint
```

---

## 10. Additional Notes

- **Branch:** This guide assumes you are on the `tanvir` branch, which is the only branch ahead of
  `main` and contains the latest working features.
- **Seed script quirk:** `seedApplications.js` and `seedJobs.js` both `Job.deleteMany`, so they wipe
  each other's jobs. Run `seedJobs.js` before `seedApplications.js` to keep the 3 sample jobs, or run
  only one of them depending on your test scenario.
- **Recommended full test flow:**
  1. Start MongoDB.
  2. Create `backend/.env` (with `MONGO_URI`, `JWT_SECRET`, and optionally `GEMINI_API_KEY`).
  3. `npm install` in both folders.
  4. `npm run seed` → `node src/seed/seedJobs.js` → (optional) `node src/seed/seedApplications.js`.
  5. Start backend then frontend.
  6. Log in as student → visit `/recommendations` → then `/student/notifications` to see Feature 12.
  7. Test Feature 2 (resume) and Feature 6 (roadmap) with a Gemini key.
