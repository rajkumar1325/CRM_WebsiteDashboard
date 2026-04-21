/**
 * Footer.jsx — CURIEM CRM Landing
 * ─────────────────────────────────────────────────────────────────
 * Simple footer with brand mark and policy / nav links.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";

const FOOTER_LINKS = ["Privacy", "Terms", "Docs", "Status", "GitHub"];

export default function Footer() {
  return (
    <footer className="py-6 border-t border-gray-800/70 text-[11px] sm:text-xs text-gray-500">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-500
            flex items-center justify-center text-black font-bold text-[10px]">
            CC
          </div>
          <p>© {new Date().getFullYear()} CuriumCRM. All rights reserved.</p>
        </div>

        {/* Links */}
        <div className="flex gap-5">
          {FOOTER_LINKS.map((link) => (
            <a key={link} href="#!" className="hover:text-gray-300 transition">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
