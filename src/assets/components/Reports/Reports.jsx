import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── DATA ──────────────────────────────────────────────────────────────────────

// Monthly revenue trend data
const revenueData = [
  { month: "Aug", revenue: 28000, deals: 18 },
  { month: "Sep", revenue: 32000, deals: 22 },
  { month: "Oct", revenue: 27000, deals: 15 },
  { month: "Nov", revenue: 38000, deals: 29 },
  { month: "Dec", revenue: 41000, deals: 33 },
  { month: "Jan", revenue: 45000, deals: 35 },
];

// Lead source breakdown for pie chart
const leadSourceData = [
  { name: "Referral",      value: 38 },
  { name: "Website",       value: 27 },
  { name: "Social Media",  value: 19 },
  { name: "Cold Call",     value: 16 },
];

// Weekly deal activity bar chart
const weeklyDeals = [
  { day: "Mon", won: 4, lost: 1 },
  { day: "Tue", won: 7, lost: 2 },
  { day: "Wed", won: 5, lost: 3 },
  { day: "Thu", won: 9, lost: 1 },
  { day: "Fri", won: 6, lost: 2 },
  { day: "Sat", won: 3, lost: 0 },
  { day: "Sun", won: 1, lost: 1 },
];

// Recent activity feed
const recentActivity = [
  { id: 1, type: "deal_won",  user: "Raj Kumar",      msg: "Closed deal with TechCorp Ltd",  time: "2m ago",  amount: "$3,200" },
  { id: 2, type: "lead",      user: "Anshika A.",     msg: "New lead from GreenLeaf Systems", time: "18m ago", amount: null },
  { id: 3, type: "task",      user: "Sarah Kim",      msg: "Task overdue: Q1 Proposal",      time: "1h ago",  amount: null },
  { id: 4, type: "deal_lost", user: "John Doe",       msg: "Deal lost – BrightFuture Ltd",   time: "3h ago",  amount: "-$1,500" },
  { id: 5, type: "customer",  user: "Lucas Martinez", msg: "Customer upgraded subscription", time: "5h ago",  amount: "$800" },
];

// Pie chart color palette (cool glass-tinted)
const PIE_COLORS = ["#60a5fa", "#a78bfa", "#34d399", "#f472b6"];

// ─── GLASSMORPHISM CARD ─────────────────────────────────────────────────────────
/**
 * GlassCard: Reusable frosted-glass card container.
 * Accepts className for custom sizing / grid placement.
 */
const GlassCard = ({ children, className = "" }) => (
  <div
    className={`
      rounded-2xl border border-white/10
      bg-white/5 backdrop-blur-xl
      shadow-[0_8px_32px_rgba(0,0,0,0.4)]
      transition-all duration-300 hover:bg-white/8 hover:border-white/20
      ${className}
    `}
  >
    {children}
  </div>
);

// ─── STAT CHIP ──────────────────────────────────────────────────────────────────
/**
 * StatChip: Small inline badge showing a percent change.
 * Green for positive, red for negative.
 */
const StatChip = ({ value }) => {
  const positive = value >= 0;
  return (
    <span
      className={`
        inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
        ${positive
          ? "bg-emerald-500/20 text-emerald-300"
          : "bg-rose-500/20 text-rose-300"}
      `}
    >
      {positive ? "▲" : "▼"} {Math.abs(value)}%
    </span>
  );
};

// ─── METRIC CARD ───────────────────────────────────────────────────────────────
/**
 * MetricCard: Individual KPI tile (Total Leads, Revenue, etc.)
 * Props: icon, label, value, change (%), accentColor (tailwind class)
 */
const MetricCard = ({ icon, label, value, change, accentColor }) => (
  <GlassCard className="p-5 flex flex-col gap-3">
    {/* Icon + label row */}
    <div className="flex items-center justify-between">
      <span className={`text-2xl ${accentColor}`}>{icon}</span>
      <StatChip value={change} />
    </div>

    {/* Primary value */}
    <div>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">{label}</p>
    </div>

    {/* Decorative shimmer bar */}
    <div className="h-[2px] rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </GlassCard>
);

