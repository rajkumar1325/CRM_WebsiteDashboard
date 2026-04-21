/**
 * CtaBanner.jsx — CURIEM CRM Landing
 * ─────────────────────────────────────────────────────────────────
 * Full-width call-to-action banner above the footer.
 *
 * Props:
 *   onFocusAuth {(mode) => void} — Scrolls + highlights auth card
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";

export default function CtaBanner({ onFocusAuth }) {
  return (
    <section className="py-10 sm:py-14 border-t border-gray-800/70">
      <div className="rounded-2xl bg-gradient-to-r from-cyan-900/30 via-indigo-900/30 to-purple-900/30
        border border-indigo-500/20 p-8 text-center">
        <h2 className="text-lg sm:text-2xl font-semibold mb-2">
          Ready to close more deals?
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mb-6">
          Join hundreds of SaaS teams already using CuriumCRM. No credit card needed.
        </p>
        <button
          onClick={() => onFocusAuth("signup")}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500
            text-black font-semibold text-sm shadow-lg shadow-cyan-500/30
            hover:brightness-110 transition cursor-pointer"
        >
          Start your free 14-day trial →
        </button>
      </div>
    </section>
  );
}
