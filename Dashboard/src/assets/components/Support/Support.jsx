import React, { useState, useMemo } from "react";
import { supportData } from "../../MockData/MockData.jsx";
import {
  Headphones, AlertTriangle, Clock, CheckCircle2,
  Mail, Phone, MessageSquare, User, Calendar, Tag,
  X, Search, Filter, ArrowUpDown, ChevronDown,
  TicketCheck, Zap, TrendingUp, RefreshCw,
} from "lucide-react";

// ─── Config maps ──────────────────────────────────────────────────────────────

const PRIORITY = {
  High:   { bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)",  text: "#fca5a5", dot: "#f87171", icon: "🔴" },
  Medium: { bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.3)",   text: "#fcd34d", dot: "#fbbf24", icon: "🟡" },
  Low:    { bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.3)",   text: "#6ee7b7", dot: "#34d399", icon: "🟢" },
};

const STATUS = {
  Open:        { bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.28)", text: "#fca5a5", dot: "#f87171" },
  "In Progress":{ bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.28)",  text: "#fcd34d", dot: "#fbbf24" },
  Resolved:    { bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.28)",  text: "#6ee7b7", dot: "#34d399" },
};

const CHANNEL_ICON = {
  Email: { Icon: Mail,          color: "#818cf8" },
  Chat:  { Icon: MessageSquare, color: "#34d399" },
  Phone: { Icon: Phone,         color: "#fb923c" },
};

// ─── Reusable badge ───────────────────────────────────────────────────────────
function Badge({ label, cfg }) {
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {label}
    </span>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent, darkMode, sub }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 hover:scale-[1.02]"
      style={{
        background:   darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
        borderColor:  darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
      >
        <Icon size={15} style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: darkMode ? "#475569" : "#94a3b8" }}>{label}</p>
        <p className="text-base font-bold leading-tight"
          style={{ color: darkMode ? "#e2e8f0" : "#0f172a" }}>{value}</p>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: darkMode ? "#334155" : "#cbd5e1" }}>{sub}</p>}
      </div>
    </div>
  );
}

// ─── Detail row inside modal ──────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, value, accent = "#818cf8", darkMode }) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl border"
      style={{
        background:  darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
        borderColor: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: `${accent}18`, border: `1px solid ${accent}28` }}
      >
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

