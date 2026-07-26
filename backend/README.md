# Vidya AI — Backend

Express API for the Vidya AI educational app: auth, subjects, quizzes (graded
server-side), notes, assignments, and an AI tutor chat endpoint that proxies
to the Anthropic API.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# then edit .env and set ANTHROPIC_API_KEY (and JWT_SECRET)
npm run dev
```

Server runs on `http://localhost:4001` by default.

## Endpoints

| Method | Path                          | Auth | Description                          |
|--------|-------------------------------|------|--------------------------------------|
| POST   | /api/auth/login               | no   | Logs in (auto-creates demo account)  |
| POST   | /api/auth/signup              | no   | Creates a new account                |
| GET    | /api/auth/me                  | yes  | Current user                         |
| GET    | /api/subjects                 | no   | All subjects + topics                |
| GET    | /api/subjects/progress-summary| no   | Overall + per-subject averages       |
| GET    | /api/quizzes/:subjectId       | no   | Quiz questions (no answers)          |
| POST   | /api/quizzes/:subjectId/submit| no   | Grades answers, returns score        |
| GET    | /api/notes                    | yes  | List notes                           |
| POST   | /api/notes                    | yes  | Create a note                        |
| DELETE | /api/notes/:id                | yes  | Delete a note                        |
| GET    | /api/assignments               | yes  | List assignments                     |
| PATCH  | /api/assignments/:id          | yes  | Update status (e.g. submit)          |
| POST   | /api/chat                     | yes  | AI tutor reply (proxies Anthropic)   |

## Notes

- Data is stored **in memory** (see `src/data/store.js`) so there's zero setup
  — restarting the server resets it. Swap that module for a real database
  when you're ready.
- Auth uses JWT bearer tokens. `login` auto-creates an account if the email
  isn't recognized yet, so you can sign in immediately for demo purposes.
- The Anthropic API key stays server-side — the frontend never sees it.
