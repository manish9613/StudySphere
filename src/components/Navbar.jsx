import { Link, useLocation } from "react-router-dom";

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10.5 12 3l9 7.5"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 9v11.5h14V9"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 20.5v-6h6v6"
    />
  </svg>
);

function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/", icon: true },
    { name: "Focus", path: "/focus" },
    { name: "AI Mentor", path: "/ai-mentor" },
    { name: "Community", path: "/community" },
    { name: "Organize", path: "/organize" },
    { name: "Progress", path: "/progress" },
    { name: "Platforms", path: "/platforms" },
  ];

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex size-10 items-center justify-center">
            <img
              src="/logo.png"
              alt="StudySphere"
              className="size-10 object-contain"
            />
          </div>

          <span className="text-[22px] font-bold text-white">
            Study<span className="text-blue-500">Sphere</span>
          </span>
        </Link>


        {/* Navigation Links */}
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {

            const isActive =
              location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                {link.icon && <HomeIcon />}

                <span>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>


        {/* Action Buttons */}
        <div className="flex items-center gap-3">

          <Link
            to="/login"
            className="rounded-full bg-blue-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-500"          >
            Sign in
          </Link>



        </div>

      </div>
    </nav>
  );
}

export default Navbar;