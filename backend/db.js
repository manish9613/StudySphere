// Persistence layer for StudySphere auth.
// Uses Node's built-in `node:sqlite` (stable as of Node 22.5+) so the
// backend needs zero third-party dependencies — no `npm install` required.

const path = require("node:path");
const crypto = require("node:crypto");
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
   PASSWORD RESETS
   One row per "forgot password" request. We never store the raw
   token — only its SHA-256 hash — so a database leak alone can't be
   used to reset anyone's password. Tokens expire and are single-use.
===================================================== */

db.exec(`
  CREATE TABLE IF NOT EXISTS password_resets (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    used_at    TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets (user_id);
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
   COURSES + LESSONS
   A course belongs to one teacher and holds an ordered
   list of lessons. Each lesson has an implicit "task":
   the student must upload a PDF (a submission) and have
   it approved by the teacher before the next lesson
   unlocks.
===================================================== */

db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id          TEXT PRIMARY KEY,
    teacher_id  TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    category    TEXT,
    level       TEXT,
    description TEXT,
    thumbnail   TEXT,
    instructor  TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses (teacher_id);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS lessons (
    id          TEXT PRIMARY KEY,
    course_id   TEXT NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
    position    INTEGER NOT NULL,
    title       TEXT NOT NULL,
    description TEXT,
    video_id    TEXT,
    duration    TEXT
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons (course_id, position);
`);

/* =====================================================
   ENROLLMENTS
   Ties a student to a course. This is the teacher <->
   student relationship: every enrollment row is one
   student the teacher can see and manage in the
   "Students" section of their dashboard.
===================================================== */

db.exec(`
  CREATE TABLE IF NOT EXISTS enrollments (
    id          TEXT PRIMARY KEY,
    course_id   TEXT NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
    student_id  TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    enrolled_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (course_id, student_id)
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments (course_id);
  CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments (student_id);
`);

/* =====================================================
   SUBMISSIONS
   One row per (lesson, student) — the PDF a student
   uploads on a lesson's task-completion section. The
   teacher evaluates it (approve/reject + a remark). An
   approved submission is what unlocks the next lesson,
   and the remark is what shows up in the student's
   course "lesson remarks" view.
===================================================== */

