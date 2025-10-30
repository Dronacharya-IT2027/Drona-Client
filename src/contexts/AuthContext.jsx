// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null); // store student info
  const [testScores, setTestScores] = useState([]); // store all test scores
  const [activeTest, setActiveTest] = useState(null); // store current active test
  const navigate = useNavigate();

  // Persist token in localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // --- LOGIN FUNCTION ---
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
        skipAuth: true,
      });
      setToken(res.token);
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // --- LOGOUT FUNCTION ---
  const logout = () => {
    setToken(null);
    setStudentData(null);
    setTestScores([]);
    setActiveTest(null);
    navigate("/login");
  };

  // --- FETCH CURRENT STUDENT DETAILS ---
  const fetchStudentDetails = async () => {
    if (!token) return;
    try {
      const res = await apiFetch("/api/students/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudentData(res);
    } catch (err) {
      console.error("Error fetching student details:", err);
    }
  };

  // --- FETCH ACTIVE TEST (Today’s Test) ---
  const fetchActiveTest = async () => {
    if (!token) return;
    try {
      const res = await apiFetch("/api/tests/current", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActiveTest(res);
    } catch (err) {
      console.error("No active test found or error fetching active test:", err);
      setActiveTest(null);
    }
  };

  // --- FETCH ALL TEST SCORES ---
  const fetchAllTestScores = async () => {
    if (!token) return;
    try {
      const res = await apiFetch("/api/students/test-scores", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTestScores(res);
    } catch (err) {
      console.error("Error fetching test scores:", err);
      setTestScores([]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        login,
        logout,
        loading,
        studentData,
        testScores,
        activeTest,
        fetchStudentDetails,
        fetchActiveTest,
        fetchAllTestScores,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
