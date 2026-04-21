/**
 * PasswordStrengthBar.jsx — CURIEM CRM
 * ─────────────────────────────────────────────────────────────────
 * Visual password-strength indicator rendered below the password
 * field during signup. Returns null when the field is empty.
 *
 * Props:
 *   password {string} — Current value of the password field
 *
 * Strength is calculated by getPasswordStrength() from authValidation:
 *   1 pt — length ≥ 8
 *   1 pt — contains uppercase
 *   1 pt — contains digit
 *   1 pt — contains special character
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { getPasswordStrength } from "../../utils/authValidation";
import { PWD_LEVELS } from "../../data/landingMockData";

export default function PasswordStrengthBar({ password }) {
  const score = getPasswordStrength(password);

  if (!password) return null;

  /* Clamp to valid index (score 1-4 → index 0-3) */
  const level = PWD_LEVELS[Math.min(score - 1, 3)] || PWD_LEVELS[0];

  return (
    <div className="mt-1.5">
      {/* Four-segment bar */}
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              score >= s ? level.color : "bg-gray-700"
            }`}
          />
        ))}
      </div>
      {/* Strength label */}
      <p className={`text-[10px] ${level.color}`}>{level.label} password</p>
    </div>
  );
}
