# Vidya AI

A full-stack, AI-powered educational app: student dashboard, AI chat tutor,
subject-wise learning modules, quizzes, progress tracking, notes, assignments,
and dark/light mode — with a clean blue-white UI.

```
vidya-ai/
├── backend/            Express API (auth, subjects, quizzes, notes, assignments, AI chat proxy)
├── frontend/            React + Vite + Tailwind app
└── docker-compose.yml   Run both together with one command
```

---

## Option A — Run locally with Docker (recommended, one command)

Requires Docker Desktop (or Docker Engine + Compose) installed.

```bash
cd vidya-ai
cp .env.example .env
# edit .env and set ANTHROPIC_API_KEY (get one at https://console.anthropic.com)

docker compose up --build
```

- Frontend: http://localhost:5174
- Backend:  http://localhost:4001

Stop with `Ctrl+C`, or `docker compose down` to remove the containers.

> Rebuilding after a code change: `docker compose up --build` again. The
> frontend's `VITE_API_URL` is baked in at build time (see `docker-compose.yml`),
> so if you change the backend port/URL, rebuild the frontend image too.

---

## Option B — Run locally without Docker

**1. Backend**
```bash
cd backend
npm install
cp .env     # then set ANTHROPIC_API_KEY
npm run dev                # http://localhost:4001
```

**2. Frontend** (in a second terminal)
```bash
cd frontend
npm install
cp .env     # defaults to http://localhost:4000/api
npm run dev                 # http://localhost:5173
```

Open http://localhost:5174, sign in with any name/email/password (an
account is created automatically), and you're in.

---

## Deploying to production

The app is two independent deployables: a Node API and a static frontend
build. Any host that runs Node works for the backend; any static host works
for the frontend.

### Backend (pick one)

**Render / Railway / Fly.io** (all support "deploy from Dockerfile" or a
Node buildpack):
1. Point the service at the `backend/` folder (or its Dockerfile).
2. Build command: `npm install` · Start command: `node src/server.js`
   (skip both if deploying the Dockerfile directly).
3. Set environment variables: `JWT_SECRET`, `ANTHROPIC_API_KEY`,
   `ANTHROPIC_MODEL`, and `CLIENT_ORIGIN` = your deployed frontend URL
   (e.g. `https://vidya-ai.vercel.app`) so CORS allows it.
4. Note the resulting backend URL, e.g. `https://vidya-api.onrender.com`.

### Frontend (pick one)

**Vercel / Netlify:**
1. Import the `frontend/` folder as the project root.
2. Build command: `npm run build` · Output directory: `dist`.
3. Set env var `VITE_API_URL` = `https://vidya-api.onrender.com/api`
   (your deployed backend URL + `/api`) — **before** building, since Vite
   inlines `VITE_*` vars at build time, not at runtime.
4. Deploy. Both hosts auto-detect Vite and handle SPA routing fallback;
   if you self-host the static build elsewhere, keep the SPA fallback rule
   from `frontend/nginx.conf` (all routes → `index.html`).

### Checklist after deploying both
- [ ] Backend `CLIENT_ORIGIN` matches the live frontend URL exactly (protocol + domain, no trailing slash)
- [ ] Frontend `VITE_API_URL` points at `<backend-url>/api`
- [ ] `ANTHROPIC_API_KEY` is set on the **backend** only — never in frontend env vars, since those ship to the browser
- [ ] `JWT_SECRET` is a long random string, different from the example

---

## Why this split

- The **AI Tutor** chat calls your own backend (`POST /api/chat`), which
  holds the Anthropic API key server-side — the browser never sees it.
- **Quizzes** are graded server-side (`POST /api/quizzes/:id/submit`) so the
  answer key never ships to the client.
- Auth uses JWT bearer tokens; notes and assignments are scoped per user.
- Data lives in an in-memory store for zero-setup demoing — see
  `backend/src/data/store.js` for where to plug in a real database (the
  function signatures are already shaped for a drop-in swap).

See `backend/README.md` for the full API reference.
