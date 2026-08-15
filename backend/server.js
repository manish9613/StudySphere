// StudySphere authentication API.
//
// Deliberately dependency-free: uses only Node's built-in `http`, `crypto`,
// and `sqlite` modules. Run it with `node server.js` — no `npm install`
// step required. See README.md in this folder for full docs.

const http = require("node:http");
const crypto = require("node:crypto");

const { loadEnv } = require("./env");
loadEnv();

const {
  createUser, findUserByEmail, findUserById, toPublicUser,

  createFocusSession, getFocusHistorySince, getFocusAllTime, getFocusDistinctDates,

  createSubject, getSubjectsForUser, getSubjectById, deleteSubject, updateSubjectProgress,

  createTask, getTasksForUserByDate, getTaskById, setTaskCompleted, deleteTask,
  getCompletedTasksCount, getTaskCountsSince,
} = require("./db");
const { hashPassword, verifyPassword, sign, verify } = require("./auth");

const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me-in-production";
const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN || 60 * 60 * 24 * 7); // 7 days
const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";
const COOKIE_NAME = "ss_token";

const MAX_BODY_BYTES = 1024 * 1024; // 1MB — plenty for auth payloads, guards against abuse

/* =====================================================
   SMALL HELPERS
===================================================== */

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Payload too large"), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      if (chunks.length === 0) return resolve({});

      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(Object.assign(new Error("Invalid JSON body"), { statusCode: 400 }));
      }
    });

    req.on("error", reject);
  });
}

function parseCookies(req) {
  const header = req.headers.cookie;
  const cookies = {};
  if (!header) return cookies;

  for (const pair of header.split(";")) {
    const eqIndex = pair.indexOf("=");
    if (eqIndex === -1) continue;
    const key = pair.slice(0, eqIndex).trim();
    const value = pair.slice(eqIndex + 1).trim();
    cookies[key] = decodeURIComponent(value);
  }

  return cookies;
}

function setAuthCookie(res, token) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    `Max-Age=${JWT_EXPIRES_IN}`,
    "SameSite=Lax",
  ];

  if (COOKIE_SECURE) parts.push("Secure");

  res.setHeader("Set-Cookie", parts.join("; "));
}

function clearAuthCookie(res) {
  const parts = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "Max-Age=0",
    "SameSite=Lax",
  ];

  if (COOKIE_SECURE) parts.push("Secure");

  res.setHeader("Set-Cookie", parts.join("; "));
}

function sendJson(res, statusCode, body) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(payload);
}

function applyCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function getCurrentUser(req) {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  const payload = verify(token, JWT_SECRET);
  if (!payload || !payload.sub) return null;

  const row = findUserById(payload.sub);
  return row ? toPublicUser(row) : null;
}

/** Wraps a handler so it only runs for an authenticated request, attaching
 *  the current user as req.user. Every /api/focus and /api/organize route
 *  uses this — all data is scoped to the logged-in user's own records. */
function requireAuth(handler) {
  return async (req, res, params) => {
    const user = getCurrentUser(req);
    if (!user) return sendJson(res, 401, { message: "Not authenticated." });
    req.user = user;
    return handler(req, res, params);
  };
}

/* =====================================================
   DATE HELPERS
   All "date" values are plain YYYY-MM-DD strings so that
   focus/task history can be grouped and displayed day by
   day rather than as a single hardcoded snapshot.
===================================================== */

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function isValidDateStr(value) {
  return typeof value === "string" && DATE_RE.test(value);
}