db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id            TEXT PRIMARY KEY,
    lesson_id     TEXT NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
    course_id     TEXT NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
    student_id    TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    file_name     TEXT NOT NULL,
    file_data     TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected')),
    remark        TEXT,
    submitted_at  TEXT NOT NULL DEFAULT (datetime('now')),
    evaluated_at  TEXT,
    UNIQUE (lesson_id, student_id)
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_submissions_course_student ON submissions (course_id, student_id);
`);

/* =====================================================
   LESSON TASKS ("DPPs")
   A task the TEACHER attaches to a lesson: a title, some
   instructions, and (optionally) a real PDF of the
   assignment itself. Completely separate from whether a
   student has submitted their answer — a lesson task never
   blocks moving on to the next lesson, it just shows up in
   the student's Tasks section until they deal with it.
===================================================== */

db.exec(`
  CREATE TABLE IF NOT EXISTS lesson_tasks (
    id           TEXT PRIMARY KEY,
    lesson_id    TEXT NOT NULL UNIQUE REFERENCES lessons (id) ON DELETE CASCADE,
    course_id    TEXT NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
    teacher_id   TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    instructions TEXT,
    file_name    TEXT,
    file_data    TEXT,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_lesson_tasks_course ON lesson_tasks (course_id);
`);

/* =====================================================
   LESSON COMPLETIONS
   A student marking a lesson as "done" — this is what
   course progress (%) is based on. Completely independent
   from lesson task submissions/approval, so watching/
   finishing a lesson is never gated behind a teacher's review.
===================================================== */

db.exec(`
  CREATE TABLE IF NOT EXISTS lesson_completions (
    id           TEXT PRIMARY KEY,
    lesson_id    TEXT NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
    course_id    TEXT NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
    student_id   TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    completed_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (lesson_id, student_id)
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_lesson_completions_course_student ON lesson_completions (course_id, student_id);
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

const updatePasswordStmt = db.prepare(`
  UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?
`);

function updateUserPassword(userId, passwordHash, passwordSalt) {
  updatePasswordStmt.run(passwordHash, passwordSalt, userId);
}

/* =====================================================
   PASSWORD RESET QUERIES
===================================================== */

const insertPasswordResetStmt = db.prepare(`
  INSERT INTO password_resets (id, user_id, token_hash, expires_at)
  VALUES (?, ?, ?, ?)
`);

const findValidPasswordResetStmt = db.prepare(`
  SELECT * FROM password_resets
  WHERE token_hash = ? AND used_at IS NULL AND expires_at > datetime('now')
`);

const markPasswordResetUsedStmt = db.prepare(`
  UPDATE password_resets SET used_at = datetime('now') WHERE id = ?
`);

const invalidateUserPasswordResetsStmt = db.prepare(`
  UPDATE password_resets SET used_at = datetime('now')
  WHERE user_id = ? AND used_at IS NULL
`);

function createPasswordReset({ id, userId, tokenHash, expiresAt }) {
  insertPasswordResetStmt.run(id, userId, tokenHash, expiresAt);
}

function findValidPasswordReset(tokenHash) {
  return findValidPasswordResetStmt.get(tokenHash) ?? null;
}

function markPasswordResetUsed(id) {
  markPasswordResetUsedStmt.run(id);
}

/** Called before issuing a fresh reset token so a user can never have
 *  more than one live reset link outstanding at a time. */
function invalidateUserPasswordResets(userId) {
  invalidateUserPasswordResetsStmt.run(userId);
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

/* =====================================================
   COURSE + LESSON QUERIES
===================================================== */

const insertCourseStmt = db.prepare(`
  INSERT INTO courses (id, teacher_id, title, category, level, description, thumbnail, instructor)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const updateCourseStmt = db.prepare(`
  UPDATE courses SET title = ?, category = ?, level = ?, description = ?, thumbnail = ?
  WHERE id = ? AND teacher_id = ?
`);

const allCoursesStmt = db.prepare(`
  SELECT * FROM courses ORDER BY created_at DESC
`);

const coursesByTeacherStmt = db.prepare(`
  SELECT * FROM courses WHERE teacher_id = ? ORDER BY created_at DESC
`);

const courseByIdStmt = db.prepare(`
  SELECT * FROM courses WHERE id = ?
`);

const insertLessonStmt = db.prepare(`
  INSERT INTO lessons (id, course_id, position, title, description, video_id, duration)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const lessonsForCourseStmt = db.prepare(`
  SELECT * FROM lessons WHERE course_id = ? ORDER BY position ASC
`);

const lessonByIdStmt = db.prepare(`
  SELECT * FROM lessons WHERE id = ? AND course_id = ?
`);

const deleteLessonsForCourseStmt = db.prepare(`
  DELETE FROM lessons WHERE course_id = ?
`);

const deleteLessonByIdStmt = db.prepare(`
  DELETE FROM lessons WHERE id = ? AND course_id = ?
`);

const updateLessonRowStmt = db.prepare(`
  UPDATE lessons SET position = ?, title = ?, description = ?, video_id = ?, duration = ?
  WHERE id = ? AND course_id = ?
`);

const deleteCourseStmt = db.prepare(`
  DELETE FROM courses WHERE id = ? AND teacher_id = ?
`);

function createCourse({ id, teacherId, title, category, level, description, thumbnail, instructor }) {
  insertCourseStmt.run(id, teacherId, title, category ?? null, level ?? null, description ?? null, thumbnail ?? null, instructor ?? null);
}

function updateCourseRow(id, teacherId, { title, category, level, description, thumbnail }) {
  return updateCourseStmt.run(title, category ?? null, level ?? null, description ?? null, thumbnail ?? null, id, teacherId).changes > 0;
}

function getAllCourses() {
  return allCoursesStmt.all();
}

function getCoursesByTeacher(teacherId) {
  return coursesByTeacherStmt.all(teacherId);
}

function getCourseById(id) {
  return courseByIdStmt.get(id) ?? null;
}

function createLesson({ id, courseId, position, title, description, videoId, duration }) {
  insertLessonStmt.run(id, courseId, position, title, description ?? null, videoId ?? null, duration ?? null);
}

function getLessonsForCourse(courseId) {
  return lessonsForCourseStmt.all(courseId);
}

function getLessonById(id, courseId) {
  return lessonByIdStmt.get(id, courseId) ?? null;
}

/** Saves a course's lesson list without needlessly destroying lesson
 *  rows. Any incoming lesson whose id matches a lesson that already
 *  belongs to this course is UPDATED in place (keeping its id, and
 *  with it, any lesson task / submissions / completions tied to that
 *  id). Lessons with no id, or an id that doesn't belong to this
 *  course, are inserted as new rows. Any existing lesson that isn't
 *  present in the incoming list is removed (and its dependent rows
 *  cascade away with it) — that's the only case data is dropped, and
 *  it only happens when the teacher actually deleted that lesson. */
function replaceLessonsForCourse(courseId, lessons) {
  const existingIds = new Set(getLessonsForCourse(courseId).map((l) => l.id));
  const keepIds = new Set();

  lessons.forEach((lesson, index) => {
    const id = lesson.id && existingIds.has(lesson.id) ? lesson.id : crypto.randomUUID();
    keepIds.add(id);

    if (existingIds.has(id)) {
      updateLessonRowStmt.run(index, lesson.title, lesson.description ?? null, lesson.videoId ?? null, lesson.duration ?? null, id, courseId);
    } else {
      insertLessonStmt.run(id, courseId, index, lesson.title, lesson.description ?? null, lesson.videoId ?? null, lesson.duration ?? null);
    }
  });

  for (const existingId of existingIds) {
    if (!keepIds.has(existingId)) {
      deleteLessonByIdStmt.run(existingId, courseId);
    }
  }
}

function deleteCourse(id, teacherId) {
  return deleteCourseStmt.run(id, teacherId).changes > 0;
}

/* =====================================================
   ENROLLMENT QUERIES
===================================================== */

const insertEnrollmentStmt = db.prepare(`
  INSERT OR IGNORE INTO enrollments (id, course_id, student_id)
  VALUES (?, ?, ?)
`);

const enrollmentStmt = db.prepare(`
  SELECT * FROM enrollments WHERE course_id = ? AND student_id = ?
`);

const enrollmentsForStudentStmt = db.prepare(`
  SELECT * FROM enrollments WHERE student_id = ? ORDER BY enrolled_at DESC
`);

const enrollmentsForCourseStmt = db.prepare(`
  SELECT e.*, u.name AS student_name, u.email AS student_email
  FROM enrollments e
  JOIN users u ON u.id = e.student_id
  WHERE e.course_id = ?
  ORDER BY e.enrolled_at DESC
`);

const enrollmentCountForCourseStmt = db.prepare(`
  SELECT COUNT(*) AS count FROM enrollments WHERE course_id = ?
`);

const enrollmentsForTeacherStmt = db.prepare(`
  SELECT e.*, u.name AS student_name, u.email AS student_email,
         c.title AS course_title, c.id AS course_id
  FROM enrollments e
  JOIN users u ON u.id = e.student_id
  JOIN courses c ON c.id = e.course_id
  WHERE c.teacher_id = ?
  ORDER BY e.enrolled_at DESC
`);

function createEnrollment({ id, courseId, studentId }) {
  insertEnrollmentStmt.run(id, courseId, studentId);
}

function getEnrollment(courseId, studentId) {
  return enrollmentStmt.get(courseId, studentId) ?? null;
}

function getEnrollmentsForStudent(studentId) {
  return enrollmentsForStudentStmt.all(studentId);
}

function getEnrollmentsForCourse(courseId) {
  return enrollmentsForCourseStmt.all(courseId);
}

function getEnrollmentCountForCourse(courseId) {
  return enrollmentCountForCourseStmt.get(courseId).count;
}

function getEnrollmentsForTeacher(teacherId) {
  return enrollmentsForTeacherStmt.all(teacherId);
}

/* =====================================================
   SUBMISSION QUERIES
===================================================== */

const insertSubmissionStmt = db.prepare(`
  INSERT INTO submissions (id, lesson_id, course_id, student_id, file_name, file_data, status, remark, submitted_at, evaluated_at)
  VALUES (?, ?, ?, ?, ?, ?, 'submitted', NULL, datetime('now'), NULL)
  ON CONFLICT (lesson_id, student_id) DO UPDATE SET
    file_name = excluded.file_name,
    file_data = excluded.file_data,
    status = 'submitted',
    remark = NULL,
    submitted_at = datetime('now'),
    evaluated_at = NULL
`);

const submissionStmt = db.prepare(`
  SELECT * FROM submissions WHERE lesson_id = ? AND student_id = ?
`);

const submissionByIdStmt = db.prepare(`
  SELECT * FROM submissions WHERE id = ?
`);

const submissionsForCourseStudentStmt = db.prepare(`
  SELECT * FROM submissions WHERE course_id = ? AND student_id = ?
`);

const submissionsForCourseStmt = db.prepare(`
  SELECT s.*, u.name AS student_name, u.email AS student_email,
         l.title AS lesson_title, l.position AS lesson_position
  FROM submissions s
  JOIN users u ON u.id = s.student_id
  JOIN lessons l ON l.id = s.lesson_id
  WHERE s.course_id = ?
  ORDER BY s.submitted_at DESC
`);

const evaluateSubmissionStmt = db.prepare(`
  UPDATE submissions SET status = ?, remark = ?, evaluated_at = datetime('now')
  WHERE id = ?
`);

function upsertSubmission({ id, lessonId, courseId, studentId, fileName, fileData }) {
  insertSubmissionStmt.run(id, lessonId, courseId, studentId, fileName, fileData);
  return submissionStmt.get(lessonId, studentId);
}

function getSubmission(lessonId, studentId) {
  return submissionStmt.get(lessonId, studentId) ?? null;
}

function getSubmissionById(id) {
  return submissionByIdStmt.get(id) ?? null;
}

function getSubmissionsForCourseStudent(courseId, studentId) {
  return submissionsForCourseStudentStmt.all(courseId, studentId);
}

function getSubmissionsForCourse(courseId) {
  return submissionsForCourseStmt.all(courseId);
}

function evaluateSubmission(id, status, remark) {
  return evaluateSubmissionStmt.run(status, remark ?? null, id).changes > 0;
}

/* =====================================================
   LESSON TASK QUERIES
===================================================== */

const upsertLessonTaskStmt = db.prepare(`
  INSERT INTO lesson_tasks (id, lesson_id, course_id, teacher_id, title, instructions, file_name, file_data, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  ON CONFLICT (lesson_id) DO UPDATE SET
    title = excluded.title,
    instructions = excluded.instructions,
    file_name = COALESCE(excluded.file_name, lesson_tasks.file_name),
    file_data = COALESCE(excluded.file_data, lesson_tasks.file_data),
    updated_at = datetime('now')
`);

const lessonTaskByLessonStmt = db.prepare(`
  SELECT * FROM lesson_tasks WHERE lesson_id = ?
`);

const lessonTasksForCourseStmt = db.prepare(`
  SELECT * FROM lesson_tasks WHERE course_id = ?
`);

const deleteLessonTaskStmt = db.prepare(`
  DELETE FROM lesson_tasks WHERE lesson_id = ? AND course_id = ? AND teacher_id = ?
`);

function upsertLessonTask({ id, lessonId, courseId, teacherId, title, instructions, fileName, fileData }) {
  upsertLessonTaskStmt.run(id, lessonId, courseId, teacherId, title, instructions ?? null, fileName ?? null, fileData ?? null);
  return lessonTaskByLessonStmt.get(lessonId);
}

function getLessonTaskByLesson(lessonId) {
  return lessonTaskByLessonStmt.get(lessonId) ?? null;
}

function getLessonTasksForCourse(courseId) {
  return lessonTasksForCourseStmt.all(courseId);
}

function deleteLessonTask(lessonId, courseId, teacherId) {
  return deleteLessonTaskStmt.run(lessonId, courseId, teacherId).changes > 0;
}

/* =====================================================
   LESSON COMPLETION QUERIES
===================================================== */

const insertLessonCompletionStmt = db.prepare(`
  INSERT OR IGNORE INTO lesson_completions (id, lesson_id, course_id, student_id)
  VALUES (?, ?, ?, ?)
`);

const deleteLessonCompletionStmt = db.prepare(`
  DELETE FROM lesson_completions WHERE lesson_id = ? AND student_id = ?
`);

const lessonCompletionsForCourseStudentStmt = db.prepare(`
  SELECT * FROM lesson_completions WHERE course_id = ? AND student_id = ?
`);

function setLessonCompleted(lessonId, courseId, studentId, completed) {
  if (completed) {
    insertLessonCompletionStmt.run(crypto.randomUUID(), lessonId, courseId, studentId);
  } else {
    deleteLessonCompletionStmt.run(lessonId, studentId);
  }
}

function getLessonCompletionsForCourseStudent(courseId, studentId) {
  return lessonCompletionsForCourseStudentStmt.all(courseId, studentId);
}

module.exports = {
  db,
  createUser,
  findUserByEmail,
  findUserById,
  toPublicUser,
  updateUserPassword,

  createPasswordReset,
  findValidPasswordReset,
  markPasswordResetUsed,
  invalidateUserPasswordResets,

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

  createCourse,
  updateCourseRow,
  getAllCourses,
  getCoursesByTeacher,
  getCourseById,
  createLesson,
  getLessonsForCourse,
  getLessonById,
  replaceLessonsForCourse,
  deleteCourse,

  createEnrollment,
  getEnrollment,
  getEnrollmentsForStudent,
  getEnrollmentsForCourse,
  getEnrollmentCountForCourse,
  getEnrollmentsForTeacher,

  upsertSubmission,
  getSubmission,
  getSubmissionById,
  getSubmissionsForCourseStudent,
  getSubmissionsForCourse,
  evaluateSubmission,

  upsertLessonTask,
  getLessonTaskByLesson,
  getLessonTasksForCourse,
  deleteLessonTask,

  setLessonCompleted,
  getLessonCompletionsForCourseStudent,
};
