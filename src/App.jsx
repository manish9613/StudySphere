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

import StudentProfile from "./pages/StudentProfile";
import StudentCourses from "./pages/StudentCourses";
import CourseDetails from "./pages/CourseDetails";
import Lesson from "./pages/Lesson";

import CreateCourse from "./pages/CreateCourse";
import TeacherCourses from "./pages/TeacherCourses";
import ManageCourse from "./pages/ManageCourse";
function App() {
  return (
    <Routes>

      {/* =========================
          PUBLIC PAGES
      ========================= */}

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

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<RoleSelection />}
      />

      <Route
        path="/signup/student"
        element={<Signup />}
      />

      <Route
        path="/signup/teacher"
        element={<TeacherSignup />}
      />

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


      {/* =========================
          STUDENT PAGES
      ========================= */}

      <Route
        path="/student/dashboard"
        element={<StudentDashboard />}
      />

      <Route
        path="/student/profile"
        element={<StudentProfile />}
      />

      <Route
        path="/student/courses"
        element={<StudentCourses />}
      />

      <Route
        path="/student/courses/:courseId"
        element={<CourseDetails />}
      />

      <Route
        path="/student/courses/:courseId/lesson/:lessonId"
        element={<Lesson />}
      />


      {/* =========================
          TEACHER PAGES
      ========================= */}

      <Route
        path="/teacher/dashboard"
        element={<TeacherDashboard />}
      />
      <Route
        path="/teacher/create-course"
        element={<CreateCourse />}
      />

      <Route
        path="/teacher/courses"
        element={<TeacherCourses />}
      />


      <Route
        path="/teacher/courses/:courseId/manage"
        element={<ManageCourse />}
      />
    </Routes>
  );
}

export default App;