function daysAgoStr(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

function addDaysStr(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Current streak of consecutive days (ending today or yesterday) that
 *  have at least one logged focus session. */
function computeStreak(distinctDates) {
  const dateSet = new Set(distinctDates);
  let streak = 0;
  let cursor = todayStr();

  // Today doesn't have to have a session yet for the streak to still be
  // "alive" — but the streak only counts if yesterday (or today) is covered.
  if (!dateSet.has(cursor)) {
    cursor = addDaysStr(cursor, -1);
    if (!dateSet.has(cursor)) return 0;
  }

  while (dateSet.has(cursor)) {
    streak += 1;
    cursor = addDaysStr(cursor, -1);
  }

  return streak;
}

/* =====================================================
   VALIDATION
===================================================== */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSignup(body) {
  const errors = {};

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role = body.role === "teacher" ? "teacher" : body.role === "student" ? "student" : null;

  if (name.length < 2) errors.name = "Name must be at least 2 characters.";
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  if (password.length < 8) errors.password = "Password must be at least 8 characters.";
  if (!role) errors.role = "Role must be 'student' or 'teacher'.";

  return { errors, values: { name, email, password, role } };
}

/* =====================================================
   ROUTE HANDLERS
===================================================== */

async function handleSignup(req, res) {
  const body = await readBody(req);
  const { errors, values } = validateSignup(body);

  if (Object.keys(errors).length > 0) {
    return sendJson(res, 422, { message: "Validation failed", errors });
  }

  const { name, email, password, role } = values;

  const expertise = typeof body.expertise === "string" ? body.expertise.trim().slice(0, 200) : null;
  const bio = typeof body.bio === "string" ? body.bio.trim().slice(0, 1000) : null;

  if (findUserByEmail(email)) {
    return sendJson(res, 409, {
      message: "An account with that email already exists.",
      errors: { email: "Email already in use." },
    });
  }

  const { hash, salt } = hashPassword(password);
  const id = crypto.randomUUID();

  createUser({
    id,
    name,
    email,
    passwordHash: hash,
    passwordSalt: salt,
    role,
    expertise,
    bio,
  });

  const token = sign({ sub: id }, JWT_SECRET, JWT_EXPIRES_IN);
  setAuthCookie(res, token);

  const user = toPublicUser(findUserById(id));
  return sendJson(res, 201, { user });
}

async function handleLogin(req, res) {
  const body = await readBody(req);

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return sendJson(res, 422, { message: "Email and password are required." });
  }

  const row = findUserByEmail(email);

  // Same generic error whether the email doesn't exist or the password is
  // wrong — avoids leaking which emails are registered.
  const invalidCreds = () =>
    sendJson(res, 401, { message: "Invalid email or password." });

  if (!row) return invalidCreds();

  const valid = verifyPassword(password, row.password_hash, row.password_salt);
  if (!valid) return invalidCreds();

  const token = sign({ sub: row.id }, JWT_SECRET, JWT_EXPIRES_IN);
  setAuthCookie(res, token);

  return sendJson(res, 200, { user: toPublicUser(row) });
}

async function handleLogout(req, res) {
  clearAuthCookie(res);
  return sendJson(res, 200, { message: "Logged out." });
}

async function handleMe(req, res) {
  const user = getCurrentUser(req);
  if (!user) return sendJson(res, 401, { message: "Not authenticated." });
  return sendJson(res, 200, { user });
}

/* =====================================================
   FOCUS ROUTES
   Every session a student logs (timer completion or a
   manually stopped stopwatch) is stored per-user, per-day
   — nothing about a student's study time is hardcoded.
===================================================== */

async function handleCreateFocusSession(req, res) {
  const body = await readBody(req);

  const seconds = Number(body.seconds);
  const date = isValidDateStr(body.date) ? body.date : todayStr();
  const mode = body.mode === "stopwatch" ? "stopwatch" : "timer";

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return sendJson(res, 422, { message: "seconds must be a positive number." });
  }

  createFocusSession({
    id: crypto.randomUUID(),
    userId: req.user.id,
    date,
    seconds: Math.round(seconds),
    mode,
  });

  return sendJson(res, 201, { message: "Session logged." });
}

