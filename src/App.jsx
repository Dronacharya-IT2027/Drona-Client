import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// auth
import AuthProvider  from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import DisableInspect from "../src/API/Security/DisableInspect";
//componnets
import Navbar from "./Component/Basic/Navbar";
import Footer from "./Component/Basic/Footer";
import Loader from "./Component/Basic/Loader";
import ErrorBoundary from "./Component/Basic/ErrorBoundary";


//pages
import Home from "./Pages/Home";
import About from "./Pages/About";
import Aptitest from "./Pages/Services";
import Contact from "./Pages/Contact";
import StudentDashboard from "./Pages/StudentDashbord";
import GDandInterviewpage from "./Pages/GDandInterviewpage";
import SecureTestApp from "./Pages/SecureTestApp";
import SignUp from './Component/Advanced/SignUp/view';
import Login from './Component/Advanced/Login/view';
import BlogPage from "./Pages/BlogPage";
import NotFound from "./Pages/NotFound";
//admin

import Admin from "./Pages/Admin";

//superadmin

import SuperAdminDashboard from "./Pages/SuperAdmin";
import AdminSignupRequests from "./Pages/AdminRequest";
import SuperAdminSignupRequests from "./Pages/SuperAdminReq";

function App() {

  const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL;

  // Read the JSON string safely
  const storedUserJson = localStorage.getItem('user');
  let storedEmail = '';

  if (storedUserJson) {
    try {
      const storedUser = JSON.parse(storedUserJson);  // <-- proper parsing
      storedEmail = (storedUser.email || '').trim().toLowerCase();
    } catch (e) {
      console.error("Invalid user JSON:", e);
    }
  }

  const isSuperAdminUser = storedEmail === SUPER_ADMIN_EMAIL.toLowerCase();
  const FakeDelay = ({ children }) => {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setReady(true), 1000); // 3 sec delay
  }, []);

  return ready ? children : <Loader />;
};


  return (
    <DisableInspect> 
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <Navbar />
          <Suspense fallback={<Loader />}>
            
            <main className="min-h-[80vh]">
              <Routes>
                {!isSuperAdminUser ? (
              <>
                <Route path="/" element={<Home />} />
                 <Route path="/blog" element={<BlogPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/aptitude-test" element={<ProtectedRoute><Aptitest /></ProtectedRoute>} />
                <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
                <Route path= "/GD-and-Interview" element = {<GDandInterviewpage/>}/>
                <Route path= "/test" element = {<ProtectedRoute><SecureTestApp/></ProtectedRoute>}/>

                {/* Public signup route */}
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login/>} />

                {/* admin */}

                <Route path= "/admin" element = {<ProtectedRoute><Admin/></ProtectedRoute>}/>

                <Route
                  path="*"
                  element={
                    <NotFound/>
                  }
                />
              </>
                ):(
                  <>
                  <Route path="/" element={<SuperAdminDashboard/>} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login/>} />
                  </>
                )}
              </Routes>
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
