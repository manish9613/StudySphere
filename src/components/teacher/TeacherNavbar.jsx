import { useState } from "react";
import {
  NavLink,
} from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  BarChart3,
  ClipboardList,
  UserCircle,
  Menu,
  X,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";

function TeacherNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/teacher/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Courses",
      path: "/teacher/courses",
      icon: BookOpen,
    },
    {
      name: "Create Course",
      path: "/teacher/create-course",
      icon: PlusCircle,
    },
    {
      name: "Students",
      path: "/teacher/students",
      icon: Users,
    },
    {
      name: "Analytics",
      path: "/teacher/analytics",
      icon: BarChart3,
    },
    {
      name: "Assignments",
      path: "/teacher/assignments",
      icon: ClipboardList,
    },
  ];

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* Logo */}

          <NavLink
            to="/teacher/dashboard"
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="orbit-ring flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 transition-transform duration-500 group-hover:scale-110">
              <span className="text-lg font-bold text-white">
                S
              </span>
            </div>

            <span className="hidden text-lg font-bold text-white sm:block">
              StudySphere
            </span>

            <span className="hidden rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-400 sm:block">
              Teacher
            </span>
          </NavLink>


          {/* Desktop Navigation */}

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
                        ? "bg-purple-500/10 text-purple-400"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`
                  }
                >
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span>{item.name}</span>
                </NavLink>
              );
            })}

          </nav>


          {/* Right Side */}

          <div className="flex items-center gap-3">

            {/* PROFILE BUTTON */}

            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="group flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 transition-all duration-200 hover:border-slate-700 hover:bg-slate-800"
            >

              <UserCircle
                size={20}
                strokeWidth={1.8}
                className="text-slate-400 transition-colors group-hover:text-purple-400"
              />

              <div className="hidden text-left sm:block">

                <p className="text-sm font-medium text-slate-200">
                  Profile
                </p>

                <p className="text-[11px] text-slate-500">
                  Teacher
                </p>

              </div>

            </button>


            {/* Mobile Menu */}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
              aria-label="Toggle navigation"
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
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                        isActive
                          ? "bg-purple-500/10 text-purple-400"
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
          PROFILE OVERLAY
      ===================================================== */}

      {profileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]"
          onClick={() => setProfileOpen(false)}
        >

          {/* =================================================
              PROFILE DRAWER
          ================================================= */}

          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-slate-800 bg-slate-950 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Header */}

            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-5">

              <h2 className="text-lg font-semibold text-white">
                Profile
              </h2>

              <button
                type="button"
                onClick={() =>
                  setProfileOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                <X size={19} />
              </button>

            </div>


            {/* Profile Information */}

            <div className="border-b border-slate-800 p-6">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">

                  <UserCircle
                    size={32}
                    strokeWidth={1.6}
                  />

                </div>


                <div className="min-w-0">

                  <h3 className="font-semibold text-white">
                    Teacher
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    StudySphere Teacher
                  </p>

                  <span className="mt-2 inline-flex rounded-full bg-purple-500/10 px-2.5 py-1 text-[11px] font-medium text-purple-400">
                    Teacher Account
                  </span>

                </div>

              </div>

            </div>


            {/* Menu */}

            <div className="flex-1 overflow-y-auto p-4">

              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                Account
              </p>


              {/* My Profile */}

              <button
                type="button"
                className="group flex w-full items-center gap-4 rounded-xl px-3 py-3.5 text-left transition hover:bg-slate-900"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white">
                  <UserCircle size={19} />
                </div>

                <div className="flex-1">

                  <p className="text-sm font-medium text-slate-200">
                    My Profile
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600">
                    View and edit your profile
                  </p>

                </div>

                <ChevronRight
                  size={17}
                  className="text-slate-700 group-hover:text-slate-400"
                />

              </button>


              {/* My Courses */}

              <NavLink
                to="/teacher/courses"
                onClick={() =>
                  setProfileOpen(false)
                }
                className="group flex w-full items-center gap-4 rounded-xl px-3 py-3.5 text-left transition hover:bg-slate-900"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white">
                  <BookOpen size={19} />
                </div>

                <div className="flex-1">

                  <p className="text-sm font-medium text-slate-200">
                    My Courses
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600">
                    Manage your courses
                  </p>

                </div>

                <ChevronRight
                  size={17}
                  className="text-slate-700 group-hover:text-slate-400"
                />

              </NavLink>


              {/* Students */}

              <NavLink
                to="/teacher/students"
                onClick={() =>
                  setProfileOpen(false)
                }
                className="group flex w-full items-center gap-4 rounded-xl px-3 py-3.5 text-left transition hover:bg-slate-900"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white">
                  <Users size={19} />
                </div>

                <div className="flex-1">

                  <p className="text-sm font-medium text-slate-200">
                    Students
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600">
                    View your students
                  </p>

                </div>

                <ChevronRight
                  size={17}
                  className="text-slate-700 group-hover:text-slate-400"
                />

              </NavLink>


              {/* Analytics */}

              <NavLink
                to="/teacher/analytics"
                onClick={() =>
                  setProfileOpen(false)
                }
                className="group flex w-full items-center gap-4 rounded-xl px-3 py-3.5 text-left transition hover:bg-slate-900"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white">
                  <BarChart3 size={19} />
                </div>

                <div className="flex-1">

                  <p className="text-sm font-medium text-slate-200">
                    Analytics
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600">
                    View course performance
                  </p>

                </div>

                <ChevronRight
                  size={17}
                  className="text-slate-700 group-hover:text-slate-400"
                />

              </NavLink>


              {/* Settings */}

              <button
                type="button"
                className="group flex w-full items-center gap-4 rounded-xl px-3 py-3.5 text-left transition hover:bg-slate-900"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white">
                  <Settings size={19} />
                </div>

                <div className="flex-1">

                  <p className="text-sm font-medium text-slate-200">
                    Settings
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600">
                    Manage your preferences
                  </p>

                </div>

                <ChevronRight
                  size={17}
                  className="text-slate-700 group-hover:text-slate-400"
                />

              </button>


              {/* Notifications */}

              <button
                type="button"
                className="group flex w-full items-center gap-4 rounded-xl px-3 py-3.5 text-left transition hover:bg-slate-900"
              >

                <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white">

                  <Bell size={19} />

                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-purple-500" />

                </div>

                <div className="flex-1">

                  <p className="text-sm font-medium text-slate-200">
                    Notifications
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600">
                    Manage your notifications
                  </p>

                </div>

                <ChevronRight
                  size={17}
                  className="text-slate-700 group-hover:text-slate-400"
                />

              </button>


              {/* Help */}

              <button
                type="button"
                className="group flex w-full items-center gap-4 rounded-xl px-3 py-3.5 text-left transition hover:bg-slate-900"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white">
                  <HelpCircle size={19} />
                </div>

                <div className="flex-1">

                  <p className="text-sm font-medium text-slate-200">
                    Help & Support
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600">
                    Get help with StudySphere
                  </p>

                </div>

                <ChevronRight
                  size={17}
                  className="text-slate-700 group-hover:text-slate-400"
                />

              </button>

            </div>


            {/* Logout */}

            <div className="shrink-0 border-t border-slate-800 p-4">

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  // Authentication/logout logic can be added here later.
                }}
                className="group flex w-full items-center gap-4 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3.5 text-left transition hover:border-red-500/20 hover:bg-red-500/10"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                  <LogOut size={19} />
                </div>

                <div className="flex-1">

                  <p className="text-sm font-semibold text-red-400">
                    Logout
                  </p>

                  <p className="mt-0.5 text-xs text-red-400/50">
                    Sign out of your account
                  </p>

                </div>

              </button>

            </div>

          </aside>

        </div>
      )}

    </>
  );
}

export default TeacherNavbar;