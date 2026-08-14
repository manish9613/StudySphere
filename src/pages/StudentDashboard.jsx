import StudentNavbar from "../components/student/StudentNavbar";
import { Link } from "react-router-dom";

import {
  Brain,
  Clock3,
  CheckCircle2,
  Flame,
  BookOpen,
  TrendingUp,
  Users,
  ArrowRight,
  Play,
} from "lucide-react";

function StudentDashboard() {
  return (
    <div className="page-enter min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          STUDENT NAVBAR
      ===================================================== */}

      <StudentNavbar />


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-12">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>

            <p className="text-sm font-medium text-blue-400">
              STUDENT DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Welcome back 👋
            </h1>

            <p className="mt-3 text-slate-400">
              Keep learning, stay focused, and make progress today.
            </p>

          </div>


          <Link
            to="/focus"
            className="btn-primary hero-button inline-flex w-fit items-center gap-2 !rounded-xl"
          >
            <Play size={18} />
            Start Focus Session
          </Link>

        </div>


        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Focus Streak */}

          <div className="dashboard-card stagger-in stagger-1 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Focus Streak
              </p>

              <Flame
                size={20}
                className="text-orange-400"
              />

            </div>

            <p className="mt-4 text-3xl font-bold">
              14
            </p>

            <p className="mt-2 text-sm text-blue-400">
              days
            </p>

          </div>


          {/* Study Time */}

          <div className="dashboard-card stagger-in stagger-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Study Time
              </p>

              <Clock3
                size={20}
                className="text-blue-400"
              />

            </div>

            <p className="mt-4 text-3xl font-bold">
              12h 40m
            </p>

            <p className="mt-2 text-sm text-slate-500">
              This week
            </p>

          </div>


          {/* Tasks Completed */}

          <div className="dashboard-card stagger-in stagger-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Tasks Completed
              </p>

              <CheckCircle2
                size={20}
                className="text-emerald-400"
              />

            </div>

            <p className="mt-4 text-3xl font-bold">
              24
            </p>

            <p className="mt-2 text-sm text-emerald-400">
              +18% this week
            </p>

          </div>


          {/* Progress */}

          <div className="dashboard-card stagger-in stagger-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Progress
              </p>

              <TrendingUp
                size={20}
                className="text-purple-400"
              />

            </div>

            <p className="mt-4 text-3xl font-bold">
              78%
            </p>

            <p className="mt-2 text-sm text-purple-400">
              Weekly completion
            </p>

          </div>

        </div>


        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* =================================================
              TODAY'S FOCUS
          ================================================= */}

          <div className="dashboard-card rounded-3xl border border-slate-800 bg-slate-900/70 p-6 lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  TODAY
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Today's Focus
                </h2>

              </div>

              <Link
                to="/focus"
                className="link-underline text-sm text-blue-400 hover:text-blue-300"
              >
                Open Focus →
              </Link>

            </div>


            <div className="mt-7 space-y-4">

              {/* Completed */}

              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">

                <CheckCircle2
                  size={21}
                  className="shrink-0 text-blue-500"
                />

                <div className="flex-1">

                  <p className="font-medium">
                    Complete DSA practice
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    45 minute session
                  </p>

                </div>

                <span className="text-xs text-emerald-400">
                  Done
                </span>

              </div>


              {/* Pending */}

              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">

                <div className="h-5 w-5 rounded-md border border-slate-700" />

                <div className="flex-1">

                  <p className="font-medium">
                    Revise React concepts
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    30 minute session
                  </p>

                </div>

                <span className="text-xs text-slate-500">
                  Pending
                </span>

              </div>


              {/* Pending */}

              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">

                <div className="h-5 w-5 rounded-md border border-slate-700" />

                <div className="flex-1">

                  <p className="font-medium">
                    Complete focused study
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    60 minute session
                  </p>

                </div>

                <span className="text-xs text-slate-500">
                  Pending
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              AI MENTOR
          ================================================= */}

          <div className="dashboard-card rounded-3xl border border-indigo-500/20 bg-slate-900/70 p-6">

            <div className="flex items-center gap-3">

              <div className="ai-icon flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Brain size={23} />
              </div>

              <div>

                <p className="text-sm text-slate-500">
                  YOUR ASSISTANT
                </p>

                <h2 className="font-semibold">
                  AI Mentor
                </h2>

              </div>

            </div>


            <p className="mt-6 leading-7 text-slate-400">
              Need help deciding what to study or understanding
              a difficult concept?
            </p>


            <Link
              to="/ai-mentor"
              className="mt-7 inline-flex items-center font-semibold text-indigo-400"
            >
              Talk to AI Mentor

              <ArrowRight
                size={17}
                className="ml-2"
              />
            </Link>

          </div>

        </div>


        {/* =====================================================
            LOWER GRID
        ===================================================== */}

        <div className="mt-6 grid gap-6 md:grid-cols-3">

          {/* Courses */}

          <div className="dashboard-card rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <BookOpen size={22} />
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Continue Learning
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              Continue your enrolled courses and pick up
              exactly where you stopped.
            </p>

            <Link
              to="/platforms"
              className="mt-7 inline-flex items-center text-blue-400"
            >
              Explore Courses
              <ArrowRight
                size={17}
                className="ml-2"
              />
            </Link>

          </div>


          {/* Progress */}

          <div className="dashboard-card rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp size={22} />
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Your Progress
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              See your study consistency, completed goals,
              and overall learning progress.
            </p>

            <Link
              to="/progress"
              className="mt-7 inline-flex items-center text-purple-400"
            >
              View Progress
              <ArrowRight
                size={17}
                className="ml-2"
              />
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
              Connect with other learners, share ideas,
              ask questions, and grow together.
            </p>

            <Link
              to="/community"
              className="mt-7 inline-flex items-center text-emerald-400"
            >
              Explore Community
              <ArrowRight
                size={17}
                className="ml-2"
              />
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default StudentDashboard;