/**
 * HeroSection.jsx — CURIEM CRM Landing
 * ─────────────────────────────────────────────────────────────────
 * Full-width hero: marketing copy on the left, AuthCard on the right.
 *
 * Props:
 *   onFocusAuth   {(mode) => void}  — Scrolls + highlights auth card
 *   authCardRef   {React.Ref}       — Forwarded to AuthCard for scroll
 *   authHighlight {boolean}
 *   shake         {boolean}
 *   authMode      {"signup"|"login"}
 *   setAuthMode   {(mode) => void}
 *   onSubmit      {() => Promise<void>}
 *   isSubmitting  {boolean}
 *   showToast     {(msg, type) => void}
 *
 *   — Form field pass-throughs (all from parent state) —
 *   companyName, setCompanyName, email, setEmail,
 *   password, setPassword, confirmPassword, setConfirmPassword,
 *   fieldErrors, setFieldErrors
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import AuthCard from "./AuthCard";

const STATS = [
  { value: "+24%", label: "faster response time" },
  { value: "+18%", label: "more closed deals" },
  { value: "14-day", label: "free trial, no card" },
  { value: "300%", label: "lead conversion lift" },
];

export default function HeroSection({
  onFocusAuth,
  authCardRef,
  authHighlight,
  shake,
  authMode, setAuthMode,
  onSubmit, isSubmitting, showToast,
  companyName, setCompanyName,
  email, setEmail,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  fieldErrors, setFieldErrors,
}) {
  return (
    <section className="pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24
      flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

      {/* ── Left: copy ── */}
      <div className="flex-1">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30
          bg-cyan-500/5 px-3 py-1 text-[11px] sm:text-xs text-cyan-200 mb-4">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live pipeline · Smart tasks · Real-time sales health.
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug font-semibold tracking-tight text-white">
          Subscription CRM
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
            built for growing SaaS teams.
          </span>
        </h1>

        <p className="mt-4 text-xs sm:text-sm md:text-base text-gray-300 max-w-xl leading-relaxed">
          Track leads, automate follow-ups, and get a clear view of your recurring
          revenue — all in one fast CRM designed for subscription businesses.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onFocusAuth("signup")}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500
              text-black text-xs sm:text-sm font-semibold shadow-md shadow-cyan-500/40
              hover:brightness-110 transition cursor-pointer"
          >
            Get started free →
          </button>
          <button className="px-4 py-2.5 rounded-full border border-gray-600 text-xs sm:text-sm
            text-gray-200 hover:border-cyan-400 hover:text-cyan-300 transition flex items-center gap-2">
            <span className="text-[10px]">▶</span> Watch 3-min overview
          </button>
        </div>

        {/* Social proof stats */}
        <div className="mt-8 flex flex-wrap gap-6 text-[11px] sm:text-xs text-gray-400">
          {STATS.map((s) => (
            <div key={s.label}>
              <span className="font-semibold text-gray-100 text-sm">{s.value}</span>{" "}
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Auth card ── */}
      <AuthCard
        authCardRef={authCardRef}
        authHighlight={authHighlight}
        shake={shake}
        authMode={authMode}
        setAuthMode={setAuthMode}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        showToast={showToast}
        companyName={companyName} setCompanyName={setCompanyName}
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
        fieldErrors={fieldErrors} setFieldErrors={setFieldErrors}
      />
    </section>
  );
}
