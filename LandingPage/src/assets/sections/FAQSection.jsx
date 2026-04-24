// ─── sections/FAQSection.jsx ─────────────────────────────────────────────────
// Accordion FAQ — one item open at a time.
// No props — state is self-contained.

import { useState } from "react";
import { FAQS } from "../data";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => setOpenIdx(prev => (prev === idx ? null : idx));

  return (
    <section id="faq" className="py-14 border-t border-white/5">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-[11px] font-bold uppercase tracking-widest text-purple-400/60 mb-3">
          FAQ
        </p>
        <h2 className="lp-display text-2xl sm:text-3xl font-bold text-white">
          Questions answered.
        </h2>
      </div>

      {/* Accordion */}
      <div className="max-w-2xl mx-auto space-y-3">
        {FAQS.map((item, idx) => {
          const open = openIdx === idx;
          return (
            <div
              key={idx}
              onClick={() => toggle(idx)}
              className="glass-card rounded-2xl p-4 cursor-pointer transition-all duration-200 lp-card-hover"
              style={{
                borderColor: open ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)",
              }}
            >
              {/* Question row */}
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-white/80">{item.q}</p>
                <span
                  className={`text-white/30 text-lg font-light flex-shrink-0 transition-transform duration-200 ${
                    open ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </div>

              {/* Answer */}
              {open && (
                <p className="mt-3 text-xs text-white/40 leading-relaxed anim-slide-up">
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
