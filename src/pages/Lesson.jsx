import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  List,
} from "lucide-react";
import { useState } from "react";

function Lesson() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [completed, setCompleted] = useState(false);

  /* =====================================================
     DEMO COURSE DATA
     ===================================================== */

  const demoCourses = {
    1: {
      id: 1,
      title: "Data Structures & Algorithms",
      lessons: [
        {
          id: 1,
          title: "Introduction to DSA",
          duration: "18 min",
          description:
            "Understand what data structures and algorithms are and why they are important.",
          videoId: "",
        },
        {
          id: 2,
          title: "Arrays & Strings",
          duration: "32 min",
          description:
            "Learn how arrays and strings work and how to solve common problems using them.",
          videoId: "",
        },
        {
          id: 3,
          title: "Linked Lists",
          duration: "41 min",
          description:
            "Understand linked lists, nodes, traversal, insertion, and deletion.",
          videoId: "",
        },
        {
          id: 4,
          title: "Stacks & Queues",
          duration: "36 min",
          description:
            "Learn stacks and queues and understand their real-world applications.",
          videoId: "",
        },
        {
          id: 5,
          title: "Trees",
          duration: "48 min",
          description:
            "Explore trees, binary trees, traversal techniques, and binary search trees.",
          videoId: "",
        },
        {
          id: 6,
          title: "Graphs",
          duration: "52 min",
          description:
            "Learn graph representation, BFS, DFS, and common graph problems.",
          videoId: "",
        },
        {
          id: 7,
          title: "Dynamic Programming",
          duration: "60 min",
          description:
            "Understand dynamic programming and learn how to break complex problems into smaller subproblems.",
          videoId: "",
        },
      ],
    },

    2: {
      id: 2,
      title: "Complete React Development",
      lessons: [
        {
          id: 1,
          title: "React Fundamentals",
          duration: "24 min",
          description:
            "Learn the fundamentals of React and understand how component-based development works.",
          videoId: "",
        },
        {
          id: 2,
          title: "Components & Props",
          duration: "31 min",
          description:
            "Understand reusable components and how data flows between components using props.",
          videoId: "",
        },
        {
          id: 3,
          title: "State & Events",
          duration: "38 min",
          description:
            "Learn how state works and how to handle user interactions in React.",
          videoId: "",
        },
        {
          id: 4,
          title: "React Hooks",
          duration: "45 min",
          description:
            "Understand useState, useEffect, and other important React hooks.",
          videoId: "",
        },
        {
          id: 5,
          title: "React Router",
          duration: "34 min",
          description:
            "Build multi-page experiences using React Router.",
          videoId: "",
        },
        {
          id: 6,
          title: "Working with APIs",
          duration: "42 min",
          description:
            "Learn how to connect React applications with backend APIs.",
          videoId: "",
        },
      ],
    },

    3: {
      id: 3,
      title: "Python Programming",
      lessons: [
        {
          id: 1,
          title: "Python Introduction",
          duration: "20 min",
          description:
            "Learn the basics of Python and understand how Python programs are structured.",
          videoId: "",
        },
        {
          id: 2,
          title: "Variables & Data Types",
          duration: "28 min",
          description:
            "Understand variables, strings, numbers, lists, tuples, and dictionaries.",
          videoId: "",
        },
        {
          id: 3,
          title: "Conditions & Loops",
          duration: "35 min",
          description:
            "Learn conditional statements and loops for controlling program flow.",
          videoId: "",
        },
        {
          id: 4,
          title: "Functions",
          duration: "31 min",
          description:
            "Learn how to create reusable functions and organize Python programs.",
          videoId: "",
        },
        {
          id: 5,
          title: "Object Oriented Programming",
          duration: "46 min",
          description:
            "Understand classes, objects, inheritance, and encapsulation in Python.",
          videoId: "",
        },
      ],
    },

    4: {
      id: 4,
      title: "Machine Learning Fundamentals",
      lessons: [
        {
          id: 1,
          title: "Introduction to Machine Learning",
          duration: "26 min",
          description:
            "Understand machine learning and how it differs from traditional programming.",
          videoId: "",
        },
        {
          id: 2,
          title: "Data Preparation",
          duration: "35 min",
          description:
            "Learn how to clean, transform, and prepare data for machine learning.",
          videoId: "",
        },
        {
          id: 3,
          title: "Linear Regression",
          duration: "42 min",
          description:
            "Understand linear regression and how it can be used for prediction.",
          videoId: "",
        },
        {
          id: 4,
          title: "Classification",
          duration: "48 min",
          description:
            "Learn the fundamentals of classification and common classification models.",
          videoId: "",
        },
        {
          id: 5,
          title: "Model Evaluation",
          duration: "38 min",
          description:
            "Learn how to evaluate machine learning models using appropriate metrics.",
          videoId: "",
        },
      ],
    },

    5: {
      id: 5,
      title: "JavaScript Mastery",
      lessons: [
        {
          id: 1,
          title: "Modern JavaScript",
          duration: "25 min",
          description:
            "Understand modern JavaScript syntax and the features introduced in ES6+.",
          videoId: "",
        },
        {
          id: 2,
          title: "Functions & Scope",
          duration: "30 min",
          description:
            "Learn functions, scope, closures, and how JavaScript handles execution.",
          videoId: "",
        },
        {
          id: 3,
          title: "Objects & Arrays",
          duration: "36 min",
          description:
            "Work with objects, arrays, destructuring, and common array methods.",
          videoId: "",
        },
        {
          id: 4,
          title: "Asynchronous JavaScript",
          duration: "44 min",
          description:
            "Understand promises, async/await, and asynchronous programming.",
          videoId: "",
        },
      ],
    },

    6: {
      id: 6,
      title: "Digital Electronics",
      lessons: [
        {
          id: 1,
          title: "Digital Logic Basics",
          duration: "22 min",
          description:
            "Learn the fundamentals of digital systems and logic gates.",
          videoId: "",
        },
        {
          id: 2,
          title: "Boolean Algebra",
          duration: "34 min",
          description:
            "Understand Boolean expressions, laws, and simplification techniques.",
          videoId: "",
        },
        {
          id: 3,
          title: "Combinational Circuits",
          duration: "40 min",
          description:
            "Study adders, subtractors, multiplexers, decoders, and other circuits.",
          videoId: "",
        },
        {
          id: 4,
          title: "Sequential Circuits",
          duration: "45 min",
          description:
            "Learn flip-flops, registers, counters, and sequential logic.",
          videoId: "",
        },
      ],
    },

    7: {
      id: 7,
      title: "Node.js & Backend Development",
      lessons: [
        {
          id: 1,
          title: "Node.js Fundamentals",
          duration: "26 min",
          description:
            "Understand Node.js and how JavaScript can be used for backend development.",
          videoId: "",
        },
        {
          id: 2,
          title: "Express.js",
          duration: "38 min",
          description:
            "Learn how to build backend applications using Express.",
          videoId: "",
        },
        {
          id: 3,
          title: "REST APIs",
          duration: "42 min",
          description:
            "Understand REST architecture and build RESTful APIs.",
          videoId: "",
        },
        {
          id: 4,
          title: "Authentication",
          duration: "48 min",
          description:
            "Learn authentication concepts and how protected routes work.",
          videoId: "",
        },
      ],
    },

    8: {
      id: 8,
      title: "Git & GitHub",
      lessons: [
        {
          id: 1,
          title: "Git Fundamentals",
          duration: "18 min",
          description:
            "Learn Git basics and understand how version control works.",
          videoId: "",
        },
        {
          id: 2,
          title: "Branches & Merging",
          duration: "28 min",
          description:
            "Learn how branches work and how to merge changes safely.",
          videoId: "",
        },
        {
          id: 3,
          title: "GitHub Workflow",
          duration: "32 min",
          description:
            "Learn how to use GitHub for collaborative software development.",
          videoId: "",
        },
        {
          id: 4,
          title: "Pull Requests",
          duration: "25 min",
          description:
            "Understand pull requests and professional collaboration workflows.",
          videoId: "",
        },
      ],
    },
  };

  /* =====================================================
     LOAD TEACHER COURSES
  ===================================================== */

  let teacherCourses = [];

  try {
    teacherCourses =
      JSON.parse(
        localStorage.getItem("teacherCourses")
      ) || [];
  } catch {
    teacherCourses = [];
  }

  /* =====================================================
     FIND COURSE
  ===================================================== */

  const teacherCourse = teacherCourses.find(
    (course) =>
      String(course.id) === String(courseId)
  );

  const course =
    teacherCourse ||
    demoCourses[courseId];

  /* =====================================================
     INVALID COURSE
  ===================================================== */

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

        <div className="text-center">

          <BookOpen
            size={42}
            className="mx-auto text-slate-600"
          />

          <h1 className="mt-5 text-2xl font-bold">
            Course not found
          </h1>

          <p className="mt-2 text-slate-500">
            We couldn't find this course.
          </p>

          <Link
            to="/student/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <ArrowLeft size={16} />
            Back to Courses
          </Link>

        </div>

      </div>
    );
  }

  /* =====================================================
     CURRENT LESSON
  ===================================================== */

  const currentLessonIndex =
    course.lessons.findIndex(
      (lesson) =>
        String(lesson.id) === String(lessonId)
    );

  const currentLesson =
    course.lessons[currentLessonIndex];

  /* =====================================================
     INVALID LESSON
  ===================================================== */

  if (!currentLesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

        <div className="text-center">

          <h1 className="text-2xl font-bold">
            Lesson not found
          </h1>

          <Link
            to={`/student/courses/${courseId}`}
            className="mt-5 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft size={16} />
            Back to Course
          </Link>

        </div>

      </div>
    );
  }

  /* =====================================================
     PREVIOUS / NEXT
  ===================================================== */

  const previousLesson =
    currentLessonIndex > 0
      ? course.lessons[
          currentLessonIndex - 1
        ]
      : null;

  const nextLesson =
    currentLessonIndex <
    course.lessons.length - 1
      ? course.lessons[
          currentLessonIndex + 1
        ]
      : null;

  /* =====================================================
     MARK COMPLETE
  ===================================================== */

  const handleComplete = () => {
    setCompleted(true);
  };

  /* =====================================================
     YOUTUBE VIDEO
  ===================================================== */

  const videoId = currentLesson.videoId;

  return (
    <div className="page-enter min-h-screen bg-slate-950 text-white">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <header className="border-b border-slate-800 bg-slate-950">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/student/courses/${courseId}`
              )
            }
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />

            <span className="hidden sm:inline">
              Back to Course
            </span>
          </button>

          <div className="hidden max-w-md truncate text-sm font-medium text-slate-300 sm:block">
            {course.title}
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">

            <BookOpen size={16} />

            Lesson {currentLessonIndex + 1} of{" "}
            {course.lessons.length}

          </div>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div>

            {/* =================================================
                YOUTUBE VIDEO
            ================================================= */}

            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-black">

              {videoId ? (

                <div className="aspect-video">

                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={currentLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />

                </div>

              ) : (

                <div className="flex aspect-video flex-col items-center justify-center bg-linear-to-br from-slate-900 via-slate-950 to-blue-950/30">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/10 text-blue-400">

                    <BookOpen size={32} />

                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-300">
                    Video not available
                  </p>

                  <p className="mt-2 text-xs text-slate-600">
                    This lesson does not have a YouTube video yet.
                  </p>

                </div>

              )}

            </div>


            {/* =================================================
                LESSON INFORMATION
            ================================================= */}

            <div className="mt-7">

              <div className="flex flex-wrap items-center gap-3">

                <span className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
                  {course.title}
                </span>

                <span className="flex items-center gap-1.5 text-xs text-slate-500">

                  <Clock3 size={14} />

                  {currentLesson.duration ||
                    "Duration unavailable"}

                </span>

              </div>


              <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                {currentLesson.title}
              </h1>


              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
                {currentLesson.description}
              </p>


              {/* Complete Button */}

              <div className="mt-7">

                {completed ? (

                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">

                    <CheckCircle2
                      size={22}
                      className="text-emerald-400"
                    />

                    <div>

                      <p className="text-sm font-semibold text-emerald-400">
                        Lesson completed
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Great work. Continue to the next lesson.
                      </p>

                    </div>

                  </div>

                ) : (

                  <button
                    type="button"
                    onClick={handleComplete}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                  >
                    <CheckCircle2 size={18} />
                    Mark as Complete
                  </button>

                )}

              </div>

            </div>


            {/* =================================================
                PREVIOUS / NEXT
            ================================================= */}

            <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">

              {previousLesson ? (

                <Link
                  to={`/student/courses/${courseId}/lesson/${previousLesson.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 transition hover:border-slate-700"
                >

                  <ChevronLeft
                    size={18}
                    className="text-slate-500 transition group-hover:text-white"
                  />

                  <div>

                    <p className="text-[11px] uppercase tracking-wider text-slate-600">
                      Previous
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-300">
                      {previousLesson.title}
                    </p>

                  </div>

                </Link>

              ) : (

                <div />

              )}


              {nextLesson ? (

                <Link
                  to={`/student/courses/${courseId}/lesson/${nextLesson.id}`}
                  className="group flex items-center justify-end gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-right transition hover:border-blue-500/30"
                >

                  <div>

                    <p className="text-[11px] uppercase tracking-wider text-slate-600">
                      Next Lesson
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-300">
                      {nextLesson.title}
                    </p>

                  </div>

                  <ChevronRight
                    size={18}
                    className="text-slate-500 transition group-hover:text-blue-400"
                  />

                </Link>

              ) : (

                <Link
                  to={`/student/courses/${courseId}`}
                  className="group flex items-center gap-3 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Finish Course
                  <ArrowRight size={17} />
                </Link>

              )}

            </div>

          </div>


          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="h-fit overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70">

            {/* Sidebar Header */}

            <div className="border-b border-slate-800 p-5">

              <div className="flex items-center gap-2">

                <List
                  size={18}
                  className="text-blue-400"
                />

                <h2 className="font-semibold">
                  Course Content
                </h2>

              </div>

              <p className="mt-2 text-xs text-slate-500">
                {course.lessons.length} lessons
              </p>

            </div>


            {/* Lesson List */}

            <div className="max-h-155 overflow-y-auto p-3">

              {course.lessons.map(
                (lesson, index) => {

                  const isCurrent =
                    String(lesson.id) ===
                    String(currentLesson.id);

                  const isLessonCompleted =
                    lesson.completed ||
                    (completed && isCurrent);

                  return (
                    <Link
                      key={lesson.id}
                      to={`/student/courses/${courseId}/lesson/${lesson.id}`}
                      className={`mb-1 flex items-center gap-3 rounded-xl p-3 transition ${
                        isCurrent
                          ? "bg-blue-500/10"
                          : "hover:bg-slate-800/70"
                      }`}
                    >

                      {/* Status */}

                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          isLessonCompleted
                            ? "bg-emerald-500/10 text-emerald-400"
                            : isCurrent
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >

                        {isLessonCompleted ? (

                          <CheckCircle2 size={17} />

                        ) : (

                          <span className="text-xs font-semibold">
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </span>

                        )}

                      </div>


                      {/* Information */}

                      <div className="min-w-0 flex-1">

                        <p
                          className={`truncate text-sm font-medium ${
                            isCurrent
                              ? "text-blue-400"
                              : "text-slate-300"
                          }`}
                        >
                          {lesson.title}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-600">
                          {lesson.duration}
                        </p>

                      </div>

                    </Link>
                  );
                }
              )}

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Lesson;