async function handleFocusStats(req, res) {
  const userId = req.user.id;
  const today = todayStr();

  // Look back 60 days — enough for a weekly rollup and a day-by-day
  // history chart, without scanning the whole table every request.
  const since = daysAgoStr(59);

  const history = getFocusHistorySince(userId, since); // [{date, seconds, sessions}]
  const byDate = new Map(history.map((row) => [row.date, row]));

  const weekStart = daysAgoStr(6);
  let weekSeconds = 0;
  for (const row of history) {
    if (row.date >= weekStart) weekSeconds += row.seconds;
  }

  const todayRow = byDate.get(today);
  const allTime = getFocusAllTime(userId);
  const distinctDates = getFocusDistinctDates(userId);
  const streakDays = computeStreak(distinctDates);

  // Last 14 days, oldest first, zero-filled — this is what a "day by day"
  // focus history chart on the frontend renders directly.
  const dailyHistory = [];
  for (let i = 13; i >= 0; i -= 1) {
    const date = daysAgoStr(i);
    const row = byDate.get(date);
    dailyHistory.push({
      date,
      seconds: row ? row.seconds : 0,
      sessions: row ? row.sessions : 0,
    });
  }

  return sendJson(res, 200, {
    today: { date: today, seconds: todayRow ? todayRow.seconds : 0, sessions: todayRow ? todayRow.sessions : 0 },
    weekSeconds,
    allTimeSeconds: allTime.seconds,
    allTimeSessions: allTime.sessions,
    streakDays,
    dailyHistory,
  });
}

/* =====================================================
   ORGANIZE ROUTES: SUBJECTS
===================================================== */

async function handleListSubjects(req, res) {
  const subjects = getSubjectsForUser(req.user.id).map((s) => ({
    id: s.id,
    name: s.name,
    icon: s.icon,
    topicsCount: s.topics_count,
    progressPct: s.progress_pct,
  }));
  return sendJson(res, 200, { subjects });
}

async function handleCreateSubject(req, res) {
  const body = await readBody(req);
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";

  if (!name) return sendJson(res, 422, { message: "name is required." });

  const icon = typeof body.icon === "string" && body.icon.trim() ? body.icon.trim().slice(0, 8) : "📘";
  const topicsCount = Number.isFinite(Number(body.topicsCount)) ? Math.max(0, Math.round(Number(body.topicsCount))) : 0;

  const id = crypto.randomUUID();
  createSubject({ id, userId: req.user.id, name, icon, topicsCount, progressPct: 0 });

  return sendJson(res, 201, { subject: { id, name, icon, topicsCount, progressPct: 0 } });
}

async function handleDeleteSubject(req, res, params) {
  const existing = getSubjectById(params.id, req.user.id);
  if (!existing) return sendJson(res, 404, { message: "Subject not found." });

  deleteSubject(params.id, req.user.id);
  return sendJson(res, 200, { message: "Subject deleted." });
}

/* =====================================================
   ORGANIZE ROUTES: TASKS
===================================================== */

async function handleListTasks(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const date = isValidDateStr(url.searchParams.get("date")) ? url.searchParams.get("date") : todayStr();

  const tasks = getTasksForUserByDate(req.user.id, date).map((t) => ({
    id: t.id,
    subjectId: t.subject_id,
    title: t.title,
    durationMin: t.duration_min,
    priority: t.priority,
    date: t.date,
    completed: !!t.completed,
  }));

  return sendJson(res, 200, { date, tasks });
}

async function handleCreateTask(req, res) {
  const body = await readBody(req);
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 160) : "";

  if (!title) return sendJson(res, 422, { message: "title is required." });

  const date = isValidDateStr(body.date) ? body.date : todayStr();
  const priority = ["high", "medium", "low"].includes(body.priority) ? body.priority : "medium";
  const durationMin = Number.isFinite(Number(body.durationMin)) ? Math.max(1, Math.round(Number(body.durationMin))) : 30;
  const subjectId = typeof body.subjectId === "string" && body.subjectId ? body.subjectId : null;

  if (subjectId && !getSubjectById(subjectId, req.user.id)) {
    return sendJson(res, 422, { message: "Unknown subjectId." });
  }

  const id = crypto.randomUUID();
  createTask({ id, userId: req.user.id, subjectId, title, durationMin, priority, date });

  return sendJson(res, 201, {
    task: { id, subjectId, title, durationMin, priority, date, completed: false },
  });
}

