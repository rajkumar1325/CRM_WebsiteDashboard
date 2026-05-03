import React, { useState, useMemo } from "react";
import {
  Users, Shield, Crown, User, Plus, X, Mail,
  Phone, Briefcase, Search, Edit2, Trash2,
  CheckCircle2, Clock, Circle, Eye, EyeOff,
  ArrowUpDown, ChevronUp, ChevronDown, Key,
  BarChart2, FolderKanban, Star,
} from "lucide-react";

// ─── Mock team data ────────────────────────────────────────────────────────────
// Mirrors the `users` + `users_roles` tables from the EER diagram
const INITIAL_TEAM = [
  {
    id: "USR-01",
    username:    "Raj Kumar",
    email:       "raj.kumar@curiumcrm.com",
    phone:       "+91 98765 43210",
    role:        "Admin",
    status:      "Active",
    designation: "Founder & Admin",
    department:  "Management",
    joinDate:    "2023-01-15",
    projects:    ["Website Redesign", "Cloud Migration", "Mobile App Development"],
    tasks:       8,
    image:       null,
  },
  {
    id: "USR-02",
    username:    "Sarah Kim",
    email:       "sarah.kim@curiumcrm.com",
    phone:       "+1 (650) 555-2412",
    role:        "Leader",
    status:      "Active",
    designation: "Project Manager",
    department:  "Engineering",
    joinDate:    "2023-03-10",
    projects:    ["Website Redesign", "Mobile App Development"],
    tasks:       5,
    image:       null,
  },
  {
    id: "USR-03",
    username:    "Priya Sharma",
    email:       "priya@curiumcrm.com",
    phone:       "+1 (503) 555-9876",
    role:        "Leader",
    status:      "Active",
    designation: "Lead Designer",
    department:  "Design",
    joinDate:    "2023-05-20",
    projects:    ["CRM Analytics Dashboard", "Security Audit"],
    tasks:       6,
    image:       null,
  },
  {
    id: "USR-04",
    username:    "John Doe",
    email:       "john.doe@curiumcrm.com",
    phone:       "+1 (555) 123-4567",
    role:        "Leader",
    status:      "Active",
    designation: "Backend Lead",
    department:  "Engineering",
    joinDate:    "2023-04-01",
    projects:    ["Cloud Migration", "ERP Implementation"],
    tasks:       7,
    image:       null,
  },
  {
    id: "USR-05",
    username:    "Lucas Martínez",
    email:       "lucas.m@curiumcrm.com",
    phone:       "+52 (55) 1234-5678",
    role:        "Member",
    status:      "Active",
    designation: "Frontend Developer",
    department:  "Engineering",
    joinDate:    "2023-06-15",
    projects:    ["Cloud Migration", "CRM Analytics Dashboard"],
    tasks:       4,
    image:       null,
  },
  {
    id: "USR-06",
    username:    "Emma Wilson",
    email:       "emma.wilson@curiumcrm.com",
    phone:       "+1 (206) 555-0101",
    role:        "Member",
    status:      "Active",
    designation: "QA Engineer",
    department:  "Quality",
    joinDate:    "2023-08-01",
    projects:    ["Website Redesign"],
    tasks:       3,
    image:       null,
  },
  {
    id: "USR-07",
    username:    "Mona Das",
    email:       "mona.das@curiumcrm.com",
    phone:       "+91 124 555 8899",
    role:        "Member",
    status:      "Inactive",
    designation: "DevOps Engineer",
    department:  "Infrastructure",
    joinDate:    "2023-09-12",
    projects:    [],
    tasks:       0,
    image:       null,
  },
  {
    id: "USR-08",
    username:    "Kevin Hill",
    email:       "kevin.hill@curiumcrm.com",
    phone:       "+1 (416) 555-3300",
    role:        "Member",
    status:      "Active",
    designation: "Data Analyst",
    department:  "Analytics",
    joinDate:    "2023-11-05",
    projects:    ["CRM Analytics Dashboard"],
    tasks:       2,
    image:       null,
  },
];

