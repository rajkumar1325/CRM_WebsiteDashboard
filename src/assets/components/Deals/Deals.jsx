import React, { useState, useMemo } from "react";
import { dealsData } from "../../MockData/MockData.jsx";
import {
  TrendingUp, TrendingDown, DollarSign, Target,
  Handshake, User, Calendar, BarChart2, X,
  Search, ArrowUpDown, ChevronUp, ChevronDown,
  Layers, CheckCircle2, XCircle, Clock,
} from "lucide-react";

// ─── Stage config ─────────────────────────────────────────────────────────────
// Each pipeline stage gets its own color + label
const STAGE = {
  Prospecting:   { bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.28)",  text: "#fcd34d", dot: "#fbbf24" },
  "Proposal Sent":{ bg:"rgba(129,140,248,0.12)", border: "rgba(129,140,248,0.28)", text: "#a5b4fc", dot: "#818cf8" },
  Negotiation:   { bg: "rgba(251,146,60,0.12)",  border: "rgba(251,146,60,0.28)",  text: "#fdba74", dot: "#fb923c" },
  "Closed Won":  { bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.28)",  text: "#6ee7b7", dot: "#34d399" },
  "Closed Lost": { bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.28)", text: "#fca5a5", dot: "#f87171" },
};

// ─── Deal status config ───────────────────────────────────────────────────────
const STATUS = {
  Active: { bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.28)",  text: "#6ee7b7", dot: "#34d399" },
  Won:    { bg: "rgba(129,140,248,0.12)", border: "rgba(129,140,248,0.28)", text: "#a5b4fc", dot: "#818cf8" },
  Lost:   { bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.28)", text: "#fca5a5", dot: "#f87171" },
};

// ─── Pipeline order for the Kanban view ───────────────────────────────────────
const PIPELINE_STAGES = [
  "Prospecting", "Proposal Sent", "Negotiation", "Closed Won", "Closed Lost",
];

// ─── Reusable badge ───────────────────────────────────────────────────────────
function Badge({ label, cfg }) {
  if (!cfg || !label) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-[10px] font-semibold whitespace-nowrap"
      style={{
        background:  cfg.bg,
        border:      `1px solid ${cfg.border}`,
        color:       cfg.text,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: cfg.dot }} />
      {label}
    </span>
  );
}

