import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Trash2,
  Play,
  Save,
} from "lucide-react";

function CreateCourse() {
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: "",
    category: "",
    level: "Beginner",
    description: "",
  });

  const [lessons, setLessons] = useState([
    {
      id: Date.now(),
      title: "",
      description: "",
      videoUrl: "",
      duration: "",
    },
  ]);

  /* =====================================================
     COURSE INPUT
  ===================================================== */

  const handleCourseChange = (e) => {
    const { name, value } = e.target;

    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     LESSON INPUT
  ===================================================== */

  const handleLessonChange = (id, field, value) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === id
          ? {
              ...lesson,
              [field]: value,
            }
          : lesson
      )
    );
  };

  /* =====================================================
     YOUTUBE URL → VIDEO ID
  ===================================================== */

  const extractYouTubeVideoId = (url) => {
    if (!url) return null;

    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.replace(
        "www.",
        ""
      );

      // youtube.com/watch?v=VIDEO_ID
      if (
        hostname === "youtube.com" &&
        parsedUrl.pathname === "/watch"
      ) {
        return parsedUrl.searchParams.get("v");
      }

      // youtu.be/VIDEO_ID
      if (hostname === "youtu.be") {
        return parsedUrl.pathname
          .split("/")
          .filter(Boolean)[0] || null;
      }

      // youtube.com/shorts/VIDEO_ID
      if (
        hostname === "youtube.com" &&
        parsedUrl.pathname.startsWith("/shorts/")
      ) {
        return (
          parsedUrl.pathname
            .split("/")
            .filter(Boolean)[1] || null
        );
      }

      // youtube.com/embed/VIDEO_ID
      if (
        hostname === "youtube.com" &&
        parsedUrl.pathname.startsWith("/embed/")
      ) {
        return (
          parsedUrl.pathname
            .split("/")
            .filter(Boolean)[1] || null
        );
      }

      return null;
    } catch {
      return null;
    }
  };

  /* =====================================================
     ADD LESSON
  ===================================================== */

  const addLesson = () => {
    setLessons((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        description: "",
        videoUrl: "",
        duration: "",
      },
    ]);
  };

  /* =====================================================
     REMOVE LESSON
  ===================================================== */

  const removeLesson = (id) => {
    if (lessons.length === 1) return;

    setLessons((prev) =>
      prev.filter((lesson) => lesson.id !== id)
    );
  };

  /* =====================================================
     SAVE COURSE
  ===================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!course.title.trim()) {
      alert("Please enter a course title.");
      return;
    }

    if (!course.category.trim()) {
      alert("Please enter a course category.");
      return;
    }

    if (!course.description.trim()) {
      alert("Please enter a course description.");
      return;
    }

    const validLessons = lessons.filter(
      (lesson) =>
        lesson.title.trim() &&
        extractYouTubeVideoId(lesson.videoUrl)
    );

    if (validLessons.length === 0) {
      alert(
        "Please add at least one lesson with a valid YouTube URL."
      );
      return;
    }

    const savedCourses =
      JSON.parse(
        localStorage.getItem("teacherCourses")
      ) || [];

    const newCourse = {
      id: Date.now(),
      ...course,
      instructor: "StudySphere Teacher",
      students: 0,
      rating: 0,
      progress: 0,

      lessons: validLessons.map(
        (lesson, index) => ({
          id: index + 1,
          title: lesson.title,
          description: lesson.description,

          // Store only the extracted YouTube ID
          videoId: extractYouTubeVideoId(
            lesson.videoUrl
          ),

          duration: lesson.duration,
        })
      ),

      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "teacherCourses",
      JSON.stringify([
        ...savedCourses,
        newCourse,
      ])
    );

    alert("Course created successfully!");

    navigate("/teacher/dashboard");
  };

  return (
    <div className="page-enter min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-800 bg-slate-950">

        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

          <button
            type="button"
            onClick={() =>
              navigate("/teacher/dashboard")
            }
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2">

            <BookOpen
              size={20}
              className="text-purple-400"
            />

            <span className="font-semibold">
              Create Course
            </span>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-5xl px-6 py-10">

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-widest text-purple-400">
            Teacher Studio
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Create a new course
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            Build your course and add YouTube lectures that
            students can watch directly inside StudySphere.
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* =================================================
              COURSE INFORMATION
          ================================================= */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">

            <div className="mb-6">

              <h2 className="text-xl font-semibold">
                Course Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add the basic information students will see.
              </p>

            </div>


            <div className="grid gap-6 md:grid-cols-2">

              {/* Title */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Course Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={course.title}
                  onChange={handleCourseChange}
                  placeholder="e.g. Data Structures & Algorithms"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-purple-500"
                />

              </div>


              {/* Category */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={course.category}
                  onChange={handleCourseChange}
                  placeholder="e.g. Programming"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-purple-500"
                />

              </div>


              {/* Level */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Level
                </label>

                <select
                  name="level"
                  value={course.level}
                  onChange={handleCourseChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>

              </div>


              {/* Description */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Course Description
                </label>

                <textarea
                  name="description"
                  value={course.description}
                  onChange={handleCourseChange}
                  rows={5}
                  placeholder="Describe what students will learn..."
                  className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-purple-500"
                />

              </div>

            </div>

          </section>


          {/* =================================================
              LESSONS
          ================================================= */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  Course Lessons
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add your YouTube lectures here.
                </p>

              </div>


              <button
                type="button"
                onClick={addLesson}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-purple-500/40 hover:bg-slate-800 hover:text-white"
              >
                <Plus size={17} />
                Add Lesson
              </button>

            </div>


            <div className="mt-8 space-y-5">

              {lessons.map((lesson, index) => (

                <div
                  key={lesson.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                >

                  {/* Lesson Header */}

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-sm font-semibold text-purple-400">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-200">
                          Lesson {index + 1}
                        </p>

                        <p className="text-xs text-slate-600">
                          Add lecture details
                        </p>

                      </div>

                    </div>


                    {lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeLesson(lesson.id)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
                        aria-label="Remove lesson"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}

                  </div>


                  <div className="mt-6 grid gap-5 md:grid-cols-2">

                    {/* Lesson Title */}

                    <div className="md:col-span-2">

                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Lesson Title
                      </label>

                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) =>
                          handleLessonChange(
                            lesson.id,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Introduction to DSA"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-purple-500"
                      />

                    </div>


                    {/* YouTube URL */}

                    <div>

                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">

                        <Play
                          size={17}
                          className="text-red-400"
                        />

                        YouTube Lecture URL

                      </label>

                      <input
                        type="url"
                        value={lesson.videoUrl}
                        onChange={(e) =>
                          handleLessonChange(
                            lesson.id,
                            "videoUrl",
                            e.target.value
                          )
                        }
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-purple-500"
                      />

                      <p className="mt-2 text-xs text-slate-600">
                        Paste the complete YouTube video URL.
                      </p>

                      {lesson.videoUrl && (
                        <div className="mt-2">

                          {extractYouTubeVideoId(
                            lesson.videoUrl
                          ) ? (
                            <p className="text-xs font-medium text-emerald-400">
                              ✓ Valid YouTube URL
                            </p>
                          ) : (
                            <p className="text-xs font-medium text-red-400">
                              ✕ Invalid YouTube URL
                            </p>
                          )}

                        </div>
                      )}

                    </div>


                    {/* Duration */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Duration
                      </label>

                      <input
                        type="text"
                        value={lesson.duration}
                        onChange={(e) =>
                          handleLessonChange(
                            lesson.id,
                            "duration",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 32 min"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-purple-500"
                      />

                    </div>


                    {/* Description */}

                    <div className="md:col-span-2">

                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Lesson Description
                      </label>

                      <textarea
                        value={lesson.description}
                        onChange={(e) =>
                          handleLessonChange(
                            lesson.id,
                            "description",
                            e.target.value
                          )
                        }
                        rows={3}
                        placeholder="What will students learn in this lesson?"
                        className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-purple-500"
                      />

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>


          {/* =================================================
              CREATE COURSE
          ================================================= */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate("/teacher/dashboard")
              }
              className="rounded-xl border border-slate-800 px-6 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
            >
              <Save size={17} />
              Create Course
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default CreateCourse;