import {useEffect, useState, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   CURIEM CRM — Settings.jsx   (Complete · 9 Tabs · Apple Glass Morphism)
   Pure Tailwind · Dark & Light · Prop-drilling from App.jsx
   ───────────────────────────────────────────────────────────────────────
   INTEGRATION (App.jsx):
     import Settings from "./assets/components/Settings/Settings.jsx";

     // Inside <Routes>:
     <Route path="/settings" element={
       <Settings
         isDark={dark}          // boolean — current theme
         setIsDark={setDark}    // fn — to toggle theme globally
         userRole="Admin"       // "Admin" | "Leader" | "Member"
         currentUser={{         // optional: logged-in user object
           name: "Raj Kumar",
           email: "raj@curiumcrm.com",
           phone: "+91 98765 43210",
           initials: "RK",
         }}
       />
     } />

   PROP FLOW:
     App.jsx
       └─ Settings (receives isDark, setIsDark, userRole, currentUser)
            ├─ ProfileTab       (darkMode, userRole, currentUser)
            ├─ SecurityTab      (darkMode)
            ├─ RolesTab         (darkMode)              [Admin only]
            ├─ TeamTab          (darkMode)              [Admin only]
            ├─ WorkspaceTab     (darkMode)              [Admin only]
            ├─ IntegrationsTab  (darkMode)              [Admin only]
            ├─ NotificationsTab (darkMode, userRole)
            ├─ BillingTab       (darkMode)              [Admin only]
            └─ AppearanceTab    (darkMode, setDarkMode)
═══════════════════════════════════════════════════════════════════════════ */

// ─── Primitives ──────────────────────────────────────────────────────────────

const Glass = ({ children, className = "", darkMode }) => (
  <div className={`rounded-2xl border backdrop-blur-xl transition-all duration-300
    ${darkMode
      ? "bg-white/[0.04] border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.05)]"
      : "bg-white/75 border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.95)]"
    } ${className}`}>
    {children}
  </div>
);

const Toggle = ({ on, onChange, darkMode }) => (
  <button onClick={() => onChange(!on)}
    className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none shrink-0
      ${on ? "bg-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.55)]" : darkMode ? "bg-white/10" : "bg-slate-200"}`}>
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300
      ${on ? "translate-x-6" : "translate-x-0"}`} />
  </button>
);

const Input = ({ label, value, onChange, type = "text", placeholder, darkMode, readOnly, hint }) => (
  <div className="flex flex-col gap-1.5">
    <label className={`text-[10px] font-semibold uppercase tracking-widest ${darkMode ? "text-white/30" : "text-slate-400"}`}>{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
      className={`w-full border rounded-xl px-4 py-2.5 text-[13px] outline-none transition-all
        ${darkMode
          ? "bg-white/[0.05] border-white/[0.08] text-white placeholder-white/20 focus:border-blue-500/40 focus:bg-white/[0.08]"
          : "bg-white/80 border-slate-200 text-slate-800 placeholder-slate-300 focus:border-blue-400 focus:bg-white"
        }
        ${readOnly ? "opacity-50 cursor-not-allowed" : ""}`} />
    {hint && <p className={`text-[10px] ${darkMode ? "text-white/20" : "text-slate-400"}`}>{hint}</p>}
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, darkMode, rows = 3 }) => (
  <div className="flex flex-col gap-1.5">
    <label className={`text-[10px] font-semibold uppercase tracking-widest ${darkMode ? "text-white/30" : "text-slate-400"}`}>{label}</label>
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      className={`w-full border rounded-xl px-4 py-2.5 text-[13px] outline-none transition-all resize-none
        ${darkMode
          ? "bg-white/[0.05] border-white/[0.08] text-white placeholder-white/20 focus:border-blue-500/40"
          : "bg-white/80 border-slate-200 text-slate-800 placeholder-slate-300 focus:border-blue-400"
        }`} />
  </div>
);

const Select = ({ label, value, onChange, options, darkMode }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className={`text-[10px] font-semibold uppercase tracking-widest ${darkMode ? "text-white/30" : "text-slate-400"}`}>{label}</label>}
    <select value={value} onChange={onChange}
      className={`w-full border rounded-xl px-4 py-2.5 text-[13px] outline-none transition-all
        ${darkMode
          ? "bg-white/[0.05] border-white/[0.08] text-white focus:border-blue-500/40"
          : "bg-white/80 border-slate-200 text-slate-800 focus:border-blue-400"
        }`}>
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  </div>
);

const SaveBtn = ({ onClick, saved, label = "Save Changes" }) => (
  <button onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300
      ${saved
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_16px_rgba(16,185,129,0.15)]"
        : "bg-blue-500 hover:bg-blue-400 text-white shadow-[0_4px_16px_rgba(59,130,246,0.35)] hover:-translate-y-0.5 active:translate-y-0"
      }`}>
    {saved ? "✓ Saved!" : label}
  </button>
);

const Divider = ({ darkMode }) => (
  <div className={`h-px ${darkMode ? "bg-white/[0.05]" : "bg-slate-100"}`} />
);

const SettingRow = ({ title, desc, darkMode, children, noDivider }) => (
  <div>
    <div className="flex items-center justify-between py-3.5 gap-4">
      <div className="min-w-0">
        <p className={`text-[13px] font-medium ${darkMode ? "text-white/80" : "text-slate-700"}`}>{title}</p>
        {desc && <p className={`text-[11px] mt-0.5 ${darkMode ? "text-white/28" : "text-slate-400"} leading-relaxed`}>{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
    {!noDivider && <Divider darkMode={darkMode} />}
  </div>
);

const SectionHead = ({ icon, title, desc, darkMode, badge }) => (
  <div className="flex items-start gap-4 mb-6">
    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border
      ${darkMode ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600"}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className={`text-[15px] font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-800"}`}>{title}</h2>
        {badge && (
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider
            ${darkMode ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-600"}`}>
            {badge}
          </span>
        )}
      </div>
      <p className={`text-[12px] mt-0.5 ${darkMode ? "text-white/30" : "text-slate-400"}`}>{desc}</p>
    </div>
  </div>
);

