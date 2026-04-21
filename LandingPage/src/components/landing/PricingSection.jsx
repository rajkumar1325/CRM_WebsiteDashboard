/**
 * PricingSection.jsx — CURIEM CRM Landing
 * ─────────────────────────────────────────────────────────────────
 * Three-tier pricing cards with a plan toggler.
 *
 * Props:
 *   onFocusAuth {(mode) => void} — Scrolls to auth card on CTA click
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState } from "react";
import { PLANS } from "../../data/landingMockData";

export default function PricingSection({ onFocusAuth }) {
  const [selectedPlan, setSelectedPlan] = useState("Growth");

  return (
    <section id="pricing" className="py-10 sm:py-14 border-t border-gray-800/70">
      <div className="text-center mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
          Simple, transparent pricing.
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-2">
          Start free, upgrade only when your team is ready.
        </p>
      </div>

      {/* ── Plan toggler ── */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-800/60 rounded-full p-1 text-xs sm:text-sm
          shadow-inner border border-gray-700">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`px-4 py-1.5 rounded-full transition-all font-medium
                ${selectedPlan === plan.id
                  ? "bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 text-black shadow-md"
                  : "text-gray-300 hover:text-white"
                }`}
            >
              {plan.id}
            </button>
          ))}
        </div>
      </div>

      {/* ── Plan cards ── */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`rounded-2xl border bg-[#050b17]/90 p-5 flex flex-col
              cursor-pointer transition-all duration-300
              ${selectedPlan === plan.id
                ? "border-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.03]"
                : "border-gray-800 hover:border-gray-600"
              }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm sm:text-base font-semibold">{plan.id}</h3>
              {plan.popular && (
                <span className="text-[10px] px-2 py-0.5 rounded-full
                  bg-cyan-500/20 text-cyan-300 border border-cyan-400/60">
                  Most popular
                </span>
              )}
            </div>

            <p className="text-xs text-gray-400 mb-3">{plan.desc}</p>

            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-xl sm:text-2xl font-semibold">{plan.price}</span>
              {plan.sub && (
                <span className="text-[11px] text-gray-400">{plan.sub}</span>
              )}
            </div>

            <ul className="text-[11px] text-gray-400 space-y-1.5 mb-4 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>

            <button
              onClick={(e) => { e.stopPropagation(); onFocusAuth("signup"); }}
              className="mt-auto w-full rounded-full border border-gray-600 text-xs sm:text-sm
                py-2 hover:border-cyan-400 hover:text-cyan-300 transition cursor-pointer"
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
