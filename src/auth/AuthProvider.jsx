// src/auth/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Component/Basic/Loader";
import AuthContext from "./authContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL?.toLowerCase();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("normal"); // "normal" | "admin" | "super-admin"
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const verify = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setRole("normal");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setUser(null);
        setRole("normal");
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!data?.user) {
        setUser(null);
        setRole("normal");
        setLoading(false);
        return;
      }

      const loggedUser = data.user;
      setUser(loggedUser);

      // Decide superadmin based on email
      if (loggedUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
        setRole("super-admin");
      } else {
        setRole("normal");
      }

      setLoading(false);
    } catch (err) {
      console.error("Verify Error:", err);
      setUser(null);
      setRole("normal");
      localStorage.removeItem("token");
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setRole("normal");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    verify();
  }, [verify]);

  if (loading) return <Loader />;

  return (
    <AuthContext.Provider value={{ user, role, loading, verify, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