const InfoBox = ({ children, darkMode, color = "blue" }) => {
  const colors = {
    blue:  { border: darkMode ? "border-l-blue-500/40"   : "border-l-blue-400",   text: darkMode ? "text-white/35" : "text-slate-500" },
    amber: { border: darkMode ? "border-l-amber-500/40"  : "border-l-amber-400",  text: darkMode ? "text-white/35" : "text-slate-500" },
    rose:  { border: darkMode ? "border-l-rose-500/40"   : "border-l-rose-400",   text: darkMode ? "text-white/35" : "text-slate-500" },
  };
  const c = colors[color];
  return (
    <Glass darkMode={darkMode} className={`p-4 border-l-[3px] ${c.border}`}>
      <p className={`text-[11px] leading-relaxed ${c.text}`}>{children}</p>
    </Glass>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 1 — GENERAL PROFILE
═══════════════════════════════════════════════════════════════════════════ */
function ProfileTab({ darkMode, userRole, currentUser }) {
  const [form, setForm] = useState({
    name:     currentUser?.name     ?? "Raj Kumar",
    email:    currentUser?.email    ?? "raj.kumar@curiumcrm.com",
    phone:    currentUser?.phone    ?? "+91 98765 43210",
    linkedin: currentUser?.linkedin ?? "linkedin.com/in/rajkumar",
    bio:      "",
  });
  const [saved, setSaved] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const fileRef = useRef();
  const d = darkMode;
  const m = d ? "text-white/30" : "text-slate-400";

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleImg = e => {
    const file = e.target.files[0];
    if (file) setImgPreview(URL.createObjectURL(file));
  };

  const roleColors = {
    Admin:  d ? "bg-rose-500/10 border-rose-500/20 text-rose-400"   : "bg-rose-50 border-rose-200 text-rose-600",
    Leader: d ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600",
    Member: d ? "bg-blue-500/10 border-blue-500/20 text-blue-400"   : "bg-blue-50 border-blue-200 text-blue-600",
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionHead darkMode={d}
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
        title="General Profile" desc="Personal information stored and synced with CURIEM backend" />



      {/* Avatar */}
      <Glass darkMode={d} className="p-5">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative shrink-0 cursor-pointer" onClick={() => fileRef.current?.click()}>
            {imgPreview
              ? <img src={imgPreview} alt="avatar" className="w-[72px] h-[72px] rounded-2xl object-cover shadow-lg" />
              : <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/30">
                  {currentUser?.initials ?? "RK"}
                </div>
            }
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center
              ${d ? "bg-[#151d2e] border-[#0B0F19]" : "bg-white border-white"} shadow`}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={d ? "#93c5fd" : "#3b82f6"} strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} className="hidden" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-bold text-[15px] ${d ? "text-white" : "text-slate-800"}`}>{form.name}</p>
            <p className={`text-[12px] mt-0.5 truncate ${m}`}>{form.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${roleColors[userRole]}`}>{userRole}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${d ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>● Active</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => fileRef.current?.click()}
              className={`text-[11px] font-semibold px-3.5 py-2 rounded-xl border transition-all
              ${d ? "border-white/10 text-white/50 hover:border-white/20 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white/60"}`}>
              Upload Photo
            </button>
            {imgPreview && (
              <button onClick={() => setImgPreview(null)}
                className={`text-[11px] font-semibold px-3.5 py-2 rounded-xl border transition-all
                ${d ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10" : "border-rose-200 text-rose-500 hover:bg-rose-50"}`}>
                Remove
              </button>
            )}
          </div>
        </div>
        <p className={`text-[10px] mt-3 ${m}`}>Profile photo is uploaded to AWS S3 and served via CDN. Max 5MB — JPG, PNG, WEBP supported.</p>
      </Glass>

      {/* Form */}
      <Glass darkMode={d} className="p-5">
        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-4 ${m}`}>Account Details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name (Username)" value={form.name} onChange={set("name")} darkMode={d} placeholder="Your full name" />
          <Input label="Work Email" value={form.email} onChange={set("email")} type="email" darkMode={d} readOnly hint="Contact Admin to change email address" />
          <Input label="Phone Number" value={form.phone} onChange={set("phone")} darkMode={d} placeholder="+91 XXXXX XXXXX" />
          <Input label="LinkedIn Profile" value={form.linkedin} onChange={set("linkedin")} darkMode={d} placeholder="linkedin.com/in/username" />
          <Input label="Role" value={userRole} darkMode={d} readOnly hint="Assigned by Admin via RBAC — cannot self-edit" />
        </div>
        <div className="mt-4">
          <Textarea label="Short Bio" value={form.bio} onChange={set("bio")} placeholder="Tell your team a little about yourself..." darkMode={d} rows={2} />
        </div>
        <div className="flex justify-end mt-5"><SaveBtn onClick={save} saved={saved} /></div>
      </Glass>

      <InfoBox darkMode={d} color="blue">
        Profile data is stored in the <code className={`text-[10px] px-1 py-0.5 rounded ${d ? "bg-white/10 text-blue-300" : "bg-blue-50 text-blue-600"}`}>users</code> table (MySQL).
        Fields: <strong className={d ? "text-white/55" : "text-slate-600"}>username, phone_num, image</strong> — all editable via{" "}
        <code className={`text-[10px] px-1 py-0.5 rounded ${d ? "bg-white/10 text-blue-300" : "bg-blue-50 text-blue-600"}`}>PUT /api/v1/users/{"{id}"}</code>.
        Email is the login identifier and cannot be changed directly.
      </InfoBox>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 2 — SECURITY
═══════════════════════════════════════════════════════════════════════════ */
function SecurityTab({ darkMode }) {
  const [pw, setPw]           = useState({ current: "", next: "", confirm: "" });
  const [otpExpiry, setOtpExpiry] = useState("10");
  const [sessionTime, setSession] = useState("30");
  const [twoFA, setTwoFA]     = useState(true);
  const [showRecovery, setRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp]         = useState("");
  const [saved, setSaved]     = useState(false);
  const d = darkMode;
  const m = d ? "text-white/30" : "text-slate-400";

  const set = k => e => setPw(p => ({ ...p, [k]: e.target.value }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const selectCls = `border rounded-xl px-3 py-2 text-[13px] outline-none transition-all
    ${d ? "bg-white/[0.05] border-white/[0.08] text-white" : "bg-white/80 border-slate-200 text-slate-800"}`;

  const sessions = [
    { device: "Chrome · Windows 11", location: "Greater Noida, IN", time: "Active now",   current: true  },
    { device: "Safari · iPhone 14",  location: "Delhi, IN",          time: "2 hours ago",  current: false },
    { device: "Firefox · MacOS",     location: "Noida, IN",          time: "Yesterday",    current: false },
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionHead darkMode={d}
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
        title="Security" desc="Password management, OTP, JWT sessions, and account recovery" />

      {/* Change password */}
      <Glass darkMode={d} className="p-5">
        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-4 ${m}`}>Change Password</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Current Password" type="password" value={pw.current} onChange={set("current")} placeholder="••••••••" darkMode={d} />
          <Input label="New Password" type="password" value={pw.next} onChange={set("next")} placeholder="••••••••" darkMode={d} />
          <Input label="Confirm New Password" type="password" value={pw.confirm} onChange={set("confirm")} placeholder="••••••••" darkMode={d} />
        </div>
        <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
          <p className={`text-[10px] ${m}`}>Encrypted with BCrypt before MySQL storage. Never stored in plaintext.</p>
          <SaveBtn onClick={save} saved={saved} label="Update Password" />
        </div>
      </Glass>

      {/* Security policies */}
      <Glass darkMode={d} className="p-5">
        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-1 ${m}`}>Security Policies</p>
        <SettingRow darkMode={d} title="Two-Factor Authentication (OTP)" desc="Require email OTP on every login — powered by CURIEM Auth module">
          <Toggle on={twoFA} onChange={setTwoFA} darkMode={d} />
        </SettingRow>
        <SettingRow darkMode={d} title="OTP Expiry Time" desc="Duration before verification code becomes invalid">
          <select value={otpExpiry} onChange={e => setOtpExpiry(e.target.value)} className={selectCls}>
            {["5","10","15","30"].map(v => <option key={v} value={v}>{v} minutes</option>)}
          </select>
        </SettingRow>
        <SettingRow darkMode={d} title="JWT Session Timeout" desc="Auto-logout after inactivity — uses Spring Security refresh token rotation" noDivider>
          <select value={sessionTime} onChange={e => setSession(e.target.value)} className={selectCls}>
            {["15","30","60","120"].map(v => <option key={v} value={v}>{v} minutes</option>)}
          </select>
        </SettingRow>
        <div className="flex justify-end mt-4"><SaveBtn onClick={save} saved={saved} /></div>
      </Glass>

      {/* Password Recovery Policy */}
      <Glass darkMode={d} className="p-5">
        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-4 ${m}`}>Password Recovery</p>
        <p className={`text-[13px] mb-4 ${d ? "text-white/60" : "text-slate-600"}`}>
          Forgot your password? We'll send a one-time OTP to your registered email.
        </p>
        {!showRecovery ? (
          <button onClick={() => setRecovery(true)}
            className={`text-[12px] font-semibold px-4 py-2.5 rounded-xl border transition-all
              ${d ? "border-blue-500/30 text-blue-400 hover:bg-blue-500/10" : "border-blue-200 text-blue-600 hover:bg-blue-50"}`}>
            Initiate Password Recovery
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input label="Registered Email" type="email" value={recoveryEmail}
                  onChange={e => setRecoveryEmail(e.target.value)} placeholder="your@email.com" darkMode={d} />
              </div>
              <div className="flex items-end">
                <button onClick={() => setOtpSent(true)}
                  className="px-4 py-2.5 rounded-xl text-[12px] font-semibold bg-blue-500 hover:bg-blue-400 text-white transition-all whitespace-nowrap">
                  {otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
            </div>
            {otpSent && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input label="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit code" darkMode={d} />
                </div>
                <div className="flex items-end">
                  <button className="px-4 py-2.5 rounded-xl text-[12px] font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-all">
                    Verify & Reset
                  </button>
                </div>
              </div>
            )}
            <p className={`text-[10px] ${m}`}>
              OTP valid for {otpExpiry} minutes. Sent via registered email — endpoint:{" "}
              <code className={`text-[10px] px-1 rounded ${d ? "bg-white/10 text-blue-300" : "bg-blue-50 text-blue-600"}`}>POST /api/v1/auth/forgot-password</code>
            </p>
          </div>
        )}
      </Glass>

      {/* Active Sessions */}
      <Glass darkMode={d} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-[13px] font-semibold ${d ? "text-white/80" : "text-slate-700"}`}>Active Sessions</p>
            <p className={`text-[11px] ${m}`}>Devices with active JWT tokens</p>
          </div>
          <button className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all
            ${d ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10" : "border-rose-200 text-rose-600 hover:bg-rose-50"}`}>
            Revoke All Others
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {sessions.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border
              ${d ? "border-white/[0.05] bg-white/[0.02]" : "border-slate-100 bg-slate-50/50"}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                ${d ? "bg-white/10 text-white/60" : "bg-slate-100 text-slate-500"}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[12px] font-semibold truncate ${d ? "text-white/80" : "text-slate-700"}`}>{s.device}</p>
                <p className={`text-[10px] truncate ${m}`}>{s.location} · {s.time}</p>
              </div>
              {s.current
                ? <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${d ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>Current</span>
                : <button className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all
                    ${d ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10" : "border-rose-200 text-rose-500 hover:bg-rose-50"}`}>Revoke</button>
              }
            </div>
          ))}
        </div>
      </Glass>

      <InfoBox darkMode={d} color="blue">
        CURIEM uses JWT access tokens with refresh token rotation. Tokens are invalidated on logout and stored in{" "}
        <code className={`text-[10px] px-1 rounded ${d ? "bg-white/10 text-blue-300" : "bg-blue-50 text-blue-600"}`}>invalidated_tokens</code>{" "}
        table — preventing token reuse attacks. Spring Security enforces authentication on all protected endpoints.
      </InfoBox>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 3 — ROLES & PERMISSIONS
