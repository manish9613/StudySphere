function Organize() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Organize
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Keep your learning organized.
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Manage your subjects, tasks, notes, and upcoming study goals
            from one place.
          </p>
        </div>


        {/* Overview Cards */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-2xl">📚</div>

            <p className="mt-4 text-sm text-slate-500">
              Active Subjects
            </p>

            <p className="mt-2 text-3xl font-bold">
              5
            </p>
          </div>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-2xl">✅</div>

            <p className="mt-4 text-sm text-slate-500">
              Tasks Completed
            </p>

            <p className="mt-2 text-3xl font-bold">
              24
            </p>
          </div>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-2xl">📝</div>

            <p className="mt-4 text-sm text-slate-500">
              Saved Notes
            </p>

            <p className="mt-2 text-3xl font-bold">
              18
            </p>
          </div>

        </div>


        {/* Main Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">


          {/* Subjects */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  Your Subjects
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Keep track of what you're learning.
                </p>
              </div>

              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500">
                + Add
              </button>

            </div>


            <div className="mt-6 space-y-3">

              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                    💻
                  </div>

                  <div>
                    <p className="font-medium">
                      DSA
                    </p>

                    <p className="text-xs text-slate-600">
                      32 topics
                    </p>
                  </div>

                </div>

                <span className="text-sm text-blue-400">
                  72%
                </span>

              </div>


              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
                    ⚛️
                  </div>

                  <div>
                    <p className="font-medium">
                      React
                    </p>

                    <p className="text-xs text-slate-600">
                      24 topics
                    </p>
                  </div>

                </div>

                <span className="text-sm text-purple-400">
                  58%
                </span>

              </div>


              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-500/10">
                    🗄️
                  </div>

                  <div>
                    <p className="font-medium">
                      DBMS
                    </p>

                    <p className="text-xs text-slate-600">
                      18 topics
                    </p>
                  </div>

                </div>

                <span className="text-sm text-cyan-400">
                  45%
                </span>

              </div>


              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10">
                    ⚙️
                  </div>

                  <div>
                    <p className="font-medium">
                      Operating Systems
                    </p>

                    <p className="text-xs text-slate-600">
                      20 topics
                    </p>
                  </div>

                </div>

                <span className="text-sm text-indigo-400">
                  39%
                </span>

              </div>

            </div>

          </section>


          {/* Tasks */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  Today's Tasks
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Stay on top of your daily goals.
                </p>
              </div>

              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500">
                + Add
              </button>

            </div>


            <div className="mt-6 space-y-3">

              <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4">

                <input
                  type="checkbox"
                  className="size-4 accent-blue-600"
                />

                <div className="flex-1">
                  <p className="font-medium">
                    Complete Arrays practice
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    DSA · 45 minutes
                  </p>
                </div>

                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400">
                  High
                </span>

              </div>


              <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4">

                <input
                  type="checkbox"
                  className="size-4 accent-blue-600"
                />

                <div className="flex-1">
                  <p className="font-medium">
                    Revise React Hooks
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    React · 30 minutes
                  </p>
                </div>

                <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                  Medium
                </span>

              </div>


              <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4">

                <input
                  type="checkbox"
                  className="size-4 accent-blue-600"
                />

                <div className="flex-1">
                  <p className="font-medium">
                    Read DBMS notes
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    DBMS · 25 minutes
                  </p>
                </div>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                  Low
                </span>

              </div>


              <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4">

                <input
                  type="checkbox"
                  className="size-4 accent-blue-600"
                />

                <div className="flex-1">
                  <p className="font-medium">
                    AI Mentor session
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    React · 20 minutes
                  </p>
                </div>

                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                  Today
                </span>

              </div>

            </div>

          </section>

        </div>


        {/* Upcoming */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                Upcoming
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Don't miss your important study goals.
              </p>
            </div>

            <button className="text-sm text-blue-400 hover:text-blue-300">
              View calendar →
            </button>

          </div>


          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

              <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
                Tomorrow
              </p>

              <h3 className="mt-3 font-semibold">
                DBMS Revision
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                2:00 PM · 1 hour
              </p>

            </div>


            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

              <p className="text-xs font-medium uppercase tracking-wider text-purple-400">
                Friday
              </p>

              <h3 className="mt-3 font-semibold">
                React Project
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                5:00 PM · 2 hours
              </p>

            </div>


            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

              <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
                Sunday
              </p>

              <h3 className="mt-3 font-semibold">
                Weekly Review
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                10:00 AM · 45 minutes
              </p>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Organize;