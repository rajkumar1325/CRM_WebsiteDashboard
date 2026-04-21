/**
 * TestimonialsSection.jsx — CURIEM CRM Landing
 * ─────────────────────────────────────────────────────────────────
 * Auto-advancing testimonial carousel with pause-on-hover.
*/

import React, { useState, useEffect } from "react";
import { TESTIMONIALS } from "../../data/landingMockData";

export default function TestimonialsSection() {
  const [index, setIndex]   = useState(0);
  const [paused, setPaused] = useState(false);


  useEffect(() => {
    if (paused) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4500);

    return () => clearInterval(id);
  }, [paused]); // ← only `paused`, NOT `index`




//   useEffect(() => {
//   console.log("paused:", paused);
// }, [paused]);


// 
useEffect(() => {
  console.log(`[${Date.now()}] index changed to:`, index);
}, [index]);



// useEffect(() => {
//   console.log("paused:", paused, "| index:", index);
// }, [paused, index]);

  const prev = () => setIndex((p) => (p === 0 ? TESTIMONIALS.length - 1 : p - 1));
  const next = () => setIndex((p) => (p + 1) % TESTIMONIALS.length);

  const t = TESTIMONIALS[index];

  return (
    <section
      id="testimonials"
      className="py-10 sm:py-14 border-t border-gray-800/70"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-center mb-6">
        Loved by sales teams.
      </h2>

      <div className="rounded-2xl border border-gray-800 bg-[#050b17]/90 p-5 sm:p-6
        shadow-md shadow-purple-500/10 max-w-4xl mx-auto">

        {/* Slide content — keyed on name so it re-mounts smoothly */}
        {/* <div key={t.name} className="animate-fade"> */}
        <div key={index} className="animate-testimonial">
          {/* Avatar + name */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br
              ${t.color} flex items-center justify-center text-black font-bold text-sm`}>
              {t.initials}
            </div>
            <div>
              <p className="font-semibold text-gray-100 text-sm">{t.name}</p>
              <p className="text-[11px] text-gray-400">{t.role}</p>
            </div>
          </div>

          {/* Quote */}
          <p className="text-xs sm:text-sm text-gray-200 mb-4 leading-relaxed">
            "{t.text}"
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="h-7 w-7 rounded-full border border-gray-700 hover:border-cyan-400
                flex items-center justify-center text-gray-400 hover:text-cyan-300 transition text-xs"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="h-7 w-7 rounded-full border border-gray-700 hover:border-cyan-400
                flex items-center justify-center text-gray-400 hover:text-cyan-300 transition text-xs"
            >
              ›
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex gap-1.5">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === index ? "w-5 bg-cyan-400" : "w-1.5 bg-gray-600 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
