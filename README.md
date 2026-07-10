# Blog Platform

Full-stack blogging application with JWT authentication, CRUD posts, comments, search, and categories.

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- Frontend: React, React Router, Axios, React-Quill, Vite

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # edit MONGODB_URI and JWT_SECRET
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Backend port (default 5000) |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret for signing tokens |
| JWT_EXPIRES_IN | Token expiry (e.g. 7d) |
| CLIENT_URL | Frontend URL for CORS |

## MongoDB Atlas

1. Create a cluster at https://www.mongodb.com/cloud/atlas
2. Database Access → create user
3. Network Access → allow your IP (or `0.0.0.0/0` for Vercel)
4. Connect → Drivers → copy URI into `MONGODB_URI`

## Deploy to Vercel

This project is configured for full-stack deployment on Vercel (React frontend + Express API).

### 1. Push to GitHub

Make sure your code is pushed to GitHub (this repo is already linked to `origin`).

### 2. Create a MongoDB Atlas database

Vercel cannot use the in-memory database. You need a real MongoDB Atlas cluster and connection string.

### 3. Import the project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Keep the default settings:
   - **Framework Preset:** Other
   - **Root Directory:** `.` (project root)
   - Vercel will read `vercel.json` automatically

### 4. Add environment variables

In Vercel → Project → Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random secret string |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | Your Vercel URL (e.g. `https://your-app.vercel.app`) |

Set `CLIENT_URL` after the first deploy if you do not know the URL yet, then redeploy.

### 5. Deploy

Click **Deploy**. Vercel will:

- Build the React frontend from `frontend/`
- Deploy the Express API as a serverless function at `/api/*`
- Route all other URLs to the React app (for React Router)

### Optional: deploy with CLI

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts and add the same environment variables when asked.
