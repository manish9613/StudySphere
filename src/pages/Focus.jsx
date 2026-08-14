function Focus() {
  return (
    <div className="page-enter min-h-screen bg-slate-950 px-6 py-16 text-white">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Focus
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Stay focused.
          </h1>

          <p className="mt-3 max-w-xl text-slate-400">
            Create focused study sessions and make every minute count.
          </p>
        </div>


        {/* Timer */}
        <div className="mt-12 flex justify-center">

          <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">

            <p className="text-sm text-slate-500">
              Deep Work Session
            </p>

            <div className="mt-6 text-7xl font-bold tracking-tight">
              25:00
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Ready when you are.
            </p>

            <button className="mt-8 rounded-full bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-500">
              Start Session
            </button>

          </div>

        </div>


        {/* Stats */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">
              Today's Focus
            </p>

            <p className="mt-3 text-3xl font-bold">
              2h 40m
            </p>
          </div>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">
              Sessions
            </p>

            <p className="mt-3 text-3xl font-bold">
              5
            </p>
          </div>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">
              Current Streak
            </p>

            <p className="mt-3 text-3xl font-bold">
              🔥 14 days
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Focus;