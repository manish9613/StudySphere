import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  GraduationCap,
  MapPin,
  Save,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function TeacherProfile() {
  const { user } = useAuth();

  /* =====================================================
     PROFILE DATA
  ===================================================== */

  const defaultProfile = {
    name: user?.name || "Teacher",
    email: user?.email || "teacher@studysphere.com",
    expertise: "",
    bio: "",
    location: "India",
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("teacherProfile");

    let extra = {};

    if (savedProfile) {
      try {
        extra = JSON.parse(savedProfile);
      } catch (error) {
        console.error("Failed to load teacher profile:", error);
      }
    }

    // Name/email always come from the logged-in account first —
    // only the extra fields (expertise, bio, location) persist locally.
    setProfile({
      ...defaultProfile,
      ...extra,
      name: user?.name || extra.name || defaultProfile.name,
      email: user?.email || extra.email || defaultProfile.email,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* =====================================================
     HANDLE NORMAL INPUT CHANGES
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
  };

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const handleSave = (event) => {
    event.preventDefault();

    /*
      Temporary local storage.

      Later this will be replaced with:
      POST /api/teacher/profile
    */

    localStorage.setItem(
      "teacherProfile",
      JSON.stringify(profile)
    );

    setSaved(true);
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="page-enter min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-slate-800">

        <div className="mx-auto max-w-5xl px-6 py-8">

          <Link
            to="/teacher/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="mt-7">

            <p className="text-sm font-semibold uppercase tracking-widest text-purple-400">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              My Profile
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your personal information and teaching details.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          PROFILE CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-5xl px-6 py-10">

        <div className="grid gap-6 lg:grid-cols-3">


          {/* =================================================
              PROFILE CARD
          ================================================= */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

            <div className="flex flex-col items-center text-center">

              {/* Avatar */}

              <div className="relative">

                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-400">

                  <User
                    size={52}
                    strokeWidth={1.5}
                  />

                </div>

                <button
                  type="button"
                  className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  aria-label="Change profile picture"
                >
                  <Camera size={17} />
                </button>

              </div>


              <h2 className="mt-5 text-xl font-semibold">
                {profile.name || "Teacher"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                StudySphere Teacher
              </p>

              <span className="mt-4 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
                Teacher Account
              </span>

            </div>


            {/* Quick information */}

            <div className="mt-8 border-t border-slate-800 pt-6">

              <div className="flex items-center gap-3 text-sm">

                <GraduationCap
                  size={18}
                  className="text-slate-500"
                />

                <span className="text-slate-400">
                  {profile.expertise || "Add your area of expertise"}
                </span>

              </div>


              <div className="mt-4 flex items-center gap-3 text-sm">

                <MapPin
                  size={18}
                  className="text-slate-500"
                />

                <span className="text-slate-400">
                  {profile.location}
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              EDIT PROFILE
          ================================================= */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 lg:col-span-2">

            <div className="border-b border-slate-800 pb-5">

              <h2 className="text-lg font-semibold">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update your information below.
              </p>

            </div>


            <form
              onSubmit={handleSave}
              className="mt-6 space-y-6"
            >


              {/* =================================================
                  FULL NAME
              ================================================= */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="signup-input signup-input-icon"
                    placeholder="Enter your name"
                  />

                </div>

              </div>


              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="signup-input signup-input-icon"
                    placeholder="Enter your email"
                  />

                </div>

              </div>


              {/* =================================================
                  EXPERTISE
              ================================================= */}

              <div>

                <label
                  htmlFor="expertise"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Area of Expertise
                </label>

                <input
                  id="expertise"
                  name="expertise"
                  value={profile.expertise}
                  onChange={handleChange}
                  className="signup-input"
                  placeholder="e.g. Data Structures & Algorithms"
                />

              </div>


              {/* =================================================
                  BIO
              ================================================= */}

              <div>

                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Bio
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows={4}
                  className="signup-input !h-auto resize-none py-3"
                  placeholder="Tell students a little about yourself..."
                />

              </div>


              {/* =================================================
                  LOCATION
              ================================================= */}

              <div>

                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Location
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="location"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    className="signup-input signup-input-icon"
                    placeholder="Your location"
                  />

                </div>

              </div>


              {/* =================================================
                  SAVE
              ================================================= */}

              <div className="flex items-center justify-end gap-4 border-t border-slate-800 pt-5">

                {saved && (
                  <span className="text-sm text-emerald-400">
                    Changes saved
                  </span>
                )}

                <button
                  type="submit"
                  className="hero-button inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-500"
                >

                  <Save size={17} />

                  Save Changes

                </button>

              </div>

            </form>

          </div>

        </div>

      </main>

    </div>
  );
}

export default TeacherProfile;
