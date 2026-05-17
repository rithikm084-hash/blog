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
3. Network Access → allow your IP
4. Connect → Drivers → copy URI into `MONGODB_URI`