═══════════════════════════════════════════════════════════════════════════ */
const ALL_PERMS = [
  { group: "Leads",    items: ["View Leads", "Manage Leads", "Export Leads"] },
  { group: "Clients",  items: ["View Clients", "Manage Clients", "Delete Clients"] },
  { group: "Projects", items: ["View Projects", "Manage Projects", "Delete Projects"] },
  { group: "Tasks",    items: ["View Tasks", "Manage Tasks", "Assign Tasks"] },
  { group: "Reports",  items: ["View Reports", "Financial Reports", "Export Reports"] },
  { group: "Admin",    items: ["Manage Team", "Billing Access", "System Settings"] },
];

const FLAT_PERMS = ALL_PERMS.flatMap(g => g.items);

const ROLES_INIT = [
  { name: "Admin",  dc: "text-rose-400",  db: "bg-rose-500/10 border-rose-500/20",   lc: "text-rose-600",  lb: "bg-rose-50 border-rose-200",   desc: "Full system access",                perms: Array(FLAT_PERMS.length).fill(true) },
  { name: "Leader", dc: "text-amber-400", db: "bg-amber-500/10 border-amber-500/20", lc: "text-amber-600", lb: "bg-amber-50 border-amber-200", desc: "Project & team management",         perms: [true,true,true, true,true,false, true,true,false, true,true,true, true,false,false, false,false,false] },
  { name: "Member", dc: "text-blue-400",  db: "bg-blue-500/10 border-blue-500/20",   lc: "text-blue-600",  lb: "bg-blue-50 border-blue-200",   desc: "View & work on assigned tasks",     perms: [true,false,false, true,false,false, true,false,false, true,true,false, false,false,false, false,false,false] },
];

const USERS_INIT = [
  { name: "Raj Kumar",        email: "raj@curiumcrm.com",     role: "Admin",  active: true  },
  { name: "Anshika Aggarwal", email: "anshika@curiumcrm.com", role: "Admin",  active: true  },
  { name: "Priya Mehta",      email: "priya@curiumcrm.com",   role: "Leader", active: true  },
  { name: "Rohan Gupta",      email: "rohan@curiumcrm.com",   role: "Member", active: false },
  { name: "Sneha Patel",      email: "sneha@curiumcrm.com",   role: "Member", active: true  },
];

