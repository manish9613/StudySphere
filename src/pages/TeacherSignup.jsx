import { Link } from "react-router-dom";
import { useState } from "react";

function TeacherSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    expertise: "",
    bio: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log({
      ...formData,
      role: "teacher",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Background glow */}
      <div className="pointer-events-none fixed left-1/4 top-10 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="pointer-events-none fixed bottom-0 right-0 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center px-5 py-8">

        <div className="w-full max-w-xl">

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


          {/* Signup Card */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl md:p-8">

            {/* Header */}

            <div className="mb-6 text-center">


              <h1 className="mt-2 text-2xl font-bold">
                Create your account as<span className="text-blue-500"> Teacher</span>
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Teach, create courses, and help students grow.
              </p>

            </div>


            {/* Form */}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name + Email */}

              <div className="grid gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-sm text-slate-300">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="signup-input"
                  />
                </div>


                <div>
                  <label className="mb-1.5 block text-sm text-slate-300">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="signup-input"
                  />
                </div>

              </div>


              {/* Expertise */}

              <div>
                <label className="mb-1.5 block text-sm text-slate-300">
                  Subject / Expertise
                </label>

                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  placeholder="e.g. Mathematics, DSA, Physics"
                  required
                  className="signup-input"
                />
              </div>


              {/* Bio */}

              <div>
                <label className="mb-1.5 block text-sm text-slate-300">
                  Short Bio
                  <span className="ml-2 text-xs text-slate-600">
                    Optional
                  </span>
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="2"
                  maxLength="300"
                  placeholder="Tell students a little about yourself..."
                  className="signup-input resize-none"
                />
              </div>


              {/* Password */}

              <div className="grid gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-sm text-slate-300">
                    Password
                  </label>

                  <div className="relative">

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      minLength="6"
                      required
                      className="signup-input pr-16"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>

                  </div>
                </div>


                <div>
                  <label className="mb-1.5 block text-sm text-slate-300">
                    Confirm Password
                  </label>

                  <div className="relative">

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      required
                      className="signup-input pr-16"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>

                  </div>
                </div>

              </div>


              {/* Terms */}

              <label className="flex items-start gap-2 pt-1 text-xs leading-5 text-slate-500">

                <input
                  type="checkbox"
                  required
                  className="mt-1 accent-blue-600"
                />

                <span>
                  I agree to the StudySphere terms and understand that
                  my teacher profile may be visible to students.
                </span>

              </label>


              {/* Submit */}

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20"
              >
                Create Teacher Account
              </button>

            </form>


            {/* Bottom */}

            <div className="mt-5 flex flex-col items-center gap-2 border-t border-slate-800 pt-5 text-sm">

              <p className="text-slate-500">
                Already have an account?
                <Link
                  to="/login"
                  className="ml-1 text-blue-400 hover:text-blue-300"
                >
                  Log in
                </Link>
              </p>

              <p className="text-slate-600">
                Want to learn instead?
                <Link
                  to="/signup"
                  className="ml-1 text-slate-400 hover:text-white"
                >
                  Student signup
                </Link>
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default TeacherSignup;