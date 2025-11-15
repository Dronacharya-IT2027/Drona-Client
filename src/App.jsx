import React, { Suspense, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
import SignUp from "./Component/Advanced/SignUp/view";
import Login from "./Component/Advanced/Login/view";

// admin
import Admin from "./Pages/Admin";

// superadmin
import SuperAdminDashboard from "./Pages/SuperAdmin";
import AdminSignupRequests from "./Pages/AdminRequest";
import SuperAdminSignupRequests from "./Pages/SuperAdminReq";

function AppRoutes() {
  const { role } = useContext(AuthContext);

  return (
    <Routes>
      {role !== "super-admin" ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/aptitude-test" element={<ProtectedRoute><Aptitest /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/GD-and-Interview" element={<GDandInterviewpage />} />
          <Route path="/test" element={<ProtectedRoute><SecureTestApp /></ProtectedRoute>} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bold text-red-500">404 - Page Not Found</h1>
              </div>
            }
          />
        </>
      ) : (
        <>
          <Route path="/" element={<SuperAdminDashboard />} />
          <Route path="/admin-requests" element={<AdminSignupRequests />} />
          <Route path="/superadmin-requests" element={<SuperAdminSignupRequests />} />

          {/* allow auth pages still */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
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
  );
}

export default App;
