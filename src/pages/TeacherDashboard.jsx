import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Upload,
  BarChart3,
  Brain,
  Plus,
  ArrowRight,
  Clock3,
} from "lucide-react";

function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <main className="mx-auto max-w-7xl px-6 py-12">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>

            <p className="text-sm font-medium text-purple-400">
              TEACHER DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Welcome back 👋
            </h1>

            <p className="mt-3 text-slate-400">
              Create, teach, manage, and inspire your learners.
            </p>

          </div>


          <Link
            to="/teacher/create-course"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-purple-500"
          >
            <Plus size={18} />
            Create Course
          </Link>

        </div>


        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="dashboard-card rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Published Courses
              </p>

              <BookOpen
                size={20}
                className="text-purple-400"
              />

            </div>

            <p className="mt-4 text-3xl font-bold">
              8
            </p>

            <p className="mt-2 text-sm text-purple-400">
              2 updated this month
            </p>

          </div>


          <div className="dashboard-card rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Students
              </p>

              <Users
                size={20}
                className="text-blue-400"
              />

            </div>

            <p className="mt-4 text-3xl font-bold">
              342
            </p>

            <p className="mt-2 text-sm text-emerald-400">
              +24 this month
            </p>

          </div>


          <div className="dashboard-card rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Course Views
              </p>

              <BarChart3
                size={20}
                className="text-blue-400"
              />

            </div>

            <p className="mt-4 text-3xl font-bold">
              12.8K
            </p>

            <p className="mt-2 text-sm text-blue-400">
              +12% this month
            </p>

          </div>


          <div className="dashboard-card rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Draft Courses
              </p>

              <Clock3
                size={20}
                className="text-orange-400"
              />

            </div>

            <p className="mt-4 text-3xl font-bold">
              3
            </p>

            <p className="mt-2 text-sm text-orange-400">
              Ready to continue
            </p>

          </div>

        </div>


        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* Recent Courses */}

          <div className="dashboard-card rounded-3xl border border-slate-800 bg-slate-900/70 p-6 lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  YOUR CONTENT
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Recent Courses
                </h2>
              </div>

              <Link
                to="/teacher/courses"
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Manage All →
              </Link>

            </div>


            <div className="mt-7 space-y-4">

              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <BookOpen size={22} />
                </div>

                <div className="flex-1">

                  <h3 className="font-semibold">
                    Data Structures & Algorithms
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    18 lessons · 142 students
                  </p>

                </div>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                  Published
                </span>

              </div>


              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <BookOpen size={22} />
                </div>

                <div className="flex-1">

                  <h3 className="font-semibold">
                    Modern React Development
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    12 lessons · 98 students
                  </p>

                </div>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                  Published
                </span>

              </div>


              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                  <BookOpen size={22} />
                </div>

                <div className="flex-1">

                  <h3 className="font-semibold">
                    JavaScript Fundamentals
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    8 lessons · Draft
                  </p>

                </div>

                <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
                  Draft
                </span>

              </div>

            </div>

          </div>


          {/* Quick Actions */}

          <div className="dashboard-card rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

            <p className="text-sm text-slate-500">
              QUICK ACTIONS
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Manage your teaching
            </h2>


            <div className="mt-7 space-y-3">

              <Link
                to="/teacher/create-course"
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 transition-all duration-300 hover:border-purple-500/30 hover:bg-slate-900"
              >

                <Upload
                  size={19}
                  className="text-purple-400"
                />

                <span className="flex-1 text-sm font-medium">
                  Create & Upload Course
                </span>

                <ArrowRight size={17} />

              </Link>


              <Link
                to="/teacher/courses"
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 transition-all duration-300 hover:border-purple-500/30 hover:bg-slate-900"
              >

                <BookOpen
                  size={19}
                  className="text-blue-400"
                />

                <span className="flex-1 text-sm font-medium">
                  Manage Courses
                </span>

                <ArrowRight size={17} />

              </Link>


              <Link
                to="/teacher/students"
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 transition-all duration-300 hover:border-purple-500/30 hover:bg-slate-900"
              >

                <Users
                  size={19}
                  className="text-emerald-400"
                />

                <span className="flex-1 text-sm font-medium">
                  View Students
                </span>

                <ArrowRight size={17} />

              </Link>

            </div>

          </div>

        </div>


        {/* =====================================================
            LOWER FEATURES
        ===================================================== */}

        <div className="mt-6 grid gap-6 md:grid-cols-3">

          {/* AI */}

          <div className="dashboard-card rounded-3xl border border-indigo-500/20 bg-slate-900/70 p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Brain size={22} />
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              AI Mentor
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Use AI assistance to explain concepts, plan lessons,
              and support your teaching workflow.
            </p>

            <Link
              to="/ai-mentor"
              className="mt-7 inline-flex items-center text-indigo-400"
            >
              Explore AI Mentor
              <ArrowRight size={17} className="ml-2" />
            </Link>

          </div>


          {/* Analytics */}

          <div className="dashboard-card rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <BarChart3 size={22} />
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Teaching Analytics
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Understand course engagement, student activity,
              and how your content is performing.
            </p>

            <Link
              to="/teacher/analytics"
              className="mt-7 inline-flex items-center text-blue-400"
            >
              View Analytics
              <ArrowRight size={17} className="ml-2" />
            </Link>

          </div>


          {/* Community */}

          <div className="dashboard-card rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users size={22} />
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Community
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Connect with learners and other teachers,
              share knowledge, and build discussions.
            </p>

            <Link
              to="/community"
              className="mt-7 inline-flex items-center text-emerald-400"
            >
              Explore Community
              <ArrowRight size={17} className="ml-2" />
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default TeacherDashboard;