function RolesTab({ darkMode }) {
  const [roles, setRoles]   = useState(ROLES_INIT);
  const [users, setUsers]   = useState(USERS_INIT);
  const [saved, setSaved]   = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [showNewRole, setShowNewRole] = useState(false);
  const d = darkMode;
  const m = d ? "text-white/30" : "text-slate-400";
  const tx = d ? "text-white/80" : "text-slate-700";

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const togglePerm = (ri, pi) =>
    setRoles(prev => prev.map((r, i) => i !== ri ? r : { ...r, perms: r.perms.map((p, j) => j !== pi ? p : !p) }));

  const toggleUser = i =>
    setUsers(prev => prev.map((u, idx) => idx !== i ? u : { ...u, active: !u.active }));

  const addRole = () => {
    if (!newRoleName.trim()) return;
    setRoles(prev => [...prev, {
      name: newRoleName, desc: newRoleDesc,
      dc: "text-violet-400", db: "bg-violet-500/10 border-violet-500/20",
      lc: "text-violet-600", lb: "bg-violet-50 border-violet-200",
      perms: Array(FLAT_PERMS.length).fill(false),
    }]);
    setNewRoleName(""); setNewRoleDesc(""); setShowNewRole(false);
  };

  let permIdx = 0;

  return (
    <div className="flex flex-col gap-5">
      <SectionHead darkMode={d} badge="Admin Only"
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        title="Roles & Permissions"
        desc="RBAC — Spring Security enforces these restrictions at every API endpoint" />

      {/* Role cards overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((r, ri) => (
          <Glass key={r.name} darkMode={d} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${d ? `${r.db} ${r.dc}` : `${r.lb} ${r.lc}`}`}>{r.name}</span>
              <span className={`text-[11px] font-bold ${d ? "text-white/60" : "text-slate-600"}`}>
                {r.perms.filter(Boolean).length}/{r.perms.length}
              </span>
            </div>
            <p className={`text-[11px] ${m}`}>{r.desc}</p>
            <div className={`mt-3 h-1.5 w-full rounded-full overflow-hidden ${d ? "bg-white/[0.05]" : "bg-slate-100"}`}>
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
                style={{ width: `${(r.perms.filter(Boolean).length / r.perms.length) * 100}%` }} />
            </div>
          </Glass>
        ))}
      </div>

      {/* Permission matrix */}
      <Glass darkMode={d} className="p-5 overflow-x-auto">
        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-5 ${m}`}>Permission Matrix</p>
        <table className="w-full" style={{ minWidth: `${180 + roles.length * 100}px` }}>
          <thead>
            <tr>
              <th className={`text-left text-[10px] font-semibold uppercase tracking-widest pb-3 pr-4 ${m} w-48`}>Permission</th>
              {roles.map(r => (
                <th key={r.name} className="pb-3 text-center px-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${d ? `${r.db} ${r.dc}` : `${r.lb} ${r.lc}`}`}>{r.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_PERMS.map(group => {
              const groupStart = permIdx;
              permIdx += group.items.length;
              return group.items.map((perm, itemIdx) => {
                const pi = groupStart + itemIdx;
                return (
                  <tr key={perm} className={`border-t ${d ? "border-white/[0.04]" : "border-slate-100"}`}>
                    <td className={`py-2.5 pr-4 text-[12px] ${itemIdx === 0 ? "pt-3" : ""}`}>
                      {itemIdx === 0 && (
                        <span className={`text-[9px] font-bold uppercase tracking-widest mr-2 ${m}`}>{group.group} ›</span>
                      )}
                      <span className={tx}>{perm}</span>
                    </td>
                    {roles.map((r, ri) => (
                      <td key={r.name} className="py-2.5 text-center px-3">
                        <button onClick={() => togglePerm(ri, pi)}
                          className={`w-5 h-5 rounded-full border-[1.5px] mx-auto flex items-center justify-center transition-all duration-200
                            ${r.perms[pi]
                              ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-400"
                              : d ? "bg-white/[0.03] border-white/10 text-transparent" : "bg-slate-50 border-slate-200 text-transparent"
                            }`}>
                          <svg width="9" height="9" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2.5 7.5 5.5 10.5 11.5 3.5"/></svg>
                        </button>
                      </td>
                    ))}
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-5">
          <button onClick={() => setShowNewRole(!showNewRole)}
            className={`text-[12px] font-semibold px-4 py-2 rounded-xl border transition-all
              ${d ? "border-white/10 text-white/50 hover:border-white/20 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
            + Create New Role
          </button>
          <SaveBtn onClick={save} saved={saved} />
        </div>
        {showNewRole && (
          <div className={`mt-4 p-4 rounded-xl border ${d ? "border-white/[0.06] bg-white/[0.02]" : "border-slate-100 bg-slate-50"}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <Input label="Role Name" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} placeholder="e.g. Sales Lead" darkMode={d} />
              <Input label="Description" value={newRoleDesc} onChange={e => setNewRoleDesc(e.target.value)} placeholder="Brief description..." darkMode={d} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNewRole(false)} className={`px-4 py-2 rounded-xl text-[12px] font-semibold border transition-all ${d ? "border-white/10 text-white/40 hover:text-white" : "border-slate-200 text-slate-400"}`}>Cancel</button>
              <button onClick={addRole} className="px-4 py-2 rounded-xl text-[12px] font-semibold bg-blue-500 hover:bg-blue-400 text-white transition-all">Create Role</button>
            </div>
          </div>
        )}
      </Glass>


      {/* User status */}
      <Glass darkMode={d} className="p-5">
        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-4 ${m}`}>User Status Management</p>
        <div className="flex flex-col gap-2">
          {users.map((u, i) => {
            const rc = u.role === "Admin" ? (d ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-600")
              : u.role === "Leader" ? (d ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600")
              : (d ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600");
            return (
              <div key={u.email} className={`flex items-center gap-3 p-3 rounded-xl border transition-all flex-wrap
                ${d ? "border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04]" : "border-slate-100 bg-slate-50/50 hover:bg-white"}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0
                  ${d ? "bg-white/10 text-white" : "bg-slate-200 text-slate-700"}`}>
                  {u.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-semibold truncate ${tx}`}>{u.name}</p>
                  <p className={`text-[11px] truncate ${m}`}>{u.email}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${rc}`}>{u.role}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase
                  ${u.active ? (d ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600") : (d ? "bg-slate-500/10 text-slate-500" : "bg-slate-100 text-slate-400")}`}>
                  {u.active ? "Active" : "Inactive"}
                </span>
                <button onClick={() => toggleUser(i)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all
                    ${u.active
                      ? d ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10" : "border-rose-200 text-rose-600 hover:bg-rose-50"
                      : d ? "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    }`}>
                  {u.active ? "Deactivate" : "Reactivate"}
                </button>
              </div>
            );
          })}
        </div>
      </Glass>
    </div>
  );
}



/* ═══════════════════════════════════════════════════════════════════════════
   TAB 4 — TEAM MANAGEMENT
═══════════════════════════════════════════════════════════════════════════ */
function TeamTab({ darkMode }) {
  const [email, setEmail]   = useState("");
  const [role, setRole]     = useState("Member");
  const [sent, setSent]     = useState(false);
  const d = darkMode;
  const m = d ? "text-white/30" : "text-slate-400";
  const tx = d ? "text-white/80" : "text-slate-700";

  const invite = () => { if (!email.trim()) return; setSent(true); setEmail(""); setTimeout(() => setSent(false), 2500); };

  const pending = [
    { email: "vikram@company.com",  role: "Leader", sent: "2 days ago" },
    { email: "pooja@company.com",   role: "Member", sent: "5 days ago" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionHead darkMode={d} badge="Admin Only"
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>}
        title="Team Management" desc="Invite members, assign roles, manage seat limits" />

      {/* Seat usage */}
      <Glass darkMode={d} className="p-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div>
            <p className={`text-[13px] font-semibold ${tx}`}>Seat Usage</p>
            <p className={`text-[11px] ${m}`}>Growth Plan — up to 20 users</p>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${d ? "bg-violet-500/10 border-violet-500/20 text-violet-400" : "bg-violet-50 border-violet-200 text-violet-600"}`}>
            5 / 20 seats
          </span>
        </div>
        <div className={`h-2 w-full rounded-full overflow-hidden ${d ? "bg-white/[0.06]" : "bg-slate-100"}`}>
          <div className="h-full w-[25%] rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className={`text-[10px] ${m}`}>25% capacity · 15 seats remaining</p>
          <button className={`text-[10px] font-semibold ${d ? "text-blue-400" : "text-blue-500"}`}>Upgrade to Scale →</button>
        </div>
      </Glass>

      {/* Invite */}
      <Glass darkMode={d} className="p-5">
        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-4 ${m}`}>Invite New Member</p>
        <div className="flex gap-3 flex-col md:flex-row md:items-end">
          <div className="flex-1">
            <Input label="Work Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="colleague@company.com" darkMode={d} />
          </div>
          <div className="md:w-36">
            <Select label="Role" value={role} onChange={e => setRole(e.target.value)}
              options={["Admin","Leader","Member"]} darkMode={d} />
          </div>
          <button onClick={invite}
            className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap
              ${sent ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                     : "bg-blue-500 hover:bg-blue-400 text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:-translate-y-0.5"}`}>
            {sent ? "✓ Invite Sent!" : "Send Invite"}
          </button>
        </div>
        <p className={`text-[10px] mt-3 ${m}`}>
          Invitation uses OTP-based registration via{" "}
          <code className={`text-[10px] px-1 rounded ${d ? "bg-white/10 text-blue-300" : "bg-blue-50 text-blue-600"}`}>POST /api/v1/auth/register/{"{roleId}"}</code>
        </p>
      </Glass>

      {/* Pending invites */}
      <Glass darkMode={d} className="p-5">
        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-4 ${m}`}>Pending Invitations</p>
        {pending.length === 0
          ? <p className={`text-[12px] ${m}`}>No pending invitations.</p>
          : pending.map((p, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border mb-2 ${d ? "border-white/[0.05] bg-white/[0.02]" : "border-slate-100 bg-slate-50"}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${d ? "bg-white/10" : "bg-slate-200"}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={d ? "#94a3b8" : "#64748b"} strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[12px] font-semibold truncate ${tx}`}>{p.email}</p>
                <p className={`text-[10px] ${m}`}>Role: {p.role} · Sent {p.sent}</p>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${d ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"}`}>Pending</span>
              <button className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all
                ${d ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10" : "border-rose-200 text-rose-500 hover:bg-rose-50"}`}>
                Revoke
              </button>
            </div>
          ))}
      </Glass>
    </div>
  );
}



