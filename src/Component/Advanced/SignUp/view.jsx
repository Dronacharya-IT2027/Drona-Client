import React, { useState, useContext, useEffect } from "react";
import {
  UserPlus,
  Lock,
  Mail,
  User,
  BookOpen,
  Link as LinkIcon,
  Github,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../auth/authContext";

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
  github: "",
};

/**
 * UPDATED SIGNUP (Review Flow)
 * ------------------------------------------------------
 * Step 1: Submit details → POST /api/auth/send-signup-otp
 * Step 2: Enter OTP → POST /api/auth/verify-signup-otp
 * Step 3: Show "Under Review" confirmation (no account yet, no token)
 */
export default function SignUp() {
  const [form, setForm] = useState(initialState);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Basic info, 2: OTP verification, 3: Under Review
  const [verificationToken, setVerificationToken] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [cooldown, setCooldown] = useState(0); // seconds for resend cooldown (optional UX)

  const navigate = useNavigate();
  const { verify } = useContext(AuthContext); // not used for auto-login in review flow, but keep for future

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const validateStep1 = () => {
    const { name, enrollmentNumber, email, password, branch } = form;
    if (!name.trim()) return "Please enter your name.";
    if (!enrollmentNumber.trim()) return "Please enter enrollment number.";
    if (!branch.trim()) return "Please select/enter your branch.";
    if (!email.trim()) return "Please enter email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Please enter a valid email.";
    if (!password || password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const validateStep2 = () => {
    if (!otp.trim() || otp.length !== 6) return "Please enter a valid 6-digit OTP.";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  // Step 1: Send OTP (does NOT create user)
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError(null);

    const vErr = validateStep1();
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
        github: form.github.trim(),
      };

      const resp = await fetch(`${API_BASE}/api/auth/send-signup-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await resp.json();

      if (!resp.ok) {
        const msg = data?.message || "Failed to send OTP";
        setError({ title: "OTP Error", message: msg });
        setLoading(false);
        return;
      }

      setVerificationToken(data.verificationToken);
      setStep(2);
      setError(null);
      setCooldown(30); // optional 30s cooldown before resend
    } catch (err) {
      console.error("Send OTP error:", err);
      setError({ title: "Network error", message: "Unable to reach server. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP → creates SignupRequest (UNDER REVIEW)
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(null);

    const vErr = validateStep2();
    if (vErr) {
      setError({ title: "Validation error", message: vErr });
      return;
    }

    setLoading(true);
    try {
      const body = {
        email: form.email.trim().toLowerCase(),
        otp: otp,
        verificationToken: verificationToken,
      };

      const resp = await fetch(`${API_BASE}/api/auth/verify-signup-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await resp.json();

      if (!resp.ok) {
        const msg = data?.message || "OTP verification failed";
        setError({ title: "Verification Failed", message: msg });
        setLoading(false);
        return;
      }

      // New flow: No token/user returned here. We just got requestId and success message.
      setRequestId(data?.requestId || "");
      setStep(3); // Under Review screen
      setError(null);
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError({ title: "Network error", message: "Unable to reach server. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    setResendLoading(true);
    setError(null);

    try {
      const body = {
        email: form.email.trim().toLowerCase(),
        verificationToken: verificationToken,
      };

      const resp = await fetch(`${API_BASE}/api/auth/resend-signup-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await resp.json();

      if (!resp.ok) {
        const msg = data?.message || "Failed to resend OTP";
        setError({ title: "Resend Failed", message: msg });
        return;
      }

      setError({ title: "OTP Sent", message: "New OTP has been sent to your email.", type: "success" });
      setCooldown(30);
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError({ title: "Network error", message: "Unable to resend OTP. Please try again." });
    } finally {
      setResendLoading(false);
    }
  };

  const goBackToStep1 = () => {
    setStep(1);
    setOtp("");
    setError(null);
    setVerificationToken("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent2/10 to-accent1/10 p-4 font-kodchasan">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-primary/10 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left - visual column */}
          <div className="w-full lg:w-1/2 p-8 sm:p-10 bg-gradient-to-b from-secondary/5 to-accent1/5 flex flex-col items-center justify-center">
            {step === 1 && (
              <>
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-tr from-secondary to-accent1 flex items-center justify-center shadow-lg mb-4">
                  <UserPlus className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Create your student account</h2>
                <p className="text-sm text-primary/70 text-center px-6">
                  Sign up to access skill development tests, track progress and participate in campus events.
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center shadow-lg mb-4">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Verify Your Email</h2>
                <p className="text-sm text-primary/70 text-center px-6">
                  We've sent a 6-digit OTP to your email address. Please enter it below to verify your email.
                </p>
              </>
            )}

            {step === 3 && (
              <>
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg mb-4">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Request Submitted</h2>
                <p className="text-sm text-primary/70 text-center px-6">
                  Your signup request is <span className="font-semibold">under review</span> by your branch admin.
                  You'll be able to log in once it's accepted.
                </p>
              </>
            )}

            <div className="mt-6 w-full px-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs text-primary/60">Student</div>
                <div className="text-xs text-primary/60 text-right">Step {step} of 3</div>
              </div>
              {/* Progress bar */}
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-accent1 rounded-full h-2 transition-all duration-300"
                  style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                ></div>
              </div>
            </div>

            <div className="mt-6 text-xs text-primary/50 text-center px-6">
              By signing up you agree to the platform's <span className="underline">Terms</span> and <span className="underline">Privacy</span>.
            </div>
          </div>

          {/* Right - form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8">
            {step === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                {/* Error Alert */}
                {error && (
                  <div className="border-l-4 border-red-400 bg-red-50 p-3 rounded-md">
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8.707 3.293a1 1 0 011.414 0l.003.003a1 1 0 01-1.414 1.414l-.003-.003a1 1 0 010-1.414zM9 7a1 1 0 10-2 0 1 1 0 002 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-red-700">{error.title}</div>
                        <div className="text-xs text-red-700/90">{error.message}</div>
                      </div>
                      <button type="button" onClick={() => setError(null)} className="text-red-500 hover:text-red-700 p-1">
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* Inputs Grid */}
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

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-gradient-to-r from-secondary to-accent1 text-white font-semibold rounded-lg shadow hover:scale-[1.01] transition transform disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span className="text-sm">Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">Send OTP</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                {/* Success/Error Alert */}
                {error && (
                  <div
                    className={`border-l-4 ${error.type === "success" ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"} p-3 rounded-md`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        {error.type === "success" ? (
                          <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8.707 3.293a1 1 0 011.414 0l.003.003a1 1 0 01-1.414 1.414l-.003-.003a1 1 0 010-1.414zM9 7a1 1 0 10-2 0 1 1 0 002 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold text-sm ${error.type === "success" ? "text-green-700" : "text-red-700"}`}>
                          {error.title}
                        </div>
                        <div className={`text-xs ${error.type === "success" ? "text-green-700/90" : "text-red-700/90"}`}>
                          {error.message}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setError(null)}
                        className={error.type === "success" ? "text-green-500 hover:text-green-700 p-1" : "text-red-500 hover:text-red-700 p-1"}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <p className="text-sm text-primary/70 mb-4">
                    Enter the 6-digit OTP sent to
                    <br />
                    <strong className="text-primary">{form.email}</strong>
                  </p>

                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="Enter OTP"
                      className="w-full p-4 text-center text-2xl font-bold border-2 border-primary/20 rounded-lg bg-white focus:border-accent1 focus:ring-2 focus:ring-accent1/20 outline-none tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <div className="mt-4 flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendLoading || cooldown > 0}
                      className="text-sm text-accent1 hover:text-accent2 disabled:opacity-50 flex items-center gap-1"
                    >
                      {resendLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                      {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                    </button>

                    <button
                      type="button"
                      onClick={goBackToStep1}
                      className="text-sm text-primary/60 hover:text-primary flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Change Email
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow hover:scale-[1.01] transition transform disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span className="text-sm">Verifying…</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">Verify & Submit for Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 bg-blue-50 p-3 rounded-md">
                  <div className="text-sm text-blue-800">
                    Your request <span className="font-medium">has been submitted</span> and is now <span className="font-medium">under review</span> by your branch admin.
                    {requestId ? (
                      <> Your reference ID is <span className="font-mono">{requestId}</span>.</>
                    ) : null}
                  </div>
                </div>

                <div className="text-sm text-primary/70">
                  You'll receive an email once your request is accepted. After acceptance, you can log in using the email and password you set during signup.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
                  >
                    Go to Home
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 rounded-lg bg-black text-white hover:brightness-95"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            )}

            {/* Login Link */}
            {step !== 3 && (
              <div className="text-center text-xs text-primary/60 mt-4">
                Already have an account? {" "}
                <button type="button" onClick={() => navigate("/login")} className="underline text-primary/80 font-medium">
                  Log in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .input-group > div { display:flex; align-items:center; gap:0.5rem; }
      `}</style>
    </div>
  );
}
