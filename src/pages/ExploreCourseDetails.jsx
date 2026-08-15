import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  Lock,
  LogIn,
  Play,
  Star,
  Users,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getEnrolledCourseIds, enrollInCourse } from "../lib/enrollment";

function ExploreCourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [teacherCourses, setTeacherCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(getEnrolledCourseIds());
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("teacherCourses")) || [];
      setTeacherCourses(Array.isArray(saved) ? saved : []);
    } catch (error) {
      console.error("Failed to load teacher courses:", error);
      setTeacherCourses([]);
    }
  }, []);

  const course = useMemo(() => {
    const found = teacherCourses.find(
      (item) => String(item.id) === String(courseId)
    );

    if (!found) return null;

    return {
      ...found,
      instructor: found.instructor || "StudySphere Teacher",
      category: found.category || "General",
      level: found.level || "Beginner",
      description: found.description || "Learn this course on StudySphere.",
      students: found.students || 0,
      rating: found.rating || 0,
      color: found.color || "purple",
      lessons: Array.isArray(found.lessons)
        ? found.lessons.map((lesson, index) => ({
            ...lesson,
            id: lesson.id ?? index + 1,
            title: lesson.title || `Lesson ${index + 1}`,
            duration: lesson.duration || "Video lesson",
          }))
        : [],
    };
  }, [teacherCourses, courseId]);

  const isEnrolled = enrolledIds.includes(String(courseId));
  const isStudent = !isAuthenticated || user?.role === "student";

  const getGradient = (color) => {
    const gradients = {
      blue: "from-blue-600/30 via-blue-500/10",
      cyan: "from-cyan-600/30 via-cyan-500/10",
      yellow: "from-yellow-600/30 via-yellow-500/10",
      purple: "from-purple-600/30 via-purple-500/10",
      orange: "from-orange-600/30 via-orange-500/10",
      emerald: "from-emerald-600/30 via-emerald-500/10",
      green: "from-green-600/30 via-green-500/10",
      slate: "from-slate-600/30 via-slate-500/10",
    };

    return gradients[color] || gradients.slate;
  };

  /* =====================================================
     ENROLL
  ===================================================== */

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/explore/${courseId}` } });
      return;
    }

    if (user?.role !== "student") return;

    if (isEnrolled) {
      navigate(`/student/courses/${courseId}`);
      return;
    }

    setEnrolling(true);

    try {
      const next = enrollInCourse(courseId);
      setEnrolledIds(next);

      // Bump the course's student count so it's reflected across the app.
      const updatedCourses = teacherCourses.map((item) =>
        String(item.id) === String(courseId)
          ? { ...item, students: (Number(item.students) || 0) + 1 }
          : item
      );
      localStorage.setItem("teacherCourses", JSON.stringify(updatedCourses));
      setTeacherCourses(updatedCourses);
    } catch (error) {
      console.error("Failed to save enrollment:", error);
    }

    navigate(`/student/courses/${courseId}`);
  };

  /* =====================================================
     NOT FOUND
  ===================================================== */

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <BookOpen size={40} className="mx-auto text-slate-600" />

          <h1 className="mt-5 text-2xl font-bold">Course not found</h1>

          <p className="mt-2 text-slate-500">
            The course you are looking for does not exist or is no longer
            available.
          </p>

          <Link
            to="/explore"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <ArrowLeft size={16} />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const hasLessons = course.lessons.length > 0;

  return (
    <div className="page-enter min-h-screen bg-slate-950 text-white">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <button
            type="button"
            onClick={() => navigate("/explore")}
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Explore
          </button>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
                  {course.category}
                </span>

                <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-500">
                  {course.level}
                </span>

                <span className="rounded-lg bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-400">
                  Teacher Course
                </span>
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
                {course.title}
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
                {course.description}
              </p>

              <p className="mt-5 text-sm text-slate-500">
                Created by{" "}
                <span className="font-medium text-slate-300">
                  {course.instructor}
                </span>
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-slate-300">
                    {course.rating || "New"}
                  </span>
                  {course.rating > 0 && " rating"}
                </span>

                <span className="flex items-center gap-2">
                  <Users size={16} />
                  {course.students || 0} students
                </span>

                <span className="flex items-center gap-2">
                  <Clock3 size={16} />
                  {course.lessons.length} lessons
                </span>
              </div>
            </div>

            {/* =================================================
                ENROLL CARD
            ================================================= */}

            <div
              className={`overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br ${getGradient(
                course.color
              )} to-slate-950`}
            >
              {course.thumbnail ? (
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-slate-950/60 text-white/80 backdrop-blur">
                    <BookOpen size={38} strokeWidth={1.5} />
                  </div>
                </div>
              )}

              <div className="border-t border-white/5 bg-slate-950/50 p-6">
                {!isAuthenticated && (
                  <p className="mb-4 flex items-start gap-2 text-xs text-slate-500">
                    <Lock size={14} className="mt-0.5 shrink-0" />
                    Sign in as a student to enroll and start learning.
                  </p>
                )}

                {isAuthenticated && user?.role !== "student" && (
                  <p className="mb-4 flex items-start gap-2 text-xs text-slate-500">
                    <Lock size={14} className="mt-0.5 shrink-0" />
                    Only student accounts can enroll in courses.
                  </p>
                )}

                {isEnrolled && isStudent && (
                  <p className="mb-4 flex items-center gap-2 text-xs font-medium text-emerald-400">
                    <CheckCircle2 size={14} />
                    You're enrolled in this course
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={
                    enrolling || (isAuthenticated && user?.role !== "student")
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {!isAuthenticated ? (
                    <>
                      <LogIn size={17} />
                      Sign In to Enroll
                    </>
                  ) : isEnrolled ? (
                    <>
                      <Play size={17} />
                      Continue Learning
                    </>
                  ) : (
                    <>
                      <Play size={17} />
                      Enroll Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CURRICULUM PREVIEW
      ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Curriculum
          </p>
          <h2 className="mt-2 text-2xl font-bold">Course Lessons</h2>
          <p className="mt-2 text-sm text-slate-500">
            {course.lessons.length} lesson
            {course.lessons.length === 1 ? "" : "s"} — sign in and enroll to
            watch the videos.
          </p>
        </div>

        {hasLessons ? (
          <div className="mt-8 max-w-4xl space-y-3">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-sm font-semibold text-slate-400">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-200">
                    {lesson.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {lesson.duration}
                  </p>
                </div>

                <Lock size={16} className="shrink-0 text-slate-600" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-sm text-slate-500">
            No lessons available yet.
          </div>
        )}
      </main>
    </div>
  );
}

export default ExploreCourseDetails;
