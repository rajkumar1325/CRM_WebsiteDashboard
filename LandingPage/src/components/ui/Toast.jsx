/**
 * Toast.jsx — CURIEM CRM
 * ─────────────────────────────────────────────────────────────────
 * Reusable toast / snackbar notification.
 * Auto-dismisses after 4 seconds. Can also be closed manually.
 *
 * Props:
 *   message   {string}                     — Text to display
 *   type      {"success" | "error" | "info"} — Visual variant
 *   onDismiss {() => void}                 — Called on auto or manual close
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useEffect } from "react";

const COLOR_MAP = {
  success: "border-emerald-500/40 bg-emerald-900/30 text-emerald-300",
  error:   "border-red-500/40    bg-red-900/30    text-red-300",
  info:    "border-cyan-500/40   bg-cyan-900/30   text-cyan-300",
};

const ICON_MAP = {
  success: "✓",
  error:   "✕",
  info:    "ℹ",
};

export default function Toast({ message, type = "info", onDismiss }) {
  /* Auto-dismiss after 4 s */
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-xs border rounded-xl px-4 py-3
        text-xs font-medium shadow-xl backdrop-blur-md animate-fade
        ${COLOR_MAP[type]}`}
    >
      <div className="flex items-start gap-2">
        <span>{ICON_MAP[type]}</span>
        <span>{message}</span>
        <button
          onClick={onDismiss}
          className="ml-auto opacity-60 hover:opacity-100 text-xs"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
