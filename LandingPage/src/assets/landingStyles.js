// ─── landingStyles.js ─────────────────────────────────────────────────────────
// Inject once via <style>{LANDING_CSS}</style> in LandingPage.jsx.
// Edit all global classes, animations, and utility styles here.

export const LANDING_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  * { box-sizing: border-box; }
  body { font-family: 'DM Sans', -apple-system, sans-serif; }

  /* ── Typography ── */
  .lp-display { font-family: 'Syne', sans-serif; }

  /* ── Background glow orbs (fixed, parallax-driven via inline transform) ── */
  .lp-glow-orb-1 {
    position: fixed; top: -200px; left: -200px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .lp-glow-orb-2 {
    position: fixed; bottom: -200px; right: -150px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  /* ── Keyframes ── */
  @keyframes float-a {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-18px) rotate(3deg); }
  }
  @keyframes float-b {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-12px); }
  }
  @keyframes pulse-ring {
    0%,100% { opacity: 0.3; transform: scale(1); }
    50%     { opacity: 0.8; transform: scale(1.05); }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in-scale {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60% { transform: translateX(-5px); }
    40%,80% { transform: translateX(5px); }
  }
  @keyframes gradient-x {
    0%,100% { background-position: 0% 50%; }
    50%     { background-position: 100% 50%; }
  }

  /* ── Animation utility classes ── */
  .anim-float-a   { animation: float-a 8s ease-in-out infinite; }
  .anim-float-b   { animation: float-b 11s ease-in-out infinite; }
  .anim-slide-up  { animation: slide-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
  .anim-fade-scale { animation: fade-in-scale 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .anim-shake     { animation: shake 0.4s ease; }

  /* ── Card hover lift ── */
  .lp-card-hover {
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .lp-card-hover:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.4);
  }

  /* ── Gradient text ── */
  .gradient-text {
    background: linear-gradient(135deg, #22d3ee, #818cf8, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Animated primary button ── */
  .lp-btn-primary {
    background: linear-gradient(135deg, #22d3ee 0%, #6366f1 50%, #a78bfa 100%);
    background-size: 200% 200%;
    animation: gradient-x 4s ease infinite;
    transition: filter 0.2s, transform 0.15s;
  }
  .lp-btn-primary:hover  { filter: brightness(1.1); transform: scale(1.02); }
  .lp-btn-primary:active { transform: scale(0.98); }

  /* ── Glass card utility ── */
  .glass-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  /* ── Feature tab ── */
  .feature-tab { transition: all 0.2s ease; cursor: pointer; }
  .feature-tab:hover  { background: rgba(255,255,255,0.05); }
  .feature-tab.active {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.15) !important;
  }

  /* ── Custom scrollbar ── */
  ::-webkit-scrollbar       { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
`;