// ─── ACTIVITY ICON ─────────────────────────────────────────────────────────────
/** Maps activity type → emoji + colour class */
const activityMeta = {
  deal_won:  { icon: "💰", color: "text-emerald-400" },
  lead:      { icon: "📥", color: "text-sky-400" },
  task:      { icon: "⚠️", color: "text-amber-400" },
  deal_lost: { icon: "❌", color: "text-rose-400" },
  customer:  { icon: "⬆️", color: "text-violet-400" },
};

// ─── CUSTOM TOOLTIP ────────────────────────────────────────────────────────────
/** Styled tooltip for Recharts charts */
const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl px-3 py-2 text-xs text-white/80 shadow-lg">
      <p className="font-semibold mb-1 text-white">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function CRMReportsDashboard() {
  // Simulates live "last updated" timestamp
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeNav, setActiveNav] = useState("Reports");

  // Refresh timestamp every 60s to simulate live data feel
  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // ─── NAV ITEMS ───────────────────────────────────────────────────────────────
  const navItems = ["Home", "Leads", "Customers", "Support", "Deals", "Reports", "Tasks"];

  return (
    /*
     * ROOT: Deep navy + subtle mesh gradient background.
     * Mimics the dark Apple aesthetic with warm depth.
     */
    <div
      className="min-h-screen text-white font-sans"
      style={{
        background: "radial-gradient(ellipse at 20% 20%, #0f1f3d 0%, #070d1a 60%, #0a0a15 100%)",
        fontFamily: "'DM Sans', 'SF Pro Display', system-ui, sans-serif",
      }}
    >
      {/* ── Ambient glow orbs (purely decorative) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-violet-500/8 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-cyan-500/6 blur-[80px]" />
      </div>

      <div className="relative z-10 flex">

        {/* ════════════════════════════════════════════════════════════════════════
            SIDEBAR
        ════════════════════════════════════════════════════════════════════════ */}
        <aside
          className="w-52 min-h-screen flex flex-col py-6 px-3 gap-1 shrink-0"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Brand logo */}
          <div className="flex items-center gap-2 px-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-sm font-bold shadow-lg">
              C
            </div>
            <span className="text-sm font-semibold text-white/90 tracking-wide">CURIEM CRM</span>
          </div>

          {/* User pill */}
          <div className="flex items-center gap-2 px-3 mb-6">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-xs font-bold">
              R
            </div>
            <div>
              <p className="text-xs font-medium text-white/80">Raj Kumar</p>
              <p className="text-[10px] text-white/35">Admin</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const icons = {
                Home: "⌂", Leads: "◈", Customers: "◉", Support: "◎",
                Deals: "◇", Reports: "▤", Tasks: "☑",
              };
              const isActive = item === activeNav;
              return (
                <button
                  key={item}
                  onClick={() => setActiveNav(item)}
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium
                    transition-all duration-200 text-left w-full
                    ${isActive
                      ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"}
                  `}
                >
                  <span className="text-sm">{icons[item]}</span>
                  {item}
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_#60a5fa]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Log out at bottom */}
          <div className="mt-auto px-3">
            <button className="flex items-center gap-2 text-xs text-white/30 hover:text-rose-400 transition-colors w-full py-2">
              <span>⏻</span> Log out
            </button>
          </div>
        </aside>

        {/* ════════════════════════════════════════════════════════════════════════
            MAIN CONTENT
        ════════════════════════════════════════════════════════════════════════ */}
        <main className="flex-1 px-8 py-8 overflow-x-hidden">

          {/* ── Top Bar ── */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-blue-400">▤</span> Reports Dashboard
              </h1>
              <p className="text-xs text-white/35 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            {/* Search bar + icons */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-white/40"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span>⌕</span>
                <span>Search now…</span>
              </div>
              {["🔔", "☀", "⚙", "👤"].map((icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* ── KPI METRIC TILES ── */}
          <section className="grid grid-cols-4 gap-4 mb-6">
            <MetricCard icon="◈" label="Total Leads"       value="145"     change={12}  accentColor="text-sky-400" />
            <MetricCard icon="◉" label="Total Customers"   value="87"      change={8}   accentColor="text-violet-400" />
            <MetricCard icon="↗" label="Deals Won"         value="35"      change={15}  accentColor="text-emerald-400" />
            <MetricCard icon="↘" label="Deals Lost"        value="12"      change={-4}  accentColor="text-rose-400" />
          </section>

          {/* ── SECONDARY METRIC TILES ── */}
          <section className="grid grid-cols-3 gap-4 mb-6">
            {/* Total Revenue */}
            <GlassCard className="p-5 col-span-1">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Total Revenue</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-violet-300 bg-clip-text text-transparent">
                $45,000
              </p>
              <p className="text-xs text-white/30 mt-2">↑ vs last quarter</p>
            </GlassCard>

            {/* Conversion Rate */}
            <GlassCard className="p-5 col-span-1">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Conversion Rate</p>
              {/* Circular gauge mock */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  <svg viewBox="0 0 36 36" className="rotate-[-90deg]">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15" fill="none"
                      stroke="url(#convGrad)" strokeWidth="3"
                      strokeDasharray={`${24 * 0.942} ${100}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="convGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-emerald-300">
                    24%
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-300">24%</p>
                  <p className="text-xs text-white/30">Leads → Customers</p>
                </div>
              </div>
            </GlassCard>

            {/* Active Deals + Avg Deal Value */}
            <GlassCard className="p-5 col-span-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest">Avg Deal Value</p>
                <p className="text-2xl font-bold text-violet-300 mt-1">$1,285</p>
              </div>
              <div className="h-px bg-white/5 my-3" />
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest">Active Deals</p>
                <p className="text-2xl font-bold text-amber-300 mt-1">40</p>
              </div>
            </GlassCard>
          </section>

          {/* ── CHARTS ROW ── */}
          <section className="grid grid-cols-3 gap-4 mb-6">

            {/* Revenue Trend – Area Chart (spans 2 cols) */}
            <GlassCard className="p-5 col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">Revenue Trend</h2>
                  <p className="text-xs text-white/35">Last 6 months</p>
                </div>
                <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded-lg">Monthly</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    {/* Gradient fill for area chart */}
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<GlassTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#60a5fa" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: "#60a5fa" }} />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Lead Source – Pie Chart */}
            <GlassCard className="p-5 col-span-1">
              <h2 className="text-sm font-semibold text-white mb-1">Lead Sources</h2>
              <p className="text-xs text-white/35 mb-4">Distribution</p>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%" cy="50%"
                    innerRadius={40} outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {leadSourceData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} opacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip content={<GlassTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex flex-col gap-1 mt-2">
                {leadSourceData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-white/50">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: PIE_COLORS[i] }} />
                      {item.name}
                    </div>
                    <span className="text-white/70 font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>

          {/* ── BOTTOM ROW: Bar Chart + Activity Feed ── */}
          <section className="grid grid-cols-5 gap-4">

            {/* Weekly Deal Activity – Bar Chart (3 cols) */}
            <GlassCard className="p-5 col-span-3">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">Weekly Deal Activity</h2>
                  <p className="text-xs text-white/35">Won vs Lost</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={weeklyDeals} barGap={4} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<GlassTooltip />} />
                  <Bar dataKey="won"  name="Won"  fill="#34d399" radius={[4,4,0,0]} opacity={0.85} />
                  <Bar dataKey="lost" name="Lost" fill="#f472b6" radius={[4,4,0,0]} opacity={0.85} />
                  <Legend
                    iconType="circle"
                    iconSize={7}
                    wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", paddingTop: "8px" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Recent Activity Feed (2 cols) */}
            <GlassCard className="p-5 col-span-2 flex flex-col">
              <h2 className="text-sm font-semibold text-white mb-4">Recent Activity</h2>

              <div className="flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: 220 }}>
                {recentActivity.map((item) => {
                  const meta = activityMeta[item.type];
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {/* Type icon badge */}
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-sm shrink-0">
                        {meta.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white/80 truncate">{item.msg}</p>
                        <p className="text-[10px] text-white/35 mt-0.5">{item.user} · {item.time}</p>
                      </div>

                      {/* Amount badge (if applicable) */}
                      {item.amount && (
                        <span
                          className={`text-xs font-semibold shrink-0 ${
                            item.amount.startsWith("-") ? "text-rose-400" : "text-emerald-400"
                          }`}
                        >
                          {item.amount}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* View all link */}
              <button className="mt-auto pt-3 text-xs text-blue-400/70 hover:text-blue-300 transition-colors text-left">
                View all activity →
              </button>
            </GlassCard>

          </section>

        </main>
      </div>
    </div>
  );
}
