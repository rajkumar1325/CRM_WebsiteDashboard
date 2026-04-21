/**
 * Navbar.jsx — CURIEM CRM Landing
 * ─────────────────────────────────────────────────────────────────
 * Sticky top navigation bar.
 * Becomes opaque + blurred when the user scrolls past 40 px.
 *
 * Props:
 *   navScrolled   {boolean}          — True when page.scrollY > 40
 *   authMode      {"signup"|"login"} — Which tab is currently active
 *   onFocusAuth   {(mode) => void}   — Scrolls + highlights the auth card
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";

const NAV_LINKS = ["features", "pricing", "testimonials", "faq"];

export default function Navbar({ navScrolled, authMode, onFocusAuth }) {
  return (
    <header
      className={`sticky top-2 z-40 flex items-center justify-between py-4 transition-all duration-300 ${
        navScrolled
          ? "backdrop-blur-md bg-[#050816]/80 border-b border-gray-800/60 shadow-md shadow-black/30"
          : ""
      }`}
    >
      {/* ── Logo + brand ── */}
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-2xl bg-linear-to-br from-cyan-400 via-indigo-500 to-purple-500
          flex items-center justify-center shadow-lg shadow-cyan-500/40 font-bold text-black text-sm">
          CC
        </div>
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="font-semibold text-sm sm:text-base tracking-tight">CuriumCRM</span>
          <span className="text-[10px] text-gray-400">Close more deals, faster.</span>
        </div>
      </div>

      {/* ── Section links ── */}
      <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
        {NAV_LINKS.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="hover:text-white transition capitalize relative group"
          >
            {id}
            {/* Animated underline */}
            <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px
              bg-linear-to-r from-cyan-400 to-purple-500 transition-all duration-300" />
          </a>
        ))}
      </nav>

      {/* ── Auth CTA buttons ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onFocusAuth("login")}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium
            transition cursor-pointer border
            ${authMode === "login"
              ? "bg-linear-to-r from-cyan-400 via-indigo-500 to-purple-500 text-black border-transparent shadow-md shadow-cyan-500/40"
              : "border-gray-600 text-gray-200 hover:border-cyan-400 hover:text-cyan-300"
            }`}
        >
          Login
        </button>
        <button
          onClick={() => onFocusAuth("signup")}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium
            transition cursor-pointer
            ${authMode === "signup"
              ? "bg-linear-to-r from-cyan-400 via-indigo-500 to-purple-500 text-black shadow-md shadow-cyan-500/40"
              : "bg-white text-black hover:opacity-90"
            }`}
        >
          Start free trial
        </button>
      </div>
    </header>
  );
}
