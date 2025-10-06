import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Component/Basic/Navbar";
import Footer from "./Component/Basic/Footer";
import Loader from "./Component/Basic/Loader";
import ErrorBoundary from "./Component/Basic/ErrorBoundary";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Services from "./Pages/Services";
import Contact from "./Pages/Contact";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Navbar />
        <Suspense fallback={<Loader />}>
          <main className="min-h-[80vh]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center h-screen text-center">
                    <h1 className="text-3xl font-bold text-red-500 mb-2">404 - Page Not Found</h1>
                    <p className="text-gray-600">The page you are looking for doesn’t exist.</p>
                  </div>
                }
              />
            </Routes>
          </main>
        </Suspense>
        <Footer />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
