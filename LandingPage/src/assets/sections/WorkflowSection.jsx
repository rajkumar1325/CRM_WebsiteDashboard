// ─── sections/WorkflowSection.jsx ────────────────────────────────────────────
// Visualises the Client → Project → Task → Scheduler → Calendar → Dashboard chain.
// No props needed — fully driven by data.js.

import WorkflowStep from "../shared/WorkflowStep";
import { WORKFLOW_STEPS, WORKFLOW_HIGHLIGHTS } from "../data";

export default function WorkflowSection() {
  return (
    <section id="workflow" className="py-14 border-t border-white/5">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-[11px] font-bold uppercase tracking-widest text-cyan-400/60 mb-3">
          How it flows
        </p>
        <h2 className="lp-display text-2xl sm:text-3xl font-bold text-white">
          Everything is connected.
        </h2>
        <p className="text-sm text-white/35 mt-2 max-w-md mx-auto">
          From the moment a client is onboarded to the last task being closed — one unbroken chain.
        </p>
      </div>

      {/* Step chain — horizontally scrollable on mobile */}
      <div className="relative overflow-x-auto pb-4">
        <div className="flex items-start justify-center gap-4 min-w-max mx-auto px-4">
          {WORKFLOW_STEPS.map((step, i) => (
            <WorkflowStep
              key={i}
              icon={<span style={{ fontSize: 20 }}>{step.emoji}</span>}
              label={step.label}
              sub={step.sub}
              color={step.color}
              index={i}
              total={WORKFLOW_STEPS.length}
            />
          ))}
        </div>
      </div>

      {/* Highlight cards */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {WORKFLOW_HIGHLIGHTS.map((item, i) => (
          <div
            key={i}
            className="glass-card rounded-2xl p-4 flex items-center gap-4 lp-card-hover"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: item.color }}>
                {item.label}
              </p>
              <p className="text-sm font-semibold text-white/80 mt-0.5">{item.val}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
