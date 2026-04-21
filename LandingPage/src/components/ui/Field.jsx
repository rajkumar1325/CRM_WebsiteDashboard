/**
 * Field.jsx — CURIEM CRM
 * ─────────────────────────────────────────────────────────────────
 * Form field wrapper that renders a label, the field content
 * (passed as children), and an optional error message below.
 *
 * Props:
 *   label    {string}         — Field label text
 *   error    {string | null}  — Validation error message (or falsy)
 *   children {ReactNode}      — The input / select / etc.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";

export default function Field({ label, error, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-gray-300 text-[11px] sm:text-xs">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[10px] text-red-400">{error}</p>
      )}
    </div>
  );
}
