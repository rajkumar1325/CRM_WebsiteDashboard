import React, { useState, useMemo } from "react";
import { projectsData } from "../../MockData/MockData.jsx";
import { customersData } from "../../MockData/MockData.jsx";
import {
  FolderKanban, Users, DollarSign, CheckCircle2,
  Clock, Circle, X, Calendar, User, Building2,
  TrendingUp, Layers, ChevronRight, ArrowLeft,
  Search, ArrowUpDown, ChevronUp, ChevronDown,
  Tag, Briefcase, Target,
} from "lucide-react";

// ─── Status config ─────────────────────────────────────────────────────────────
const PROJECT_STATUS = {
  Active:    { bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.28)",  text: "#6ee7b7", dot: "#34d399" },
  Completed: { bg: "rgba(129,140,248,0.12)", border: "rgba(129,140,248,0.28)", text: "#a5b4fc", dot: "#818cf8" },
  Pending:   { bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.28)",  text: "#fcd34d", dot: "#fbbf24" },
  Cancelled: { bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.28)", text: "#fca5a5", dot: "#f87171" },
};

const TASK_STATUS = {
  completed:   { bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.28)",  text: "#6ee7b7", dot: "#34d399", Icon: CheckCircle2 },
  in_progress: { bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.28)",  text: "#fcd34d", dot: "#fbbf24", Icon: Clock },
  pending:     { bg: "rgba(148,163,184,0.1)",  border: "rgba(148,163,184,0.2)",  text: "#94a3b8", dot: "#64748b", Icon: Circle },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Calculate project progress % from its tasks
const calcProgress = (tasks = []) => {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.status === "completed").length;
  return Math.round((done / tasks.length) * 100);
};

// Days remaining until endDate (negative = overdue)
const daysRemaining = (endDate) => {
  const diff = new Date(endDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Unique team members across all tasks
const getTeam = (tasks = []) => {
  const set = new Set(tasks.flatMap((t) => t.implementers));
  return [...set];
};

// ─── Reusable badge ───────────────────────────────────────────────────────────
function Badge({ label, cfg }) {
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-[10px] font-semibold whitespace-nowrap"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {label}
    </span>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, darkMode, showLabel = true }) {
  const color = value >= 80 ? "#34d399" : value >= 40 ? "#fbbf24" : "#f87171";
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: darkMode ? "#475569" : "#94a3b8" }}>Progress</span>
          <span className="text-[11px] font-bold" style={{ color }}>{value}%</span>
        </div>
      )}
      <div className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)" }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: `linear-gradient(90deg,${color}88,${color})` }} />
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
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
        {sub && <p className="text-[10px] mt-0.5" style={{ color: darkMode ? "#334155" : "#94a3b8" }}>{sub}</p>}
      </div>
    </div>
  );
}

// ─── Detail row for modal/detail panel ───────────────────────────────────────
function DetailRow({ icon: Icon, label, value, accent = "#818cf8", darkMode }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border"
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
          style={{ color: darkMode ? "#475569" : "#94a3b8" }}>{label}</p>
        <p className="text-sm font-medium break-words"
          style={{ color: darkMode ? "#cbd5e1" : "#1e293b" }}>{value || "—"}</p>
      </div>
    </div>
  );
}

