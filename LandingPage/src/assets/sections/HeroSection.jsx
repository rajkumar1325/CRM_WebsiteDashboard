// ─── sections/HeroSection.jsx ─────────────────────────────────────────────────
// Full hero: left copy + right auth card (role select, signup/login form).
// Props:
//   authCardRef     — ref forwarded from LandingPage for scroll-to
//   authHighlight   — boolean, triggers zoom ring animation
//   authMode        — "signup" | "login"
//   setAuthMode
//   selectedRole    — "admin" | "employee" | "customer" | null
//   setSelectedRole
//   formData        — { company, email, phone, city, password, confirmPassword }
//   setFormData
//   shake           — boolean
//   showPw          — boolean
//   setShowPw
//   passwordMatch   — boolean
//   triggerShake
//   focusAuthCard
//   onSubmit        — async function called with { role, ...formData }

import { Icon } from "../shared/Icons";


const ROLES = [
  {
    key: "admin",
    label: "Admin",
    color: "#f87171",
    tip: "Full org access, users & billing",
    loginEndpoint: "/api/auth/login",
    signupEndpoint: "/api/auth/register",
  },
  {
    key: "employee",
    label: "Employee",
    color: "#fbbf24",
    tip: "Team tasks, inquiries & sales",
    loginEndpoint: "/api/auth/login",
    signupEndpoint: "/api/auth/signup",
  },
  {
    key: "customer",
    label: "Customer",
    color: "#34d399",
    tip: "Browse courses, inquiries & feedback",
    loginEndpoint: "/api/auth/login",
    signupEndpoint: "/api/auth/signup",
  },
];



