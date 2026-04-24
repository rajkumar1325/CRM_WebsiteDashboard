// ─── sections/CTASection.jsx ─────────────────────────────────────────────────
// Final call-to-action strip before the footer.
// Props: onStartFree — scrolls to auth card in signup mode

export default function CTASection({ onStartFree }) {
  return (
    <section className="py-14 border-t border-white/5 text-center">
      <div
        className="max-w-7xl mx-auto glass-card rounded-3xl p-8 sm:p-10"
        style={{ borderColor: "rgba(99,102,241,0.2)" }}
      >
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/5 px-3 py-1.5 text-[11px] text-cyan-300 mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Free for 14 days · No credit card
        </div>

        {/* Headline */}
        <h2 className="lp-display text-2xl sm:text-3xl font-bold text-white mb-3">
          Ready to connect your<br className="hidden sm:block" /> team's workflow?
        </h2>

        {/* Subtext */}
        <p className="text-sm text-white/40 mb-6">
          One system for every client, project, and task. Set up in minutes.
        </p>

        {/* CTA button */}
        <button
          onClick={onStartFree}
          className="px-8 py-3.5 rounded-full text-sm font-bold text-black lp-btn-primary shadow-xl shadow-cyan-500/20"
        >
          Start free trial →
        </button>
      </div>
    </section>
  );
}
