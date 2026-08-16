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
  createUser, findUserByEmail, findUserById, toPublicUser, updateUserPassword,

  createPasswordReset, findValidPasswordReset, markPasswordResetUsed,
  invalidateUserPasswordResets,

  createFocusSession, getFocusHistorySince, getFocusAllTime, getFocusDistinctDates,

  createSubject, getSubjectsForUser, getSubjectById, deleteSubject, updateSubjectProgress,

  createTask, getTasksForUserByDate, getTaskById, setTaskCompleted, deleteTask,
  getCompletedTasksCount, getTaskCountsSince,

  createCourse, updateCourseRow, getAllCourses, getCoursesByTeacher, getCourseById,
  createLesson, getLessonsForCourse, getLessonById, replaceLessonsForCourse, deleteCourse,

  createEnrollment, getEnrollment, getEnrollmentsForStudent, getEnrollmentsForCourse,
  getEnrollmentCountForCourse, getEnrollmentsForTeacher,

  upsertSubmission, getSubmission, getSubmissionById, getSubmissionsForCourseStudent,
  getSubmissionsForCourse, evaluateSubmission,
} = require("./db");
const { hashPassword, verifyPassword, sign, verify } = require("./auth");

const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me-in-production";
const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN || 60 * 60 * 24 * 7); // 7 days
const PASSWORD_RESET_EXPIRES_IN_MS = 30 * 60 * 1000; // 30 minutes
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
// Until a domain is verified in Resend, "onboarding@resend.dev" is the
// only address Resend allows sending from — swap this once you verify
// your own domain there.
const RESEND_FROM = process.env.RESEND_FROM || "StudySphere <onboarding@resend.dev>";
const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";
const COOKIE_NAME = "ss_token";

const MAX_BODY_BYTES = 1024 * 1024; // 1MB — plenty for auth payloads, guards against abuse
const MAX_UPLOAD_BODY_BYTES = 12 * 1024 * 1024; // 12MB — room for a base64-encoded PDF submission

/* =====================================================
   SMALL HELPERS
===================================================== */

