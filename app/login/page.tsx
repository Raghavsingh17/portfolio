"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  KeyRound,
  User,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertTriangle,
  Check,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/src/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">("login");

  // Option 3: Registration lock state
  const [registrationEnabled, setRegistrationEnabled] = useState<boolean>(false);
  const [isCheckingSetup, setIsCheckingSetup] = useState<boolean>(true);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Forgot Password states
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [devCodeTip, setDevCodeTip] = useState("");

  // Password Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & loading states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Auto-redirect if already authenticated & check Option 3 setup status
  useEffect(() => {
    let isMounted = true;

    // 1. Verify existing session via pure HttpOnly cookie
    adminApi.getMe().then((meRes) => {
      if (isMounted && meRes.success) {
        router.push("/dashboard");
      }
    });

    // 2. Fetch Option 3 setup status (Lock registration if admin already exists)
    adminApi.getSetupStatus()
      .then((statusRes) => {
        if (isMounted && statusRes.success) {
          // If hasAdmin is true, registration is permanently locked
          const canRegister = Boolean(statusRes.registrationEnabled && !statusRes.hasAdmin);
          setRegistrationEnabled(canRegister);
          if (!canRegister && activeTab === "register") {
            setActiveTab("login");
          } else if (canRegister && !statusRes.hasAdmin && activeTab !== "forgot") {
            setActiveTab("register");
          }
        }
        if (isMounted) setIsCheckingSetup(false);
      })
      .catch(() => {
        if (isMounted) setIsCheckingSetup(false);
      });

    return () => {
      isMounted = false;
    };
  }, [router, activeTab]);

  // Password validation checks for Sign Up
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9\s]/.test(password);
  const isPasswordStrong =
    hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  // Password validation checks for Forgot Password
  const newHasMinLength = newPassword.length >= 8;
  const newHasUpperCase = /[A-Z]/.test(newPassword);
  const newHasLowerCase = /[a-z]/.test(newPassword);
  const newHasNumber = /\d/.test(newPassword);
  const newHasSpecial = /[^A-Za-z0-9\s]/.test(newPassword);
  const isNewPasswordStrong =
    newHasMinLength && newHasUpperCase && newHasLowerCase && newHasNumber && newHasSpecial;

  const newPasswordsMatch =
    confirmNewPassword.length > 0 && newPassword === confirmNewPassword;
  const newPasswordsMismatch =
    confirmNewPassword.length > 0 && newPassword !== confirmNewPassword;

  // 1. Sign In Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const res = await adminApi.login(email.trim(), password.trim());
      if (res.success) {
        setSuccessMsg("Authentication successful! Loading Command Center...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 600);
      } else {
        setErrorMsg(
          res.error || "Invalid admin credentials. Please verify your email and password."
        );
      }
    } catch {
      setErrorMsg("Failed to connect to backend service on port 5000.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Sign Up Handler (Enforces sign-in afterwards, NO direct dashboard access)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (!isPasswordStrong) {
      setErrorMsg(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Password and Confirm Password do not match.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const res = await adminApi.register(
        name.trim(),
        email.trim(),
        password.trim()
      );

      if (res.success) {
        // Clear password fields & switch tab to Sign In (NO DIRECT DASHBOARD ACCESS)
        setPassword("");
        setConfirmPassword("");
        setActiveTab("login");
        // Lock registration immediately (Option 3 Auto-lock)
        setRegistrationEnabled(false);
        setSuccessMsg(
          "Admin account created successfully! Please sign in with your email and password to access the Dashboard."
        );
      } else {
        setErrorMsg(
          res.error ||
            "Registration failed. Please check if this email is already registered."
        );
      }
    } catch {
      setErrorMsg("Failed to connect to backend server on port 5000.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Forgot Password - Step 1: Request OTP Code
  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter your admin email address.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const res = await adminApi.forgotPassword(email.trim());
      if (res.success) {
        setForgotStep(2);
        setSuccessMsg(
          res.message || "A 6-digit verification code has been issued. Enter it below to reset your password."
        );
        if (res.devResetCode) {
          setDevCodeTip(res.devResetCode);
          setResetCode(res.devResetCode);
        }
      } else {
        setErrorMsg(res.error || "Unable to send reset code. Please verify your email.");
      }
    } catch {
      setErrorMsg("Failed to connect to backend server on port 5000.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Forgot Password - Step 2: Submit Reset Code & New Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    if (!isNewPasswordStrong) {
      setErrorMsg(
        "New password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const res = await adminApi.resetPassword(email.trim(), resetCode.trim(), newPassword.trim());
      if (res.success) {
        setSuccessMsg("Password successfully reset! You can now sign in with your new password.");
        setActiveTab("login");
        setForgotStep(1);
        setResetCode("");
        setNewPassword("");
        setConfirmNewPassword("");
        setPassword("");
        setDevCodeTip("");
      } else {
        setErrorMsg(res.error || "Password reset failed. Invalid or expired code.");
      }
    } catch {
      setErrorMsg("Failed to connect to backend server on port 5000.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div suppressHydrationWarning className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Dynamic Cosmic Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <motion.div
        suppressHydrationWarning
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 rounded-3xl border border-white/15 bg-slate-900/85 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-cyan-500/10"
      >
        {/* Header Badge & Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 mb-1 shadow-lg shadow-cyan-500/20">
            {activeTab === "forgot" ? (
              <RefreshCw className="w-7 h-7" />
            ) : (
              <KeyRound className="w-7 h-7" />
            )}
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono tracking-widest text-cyan-400 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {activeTab === "forgot"
                ? "Password Recovery"
                : "Admin Authentication"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {activeTab === "forgot"
              ? "Reset Admin Password"
              : "Portfolio Command Center"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {activeTab === "login" &&
              "Sign in with your verified admin credentials to access the Dashboard."}
            {activeTab === "register" &&
              "Register your administrator profile with secure JWT authentication."}
            {activeTab === "forgot" &&
              (forgotStep === 1
                ? "Enter your admin email to receive a secure password reset code."
                : "Enter your verification code and choose a strong new password.")}
          </p>

          {/* Option 3 Security Pill Indicator */}
          {!registrationEnabled && !isCheckingSetup && activeTab !== "forgot" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Single-Owner Protected • Registrations Locked</span>
            </div>
          )}
        </div>

        {/* Tab Switcher (Option 3: Only visible if registration is enabled and not in forgot mode) */}
        {registrationEnabled && activeTab !== "forgot" && (
          <div className="flex items-center justify-between p-1 bg-slate-950/90 rounded-2xl border border-white/10 mb-6 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "login"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Admin Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "register"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Admin Sign Up
            </button>
          </div>
        )}

        {/* Alerts */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              key="error-box"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 flex items-start gap-3 text-xs text-rose-300 font-medium"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-snug">{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              key="success-box"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-start gap-3 text-xs text-emerald-300 font-medium"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span className="leading-snug">{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 1: LOGIN FORM */}
        {activeTab === "login" && (
          <form suppressHydrationWarning onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 tracking-wide">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@portfolio.com"
                  className="w-full bg-slate-950/90 border border-white/10 focus:border-cyan-500 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 tracking-wide">
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("forgot");
                    setForgotStep(1);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/90 border border-white/10 focus:border-cyan-500 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner focus:ring-2 focus:ring-cyan-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Authenticating Admin...</span>
                </span>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Option 3: Only show Sign Up link if registration is allowed */}
            {registrationEnabled ? (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("register");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
                >
                  Need to create an admin account? Sign Up →
                </button>
              </div>
            ) : (
              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-500/70" />
                  <span>Protected Admin Portal • Public sign up is closed</span>
                </span>
              </div>
            )}
          </form>
        )}

        {/* TAB 2: SIGN UP FORM (Only accessible if Option 3 allows) */}
        {activeTab === "register" && registrationEnabled && (
          <form suppressHydrationWarning onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Raghav Singh"
                  className="w-full bg-slate-950/90 border border-white/10 focus:border-cyan-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 tracking-wide">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@portfolio.com"
                  className="w-full bg-slate-950/90 border border-white/10 focus:border-cyan-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars"
                    className="w-full bg-slate-950/90 border border-white/10 focus:border-cyan-500 rounded-2xl pl-8 pr-8 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 tracking-wide">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm"
                    className={`w-full bg-slate-950/90 border rounded-2xl pl-8 pr-8 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner ${
                      passwordsMismatch
                        ? "border-rose-500/60 focus:border-rose-500"
                        : passwordsMatch
                        ? "border-emerald-500/60 focus:border-emerald-500"
                        : "border-white/10 focus:border-cyan-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword.length > 0 && (
              <div className="text-[11px] font-medium flex items-center gap-1.5 px-1">
                {passwordsMatch ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Passwords match
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Passwords do not match
                  </span>
                )}
              </div>
            )}

            {/* Password Requirements Helper */}
            {password.length > 0 && !isPasswordStrong && (
              <div className="bg-slate-950/60 border border-white/5 rounded-xl p-2.5 text-[10px] space-y-1 text-slate-400">
                <span className="font-semibold text-slate-300">Password Requirements:</span>
                <div className="grid grid-cols-2 gap-1 font-mono">
                  <span className={hasMinLength ? "text-emerald-400" : "text-slate-500"}>
                    {hasMinLength ? "✓" : "○"} 8+ characters
                  </span>
                  <span className={hasUpperCase ? "text-emerald-400" : "text-slate-500"}>
                    {hasUpperCase ? "✓" : "○"} Uppercase (A-Z)
                  </span>
                  <span className={hasLowerCase ? "text-emerald-400" : "text-slate-500"}>
                    {hasLowerCase ? "✓" : "○"} Lowercase (a-z)
                  </span>
                  <span className={hasNumber && hasSpecial ? "text-emerald-400" : "text-slate-500"}>
                    {hasNumber && hasSpecial ? "✓" : "○"} Number & symbol
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Creating Account...</span>
                </span>
              ) : (
                <>
                  <span>Create Admin Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
              >
                Already have an admin account? Sign In →
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: FORGOT PASSWORD FLOW */}
        {activeTab === "forgot" && (
          <div className="space-y-4">
            {forgotStep === 1 ? (
              // Step 1: Request OTP Form
              <form suppressHydrationWarning onSubmit={handleRequestResetCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 tracking-wide">
                    Registered Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@portfolio.com"
                      className="w-full bg-slate-950/90 border border-white/10 focus:border-cyan-500 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Issuing Reset Code...</span>
                    </span>
                  ) : (
                    <>
                      <span>Generate Reset Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotStep(2)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
                  >
                    Already have a code? Enter it →
                  </button>
                </div>
              </form>
            ) : (
              // Step 2: Enter Reset Code / Master Key & New Password
              <form suppressHydrationWarning onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                {/* Dev Mode Reset Code Tip */}
                {devCodeTip && (
                  <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-cyan-300">
                    <Sparkles className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                    <div>
                      <p className="font-semibold">Local Verification Code:</p>
                      <code className="text-sm font-mono font-bold text-cyan-200 tracking-widest bg-cyan-900/60 px-2 py-0.5 rounded mt-1 inline-block">
                        {devCodeTip}
                      </code>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300 tracking-wide">
                    6-Digit Code or Master Recovery Key
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="e.g. 123456 or Master Key"
                      className="w-full bg-slate-950/90 border border-white/10 focus:border-cyan-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-mono text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300 tracking-wide">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 8 chars"
                        className="w-full bg-slate-950/90 border border-white/10 focus:border-cyan-500 rounded-2xl pl-8 pr-8 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300 tracking-wide">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type={showConfirmNewPassword ? "text" : "password"}
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm"
                        className={`w-full bg-slate-950/90 border rounded-2xl pl-8 pr-8 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner ${
                          newPasswordsMismatch
                            ? "border-rose-500/60 focus:border-rose-500"
                            : newPasswordsMatch
                            ? "border-emerald-500/60 focus:border-emerald-500"
                            : "border-white/10 focus:border-cyan-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {showConfirmNewPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Match Indicator */}
                {confirmNewPassword.length > 0 && (
                  <div className="text-[11px] font-medium flex items-center gap-1.5 px-1">
                    {newPasswordsMatch ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}

                {/* Password Requirements */}
                {newPassword.length > 0 && !isNewPasswordStrong && (
                  <div className="bg-slate-950/60 border border-white/5 rounded-xl p-2.5 text-[10px] space-y-1 text-slate-400">
                    <span className="font-semibold text-slate-300">Password Requirements:</span>
                    <div className="grid grid-cols-2 gap-1 font-mono">
                      <span className={newHasMinLength ? "text-emerald-400" : "text-slate-500"}>
                        {newHasMinLength ? "✓" : "○"} 8+ characters
                      </span>
                      <span className={newHasUpperCase ? "text-emerald-400" : "text-slate-500"}>
                        {newHasUpperCase ? "✓" : "○"} Uppercase (A-Z)
                      </span>
                      <span className={newHasLowerCase ? "text-emerald-400" : "text-slate-500"}>
                        {newHasLowerCase ? "✓" : "○"} Lowercase (a-z)
                      </span>
                      <span className={newHasNumber && newHasSpecial ? "text-emerald-400" : "text-slate-500"}>
                        {newHasNumber && newHasSpecial ? "✓" : "○"} Number & symbol
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Updating Password...</span>
                    </span>
                  ) : (
                    <>
                      <span>Set New Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(1);
                      setErrorMsg("");
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Step 1</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
                  >
                    Return to Sign In →
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Footer Link back to Portfolio */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Main Portfolio</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