/* ═══════════════════════════════════════════════════════════════════════════
   TAB 5 — WORKSPACE / ORGANIZATION
═══════════════════════════════════════════════════════════════════════════ */
function WorkspaceTab({ darkMode }) {
  const [ws, setWs] = useState({
    name: "CURIEM Technologies Pvt. Ltd.",
    domain: "curiumcrm.com",
    industry: "IT Services",
    size: "11-50",
    timezone: "Asia/Kolkata",
    currency: "INR",
    address: "KCC ITAM, Greater Noida, UP, India",
  });
  const [logo, setLogo]   = useState(null);
  const [saved, setSaved] = useState(false);
  const logoRef = useRef();
  const d = darkMode;
  const m = d ? "text-white/30" : "text-slate-400";
  const set = k => e => setWs(w => ({ ...w, [k]: e.target.value }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="flex flex-col gap-5">
      <SectionHead darkMode={d} badge="Admin Only"
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
        title="Workspace & Organization"
        desc="Company branding, details, and workspace configuration for the SaaS deployment" />

      {/* Company branding */}
      <Glass darkMode={d} className="p-5">
        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-4 ${m}`}>Company Branding</p>
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <div className={`w-16 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all
            ${d ? "border-white/10 hover:border-white/20 bg-white/[0.02]" : "border-slate-200 hover:border-slate-300 bg-slate-50"}`}
            onClick={() => logoRef.current?.click()}>
            {logo
              ? <img src={logo} alt="logo" className="w-full h-full object-contain rounded-2xl p-1" />
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={d ? "#475569" : "#94a3b8"} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            }
            <input ref={logoRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files[0]; if(f) setLogo(URL.createObjectURL(f)); }} />
          </div>
          <div>
            <p className={`text-[13px] font-semibold ${d ? "text-white/80" : "text-slate-700"}`}>Company Logo</p>
            <p className={`text-[11px] mt-0.5 ${m}`}>Displayed in sidebar, reports, and email templates</p>
            <button onClick={() => logoRef.current?.click()}
              className={`mt-2 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all
                ${d ? "border-white/10 text-white/50 hover:text-white hover:border-white/20" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
              {logo ? "Change Logo" : "Upload Logo"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Workspace / Company Name" value={ws.name} onChange={set("name")} darkMode={d} placeholder="Your company name" />
          <Input label="Company Domain" value={ws.domain} onChange={set("domain")} darkMode={d} placeholder="company.com" />
          <Select label="Industry" value={ws.industry} onChange={set("industry")} darkMode={d}
            options={["IT Services","E-Commerce","Healthcare","Education","Finance","Manufacturing","Other"]} />
          <Select label="Company Size" value={ws.size} onChange={set("size")} darkMode={d}
            options={["1-10","11-50","51-200","201-500","500+"]} />
        </div>
        <div className="flex justify-end mt-4"><SaveBtn onClick={save} saved={saved} /></div>
      </Glass>

      {/* Regional settings */}
      <Glass darkMode={d} className="p-5">
        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-4 ${m}`}>Regional & Locale</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="Default Timezone" value={ws.timezone} onChange={set("timezone")} darkMode={d}
            options={["Asia/Kolkata","UTC","America/New_York","Europe/London","Asia/Dubai"]} />
          <Select label="Currency" value={ws.currency} onChange={set("currency")} darkMode={d}
            options={["INR","USD","EUR","GBP","AED"]} />
          <Input label="Office Address" value={ws.address} onChange={set("address")} darkMode={d} placeholder="City, Country" />
        </div>
        <div className="flex justify-end mt-4"><SaveBtn onClick={save} saved={saved} label="Save Regional" /></div>
      </Glass>

      <InfoBox darkMode={d} color="amber">
        Company branding (logo, name) is stored in the organization profile and propagates across the dashboard sidebar, PDF reports, email templates, and client-facing pages. Logo is uploaded to <strong className={d ? "text-white/55" : "text-slate-600"}>AWS S3</strong> — same storage as profile photos.
      </InfoBox>
    </div>
  );
}



/* ═══════════════════════════════════════════════════════════════════════════
   TAB 6 — INTEGRATIONS & API
═══════════════════════════════════════════════════════════════════════════ */
function IntegrationsTab({ darkMode }) {
  const [s3, setS3] = useState({ bucket: "curiem-uploads", region: "ap-south-1", accessKey: "AKIA••••••••••••", secretKey: "" });
  const [smtp, setSmtp] = useState({ host: "smtp.gmail.com", port: "587", user: "noreply@curiumcrm.com", pass: "" });
  const [apiKey, setApiKey] = useState("ck_live_•••••••••••••••••••••••••••");
  const [saved, setSaved] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const d = darkMode;
  const m = d ? "text-white/30" : "text-slate-400";

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const setS3f  = k => e => setS3(p => ({ ...p, [k]: e.target.value }));
  const setSmtpf = k => e => setSmtp(p => ({ ...p, [k]: e.target.value }));

  const integrations = [
    { name: "AWS S3",        desc: "File & image storage",         status: true,  icon: "☁️" },
    { name: "Gmail SMTP",    desc: "OTP & notification emails",     status: true,  icon: "📧" },
    { name: "Google Calendar",desc:"Calendar sync (coming soon)",   status: false, icon: "📅" },
    { name: "Slack",         desc: "Team notifications (coming soon)", status: false, icon: "💬" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionHead darkMode={d} badge="Admin Only"
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
        title="Integrations & API"
        desc="AWS S3, email service, API keys, and third-party connections" />

      {/* Integration overview */}
      <Glass darkMode={d} className="p-5">
        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-4 ${m}`}>Connected Services</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {integrations.map(intg => (
            <div key={intg.name} className={`flex items-center gap-3 p-3 rounded-xl border transition-all
              ${d ? "border-white/[0.05] bg-white/[0.02]" : "border-slate-100 bg-slate-50"}`}>
              <span className="text-xl shrink-0">{intg.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-semibold ${d ? "text-white/80" : "text-slate-700"}`}>{intg.name}</p>
                <p className={`text-[11px] truncate ${m}`}>{intg.desc}</p>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0
                ${intg.status
                  ? d ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                  : d ? "bg-slate-500/10 text-slate-500" : "bg-slate-100 text-slate-400"
                }`}>
                {intg.status ? "Connected" : "Not Connected"}
              </span>
            </div>
          ))}
        </div>
      </Glass>

      {/* AWS S3 */}
      <Glass darkMode={d} className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">☁️</span>
          <p className={`text-[13px] font-semibold ${d ? "text-white/80" : "text-slate-700"}`}>AWS S3 Configuration</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="S3 Bucket Name" value={s3.bucket} onChange={setS3f("bucket")} darkMode={d} placeholder="my-crm-bucket" />
          <Select label="AWS Region" value={s3.region} onChange={setS3f("region")} darkMode={d}
            options={[{value:"ap-south-1",label:"ap-south-1 (Mumbai)"},{value:"us-east-1",label:"us-east-1 (N. Virginia)"},{value:"eu-west-1",label:"eu-west-1 (Ireland)"}]} />
          <Input label="Access Key ID" value={s3.accessKey} onChange={setS3f("accessKey")} darkMode={d} placeholder="AKIA..." />
          <Input label="Secret Access Key" type={showSecret ? "text" : "password"} value={s3.secretKey} onChange={setS3f("secretKey")} darkMode={d} placeholder="••••••••••••••••••" />
        </div>
        <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showSecret} onChange={e => setShowSecret(e.target.checked)} className="rounded" />
            <span className={`text-[11px] ${m}`}>Show secret key</span>
          </label>
          <div className="flex gap-2">
            <button className={`px-4 py-2 rounded-xl text-[12px] font-semibold border transition-all
              ${d ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
              Test Connection
            </button>
            <SaveBtn onClick={save} saved={saved} label="Save S3 Config" />
          </div>
        </div>
      </Glass>

      {/* SMTP Email */}
      <Glass darkMode={d} className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📧</span>
          <p className={`text-[13px] font-semibold ${d ? "text-white/80" : "text-slate-700"}`}>SMTP Email Service (OTP Delivery)</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="SMTP Host" value={smtp.host} onChange={setSmtpf("host")} darkMode={d} placeholder="smtp.gmail.com" />
          <Input label="Port" value={smtp.port} onChange={setSmtpf("port")} darkMode={d} placeholder="587" />
          <Input label="Email Address" value={smtp.user} onChange={setSmtpf("user")} darkMode={d} placeholder="noreply@company.com" />
          <Input label="App Password" type="password" value={smtp.pass} onChange={setSmtpf("pass")} darkMode={d} placeholder="••••••••••••" />
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button className={`px-4 py-2 rounded-xl text-[12px] font-semibold border transition-all
            ${d ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500"}`}>
            Send Test Email
          </button>
          <SaveBtn onClick={save} saved={saved} label="Save SMTP" />
        </div>
      </Glass>

      {/* API Key */}
      <Glass darkMode={d} className="p-5">
        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-4 ${m}`}>API Keys</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className={`text-[11px] mb-1 ${m}`}>Live API Key</p>
            <code className={`text-[12px] font-mono truncate block px-3 py-2 rounded-lg ${d ? "bg-white/[0.04] text-white/60" : "bg-slate-100 text-slate-600"}`}>
              {apiKey}
            </code>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <button onClick={() => navigator.clipboard?.writeText(apiKey)} // copy to clipboard
              className={`px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all
                ${d ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
              Copy
            </button>
            <button onClick={() => setApiKey("ck_live_" + Math.random().toString(36).substring(2, 30))}
              className={`px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all
                ${d ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10" : "border-rose-200 text-rose-500 hover:bg-rose-50"}`}>
              Regenerate
            </button>
          </div>
        </div>
        <p className={`text-[10px] mt-3 ${m}`}>Keep your API key secret. Regenerating will invalidate the current key immediately.</p>
      </Glass>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 7 — NOTIFICATIONS
═══════════════════════════════════════════════════════════════════════════ */
function NotificationsTab({ darkMode, userRole }) {
  const d = darkMode;
  const m = d ? "text-white/30" : "text-slate-400";

  const [email, setEmail] = useState({
    newLead: true, taskDeadline: true, taskAssigned: true,
    projectUpdate: true, teamInvite: true, weeklyReport: false,
    securityAlert: true, billing: userRole === "Admin",
  });
  const [inApp, setInApp] = useState({
    newLead: true, taskDeadline: true, taskAssigned: true,
    projectUpdate: false, teamInvite: true, weeklyReport: false,
    securityAlert: true, billing: userRole === "Admin",
  });
  const [digestFreq, setDigestFreq] = useState("daily");
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const notifItems = [
    { key: "newLead",       label: "New Lead Added",        desc: "When a new lead enters the pipeline",             roles: ["Admin","Leader","Member"] },
    { key: "taskAssigned",  label: "Task Assigned to You",  desc: "When a task is assigned to your account",         roles: ["Admin","Leader","Member"] },
    { key: "taskDeadline",  label: "Task Deadline Reminder", desc: "24 hours before a task's due date",              roles: ["Admin","Leader","Member"] },
    { key: "projectUpdate", label: "Project Status Update",  desc: "When project status changes (automated scheduler)",roles: ["Admin","Leader"] },
    { key: "teamInvite",    label: "Team Invite Accepted",   desc: "When someone accepts your workspace invitation",  roles: ["Admin"] },
    { key: "weeklyReport",  label: "Weekly Performance Report", desc: "Summary of leads, tasks, and project progress", roles: ["Admin","Leader"] },
    { key: "securityAlert", label: "Security Alerts",        desc: "Login from new device, password changed, etc.",   roles: ["Admin","Leader","Member"] },
    { key: "billing",       label: "Billing & Subscription", desc: "Plan changes, payment reminders",                 roles: ["Admin"] },
  ];

  const visible = notifItems.filter(n => n.roles.includes(userRole));

  return (
    <div className="flex flex-col gap-5">
      <SectionHead darkMode={d}
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
        title="Notifications" desc="Control email alerts and in-app notifications" />

      {/* Digest frequency */}
      <Glass darkMode={d} className="p-5">
        <SettingRow darkMode={d} title="Notification Digest" desc="How often to receive bundled notification emails" noDivider>
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${d ? "bg-white/[0.05] border-white/[0.08]" : "bg-slate-100 border-slate-200"}`}>
            {["realtime","daily","weekly"].map(f => (
              <button key={f} onClick={() => setDigestFreq(f)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold capitalize transition-all
                  ${digestFreq === f
                    ? d ? "bg-blue-500 text-white" : "bg-white text-slate-800 shadow-sm"
                    : d ? "text-white/30 hover:text-white" : "text-slate-400 hover:text-slate-700"
                  }`}>
                {f}
              </button>
            ))}
          </div>
        </SettingRow>
      </Glass>

      {/* Notification matrix */}
      <Glass darkMode={d} className="p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <p className={`text-[11px] font-semibold uppercase tracking-widest ${m}`}>Notification Preferences</p>
          <div className={`flex gap-6 text-[10px] font-bold uppercase tracking-wider ${m}`}>
            <span>Email</span>
            <span>In-App</span>
          </div>
        </div>
        <div className="flex flex-col">
          {visible.map((n, i) => (
            <div key={n.key}>
              <div className="flex items-center justify-between py-3 gap-4">
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium ${d ? "text-white/80" : "text-slate-700"}`}>{n.label}</p>
                  <p className={`text-[11px] mt-0.5 ${m}`}>{n.desc}</p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <Toggle on={email[n.key]} onChange={v => setEmail(p => ({ ...p, [n.key]: v }))} darkMode={d} />
                  <Toggle on={inApp[n.key]} onChange={v => setInApp(p => ({ ...p, [n.key]: v }))} darkMode={d} />
                </div>
              </div>
              {i < visible.length - 1 && <Divider darkMode={d} />}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-5"><SaveBtn onClick={save} saved={saved} /></div>
      </Glass>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 8 — BILLING & SUBSCRIPTION
═══════════════════════════════════════════════════════════════════════════ */
const PLANS = [
  { name:"Starter", price:"Free",   period:"",    seats:"Up to 5 users",  color:"blue",   current:false,
    features:["Leads & Contacts","Basic Dashboard","Task Management","Email Support","1 Admin user"] },
  { name:"Growth",  price:"₹2,499", period:"/mo", seats:"Up to 20 users", color:"violet", current:true,
    features:["Everything in Starter","Advanced Analytics","Priority Support","API Access","Audit Logs (basic)","Custom Roles"] },
  { name:"Scale",   price:"₹5,999", period:"/mo", seats:"Unlimited",      color:"amber",  current:false,
    features:["Everything in Growth","Full Audit Logs","SSO & Advanced Security","Dedicated Manager","White-labeling","SLA 99.9%"] },
];

const AUDIT = [
  { user:"Raj Kumar",         action:"Updated Admin role permissions",        time:"2h ago",     icon:"🔐" },
  { user:"Anshika Aggarwal",  action:"Added new client — Acme Corp",           time:"5h ago",     icon:"➕" },
  { user:"Priya Mehta",       action:"Created project — Website Redesign",     time:"Yesterday",  icon:"📁" },
  { user:"Raj Kumar",         action:"Exported financial reports",             time:"Yesterday",  icon:"📊" },
  { user:"System",            action:"Scheduled task status auto-updated",     time:"2 days ago", icon:"🔄" },
  { user:"Raj Kumar",         action:"Upgraded plan — Starter → Growth",       time:"3 days ago", icon:"⬆️" },
  { user:"Anshika Aggarwal",  action:"Invited priya@curiumcrm.com as Leader",  time:"5 days ago", icon:"📨" },
];

function BillingTab({ darkMode }) {
  const d = darkMode;
  const m = d ? "text-white/30" : "text-slate-400";
  const tx = d ? "text-white/80" : "text-slate-700";

  return (
    <div className="flex flex-col gap-5">
      <SectionHead darkMode={d} badge="Admin Only"
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
        title="Billing & Subscription"
        desc="SaaS plan management — as referenced in CURIEM project report (Fig 1.2)" />

      {/* Current plan highlight */}
      <Glass darkMode={d} className={`p-5 border-l-[3px] ${d ? "border-l-violet-500/50" : "border-l-violet-400"}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-widest ${m}`}>Current Plan</p>
            <p className={`text-xl font-bold mt-1 ${d ? "text-white" : "text-slate-800"}`}>Growth <span className={`text-[13px] font-normal ${m}`}>· ₹2,499/mo</span></p>
            <p className={`text-[11px] mt-1 ${m}`}>Renews on June 1, 2026 · 5 of 20 seats used</p>
          </div>
          <div className="flex gap-2">
            <button className={`px-4 py-2 rounded-xl text-[12px] font-semibold border transition-all
              ${d ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
              Manage Billing
            </button>
            <button className={`px-4 py-2 rounded-xl text-[12px] font-semibold bg-violet-500 hover:bg-violet-400 text-white transition-all shadow-md`} onClick={() => {alert("Upgrade flow coming soon!");}}>
              Upgrade to Scale
            </button>
          </div>
        </div>
      </Glass>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map(plan => {
          const ac = {
            blue:   { ring:d?"border-blue-500/40":"border-blue-300",   badge:d?"bg-blue-500/10 border-blue-500/20 text-blue-400":"bg-blue-50 border-blue-200 text-blue-600",       btn:"bg-blue-500 hover:bg-blue-400 shadow-blue-500/25" },
            violet: { ring:d?"border-violet-500/40":"border-violet-300", badge:d?"bg-violet-500/10 border-violet-500/20 text-violet-400":"bg-violet-50 border-violet-200 text-violet-600", btn:"bg-violet-500 hover:bg-violet-400 shadow-violet-500/25" },
            amber:  { ring:d?"border-amber-500/40":"border-amber-300",  badge:d?"bg-amber-500/10 border-amber-500/20 text-amber-400":"bg-amber-50 border-amber-200 text-amber-600",    btn:"bg-amber-500 hover:bg-amber-400 shadow-amber-500/25" },
          }[plan.color];

          return (
            <Glass key={plan.name} darkMode={d} className={`p-5 relative flex flex-col ${plan.current ? `${ac.ring} border-[1.5px]` : ""}`}>
              {plan.current && (
                <span className={`absolute -top-3 left-4 text-[9px] font-bold px-2.5 py-1 rounded-full border ${ac.badge}`}>Current</span>
              )}
              <p className={`font-bold text-[15px] mt-2 ${tx}`}>{plan.name}</p>
              <div className="flex items-end gap-1 my-2">
                <span className={`text-2xl font-bold ${tx}`}>{plan.price}</span>
                <span className={`text-[11px] pb-0.5 ${m}`}>{plan.period}</span>
              </div>
              <p className={`text-[11px] mb-4 ${m}`}>{plan.seats}</p>
              <div className="flex flex-col gap-1.5 mb-5 flex-1">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <svg className="text-emerald-400 mt-0.5 shrink-0" width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="2.5 7.5 5.5 10.5 11.5 3.5"/></svg>
                    <span className={`text-[11px] ${d ? "text-white/45" : "text-slate-500"}`}>{f}</span>
                  </div>
                ))}
              </div>
              <button disabled={plan.current}
                className={`w-full py-2.5 rounded-xl text-[12px] font-semibold transition-all
                  ${plan.current
                    ? d ? "bg-white/5 text-white/25 cursor-not-allowed" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : `${ac.btn} text-white shadow-lg hover:-translate-y-0.5`}`}>
                {plan.current ? "Current Plan" : "Upgrade"}
              </button>
            </Glass>
          );
        })}
      </div>

      {/* Audit Logs */}
      <Glass darkMode={d} className="p-5">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <p className={`text-[13px] font-semibold ${tx}`}>Audit Logs</p>
            <p className={`text-[11px] ${m}`}>Full traceability — who did what, and when (Scale feature)</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border ${d ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600"}`}>
              Scale Only
            </span>
            <button className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all
              ${d ? "border-white/10 text-white/50 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500"}`}>
              Export CSV
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {AUDIT.map((log, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all
              ${d ? "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04]" : "border-slate-100 bg-slate-50/50 hover:bg-white"}`}>
              <span className="text-base shrink-0">{log.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-[12px] font-semibold truncate ${tx}`}>{log.user}</p>
                <p className={`text-[11px] truncate ${m}`}>{log.action}</p>
              </div>
              <span className={`text-[10px] shrink-0 ${m}`}>{log.time}</span>
            </div>
          ))}
        </div>
      </Glass>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 9 — APPEARANCE
═══════════════════════════════════════════════════════════════════════════ */
function AppearanceTab({ darkMode, setDarkMode }) {
  const [compact, setCompact]   = useState(false);
  const [animations, setAnim]   = useState(true);
  const [density, setDensity]   = useState("comfortable");
  const [sidebarPos, setSidebarPos] = useState("left");
  const [accent, setAccent]     = useState("blue");
  const [saved, setSaved]       = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const d = darkMode;
  const m = d ? "text-white/30" : "text-slate-400";

  const accents = [
    {name:"blue",   cls:"bg-blue-500"},  {name:"violet",cls:"bg-violet-500"},
    {name:"cyan",   cls:"bg-cyan-500"},  {name:"emerald",cls:"bg-emerald-500"},
    {name:"rose",   cls:"bg-rose-500"},  {name:"amber", cls:"bg-amber-500"},
  ];

  const segmentCls = (active) => `px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all
    ${active
      ? d ? "bg-blue-500 text-white shadow-[0_2px_8px_rgba(59,130,246,0.4)]" : "bg-white text-slate-800 shadow-sm"
      : d ? "text-white/35 hover:text-white" : "text-slate-400 hover:text-slate-700"
    }`;

  return (
    <div className="flex flex-col gap-5">
      <SectionHead darkMode={d}
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M4.93 4.93l1.41 1.41M18.66 18.66l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>}
        title="Appearance" desc="Customize your CURIEM workspace look and feel" />

      <Glass darkMode={d} className="p-5">
        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-1 ${m}`}>Theme & Colors</p>

        {/* Theme */}
        <SettingRow darkMode={d} title="Color Theme" desc="Switch between dark and light mode across all modules">
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${d ? "bg-white/[0.05] border-white/[0.08]" : "bg-slate-100 border-slate-200"}`}>
            <button onClick={() => setDarkMode(true)}  className={segmentCls(d)}>🌙 Dark</button>
            <button onClick={() => setDarkMode(false)} className={segmentCls(!d)}>☀️ Light</button>
          </div>
        </SettingRow>

        {/* Accent */}
        <SettingRow darkMode={d} title="Accent Color" desc="Used across buttons, badges, active states">
          <div className="flex items-center gap-2">
            {accents.map(a => (
              <button key={a.name} onClick={() => setAccent(a.name)}
                className={`w-6 h-6 rounded-full ${a.cls} transition-all duration-200
                  ${accent === a.name
                    ? `ring-2 ring-offset-2 scale-125 ${d ? "ring-offset-[#0B0F19]" : "ring-offset-white"} ring-white/50`
                    : "opacity-50 hover:opacity-80 hover:scale-110"}`} />
            ))}
          </div>
        </SettingRow>

        <Divider darkMode={d} />
        <p className={`text-[11px] font-semibold uppercase tracking-widest mt-4 mb-1 ${m}`}>Layout</p>

        {/* Density */}
        <SettingRow darkMode={d} title="Content Density" desc="Controls spacing in tables, cards, and lists">
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${d ? "bg-white/[0.05] border-white/[0.08]" : "bg-slate-100 border-slate-200"}`}>
            {["compact","comfortable","spacious"].map(dn => (
              <button key={dn} onClick={() => setDensity(dn)} className={segmentCls(density === dn)}>{dn}</button>
            ))}
          </div>
        </SettingRow>

        {/* Sidebar position */}
        <SettingRow darkMode={d} title="Sidebar Position" desc="Choose where the navigation sidebar appears">
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${d ? "bg-white/[0.05] border-white/[0.08]" : "bg-slate-100 border-slate-200"}`}>
            {["left","right"].map(pos => (
              <button key={pos} onClick={() => setSidebarPos(pos)} className={segmentCls(sidebarPos === pos)}>{pos}</button>
            ))}
          </div>
        </SettingRow>

        {/* Compact sidebar */}
        <SettingRow darkMode={d} title="Compact Sidebar" desc="Show icons only — hide labels for more screen space">
          <Toggle on={compact} onChange={setCompact} darkMode={d} />
        </SettingRow>

        {/* Animations */}
        <SettingRow darkMode={d} title="UI Animations" desc="Enable transitions, micro-interactions, and motion effects" noDivider>
          <Toggle on={animations} onChange={setAnim} darkMode={d} />
        </SettingRow>

        <div className="flex justify-end mt-5"><SaveBtn onClick={save} saved={saved} /></div>
      </Glass>

      {/* Preview card */}
      <Glass darkMode={d} className="p-5">
        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-3 ${m}`}>Live Preview</p>
        <div className={`rounded-xl p-4 border ${d ? "border-white/[0.06] bg-white/[0.02]" : "border-slate-100 bg-slate-50"}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white`}
              style={{ background: `var(--tw-gradient-stops, linear-gradient(135deg, #3b82f6, #8b5cf6))`,
                backgroundColor: accent === "blue" ? "#3b82f6" : accent === "violet" ? "#8b5cf6"
                  : accent === "cyan" ? "#06b6d4" : accent === "emerald" ? "#10b981"
                  : accent === "rose" ? "#f43f5e" : "#f59e0b" }}>
              CC
            </div>
            <div>
              <p className={`text-[12px] font-bold ${d ? "text-white" : "text-slate-800"}`}>CuriumCRM</p>
              <p className={`text-[10px] ${m}`}>Projects · Clients · People</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className={`h-2 flex-1 rounded-full ${d ? "bg-white/10" : "bg-slate-200"}`} />
            <div className={`h-2 w-1/2 rounded-full ${d ? "bg-white/5" : "bg-slate-100"}`} />
          </div>
          <p className={`text-[10px] mt-2 ${m}`}>Theme: {d ? "Dark" : "Light"} · Density: {density} · Sidebar: {sidebarPos}</p>
        </div>
      </Glass>
    </div>
  );
}



