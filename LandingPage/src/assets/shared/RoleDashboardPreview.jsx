// ─── RoleDashboardPreview.jsx ──────────────────────────────────────────────────
// Interactive mini-dashboard preview shown in the "Role-Based Dashboards" feature tab.
// Props: role — "admin" | "manager" | "employee"

const ROLE_CONFIGS = {
  admin: {
    gradient: "from-red-500/20 to-red-900/10",
    accent:   "#f87171",
    accentBg: "rgba(248,113,113,0.12)",
    border:   "rgba(248,113,113,0.25)",
    metrics: [
      { label: "Total Projects", value: "24",    delta: "+3 this week" },
      { label: "Active Users",   value: "18",    delta: "All online"   },
      { label: "Overdue Tasks",  value: "5",     delta: "2 critical"   },
      { label: "Revenue (MRR)", value: "₹2.4L", delta: "+12%"         },
    ],
    desc: "Full system visibility: users, billing, audit logs, and all project analytics.",
  },
  manager: {
    gradient: "from-amber-500/20 to-amber-900/10",
    accent:   "#fbbf24",
    accentBg: "rgba(251,191,36,0.12)",
    border:   "rgba(251,191,36,0.25)",
    metrics: [
      { label: "My Projects",   value: "6",    delta: "2 due soon"  },
      { label: "Team Tasks",    value: "41",   delta: "12 pending"  },
      { label: "On-time Rate",  value: "87%",  delta: "↑ from 80%" },
      { label: "Client Health", value: "Good", delta: "4/6 green"  },
    ],
    desc: "Assign tasks, track team progress, and manage client deliverables.",
  },
  employee: {
    gradient: "from-emerald-500/20 to-emerald-900/10",
    accent:   "#34d399",
    accentBg: "rgba(52,211,153,0.12)",
    border:   "rgba(52,211,153,0.25)",
    metrics: [
      { label: "My Tasks Today", value: "7", delta: "3 completed" },
      { label: "In Progress",    value: "2", delta: "Due by 5 PM" },
      { label: "Upcoming",       value: "5", delta: "Next 3 days" },
      { label: "Meetings",       value: "1", delta: "2:00 PM"     },
    ],
    desc: "Clear personal task list, deadlines, and calendar — no noise.",
  },
};

export default function RoleDashboardPreview({ role }) {
  const cfg = ROLE_CONFIGS[role] || ROLE_CONFIGS.manager;

  return (
    <div
      className={`rounded-xl border p-4 bg-gradient-to-br ${cfg.gradient} backdrop-blur-xl transition-all duration-500`}
      style={{ borderColor: cfg.border }}
    >
      {/* Title */}
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: cfg.accent }}>
        {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
      </p>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {cfg.metrics.map((m, i) => (
          <div key={i} className="rounded-lg p-2"
            style={{ background: cfg.accentBg, border: `1px solid ${cfg.border}` }}>
            <p className="text-[9px] text-white/40 uppercase tracking-wide">{m.label}</p>
            <p className="text-sm font-bold text-white/90">{m.value}</p>
            <p className="text-[9px] mt-0.5" style={{ color: cfg.accent }}>{m.delta}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="text-[10px] text-white/40 leading-relaxed">{cfg.desc}</p>
    </div>
  );
}