// ─── Role config ───────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  Admin:  {
    bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.28)",
    text: "#fca5a5", dot: "#f87171",
    Icon: Crown,  label: "Admin",
    desc: "Full access to all modules, user management, billing and settings.",
  },
  Leader: {
    bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.28)",
    text: "#fcd34d", dot: "#fbbf24",
    Icon: Shield, label: "Leader (Manager)",
    desc: "Manages projects, assigns tasks, views team performance.",
  },
  Member: {
    bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.28)",
    text: "#6ee7b7", dot: "#34d399",
    Icon: User,   label: "Member (Employee)",
    desc: "Views assigned tasks, updates progress, limited access.",
  },
};

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Active:   { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.28)", text: "#6ee7b7", dot: "#34d399" },
  Inactive: { bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", text: "#94a3b8", dot: "#64748b" },
};

// ─── Departments list ──────────────────────────────────────────────────────────
const DEPARTMENTS = ["Management","Engineering","Design","Quality","Infrastructure","Analytics","Sales","HR"];

// ─── Empty form ────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  username: "", email: "", phone: "",
  role: "Member", status: "Active",
  designation: "", department: "Engineering",
  joinDate: new Date().toISOString().slice(0,10),
  password: "", confirmPassword: "",
};

// ─── Reusable badge ────────────────────────────────────────────────────────────
function Badge({ label, cfg }) {
  if (!cfg) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
      text-[10px] font-semibold whitespace-nowrap"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {label}
    </span>
  );
}

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent, darkMode, sub }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border
      transition-all duration-200 hover:scale-[1.02]"
      style={{
        background:     darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
        borderColor:    darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        backdropFilter: "blur(12px)",
      }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
        <Icon size={15} style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: darkMode ? "#475569" : "#94a3b8" }}>{label}</p>
        <p className="text-base font-bold leading-tight"
          style={{ color: darkMode ? "#e2e8f0" : "#0f172a" }}>{value}</p>
        {sub && <p className="text-[10px] mt-0.5"
          style={{ color: darkMode ? "#334155" : "#94a3b8" }}>{sub}</p>}
      </div>
    </div>
  );
}

