// ─── sections/Navbar.jsx ──────────────────────────────────────────────────────
// Top navigation bar.
// Props: onLogin, onStartFree  (both scroll to auth card + set mode)

import { NAV_LINKS } from "../data";

export default function Navbar({ onLogin, onStartFree }) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between py-4 border-b border-white/5 transition-all duration-300">

      {/* Logo + name */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold text-white lp-btn-primary shadow-lg shadow-cyan-500/20">
          CC
        </div>
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="lp-display font-bold text-sm text-white">CuriumCRM</span>
          <span className="text-[10px] text-white/35 tracking-wide">Projects · Clients · People</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="group relative text-xs font-medium tracking-wide text-white/50 hover:text-white transition-colors duration-200"
          >
            {label}
            {/* Animated underline */}
            <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px
              bg-linear-to-r from-cyan-400 to-purple-500 transition-all duration-300" />
          </a>
        ))}
      </nav>

      {/* CTA buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onLogin}
          className="px-4 py-2 rounded-full text-xs font-medium text-white/70 border border-white/10 hover:border-white/25 hover:text-white transition-all duration-200"
        >
          Login
        </button>
        <button
          onClick={onStartFree}
          className="px-4 py-2 rounded-full text-xs font-semibold text-black lp-btn-primary shadow-lg shadow-cyan-500/20"
        >
          Start free
        </button>
      </div>
    </header>
  );
}
