/**
 * authValidation.js — CURIEM CRM
 * ─────────────────────────────────────────────────────────────────
 * Pure utility functions for auth form validation and password
 * strength scoring. No React dependencies — safe to unit-test.
 * ─────────────────────────────────────────────────────────────────
 */

/**
 * getPasswordStrength
 *
 * Scores a password on 4 axes:
 *   1. Length ≥ 8
 *   2. Contains at least one uppercase letter
 *   3. Contains at least one digit
 *   4. Contains at least one special character
 *
 * @param {string} pwd
 * @returns {number} score 0–4
 */
export function getPasswordStrength(pwd) {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8)            score++;
  if (/[A-Z]/.test(pwd))          score++;
  if (/[0-9]/.test(pwd))          score++;
  if (/[^A-Za-z0-9]/.test(pwd))   score++;
  return score;
}

/**
 * validateForm
 *
 * Validates signup or login form fields.
 * Returns a flat object of { fieldName: errorString }.
 * Empty object means the form is valid.
 *
 * Signup rules:
 *   - companyName  : required, non-empty
 *   - email        : must match basic RFC-ish pattern
 *   - password     : strength score ≥ 2 (Fair or better)
 *   - confirmPassword : must match password
 *
 * Login rules:
 *   - email        : must match basic RFC-ish pattern
 *   - password     : non-empty (no strength check — just auth)
 *
 * @param {{ companyName?: string, email?: string, password?: string, confirmPassword?: string }} fields
 * @param {"signup" | "login"} mode
 * @returns {Record<string, string>} errors
 */
export function validateForm(fields, mode) {
  const errors = {};
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (mode === "signup" && !fields.companyName?.trim()) {
    errors.companyName = "Company name is required.";
  }

  if (!emailRe.test(fields.email || "")) {
    errors.email = "Enter a valid work email.";
  }

  if (!fields.password) {
    errors.password = "Password is required.";
  } else if (mode === "signup" && getPasswordStrength(fields.password) < 2) {
    errors.password = "Password is too weak. Add uppercase, numbers, or symbols.";
  }

  if (mode === "signup" && fields.password !== fields.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}
