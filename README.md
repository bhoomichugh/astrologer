# Astrologer CRM

A full-stack CRM for astrologers to manage clients, consultations, follow-ups, and AI-generated consultation summaries.

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, bcrypt
- AI: Gemini API

## Features

- Admin and astrologer roles
- JWT-based login and registration
- Client CRUD with assigned astrologer tracking
- Consultation CRUD with status and notes
- Dashboard stats for clients and consultations
- Gemini-powered professional consultation summaries

## Setup

Install dependencies:

```bash
npm run install:all
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://your-user:your-password@cluster.mongodb.net/astrologer-crm
JWT_SECRET=replace-with-a-long-secret
GEMINI_API_KEY=your-gemini-api-key
CLIENT_ORIGIN=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run the backend:

```bash
npm run dev:backend
```

Run the frontend:

```bash
npm run dev:frontend
```

## Demo Flow

1. Register an admin user.
2. Login as admin and create astrologer users.
3. Add clients and assign them to astrologers.
4. Create consultations with notes.
5. Generate AI summaries from consultation notes.
