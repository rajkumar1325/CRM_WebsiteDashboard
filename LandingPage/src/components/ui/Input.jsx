/**
 * Input.jsx — CURIEM CRM
 * ─────────────────────────────────────────────────────────────────
 * Styled text / password / email input.
 * Forwards all native <input> props.
 *
 * Extra props:
 *   hasError {boolean} — When true, renders red border + focus ring
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";

export default function Input({ hasError = false, className = "", ...props }) {
  return (
    <input
      className={`
        w-full rounded-lg bg-[#050816] border px-3 py-2
        text-xs sm:text-sm text-gray-100
        outline-none focus:ring-1 transition
        ${
          hasError
            ? "border-red-500 focus:ring-red-500/40"
            : "border-gray-700 focus:border-cyan-400 focus:ring-cyan-400/20"
        }
        ${className}
      `}
      {...props}
    />
  );
}