function readBody(req, maxBytes = MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
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

/** Same as requireAuth, but also rejects any user whose role doesn't match. */
function requireRole(role, handler) {
  return requireAuth(async (req, res, params) => {
    if (req.user.role !== role) {
      return sendJson(res, 403, { message: `Only ${role}s can do that.` });
    }
    return handler(req, res, params);
  });
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
   FORGOT / RESET PASSWORD
   Emails are sent through Resend's HTTP API (https://resend.com) using
   Node's built-in `fetch` — no email SDK needed, keeping this backend
   dependency-free. If RESEND_API_KEY isn't set, the link is logged to
   the console instead so local dev still works without an account.
===================================================== */

async function sendPasswordResetEmail(user, resetUrl) {
  if (!RESEND_API_KEY) {
    // eslint-disable-next-line no-console
    console.log(`\n[password reset] No RESEND_API_KEY set — link for ${user.email}: ${resetUrl}\n`);
    return;
  }

  const html = `
    <div style="font-family: -apple-system, Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #111827;">Reset your StudySphere password</h2>
      <p style="color: #374151; line-height: 1.6;">
        We got a request to reset the password for this account
        (${escapeHtml(user.email)}). This link expires in 30 minutes.
      </p>
      <p style="margin: 28px 0;">
        <a href="${resetUrl}" style="background:#7c3aed;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
          Reset password
        </a>
      </p>
      <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
        If you didn't request this, you can safely ignore this email —
        your password won't change. Or paste this link into your browser:<br />
        <a href="${resetUrl}" style="color:#7c3aed;">${resetUrl}</a>
      </p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: user.email,
      subject: "Reset your StudySphere password",
      html,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    // eslint-disable-next-line no-console
    console.error(`[password reset] Resend send failed (${res.status}): ${errBody}`);
    // Don't throw — the reset token is already saved, and we never want
    // to leak send failures back to the client (same generic response
    // either way, so a delivery hiccup doesn't reveal account existence).
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function handleForgotPassword(req, res) {
  const body = await readBody(req);
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  // Always the same response whether or not the email is registered —
  // otherwise this endpoint could be used to check who has an account.
  const genericResponse = () =>
    sendJson(res, 200, {
      message: "If an account exists for that email, we've sent password reset instructions.",
    });

  if (!EMAIL_RE.test(email)) return genericResponse();

  const row = findUserByEmail(email);
  if (!row) return genericResponse();

  const user = toPublicUser(row);

  // A fresh request invalidates any reset link sent earlier so only the
  // newest one is ever usable.
  invalidateUserPasswordResets(user.id);

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRES_IN_MS).toISOString();

  createPasswordReset({
    id: crypto.randomUUID(),
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  const resetUrl = `${CORS_ORIGIN}/reset-password?token=${token}`;
  await sendPasswordResetEmail(user, resetUrl);

  // Only hand back the raw link when there's no real email being sent —
  // once RESEND_API_KEY is configured, the link should only ever reach
  // the inbox it belongs to.
  if (process.env.NODE_ENV === "production" || RESEND_API_KEY) {
    return genericResponse();
  }

  const payload = { message: "Password reset link generated.", devResetUrl: resetUrl };
  return sendJson(res, 200, payload);
}

async function handleResetPassword(req, res) {
  const body = await readBody(req);

  const token = typeof body.token === "string" ? body.token : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!token) {
    return sendJson(res, 400, { message: "Missing reset token." });
  }
  if (password.length < 8) {
    return sendJson(res, 422, { message: "Password must be at least 8 characters." });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const reset = findValidPasswordReset(tokenHash);

  if (!reset) {
    return sendJson(res, 400, {
      message: "This reset link is invalid or has expired. Request a new one.",
    });
  }

  const row = findUserById(reset.user_id);
  if (!row) {
    return sendJson(res, 400, { message: "This reset link is no longer valid." });
  }

  const { hash, salt } = hashPassword(password);
  updateUserPassword(row.id, hash, salt);
  markPasswordResetUsed(reset.id);

  // Log the user straight in so they land back in the app immediately.
  const authToken = sign({ sub: row.id }, JWT_SECRET, JWT_EXPIRES_IN);
  setAuthCookie(res, authToken);

  return sendJson(res, 200, { user: toPublicUser(findUserById(row.id)) });
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
   COURSES + LESSONS
===================================================== */

function toPublicLesson(lesson) {
  return {
    id: lesson.id,
    position: lesson.position,
    title: lesson.title,
    description: lesson.description ?? "",
    videoId: lesson.video_id ?? "",
    duration: lesson.duration ?? "",
  };
}

function toPublicCourse(course, lessons, extra = {}) {
  return {
    id: course.id,
    teacherId: course.teacher_id,
    title: course.title,
    category: course.category ?? "",
    level: course.level ?? "",
    description: course.description ?? "",
    thumbnail: course.thumbnail ?? "",
    instructor: course.instructor ?? "StudySphere Teacher",
    createdAt: course.created_at,
    lessons: lessons.map(toPublicLesson),
    ...extra,
  };
}

function validateLessonsInput(rawLessons) {
  if (!Array.isArray(rawLessons) || rawLessons.length === 0) {
    return { error: "At least one lesson is required." };
  }

  const lessons = [];
  for (let i = 0; i < rawLessons.length; i += 1) {
    const raw = rawLessons[i] || {};
    const title = typeof raw.title === "string" ? raw.title.trim().slice(0, 160) : "";
    const videoId = typeof raw.videoId === "string" ? raw.videoId.trim() : "";
    const duration = typeof raw.duration === "string" ? raw.duration.trim().slice(0, 40) : "";
    const description = typeof raw.description === "string" ? raw.description.trim().slice(0, 2000) : "";

    if (!title || !videoId || !duration) {
      return { error: `Lesson ${i + 1} needs a title, a valid video, and a duration.` };
    }

    lessons.push({ id: crypto.randomUUID(), title, description, videoId, duration });
  }

  return { lessons };
}

async function handleCreateCourse(req, res) {
  const body = await readBody(req, MAX_UPLOAD_BODY_BYTES);

  const title = typeof body.title === "string" ? body.title.trim().slice(0, 160) : "";
  const category = typeof body.category === "string" ? body.category.trim().slice(0, 60) : "";
  const description = typeof body.description === "string" ? body.description.trim().slice(0, 4000) : "";
  const level = typeof body.level === "string" && body.level.trim() ? body.level.trim() : "Beginner";
  const thumbnail = typeof body.thumbnail === "string" ? body.thumbnail : "";

  if (!title) return sendJson(res, 422, { message: "Course title is required." });
  if (!category) return sendJson(res, 422, { message: "Course category is required." });
  if (!description) return sendJson(res, 422, { message: "Course description is required." });
  if (!thumbnail) return sendJson(res, 422, { message: "Course thumbnail is required." });

  const { lessons, error } = validateLessonsInput(body.lessons);
  if (error) return sendJson(res, 422, { message: error });

  const id = crypto.randomUUID();
  createCourse({
    id,
    teacherId: req.user.id,
    title,
    category,
    level,
    description,
    thumbnail,
    instructor: req.user.name,
  });
  replaceLessonsForCourse(id, lessons);

  const course = getCourseById(id);
  const savedLessons = getLessonsForCourse(id);

  return sendJson(res, 201, { course: toPublicCourse(course, savedLessons, { enrolledCount: 0 }) });
}

async function handleUpdateCourse(req, res, params) {
  const existing = getCourseById(params.id);
  if (!existing || existing.teacher_id !== req.user.id) {
    return sendJson(res, 404, { message: "Course not found." });
  }

  const body = await readBody(req, MAX_UPLOAD_BODY_BYTES);

  const title = typeof body.title === "string" ? body.title.trim().slice(0, 160) : existing.title;
  const category = typeof body.category === "string" ? body.category.trim().slice(0, 60) : existing.category;
  const description = typeof body.description === "string" ? body.description.trim().slice(0, 4000) : existing.description;
  const level = typeof body.level === "string" && body.level.trim() ? body.level.trim() : existing.level;
  const thumbnail = typeof body.thumbnail === "string" && body.thumbnail ? body.thumbnail : existing.thumbnail;

  if (!title) return sendJson(res, 422, { message: "Course title is required." });

  updateCourseRow(params.id, req.user.id, { title, category, level, description, thumbnail });

  if (body.lessons) {
    const { lessons, error } = validateLessonsInput(body.lessons);
    if (error) return sendJson(res, 422, { message: error });
    replaceLessonsForCourse(params.id, lessons);
  }

  const course = getCourseById(params.id);
  const lessons = getLessonsForCourse(params.id);
  return sendJson(res, 200, {
    course: toPublicCourse(course, lessons, { enrolledCount: getEnrollmentCountForCourse(params.id) }),
  });
}

async function handleListCourses(req, res) {
  const courses = getAllCourses().map((course) => {
    const lessons = getLessonsForCourse(course.id);
    return toPublicCourse(course, lessons, { enrolledCount: getEnrollmentCountForCourse(course.id) });
  });
  return sendJson(res, 200, { courses });
}

async function handleGetCourse(req, res, params) {
  const course = getCourseById(params.id);
  if (!course) return sendJson(res, 404, { message: "Course not found." });

  const lessons = getLessonsForCourse(course.id);
  const extra = { enrolledCount: getEnrollmentCountForCourse(course.id) };

  const currentUser = getCurrentUser(req);
  if (currentUser?.role === "student") {
    extra.enrolled = !!getEnrollment(course.id, currentUser.id);
  }

  return sendJson(res, 200, { course: toPublicCourse(course, lessons, extra) });
}

async function handleDeleteCourse(req, res, params) {
  const existing = getCourseById(params.id);
  if (!existing || existing.teacher_id !== req.user.id) {
    return sendJson(res, 404, { message: "Course not found." });
  }

  deleteCourse(params.id, req.user.id);
  return sendJson(res, 200, { message: "Course deleted." });
}

async function handleTeacherCourses(req, res) {
  const courses = getCoursesByTeacher(req.user.id).map((course) => {
    const lessons = getLessonsForCourse(course.id);
    return toPublicCourse(course, lessons, { enrolledCount: getEnrollmentCountForCourse(course.id) });
  });
  return sendJson(res, 200, { courses });
}

/* =====================================================
   ENROLLMENT
===================================================== */

async function handleEnroll(req, res, params) {
  const course = getCourseById(params.id);
  if (!course) return sendJson(res, 404, { message: "Course not found." });

  if (!getEnrollment(course.id, req.user.id)) {
    createEnrollment({ id: crypto.randomUUID(), courseId: course.id, studentId: req.user.id });
  }

  return sendJson(res, 201, { message: "Enrolled.", enrolledCount: getEnrollmentCountForCourse(course.id) });
}

/** Builds the per-lesson status (locked / pending / submitted / approved /
 *  rejected) + remark for one student on one course. A lesson unlocks once
 *  the previous lesson's task submission has been approved by the teacher. */
function buildLessonProgress(lessons, submissions) {
  const byLessonId = new Map(submissions.map((s) => [s.lesson_id, s]));
  let previousApproved = true;

  return lessons.map((lesson) => {
    const submission = byLessonId.get(lesson.id) || null;
    const locked = !previousApproved;
    previousApproved = submission?.status === "approved";

    return {
      lessonId: lesson.id,
      locked,
      status: locked ? "locked" : submission ? submission.status : "pending",
      remark: submission?.remark ?? null,
      fileName: submission?.file_name ?? null,
      submittedAt: submission?.submitted_at ?? null,
      evaluatedAt: submission?.evaluated_at ?? null,
    };
  });
}

async function handleStudentCourses(req, res) {
  const enrollments = getEnrollmentsForStudent(req.user.id);

  const courses = enrollments.map((enrollment) => {
    const course = getCourseById(enrollment.course_id);
    if (!course) return null;
    const lessons = getLessonsForCourse(course.id);
    const submissions = getSubmissionsForCourseStudent(course.id, req.user.id);
    const progress = buildLessonProgress(lessons, submissions);
    const approvedCount = progress.filter((p) => p.status === "approved").length;

    return toPublicCourse(course, lessons, {
      enrolledAt: enrollment.enrolled_at,
      progressPct: lessons.length ? Math.round((approvedCount / lessons.length) * 100) : 0,
      lessonProgress: progress,
    });
  }).filter(Boolean);

  return sendJson(res, 200, { courses });
}

async function handleStudentCourseDetail(req, res, params) {
  const course = getCourseById(params.id);
  if (!course) return sendJson(res, 404, { message: "Course not found." });

  const enrollment = getEnrollment(course.id, req.user.id);
  if (!enrollment) return sendJson(res, 403, { message: "You're not enrolled in this course." });

  const lessons = getLessonsForCourse(course.id);
  const submissions = getSubmissionsForCourseStudent(course.id, req.user.id);
  const progress = buildLessonProgress(lessons, submissions);
  const approvedCount = progress.filter((p) => p.status === "approved").length;

  return sendJson(res, 200, {
    course: toPublicCourse(course, lessons, {
      enrolledAt: enrollment.enrolled_at,
      progressPct: lessons.length ? Math.round((approvedCount / lessons.length) * 100) : 0,
      lessonProgress: progress,
    }),
  });
}

/* =====================================================
   SUBMISSIONS (the per-lesson task's PDF upload)
===================================================== */

async function handleSubmitLessonTask(req, res, params) {
  const course = getCourseById(params.id);
  if (!course) return sendJson(res, 404, { message: "Course not found." });

  if (!getEnrollment(course.id, req.user.id)) {
    return sendJson(res, 403, { message: "You're not enrolled in this course." });
  }

  const lessons = getLessonsForCourse(course.id);
  const lesson = getLessonById(params.lessonId, course.id);
  if (!lesson) return sendJson(res, 404, { message: "Lesson not found." });

  const submissions = getSubmissionsForCourseStudent(course.id, req.user.id);
  const progress = buildLessonProgress(lessons, submissions);
  const lessonStatus = progress.find((p) => p.lessonId === lesson.id);
  if (lessonStatus?.locked) {
    return sendJson(res, 403, { message: "Complete the previous lesson's task first." });
  }

  const body = await readBody(req, MAX_UPLOAD_BODY_BYTES);
  const fileName = typeof body.fileName === "string" && body.fileName.trim() ? body.fileName.trim().slice(0, 200) : "submission.pdf";
  const fileData = typeof body.fileData === "string" ? body.fileData : "";

  if (!fileData) return sendJson(res, 422, { message: "A PDF file is required." });
  if (!fileName.toLowerCase().endsWith(".pdf")) {
    return sendJson(res, 422, { message: "Only PDF files can be submitted for a lesson task." });
  }

  const submission = upsertSubmission({
    id: crypto.randomUUID(),
    lessonId: lesson.id,
    courseId: course.id,
    studentId: req.user.id,
    fileName,
    fileData,
  });

  return sendJson(res, 201, {
    submission: {
      id: submission.id,
      lessonId: submission.lesson_id,
      status: submission.status,
      fileName: submission.file_name,
      submittedAt: submission.submitted_at,
    },
  });
}

/* =====================================================
   TEACHER: STUDENTS + EVALUATION
===================================================== */

async function handleTeacherStudents(req, res) {
  const roster = getEnrollmentsForTeacher(req.user.id);
  return sendJson(res, 200, {
    students: roster.map((row) => ({
      enrollmentId: row.id,
      studentId: row.student_id,
      studentName: row.student_name,
      studentEmail: row.student_email,
      courseId: row.course_id,
      courseTitle: row.course_title,
      enrolledAt: row.enrolled_at,
    })),
  });
}

async function handleTeacherCourseStudents(req, res, params) {
  const course = getCourseById(params.id);
  if (!course || course.teacher_id !== req.user.id) {
    return sendJson(res, 404, { message: "Course not found." });
  }

  const lessons = getLessonsForCourse(course.id);
  const enrollments = getEnrollmentsForCourse(course.id);
  const allSubmissions = getSubmissionsForCourse(course.id);

  const students = enrollments.map((enrollment) => {
    const studentSubmissions = allSubmissions.filter((s) => s.student_id === enrollment.student_id);
    const progress = buildLessonProgress(lessons, studentSubmissions);

    return {
      enrollmentId: enrollment.id,
      studentId: enrollment.student_id,
      studentName: enrollment.student_name,
      studentEmail: enrollment.student_email,
      enrolledAt: enrollment.enrolled_at,
      lessons: lessons.map((lesson, index) => {
        const p = progress[index];
        const submission = studentSubmissions.find((s) => s.lesson_id === lesson.id) || null;
        return {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          locked: p.locked,
          status: p.status,
          remark: p.remark,
          submissionId: submission?.id ?? null,
          fileName: submission?.file_name ?? null,
          fileData: submission?.file_data ?? null,
          submittedAt: submission?.submitted_at ?? null,
        };
      }),
    };
  });

  return sendJson(res, 200, { course: toPublicCourse(course, lessons), students });
}

async function handleEvaluateSubmission(req, res, params) {
  const submission = getSubmissionById(params.id);
  if (!submission) return sendJson(res, 404, { message: "Submission not found." });

  const course = getCourseById(submission.course_id);
  if (!course || course.teacher_id !== req.user.id) {
    return sendJson(res, 404, { message: "Submission not found." });
  }

  const body = await readBody(req);
  const status = body.status === "approved" || body.status === "rejected" ? body.status : null;
  if (!status) return sendJson(res, 422, { message: "status must be 'approved' or 'rejected'." });

  const remark = typeof body.remark === "string" ? body.remark.trim().slice(0, 2000) : "";
  if (!remark) return sendJson(res, 422, { message: "A remark is required for the student." });

  evaluateSubmission(submission.id, status, remark);
  return sendJson(res, 200, { message: "Submission evaluated." });
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
  { method: "POST", path: "/api/auth/forgot-password", handler: handleForgotPassword },
  { method: "POST", path: "/api/auth/reset-password", handler: handleResetPassword },

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

  { method: "GET", path: "/api/courses", handler: handleListCourses },
  { method: "POST", path: "/api/courses", handler: requireRole("teacher", handleCreateCourse) },
  { method: "GET", path: "/api/courses/:id", handler: handleGetCourse },
  { method: "PUT", path: "/api/courses/:id", handler: requireRole("teacher", handleUpdateCourse) },
  { method: "DELETE", path: "/api/courses/:id", handler: requireRole("teacher", handleDeleteCourse) },
  { method: "POST", path: "/api/courses/:id/enroll", handler: requireRole("student", handleEnroll) },
  { method: "POST", path: "/api/courses/:id/lessons/:lessonId/submit", handler: requireRole("student", handleSubmitLessonTask) },

  { method: "GET", path: "/api/teacher/courses", handler: requireRole("teacher", handleTeacherCourses) },
  { method: "GET", path: "/api/teacher/students", handler: requireRole("teacher", handleTeacherStudents) },
  { method: "GET", path: "/api/teacher/courses/:id/students", handler: requireRole("teacher", handleTeacherCourseStudents) },
  { method: "POST", path: "/api/submissions/:id/evaluate", handler: requireRole("teacher", handleEvaluateSubmission) },

  { method: "GET", path: "/api/student/courses", handler: requireRole("student", handleStudentCourses) },
  { method: "GET", path: "/api/student/courses/:id", handler: requireRole("student", handleStudentCourseDetail) },
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
