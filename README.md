# SkillSync

**AI-powered career intelligence and recruitment platform** connecting students, recruiters, and universities.

SkillSync analyzes a student's GitHub activity, resume, and skills to compute an employability score, close skill gaps with an AI-generated roadmap, and match students to jobs by real compatibility — while giving recruiters, universities, and admins their own tools to post roles, screen candidates, and track placement readiness.

Built for **CSE471: System Analysis and Design** — Group 08, Section 09.

---

## Live Demo

- **Frontend:** [skillsync-gules.vercel.app](http://skillsync-gules.vercel.app/)
- **Backend API:** [skillsync-backend-d9r2.onrender.com](https://skillsync-backend-d9r2.onrender.com/)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT-based authentication |
| External APIs | GitHub REST API, Google Gemini (AI features) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Core Features

SkillSync serves four roles, each with their own dashboard:

**Students**
- Employability score built from GitHub activity, resume, and skills
- AI-generated skill-gap roadmap toward a target role
- GitHub account integration — connect a username, view public profile and repos
- Programming language & repository analysis from GitHub activity
- Smart job matching — ranked job list by compatibility with skills, career interests, and employability score
- Job detail & one-click application, with duplicate-application protection
- Application tracker — status by stage (Applied, Interviewing, Offer, Rejected), with response-rate stats
- In-app notification when a job match clears a high compatibility threshold
- Resume upload & AI analysis, portfolio builder, onboarding flow

**Recruiters**
- Post and manage job listings
- Review, shortlist, and manage applications
- Schedule interviews

**Universities**
- Track student placement readiness and employability trends across departments

**Admins**
- Verify recruiters, moderate job postings, manage users

---

## Project Structure

cse471_group8_lab_project/
├── backend/
│   ├── server.js                  # entry point
│   └── src/
│       ├── app.js                 # Express app setup, route registration
│       ├── config/                # DB connection config
│       ├── controllers/           # request handlers, one per resource
│       ├── middlewares/           # auth (protect, authorizeRoles), error handling
│       ├── models/                # Mongoose schemas (User, Job, Application, etc.)
│       ├── routes/                # Express routers, one per resource
│       ├── services/              # external integrations (e.g. Gemini AI)
│       └── seed/                  # database seed scripts
│
└── frontend/
    ├── app/
    │   ├── (dashboards)/          # role-based dashboards: student, recruiter, university, admin
    │   ├── jobs/                  # job matches list + job detail & apply
    │   ├── applications/          # student application tracker
    │   ├── login/, register/      # auth pages
    │   └── page.js                # public landing page
    └── src/
        ├── components/            # shared UI (common/) and feature-specific (features/)
        ├── lib/api.js              # all frontend → backend API calls
        ├── context/                # React context (auth, etc.)
        └── utils/                  # small helpers (avatar colors, time formatting)

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB connection string (MongoDB Atlas or local)
- A GitHub personal access token (optional — raises GitHub API rate limits from 60/hr to 5000/hr)

### 1. Clone the repository

git clone https://github.com/tanvirr75/cse471_group8_lab_project.git
cd cse471_group8_lab_project

### 2. Backend setup

cd backend
npm install

Create a .env file in backend/ with:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GITHUB_TOKEN=your_github_token

Run the backend:

npm run dev

Backend runs on http://localhost:5000.

### 3. Frontend setup

cd frontend
npm install

Create a .env.local file in frontend/ with:

NEXT_PUBLIC_API_URL=http://localhost:5000

Run the frontend:

npm run dev

Frontend runs on http://localhost:3000.

---

## Team — Group 08

| Name | Student ID |
|---|---|
| Tanvirul Hoque | 22201941 |
| Nafiur Rahman Khadem | 22301505 |
| Naimul Hasan | 22101809 |
| Shium Ahmed Sowad | 22101871 |

---

## License

This project was built for academic purposes as part of the CSE471 course at BRAC University.
