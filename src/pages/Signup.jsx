import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  return (
    <div className="page-enter min-h-screen bg-slate-950 text-white">

      {/* Background */}
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />


      {/* Main */}
      <div className="relative flex min-h-screen items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Logo */}
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-3"
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
                Create your account
              </h1>

              <p className="mt-3 text-sm text-slate-500">
                Start building a smarter learning routine today.
              </p>

            </div>


            {/* Google */}
            <button
              type="button"
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-950 py-3 text-sm font-medium hover:bg-slate-800"
            >
              <span className="font-bold">
                G
              </span>

              Continue with Google
            </button>


            {/* Divider */}
            <div className="my-6 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-800" />

              <span className="text-xs text-slate-600">
                OR
              </span>

              <div className="h-px flex-1 bg-slate-800" />

            </div>


            {/* Form */}
            <form className="space-y-4">

              {/* Name */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full name
                </label>

                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

              </div>


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

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

              </div>


              {/* Confirm */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm password
                </label>

                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

              </div>


              {/* Terms */}
              <div className="flex items-start gap-3 pt-1">

                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-blue-600"
                />

                <p className="text-xs leading-5 text-slate-500">

                  I agree to the{" "}

                  <Link
                    to="/terms"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Terms of Service
                  </Link>

                  {" "}and{" "}

                  <Link
                    to="/privacy"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Privacy Policy
                  </Link>

                </p>

              </div>


              {/* Signup */}
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500"
              >
                Create account
              </button>

            </form>


            {/* Login */}
            <p className="mt-6 text-center text-sm text-slate-500">

              Already have an account?

              <Link
                to="/login"
                className="ml-1 font-medium text-blue-400 hover:text-blue-300"
              >
                Sign in
              </Link>

            </p>

          </div>


          <Link
            to="/"
            className="mt-5 block text-center text-sm text-slate-600 hover:text-slate-400"
          >
            ← Back to StudySphere
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Signup;