// ─── Avatar initials ───────────────────────────────────────────────────────────
function Avatar({ name, id, size = 40, radius = 12 }) {
  const hue = (id.charCodeAt(id.length - 1) * 47) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: `hsl(${hue},55%,22%)`,
      color:      `hsl(${hue},75%,70%)`,
      border:     `1.5px solid hsl(${hue},55%,32%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 700, flexShrink: 0,
      boxShadow: `0 2px 10px hsla(${hue},55%,22%,0.4)`,
    }}>
      {name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
    </div>
  );
}

// ─── Glass input ───────────────────────────────────────────────────────────────
function GInput({ darkMode, label, children, required }) {
  const borderCol = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";
  return (
    <div>
      <label style={{ display: "block", fontSize: 10, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.12em",
        color: darkMode ? "#475569" : "#94a3b8", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#f87171", marginLeft: 2 }}>*</span>}
      </label>
      {React.cloneElement(children, {
        style: {
          width: "100%",
          background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
          border: `1px solid ${borderCol}`,
          borderRadius: 10, padding: "9px 12px",
          color: darkMode ? "#e2e8f0" : "#0f172a",
          fontSize: 13, outline: "none", fontFamily: "inherit",
          transition: "border-color 0.2s, box-shadow 0.2s",
          ...children.props.style,
        },
        onFocus: e => {
          e.target.style.borderColor = "rgba(99,102,241,0.6)";
          e.target.style.boxShadow   = "0 0 0 3px rgba(99,102,241,0.12)";
        },
        onBlur: e => {
          e.target.style.borderColor = borderCol;
          e.target.style.boxShadow   = "none";
        },
      })}
    </div>
  );
}

// ─── Member detail modal ───────────────────────────────────────────────────────
function MemberModal({ member, darkMode, onClose, onEdit }) {
  const rCfg = ROLE_CONFIG[member.role]   || ROLE_CONFIG.Member;
  const sCfg = STATUS_CONFIG[member.status] || STATUS_CONFIG.Inactive;
  const borderCol = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const textPrimary = darkMode ? "#e2e8f0" : "#0f172a";
  const textMuted   = darkMode ? "#64748b" : "#94a3b8";

  const rows = [
    { icon: Mail,         label: "Email",       value: member.email,       accent: "#818cf8" },
    { icon: Phone,        label: "Phone",       value: member.phone,       accent: "#34d399" },
    { icon: Briefcase,    label: "Department",  value: member.department,  accent: "#fb923c" },
    { icon: Star,         label: "Designation", value: member.designation, accent: "#f472b6" },
    { icon: FolderKanban, label: "Projects",    value: member.projects.join(", ") || "None", accent: "#38bdf8" },
    { icon: BarChart2,    label: "Active Tasks",value: `${member.tasks} tasks`, accent: "#a78bfa" },
    { icon: Clock,        label: "Joined",      value: member.joinDate,    accent: "#fbbf24" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          animation: "modalIn 0.25s cubic-bezier(0.4,0,0.2,1) forwards",
          background: darkMode ? "rgba(13,16,30,0.97)" : "rgba(255,255,255,0.97)",
          borderColor: rCfg.border,
          backdropFilter: "blur(40px)",
          boxShadow: `0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px ${rCfg.border}`,
        }}>

        {/* Header */}
        <div className="relative flex flex-col items-center pt-7 pb-5 px-6 border-b"
          style={{ borderColor: borderCol }}>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center
              justify-center transition-colors duration-200"
            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${borderCol}`, color: textMuted }}>
            <X size={14} />
          </button>

          <Avatar name={member.username} id={member.id} size={64} radius={16} />

          <h2 className="text-xl font-bold mt-3" style={{ color: textPrimary }}>
            {member.username}
          </h2>
          <p className="text-sm mt-0.5 mb-3" style={{ color: textMuted }}>
            {member.designation}
          </p>

          <div className="flex gap-2">
            <Badge label={member.role}   cfg={rCfg} />
            <Badge label={member.status} cfg={sCfg} />
          </div>
        </div>

        {/* Detail rows */}
        <div className="px-5 py-4 space-y-2 max-h-[50vh] overflow-y-auto">
          {rows.map(({ icon: Icon, label, value, accent }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl border"
              style={{
                background:  darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                borderColor: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${accent}18`, border: `1px solid ${accent}28` }}>
                <Icon size={13} style={{ color: accent }} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
                  style={{ color: textMuted }}>{label}</p>
                <p className="text-sm font-medium break-words" style={{ color: textPrimary }}>
                  {value || "—"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between px-5 py-4 border-t gap-3"
          style={{ borderColor: borderCol }}>
          <p className="text-[10px] self-center"
            style={{ color: textMuted }}>ID: {member.id}</p>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200"
              style={{ background: "transparent", borderColor, color: textMuted }}>
              Close
            </button>
            <button onClick={() => { onClose(); onEdit(member); }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                boxShadow:  "0 4px 16px rgba(99,102,241,0.4)",
              }}>
              Edit Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add / Edit form modal ─────────────────────────────────────────────────────
function FormModal({ editMember, darkMode, onClose, onSave }) {
  const [form,     setForm]     = useState(
    editMember
      ? { ...editMember, password: "", confirmPassword: "" }
      : { ...EMPTY_FORM }
  );
  const [showPw,   setShowPw]   = useState(false);
  const [pwError,  setPwError]  = useState("");

  const borderCol   = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const textPrimary = darkMode ? "#e2e8f0" : "#0f172a";
  const textMuted   = darkMode ? "#64748b" : "#94a3b8";

  const handleSave = () => {
    if (!form.username.trim() || !form.email.trim()) return;
    // Password validation only for new members
    if (!editMember) {
      if (!form.password) { setPwError("Password is required."); return; }
      if (form.password !== form.confirmPassword) { setPwError("Passwords do not match."); return; }
    }
    // eslint-disable-next-line no-unused-vars
    const { password, confirmPassword, ...rest } = form;
    onSave(rest);
    onClose();
  };

  const pwMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          animation: "modalIn 0.25s cubic-bezier(0.4,0,0.2,1) forwards",
          background:     darkMode ? "rgba(13,16,30,0.97)" : "rgba(255,255,255,0.97)",
          borderColor:    "rgba(99,102,241,0.28)",
          backdropFilter: "blur(40px)",
          boxShadow:      "0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.12)",
        }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: borderCol }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: textPrimary }}>
              {editMember ? "Edit Member" : "Add New Member"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: textMuted }}>
              {editMember ? `Editing ${editMember.username}` : "Register a new team member"}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${borderCol}`, color: textMuted }}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4 max-h-[65vh] overflow-y-auto">

          {/* Name + Email */}
          <div className="grid grid-cols-2 gap-3">
            <GInput darkMode={darkMode} label="Full Name" required>
              <input placeholder="e.g. Jane Smith"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })} />
            </GInput>
            <GInput darkMode={darkMode} label="Work Email" required>
              <input type="email" placeholder="jane@company.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </GInput>
          </div>

          {/* Phone + Join Date */}
          <div className="grid grid-cols-2 gap-3">
            <GInput darkMode={darkMode} label="Phone">
              <input placeholder="+91 98765 00000"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </GInput>
            <GInput darkMode={darkMode} label="Join Date">
              <input type="date"
                value={form.joinDate}
                onChange={e => setForm({ ...form, joinDate: e.target.value })} />
            </GInput>
          </div>

          {/* Designation + Department */}
          <div className="grid grid-cols-2 gap-3">
            <GInput darkMode={darkMode} label="Designation">
              <input placeholder="e.g. Frontend Developer"
                value={form.designation}
                onChange={e => setForm({ ...form, designation: e.target.value })} />
            </GInput>
            <GInput darkMode={darkMode} label="Department">
              <select value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </GInput>
          </div>

          {/* Role selection — visual cards */}
          <div>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.12em",
              color: darkMode ? "#475569" : "#94a3b8", marginBottom: 8 }}>
              Role (RBAC) <span style={{ color: "#f87171" }}>*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ROLE_CONFIG).map(([role, cfg]) => {
                const active = form.role === role;
                const RIcon  = cfg.Icon;
                return (
                  <div key={role} onClick={() => setForm({ ...form, role })}
                    className="p-3 rounded-xl border cursor-pointer transition-all duration-200 text-center"
                    style={{
                      background:  active ? cfg.bg     : "transparent",
                      borderColor: active ? cfg.border : borderCol,
                      boxShadow:   active ? `0 0 20px ${cfg.bg}` : "none",
                    }}>
                    <RIcon size={18} style={{ color: active ? cfg.text : textMuted, margin: "0 auto 4px" }} />
                    <p className="text-xs font-bold" style={{ color: active ? cfg.text : textMuted }}>{role}</p>
                    <p className="text-[9px] mt-0.5 leading-snug" style={{ color: darkMode ? "#334155" : "#94a3b8" }}>
                      {role === "Admin" ? "Full access" : role === "Leader" ? "Manage team" : "View & update"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.12em",
              color: darkMode ? "#475569" : "#94a3b8", marginBottom: 8 }}>
              Status
            </label>
            <div className="flex gap-2">
              {["Active", "Inactive"].map(s => {
                const cfg    = STATUS_CONFIG[s];
                const active = form.status === s;
                return (
                  <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200"
                    style={{
                      background:  active ? cfg.bg     : "transparent",
                      borderColor: active ? cfg.border : borderCol,
                      color:       active ? cfg.text   : textMuted,
                    }}>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Password — only for new members */}
          {!editMember && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Key size={12} style={{ color: "#818cf8" }} />
                <span className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: textMuted }}>Account Credentials</span>
              </div>
              <GInput darkMode={darkMode} label="Password" required>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    style={{ paddingRight: 36 }}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setPwError(""); }} />
                  <button type="button" onClick={() => setShowPw(x => !x)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: textMuted }}>
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </GInput>
              <GInput darkMode={darkMode} label="Confirm Password" required>
                <input type={showPw ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={e => { setForm({ ...form, confirmPassword: e.target.value }); setPwError(""); }} />
              </GInput>
              {/* Password match indicator */}
              {form.password && form.confirmPassword && (
                <p className="text-xs" style={{ color: pwMatch ? "#34d399" : "#f87171" }}>
                  {pwMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
              {pwError && <p className="text-xs" style={{ color: "#f87171" }}>{pwError}</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: borderCol }}>
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200"
            style={{ background: "transparent", borderColor: borderCol, color: textMuted }}>
            Cancel
          </button>
          <button onClick={handleSave}
            disabled={!form.username.trim() || !form.email.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
              transition-all duration-200 hover:brightness-110 hover:scale-[1.02]
              active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg,#6366f1,#06b6d4)",
              boxShadow:  "0 4px 16px rgba(99,102,241,0.4)",
            }}>
            {editMember ? "Save changes" : "Add member"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Team({ darkMode, searchQuery = "" }) {

  // ── State ──────────────────────────────────────────────────────────────────
  const [team,         setTeam]         = useState(INITIAL_TEAM);
  const [roleFilter,   setRoleFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter,   setDeptFilter]   = useState("all");
  const [viewMode,     setViewMode]     = useState("grid");   // "grid" | "table"
  const [sortKey,      setSortKey]      = useState("username");
  const [sortDir,      setSortDir]      = useState("asc");
  const [viewMember,   setViewMember]   = useState(null);    // detail modal
  const [formMember,   setFormMember]   = useState(null);    // null=hidden, false=new, obj=edit
  const [hoveredCard,  setHoveredCard]  = useState(null);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:    team.length,
    active:   team.filter(m => m.status === "Active").length,
    admins:   team.filter(m => m.role === "Admin").length,
    leaders:  team.filter(m => m.role === "Leader").length,
    members:  team.filter(m => m.role === "Member").length,
  }), [team]);

  // ── Unique departments ─────────────────────────────────────────────────────
  const allDepts = useMemo(() =>
    ["all", ...new Set(team.map(m => m.department))],
  [team]);

  // ── Filtered + sorted ─────────────────────────────────────────────────────
  const processed = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let data = team.filter(m => {
      const matchSearch =
        m.username.toLowerCase().includes(q)    ||
        m.email.toLowerCase().includes(q)       ||
        m.designation.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q);
      const matchRole   = roleFilter   === "all" || m.role       === roleFilter;
      const matchStatus = statusFilter === "all" || m.status     === statusFilter;
      const matchDept   = deptFilter   === "all" || m.department === deptFilter;
      return matchSearch && matchRole && matchStatus && matchDept;
    });
    // sort
    data = [...data].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return data;
  }, [team, searchQuery, roleFilter, statusFilter, deptFilter, sortKey, sortDir]);

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSave = (data) => {
    if (data.id) {
      setTeam(prev => prev.map(m => m.id === data.id ? { ...m, ...data } : m));
    } else {
      const newId = `USR-${String(team.length + 1).padStart(2, "0")}`;
      setTeam(prev => [...prev, { ...data, id: newId, projects: [], tasks: 0 }]);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Remove this member from the team?")) {
      setTeam(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleSort = (key) => {
    setSortDir(d => sortKey === key ? (d === "asc" ? "desc" : "asc") : "asc");
    setSortKey(key);
  };

  // ── Theme tokens ───────────────────────────────────────────────────────────
  const bg          = darkMode ? "#171821"                : "#fffbeb";
  const cardBg      = darkMode ? "rgba(33,34,45,0.82)"   : "rgba(255,255,255,0.85)";
  const borderCol   = darkMode ? "rgba(255,255,255,0.07)": "rgba(0,0,0,0.08)";
  const headerBg    = darkMode ? "rgba(15,17,28,0.95)"   : "rgba(241,245,249,0.95)";
  const textPrimary = darkMode ? "#e2e8f0"               : "#0f172a";
  const textMuted   = darkMode ? "#64748b"               : "#94a3b8";

  const CSS = `
    @keyframes modalIn {
      from { opacity:0; transform:scale(0.94) translateY(12px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(8px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .tm-card { animation: fadeUp 0.28s ease both; }
  `;

  return (
    <>
      <style>{CSS}</style>

      <div className="min-h-screen p-4 sm:p-6 transition-colors duration-300"
        style={{ background: bg, color: textPrimary }}>

        {/* ══════════════════════════════════════
            HEADER
        ══════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ color: textPrimary }}>Team</h1>
            <p className="text-sm mt-1" style={{ color: textMuted }}>
              {processed.length} of {team.length} members
              {roleFilter !== "all" && ` · ${roleFilter}`}
              {deptFilter !== "all" && ` · ${deptFilter}`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View toggle */}
            <div className="flex rounded-xl p-1 border"
              style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", borderColor: borderCol }}>
              {[{ key:"grid", label:"⊞ Grid" }, { key:"table", label:"≡ Table" }].map(({ key, label }) => (
                <button key={key} onClick={() => setViewMode(key)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{
                    background: viewMode === key ? "linear-gradient(135deg,#6366f1,#06b6d4)" : "transparent",
                    color:      viewMode === key ? "#fff" : textMuted,
                    boxShadow:  viewMode === key ? "0 2px 10px rgba(99,102,241,0.4)" : "none",
                  }}>{label}</button>
              ))}
            </div>

            {/* Add member button */}
            <button onClick={() => setFormMember(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                text-white transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                boxShadow:  "0 4px 20px rgba(99,102,241,0.35)",
              }}>
              <Plus size={15} /> Add Member
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════
            STAT CARDS
        ══════════════════════════════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <StatCard icon={Users}       label="Total"   value={stats.total}   accent="#818cf8" darkMode={darkMode} />
          <StatCard icon={CheckCircle2}label="Active"  value={stats.active}  accent="#34d399" darkMode={darkMode} />
          <StatCard icon={Crown}       label="Admins"  value={stats.admins}  accent="#f87171" darkMode={darkMode} />
          <StatCard icon={Shield}      label="Leaders" value={stats.leaders} accent="#fbbf24" darkMode={darkMode} />
          <StatCard icon={User}        label="Members" value={stats.members} accent="#a78bfa" darkMode={darkMode} />
        </div>

        {/* ══════════════════════════════════════
            FILTER BAR
        ══════════════════════════════════════ */}
        <div className="flex flex-wrap items-center gap-2 mb-5">

          {/* Role pills */}
          <div className="flex gap-1.5">
            {["all", "Admin", "Leader", "Member"].map((r) => {
              const cfg    = ROLE_CONFIG[r];
              const active = roleFilter === r;
              return (
                <button key={r} onClick={() => setRoleFilter(r)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold
                    transition-all duration-200 border"
                  style={{
                    background:  active ? (cfg?.bg  ?? "rgba(99,102,241,0.15)") : "transparent",
                    borderColor: active ? (cfg?.border ?? "rgba(99,102,241,0.35)") : borderCol,
                    color:       active ? (cfg?.text   ?? "#818cf8") : textMuted,
                  }}>
                  {r === "all" ? "All Roles" : r}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-px h-5" style={{ background: borderCol }} />

          {/* Status pills */}
          <div className="flex gap-1.5">
            {["all", "Active", "Inactive"].map((s) => {
              const cfg    = STATUS_CONFIG[s];
              const active = statusFilter === s;
              return (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold
                    transition-all duration-200 border"
                  style={{
                    background:  active ? (cfg?.bg  ?? "rgba(99,102,241,0.15)") : "transparent",
                    borderColor: active ? (cfg?.border ?? "rgba(99,102,241,0.35)") : borderCol,
                    color:       active ? (cfg?.text   ?? "#818cf8") : textMuted,
                  }}>
                  {s === "all" ? "All Status" : s}
                </button>
              );
            })}
          </div>

          {/* Dept filter */}
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold border outline-none"
            style={{
              background:  darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              borderColor: borderCol, color: textMuted, cursor: "pointer",
            }}>
            {allDepts.map(d => (
              <option key={d} value={d}>{d === "all" ? "All Departments" : d}</option>
            ))}
          </select>

          {/* Sort */}
          <div className="ml-auto flex gap-2">
            {[{ key:"username", label:"Name" }, { key:"role", label:"Role" }, { key:"tasks", label:"Tasks" }].map(({ key, label }) => (
              <button key={key} onClick={() => handleSort(key)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs
                  font-semibold transition-all duration-200 border"
                style={{
                  background:  sortKey === key ? "rgba(99,102,241,0.12)" : "transparent",
                  borderColor: sortKey === key ? "rgba(99,102,241,0.3)"  : borderCol,
                  color:       sortKey === key ? "#818cf8"               : textMuted,
                }}>
                {label}
                {sortKey === key
                  ? (sortDir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />)
                  : <ArrowUpDown size={10} className="opacity-40" />}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            GRID VIEW
        ══════════════════════════════════════ */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {processed.map((member, idx) => {
              const rCfg  = ROLE_CONFIG[member.role]     || ROLE_CONFIG.Member;
              const sCfg  = STATUS_CONFIG[member.status] || STATUS_CONFIG.Inactive;
              const isHov = hoveredCard === member.id;
              const RIcon = rCfg.Icon;

              return (
                <div key={member.id}
                  className="tm-card rounded-2xl border flex flex-col transition-all duration-250 cursor-pointer"
                  style={{
                    animationDelay: `${idx * 0.04}s`,
                    background:           cardBg,
                    borderColor:          isHov ? rCfg.border : borderCol,
                    backdropFilter:       "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: isHov
                      ? `0 8px 40px rgba(0,0,0,0.25), 0 0 0 1px ${rCfg.border}`
                      : darkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.07)",
                    transform: isHov ? "translateY(-3px)" : "translateY(0)",
                  }}
                  onMouseEnter={() => setHoveredCard(member.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setViewMember(member)}>

                  {/* Card header */}
                  <div className="flex flex-col items-center pt-6 pb-4 px-4 border-b"
                    style={{ borderColor: borderCol }}>
                    <Avatar name={member.username} id={member.id} size={52} radius={14} />
                    <h2 className="font-bold text-sm mt-3 text-center" style={{ color: textPrimary }}>
                      {member.username}
                    </h2>
                    <p className="text-xs mt-0.5 text-center" style={{ color: textMuted }}>
                      {member.designation}
                    </p>
                    <div className="flex gap-2 mt-2.5">
                      <Badge label={member.role}   cfg={rCfg} />
                      <Badge label={member.status} cfg={sCfg} />
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-4 py-3 flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                      <Mail size={10} style={{ color: "#818cf8", flexShrink: 0 }} />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                      <Briefcase size={10} style={{ color: "#fb923c", flexShrink: 0 }} />
                      <span>{member.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                      <FolderKanban size={10} style={{ color: "#34d399", flexShrink: 0 }} />
                      <span>{member.projects.length} project{member.projects.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                      <BarChart2 size={10} style={{ color: "#f472b6", flexShrink: 0 }} />
                      <span>{member.tasks} active task{member.tasks !== 1 ? "s" : ""}</span>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="flex items-center justify-between px-4 py-3 border-t rounded-b-2xl"
                    style={{
                      borderColor: borderCol,
                      background: darkMode ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.02)",
                    }}>
                    <span className="text-[10px] font-mono" style={{ color: textMuted }}>
                      {member.id}
                    </span>
                    <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setFormMember(member)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border
                          transition-all duration-200 hover:scale-110"
                        style={{
                          background: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.25)",
                          color: "#818cf8",
                        }}>
                        <Edit2 size={11} />
                      </button>
                      <button onClick={() => handleDelete(member.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border
                          transition-all duration-200 hover:scale-110"
                        style={{
                          background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.2)",
                          color: "#f87171",
                        }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {processed.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <Search size={24} style={{ color: "#818cf8" }} />
                </div>
                <p className="font-semibold text-lg" style={{ color: textPrimary }}>No members found</p>
                <p className="text-sm" style={{ color: textMuted }}>Adjust your filters or add a new member</p>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            TABLE VIEW
        ══════════════════════════════════════ */}
        {viewMode === "table" && (
          <div className="rounded-2xl border overflow-hidden"
            style={{
              background:           cardBg,
              borderColor:          borderCol,
              backdropFilter:       "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: darkMode ? "0 8px 40px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)",
            }}>

            {/* Table header */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr style={{ background: headerBg, borderBottom: `1px solid ${borderCol}` }}>
                    {["Member","Role","Status","Department","Projects","Tasks","Joined","Actions"].map((h, i) => (
                      <th key={h} className="py-3 px-4 text-left font-semibold text-[10px]
                        tracking-widest uppercase whitespace-nowrap"
                        style={{ color: textMuted }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {processed.map((member, idx) => {
                    const rCfg = ROLE_CONFIG[member.role]     || ROLE_CONFIG.Member;
                    const sCfg = STATUS_CONFIG[member.status] || STATUS_CONFIG.Inactive;
                    return (
                      <tr key={member.id}
                        className="transition-colors duration-150 border-b cursor-pointer"
                        style={{ borderColor: borderCol }}
                        onClick={() => setViewMember(member)}
                        onMouseEnter={e => e.currentTarget.style.background = darkMode ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                        {/* Member */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={member.username} id={member.id} size={32} radius={9} />
                            <div>
                              <p className="font-semibold text-xs" style={{ color: textPrimary }}>{member.username}</p>
                              <p className="text-[10px]" style={{ color: textMuted }}>{member.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4"><Badge label={member.role}   cfg={rCfg} /></td>
                        <td className="py-3 px-4"><Badge label={member.status} cfg={sCfg} /></td>
                        <td className="py-3 px-4 text-xs" style={{ color: textMuted }}>{member.department}</td>
                        <td className="py-3 px-4 text-xs" style={{ color: textMuted }}>{member.projects.length}</td>
                        <td className="py-3 px-4 text-xs" style={{ color: textMuted }}>{member.tasks}</td>
                        <td className="py-3 px-4 text-xs font-mono" style={{ color: textMuted }}>{member.joinDate}</td>

                        {/* Actions */}
                        <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-1.5">
                            <button onClick={() => setFormMember(member)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold border
                                transition-all duration-200 hover:scale-105"
                              style={{ background: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.25)", color: "#818cf8" }}>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(member.id)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold border
                                transition-all duration-200 hover:scale-105"
                              style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.2)", color: "#f87171" }}>
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="flex items-center justify-between px-4 py-3 text-xs border-t"
              style={{ borderColor: borderCol, color: textMuted, background: headerBg }}>
              <span>{processed.length} results</span>
              <span>CuriumCRM · Team</span>
            </div>
          </div>
        )}

        {/* ── Role legend ── */}
        <div className="mt-6 rounded-2xl border p-4"
          style={{ background: cardBg, borderColor: borderCol, backdropFilter: "blur(12px)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3"
            style={{ color: textMuted }}>RBAC — Role Permissions</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(ROLE_CONFIG).map(([role, cfg]) => {
              const RIcon = cfg.Icon;
              return (
                <div key={role} className="flex items-start gap-3 p-3 rounded-xl border"
                  style={{ background: cfg.bg, borderColor: cfg.border }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${cfg.dot}20`, border: `1px solid ${cfg.border}` }}>
                    <RIcon size={15} style={{ color: cfg.text }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: cfg.text }}>{cfg.label}</p>
                    <p className="text-[10px] mt-0.5 leading-snug" style={{ color: darkMode ? "#475569" : "#94a3b8" }}>
                      {cfg.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Detail modal ── */}
      {viewMember && (
        <MemberModal
          member={viewMember}
          darkMode={darkMode}
          onClose={() => setViewMember(null)}
          onEdit={(m) => setFormMember(m)}
        />
      )}

      {/* ── Add/Edit form modal ── */}
      {formMember !== null && (
        <FormModal
          editMember={formMember || null}
          darkMode={darkMode}
          onClose={() => setFormMember(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
