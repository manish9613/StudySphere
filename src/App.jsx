import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Community from "./pages/Community";
import Focus from "./pages/Focus";
import AIMentor from "./pages/AIMentor";
import Organize from "./pages/Organize";
import Platforms from "./pages/Platforms";
import Progress from "./pages/Progress";
import TeacherSignup from "./pages/TeacherSignup";
import RoleSelection from "./pages/RoleSelection";

import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

function App() {
  return (
    <Routes>

      {/* =====================================================
          HOME
      ===================================================== */}

      <Route
        path="/"
        element={
          <>
            <Navbar />

            <main className="pt-16">
              <Home />
            </main>

            <Footer />
          </>
        }
      />


      {/* =====================================================
          LOGIN
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />


      {/* =====================================================
          SIGNUP ROLE SELECTION
      ===================================================== */}

      <Route
        path="/signup"
        element={<RoleSelection />}
      />


      {/* =====================================================
          STUDENT SIGNUP
      ===================================================== */}

      <Route
        path="/signup/student"
        element={<Signup />}
      />


      {/* =====================================================
          TEACHER SIGNUP
      ===================================================== */}

      <Route
        path="/signup/teacher"
        element={<TeacherSignup />}
      />


      {/* =====================================================
          COMMUNITY
      ===================================================== */}

      <Route
        path="/community"
        element={
          <>
            <Navbar />

            <main className="pt-16">
              <Community />
            </main>

            <Footer />
          </>
        }
      />


      {/* =====================================================
          FOCUS
      ===================================================== */}

      <Route
        path="/focus"
        element={
          <>
            <Navbar />

            <main className="pt-16">
              <Focus />
            </main>

            <Footer />
          </>
        }
      />


      {/* =====================================================
          AI MENTOR
      ===================================================== */}

      <Route
        path="/ai-mentor"
        element={
          <>
            <Navbar />

            <main className="pt-16">
              <AIMentor />
            </main>

            <Footer />
          </>
        }
      />


      {/* =====================================================
          ORGANIZE
      ===================================================== */}

      <Route
        path="/organize"
        element={
          <>
            <Navbar />

            <main className="pt-16">
              <Organize />
            </main>

            <Footer />
          </>
        }
      />


      {/* =====================================================
          PLATFORMS
      ===================================================== */}

      <Route
        path="/platforms"
        element={
          <>
            <Navbar />

            <main className="pt-16">
              <Platforms />
            </main>

            <Footer />
          </>
        }
      />


      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <Route
        path="/progress"
        element={
          <>
            <Navbar />

            <main className="pt-16">
              <Progress />
            </main>

            <Footer />
          </>
        }
      />


      {/* =====================================================
          STUDENT DASHBOARD
          
          IMPORTANT:
          No public Navbar here.
          
          StudentNavbar is already inside
          StudentDashboard.jsx
      ===================================================== */}

      <Route
        path="/student/dashboard"
        element={<StudentDashboard />}
      />


      {/* =====================================================
          TEACHER DASHBOARD
          
          TeacherNavbar will be added later.
      ===================================================== */}

      <Route
        path="/teacher/dashboard"
        element={<TeacherDashboard />}
      />

    </Routes>
  );
}

export default App;