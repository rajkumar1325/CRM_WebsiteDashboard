/**
 * FaqSection.jsx — CURIEM CRM Landing
 * ─────────────────────────────────────────────────────────────────
 * Accordion-style FAQ list.
 * One item can be open at a time; clicking the open item closes it.
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState } from "react";
import { FAQS } from "../../data/landingMockData";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => setOpenIdx((prev) => (prev === idx ? null : idx));

  return (
    <section id="faq" className="py-10 sm:py-14 border-t border-gray-800/70">
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
          Answers to common questions.
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-2">
          Have something else in mind? Reach out anytime.
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-3">
        {FAQS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              onClick={() => toggle(idx)}
              className={`rounded-xl border bg-[#050b17]/90 p-3 sm:p-4 cursor-pointer
                transition-all duration-200
                ${isOpen
                  ? "border-cyan-400/40 shadow-sm shadow-cyan-500/10"
                  : "border-gray-800 hover:border-gray-700"
                }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs sm:text-sm font-medium text-gray-100">
                  {item.q}
                </p>
                <span
                  className={`text-gray-400 text-base transition-transform duration-200 flex-shrink-0
                    ${isOpen ? "rotate-45 text-cyan-400" : ""}`}
                >
                  +
                </span>
              </div>
              {isOpen && (
                <p className="mt-2.5 text-[11px] sm:text-xs text-gray-400 leading-relaxed">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
