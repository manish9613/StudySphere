function Progress() {
  return (
    <div className="page-enter min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Progress
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            See how far you've come.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            Track your study time, learning streaks, completed goals,
            and progress across different subjects.
          </p>
        </div>


        {/* Stats */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">
              Study Time
            </p>

            <p className="mt-3 text-3xl font-bold">
              42h 35m
            </p>

            <p className="mt-2 text-xs text-green-400">
              ↑ 18% this week
            </p>
          </div>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">
              Current Streak
            </p>

            <p className="mt-3 text-3xl font-bold">
              🔥 14 days
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Personal best: 21 days
            </p>
          </div>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">
              Tasks Completed
            </p>

            <p className="mt-3 text-3xl font-bold">
              86
            </p>

            <p className="mt-2 text-xs text-green-400">
              12 completed this week
            </p>
          </div>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">
              Achievements
            </p>

            <p className="mt-3 text-3xl font-bold">
              🏆 8
            </p>

            <p className="mt-2 text-xs text-blue-400">
              2 unlocked this month
            </p>
          </div>

        </div>


        {/* Main Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">


          {/* Weekly Activity */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  Weekly Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your study activity over the last 7 days.
                </p>
              </div>

              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                This week
              </span>

            </div>


            {/* Chart */}
            <div className="mt-10 flex h-64 items-end justify-between gap-3 border-b border-slate-800 px-2">

              {[
                { day: "Mon", height: "55%", time: "2h 10m" },
                { day: "Tue", height: "72%", time: "3h 05m" },
                { day: "Wed", height: "42%", time: "1h 45m" },
                { day: "Thu", height: "85%", time: "3h 40m" },
                { day: "Fri", height: "65%", time: "2h 35m" },
                { day: "Sat", height: "95%", time: "4h 15m" },
                { day: "Sun", height: "48%", time: "2h 00m" },
              ].map((item) => (
                <div
                  key={item.day}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                >

                  <span className="text-xs text-slate-600">
                    {item.time}
                  </span>

                  <div
                    className="w-full max-w-10 rounded-t-lg bg-blue-600 transition hover:bg-blue-500"
                    style={{ height: item.height }}
                  />

                  <span className="pb-3 text-xs text-slate-500">
                    {item.day}
                  </span>

                </div>
              ))}

            </div>

          </section>


          {/* Goals */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              Weekly Goal
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep pushing toward your target.
            </p>


            <div className="mt-8 flex justify-center">

              <div className="flex size-48 items-center justify-center rounded-full border-14 border-blue-600">

                <div className="text-center">

                  <p className="text-4xl font-bold">
                    78%
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    15.6 / 20 hours
                  </p>

                </div>

              </div>

            </div>


            <div className="mt-8">

              <div className="flex justify-between text-sm">

                <span className="text-slate-400">
                  Weekly target
                </span>

                <span className="font-medium">
                  20 hours
                </span>

              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

                <div className="h-full w-[78%] rounded-full bg-blue-600" />

              </div>

            </div>

          </section>

        </div>


        {/* Subject Progress */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div>
            <h2 className="text-xl font-semibold">
              Subject Progress
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track your learning progress across subjects.
            </p>
          </div>


          <div className="mt-8 space-y-6">

            {/* DSA */}
            <div>

              <div className="flex justify-between">

                <div>
                  <p className="font-medium">
                    Data Structures & Algorithms
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    72 of 100 topics completed
                  </p>
                </div>

                <span className="text-sm text-blue-400">
                  72%
                </span>

              </div>

              <div className="mt-3 h-2 rounded-full bg-slate-800">
                <div className="h-full w-[72%] rounded-full bg-blue-600" />
              </div>

            </div>


            {/* React */}
            <div>

              <div className="flex justify-between">

                <div>
                  <p className="font-medium">
                    React Development
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    58 of 100 topics completed
                  </p>
                </div>

                <span className="text-sm text-purple-400">
                  58%
                </span>

              </div>

              <div className="mt-3 h-2 rounded-full bg-slate-800">
                <div className="h-full w-[58%] rounded-full bg-purple-500" />
              </div>

            </div>


            {/* DBMS */}
            <div>

              <div className="flex justify-between">

                <div>
                  <p className="font-medium">
                    DBMS
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    45 of 100 topics completed
                  </p>
                </div>

                <span className="text-sm text-cyan-400">
                  45%
                </span>

              </div>

              <div className="mt-3 h-2 rounded-full bg-slate-800">
                <div className="h-full w-[45%] rounded-full bg-cyan-500" />
              </div>

            </div>


            {/* Operating Systems */}
            <div>

              <div className="flex justify-between">

                <div>
                  <p className="font-medium">
                    Operating Systems
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    39 of 100 topics completed
                  </p>
                </div>

                <span className="text-sm text-indigo-400">
                  39%
                </span>

              </div>

              <div className="mt-3 h-2 rounded-full bg-slate-800">
                <div className="h-full w-[39%] rounded-full bg-indigo-500" />
              </div>

            </div>

          </div>

        </section>


        {/* Recent Achievements */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                Recent Achievements
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Milestones you've recently unlocked.
              </p>
            </div>

            <button className="text-sm text-blue-400 hover:text-blue-300">
              View all →
            </button>

          </div>


          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

              <div className="text-3xl">
                🔥
              </div>

              <h3 className="mt-4 font-semibold">
                14 Day Streak
              </h3>

              <p className="mt-2 text-xs text-slate-500">
                Studied consistently for 14 days.
              </p>

            </div>


            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

              <div className="text-3xl">
                🧠
              </div>

              <h3 className="mt-4 font-semibold">
                100 Problems
              </h3>

              <p className="mt-2 text-xs text-slate-500">
                Completed 100 DSA problems.
              </p>

            </div>


            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

              <div className="text-3xl">
                🏆
              </div>

              <h3 className="mt-4 font-semibold">
                Study Champion
              </h3>

              <p className="mt-2 text-xs text-slate-500">
                Reached your monthly study goal.
              </p>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Progress;