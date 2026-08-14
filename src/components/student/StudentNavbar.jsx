import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  BookOpen,
  Timer,
  Bot,
  CheckSquare,
  TrendingUp,
  Users,
  UserCircle,
  Menu,
  X,
} from "lucide-react";

import ProfileDrawer from "../dashboard/ProfileDrawer";


function StudentNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);


  const navItems = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Courses",
      path: "/student/courses",
      icon: BookOpen,
    },
    {
      name: "Focus",
      path: "/student/focus",
      icon: Timer,
    },
    {
      name: "AI Mentor",
      path: "/student/ai-mentor",
      icon: Bot,
    },
    {
      name: "Tasks",
      path: "/student/tasks",
      icon: CheckSquare,
    },
    {
      name: "Progress",
      path: "/student/progress",
      icon: TrendingUp,
    },
    {
      name: "Community",
      path: "/student/community",
      icon: Users,
    },
  ];


  return (
    <>
      {/* =====================================================
          STUDENT NAVBAR
      ===================================================== */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* =================================================
              LOGO
          ================================================= */}

          <NavLink
            to="/student/dashboard"
            className="group flex shrink-0 items-center gap-3"
          >

            <div className="orbit-ring flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 transition-transform duration-500 group-hover:scale-110">
              <span className="text-lg font-bold text-white">
                S
              </span>
            </div>

            <span className="hidden text-lg font-bold text-white sm:block" style={{ fontFamily: "var(--font-display)" }}>
              StudySphere
            </span>

            <span className="hidden rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 sm:block">
              Student
            </span>

          </NavLink>


          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="hidden items-center gap-1 lg:flex">

            {navItems.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-blue-500/10 text-blue-400"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`
                  }
                >

                  <Icon
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span>
                    {item.name}
                  </span>

                </NavLink>
              );
            })}

          </nav>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="flex items-center gap-3">

            {/* Profile Button */}

            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              aria-label="Open profile"
              className="group flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 transition-all duration-200 hover:border-slate-700 hover:bg-slate-800"
            >

              <UserCircle
                size={20}
                strokeWidth={1.8}
                className="text-slate-400 transition-colors duration-200 group-hover:text-blue-400"
              />

              <div className="hidden text-left sm:block">

                <p className="text-sm font-medium text-slate-200">
                  Profile
                </p>

                <p className="text-[11px] text-slate-500">
                  Student
                </p>

              </div>

            </button>


            {/* Mobile Menu Button */}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            >

              {mobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}

            </button>

          </div>

        </div>


        {/* =====================================================
            MOBILE NAVIGATION
        ===================================================== */}

        {mobileMenuOpen && (

          <div className="mobile-menu-enter border-t border-slate-800 bg-slate-950 px-6 py-4 lg:hidden">

            <nav className="space-y-1">

              {navItems.map((item) => {

                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                        isActive
                          ? "bg-blue-500/10 text-blue-400"
                          : "text-slate-400 hover:bg-slate-900 hover:text-white"
                      }`
                    }
                  >

                    <Icon
                      size={18}
                      strokeWidth={1.8}
                    />

                    {item.name}

                  </NavLink>
                );

              })}

            </nav>

          </div>

        )}

      </header>


      {/* =====================================================
          PROFILE DRAWER
      ===================================================== */}

      <ProfileDrawer
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        role="student"
      />

    </>
  );
}


export default StudentNavbar;