# ShivaAI Medico — Telemedicine Frontend (Next.js App Router)

A full-featured telemedicine frontend for patients, doctors, hospitals, and admin. It integrates with the provided FastAPI backend for video sessions, AI-assisted insights, prescriptions, report uploads, and WebSocket features.

## Features

- Google OAuth via Firebase (role-based redirects)
- Protected dashboards (Patient, Doctor, Hospital, Admin)
- Doctor booking with session creation
- Video calls via WebRTC with backend signaling (`/ws/signaling/{session_id}`)
- Upload reports (`/upload-report/`) and ask AI (`/ask-question/`)
- Real-time AI updates via WebSocket (`/ws/disease_info`)
- Responsive, accessible UI with light/dark mode, toasts, loading/error states
- Offline detection

## Environment Variables

Create a `.env.local` file based on `.env.local.example`.

- `NEXT_PUBLIC_BACKEND_URL` (e.g., `http://localhost:8001`)
- Firebase (client SDK):
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`

## Running

- Open the v0 Preview to run the app.
- Use the provided backend at `http://localhost:8001`.
- Sign in via Google, pick a role, and you’ll be redirected accordingly.
- Book a doctor to create a video session and join `/call/{sessionId}`.

## Notes

- Roles are client-stored for now (localStorage) to match role-based dashboards; integrate Firestore role documents for production.
- WebRTC signaling is basic (prototype echo); use rooms/channels for multi-user production cases.
