import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Lock,
  Play,
  Star,
  Users,
} from "lucide-react";

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  /* =====================================================
     DEMO COURSES
  ===================================================== */

  const courses = {
    1: {
      title: "Data Structures & Algorithms",
      category: "DSA",
      level: "Intermediate",
      instructor: "StudySphere Academy",
      rating: 4.9,
      students: "12.4K",
      duration: "42 hours",
      description:
        "Master data structures, algorithms, and problem-solving techniques through structured lessons and practical examples.",
      progress: 68,
      color: "blue",

      lessons: [
        {
          id: 1,
          title: "Introduction to DSA",
          duration: "18 min",
          completed: true,
        },
        {
          id: 2,
          title: "Arrays & Strings",
          duration: "32 min",
          completed: true,
        },
        {
          id: 3,
          title: "Linked Lists",
          duration: "41 min",
          completed: true,
        },
        {
          id: 4,
          title: "Stacks & Queues",
          duration: "36 min",
          completed: false,
        },
        {
          id: 5,
          title: "Trees",
          duration: "48 min",
          completed: false,
        },
        {
          id: 6,
          title: "Graphs",
          duration: "52 min",
          completed: false,
        },
        {
          id: 7,
          title: "Dynamic Programming",
          duration: "60 min",
          completed: false,
        },
      ],
    },

    2: {
      title: "Complete React Development",
      category: "React",
      level: "Intermediate",
      instructor: "StudySphere Academy",
      rating: 4.8,
      students: "9.8K",
      duration: "36 hours",
      description:
        "Build modern and scalable React applications using components, hooks, routing, APIs, and modern frontend practices.",
      progress: 42,
      color: "cyan",

      lessons: [
        {
          id: 1,
          title: "React Fundamentals",
          duration: "24 min",
          completed: true,
        },
        {
          id: 2,
          title: "Components & Props",
          duration: "31 min",
          completed: true,
        },
        {
          id: 3,
          title: "State & Events",
          duration: "38 min",
          completed: false,
        },
        {
          id: 4,
          title: "React Hooks",
          duration: "45 min",
          completed: false,
        },
        {
          id: 5,
          title: "React Router",
          duration: "34 min",
          completed: false,
        },
        {
          id: 6,
          title: "Working with APIs",
          duration: "42 min",
          completed: false,
        },
      ],
    },

    3: {
      title: "Python Programming",
      category: "Python",
      level: "Beginner",
      instructor: "StudySphere Academy",
      rating: 4.8,
      students: "18.2K",
      duration: "28 hours",
      description:
        "Learn Python from the fundamentals and build a strong foundation for programming and problem solving.",
      progress: 0,
      color: "yellow",

      lessons: [
        {
          id: 1,
          title: "Python Introduction",
          duration: "20 min",
          completed: false,
        },
        {
          id: 2,
          title: "Variables & Data Types",
          duration: "28 min",
          completed: false,
        },
        {
          id: 3,
          title: "Conditions & Loops",
          duration: "35 min",
          completed: false,
        },
        {
          id: 4,
          title: "Functions",
          duration: "31 min",
          completed: false,
        },
        {
          id: 5,
          title: "Object Oriented Programming",
          duration: "46 min",
          completed: false,
        },
      ],
    },

    4: {
      title: "Machine Learning Fundamentals",
      category: "Machine Learning",
      level: "Intermediate",
      instructor: "StudySphere AI",
      rating: 4.9,
      students: "7.6K",
      duration: "40 hours",
      description:
        "Understand the foundations of machine learning and learn how models are trained, evaluated, and improved.",
      progress: 0,
      color: "purple",

      lessons: [
        {
          id: 1,
          title: "Introduction to Machine Learning",
          duration: "26 min",
          completed: false,
        },
        {
          id: 2,
          title: "Data Preparation",
          duration: "35 min",
          completed: false,
        },
        {
          id: 3,
          title: "Linear Regression",
          duration: "42 min",
          completed: false,
        },
        {
          id: 4,
          title: "Classification",
          duration: "48 min",
          completed: false,
        },
        {
          id: 5,
          title: "Model Evaluation",
          duration: "38 min",
          completed: false,
        },
      ],
    },

    5: {
      title: "JavaScript Mastery",
      category: "JavaScript",
      level: "Intermediate",
      instructor: "StudySphere Academy",
      rating: 4.8,
      students: "14.7K",
      duration: "32 hours",
      description:
        "Master modern JavaScript and understand the concepts required to build powerful web applications.",
      progress: 0,
      color: "orange",

      lessons: [
        {
          id: 1,
          title: "Modern JavaScript",
          duration: "25 min",
          completed: false,
        },
        {
          id: 2,
          title: "Functions & Scope",
          duration: "30 min",
          completed: false,
        },
        {
          id: 3,
          title: "Objects & Arrays",
          duration: "36 min",
          completed: false,
        },
        {
          id: 4,
          title: "Asynchronous JavaScript",
          duration: "44 min",
          completed: false,
        },
      ],
    },

    6: {
      title: "Digital Electronics",
      category: "Electronics",
      level: "Intermediate",
      instructor: "StudySphere ECE",
      rating: 4.7,
      students: "5.2K",
      duration: "24 hours",
      description:
        "Learn digital logic, combinational circuits, sequential circuits, counters, registers, and practical concepts.",
      progress: 0,
      color: "emerald",

      lessons: [
        {
          id: 1,
          title: "Digital Logic Basics",
          duration: "22 min",
          completed: false,
        },
        {
          id: 2,
          title: "Boolean Algebra",
          duration: "34 min",
          completed: false,
        },
        {
          id: 3,
          title: "Combinational Circuits",
          duration: "40 min",
          completed: false,
        },
        {
          id: 4,
          title: "Sequential Circuits",
          duration: "45 min",
          completed: false,
        },
      ],
    },

    7: {
      title: "Node.js & Backend Development",
      category: "Backend",
      level: "Intermediate",
      instructor: "StudySphere Academy",
      rating: 4.8,
      students: "8.4K",
      duration: "34 hours",
      description:
        "Build scalable backend applications with Node.js, Express, REST APIs, authentication, and databases.",
      progress: 0,
      color: "green",

      lessons: [
        {
          id: 1,
          title: "Node.js Fundamentals",
          duration: "26 min",
          completed: false,
        },
        {
          id: 2,
          title: "Express.js",
          duration: "38 min",
          completed: false,
        },
        {
          id: 3,
          title: "REST APIs",
          duration: "42 min",
          completed: false,
        },
        {
          id: 4,
          title: "Authentication",
          duration: "48 min",
          completed: false,
        },
      ],
    },

    8: {
      title: "Git & GitHub",
      category: "Development",
      level: "Beginner",
      instructor: "StudySphere Academy",
      rating: 4.9,
      students: "11.6K",
      duration: "12 hours",
      description:
        "Learn version control, GitHub collaboration, branches, pull requests, and professional workflows.",
      progress: 0,
      color: "slate",

      lessons: [
        {
          id: 1,
          title: "Git Fundamentals",
          duration: "18 min",
          completed: false,
        },
        {
          id: 2,
          title: "Branches & Merging",
          duration: "28 min",
          completed: false,
        },
        {
          id: 3,
          title: "GitHub Workflow",
          duration: "32 min",
          completed: false,
        },
        {
          id: 4,
          title: "Pull Requests",
          duration: "25 min",
          completed: false,
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
  } catch (error) {
    console.error(
      "Failed to load teacher courses:",
      error
    );
  }

  /* =====================================================
     FIND TEACHER COURSE
  ===================================================== */

  const teacherCourse = teacherCourses.find(
    (item) =>
      String(item.id) === String(courseId)
  );

  /* =====================================================
     NORMALIZE TEACHER COURSE
  ===================================================== */

  const formattedTeacherCourse = teacherCourse
    ? {
        ...teacherCourse,

        instructor:
          teacherCourse.instructor ||
          "StudySphere Teacher",

        category:
          teacherCourse.category ||
          "General",

        level:
          teacherCourse.level ||
          "Beginner",

        rating:
          teacherCourse.rating || 0,

        students:
          teacherCourse.students || 0,

        duration:
          teacherCourse.duration ||
          `${teacherCourse.lessons?.length || 0} lessons`,

        progress:
          teacherCourse.progress || 0,

        color:
          teacherCourse.color ||
          "purple",

        description:
          teacherCourse.description ||
          "Learn this course on StudySphere.",

        lessons: Array.isArray(
          teacherCourse.lessons
        )
          ? teacherCourse.lessons.map(
              (lesson, index) => ({
                ...lesson,

                id:
                  lesson.id ??
                  index + 1,

                title:
                  lesson.title ||
                  `Lesson ${index + 1}`,

                duration:
                  lesson.duration ||
                  "Video lesson",

                completed:
                  Boolean(
                    lesson.completed
                  ),

                videoId:
                  lesson.videoId || "",
              })
            )
          : [],
      }
    : null;

  /* =====================================================
     FINAL COURSE

     Teacher-created course gets priority.
     Otherwise use demo course.
  ===================================================== */

  const course =
    formattedTeacherCourse ||
    courses[courseId];

  /* =====================================================
     INVALID COURSE
  ===================================================== */

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

        <div className="text-center">

          <BookOpen
            size={40}
            className="mx-auto text-slate-600"
          />

          <h1 className="mt-5 text-2xl font-bold">
            Course not found
          </h1>

          <p className="mt-2 text-slate-500">
            The course you are looking for does not exist.
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
     COURSE PROGRESS
  ===================================================== */

  const completedLessons =
    Array.isArray(course.lessons)
      ? course.lessons.filter(
          (lesson) =>
            lesson.completed
        ).length
      : 0;

  const calculatedProgress =
    course.lessons.length > 0
      ? Math.round(
          (completedLessons /
            course.lessons.length) *
            100
        )
      : 0;

  const progress =
    course.progress > 0
      ? course.progress
      : calculatedProgress;

  /* =====================================================
     NEXT LESSON
  ===================================================== */

  const nextLesson =
    course.lessons.find(
      (lesson) =>
        !lesson.completed
    ) ||
    course.lessons[0] ||
    null;

  /* =====================================================
     GRADIENT
  ===================================================== */

  const getGradient = () => {
    const gradients = {
      blue:
        "from-blue-600/30 via-blue-500/10",

      cyan:
        "from-cyan-600/30 via-cyan-500/10",

      yellow:
        "from-yellow-600/30 via-yellow-500/10",

      purple:
        "from-purple-600/30 via-purple-500/10",

      orange:
        "from-orange-600/30 via-orange-500/10",

      emerald:
        "from-emerald-600/30 via-emerald-500/10",

      green:
        "from-green-600/30 via-green-500/10",

      slate:
        "from-slate-600/30 via-slate-500/10",
    };

    return (
      gradients[course.color] ||
      gradients.slate
    );
  };

  /* =====================================================
     NO LESSONS
  ===================================================== */

  const hasLessons =
    course.lessons.length > 0;

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="page-enter min-h-screen bg-slate-950 text-white">

      {/* =================================================
          HEADER / COURSE HERO
      ================================================= */}

      <section className="border-b border-slate-800">

        <div className="mx-auto max-w-7xl px-6 py-10">

          {/* Back */}

          <button
            type="button"
            onClick={() =>
              navigate("/student/courses")
            }
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Courses
          </button>


          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">

            {/* =================================================
                COURSE INFORMATION
            ================================================= */}

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <span className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
                  {course.category}
                </span>

                <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-500">
                  {course.level}
                </span>

                {teacherCourse && (
                  <span className="rounded-lg bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-400">
                    Teacher Course
                  </span>
                )}

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


              {/* Stats */}

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">

                <span className="flex items-center gap-2">

                  <Star
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />

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

                  {course.duration}

                </span>

              </div>

            </div>


            {/* =================================================
                COURSE PREVIEW CARD
            ================================================= */}

            <div
              className={`overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br ${getGradient()} to-slate-950`}
            >

              <div className="flex h-48 items-center justify-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-slate-950/60 text-white/80 backdrop-blur">

                  <BookOpen
                    size={38}
                    strokeWidth={1.5}
                  />

                </div>

              </div>


              <div className="border-t border-white/5 bg-slate-950/50 p-6">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    Course Progress
                  </span>

                  <span className="font-semibold text-blue-400">
                    {progress}%
                  </span>

                </div>


                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>


                {hasLessons ? (

                  <Link
                    to={`/student/courses/${courseId}/lesson/${nextLesson.id}`}
                    className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                  >

                    <Play size={17} />

                    {progress > 0
                      ? "Continue Learning"
                      : "Start Course"}

                  </Link>

                ) : (

                  <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-center text-sm text-slate-500">
                    No lessons available yet.
                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          CURRICULUM
      ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-12">

        <div className="max-w-3xl">

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Curriculum
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Course Lessons
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {completedLessons} of{" "}
            {course.lessons.length} lessons completed
          </p>

        </div>


        {/* =================================================
            OVERALL PROGRESS
        ================================================= */}

        <div className="mt-6 max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

          <div className="flex items-center justify-between">

            <span className="text-sm text-slate-400">
              Your progress
            </span>

            <span className="text-sm font-semibold text-blue-400">
              {progress}%
            </span>

          </div>


          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>


        {/* =================================================
            LESSONS
        ================================================= */}

        {hasLessons ? (

          <div className="mt-8 max-w-4xl space-y-3">

            {course.lessons.map(
              (lesson, index) => {

                const isLocked =
                  !lesson.completed &&
                  index >
                    completedLessons + 1;

                return (
                  <div
                    key={lesson.id}
                    className={`group rounded-2xl border transition-all ${
                      lesson.completed
                        ? "border-emerald-500/10 bg-emerald-500/5"
                        : isLocked
                        ? "border-slate-800 bg-slate-900/40"
                        : "border-slate-800 bg-slate-900/70 hover:border-slate-700"
                    }`}
                  >

                    <div className="flex items-center gap-4 p-4 md:p-5">

                      {/* Number / Status */}

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          lesson.completed
                            ? "bg-emerald-500/10 text-emerald-400"
                            : isLocked
                            ? "bg-slate-800 text-slate-600"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >

                        {lesson.completed ? (

                          <CheckCircle2 size={20} />

                        ) : isLocked ? (

                          <Lock size={18} />

                        ) : (

                          <span className="text-sm font-semibold">
                            {String(
                              index + 1
                            ).padStart(2, "0")}
                          </span>

                        )}

                      </div>


                      {/* Lesson Info */}

                      <div className="min-w-0 flex-1">

                        <h3
                          className={`truncate text-sm font-semibold ${
                            isLocked
                              ? "text-slate-600"
                              : "text-slate-200"
                          }`}
                        >
                          {lesson.title}
                        </h3>


                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">

                          <Clock3 size={13} />

                          {lesson.duration}

                        </div>

                      </div>


                      {/* Action */}

                      {lesson.completed ? (

                        <Link
                          to={`/student/courses/${courseId}/lesson/${lesson.id}`}
                          className="hidden shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/10 sm:flex"
                        >

                          Review

                          <ArrowRight size={14} />

                        </Link>

                      ) : isLocked ? (

                        <div className="hidden items-center gap-2 text-xs text-slate-600 sm:flex">

                          <Lock size={14} />

                          Locked

                        </div>

                      ) : (

                        <Link
                          to={`/student/courses/${courseId}/lesson/${lesson.id}`}
                          className="hidden shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 sm:flex"
                        >

                          <Play size={14} />

                          Start

                        </Link>

                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>

        ) : (

          <div className="mt-8 max-w-4xl rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-14 text-center">

            <BookOpen
              size={32}
              className="mx-auto text-slate-600"
            />

            <h3 className="mt-4 text-lg font-semibold">
              No lessons yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              The teacher hasn't added any lessons to this course yet.
            </p>

          </div>

        )}


        {/* =================================================
            BOTTOM CTA
        ================================================= */}

        {hasLessons && (

          <div className="mt-12 max-w-4xl rounded-3xl border border-blue-500/10 bg-blue-500/5 p-7">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-sm font-semibold text-blue-400">
                  Ready to continue?
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Keep building your learning streak.
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Continue with your next lesson and make steady progress.
                </p>

              </div>


              <Link
                to={`/student/courses/${courseId}/lesson/${nextLesson.id}`}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >

                Continue

                <ArrowRight size={16} />

              </Link>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default CourseDetails;