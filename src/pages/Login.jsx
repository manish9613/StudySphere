import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="page-enter min-h-screen bg-slate-950 text-white">

      {/* Background */}
      <div className="pointer-events-none absolute left-1/4 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />


      {/* Main */}
      <div className="relative flex min-h-screen items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Logo */}
          <Link
            to="/"
            className="mb-10 flex items-center justify-center gap-3"
          >
            <div className="flex size-10 items-center justify-center">
              <img
                src="/logo.png"
                alt="StudySphere"
                className="size-10 object-contain"
              />
            </div>

            <span className="text-2xl font-bold">
              Study<span className="text-blue-500">Sphere</span>
            </span>
          </Link>


          {/* Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

            <div className="text-center">

              <h1 className="text-3xl font-bold">
                Welcome back
              </h1>

              <p className="mt-3 text-sm text-slate-500">
                Continue your learning journey with StudySphere.
              </p>

            </div>


            {/* Google */}
            <button
              type="button"
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-950 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              <span className="font-bold">
                G
              </span>

              Continue with Google
            </button>


            {/* Divider */}
            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-800" />

              <span className="text-xs text-slate-600">
                OR
              </span>

              <div className="h-px flex-1 bg-slate-800" />

            </div>


            {/* Form */}
            <form className="space-y-5">

              {/* Email */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

              </div>


              {/* Password */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-sm font-medium text-slate-300">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Forgot password?
                  </Link>

                </div>

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

              </div>


              {/* Sign in */}
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500"
              >
                Sign in
              </button>

            </form>


            {/* Signup */}
            <p className="mt-7 text-center text-sm text-slate-500">

              Don't have an account?

              <Link
                to="/signup"
                className="ml-1 font-medium text-blue-400 hover:text-blue-300"
              >
                Create one
              </Link>

            </p>

          </div>


          {/* Back */}
          <Link
            to="/"
            className="mt-6 block text-center text-sm text-slate-600 hover:text-slate-400"
          >
            ← Back to StudySphere
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;