export default function HeroSection({
  authCardRef,
  authHighlight,
  authMode, setAuthMode,
  selectedRole, setSelectedRole,
  formData, setFormData,
  shake,
  showPw, setShowPw,
  passwordMatch,
  triggerShake,
  focusAuthCard,
  onSubmit,
}) {
  const role = ROLES.find(r => r.key === selectedRole);

  // ── Phone validation ───────────────────────────────────────────────────────
  const phoneRaw    = formData?.phone ?? "";
  // Strip leading +91 or 0 prefix for digit counting
  const phoneDigits = phoneRaw.replace(/^\+91[\s-]?/, "").replace(/^0/, "").replace(/\D/g, "");

  const phoneErrors = (() => {
    if (!phoneRaw) return [];                                          // untouched — no errors yet
    const errors = [];
    if (/[a-zA-Z]/.test(phoneRaw))      errors.push("No letters allowed");
    if (/[^0-9\s\+\-\(\)]/.test(phoneRaw)) errors.push("Special characters not allowed");
    if (phoneDigits.length > 0 && phoneDigits.length < 10) errors.push(`${10 - phoneDigits.length} more digit(s) needed`);
    if (phoneDigits.length > 10)        errors.push("Too many digits (max 10)");
    return errors;
  })();

  const phoneValid  = phoneRaw.length > 0 && phoneErrors.length === 0 && phoneDigits.length === 10;
  const phoneTouched = phoneRaw.length > 0;

  // Controlled phone onChange — blocks alphabets on the fly
  const handlePhoneChange = (e) => {
    const val = e.target.value;
    // Block any alphabet character from being typed at all
    if (/[a-zA-Z]/.test(val)) return;
    setFormData(prev => ({ ...prev, phone: val }));
  };

  // Convenience updater
  const field = (key) => ({
    value: formData?.[key] ?? "",
    onChange: e => setFormData(prev => ({ ...prev, [key]: e.target.value })),
  });

  const handleSubmit = () => {
    if (!selectedRole) {
      alert("Please select a role first.");
      return;
    }
    if (authMode === "signup" && !phoneValid) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    if (authMode === "signup" && !passwordMatch) {
      triggerShake();
      return;
    }
    const endpoint = authMode === "signup" ? role.signupEndpoint : role.loginEndpoint;
    onSubmit?.({ ...formData, role: selectedRole, endpoint });
  };

  return (
    <section
      className="min-h-screen pt-16 pb-20 lg:pt-20 lg:pb-28 flex flex-col lg:flex-row items-start gap-12 lg:gap-16"
      style={{ minHeight: "calc(100vh - 73px)" }}
    >

      {/* ── LEFT: Copy ── */}
      <div className="flex-1 anim-slide-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/5 px-3 py-1.5 text-[11px] text-cyan-300 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ animation: "pulse-ring 2s ease-in-out infinite" }} />
          The only CRM that connects Clients, Projects &amp; Tasks
        </div>

        {/* Headline */}
        <h1 className="lp-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight text-white mb-5">
          Manage clients,<br />
          <span className="gradient-text">projects &amp; tasks</span><br />
          in one system.
        </h1>

        {/* Subtext */}
        <p className="text-sm sm:text-base text-white/50 max-w-lg leading-relaxed mb-8">
          CuriumCRM bridges the gap between client relationships and project delivery.
          Role-based dashboards, automated deadline tracking, and a shared event
          calendar — built for teams that build things.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <button
            onClick={() => { setAuthMode("signup"); focusAuthCard(); }}
            className="px-6 py-3 rounded-full text-sm font-semibold text-black lp-btn-primary shadow-lg shadow-cyan-500/25 flex items-center gap-2"
          >
            Start free — 14 days <Icon.ChevronRight />
          </button>
          <button className="px-6 py-3 rounded-full text-sm font-medium text-white/60 border border-white/10 hover:border-white/25 hover:text-white transition-all duration-200 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
              <Icon.Play />
            </span>
            Watch 2-min demo
          </button>
        </div>

        {/* Micro stats */}
        <div className="flex flex-wrap gap-6 text-xs text-white/35">
          <div>
            <span className="font-semibold text-white/70">Client → Project → Task</span>
            <br />fully linked
          </div>
          <div>
            <span className="font-semibold text-white/70">3 role dashboards</span>
            <br />Admin · Employee · Customer
          </div>
          <div>
            <span className="font-semibold text-white/70">Auto deadline</span>
            <br />tracking via scheduler
          </div>
        </div>
      </div>


      {/* ── RIGHT: Auth Card ── */}
      <div
        ref={authCardRef}
        className={`w-full max-w-sm lg:shrink-0 anim-fade-scale transition-all duration-500 ${
          authHighlight ? "scale-[1.03] ring-2 ring-cyan-400/40 shadow-2xl shadow-cyan-500/20" : ""
        }`}
        style={{ animationDelay: "0.2s" }}
      >
        <div className="rounded-2xl glass-card shadow-2xl shadow-black/40 overflow-hidden">
          {/* Gradient accent bar */}
          <div className="h-0.5 w-full lp-btn-primary" />

          <div className="p-5">
            {/* Role selector */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">
              I am a…
            </p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {ROLES.map(({ key, label, color, tip }) => (
                <div
                  key={key}
                  onClick={() => setSelectedRole(key)}
                  title={tip}
                  className="cursor-pointer p-3 rounded-xl border text-center transition-all duration-200"
                  style={{
                    borderColor: selectedRole === key ? color : "rgba(255,255,255,0.07)",
                    background:  selectedRole === key ? `${color}12` : "transparent",
                    boxShadow:   selectedRole === key ? `0 0 18px ${color}20` : "none",
                  }}
                >
                  <span className="text-xs font-semibold" style={{ color: selectedRole === key ? color : "rgba(255,255,255,0.5)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Role hint — shows which endpoint will be called */}
            {selectedRole && (
              <p className="text-[10px] text-white/25 mb-3 -mt-2">
                {authMode === "login"
                  ? `→ ${role?.loginEndpoint}`
                  : `→ ${role?.signupEndpoint}`}
              </p>
            )}

            {/* Signup / Login toggle */}
            <div className="flex mb-5 p-1 rounded-full bg-white/5 border border-white/5">
              {["signup", "login"].map(mode => (
                <button
                  key={mode}
                  onClick={() => setAuthMode(mode)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    authMode === mode
                      ? "lp-btn-primary text-black shadow-md"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {mode === "signup" ? "Sign up" : "Login"}
                </button>
              ))}
            </div>

            {/* Form heading */}
            <h2 className="lp-display text-base font-bold text-white mb-1">
              {authMode === "signup" ? "Create your workspace" : "Welcome back"}
            </h2>
            <p className="text-[11px] text-white/35 mb-4">
              {authMode === "signup" ? "14-day trial. No credit card." : "Sign in to your workspace."}
            </p>

            {/* Form fields */}
            <div className="space-y-3">

              {/* Company — signup only, admin/employee */}
              {authMode === "signup" && selectedRole !== "customer" && (
                <div>
                  <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-1.5">Company</label>
                  <input
                    type="text"
                    placeholder="Acme Corp."
                    className="w-full rounded-xl border border-white/8 px-3 py-2.5 text-xs text-white outline-none placeholder-white/20 focus:border-cyan-400/50 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    {...field("company")}
                  />
                </div>
              )}

              {/* Full name — signup only, customer */}
              {authMode === "signup" && selectedRole === "customer" && (
                <div>
                  <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-1.5">Full Name</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-white/8 px-3 py-2.5 text-xs text-white outline-none placeholder-white/20 focus:border-cyan-400/50 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    {...field("name")}
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-1.5">
                  {selectedRole === "customer" ? "Email" : "Work Email"}
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/8 px-3 py-2.5 text-xs text-white outline-none placeholder-white/20 focus:border-cyan-400/50 transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                  {...field("email")}
                />
              </div>

              {/* Phone + City — signup only */}
              {authMode === "signup" && (
                <div className="grid grid-cols-2 gap-2">
                  {/* ── Phone with live validation ── */}
                  <div>
                    <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-1.5">
                      Phone
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="+91 98765..."
                        maxLength={14}
                        value={formData?.phone ?? ""}
                        onChange={handlePhoneChange}
                        className="w-full rounded-xl border px-3 py-2.5 pr-7 text-xs text-white outline-none placeholder-white/20 transition-colors"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          borderColor: !phoneTouched
                            ? "rgba(255,255,255,0.08)"
                            : phoneValid
                              ? "rgba(52,211,153,0.5)"   // green
                              : "rgba(248,113,113,0.6)",  // red
                        }}
                      />
                      {/* Status icon inside input */}
                      {phoneTouched && (
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px]">
                          {phoneValid ? "✓" : "✗"}
                        </span>
                      )}
                    </div>

                    {/* Digit counter */}
                    {phoneTouched && (
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-[9px] font-medium ${phoneValid ? "text-emerald-400" : phoneErrors.length ? "text-red-400" : "text-white/30"}`}>
                          {phoneValid
                            ? "✓ Valid number"
                            : phoneErrors[0] ?? ""}
                        </span>
                        <span className={`text-[9px] tabular-nums ${phoneDigits.length === 10 ? "text-emerald-400" : "text-white/25"}`}>
                          {phoneDigits.length}/10
                        </span>
                      </div>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-1.5">City</label>
                    <input
                      type="text"
                      placeholder="Mumbai"
                      className="w-full rounded-xl border border-white/8 px-3 py-2.5 text-xs text-white outline-none placeholder-white/20 focus:border-cyan-400/50 transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                      {...field("city")}
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className={`w-full rounded-xl border px-3 py-2.5 pr-9 text-xs text-white outline-none placeholder-white/20 focus:border-cyan-400/50 transition-colors ${shake ? "anim-shake" : ""}`}
                    style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                    {...field("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(x => !x)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPw ? <Icon.EyeOff /> : <Icon.Eye />}
                  </button>
                </div>
              </div>

              {/* Confirm password — signup only */}
              {authMode === "signup" && (
                <>
                  <div>
                    <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wide mb-1.5">Confirm Password</label>
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      onBlur={() => { if (!passwordMatch && formData?.confirmPassword) triggerShake(); }}
                      className={`w-full rounded-xl border px-3 py-2.5 text-xs text-white outline-none placeholder-white/20 transition-colors ${shake ? "anim-shake" : ""}`}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        borderColor: formData?.confirmPassword && !passwordMatch
                          ? "rgba(248,113,113,0.6)"
                          : "rgba(255,255,255,0.08)",
                      }}
                      {...field("confirmPassword")}
                    />
                  </div>
                  {formData?.password && formData?.confirmPassword && (
                    <p className={`text-[10px] font-medium ${passwordMatch ? "text-emerald-400" : "text-red-400"}`}>
                      {passwordMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </p>
                  )}
                </>
              )}

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={authMode === "signup" && !passwordMatch}
                className={`w-full mt-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  authMode === "login" || passwordMatch
                    ? "lp-btn-primary text-black shadow-lg shadow-cyan-500/25"
                    : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                }`}
              >
                {authMode === "signup" ? "Create workspace" : "Sign in"}
              </button>
            </div>

            {/* Legal */}
            <p className="mt-4 text-[10px] text-white/25 text-center leading-relaxed">
              By continuing, you agree to our{" "}
              <span className="text-cyan-400/70 cursor-pointer hover:text-cyan-300">Terms</span>
              {" "}and{" "}
              <span className="text-cyan-400/70 cursor-pointer hover:text-cyan-300">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}