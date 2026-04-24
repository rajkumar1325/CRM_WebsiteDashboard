// ─── sections/TestimonialsSection.jsx ────────────────────────────────────────
// Auto-sliding testimonial carousel with prev/next controls.
// No props — state is fully self-contained.

import { useState, useEffect } from "react";
import { Icon } from "../shared/Icons";
import { TESTIMONIALS } from "../data";

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  // Auto-advance every 4.5 seconds
  useEffect(() => {
    const t = setInterval(() => setIndex(p => (p + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, [index]);

  const prev = () => setIndex(p => (p === 0 ? TESTIMONIALS.length - 1 : p - 1));
  const next = () => setIndex(p => (p + 1) % TESTIMONIALS.length);

  const current = TESTIMONIALS[index];

  return (
    <section id="testimonials" className="py-14 border-t border-white/5">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400/60 mb-3">
          Customer stories
        </p>
        <h2 className="lp-display text-2xl sm:text-3xl font-bold text-white">
          Teams love the clarity.
        </h2>
      </div>

      {/* Card — key forces re-mount animation on slide change */}
      <div key={index} className="max-w-7xl mx-auto glass-card rounded-2xl p-6 sm:p-8 anim-fade-scale">

        {/* Author row */}
        <div className="flex items-center gap-4 mb-5">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold"
            style={{
              background: `hsl(${current.hue},60%,22%)`,
              color:       `hsl(${current.hue},80%,70%)`,
              border:      `1.5px solid hsl(${current.hue},60%,32%)`,
            }}
          >
            {current.initials}
          </div>

            {/* name + role section  */}
          <div>
            <p className="font-bold text-white text-sm">{current.name}</p>
            <p className="text-xs text-white/35">{current.role}</p>
          </div>

          {/* number of starts */}
          {/* Dynamic Star Rating */}
          <div className="ml-auto flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span 
                key={i} 
                className={`text-sm ${i < current.rating ? "text-amber-500" : "text-gray-600"}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Quote */}
        <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-6">
          "{current.text}"
        </p>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          {/* Dot indicators */}
          <div className="flex gap-1.5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === index ? "w-6 h-2 bg-cyan-400" : "w-2 h-2 bg-white/15 hover:bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Prev / Next arrows */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-all"
            >
              <Icon.ArrowLeft />
            </button>
            <button
              onClick={next}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-all"
            >
              <Icon.ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
