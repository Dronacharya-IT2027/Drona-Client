// src/Component/Advanced/SignUp/view.jsx
import React, { useState, useContext } from "react";
import { UserPlus, Lock, Mail, User, BookOpen, Link as LinkIcon, Github, Loader2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../auth/authContext"; // adjust if your folder layout differs

/* Robust env lookup (Vite / CRA / Next) */
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

const initialState = {
  name: "",
  enrollmentNumber: "",
  email: "",
  password: "",
  branch: "",
  linkedin: "",
  leetcode: "",
  github: ""
};

const SignUp = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // { title, message }
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Get verify from AuthContext to update global auth after signup
  const { verify } = useContext(AuthContext);

  const validate = () => {
    const { name, enrollmentNumber, email, password, branch } = form;
    if (!name.trim()) return "Please enter your name.";
    if (!enrollmentNumber.trim()) return "Please enter enrollment number.";
    if (!branch.trim()) return "Please select/enter your branch.";
    if (!email.trim()) return "Please enter email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Please enter a valid email.";
    if (!password || password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const vErr = validate();
    if (vErr) {
      setError({ title: "Validation error", message: vErr });
      return;
    }

    setLoading(true);
    try {
      const body = {
        name: form.name.trim(),
        enrollmentNumber: form.enrollmentNumber.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        branch: form.branch.trim(),
        linkedin: form.linkedin.trim(),
        leetcode: form.leetcode.trim(),
        github: form.github.trim()
      };

      const resp = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await resp.json();

      if (!resp.ok) {
        const msg = data && data.message ? data.message : "Signup failed";
        setError({ title: "Signup failed", message: msg });
        setLoading(false);
        return;
      }

      // store token only; let AuthProvider verify and set user
      if (data.token) {
        try {
          localStorage.removeItem("token"); // clear old token if any
          localStorage.setItem("token", data.token);
          localStorage.removeItem("role");
          localStorage.removeItem("user");
          localStorage.setItem("role", data.user.role);
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (err) {
          console.warn("Unable to save token to localStorage", err);
        }
      }

      // call verify() from context to refresh global auth state
      try {
        const verifiedUser = await verify(); // AuthProvider.verify()
        if (verifiedUser) {
          navigate("/");
        } else {
          setError({ title: "Verification failed", message: "Could not validate session after signup." });
        }
      } catch (verifyErr) {
        console.error("Post-signup verify error:", verifyErr);
        setError({ title: "Verification error", message: "Unable to verify session. Try logging in." });
      } finally {
        setLoading(false);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError({ title: "Network error", message: "Unable to reach server. Please try again." });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent2/10 to-accent1/10 p-4 font-kodchasan">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-primary/10 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left - visual column */}
          <div className="w-full lg:w-1/2 p-8 sm:p-10 bg-gradient-to-b from-secondary/5 to-accent1/5 flex flex-col items-center justify-center">
            {/* Simple logo - user plus */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-tr from-secondary to-accent1 flex items-center justify-center shadow-lg mb-4">
              <UserPlus className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Create your student account</h2>
            <p className="text-sm text-primary/70 text-center px-6">
              Sign up to access skill development tests, track progress and participate in campus events.
            </p>

            <div className="mt-6 w-full px-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs text-primary/60">Student</div>
                <div className="text-xs text-primary/60 text-right">Role: <span className="font-semibold">Student</span></div>
              </div>
            </div>

            {/* subtle footer */}
            <div className="mt-6 text-xs text-primary/50 text-center px-6">
              By signing up you agree to the platform's <span className="underline">Terms</span> and <span className="underline">Privacy</span>.
            </div>
          </div>

          {/* Right - form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* error / alert */}
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

              {/* inputs grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="input-group">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary/60" />
                    <span className="text-xs text-primary/70">Full name</span>
                  </div>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Manas Singh"
                    className="mt-1 p-2 border border-primary/10 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-accent1"
                  />
                </label>

                <label className="input-group">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary/60" />
                    <span className="text-xs text-primary/70">Enrollment No.</span>
                  </div>
                  <input
                    name="enrollmentNumber"
                    value={form.enrollmentNumber}
                    onChange={handleChange}
                    placeholder="e.g. CS25EN001"
                    className="mt-1 p-2 border border-primary/10 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-accent1"
                  />
                </label>

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
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="min 6 characters"
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

                <label className="input-group col-span-1 sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary/60" />
                    <span className="text-xs text-primary/70">Branch</span>
                  </div>
                  <input
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    className="mt-1 p-2 border border-primary/10 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-accent1"
                  />
                </label>

                {/* handles */}
                <label className="input-group">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-primary/60" />
                    <span className="text-xs text-primary/70">LinkedIn</span>
                  </div>
                  <input
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="linkedin url or handle"
                    className="mt-1 p-2 border border-primary/10 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-accent1"
                  />
                </label>

                <label className="input-group">
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-primary/60" />
                    <span className="text-xs text-primary/70">GitHub</span>
                  </div>
                  <input
                    name="github"
                    value={form.github}
                    onChange={handleChange}
                    placeholder="github handle"
                    className="mt-1 p-2 border border-primary/10 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-accent1"
                  />
                </label>

                <label className="input-group sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary/60" />
                    <span className="text-xs text-primary/70">LeetCode</span>
                  </div>
                  <input
                    name="leetcode"
                    value={form.leetcode}
                    onChange={handleChange}
                    placeholder="leetcode handle (optional)"
                    className="mt-1 p-2 border border-primary/10 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-accent1"
                  />
                </label>
              </div>

              {/* submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-gradient-to-r from-secondary to-accent1 text-white font-semibold rounded-lg shadow hover:scale-[1.01] transition transform disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span className="text-sm">Creating account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span className="text-sm">Create Account</span>
                    </>
                  )}
                </button>
              </div>

              {/* small link */}
              <div className="text-center text-xs text-primary/60">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="underline text-primary/80 font-medium"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* subtle floating success / tip (optional) */}
      <style>{`
        /* small helper to keep input-group consistent */
        .input-group > div { display:flex; align-items:center; gap:0.5rem; }
      `}</style>
    </div>
  );
};

export default SignUp;
