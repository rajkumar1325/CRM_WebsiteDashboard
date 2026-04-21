/**
 * AuthCard.jsx — CURIEM CRM Landing
 * ─────────────────────────────────────────────────────────────────
 * The hero-section signup / login card.
 *
 * SECURITY MODEL (important):
 * ─────────────────────────────────────────────────────────────────
 *   PUBLIC SIGNUP → Admin only (roleId = 1).
 *   The landing page registers the company owner as an Admin.
 *   The Admin then creates Manager and Member accounts from INSIDE
 *   the dashboard:  POST /api/v1/users/role/{roleId}  (auth-gated)
 *
 *   This matches the backend's Spring Security constraint:
 *     POST /api/v1/auth/register/{roleId} → Admin-only
 *     POST /api/v1/users/role/{roleId}    → Admin-only
 *
 *   At LOGIN the backend derives the user's role from the stored
 *   JWT / DB record — the user should NOT be asked to pick a role.
 *
 * Auth endpoints used:
 *   Signup → POST /api/v1/auth/register/1    (registerAdminUser)
 *   Login  → POST /api/v1/auth/login         (loginUser)
 *   Forgot → POST /api/v1/auth/forgot-password (toast placeholder)
 *
 * Props:
 *   authCardRef   {React.Ref}               — Ref for scroll-into-view
 *   authHighlight {boolean}                  — Ring highlight on focus
 *   shake         {boolean}                  — Shake animation on error
 *   authMode      {"signup" | "login"}
 *   setAuthMode   {(mode) => void}
 *   onSubmit      {() => Promise<void>}
 *   isSubmitting  {boolean}
 *   showToast     {(msg, type) => void}
 *
 *   — Form field props —
 *   companyName, setCompanyName
 *   email, setEmail
 *   password, setPassword
 *   confirmPassword, setConfirmPassword
 *   fieldErrors                              — { fieldName: errorString }
 *   setFieldErrors
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState } from "react";
import Field from "../ui/Field";
import Input from "../ui/Input";
import PasswordStrengthBar from "../ui/PasswordStrengthBar";

export default function AuthCard({
  authCardRef,
  authHighlight,
  shake,
  authMode,
  setAuthMode,
  onSubmit,
  isSubmitting,
  showToast,
  companyName, setCompanyName,
  email, setEmail,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  fieldErrors, setFieldErrors,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = password === confirmPassword && password.length > 0;

  /* Shake confirm field if it loses focus while mismatched */
  const handleConfirmBlur = () => {
    if (confirmPassword && !passwordsMatch) {
      // Parent handles actual shake; this is just UX feedback
    }
  };

  return (
    <div
      ref={authCardRef}
      className={`w-full max-w-md lg:max-w-sm transition-all duration-500 rounded-2xl ${
        authHighlight
          ? "scale-105 ring-2 ring-cyan-400/50 shadow-2xl shadow-cyan-500/20"
          : "scale-100"
      } ${shake ? "animate-shake" : ""}`}
    >
      <div className="rounded-2xl bg-[#050b17]/80 border border-gray-700/60
        shadow-xl shadow-cyan-500/10 p-5 backdrop-blur-md">

        {/* ── SIGNUP INFO BANNER ─────────────────────────────────────────
            Informs users that Manager / Member accounts are created from
            the dashboard by the Admin — not via this public form.
            Renders on SIGNUP mode only.
        ─────────────────────────────────────────────────────────────── */}
        {authMode === "signup" && (
          <div className="mb-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-3 py-2.5">
            <p className="text-[10px] text-cyan-300 font-medium mb-0.5">
              Registering as Admin (Workspace Owner)
            </p>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              This creates your company workspace. Once inside, you can add
              Leaders (Project Managers) and Members (Employees) from the
              dashboard — POST /api/v1/users/role/&#123;roleId&#125;.
            </p>
          </div>
        )}

        {/* ── Mode toggle ── */}
        <div className="flex mb-4 rounded-full bg-gray-800/70 p-1 text-xs sm:text-sm">
          {["signup", "login"].map((mode) => (
            <button
              key={mode}
              onClick={() => setAuthMode(mode)}
              className={`flex-1 py-1.5 rounded-full capitalize transition font-medium
                ${authMode === mode
                  ? "bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 text-black shadow-md"
                  : "text-gray-400 hover:text-white"
                }`}
            >
              {mode === "signup" ? "Sign up" : "Log in"}
            </button>
          ))}
        </div>

        {/* ── Card heading ── */}
        <h2 className="text-sm sm:text-base font-semibold mb-0.5">
          {authMode === "signup" ? "Create your workspace" : "Welcome back"}
        </h2>
        <p className="text-[11px] text-gray-400 mb-4">
          {authMode === "signup"
            ? "Start your free 14-day trial. No credit card needed."
            : "Sign in to view your deals, tasks, and pipeline."}
        </p>

        {/* ── FORM FIELDS ── */}
        <div className="space-y-3 text-[11px] sm:text-xs">

          {/* Company name — signup only */}
          {authMode === "signup" && (
            <Field label="Company name" error={fieldErrors.companyName}>
              <Input
                type="text"
                placeholder="Acme Inc."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                hasError={!!fieldErrors.companyName}
              />
            </Field>
          )}

          {/* Work email */}
          <Field label="Work email" error={fieldErrors.email}>
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              hasError={!!fieldErrors.email}
            />
          </Field>

          {/* Password */}
          <Field label="Password" error={fieldErrors.password}>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hasError={!!fieldErrors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500
                  hover:text-gray-300 transition text-[11px]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {/* Strength bar — signup only */}
            {authMode === "signup" && <PasswordStrengthBar password={password} />}
          </Field>

          {/* Confirm password — signup only */}
          {authMode === "signup" && (
            <Field label="Confirm password" error={fieldErrors.confirmPassword}>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={handleConfirmBlur}
                  hasError={!!fieldErrors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500
                    hover:text-gray-300 transition text-[11px]"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {/* Match indicator */}
              {password && confirmPassword && (
                <p className={`text-[10px] mt-1 ${passwordsMatch ? "text-emerald-400" : "text-red-400"}`}>
                  {passwordsMatch ? "✓ Passwords match" : "✕ Passwords do not match"}
                </p>
              )}
            </Field>
          )}

          {/* ── Forgot password — login only ─────────────────────────────
              Triggers OTP recovery flow:
                POST /api/v1/auth/forgot-password  { email }
                POST /api/v1/auth/verify-otp       { email, otp }
                POST /api/v1/auth/reset-password   { email, newPassword }
              Currently shows an info toast — wire to a modal/page when ready.
          ─────────────────────────────────────────────────────────────── */}
          {authMode === "login" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => showToast("OTP recovery flow coming soon.", "info")}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 transition"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* ── Submit ── */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`w-full mt-1 rounded-lg text-xs sm:text-sm font-semibold py-2.5 transition
              flex items-center justify-center gap-2
              ${isSubmitting
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : `bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500
                   text-slate-900 shadow-md shadow-cyan-500/40 hover:brightness-110 cursor-pointer`
              }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {authMode === "signup" ? "Creating workspace…" : "Signing in…"}
              </>
            ) : authMode === "signup" ? (
              "Create workspace →"
            ) : (
              "Sign in →"
            )}
          </button>
        </div>

        {/* ── Legal ── */}
        <p className="mt-3 text-[10px] text-gray-500">
          By continuing, you agree to our{" "}
          <span
            className="text-cyan-300 cursor-pointer hover:underline"
            onClick={() => showToast("Terms of Service apply.", "info")}
          >
            Terms
          </span>{" "}
          and{" "}
          <span
            className="text-cyan-300 cursor-pointer hover:underline"
            onClick={() => showToast("Your data is never sold.", "info")}
          >
            Privacy Policy
          </span>.
        </p>
      </div>
    </div>
  );
}
