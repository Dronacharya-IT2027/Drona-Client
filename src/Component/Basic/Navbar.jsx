// src/Component/Basic/Navbar.jsx
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../../auth/authContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex justify-between items-center">
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="cursor-pointer font-kodchasan text-xl sm:text-2xl font-black tracking-tight"
      >
        <span className="text-secondary">Learn</span>
        <span className="text-black">ify</span>
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-3 sm:gap-4">
        {!user ? (
          <>
            <NavLink
              to="/signup"
              className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 bg-white text-black rounded-full text-sm sm:text-base font-medium border border-gray-200 shadow-sm hover:bg-gray-100 transition-all duration-200"
            >
              Sign up
            </NavLink>

            <NavLink
              to="/login"
              className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 bg-secondary text-white rounded-full text-sm sm:text-base font-medium shadow-md hover:bg-orange-600 transition-all duration-200 border-2 border-black"
            >
              Login
            </NavLink>
          </>
        ) : (
          <div className="flex items-center gap-3">
            {/* Profile Circle */}
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-white font-semibold cursor-pointer hover:scale-105 transition-transform duration-200"
              title={user.name}
              onClick={() => navigate("/dashboard")}
            >
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-3 sm:px-4 py-1.5 bg-red-500 text-white rounded-full text-sm sm:text-base font-medium hover:bg-red-600 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
