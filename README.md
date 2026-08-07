# WCMS — WebApps Club Management System

A full-stack club management portal for **KL University SAC WebApps Club** with role-based access for Students, Admins, and Super Admins.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (JavaScript), Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express, MongoDB (Mongoose) |
| Auth | JWT, bcrypt, email password reset |
| Certificates | PDF generation (pdf-lib) |
| Deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas (free) |

## Features

### Student Portal
- Login with ID number + default password (`webapps@123`)
- Forgot password via email reset
- Profile (ID, club, branch, hostler/day scholar, year)
- Project details with team members & problem statement
- Sessions calendar with upcoming events
- Attendance stats (present/absent/total + absent dates)
- Certificate download (Participation / Appreciation)

### Admin Portal
- CSV import of student data from SAC team
- Manual add/edit students (15-min edit window)
- Take attendance per session
- Create sessions/workshops/hackathons
- Bulk certificate generation from CSV

### Super Admin Portal
- Everything Admin can do, plus:
- Manage admins & super admins (add/remove)
- Delete students & sessions
- 24-hour attendance edit window
- Club settings (logos, default password)
- Full system control

## Quick Start (Local)

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

API runs at `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Default Super Admin Login

| Field | Value |
|-------|-------|
| ID Number | `SUPER001` |
| Password | `SuperAdmin@123` |

Change these in `backend/.env` before deploying.

## CSV Import Format

```csv
id_number,name,branch,residency,year
2300030123,John Doe,CSE,hostler,Y25
2300030124,Jane Smith,ECE,day scholar,Y25
```

See `sample-data/students.csv` for an example.

## Free Deployment Guide

### Database — MongoDB Atlas (Free)
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Add network access: `0.0.0.0/0` (or your host IPs)
4. Copy connection string → set as `MONGODB_URI` in backend env

### Backend — Render (Free)
1. Push repo to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Root directory: `backend`
4. Build: `npm install`
5. Start: `npm start`
6. Add environment variables from `.env.example`
7. Set `FRONTEND_URL` to your Vercel URL

### Frontend — Vercel (Free)
1. Import GitHub repo on [vercel.com](https://vercel.com)
2. Root directory: `frontend`
3. Add env: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Deploy

## Project Structure

```
wcms/
├── backend/
│   ├── models/       # User, Session, Attendance, Project, Certificate
│   ├── routes/       # API endpoints
│   ├── middleware/   # JWT auth & role authorization
│   └── utils/        # Email, PDF certificates, helpers
├── frontend/
│   └── src/
│       ├── pages/    # Auth, Student, Admin, SuperAdmin pages
│       ├── components/
│       └── context/  # Auth context
└── sample-data/      # Example CSV files
```

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/forgot-password` | Public |
| POST | `/api/students/import-csv` | Admin+ |
| POST | `/api/attendance/mark` | Admin+ |
| POST | `/api/sessions` | Admin+ |
| POST | `/api/certificates/bulk-import` | Admin+ |
| PUT | `/api/settings` | Super Admin |
| POST | `/api/settings/admins` | Super Admin |

## Resume Highlights

- Built a production-ready MERN club management system with 3-tier RBAC
- CSV bulk import, attendance tracking with time-windowed edit permissions
- Automated PDF certificate generation (Participation/Appreciation)
- JWT authentication with forced password change & email reset flow
- Responsive React UI with role-specific dashboards and sidebar navigation

## License

MIT — Built for KL University WebApps Club SAC
