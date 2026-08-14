import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="page-enter relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Background */}
      <div className="hero-orb hero-orb-blue" />
      <div className="hero-orb hero-orb-purple" />

      <div className="relative grid min-h-screen lg:grid-cols-2">

        {/* Left — branding panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden border-r border-slate-800 bg-slate-900/40 p-12 lg:flex">
          <Link to="/" className="group flex items-center gap-3">
            <div className="orbit-ring flex size-10 items-center justify-center">
              <img src="/logo.png" alt="StudySphere" className="size-10 object-contain" />
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Study<span className="text-gradient">Sphere</span>
            </span>
          </Link>

          <div className="relative">
            <div className="pointer-events-none absolute -left-10 -top-16 h-64 w-64 rounded-full border border-dashed border-blue-500/20" />
            <div className="pointer-events-none absolute -left-24 -top-32 h-96 w-96 rounded-full border border-dashed border-purple-500/10" />

            <h2 className="max-w-md text-4xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Pick up right where your learning left off.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Your courses, focus sessions, and AI Mentor conversations are
              all waiting for you — synced and ready.
            </p>
          </div>

          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} StudySphere. All rights reserved.
          </p>
        </div>

        {/* Right — form */}
        <div className="relative flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            {/* Logo (mobile only) */}
            <Link to="/" className="mb-10 flex items-center justify-center gap-3 lg:hidden">
              <div className="orbit-ring flex size-10 items-center justify-center">
                <img src="/logo.png" alt="StudySphere" className="size-10 object-contain" />
              </div>
              <span className="text-2xl font-bold">
                Study<span className="text-gradient">Sphere</span>
              </span>
            </Link>

            <div className="glass-panel rounded-3xl p-8 shadow-2xl">
              <div className="text-center">
                <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  Welcome back
                </h1>
                <p className="mt-3 text-sm text-slate-500">
                  Continue your learning journey with StudySphere.
                </p>
              </div>

              {/* Google */}
              <button
                type="button"
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-950 py-3 text-sm font-medium text-white transition-colors hover:border-slate-600 hover:bg-slate-800"
              >
                <span className="font-bold">G</span>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-xs text-slate-600">OR</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              {/* Form */}
              <form className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="signup-input"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="link-underline text-xs text-blue-400 hover:text-blue-300"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="signup-input"
                  />
                </div>

                <button type="submit" className="btn-primary w-full !py-3">
                  Sign in
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-slate-500">
                Don't have an account?
                <Link
                  to="/signup"
                  className="link-underline ml-1 font-medium text-blue-400 hover:text-blue-300"
                >
                  Create one
                </Link>
              </p>
            </div>

            <Link
              to="/"
              className="mt-6 block text-center text-sm text-slate-600 transition-colors hover:text-slate-400"
            >
              ← Back to StudySphere
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
