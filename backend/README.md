# StudySphere Auth API

A small, self-contained authentication backend for StudySphere.

**Zero external dependencies.** It's built entirely on Node's built-ins —
`node:http`, `node:sqlite`, `node:crypto` — so there is no `npm install`
step. Just run it.

Requires **Node 22.5+** (for the built-in `node:sqlite` module).

## Run it

```bash
cd backend
node server.js
```

You should see:

```
StudySphere auth API listening on http://localhost:4000
Allowing credentialed requests from http://localhost:5173
```

That's it — a `studysphere.db` SQLite file is created next to `server.js`
on first run and holds all user accounts.

For auto-restart on file changes during development:

```bash
node --watch server.js
```

## Configuration

Copy `.env.example` to `.env` to override any defaults:

| Variable          | Default                    | Purpose                                     |
|-------------------|-----------------------------|----------------------------------------------|
| `PORT`            | `4000`                      | Port the API listens on                      |
| `CORS_ORIGIN`     | `http://localhost:5173`     | Frontend origin allowed to send credentials   |
| `JWT_SECRET`      | (dev default — **change in prod**) | Secret used to sign session tokens    |
| `JWT_EXPIRES_IN`  | `604800` (7 days)           | Session token lifetime, in seconds            |
| `COOKIE_SECURE`   | `false`                     | Set `true` when served over HTTPS             |

## How auth works

- Passwords are hashed with **scrypt** (a random salt per user, stored
  alongside the hash) and compared with a constant-time check — never
  stored or logged in plaintext.
- On signup/login, the server signs a JWT-shaped session token
  (`header.payload.signature`, HMAC-SHA256) and sets it as an **httpOnly,
  SameSite=Lax cookie**. The frontend never touches the token directly —
  no XSS-accessible `localStorage` token — it just calls the API with
  `credentials: "include"` and the browser handles the cookie.
- `GET /api/auth/me` is the source of truth for "who is logged in" —
  the frontend calls it on load rather than trusting anything cached
  client-side.

## API reference

All request/response bodies are JSON. All responses include CORS headers
for `CORS_ORIGIN` with `credentials: true`.

### `POST /api/auth/signup`

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "at-least-8-characters",
  "role": "student",       // "student" | "teacher"
  "expertise": "Mathematics",  // teacher only, optional
  "bio": "..."                  // teacher only, optional
}
```

- `201` → `{ "user": { id, name, email, role, ... } }`, sets session cookie
- `409` → email already registered
- `422` → validation failed, `{ "errors": { field: message } }`

### `POST /api/auth/login`

```json
{ "email": "ada@example.com", "password": "..." }
```

- `200` → `{ "user": {...} }`, sets session cookie
- `401` → invalid email or password (same message either way, to avoid
  leaking which emails are registered)

### `POST /api/auth/logout`

- `200` → clears the session cookie

### `GET /api/auth/me`

- `200` → `{ "user": {...} }` if a valid session cookie is present
- `401` → not authenticated

### `POST /api/auth/forgot-password`

```json
{ "email": "ada@example.com" }
```

- `200` → always, regardless of whether the email is registered (so this
  endpoint can't be used to check who has an account):
  `{ "message": "..." }`
- Sends the reset email through [Resend](https://resend.com) using
  Node's built-in `fetch` (no email SDK dependency). Set `RESEND_API_KEY`
  in `backend/.env` to enable real sending — see `.env.example`. Without
  a key, the link is logged to the server console instead, and the API
  response includes `devResetUrl` so the flow is still testable locally.
- Reset tokens expire after 30 minutes and are single-use; requesting a
  new one invalidates any link sent earlier.

### `POST /api/auth/reset-password`

```json
{ "token": "...", "password": "at-least-8-characters" }
```

- `200` → `{ "user": {...} }`, sets a session cookie (the user is signed
  in immediately)
- `400` → token missing, invalid, expired, or already used
- `422` → password too short

### `GET /api/health`

- `200` → `{ "status": "ok" }` — useful for uptime checks

### Focus sessions (auth required)

All routes below require the session cookie and are scoped to the logged-in
user — there is no cross-user data.

- `POST /api/focus/sessions` — `{ seconds, mode?: "timer"|"stopwatch", date?: "YYYY-MM-DD" }`
  logs one completed/stopped focus session for that day.
- `GET /api/focus/stats` — returns today's total, this week's total,
  all-time total, current day streak, and a zero-filled 14-day
  `dailyHistory` array — computed from the logged sessions, not hardcoded.

### Organize: subjects (auth required)

- `GET /api/organize/subjects` — the user's subjects.
- `POST /api/organize/subjects` — `{ name, icon?, topicsCount? }`.
- `DELETE /api/organize/subjects/:id`.

### Organize: tasks (auth required)

- `GET /api/organize/tasks?date=YYYY-MM-DD` — tasks for a given day
  (defaults to today).
- `POST /api/organize/tasks` — `{ title, subjectId?, durationMin?, priority?, date? }`.
- `PATCH /api/organize/tasks/:id` — `{ completed: boolean }`.
- `DELETE /api/organize/tasks/:id`.
- `GET /api/organize/summary` — active subject count, all-time completed
  tasks, and this week's completed/total task counts.

## Security notes for production

This is a solid, real implementation — but before deploying publicly:

1. Set a long random `JWT_SECRET` (see the comment in `.env.example` for
   a one-liner to generate one) and keep it out of version control.
2. Set `COOKIE_SECURE=true` and serve over HTTPS.
3. Put the server behind a reverse proxy (nginx/Caddy) for TLS termination.
4. Add rate limiting on `/api/auth/login` and `/api/auth/signup` if you
   expect public traffic (this implementation has none built in).
5. `node:sqlite` is still marked experimental by Node — fine for a
   student project or internal tool; swap in Postgres/MySQL for
   higher-stakes production use.