// ─── Main component ───────────────────────────────────────────────────────────
const Support = ({ darkMode, searchQuery = "" }) => {

  // ── State ─────────────────────────────────────────────────────────────────
  const [selectedTicket, setSelectedTicket]   = useState(null);
  const [priorityFilter, setPriorityFilter]   = useState("all");
  const [statusFilter,   setStatusFilter]     = useState("all");
  const [sortKey,        setSortKey]          = useState("dateCreated"); // newest first
  const [sortDir,        setSortDir]          = useState("desc");
  const [viewMode,       setViewMode]         = useState("grid"); // "grid" | "list"
  const [hoveredCard,    setHoveredCard]      = useState(null);
  const [showFilters,    setShowFilters]      = useState(false);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:      supportData.length,
    open:       supportData.filter((t) => t.status === "Open").length,
    inProgress: supportData.filter((t) => t.status === "In Progress").length,
    resolved:   supportData.filter((t) => t.status === "Resolved").length,
    high:       supportData.filter((t) => t.priority === "High").length,
  }), []);

  // ── Filtered + sorted list ─────────────────────────────────────────────────
  const processed = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let data = supportData.filter((t) => {
      const matchSearch =
        t.customer.toLowerCase().includes(q)    ||
        t.issue.toLowerCase().includes(q)       ||
        t.description.toLowerCase().includes(q) ||
        t.assignedTo?.toLowerCase().includes(q) ||
        t.channel?.toLowerCase().includes(q);

      const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
      const matchStatus   = statusFilter   === "all" || t.status   === statusFilter;

      return matchSearch && matchPriority && matchStatus;
    });

    // sort
    data = [...data].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

    return data;
  }, [searchQuery, priorityFilter, statusFilter, sortKey, sortDir]);

  // ── Sort toggle ───────────────────────────────────────────────────────────
  const toggleSort = (key) => {
    setSortDir((d) => (sortKey === key ? (d === "asc" ? "desc" : "asc") : "desc"));
    setSortKey(key);
  };

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const bg          = darkMode ? "#171821"                : "#f1f5f9";
  const cardBg      = darkMode ? "rgba(33,34,45,0.82)"   : "rgba(255,255,255,0.85)";
  const borderCol   = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const textPrimary = darkMode ? "#e2e8f0"                : "#0f172a";
  const textMuted   = darkMode ? "#64748b"                : "#94a3b8";
  const glassPanel  = darkMode ? "rgba(15,18,32,0.85)"   : "rgba(255,255,255,0.9)";

  return (
    <div
      className="min-h-screen p-4 sm:p-6 transition-colors duration-300"
      style={{ background: bg, color: textPrimary }}
    >

      {/* ══════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: textPrimary }}>
            Support Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: textMuted }}>
            {processed.length} of {supportData.length} tickets
            {priorityFilter !== "all" && ` · ${priorityFilter} priority`}
            {statusFilter   !== "all" && ` · ${statusFilter}`}
          </p>
        </div>

        {/* View mode toggle */}
        <div
          className="flex rounded-xl p-1 border self-start sm:self-auto"
          style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", borderColor: borderCol }}
        >
          {[
            { key: "grid", label: "⊞ Grid" },
            { key: "list", label: "≡ List" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: viewMode === key
                  ? "linear-gradient(135deg,#6366f1,#06b6d4)"
                  : "transparent",
                color: viewMode === key ? "#fff" : textMuted,
                boxShadow: viewMode === key ? "0 2px 10px rgba(99,102,241,0.4)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STAT CARDS
      ══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={TicketCheck}  label="Total"       value={stats.total}      accent="#818cf8" darkMode={darkMode} />
        <StatCard icon={AlertTriangle}label="Open"        value={stats.open}       accent="#f87171" darkMode={darkMode} sub={`${stats.high} high priority`} />
        <StatCard icon={RefreshCw}    label="In Progress" value={stats.inProgress} accent="#fbbf24" darkMode={darkMode} />
        <StatCard icon={CheckCircle2} label="Resolved"    value={stats.resolved}   accent="#34d399" darkMode={darkMode} sub={`${Math.round((stats.resolved/stats.total)*100)}% resolution rate`} />
      </div>

      {/* ══════════════════════════════════════════
          FILTER BAR
      ══════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center gap-2 mb-5">

        {/* Priority pills */}
        <div className="flex gap-1.5 overflow-x-auto">
          {["all", "High", "Medium", "Low"].map((p) => {
            const cfg    = PRIORITY[p];
            const active = priorityFilter === p;
            return (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold
                  transition-all duration-200 border"
                style={{
                  background:  active ? (cfg?.bg  ?? "rgba(99,102,241,0.15)") : "transparent",
                  borderColor: active ? (cfg?.border ?? "rgba(99,102,241,0.35)") : borderCol,
                  color:       active ? (cfg?.text   ?? "#818cf8") : textMuted,
                }}
              >
                {p === "all" ? "All Priority" : `${cfg?.icon} ${p}`}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: borderCol }} />

        {/* Status pills */}
        <div className="flex gap-1.5 overflow-x-auto">
          {["all", "Open", "In Progress", "Resolved"].map((s) => {
            const cfg    = STATUS[s];
            const active = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold
                  transition-all duration-200 border"
                style={{
                  background:  active ? (cfg?.bg  ?? "rgba(99,102,241,0.15)") : "transparent",
                  borderColor: active ? (cfg?.border ?? "rgba(99,102,241,0.35)") : borderCol,
                  color:       active ? (cfg?.text   ?? "#818cf8") : textMuted,
                }}
              >
                {s === "all" ? "All Status" : s}
              </button>
            );
          })}
        </div>

        {/* Sort button */}
        <button
          onClick={() => toggleSort(sortKey === "dateCreated" ? "priority" : "dateCreated")}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
            transition-all duration-200 border"
          style={{ borderColor: borderCol, color: textMuted, background: "transparent" }}
        >
          <ArrowUpDown size={11} />
          Sort: {sortKey === "dateCreated" ? "Date" : "Priority"}
        </button>
      </div>

      {/* ══════════════════════════════════════════
          TICKET GRID / LIST
      ══════════════════════════════════════════ */}

      {/* — GRID MODE — */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {processed.map((ticket) => {
            const pCfg    = PRIORITY[ticket.priority];
            const sCfg    = STATUS[ticket.status];
            const chCfg   = CHANNEL_ICON[ticket.channel] || { Icon: Tag, color: "#94a3b8" };
            const isHover = hoveredCard === ticket.id;

            return (
              <div
                key={ticket.id}
                onMouseEnter={() => setHoveredCard(ticket.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="rounded-2xl border flex flex-col transition-all duration-250"
                style={{
                  background:            cardBg,
                  borderColor:           isHover ? pCfg?.border : borderCol,
                  backdropFilter:        "blur(20px)",
                  WebkitBackdropFilter:  "blur(20px)",
                  boxShadow: isHover
                    ? `0 8px 40px rgba(0,0,0,0.25), 0 0 0 1px ${pCfg?.border}`
                    : darkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.07)",
                  transform: isHover ? "translateY(-2px)" : "translateY(0)",
                }}
              >
                {/* Card header */}
                <div
                  className="flex items-start justify-between gap-2 px-4 pt-4 pb-3 border-b"
                  style={{ borderColor: borderCol }}
                >
                  <h2 className="font-bold text-sm leading-snug flex-1" style={{ color: textPrimary }}>
                    {ticket.issue}
                  </h2>
                  <Badge label={ticket.priority} cfg={pCfg} />
                </div>

                {/* Card body */}
                <div className="px-4 py-3 flex flex-col gap-2 flex-1">

                  {/* Customer */}
                  <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                    <User size={11} style={{ color: "#818cf8", flexShrink: 0 }} />
                    <span className="truncate font-medium" style={{ color: textPrimary }}>{ticket.customer}</span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 text-xs">
                    <Badge label={ticket.status} cfg={sCfg} />
                  </div>

                  {/* Assigned to */}
                  <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                    <User size={11} style={{ color: "#34d399", flexShrink: 0 }} />
                    <span className="truncate">{ticket.assignedTo}</span>
                  </div>

                  {/* Channel */}
                  <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                    <chCfg.Icon size={11} style={{ color: chCfg.color, flexShrink: 0 }} />
                    <span>{ticket.channel}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                    <Calendar size={11} style={{ color: "#f472b6", flexShrink: 0 }} />
                    <span>{ticket.dateCreated}</span>
                  </div>
                </div>

                {/* Card footer */}
                <div
                  className="px-4 py-3 flex justify-end border-t rounded-b-2xl"
                  style={{
                    borderColor: borderCol,
                    background: darkMode ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.02)",
                  }}
                >
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold
                      transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      background: "rgba(99,102,241,0.12)",
                      border:     "1px solid rgba(99,102,241,0.25)",
                      color:      "#818cf8",
                    }}
                  >
                    View ticket
                  </button>
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {processed.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                <Search size={24} style={{ color: "#818cf8" }} />
              </div>
              <p className="font-semibold text-lg" style={{ color: textPrimary }}>No tickets found</p>
              <p className="text-sm" style={{ color: textMuted }}>Try adjusting your filters or search</p>
            </div>
          )}
        </div>
      )}

      {/* — LIST MODE — */}
      {viewMode === "list" && (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            background:           cardBg,
            borderColor:          borderCol,
            backdropFilter:       "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: darkMode ? "0 8px 40px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          {/* List header */}
          <div
            className="grid grid-cols-12 gap-2 px-4 py-3 text-[10px] font-semibold
              uppercase tracking-widest border-b sticky top-0 z-10"
            style={{
              background:  darkMode ? "rgba(15,17,28,0.95)" : "rgba(241,245,249,0.95)",
              borderColor: borderCol, color: textMuted,
              backdropFilter: "blur(20px)",
            }}
          >
            <span className="col-span-3">Issue</span>
            <span className="col-span-2">Customer</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-1">Priority</span>
            <span className="col-span-2">Assigned</span>
            <span className="col-span-1">Channel</span>
            <span className="col-span-1 text-right">Action</span>
          </div>

          {/* List rows */}
          <div className="overflow-y-auto max-h-[60vh]">
            {processed.map((ticket, idx) => {
              const pCfg  = PRIORITY[ticket.priority];
              const sCfg  = STATUS[ticket.status];
              const chCfg = CHANNEL_ICON[ticket.channel] || { Icon: Tag, color: "#94a3b8" };

              return (
                <div
                  key={ticket.id}
                  onMouseEnter={() => setHoveredCard(ticket.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="grid grid-cols-12 gap-2 px-4 py-3 items-center text-sm
                    transition-colors duration-150 border-b"
                  style={{
                    background:  hoveredCard === ticket.id
                      ? (darkMode ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.03)")
                      : "transparent",
                    borderColor: borderCol,
                  }}
                >
                  <span className="col-span-3 font-semibold truncate text-xs" style={{ color: textPrimary }}>
                    {ticket.issue}
                  </span>
                  <span className="col-span-2 text-xs truncate" style={{ color: textMuted }}>{ticket.customer}</span>
                  <span className="col-span-2"><Badge label={ticket.status} cfg={sCfg} /></span>
                  <span className="col-span-1"><Badge label={ticket.priority} cfg={pCfg} /></span>
                  <span className="col-span-2 text-xs truncate" style={{ color: textMuted }}>{ticket.assignedTo}</span>
                  <span className="col-span-1 flex items-center gap-1 text-xs" style={{ color: textMuted }}>
                    <chCfg.Icon size={11} style={{ color: chCfg.color }} /> {ticket.channel}
                  </span>
                  <span className="col-span-1 flex justify-end">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="px-2 py-1 rounded-lg text-[10px] font-semibold transition-all duration-200
                        hover:scale-105 active:scale-95"
                      style={{
                        background: "rgba(99,102,241,0.12)",
                        border:     "1px solid rgba(99,102,241,0.25)",
                        color:      "#818cf8",
                      }}
                    >
                      View
                    </button>
                  </span>
                </div>
              );
            })}

            {processed.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Search size={22} style={{ color: "#818cf8" }} />
                <p className="text-sm" style={{ color: textMuted }}>No tickets found</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-4 py-3 text-xs border-t"
            style={{ borderColor: borderCol, color: textMuted, background: darkMode ? "rgba(15,17,28,0.9)" : "rgba(241,245,249,0.9)" }}
          >
            <span>{processed.length} results</span>
            <span>CuriumCRM · Support</span>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL — Ticket detail
      ══════════════════════════════════════════ */}
      {selectedTicket && (() => {
        const t    = selectedTicket;
        const pCfg = PRIORITY[t.priority];
        const sCfg = STATUS[t.status];
        const chCfg = CHANNEL_ICON[t.channel] || { Icon: Tag, color: "#94a3b8" };

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedTicket(null); }}
          >
            <div
              className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
              style={{
                background:   darkMode ? "rgba(13,16,30,0.97)" : "rgba(255,255,255,0.97)",
                borderColor:  pCfg?.border ?? borderCol,
                backdropFilter: "blur(40px)",
                boxShadow: `0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px ${pCfg?.border ?? "rgba(99,102,241,0.12)"}`,
              }}
            >
              {/* Modal header */}
              <div
                className="relative px-6 pt-6 pb-4 border-b"
                style={{ borderColor: borderCol }}
              >
                {/* Close */}
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center
                    transition-colors duration-200"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${borderCol}`, color: textMuted }}
                >
                  <X size={14} />
                </button>

                {/* Ticket ID + issue */}
                <div className="flex items-start gap-3 pr-10">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: pCfg?.bg, border: `1px solid ${pCfg?.border}` }}
                  >
                    <Headphones size={18} style={{ color: pCfg?.text }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-1"
                      style={{ color: textMuted }}>Ticket #{t.id}</p>
                    <h2 className="font-bold text-lg leading-tight" style={{ color: textPrimary }}>
                      {t.issue}
                    </h2>
                  </div>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge label={t.priority}  cfg={pCfg} />
                  <Badge label={t.status}    cfg={sCfg} />
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                    style={{
                      background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8"
                    }}
                  >
                    <chCfg.Icon size={10} /> {t.channel}
                  </span>
                </div>
              </div>

              {/* Modal body */}
              <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <DetailRow icon={User}       label="Customer"     value={t.customer}    accent="#818cf8" darkMode={darkMode} />
                <DetailRow icon={User}       label="Assigned To"  value={t.assignedTo}  accent="#34d399" darkMode={darkMode} />
                <DetailRow icon={Calendar}   label="Date Created" value={t.dateCreated} accent="#fb923c" darkMode={darkMode} />
                <DetailRow icon={Clock}      label="Last Updated" value={t.lastUpdated} accent="#38bdf8" darkMode={darkMode} />
                <div className="sm:col-span-2">
                  <DetailRow icon={Tag}      label="Description"  value={t.description} accent="#f472b6" darkMode={darkMode} />
                </div>
              </div>

              {/* Modal footer */}
              <div
                className="flex items-center justify-between px-5 py-4 border-t gap-3 flex-wrap"
                style={{ borderColor: borderCol }}
              >
                {/* Quick status update */}
                <div className="flex gap-2">
                  {["Open", "In Progress", "Resolved"].map((s) => {
                    const cfg = STATUS[s];
                    const isCurrent = t.status === s;
                    return (
                      <button
                        key={s}
                        disabled={isCurrent}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-200
                          border disabled:opacity-60 disabled:cursor-default hover:scale-105 active:scale-95"
                        style={{
                          background:  isCurrent ? cfg.bg : "transparent",
                          borderColor: isCurrent ? cfg.border : borderCol,
                          color:       isCurrent ? cfg.text : textMuted,
                        }}
                      >
                        {isCurrent ? `✓ ${s}` : s}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setSelectedTicket(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                    transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                    boxShadow:  "0 4px 16px rgba(99,102,241,0.4)",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Support;
