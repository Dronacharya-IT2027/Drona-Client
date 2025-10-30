import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { User } from "lucide-react";

const Navbar = () => {
  const { token, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex justify-between items-center">
      {/* Logo */}
      <h1 className="font-kodchasan text-xl sm:text-2xl font-black tracking-tight">
        <span className="text-secondary">Learn</span>
        <span className="text-black">ify</span>
      </h1>

      {/* Right Side Buttons */}
      {!token ? (
        <div className="flex gap-2 sm:gap-3 md:gap-4">
          <NavLink
            to="/login"
            className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 bg-secondary text-white rounded-full text-sm sm:text-base font-medium shadow-md hover:bg-orange-600 transition-all duration-200 border-2 border-black"
          >
            Login
          </NavLink>
        </div>
      ) : (
        <div
          className="user-section"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <User size={20} />
          <button
            onClick={(logout)}
            className="btn-logout"
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
