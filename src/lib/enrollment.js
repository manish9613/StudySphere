// StudySphere doesn't have a real backend for courses yet — courses live in
// localStorage ("teacherCourses"). Enrollment is tracked the same lightweight
// way: a single localStorage list of course ids the current browser's
// student has actually enrolled in (e.g. via the Explore page). Every page
// that needs to know "is this course enrolled?" should go through these
// helpers so the answer stays consistent across the app.

const STORAGE_KEY = "enrolledCourseIds";

export function getEnrolledCourseIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved.map(String) : [];
  } catch {
    return [];
  }
}

export function isCourseEnrolled(courseId) {
  return getEnrolledCourseIds().includes(String(courseId));
}

export function enrollInCourse(courseId) {
  const next = Array.from(
    new Set([...getEnrolledCourseIds(), String(courseId)])
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
