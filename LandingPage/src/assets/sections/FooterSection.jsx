// ─── sections/FooterSection.jsx ──────────────────────────────────────────────
// Simple footer with logo, copyright, and links.
// No props needed.

const FOOTER_LINKS = ["Privacy", "Terms", "Docs", "Status"];

export default function FooterSection() {
  return (
    <footer className="py-8 border-t border-white/5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-black lp-btn-primary">
            CC
          </div>
          <span className="lp-display text-sm font-bold text-white/60">CuriumCRM</span>
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-white/20">
          © {new Date().getFullYear()} CuriumCRM. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex gap-5 text-[11px] text-white/30">
          {FOOTER_LINKS.map(link => (
            <a key={link} href="#!" className="hover:text-white/70 transition-colors">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
