import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//componnets
import Navbar from "./Component/Basic/Navbar";
import Footer from "./Component/Basic/Footer";
import Loader from "./Component/Basic/Loader";
import ErrorBoundary from "./Component/Basic/ErrorBoundary";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
//components/Testing
import LeetCodeStats from "./Component/Testing/LeetCodeStats";


//pages
import Home from "./Pages/Home";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Aptitest from "./Pages/Services";
import Contact from "./Pages/Contact";
import StudentDashboard from "./Pages/StudentDashbord";
import GDandInterviewpage from "./Pages/GDandInterviewpage";
import SecureTestApp from "./Pages/SecureTestApp";

//admin

import Admin from "./Pages/Admin";

//superadmin

import SuperAdminDashboard from "./Pages/SuperAdmin";

function App() {
  return (
    <ErrorBoundary>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <main className="min-h-[80vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/aptitude-test" element={<Aptitest />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/leetcode" element={<LeetCodeStats />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/GD-and-Interview" element={<GDandInterviewpage />} />
            <Route path="/test" element={<SecureTestApp />} />
            <Route path="/stu-dashboard" element={<StudentDashboard />} />
            <Route path="/login" element={<Login />} />

            {/* admin */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-super" element={<SuperAdminDashboard />} />

            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center h-screen text-center">
                  <h1 className="text-3xl font-bold text-red-500 mb-2">
                    404 - Page Not Found
                  </h1>
                  <p className="text-gray-600">
                    The page you are looking for doesn’t exist.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
      </Suspense>
      <Footer />
    </ErrorBoundary>
  );
}

export default App;
