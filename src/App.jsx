// src/App.jsx
import React, { Suspense, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DisableInspect from "./API/Security/DisableInspect"; // adjust path if needed

// auth
import AuthProvider from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import AuthContext from "./auth/authContext";

// Components
import Navbar from "./Component/Basic/Navbar";
import Footer from "./Component/Basic/Footer";
import Loader from "./Component/Basic/Loader";
import ErrorBoundary from "./Component/Basic/ErrorBoundary";

// Pages
import Home from "./Pages/Home";
import About from "./Pages/About";
import Aptitest from "./Pages/Services";
import Contact from "./Pages/Contact";
import StudentDashboard from "./Pages/StudentDashbord";
import GDandInterviewpage from "./Pages/GDandInterviewpage";
import SecureTestApp from "./Pages/SecureTestApp";
import BlogPage from "./Pages/BlogPage";
import NotFound from "./Pages/NotFound";
import SignUp from "./Component/Advanced/SignUp/view";
import Login from "./Component/Advanced/Login/view";

// admin / superadmin
import Admin from "./Pages/Admin";
import SuperAdminDashboard from "./Pages/SuperAdmin";
import AdminSignupRequests from "./Pages/AdminRequest";
import SuperAdminSignupRequests from "./Pages/SuperAdminReq";

function AppRoutes() {
  // role should be provided by your AuthProvider (e.g. "normal" | "admin" | "super-admin")
  const { role } = useContext(AuthContext);

  return (
    <Routes>
      {role !== "super-admin" ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/aptitude-test" element={<ProtectedRoute><Aptitest /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/GD-and-Interview" element={<GDandInterviewpage />} />
          <Route path="/test" element={<ProtectedRoute><SecureTestApp /></ProtectedRoute>} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </>
      ) : (
        <>
          <Route path="/" element={<SuperAdminDashboard />} />
          <Route path="/admin-requests" element={<AdminSignupRequests />} />
          <Route path="/superadmin-requests" element={<SuperAdminSignupRequests />} />

          {/* allow auth pages still for super-admin */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route path="*" element={<NotFound />} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <DisableInspect>
      <Router>
        <ErrorBoundary>
          <AuthProvider>
            <Navbar />
            <Suspense fallback={<Loader />}>
              <main className="min-h-[80vh]">
                <AppRoutes />
              </main>
            </Suspense>
            <Footer />
          </AuthProvider>
        </ErrorBoundary>
      </Router>
    </DisableInspect>
  );
}

export default App;