// ─── Avatar stack for team members ───────────────────────────────────────────
function AvatarStack({ members, darkMode }) {
  const show = members.slice(0, 4);
  const rest = members.length - 4;
  return (
    <div className="flex items-center -space-x-2">
      {show.map((m, i) => (
        <div key={i} title={m}
          className="w-6 h-6 rounded-full flex items-center justify-center
            text-[9px] font-bold border-2 flex-shrink-0"
          style={{
            background: `hsl(${(i * 60 + 200) % 360},55%,22%)`,
            color:      `hsl(${(i * 60 + 200) % 360},75%,70%)`,
            borderColor: darkMode ? "#21222d" : "#f1f5f9",
            zIndex: show.length - i,
          }}>
          {m.split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase()}
        </div>
      ))}
      {rest > 0 && (
        <div className="w-6 h-6 rounded-full flex items-center justify-center
          text-[9px] font-bold border-2"
          style={{
            background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            color: darkMode ? "#64748b" : "#94a3b8",
            borderColor: darkMode ? "#21222d" : "#f1f5f9",
          }}>
          +{rest}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Projects({ darkMode, searchQuery = "" }) {

  // ── State ──────────────────────────────────────────────────────────────────
  const [selectedProject, setSelectedProject] = useState(null); // detail view
  const [statusFilter,    setStatusFilter]    = useState("all");
  const [sortKey,         setSortKey]         = useState("dealValue");
  const [sortDir,         setSortDir]         = useState("desc");
  const [hoveredCard,     setHoveredCard]     = useState(null);
  const [taskFilter,      setTaskFilter]      = useState("all"); // inside detail view

  // ── Build client lookup map  {clientId → client object} ───────────────────
  const clientMap = useMemo(() => {
    const map = {};
    customersData.forEach((c) => { map[c.id] = c; });
    return map;
  }, []);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:     projectsData.length,
    active:    projectsData.filter((p) => p.status === "Active").length,
    completed: projectsData.filter((p) => p.status === "Completed").length,
    pending:   projectsData.filter((p) => p.status === "Pending").length,
    revenue:   projectsData.reduce((s, p) => s + (p.dealValue || 0), 0),
  }), []);

  // ── Filtered + sorted projects ─────────────────────────────────────────────
  const processed = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let data = projectsData.filter((p) => {
      const client = clientMap[p.clientId];
      const matchSearch =
        p.name.toLowerCase().includes(q)             ||
        p.description.toLowerCase().includes(q)      ||
        p.originator.toLowerCase().includes(q)       ||
        (client?.name.toLowerCase().includes(q))     ||
        (client?.company.toLowerCase().includes(q));
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });

    // sort
    data = [...data].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return data;
  }, [searchQuery, statusFilter, sortKey, sortDir, clientMap]);

  // ── Sort toggle ────────────────────────────────────────────────────────────
  const handleSort = (key) => {
    setSortDir((d) => (sortKey === key ? (d === "asc" ? "desc" : "asc") : "desc"));
    setSortKey(key);
  };

  // ── Theme tokens ───────────────────────────────────────────────────────────
  const bg          = darkMode ? "#171821"                : "#fffbeb";
  const cardBg      = darkMode ? "rgba(33,34,45,0.82)"   : "rgba(255,255,255,0.85)";
  const borderCol   = darkMode ? "rgba(255,255,255,0.07)": "rgba(0,0,0,0.08)";
  const headerBg    = darkMode ? "rgba(15,17,28,0.95)"   : "rgba(241,245,249,0.95)";
  const textPrimary = darkMode ? "#e2e8f0"               : "#0f172a";
  const textMuted   = darkMode ? "#64748b"               : "#94a3b8";

  // ── Derived detail-view task list (filtered) ────────────────────────────
  const detailTasks = useMemo(() => {
    if (!selectedProject) return [];
    return selectedProject.tasks.filter(
      (t) => taskFilter === "all" || t.status === taskFilter
    );
  }, [selectedProject, taskFilter]);

  // ══════════════════════════════════════════════════════════════════════════
  // PROJECT DETAIL VIEW  (shown when a project card is clicked)
  // ══════════════════════════════════════════════════════════════════════════
  if (selectedProject) {
    const p       = selectedProject;
    const client  = clientMap[p.clientId];
    const sCfg    = PROJECT_STATUS[p.status] || PROJECT_STATUS.Pending;
    const prog    = calcProgress(p.tasks);
    const days    = daysRemaining(p.endDate);
    const team    = getTeam(p.tasks);

    // Task counts
    const taskCounts = {
      total:       p.tasks.length,
      completed:   p.tasks.filter((t) => t.status === "completed").length,
      in_progress: p.tasks.filter((t) => t.status === "in_progress").length,
      pending:     p.tasks.filter((t) => t.status === "pending").length,
    };

    return (
      <div className="min-h-screen p-4 sm:p-6 transition-colors duration-300"
        style={{ background: bg, color: textPrimary }}>

        {/* ── Back button ── */}
        <button
          onClick={() => { setSelectedProject(null); setTaskFilter("all"); }}
          className="flex items-center gap-2 mb-5 text-sm font-semibold px-4 py-2
            rounded-xl border transition-all duration-200 hover:scale-[1.02]"
          style={{
            background:  "rgba(99,102,241,0.08)",
            borderColor: "rgba(99,102,241,0.2)",
            color:       "#818cf8",
          }}>
          <ArrowLeft size={15} /> Back to Projects
        </button>

        {/* ── Project header card ── */}
        <div className="rounded-2xl border mb-5 overflow-hidden"
          style={{
            background:           cardBg,
            borderColor:          sCfg.border,
            backdropFilter:       "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: `0 8px 40px rgba(0,0,0,0.2), 0 0 0 1px ${sCfg.border}`,
          }}>

          {/* Header row */}
          <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: borderCol }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: sCfg.bg, border: `1px solid ${sCfg.border}` }}>
                  <FolderKanban size={22} style={{ color: sCfg.text }} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-1"
                    style={{ color: textMuted }}>{p.id}</p>
                  <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>{p.name}</h1>
                  <p className="text-sm mt-1 max-w-xl" style={{ color: textMuted }}>{p.description}</p>
                </div>
              </div>
              <Badge label={p.status} cfg={sCfg} />
            </div>

            {/* Progress bar */}
            <div className="mt-4 max-w-sm">
              <ProgressBar value={prog} darkMode={darkMode} />
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5">
            <DetailRow icon={Building2}  label="Client"      value={client ? `${client.name} · ${client.company}` : p.clientId} accent="#818cf8" darkMode={darkMode} />
            <DetailRow icon={User}       label="Project Lead" value={p.originator} accent="#34d399" darkMode={darkMode} />
            <DetailRow icon={Calendar}   label="Timeline"    value={`${p.startDate} → ${p.endDate}`} accent="#fb923c" darkMode={darkMode} />
            <DetailRow icon={DollarSign} label="Deal Value"  value={`₹ ${p.dealValue.toLocaleString()}`} accent="#f472b6" darkMode={darkMode} />
          </div>

          {/* Team + days remaining footer */}
          <div className="flex flex-wrap items-center justify-between px-5 py-3 border-t gap-3"
            style={{ borderColor: borderCol, background: darkMode ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.02)" }}>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold" style={{ color: textMuted }}>Team:</span>
              <AvatarStack members={team} darkMode={darkMode} />
              <span className="text-xs" style={{ color: textMuted }}>{team.length} members</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={12} style={{ color: days < 0 ? "#f87171" : days < 14 ? "#fbbf24" : "#34d399" }} />
              <span className="text-xs font-semibold"
                style={{ color: days < 0 ? "#f87171" : days < 14 ? "#fbbf24" : "#34d399" }}>
                {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days remaining`}
              </span>
            </div>
          </div>
        </div>

        {/* ── Task summary stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatCard icon={Layers}       label="Total Tasks"   value={taskCounts.total}       accent="#818cf8" darkMode={darkMode} />
          <StatCard icon={CheckCircle2} label="Completed"     value={taskCounts.completed}   accent="#34d399" darkMode={darkMode} />
          <StatCard icon={Clock}        label="In Progress"   value={taskCounts.in_progress} accent="#fbbf24" darkMode={darkMode} />
          <StatCard icon={Circle}       label="Pending"       value={taskCounts.pending}     accent="#94a3b8" darkMode={darkMode} />
        </div>

        {/* ── Task list ── */}
        <div className="rounded-2xl border overflow-hidden"
          style={{
            background:           cardBg,
            borderColor:          borderCol,
            backdropFilter:       "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}>

          {/* Task header + filter pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b"
            style={{ borderColor: borderCol, background: headerBg }}>
            <h2 className="font-bold text-base" style={{ color: textPrimary }}>Tasks</h2>
            <div className="flex gap-2">
              {["all", "completed", "in_progress", "pending"].map((f) => {
                const cfg    = TASK_STATUS[f];
                const active = taskFilter === f;
                return (
                  <button key={f} onClick={() => setTaskFilter(f)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border"
                    style={{
                      background:  active ? (cfg?.bg  ?? "rgba(99,102,241,0.15)") : "transparent",
                      borderColor: active ? (cfg?.border ?? "rgba(99,102,241,0.35)") : borderCol,
                      color:       active ? (cfg?.text   ?? "#818cf8") : textMuted,
                    }}>
                    {f === "all" ? "All" : f === "in_progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Task rows */}
          <div className="divide-y" style={{ borderColor: borderCol }}>
            {detailTasks.map((task, idx) => {
              const tCfg = TASK_STATUS[task.status];
              const TIcon = tCfg?.Icon ?? Circle;
              return (
                <div key={task.id}
                  className="flex flex-wrap items-center gap-4 px-5 py-4
                    transition-colors duration-150"
                  style={{
                    borderColor: borderCol,
                    background: idx % 2 === 0
                      ? "transparent"
                      : darkMode ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
                  }}>

                  {/* Status icon */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: tCfg?.bg, border: `1px solid ${tCfg?.border}` }}>
                    <TIcon size={14} style={{ color: tCfg?.text }} />
                  </div>

                  {/* Task name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: textPrimary }}>{task.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: textMuted }}>
                      {task.startDate} → {task.endDate}
                    </p>
                  </div>

                  {/* Status badge */}
                  <Badge label={task.status === "in_progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)} cfg={tCfg} />

                  {/* Implementers avatar stack */}
                  <AvatarStack members={task.implementers} darkMode={darkMode} />
                </div>
              );
            })}

            {detailTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Search size={20} style={{ color: "#818cf8" }} />
                <p className="text-sm" style={{ color: textMuted }}>No tasks for this filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PROJECT LIST VIEW  (default)
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen p-4 sm:p-6 transition-colors duration-300"
      style={{ background: bg, color: textPrimary }}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: textPrimary }}>
            Projects
          </h1>
          <p className="text-sm mt-1" style={{ color: textMuted }}>
            {processed.length} of {projectsData.length} projects
            {statusFilter !== "all" && ` · ${statusFilter}`}
          </p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={FolderKanban} label="Total"     value={stats.total}                        accent="#818cf8" darkMode={darkMode} />
        <StatCard icon={TrendingUp}   label="Active"    value={stats.active}                       accent="#34d399" darkMode={darkMode} />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed}                    accent="#a5b4fc" darkMode={darkMode} />
        <StatCard icon={DollarSign}   label="Revenue"   value={`₹${stats.revenue.toLocaleString()}`} accent="#f472b6" darkMode={darkMode} sub={`${stats.pending} pending`} />
      </div>

      {/* ── Filter + sort bar ── */}
      <div className="flex flex-wrap items-center gap-2 mb-5">

        {/* Status filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {["all", "Active", "Completed", "Pending", "Cancelled"].map((s) => {
            const cfg    = PROJECT_STATUS[s];
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

        {/* Sort controls */}
        <div className="ml-auto flex gap-2">
          {[
            { key: "dealValue", label: "Value"    },
            { key: "startDate", label: "Start"    },
            { key: "endDate",   label: "Deadline" },
          ].map(({ key, label }) => (
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

      {/* ── Project grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {processed.map((p) => {
          const sCfg   = PROJECT_STATUS[p.status] || PROJECT_STATUS.Pending;
          const client = clientMap[p.clientId];
          const prog   = calcProgress(p.tasks);
          const days   = daysRemaining(p.endDate);
          const team   = getTeam(p.tasks);
          const isHov  = hoveredCard === p.id;

          return (
            <div key={p.id}
              onMouseEnter={() => setHoveredCard(p.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setSelectedProject(p)}
              className="rounded-2xl border flex flex-col cursor-pointer transition-all duration-250"
              style={{
                background:           cardBg,
                borderColor:          isHov ? sCfg.border : borderCol,
                backdropFilter:       "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: isHov
                  ? `0 8px 40px rgba(0,0,0,0.25), 0 0 0 1px ${sCfg.border}`
                  : darkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.07)",
                transform: isHov ? "translateY(-3px)" : "translateY(0)",
              }}>

              {/* ── Card header ── */}
              <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3 border-b"
                style={{ borderColor: borderCol }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: sCfg.bg, border: `1px solid ${sCfg.border}` }}>
                    <FolderKanban size={16} style={{ color: sCfg.text }} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-sm truncate" style={{ color: textPrimary }}>{p.name}</h2>
                    <p className="text-[10px] font-mono" style={{ color: textMuted }}>{p.id}</p>
                  </div>
                </div>
                <Badge label={p.status} cfg={sCfg} />
              </div>

              {/* ── Card body ── */}
              <div className="px-4 py-3 flex flex-col gap-2.5 flex-1">

                {/* Description */}
                <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: textMuted }}>
                  {p.description}
                </p>

                {/* Client */}
                <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                  <Building2 size={11} style={{ color: "#818cf8", flexShrink: 0 }} />
                  <span className="font-medium truncate" style={{ color: textPrimary }}>
                    {client ? `${client.name} · ${client.company}` : p.clientId}
                  </span>
                </div>

                {/* Project Lead */}
                <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                  <User size={11} style={{ color: "#34d399", flexShrink: 0 }} />
                  <span>{p.originator}</span>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                  <Calendar size={11} style={{ color: "#fb923c", flexShrink: 0 }} />
                  <span>{p.startDate} → {p.endDate}</span>
                </div>

                {/* Tasks mini progress */}
                <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                  <Layers size={11} style={{ color: "#f472b6", flexShrink: 0 }} />
                  <span>
                    {p.tasks.filter((t) => t.status === "completed").length}/{p.tasks.length} tasks done
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-1">
                  <ProgressBar value={prog} darkMode={darkMode} />
                </div>
              </div>

              {/* ── Card footer ── */}
              <div className="flex items-center justify-between px-4 py-3 border-t rounded-b-2xl"
                style={{
                  borderColor: borderCol,
                  background: darkMode ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.02)",
                }}>
                <div className="flex items-center gap-3">
                  {/* Deal value */}
                  <span className="text-sm font-bold" style={{ color: "#818cf8" }}>
                    ₹{p.dealValue.toLocaleString()}
                  </span>
                  {/* Team avatars */}
                  <AvatarStack members={team} darkMode={darkMode} />
                </div>

                {/* Days remaining chip */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                  style={{
                    background: days < 0 ? "rgba(248,113,113,0.1)" : days < 14 ? "rgba(251,191,36,0.1)" : "rgba(52,211,153,0.1)",
                    color:      days < 0 ? "#f87171" : days < 14 ? "#fbbf24" : "#34d399",
                  }}>
                  <Clock size={10} />
                  {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Empty state ── */}
        {processed.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <Search size={24} style={{ color: "#818cf8" }} />
            </div>
            <p className="font-semibold text-lg" style={{ color: textPrimary }}>No projects found</p>
            <p className="text-sm" style={{ color: textMuted }}>Try adjusting your filters or search</p>
          </div>
        )}
      </div>
    </div>
  );
}
