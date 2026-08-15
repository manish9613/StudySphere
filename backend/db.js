// Persistence layer for StudySphere auth.
// Uses Node's built-in `node:sqlite` (stable as of Node 22.5+) so the
// backend needs zero third-party dependencies — no `npm install` required.

const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const DB_PATH = path.join(__dirname, "studysphere.db");

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    role          TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
    expertise     TEXT,
    bio           TEXT,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
`);

/* =====================================================
   FOCUS SESSIONS
   One row per completed/stopped focus session. Stats
   (today, this week, all-time, streak, day-by-day
   history) are derived from these rows per-user instead
   of being hardcoded on the frontend.
===================================================== */

db.exec(`
  CREATE TABLE IF NOT EXISTS focus_sessions (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    date       TEXT NOT NULL,   -- YYYY-MM-DD, the day this session counts toward
    seconds    INTEGER NOT NULL CHECK (seconds > 0),
    mode       TEXT NOT NULL DEFAULT 'timer',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_date
  ON focus_sessions (user_id, date);
`);

/* =====================================================
   ORGANIZE: SUBJECTS + TASKS
===================================================== */

db.exec(`
  CREATE TABLE IF NOT EXISTS subjects (
    id           TEXT PRIMARY KEY,
    user_id      TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    name         TEXT NOT NULL,
    icon         TEXT NOT NULL DEFAULT '📘',
    topics_count INTEGER NOT NULL DEFAULT 0,
    progress_pct INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_subjects_user ON subjects (user_id);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    subject_id    TEXT REFERENCES subjects (id) ON DELETE SET NULL,
    title         TEXT NOT NULL,
    duration_min  INTEGER NOT NULL DEFAULT 30,
    priority      TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    date          TEXT NOT NULL,   -- YYYY-MM-DD this task belongs to
    completed     INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks (user_id, date);
`);

/* =====================================================
   QUERIES
===================================================== */

const insertUserStmt = db.prepare(`
  INSERT INTO users (id, name, email, password_hash, password_salt, role, expertise, bio)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const findByEmailStmt = db.prepare(`
  SELECT * FROM users WHERE email = ? COLLATE NOCASE
`);

const findByIdStmt = db.prepare(`
  SELECT * FROM users WHERE id = ?
`);

function createUser({ id, name, email, passwordHash, passwordSalt, role, expertise, bio }) {
  insertUserStmt.run(id, name, email, passwordHash, passwordSalt, role, expertise ?? null, bio ?? null);
}

function findUserByEmail(email) {
  return findByEmailStmt.get(email) ?? null;
}

function findUserById(id) {
  return findByIdStmt.get(id) ?? null;
}

/** Strips sensitive fields before a user record is ever sent to the client. */
function toPublicUser(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    expertise: row.expertise ?? undefined,
    bio: row.bio ?? undefined,
    createdAt: row.created_at,
  };
}

/* =====================================================
   FOCUS SESSIONS QUERIES
===================================================== */

const insertFocusSessionStmt = db.prepare(`
  INSERT INTO focus_sessions (id, user_id, date, seconds, mode)
  VALUES (?, ?, ?, ?, ?)
`);

const focusSessionsForUserSinceStmt = db.prepare(`
  SELECT date, SUM(seconds) AS seconds, COUNT(*) AS sessions
  FROM focus_sessions
  WHERE user_id = ? AND date >= ?
  GROUP BY date
  ORDER BY date ASC
`);

const focusAllTimeForUserStmt = db.prepare(`
  SELECT COALESCE(SUM(seconds), 0) AS seconds, COUNT(*) AS sessions
  FROM focus_sessions
  WHERE user_id = ?
`);

const focusDistinctDatesForUserStmt = db.prepare(`
  SELECT DISTINCT date FROM focus_sessions WHERE user_id = ? ORDER BY date DESC
`);

function createFocusSession({ id, userId, date, seconds, mode }) {
  insertFocusSessionStmt.run(id, userId, date, seconds, mode ?? "timer");
}

function getFocusHistorySince(userId, sinceDate) {
  return focusSessionsForUserSinceStmt.all(userId, sinceDate);
}

function getFocusAllTime(userId) {
  return focusAllTimeForUserStmt.get(userId);
}

function getFocusDistinctDates(userId) {
  return focusDistinctDatesForUserStmt.all(userId).map((r) => r.date);
}

/* =====================================================
   SUBJECTS QUERIES
===================================================== */

const insertSubjectStmt = db.prepare(`
  INSERT INTO subjects (id, user_id, name, icon, topics_count, progress_pct)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const subjectsForUserStmt = db.prepare(`
  SELECT * FROM subjects WHERE user_id = ? ORDER BY created_at ASC
`);

const subjectByIdStmt = db.prepare(`
  SELECT * FROM subjects WHERE id = ? AND user_id = ?
`);

const deleteSubjectStmt = db.prepare(`
  DELETE FROM subjects WHERE id = ? AND user_id = ?
`);

const updateSubjectProgressStmt = db.prepare(`
  UPDATE subjects SET progress_pct = ? WHERE id = ? AND user_id = ?
`);

function createSubject({ id, userId, name, icon, topicsCount, progressPct }) {
  insertSubjectStmt.run(id, userId, name, icon ?? "📘", topicsCount ?? 0, progressPct ?? 0);
}

function getSubjectsForUser(userId) {
  return subjectsForUserStmt.all(userId);
}

function getSubjectById(id, userId) {
  return subjectByIdStmt.get(id, userId) ?? null;
}

function deleteSubject(id, userId) {
  return deleteSubjectStmt.run(id, userId).changes > 0;
}

function updateSubjectProgress(id, userId, progressPct) {
  updateSubjectProgressStmt.run(progressPct, id, userId);
}

/* =====================================================
   TASKS QUERIES
===================================================== */

const insertTaskStmt = db.prepare(`
  INSERT INTO tasks (id, user_id, subject_id, title, duration_min, priority, date, completed)
  VALUES (?, ?, ?, ?, ?, ?, ?, 0)
`);

const tasksForUserByDateStmt = db.prepare(`
  SELECT * FROM tasks WHERE user_id = ? AND date = ? ORDER BY created_at ASC
`);

const taskByIdStmt = db.prepare(`
  SELECT * FROM tasks WHERE id = ? AND user_id = ?
`);

const setTaskCompletedStmt = db.prepare(`
  UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?
`);

const deleteTaskStmt = db.prepare(`
  DELETE FROM tasks WHERE id = ? AND user_id = ?
`);

const completedTasksCountForUserStmt = db.prepare(`
  SELECT COUNT(*) AS count FROM tasks WHERE user_id = ? AND completed = 1
`);

const taskCountsSinceStmt = db.prepare(`
  SELECT date, SUM(completed) AS completed, COUNT(*) AS total
  FROM tasks
  WHERE user_id = ? AND date >= ?
  GROUP BY date
`);

function createTask({ id, userId, subjectId, title, durationMin, priority, date }) {
  insertTaskStmt.run(id, userId, subjectId ?? null, title, durationMin ?? 30, priority ?? "medium", date);
}

function getTasksForUserByDate(userId, date) {
  return tasksForUserByDateStmt.all(userId, date);
}

function getTaskById(id, userId) {
  return taskByIdStmt.get(id, userId) ?? null;
}

function setTaskCompleted(id, userId, completed) {
  return setTaskCompletedStmt.run(completed ? 1 : 0, id, userId).changes > 0;
}

function deleteTask(id, userId) {
  return deleteTaskStmt.run(id, userId).changes > 0;
}

function getCompletedTasksCount(userId) {
  return completedTasksCountForUserStmt.get(userId).count;
}

function getTaskCountsSince(userId, sinceDate) {
  return taskCountsSinceStmt.all(userId, sinceDate);
}

module.exports = {
  db,
  createUser,
  findUserByEmail,
  findUserById,
  toPublicUser,

  createFocusSession,
  getFocusHistorySince,
  getFocusAllTime,
  getFocusDistinctDates,

  createSubject,
  getSubjectsForUser,
  getSubjectById,
  deleteSubject,
  updateSubjectProgress,

  createTask,
  getTasksForUserByDate,
  getTaskById,
  setTaskCompleted,
  deleteTask,
  getCompletedTasksCount,
  getTaskCountsSince,
};