// ─── Probability progress bar ─────────────────────────────────────────────────
function ProbabilityBar({ value, darkMode }) {
  // Color shifts green→yellow→red based on probability
  const color =
    value >= 70 ? "#34d399" :
    value >= 40 ? "#fbbf24" : "#f87171";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: darkMode ? "#475569" : "#94a3b8" }}>
          Win probability
        </span>
        <span className="text-[11px] font-bold" style={{ color }}>{value}%</span>
      </div>
      {/* Track */}
      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)" }}
      >
        {/* Fill */}
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent, darkMode, sub }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl border
        transition-all duration-200 hover:scale-[1.02]"
      style={{
        background:     darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
        borderColor:    darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Icon circle */}
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
        {sub && (
          <p className="text-[10px] mt-0.5"
            style={{ color: darkMode ? "#334155" : "#94a3b8" }}>{sub}</p>
        )}
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
      {/* Icon */}
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

// ─── Main Component ───────────────────────────────────────────────────────────
const Deals = ({ darkMode, searchQuery = "" }) => {

  // ── State ──────────────────────────────────────────────────────────────────
  const [selectedDeal,  setSelectedDeal]  = useState(null);
  const [stageFilter,   setStageFilter]   = useState("all");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [sortKey,       setSortKey]       = useState("value");
  const [sortDir,       setSortDir]       = useState("desc");
  const [viewMode,      setViewMode]      = useState("grid");   // "grid" | "kanban"
  const [hoveredCard,   setHoveredCard]   = useState(null);

  // ── Summary stats from data ────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total    = dealsData.length;
    const won      = dealsData.filter((d) => d.status === "Won").length;
    const lost     = dealsData.filter((d) => d.status === "Lost").length;
    const active   = dealsData.filter((d) => d.status === "Active").length;

    // Parse value strings like "$12,000" → number
    const parse    = (v) => Number(String(v).replace(/[^0-9.]/g, "")) || 0;
    const pipeline = dealsData
      .filter((d) => d.status === "Active")
      .reduce((sum, d) => sum + parse(d.value), 0);

    const winRate  = total ? Math.round((won / total) * 100) : 0;

    return { total, won, lost, active, pipeline, winRate };
  }, []);

  // ── Filtered + sorted data ─────────────────────────────────────────────────
  const processed = useMemo(() => {
    const q = searchQuery.toLowerCase();

    let data = dealsData.filter((d) => {
      // topbar search
      const matchSearch =
        d.name.toLowerCase().includes(q)          ||
        d.company.toLowerCase().includes(q)       ||
        d.contactPerson.toLowerCase().includes(q) ||
        d.stage.toLowerCase().includes(q)         ||
        d.status.toLowerCase().includes(q);

      const matchStage  = stageFilter  === "all" || d.stage  === stageFilter;
      const matchStatus = statusFilter === "all" || d.status === statusFilter;

      return matchSearch && matchStage && matchStatus;
    });

    // Sort — handle numeric value strings
    const parse = (v) => Number(String(v).replace(/[^0-9.]/g, "")) || 0;
    data = [...data].sort((a, b) => {
      const av = sortKey === "value" || sortKey === "probability"
        ? parse(a[sortKey]) : String(a[sortKey] ?? "");
      const bv = sortKey === "value" || sortKey === "probability"
        ? parse(b[sortKey]) : String(b[sortKey] ?? "");

      if (typeof av === "number")
        return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    return data;
  }, [searchQuery, stageFilter, statusFilter, sortKey, sortDir]);

  // ── Sort toggle ────────────────────────────────────────────────────────────
  const handleSort = (key) => {
    setSortDir((d) => (sortKey === key ? (d === "asc" ? "desc" : "asc") : "desc"));
    setSortKey(key);
  };

  // ── Theme tokens ───────────────────────────────────────────────────────────
  const bg          = darkMode ? "#171821"                  : "#f1f5f9";
  const cardBg      = darkMode ? "rgba(33,34,45,0.82)"      : "rgba(255,255,255,0.85)";
  const borderCol   = darkMode ? "rgba(255,255,255,0.07)"   : "rgba(0,0,0,0.08)";
  const headerBg    = darkMode ? "rgba(15,17,28,0.95)"      : "rgba(241,245,249,0.95)";
  const textPrimary = darkMode ? "#e2e8f0"                  : "#0f172a";
  const textMuted   = darkMode ? "#64748b"                  : "#94a3b8";

  // Parse value string → number for display
  const parseVal = (v) => Number(String(v).replace(/[^0-9.]/g, "")) || 0;

  return (
    <div
      className="min-h-screen p-4 sm:p-6 transition-colors duration-300"
      style={{ background: bg, color: textPrimary }}
    >

      {/* ════════════════════════════════════════
          HEADER
      ════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: textPrimary }}>
            Deals Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: textMuted }}>
            {processed.length} of {dealsData.length} deals
            {stageFilter  !== "all" && ` · ${stageFilter}`}
            {statusFilter !== "all" && ` · ${statusFilter}`}
          </p>
        </div>

        {/* View mode toggle — Grid vs Kanban */}
        <div
          className="flex rounded-xl p-1 border self-start sm:self-auto"
          style={{
            background:  darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            borderColor: borderCol,
          }}
        >
          {[
            { key: "grid",   label: "⊞ Grid"   },
            { key: "kanban", label: "▦ Pipeline" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: viewMode === key
                  ? "linear-gradient(135deg,#6366f1,#06b6d4)" : "transparent",
                color:      viewMode === key ? "#fff" : textMuted,
                boxShadow:  viewMode === key ? "0 2px 10px rgba(99,102,241,0.4)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          STAT CARDS
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={Layers}       label="Total Deals"    value={stats.total}
          accent="#818cf8"    darkMode={darkMode}
        />
        <StatCard
          icon={CheckCircle2} label="Won"            value={stats.won}
          accent="#34d399"    darkMode={darkMode}    sub={`${stats.winRate}% win rate`}
        />
        <StatCard
          icon={XCircle}      label="Lost"           value={stats.lost}
          accent="#f87171"    darkMode={darkMode}
        />
        <StatCard
          icon={DollarSign}   label="Pipeline Value" value={`$${stats.pipeline.toLocaleString()}`}
          accent="#f472b6"    darkMode={darkMode}    sub={`${stats.active} active deals`}
        />
      </div>

      {/* ════════════════════════════════════════
          FILTER + SORT BAR
      ════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center gap-2 mb-5">

        {/* Stage filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {["all", ...PIPELINE_STAGES].map((s) => {
            const cfg    = STAGE[s];
            const active = stageFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStageFilter(s)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold
                  transition-all duration-200 border"
                style={{
                  background:  active ? (cfg?.bg  ?? "rgba(99,102,241,0.15)") : "transparent",
                  borderColor: active ? (cfg?.border ?? "rgba(99,102,241,0.35)") : borderCol,
                  color:       active ? (cfg?.text   ?? "#818cf8") : textMuted,
                }}
              >
                {s === "all" ? "All Stages" : s}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-px h-5" style={{ background: borderCol }} />

        {/* Status filter pills */}
        <div className="flex gap-1.5">
          {["all", "Active", "Won", "Lost"].map((s) => {
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

        {/* Sort controls */}
        <div className="ml-auto flex gap-2">
          {[
            { key: "value",       label: "Value"       },
            { key: "probability", label: "Probability" },
            { key: "expectedClose", label: "Close Date" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs
                font-semibold transition-all duration-200 border"
              style={{
                background:  sortKey === key ? "rgba(99,102,241,0.12)" : "transparent",
                borderColor: sortKey === key ? "rgba(99,102,241,0.3)"  : borderCol,
                color:       sortKey === key ? "#818cf8"               : textMuted,
              }}
            >
              {label}
              {sortKey === key
                ? (sortDir === "asc"
                    ? <ChevronUp size={10} />
                    : <ChevronDown size={10} />)
                : <ArrowUpDown size={10} className="opacity-40" />}
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          GRID VIEW
      ════════════════════════════════════════ */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {processed.map((deal) => {
            const stageCfg  = STAGE[deal.stage]   || STAGE["Prospecting"];
            const statusCfg = STATUS[deal.status] || STATUS["Active"];
            const isHover   = hoveredCard === deal.id;
            const prob      = Number(deal.probability) || 0;

            return (
              <div
                key={deal.id}
                onMouseEnter={() => setHoveredCard(deal.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="rounded-2xl border flex flex-col transition-all duration-250"
                style={{
                  /* Apple glass card */
                  background:           cardBg,
                  borderColor:          isHover ? stageCfg.border : borderCol,
                  backdropFilter:       "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: isHover
                    ? `0 8px 40px rgba(0,0,0,0.25), 0 0 0 1px ${stageCfg.border}`
                    : darkMode
                      ? "0 4px 20px rgba(0,0,0,0.3)"
                      : "0 2px 12px rgba(0,0,0,0.07)",
                  transform: isHover ? "translateY(-3px)" : "translateY(0)",
                }}
              >
                {/* ── Card header ── */}
                <div
                  className="flex items-start justify-between gap-2 px-4 pt-4 pb-3 border-b"
                  style={{ borderColor: borderCol }}
                >
                  {/* Deal name */}
                  <h2 className="font-bold text-sm leading-snug flex-1"
                    style={{ color: textPrimary }}>
                    {deal.name}
                  </h2>
                  {/* Stage badge */}
                  <Badge label={deal.stage} cfg={stageCfg} />
                </div>

                {/* ── Card body ── */}
                <div className="px-4 py-3 flex flex-col gap-2.5 flex-1">

                  {/* Company */}
                  <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                    <Handshake size={11} style={{ color: "#818cf8", flexShrink: 0 }} />
                    <span className="font-medium truncate" style={{ color: textPrimary }}>
                      {deal.company}
                    </span>
                  </div>

                  {/* Contact person */}
                  <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                    <User size={11} style={{ color: "#34d399", flexShrink: 0 }} />
                    <span className="truncate">{deal.contactPerson}</span>
                  </div>

                  {/* Expected close date */}
                  <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                    <Calendar size={11} style={{ color: "#fb923c", flexShrink: 0 }} />
                    <span>Closes {deal.expectedClose}</span>
                  </div>

                  {/* Notes preview */}
                  {deal.notes && (
                    <p
                      className="text-xs italic line-clamp-2 leading-relaxed mt-1"
                      style={{ color: darkMode ? "#334155" : "#94a3b8" }}
                    >
                      "{deal.notes}"
                    </p>
                  )}

                  {/* Probability bar */}
                  <div className="mt-1">
                    <ProbabilityBar value={prob} darkMode={darkMode} />
                  </div>
                </div>

                {/* ── Card footer ── */}
                <div
                  className="flex items-center justify-between px-4 py-3 border-t rounded-b-2xl"
                  style={{
                    borderColor: borderCol,
                    background: darkMode ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.02)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    {/* Deal value */}
                    <span className="text-base font-bold" style={{ color: "#818cf8" }}>
                      {deal.value}
                    </span>
                    {/* Status badge */}
                    <Badge label={deal.status} cfg={statusCfg} />
                  </div>

                  {/* View button */}
                  <button
                    onClick={() => setSelectedDeal(deal)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold
                      transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      background: "rgba(99,102,241,0.12)",
                      border:     "1px solid rgba(99,102,241,0.25)",
                      color:      "#818cf8",
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}

          {/* ── Empty state ── */}
          {processed.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border:     "1px solid rgba(99,102,241,0.2)",
                }}
              >
                <Search size={24} style={{ color: "#818cf8" }} />
              </div>
              <p className="font-semibold text-lg" style={{ color: textPrimary }}>
                No deals found
              </p>
              <p className="text-sm" style={{ color: textMuted }}>
                Try adjusting your filters or search
              </p>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════
          KANBAN / PIPELINE VIEW
          — One column per stage, cards stack vertically
      ════════════════════════════════════════ */}
      {viewMode === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => {
            const stageCfg    = STAGE[stage];
            const stageDeals  = processed.filter((d) => d.stage === stage);

            // Total pipeline value per stage
            const stageValue  = stageDeals.reduce(
              (sum, d) => sum + (Number(String(d.value).replace(/[^0-9.]/g, "")) || 0),
              0
            );

            return (
              <div key={stage} className="flex-shrink-0 w-64 flex flex-col gap-3">

                {/* Column header */}
                <div
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl border"
                  style={{
                    background:  stageCfg.bg,
                    borderColor: stageCfg.border,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: stageCfg.dot }}
                    />
                    <span className="text-xs font-bold" style={{ color: stageCfg.text }}>
                      {stage}
                    </span>
                  </div>
                  {/* Count badge */}
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: stageCfg.border, color: stageCfg.text }}
                  >
                    {stageDeals.length}
                  </span>
                </div>

                {/* Total value for column */}
                {stageValue > 0 && (
                  <p className="text-[10px] px-1 font-semibold" style={{ color: textMuted }}>
                    Pipeline: <span style={{ color: stageCfg.text }}>
                      ${stageValue.toLocaleString()}
                    </span>
                  </p>
                )}

                {/* Deal mini-cards */}
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => setSelectedDeal(deal)}
                    className="rounded-xl border p-3 cursor-pointer transition-all duration-200
                      hover:scale-[1.02]"
                    style={{
                      background:           cardBg,
                      borderColor:          borderCol,
                      backdropFilter:       "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      boxShadow: darkMode
                        ? "0 2px 12px rgba(0,0,0,0.3)"
                        : "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <p className="font-semibold text-xs mb-1.5 leading-snug"
                      style={{ color: textPrimary }}>{deal.name}</p>
                    <p className="text-[10px] mb-2" style={{ color: textMuted }}>
                      {deal.company}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: "#818cf8" }}>
                        {deal.value}
                      </span>
                      <span className="text-[10px]" style={{ color: textMuted }}>
                        {deal.probability}%
                      </span>
                    </div>
                    {/* Mini probability bar */}
                    <div
                      className="w-full h-1 rounded-full mt-2 overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${deal.probability}%`,
                          background: `linear-gradient(90deg,${stageCfg.dot}88,${stageCfg.dot})`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Empty column state */}
                {stageDeals.length === 0 && (
                  <div
                    className="rounded-xl border border-dashed p-4 text-center"
                    style={{ borderColor: borderCol }}
                  >
                    <p className="text-xs" style={{ color: textMuted }}>No deals here</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL — Deal detail
      ════════════════════════════════════════ */}
      {selectedDeal && (() => {
        const d        = selectedDeal;
        const stageCfg = STAGE[d.stage]   || STAGE["Prospecting"];
        const statusCfg= STATUS[d.status] || STATUS["Active"];
        const prob     = Number(d.probability) || 0;

        return (
          /* Backdrop — click outside to close */
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedDeal(null); }}
          >
            {/* Modal card */}
            <div
              className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
              style={{
                background:     darkMode ? "rgba(13,16,30,0.97)" : "rgba(255,255,255,0.97)",
                borderColor:    stageCfg.border,
                backdropFilter: "blur(40px)",
                boxShadow:      `0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px ${stageCfg.border}`,
              }}
            >
              {/* ── Modal header ── */}
              <div
                className="relative px-6 pt-6 pb-4 border-b"
                style={{ borderColor: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedDeal(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center
                    justify-center transition-colors duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border:     `1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
                    color:      textMuted,
                  }}
                >
                  <X size={14} />
                </button>

                {/* Icon + title */}
                <div className="flex items-start gap-3 pr-10">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: stageCfg.bg, border: `1px solid ${stageCfg.border}` }}
                  >
                    <Handshake size={18} style={{ color: stageCfg.text }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-1"
                      style={{ color: textMuted }}>Deal #{d.id}</p>
                    <h2 className="font-bold text-xl leading-tight"
                      style={{ color: textPrimary }}>{d.name}</h2>
                  </div>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge label={d.stage}  cfg={stageCfg}  />
                  <Badge label={d.status} cfg={statusCfg} />
                </div>
              </div>

              {/* ── Modal body ── */}
              <div className="px-5 py-4 space-y-3">

                {/* Info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <DetailRow icon={Handshake}  label="Company"      value={d.company}       accent="#818cf8" darkMode={darkMode} />
                  <DetailRow icon={User}        label="Contact"      value={d.contactPerson} accent="#34d399" darkMode={darkMode} />
                  <DetailRow icon={DollarSign}  label="Deal Value"   value={d.value}         accent="#f472b6" darkMode={darkMode} />
                  <DetailRow icon={Calendar}    label="Expected Close" value={d.expectedClose} accent="#fb923c" darkMode={darkMode} />
                </div>

                {/* Notes full */}
                {d.notes && (
                  <DetailRow icon={BarChart2} label="Notes" value={d.notes} accent="#38bdf8" darkMode={darkMode} />
                )}

                {/* Probability bar — full width */}
                <div
                  className="p-3 rounded-xl border"
                  style={{
                    background:  darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    borderColor: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                  }}
                >
                  <ProbabilityBar value={prob} darkMode={darkMode} />
                </div>
              </div>

              {/* ── Modal footer ── */}
              <div
                className="flex items-center justify-between px-5 py-4 border-t"
                style={{ borderColor: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}
              >
                {/* Value display */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
                    style={{ color: textMuted }}>Deal value</p>
                  <p className="text-2xl font-bold" style={{ color: "#818cf8" }}>{d.value}</p>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSelectedDeal(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                    transition-all duration-200 hover:brightness-110
                    hover:scale-[1.02] active:scale-[0.98]"
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

export default Deals;
