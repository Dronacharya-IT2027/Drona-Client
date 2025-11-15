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
  ArrowRight,
  Code,
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

export default function SignUp() {
  const [form, setForm] = useState(initialState);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [verificationToken, setVerificationToken] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();
  const { verify } = useContext(AuthContext);

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
      setCooldown(30);
    } catch (err) {
      console.error("Send OTP error:", err);
      setError({ title: "Network error", message: "Unable to reach server. Please try again." });
    } finally {
      setLoading(false);
    }
  };

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

      setRequestId(data?.requestId || "");
      setStep(3);
      setError(null);
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError({ title: "Network error", message: "Unable to reach server. Please try again." });
    } finally {
      setLoading(false);
    }
  };

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
      <div className="w-full max-w-4xl mt-20 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-primary/10 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left - Brand Section (Matches Hero) */}
          <div className="w-full lg:w-2/5 p-8 bg-gradient-to-br from-secondary/20 to-accent1/20 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-secondary to-accent1 flex items-center justify-center shadow-lg">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-primary">Smart Placement</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                  Join <span className="text-secondary">Smart</span>{" "}
                  <span className="text-accent1">Placement</span> Prep
                </h1>
                
                <p className="text-primary/80 text-lg leading-relaxed">
                  Start your journey to ace placements with comprehensive aptitude, GD, and interview training.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-primary/70">
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-secondary" />
                    </div>
                    <span className="text-sm">Aptitude & Technical Tests</span>
                  </div>
                  <div className="flex items-center gap-3 text-primary/70">
                    <div className="w-6 h-6 rounded-full bg-accent1/20 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-accent1" />
                    </div>
                    <span className="text-sm">Group Discussion Practice</span>
                  </div>
                  <div className="flex items-center gap-3 text-primary/70">
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-secondary" />
                    </div>
                    <span className="text-sm">Interview Preparation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="relative z-10">
              <div className="flex justify-between items-center text-sm text-primary/60 mb-2">
                <span>Step {step} of 3</span>
                <span>{step === 1 ? "Basic Info" : step === 2 ? "Verify Email" : "Complete"}</span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-secondary to-accent1 rounded-full h-2 transition-all duration-500 ease-out"
                  style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                />
              </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 right-10 w-20 h-20 bg-secondary rounded-full"></div>
              <div className="absolute bottom-10 left-10 w-16 h-16 bg-accent1 rounded-full"></div>
            </div>
          </div>

          {/* Right - Form Section */}
          <div className="w-full lg:w-3/5 p-8 lg:p-10 flex flex-col justify-center">
            {step === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="text-center lg:text-left mb-6">
                  <h2 className="text-2xl font-bold text-primary mb-2">Create Student Account</h2>
                  <p className="text-primary/60">Enter your details to get started</p>
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-red-800 text-sm">{error.title}</div>
                        <div className="text-red-700 text-sm">{error.message}</div>
                      </div>
                      <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary/80">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Adarsh Kumar"
                        className="w-full pl-10 pr-4 py-3 border border-primary/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary/80">Enrollment Number</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input
                        name="enrollmentNumber"
                        value={form.enrollmentNumber}
                        onChange={handleChange}
                        placeholder="08315603123"
                        className="w-full pl-10 pr-4 py-3 border border-primary/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary/80">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 border border-primary/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary/80">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="min 6 characters"
                        className="w-full pl-10 pr-12 py-3 border border-primary/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all duration-200 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/40 hover:text-primary/60"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-primary/80">Section</label>
<div className="relative">
  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40" />

  <select
    name="branch"
    value={form.branch}
    onChange={handleChange}
    className="w-full pl-10 pr-4 py-3 border border-primary/10 rounded-xl bg-white/50 text-primary
               focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all duration-200 outline-none appearance-none"
  >
    <option value="">Select Section</option>
    <option value="T6">T6</option>
    <option value="T7">T7</option>
    <option value="T18">T18</option>
    <option value="T5">T5</option>
  </select>

  {/* Dropdown arrow */}
  <svg
    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
</div>

                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary/80">LinkedIn</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input
                        name="linkedin"
                        value={form.linkedin}
                        onChange={handleChange}
                        placeholder="linkedin.com/in/username"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-primary/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary/80">GitHub</label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input
                        name="github"
                        value={form.github}
                        onChange={handleChange}
                        placeholder="github.com/username"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-primary/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* LeetCode Field - Added Back */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-primary/80">LeetCode</label>
                    <div className="relative">
                      <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input
                        name="leetcode"
                        value={form.leetcode}
                        onChange={handleChange}
                        placeholder="leetcode.com/username "
                        required
                        className="w-full pl-10 pr-4 py-3 border border-primary/10 rounded-xl bg-white/50 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-secondary to-accent1 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send OTP & Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center text-sm text-primary/60">
                  Already have an account?{" "}
                  <button type="button" onClick={() => navigate("/login")} className="text-secondary font-semibold hover:text-accent1 transition-colors">
                    Log in
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="text-center lg:text-left mb-6">
                  <h2 className="text-2xl font-bold text-primary mb-2">Verify Your Email</h2>
                  <p className="text-primary/60">
                    Enter the OTP sent to <span className="font-semibold text-primary">{form.email}</span>
                  </p>
                </div>

                {error && (
                  <div className={`p-4 rounded-lg border ${
                    error.type === "success" 
                      ? "bg-green-50 border-green-200" 
                      : "bg-red-50 border-red-200"
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className={`font-semibold text-sm ${
                          error.type === "success" ? "text-green-800" : "text-red-800"
                        }`}>
                          {error.title}
                        </div>
                        <div className={`text-sm ${
                          error.type === "success" ? "text-green-700" : "text-red-700"
                        }`}>
                          {error.message}
                        </div>
                      </div>
                      <button onClick={() => setError(null)} className={
                        error.type === "success" ? "text-green-500 hover:text-green-700" : "text-red-500 hover:text-red-700"
                      }>
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="Enter 6-digit OTP"
                      className="w-full p-4 text-center text-2xl font-bold border-2 border-primary/20 rounded-xl bg-white/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <div className="flex justify-center gap-4 text-sm">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendLoading || cooldown > 0}
                      className="text-secondary hover:text-accent1 disabled:opacity-50 flex items-center gap-1 transition-colors"
                    >
                      {resendLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                      {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                    </button>

                    <button
                      type="button"
                      onClick={goBackToStep1}
                      className="text-primary/60 hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Change Email
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Verify & Submit for Review
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-primary">Request Submitted!</h2>
                  
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-left">
                    <div className="text-sm text-blue-800">
                      Your request <span className="font-semibold">has been submitted</span> and is now{" "}
                      <span className="font-semibold">under review</span> by your branch admin.
                    </div>
                  </div>

                  <p className="text-primary/60 text-sm">
                    Kindly contact your T&P coordinator to get your ID approved.                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 rounded-xl border border-primary/10 bg-white hover:bg-gray-50 transition-colors font-medium"
                  >
                    Go to Home
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-accent1 text-white hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}