/* ═══════════════════════════════════════════════════════════════════════════
   MAIN SETTINGS PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function Settings({ darkMode: darkProp, isDark, setIsDark, userRole = "Admin", currentUser }) {
  const [dark, setDarkLocal] = useState(darkProp ?? isDark ?? true);
  const [tab, setTab]        = useState("profile");

  // sync dark mode with parent(TOPBAR) component (in case it's changed elsewhere in the app)
  useEffect(() => { if (isDark !== undefined) setDarkLocal(isDark); }, [isDark]);


  const setDark = v => { setDarkLocal(v); if (setIsDark) setIsDark(v); };

  const d = dark;

  const TABS = [
    { id:"profile",       label:"Profile",          icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { id:"security",      label:"Security",          icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    { id:"roles",         label:"Roles & Perms",     adminOnly:true, icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id:"team",          label:"Team",              adminOnly:true, icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
    { id:"workspace",     label:"Workspace",         adminOnly:true, icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
    { id:"integrations",  label:"Integrations",      adminOnly:true, icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
    { id:"notifications", label:"Notifications",     icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
    { id:"billing",       label:"Billing",           adminOnly:true, icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    { id:"appearance",    label:"Appearance",        icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M4.93 4.93l1.41 1.41M18.66 18.66l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg> },
  ];

  const visibleTabs = TABS.filter(t => !t.adminOnly || userRole === "Admin");
  const initials = currentUser?.initials ?? (currentUser?.name?.split(" ").map(n=>n[0]).join("") ?? "RK");

  return (
    <div className={`${d ? "bg-[#171821] text-white" : "bg-amber-50 text-slate-800"}`}
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Ambient glow */}
      {d && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-violet-500/[0.04] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/[0.03] rounded-full blur-3xl" />
        </div>
      )}

      <div className="relative z-10 w-full px-5 py-8"> {/* // Container with padding and relative positioning for glow effect */}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className={`text-2xl font-bold tracking-tight ${d ? "text-white" : "text-slate-900"}`}>Settings</h1>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider
              ${d ? "bg-white/[0.05] border-white/[0.08] text-white/25" : "bg-white/80 border-slate-200 text-slate-400"}`}>
              CURIEM CRM
            </span>
          </div>
          <p className={`text-[13px] ${d ? "text-white/30" : "text-slate-400"}`}>
            Account · Security · Team · Workspace · Integrations — all in one place
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-5">

          {/* Sidebar */}
          <aside className="md:w-52 shrink-0">
            <Glass darkMode={dark} className="p-2 md:sticky md:top-4">
              <nav className="flex flex-col gap-0.5">
                {visibleTabs.map(item => {
                  const active = tab === item.id;
                  return (
                    <button key={item.id} onClick={() => setTab(item.id)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-medium text-left transition-all duration-200
                        ${active
                          ? d
                            ? "bg-blue-500/15 text-blue-400 border border-blue-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                            : "bg-blue-500/10 text-blue-600 border border-blue-200"
                          : d
                            ? "text-white/38 hover:text-white/70 hover:bg-white/[0.04] border border-transparent"
                            : "text-slate-500 hover:text-slate-700 hover:bg-white/60 border border-transparent"
                        }`}>
                      <span className={active ? (d ? "text-blue-400" : "text-blue-500") : ""}>{item.icon}</span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.adminOnly && (
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border shrink-0
                          ${d ? "border-white/[0.08] text-white/18" : "border-slate-200 text-slate-300"}`}>
                          ADM
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Logged-in user */}
              <div className={`mx-2 mt-3 pt-3 border-t ${d ? "border-white/[0.06]" : "border-slate-100"}`}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-semibold truncate ${d ? "text-white/55" : "text-slate-600"}`}>
                      {currentUser?.name ?? "Raj Kumar"}
                    </p>
                    <p className={`text-[9px] truncate ${d ? "text-white/25" : "text-slate-400"}`}>{userRole}</p>
                  </div>
                </div>
              </div>
            </Glass>
          </aside>

          {/* Tab content */}
          <div className="flex-1 min-w-0">
            {tab === "profile"       && <ProfileTab       darkMode={dark} userRole={userRole} currentUser={currentUser} />}
            {tab === "security"      && <SecurityTab      darkMode={dark} />}
            {tab === "roles"         && <RolesTab         darkMode={dark} />}
            {tab === "team"          && <TeamTab          darkMode={dark} />}
            {tab === "workspace"     && <WorkspaceTab     darkMode={dark} />}
            {tab === "integrations"  && <IntegrationsTab  darkMode={dark} />}
            {tab === "notifications" && <NotificationsTab darkMode={dark} userRole={userRole} />}
            {tab === "billing"       && <BillingTab       darkMode={dark} />}
            {tab === "appearance"    && <AppearanceTab    darkMode={dark} setDarkMode={setDark} />}
          </div>

        </div>
      </div>
    </div>
  );
}