async function handleUpdateTask(req, res, params) {
  const existing = getTaskById(params.id, req.user.id);
  if (!existing) return sendJson(res, 404, { message: "Task not found." });

  const body = await readBody(req);
  if (typeof body.completed !== "boolean") {
    return sendJson(res, 422, { message: "completed (boolean) is required." });
  }

  setTaskCompleted(params.id, req.user.id, body.completed);
  return sendJson(res, 200, { task: { ...existing, completed: body.completed } });
}

async function handleDeleteTask(req, res, params) {
  const existing = getTaskById(params.id, req.user.id);
  if (!existing) return sendJson(res, 404, { message: "Task not found." });

  deleteTask(params.id, req.user.id);
  return sendJson(res, 200, { message: "Task deleted." });
}

async function handleOrganizeSummary(req, res) {
  const userId = req.user.id;
  const subjects = getSubjectsForUser(userId);
  const completedTasks = getCompletedTasksCount(userId);

  const since = daysAgoStr(6);
  const counts = getTaskCountsSince(userId, since);
  const weekTotal = counts.reduce((sum, row) => sum + row.total, 0);
  const weekCompleted = counts.reduce((sum, row) => sum + row.completed, 0);

  return sendJson(res, 200, {
    activeSubjects: subjects.length,
    tasksCompletedAllTime: completedTasks,
    weekTasksTotal: weekTotal,
    weekTasksCompleted: weekCompleted,
  });
}

/* =====================================================
   ROUTER
   Supports simple ":param" path segments so /api/.../:id
   routes can extract an id without a routing library.
===================================================== */

const routes = [
  { method: "POST", path: "/api/auth/signup", handler: handleSignup },
  { method: "POST", path: "/api/auth/login", handler: handleLogin },
  { method: "POST", path: "/api/auth/logout", handler: handleLogout },
  { method: "GET", path: "/api/auth/me", handler: handleMe },

  { method: "POST", path: "/api/focus/sessions", handler: requireAuth(handleCreateFocusSession) },
  { method: "GET", path: "/api/focus/stats", handler: requireAuth(handleFocusStats) },

  { method: "GET", path: "/api/organize/subjects", handler: requireAuth(handleListSubjects) },
  { method: "POST", path: "/api/organize/subjects", handler: requireAuth(handleCreateSubject) },
  { method: "DELETE", path: "/api/organize/subjects/:id", handler: requireAuth(handleDeleteSubject) },

  { method: "GET", path: "/api/organize/tasks", handler: requireAuth(handleListTasks) },
  { method: "POST", path: "/api/organize/tasks", handler: requireAuth(handleCreateTask) },
  { method: "PATCH", path: "/api/organize/tasks/:id", handler: requireAuth(handleUpdateTask) },
  { method: "DELETE", path: "/api/organize/tasks/:id", handler: requireAuth(handleDeleteTask) },

  { method: "GET", path: "/api/organize/summary", handler: requireAuth(handleOrganizeSummary) },
];

function matchRoute(method, pathname) {
  for (const route of routes) {
    if (route.method !== method) continue;

    const routeParts = route.path.split("/").filter(Boolean);
    const pathParts = pathname.split("/").filter(Boolean);
    if (routeParts.length !== pathParts.length) continue;

    const params = {};
    let matched = true;

    for (let i = 0; i < routeParts.length; i += 1) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];

      if (routePart.startsWith(":")) {
        params[routePart.slice(1)] = decodeURIComponent(pathPart);
      } else if (routePart !== pathPart) {
        matched = false;
        break;
      }
    }

    if (matched) return { route, params };
  }

  return null;
}

const server = http.createServer(async (req, res) => {
  applyCors(req, res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/health") {
    return sendJson(res, 200, { status: "ok" });
  }

  const match = matchRoute(req.method, url.pathname);

  if (!match) {
    return sendJson(res, 404, { message: "Not found." });
  }

  try {
    await match.route.handler(req, res, match.params);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    if (statusCode === 500) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    sendJson(res, statusCode, { message: err.message || "Internal server error." });
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`StudySphere auth API listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Allowing credentialed requests from ${CORS_ORIGIN}`);
});
