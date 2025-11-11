import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Component/Basic/Loader";
import AuthContext from "./authContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Guard to avoid concurrent verify calls if verify is triggered multiple times (optional)
  const verify = useCallback(async () => {
    // defensive: if already loading and user is null, proceed (this prevents races)
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.warn("Auth verify failed:", res.status, res.statusText);
        setUser(null);
        localStorage.removeItem("token");
        setLoading(false);
        return null;
      }

      const data = await res.json();
      if (data && data.user) {
        setUser(data.user);
        setLoading(false);
        console.log("Auth verified:", data.user);
        return data.user;
      } else {
        setUser(null);
        localStorage.removeItem("token");
        setLoading(false);
        return null;
      }
    } catch (err) {
      console.error("Auth verify error:", err);
      setUser(null);
      localStorage.removeItem("token");
      setLoading(false);
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/signup");
  }, [navigate]);

  useEffect(() => {
    verify();
  }, [verify]);

  if (loading) return <Loader />;

  return (
    <AuthContext.Provider value={{ user, loading, verify, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
