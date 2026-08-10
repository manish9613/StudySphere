import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-2">

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

              <span className="text-2xl font-bold text-white">
                Study<span className="text-blue-500">Sphere</span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
              A smarter learning platform designed to help students
              stay focused, organized, and consistent throughout
              their learning journey.
            </p>

            {/* Contact */}
            <div className="mt-6">

              <p className="text-sm font-medium text-slate-300">
                Have a question?
              </p>

              <a
                href="mailto:support@studysphere.com"
                className="mt-2 inline-block text-sm text-blue-400 hover:text-blue-300"
              >
                support@studysphere.com
              </a>

            </div>

          </div>


          {/* Product */}
          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Product
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <Link
                  to="/focus"
                  className="text-sm hover:text-white"
                >
                  Focus
                </Link>
              </li>

              <li>
                <Link
                  to="/ai-mentor"
                  className="text-sm hover:text-white"
                >
                  AI Mentor
                </Link>
              </li>

              <li>
                <Link
                  to="/organize"
                  className="text-sm hover:text-white"
                >
                  Organize
                </Link>
              </li>

              <li>
                <Link
                  to="/progress"
                  className="text-sm hover:text-white"
                >
                  Progress
                </Link>
              </li>

              <li>
                <Link
                  to="/platforms"
                  className="text-sm hover:text-white"
                >
                  Platforms
                </Link>
              </li>

            </ul>

          </div>


          {/* Resources */}
          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Resources
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <Link
                  to="/notes"
                  className="text-sm hover:text-white"
                >
                  Notes
                </Link>
              </li>

              <li>
                <Link
                  to="/study-plans"
                  className="text-sm hover:text-white"
                >
                  Study Plans
                </Link>
              </li>

              <li>
                <Link
                  to="/help"
                  className="text-sm hover:text-white"
                >
                  Help Center
                </Link>
              </li>

              <li>
                <Link
                  to="/faq"
                  className="text-sm hover:text-white"
                >
                  FAQs
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-sm hover:text-white"
                >
                  Contact Us
                </Link>
              </li>

            </ul>

          </div>


          {/* Legal */}
          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <Link
                  to="/privacy"
                  className="text-sm hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="text-sm hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link
                  to="/cookies"
                  className="text-sm hover:text-white"
                >
                  Cookie Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/refund"
                  className="text-sm hover:text-white"
                >
                  Refund Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/security"
                  className="text-sm hover:text-white"
                >
                  Security
                </Link>
              </li>

            </ul>

          </div>

        </div>


        {/* Contact / Query Box */}
        <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:flex md:items-center md:justify-between">

          <div>

            <h3 className="text-lg font-semibold text-white">
              Have feedback or a query?
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              We'd love to hear from you. Reach out and we'll get
              back to you as soon as possible.
            </p>

          </div>

          <a
            href="mailto:support@studysphere.com"
            className="mt-5 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 md:mt-0"
          >
            Contact Support
          </a>

        </div>

      </div>


      {/* Bottom Bar */}
      <div className="border-t border-slate-800">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">

          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} StudySphere. All rights reserved.
          </p>


          {/* Social Links */}
          <div className="flex items-center gap-5">

            <a
              href="#"
              className="text-sm text-slate-500 hover:text-white"
            >
              GitHub
            </a>

            <a
              href="#"
              className="text-sm text-slate-500 hover:text-white"
            >
              LinkedIn
            </a>

            <a
              href="#"
              className="text-sm text-slate-500 hover:text-white"
            >
              Instagram
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;