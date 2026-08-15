import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  Clock3,
  Users,
  Star,
  ArrowRight,
  Filter,
  GraduationCap,
} from "lucide-react";

function Explore() {
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  /* =====================================================
     LOAD TEACHER-UPLOADED COURSES
  ===================================================== */

  useEffect(() => {
    const loadTeacherCourses = () => {
      try {
        const savedCourses =
          JSON.parse(localStorage.getItem("teacherCourses")) || [];

        setTeacherCourses(Array.isArray(savedCourses) ? savedCourses : []);
      } catch (error) {
        console.error("Failed to load teacher courses:", error);
        setTeacherCourses([]);
      }
    };

    loadTeacherCourses();

    // Keep the list fresh if a teacher publishes a course in another tab.
    window.addEventListener("storage", loadTeacherCourses);
    return () => window.removeEventListener("storage", loadTeacherCourses);
  }, []);

  /* =====================================================
     NORMALIZE COURSES
  ===================================================== */

  const courses = useMemo(() => {
    return teacherCourses.map((course) => ({
      ...course,
      instructor: course.instructor || "StudySphere Teacher",
      category: course.category || "General",
      level: course.level || "Beginner",
      description: course.description || "Learn this course on StudySphere.",
      students: course.students || 0,
      rating: course.rating || 0,
      color: course.color || "purple",
      lessonsCount: Array.isArray(course.lessons) ? course.lessons.length : 0,
      duration:
        course.duration ||
        `${Array.isArray(course.lessons) ? course.lessons.length : 0} lessons`,
    }));
  }, [teacherCourses]);

  /* =====================================================
     SUBJECTS (derived from course categories)
  ===================================================== */

  const subjects = useMemo(() => {
    const dynamic = courses.map((course) => course.category).filter(Boolean);
    return ["All", ...Array.from(new Set(dynamic))];
  }, [courses]);

  /* =====================================================
     FILTERED COURSES
  ===================================================== */

  const filteredCourses = useMemo(() => {
    const query = search.toLowerCase().trim();

    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query);

      const matchesSubject =
        selectedSubject === "All" || course.category === selectedSubject;

      return matchesSearch && matchesSubject;
    });
  }, [courses, search, selectedSubject]);

  /* =====================================================
     GRADIENT HELPER
  ===================================================== */

  const getCourseGradient = (color) => {
    const gradients = {
      blue: "from-blue-600/30 via-blue-500/10 to-slate-950",
      cyan: "from-cyan-600/30 via-cyan-500/10 to-slate-950",
      yellow: "from-yellow-600/30 via-yellow-500/10 to-slate-950",
      purple: "from-purple-600/30 via-purple-500/10 to-slate-950",
      orange: "from-orange-600/30 via-orange-500/10 to-slate-950",
      emerald: "from-emerald-600/30 via-emerald-500/10 to-slate-950",
      green: "from-green-600/30 via-green-500/10 to-slate-950",
      slate: "from-slate-600/30 via-slate-500/10 to-slate-950",
    };

    return gradients[color] || gradients.slate;
  };

  return (
    <div className="page-enter min-h-screen bg-slate-950 text-white">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                Explore
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                Discover Courses
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
                Browse courses published by StudySphere teachers. Anyone can
                preview a course — sign in when you're ready to enroll.
              </p>
            </div>

            <div className="min-w-[170px] rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                Courses Available
              </p>
              <p className="mt-1 text-2xl font-bold text-white">
                {courses.length}
              </p>
            </div>
          </div>

          {/* =================================================
              SEARCH + SUBJECT FILTER
          ================================================= */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses, topics, or instructors..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="relative sm:w-64">
              <Filter
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-900/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject} className="bg-slate-900">
                    {subject === "All" ? "All Subjects" : subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* =================================================
          COURSE GRID
      ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-10">
        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 py-24 text-center">
            <GraduationCap size={40} className="text-slate-600" />

            <h3 className="mt-5 text-xl font-semibold text-white">
              {courses.length === 0
                ? "No courses published yet"
                : "No courses match your search"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {courses.length === 0
                ? "Teachers haven't uploaded any courses yet. Check back soon."
                : "Try a different search term or subject filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                to={`/explore/${course.id}`}
                className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl hover:shadow-black/20"
              >
                <div
                  className={`relative h-32 overflow-hidden bg-gradient-to-br ${getCourseGradient(
                    course.color
                  )}`}
                >
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
                  )}

                  <div
                    className={`absolute inset-0 ${
                      course.thumbnail
                        ? "bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent"
                        : ""
                    }`}
                  />

                  <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-purple-400/20 bg-slate-950/60 px-3 py-1.5 text-xs font-medium text-purple-400 backdrop-blur">
                    Teacher Course
                  </div>

                  {!course.thumbnail && (
                    <div className="absolute bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-white/80 backdrop-blur">
                      <BookOpen size={24} strokeWidth={1.7} />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400">
                      {course.category}
                    </span>

                    <span className="text-xs text-slate-500">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="mt-4 min-h-[56px] line-clamp-2 text-xl font-semibold leading-7 text-white">
                    {course.title}
                  </h3>

                  <p className="mt-3 min-h-[48px] line-clamp-2 text-sm leading-6 text-slate-500">
                    {course.description}
                  </p>

                  <p className="mt-4 text-xs text-slate-600">
                    By <span className="text-slate-400">{course.instructor}</span>
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                    {course.rating > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </span>
                    )}

                    <span className="flex items-center gap-1.5">
                      <Users size={14} />
                      {course.students}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={14} />
                      {course.duration}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 py-3 text-sm font-semibold text-white transition-all duration-200 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 group-hover:text-blue-400">
                    View Course
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Explore;
