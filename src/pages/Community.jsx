import { Link } from "react-router-dom";

function Community() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <section className="border-b border-slate-800">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            StudySphere Community
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Learn together.
            <br />
            <span className="text-slate-500">
              Celebrate progress together.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Share your achievements, study streaks, projects, and
            learning experiences with students on the same journey.
          </p>

        </div>

      </section>


      {/* Main Content */}
      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_320px]">


        {/* =========================
            LEFT — FEED
        ========================== */}

        <div>

          {/* Create Post */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <div className="flex gap-4">

              {/* Avatar */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold">
                M
              </div>

              <div className="flex-1">

                <button className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-left text-sm text-slate-500 hover:border-blue-500">
                  Share something you've achieved...
                </button>

                <div className="mt-4 flex flex-wrap gap-3">

                  <button className="rounded-lg bg-blue-500/10 px-4 py-2 text-sm text-blue-400 hover:bg-blue-500/20">
                    🏆 Achievement
                  </button>

                  <button className="rounded-lg bg-indigo-500/10 px-4 py-2 text-sm text-indigo-400 hover:bg-indigo-500/20">
                    🔥 Streak
                  </button>

                  <button className="rounded-lg bg-purple-500/10 px-4 py-2 text-sm text-purple-400 hover:bg-purple-500/20">
                    🚀 Project
                  </button>

                  <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-400 hover:text-white">
                    💡 Study Tip
                  </button>

                </div>

              </div>

            </div>

          </div>


          {/* Filters */}
          <div className="mt-8 flex gap-2 overflow-x-auto border-b border-slate-800 pb-4">

            <button className="whitespace-nowrap rounded-full bg-blue-600 px-5 py-2 text-sm font-medium">
              All Posts
            </button>

            <button className="whitespace-nowrap rounded-full px-5 py-2 text-sm text-slate-500 hover:bg-slate-900 hover:text-white">
              Achievements
            </button>

            <button className="whitespace-nowrap rounded-full px-5 py-2 text-sm text-slate-500 hover:bg-slate-900 hover:text-white">
              Streaks
            </button>

            <button className="whitespace-nowrap rounded-full px-5 py-2 text-sm text-slate-500 hover:bg-slate-900 hover:text-white">
              Projects
            </button>

            <button className="whitespace-nowrap rounded-full px-5 py-2 text-sm text-slate-500 hover:bg-slate-900 hover:text-white">
              Study Tips
            </button>

          </div>


          {/* =========================
              POST 1
          ========================== */}

          <article className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            {/* User */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 font-semibold">
                  R
                </div>

                <div>

                  <p className="font-semibold">
                    Rahul Sharma
                  </p>

                  <p className="text-xs text-slate-500">
                    2 hours ago · 🏆 Achievement
                  </p>

                </div>

              </div>

              <button className="text-slate-600 hover:text-white">
                •••
              </button>

            </div>


            {/* Content */}
            <div className="mt-6">

              <h2 className="text-xl font-semibold">
                Completed my 30-day DSA challenge! 🎉
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                Finally completed my first 150 DSA problems.
                Arrays and binary search finally make much more
                sense now. Next goal: 200 problems!
              </p>

            </div>


            {/* Achievement */}
            <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
                  🏆
                </div>

                <div>

                  <p className="text-xs uppercase tracking-wider text-blue-400">
                    Achievement unlocked
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    150 DSA Problems
                  </p>

                </div>

              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-950 p-3">
                  <p className="text-xs text-slate-600">
                    Study streak
                  </p>

                  <p className="mt-1 font-semibold">
                    🔥 30 days
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-3">
                  <p className="text-xs text-slate-600">
                    Problems
                  </p>

                  <p className="mt-1 font-semibold">
                    150
                  </p>
                </div>

              </div>

            </div>


            {/* Actions */}
            <div className="mt-5 flex items-center gap-6 border-t border-slate-800 pt-4">

              <button className="text-sm text-slate-500 hover:text-red-400">
                ❤️ 42
              </button>

              <button className="text-sm text-slate-500 hover:text-blue-400">
                🎉 18
              </button>

              <button className="text-sm text-slate-500 hover:text-white">
                💬 8
              </button>

              <button className="ml-auto text-sm text-slate-500 hover:text-white">
                Share
              </button>

            </div>

          </article>


          {/* =========================
              POST 2
          ========================== */}

          <article className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-600 font-semibold">
                P
              </div>

              <div>

                <p className="font-semibold">
                  Priya Mehta
                </p>

                <p className="text-xs text-slate-500">
                  5 hours ago · 🚀 Project
                </p>

              </div>

            </div>


            <div className="mt-6">

              <h2 className="text-xl font-semibold">
                Built my first React project! 🚀
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                After learning React for a few weeks, I finally
                built my first complete project. Still learning,
                but really happy with the progress.
              </p>

            </div>


            {/* Project Preview */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs text-purple-400">
                    PROJECT
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    TaskFlow
                  </h3>

                </div>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                  Completed
                </span>

              </div>

              <div className="mt-5 flex flex-wrap gap-2">

                <span className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-400">
                  React
                </span>

                <span className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-400">
                  JavaScript
                </span>

                <span className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-400">
                  Tailwind
                </span>

              </div>

            </div>


            <div className="mt-5 flex items-center gap-6 border-t border-slate-800 pt-4">

              <button className="text-sm text-slate-500 hover:text-red-400">
                ❤️ 67
              </button>

              <button className="text-sm text-slate-500 hover:text-blue-400">
                🎉 31
              </button>

              <button className="text-sm text-slate-500 hover:text-white">
                💬 12
              </button>

              <button className="ml-auto text-sm text-slate-500 hover:text-white">
                Share
              </button>

            </div>

          </article>


          {/* =========================
              POST 3
          ========================== */}

          <article className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-600 font-semibold">
                A
              </div>

              <div>

                <p className="font-semibold">
                  Arjun Verma
                </p>

                <p className="text-xs text-slate-500">
                  Yesterday · 💡 Study Tip
                </p>

              </div>

            </div>


            <h2 className="mt-6 text-xl font-semibold">
              The Pomodoro technique finally worked for me.
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              I started doing 45-minute focused sessions followed
              by 10-minute breaks. My concentration has improved
              a lot compared to studying for 3-4 hours continuously.
            </p>


            <div className="mt-5 flex items-center gap-6 border-t border-slate-800 pt-4">

              <button className="text-sm text-slate-500 hover:text-red-400">
                ❤️ 35
              </button>

              <button className="text-sm text-slate-500 hover:text-blue-400">
                🎉 12
              </button>

              <button className="text-sm text-slate-500 hover:text-white">
                💬 6
              </button>

            </div>

          </article>

        </div>


        {/* =========================
            RIGHT SIDEBAR
        ========================== */}

        <aside className="space-y-6">


          {/* Top Streaks */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">

              <h2 className="font-semibold">
                🔥 Top Study Streaks
              </h2>

              <button className="text-xs text-blue-400">
                View all
              </button>

            </div>


            <div className="mt-6 space-y-5">

              <div className="flex items-center gap-3">

                <span className="w-5 text-sm text-yellow-400">
                  1
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm">
                  R
                </div>

                <div className="flex-1">

                  <p className="text-sm font-medium">
                    Rahul Sharma
                  </p>

                  <p className="text-xs text-slate-600">
                    45 day streak
                  </p>

                </div>

                <span className="text-sm">
                  🔥
                </span>

              </div>


              <div className="flex items-center gap-3">

                <span className="w-5 text-sm text-slate-500">
                  2
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-sm">
                  P
                </div>

                <div className="flex-1">

                  <p className="text-sm font-medium">
                    Priya Mehta
                  </p>

                  <p className="text-xs text-slate-600">
                    32 day streak
                  </p>

                </div>

                <span className="text-sm">
                  🔥
                </span>

              </div>


              <div className="flex items-center gap-3">

                <span className="w-5 text-sm text-slate-500">
                  3
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-600 text-sm">
                  A
                </div>

                <div className="flex-1">

                  <p className="text-sm font-medium">
                    Arjun Verma
                  </p>

                  <p className="text-xs text-slate-600">
                    28 day streak
                  </p>

                </div>

                <span className="text-sm">
                  🔥
                </span>

              </div>

            </div>

          </div>


          {/* Trending Topics */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="font-semibold">
              Trending in StudySphere
            </h2>

            <div className="mt-5 space-y-4">

              <div>
                <p className="text-xs text-slate-600">
                  Trending
                </p>

                <p className="mt-1 text-sm text-blue-400">
                  #DSAChallenge
                </p>

                <p className="text-xs text-slate-600">
                  248 posts
                </p>
              </div>


              <div>
                <p className="text-xs text-slate-600">
                  Trending
                </p>

                <p className="mt-1 text-sm text-indigo-400">
                  #StudyStreak
                </p>

                <p className="text-xs text-slate-600">
                  184 posts
                </p>
              </div>


              <div>
                <p className="text-xs text-slate-600">
                  Trending
                </p>

                <p className="mt-1 text-sm text-purple-400">
                  #BuildInPublic
                </p>

                <p className="text-xs text-slate-600">
                  126 posts
                </p>
              </div>

            </div>

          </div>


          {/* Community Guidelines */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="font-semibold">
              Keep the community useful
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Share your real learning journey, encourage others,
              and keep discussions respectful and focused on growth.
            </p>

            <Link
              to="/community-guidelines"
              className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300"
            >
              Community guidelines →
            </Link>

          </div>

        </aside>

      </main>

    </div>
  );
}

export default Community;