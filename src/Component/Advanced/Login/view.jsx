// src/Component/Advanced/Login/view.jsx
import React, { useState, useContext } from "react";
import { Mail, Lock, UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../auth/authContext"; // adjust path if needed

/* Robust env lookup (Vite / CRA / Next) */
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

const initial = { email: "", password: "" };

const Login = () => {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // use verify from AuthContext to update global auth state after login
  const { verify } = useContext(AuthContext);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.email.trim()) return "Please enter your email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Please enter a valid email.";
    if (!form.password) return "Please enter your password.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError({ title: "Validation error", message: v });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.message || "Login failed";
        setError({ title: "Login error", message: msg });
        setLoading(false);
        return;
      }

      // store token and user
      if (data.token) {
        try {
          localStorage.setItem("token", data.token);
        } catch (err) {
          console.warn("Unable to save token to localStorage", err);
        }
      }

      // prefer server-provided user object (data.user). Fallback to existing saved user.
      try {
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          // If server didn't return full user, make minimal user from form
          const minimal = { email: form.email.trim().toLowerCase() };
          localStorage.setItem("user", JSON.stringify(minimal));
        }
      } catch (err) {
        console.warn("Unable to save user to localStorage", err);
      }

      // Update global auth state. We wait for verify() to complete but do not rely on context role timing.
      try {
        await verify(); // AuthProvider.verify() should update context
      } catch (verifyErr) {
        console.warn("verify() failed after login:", verifyErr);
        // proceed anyway — navigation below will use saved user info
      }

      // Decide navigation using the saved user email (stable and immediate)
      try {
        const saved = JSON.parse(localStorage.getItem("user") || "{}");
        const email = (saved?.email || "").toString().trim().toLowerCase();
        const SUPER_ADMIN_EMAIL = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SUPER_ADMIN_EMAIL)
          ? import.meta.env.VITE_SUPER_ADMIN_EMAIL.toLowerCase()
          : (process.env.REACT_APP_SUPER_ADMIN_EMAIL || process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || "").toLowerCase();

        const isSuper = email && SUPER_ADMIN_EMAIL && email === SUPER_ADMIN_EMAIL;

        // Navigate: super-admin → app root (AppRoutes should render SuperAdminDashboard for super-admin role),
        // normal user → dashboard (or whatever route you want)
        if (isSuper) {
          navigate("/"); // root will show SuperAdminDashboard because AuthProvider sets role
        } else {
          navigate("/dashboard");
        }
      } catch (navErr) {
        console.error("Navigation decision error:", navErr);
        // fallback
        navigate("/");
      } finally {
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError({ title: "Network error", message: "Unable to reach server. Try again." });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent2/10 to-accent1/10 p-4 font-kodchasan">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-primary/10 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left visual area */}
          <div className="w-full lg:w-1/2 p-8 sm:p-10 bg-gradient-to-b from-secondary/5 to-accent1/5 flex flex-col items-center justify-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-tr from-secondary to-accent1 flex items-center justify-center shadow-lg mb-4">
              <UserPlus className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Welcome back</h2>
            <p className="text-sm text-primary/70 text-center px-6">
              Login to continue to Dronaa !! take tests, track your progress, and access campus activities.
            </p>
          </div>

          {/* Right form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="relative">
                  <div className="border-l-4 border-red-400 bg-red-50 p-3 rounded-md">
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8.707 3.293a1 1 0 011.414 0l.003.003a1 1 0 01-1.414 1.414l-.003-.003a1 1 0 010-1.414zM9 7a1 1 0 10-2 0 1 1 0 002 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-red-700">{error.title}</div>
                        <div className="text-xs text-red-700/90">{error.message}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setError(null)}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="Close error"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <label className="input-group">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary/60" />
                    <span className="text-xs text-primary/70">Email</span>
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="mt-1 p-2 border border-primary/10 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-accent1"
                  />
                </label>

                <label className="input-group relative">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary/60" />
                    <span className="text-xs text-primary/70">Password</span>
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="mt-1 p-2 pr-10 border border-primary/10 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-accent1"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-10 text-primary/60 p-1"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-gradient-to-r from-secondary to-accent1 text-white font-semibold rounded-lg shadow hover:scale-[1.01] transition transform disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span className="text-sm">Signing in...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">Sign in</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-xs text-primary/60">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="underline text-primary/80 font-medium"
                >
                  Create one
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .input-group > div { display:flex; align-items:center; gap:0.5rem; }
      `}</style>
    </div>
  );
};

export default Login;
