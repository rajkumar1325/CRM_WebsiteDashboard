import React, { useState, useMemo } from "react";
import { mockData } from "../../MockData/MockData";
import {
  Search, Plus, ChevronUp, ChevronDown, X,
  ArrowUpDown, TrendingUp, Users, DollarSign, Target,
} from "lucide-react";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  new:       { label: "New",       dot: "#60a5fa", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.3)",  text: "#93c5fd" },
  contacted: { label: "Contacted", dot: "#fb923c", bg: "rgba(251,146,60,0.12)",  border: "rgba(251,146,60,0.3)",  text: "#fdba74" },
  qualified: { label: "Qualified", dot: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.3)", text: "#c4b5fd" },
  converted: { label: "Converted", dot: "#34d399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.3)",  text: "#6ee7b7" },
  lost:      { label: "Lost",      dot: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)", text: "#fca5a5" },
};

const DEAL_CONFIG = {
  active: { label: "Active", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.3)", text: "#fcd34d" },
  close:  { label: "Close",  bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", text: "#94a3b8" },
};

// ─── Table columns ────────────────────────────────────────────────────────────
const COLUMNS = [
  { key: "id",             label: "ID",               sortable: true  },
  { key: "name",           label: "Name",             sortable: true  },
  { key: "company",        label: "Company",          sortable: true  },
  { key: "status",         label: "Status",           sortable: true  },
  { key: "source",         label: "Source",           sortable: false },
  { key: "conversionDate", label: "Conversion Date",  sortable: true  },
  { key: "dealStatus",     label: "Deal Status",      sortable: true  },
  { key: "receivedAmount", label: "Received Amount",  sortable: true  },
  { key: "action",         label: "Action",           sortable: false },
];

// ─── Empty lead template ──────────────────────────────────────────────────────
const EMPTY_LEAD = {
  name: "", company: "", status: "", source: "",
  conversionDate: "", dealStatus: "", receivedAmount: "",
};

// ─── Stat card for the summary row ───────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent, darkMode }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
        borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
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
        <p className="text-[10px] font-medium uppercase tracking-widest"
          style={{ color: darkMode ? "#475569" : "#94a3b8" }}>
          {label}
        </p>
        <p className="text-base font-bold leading-tight"
          style={{ color: darkMode ? "#e2e8f0" : "#0f172a" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, config }) {
  if (!config) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide capitalize whitespace-nowrap"
      style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.text }}
    >
      {/* Pulsing dot */}
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: config.dot }}
      />
      {config.label}
    </span>
  );
}

// ─── Sort icon helper ─────────────────────────────────────────────────────────
function SortIcon({ col, sortKey, sortDir }) {
  if (sortKey !== col) return <ArrowUpDown size={11} className="opacity-30" />;
  return sortDir === "asc"
    ? <ChevronUp size={12} className="text-indigo-400" />
    : <ChevronDown size={12} className="text-indigo-400" />;
}

// ─── Glass input ──────────────────────────────────────────────────────────────
function GlassInput({ darkMode, className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition-all duration-200
        border focus:ring-2 focus:ring-indigo-500/30 ${className}`}
      style={{
        background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
        borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
        color: darkMode ? "#e2e8f0" : "#0f172a",
      }}
    />
  );
}

// ─── Glass select ─────────────────────────────────────────────────────────────
function GlassSelect({ darkMode, children, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-xl px-3 py-2 text-sm outline-none transition-all duration-200
        border focus:ring-2 focus:ring-indigo-500/30"
      style={{
        background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)",
        borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
        color: darkMode ? "#e2e8f0" : "#0f172a",
      }}
    >
      {children}
    </select>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Leads({ darkMode, searchQuery = "" }) {

  // ── State ──────────────────────────────────────────────────────────────────
  const [leads,       setLeads]       = useState(mockData);
  const [open,        setOpen]        = useState(false);
  const [currentLead, setCurrentLead] = useState(EMPTY_LEAD);
  const [sortKey,     setSortKey]     = useState("id");
  const [sortDir,     setSortDir]     = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hoveredRow,  setHoveredRow]  = useState(null);

  // ── Open / close dialog ────────────────────────────────────────────────────
  const handleOpen  = (lead = EMPTY_LEAD) => { setCurrentLead(lead); setOpen(true); };
  const handleClose = () => { setOpen(false); setCurrentLead(EMPTY_LEAD); };

  // ── Save (add or update) ──────────────────────────────────────────────────
  const handleSave = () => {
    if (currentLead.id) {
      // update existing
      setLeads((prev) => prev.map((l) => (l.id === currentLead.id ? currentLead : l)));
    } else {
      // add new — generate a fresh id
      const newId = Math.max(...leads.map((l) => l.id), 0) + 1;
      setLeads((prev) => [...prev, { ...currentLead, id: newId }]);
    }
    handleClose();
  };

  // ── Sort handler ──────────────────────────────────────────────────────────
  const handleSort = (key) => {
    if (!COLUMNS.find((c) => c.key === key)?.sortable) return;
    setSortDir((d) => (sortKey === key ? (d === "asc" ? "desc" : "asc") : "asc"));
    setSortKey(key);
  };

  // ── Derived / memoised data ────────────────────────────────────────────────
  const processed = useMemo(() => {
    let data = leads.filter((lead) => {
      // topbar search
      const q = searchQuery.toLowerCase();
      const matchSearch =
        lead.name.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q);

      // local status filter
      const matchStatus = statusFilter === "all" || lead.status === statusFilter;

      return matchSearch && matchStatus;
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
  }, [leads, searchQuery, statusFilter, sortKey, sortDir]);

  // ── Summary stats ─────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:     leads.length,
    active:    leads.filter((l) => l.dealStatus === "active").length,
    converted: leads.filter((l) => l.status === "converted").length,
    revenue:   leads.reduce((acc, l) => acc + (l.receivedAmount || 0), 0),
  }), [leads]);

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const bg         = darkMode ? "#171821"             : "#f1f5f9";
  const cardBg     = darkMode ? "rgba(33,34,45,0.85)" : "rgba(255,255,255,0.85)";
  const borderCol  = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const headerBg   = darkMode ? "rgba(15,17,28,0.9)"  : "rgba(241,245,249,0.9)";
  const rowHoverBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(99,102,241,0.04)";
  const textPrimary   = darkMode ? "#e2e8f0" : "#0f172a";
  const textSecondary = darkMode ? "#64748b" : "#94a3b8";

  return (
    /* ── Page wrapper ── */
    <div
      className="min-h-screen p-4 sm:p-6 transition-colors duration-300"
      style={{ background: bg, color: textPrimary }}
    >

      {/* ══════════════════════════════════════════════════
          HEADER ROW  —  Title + Add button
      ══════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: textPrimary }}>
            Leads
          </h1>
          <p className="text-sm mt-0.5" style={{ color: textSecondary }}>
            {processed.length} of {leads.length} leads · sorted by {sortKey}
          </p>
        </div>

        {/* Add Lead button */}
        <button
          onClick={() => handleOpen()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
            text-white transition-all duration-200 hover:brightness-110 hover:scale-[1.02]
            active:scale-[0.98] shadow-lg"
          style={{
            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
            boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
          }}
        >
          <Plus size={15} />
          Add Lead
        </button>
      </div>

      {/* ══════════════════════════════════════════════════
          STAT CARDS ROW
      ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users}      label="Total Leads" value={stats.total}                                    accent="#818cf8" darkMode={darkMode} />
        <StatCard icon={TrendingUp} label="Active"      value={stats.active}                                   accent="#34d399" darkMode={darkMode} />
        <StatCard icon={Target}     label="Converted"   value={stats.converted}                                accent="#fb923c" darkMode={darkMode} />
        <StatCard icon={DollarSign} label="Revenue"     value={`₹${stats.revenue.toLocaleString()}`}           accent="#f472b6" darkMode={darkMode} />
      </div>

      {/* ══════════════════════════════════════════════════
          FILTERS ROW  —  status pill filters
      ══════════════════════════════════════════════════ */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {["all", "new", "contacted", "qualified", "converted", "lost"].map((s) => {
          const cfg = STATUS_CONFIG[s];
          const isActive = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold
                capitalize transition-all duration-200 border"
              style={{
                background: isActive
                  ? (cfg ? cfg.bg : "rgba(99,102,241,0.15)")
                  : "transparent",
                borderColor: isActive
                  ? (cfg ? cfg.border : "rgba(99,102,241,0.35)")
                  : borderCol,
                color: isActive
                  ? (cfg ? cfg.text : "#818cf8")
                  : textSecondary,
              }}
            >
              {s === "all" ? "All" : cfg?.label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════
          TABLE CARD
      ══════════════════════════════════════════════════ */}
      <div
        className="rounded-2xl overflow-hidden border"
        style={{
          background: cardBg,
          borderColor: borderCol,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: darkMode
            ? "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        {/* horizontal scroll wrapper for mobile */}
        <div className="overflow-x-auto overflow-y-auto max-h-[65vh]">
          <table className="w-full text-sm min-w-[800px]">

            {/* ── TABLE HEAD ── */}
            <thead className="sticky top-0 z-10">
              <tr style={{ background: headerBg, borderBottom: `1px solid ${borderCol}` }}>
                {COLUMNS.map(({ key, label, sortable }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className={`py-3 px-4 text-left font-semibold text-[11px] tracking-widest
                      uppercase select-none whitespace-nowrap transition-colors duration-150
                      ${sortable ? "cursor-pointer hover:text-indigo-400" : "cursor-default"}`}
                    style={{ color: textSecondary }}
                  >
                    <span className="flex items-center gap-1.5">
                      {label}
                      {/* Sort indicator — only on sortable columns */}
                      {sortable && <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── TABLE BODY ── */}
            <tbody>
              {processed.map((lead, idx) => (
                <tr
                  key={lead.id}
                  onMouseEnter={() => setHoveredRow(lead.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className="transition-colors duration-150"
                  style={{
                    background: hoveredRow === lead.id ? rowHoverBg : "transparent",
                    borderBottom: `1px solid ${borderCol}`,
                  }}
                >
                  {/* ID */}
                  <td className="py-3 px-4 font-mono text-xs" style={{ color: textSecondary }}>
                    {lead.id}
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4 font-semibold whitespace-nowrap" style={{ color: textPrimary }}>
                    <div className="flex items-center gap-2">
                      {/* Initials avatar */}
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{
                          background: `hsl(${(lead.id * 47) % 360}, 60%, 25%)`,
                          color: `hsl(${(lead.id * 47) % 360}, 80%, 75%)`,
                          border: `1px solid hsl(${(lead.id * 47) % 360}, 60%, 35%)`,
                        }}
                      >
                        {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      {lead.name}
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-3 px-4 whitespace-nowrap" style={{ color: textSecondary }}>
                    {lead.company}
                  </td>

                  {/* Status badge */}
                  <td className="py-3 px-4">
                    <StatusBadge status={lead.status} config={STATUS_CONFIG[lead.status]} />
                  </td>

                  {/* Source */}
                  <td className="py-3 px-4 whitespace-nowrap text-xs" style={{ color: textSecondary }}>
                    {lead.source}
                  </td>

                  {/* Conversion date */}
                  <td className="py-3 px-4 whitespace-nowrap text-xs font-mono" style={{ color: textSecondary }}>
                    {lead.conversionDate}
                  </td>

                  {/* Deal status badge */}
                  <td className="py-3 px-4">
                    <StatusBadge status={lead.dealStatus} config={DEAL_CONFIG[lead.dealStatus]} />
                  </td>

                  {/* Received amount */}
                  <td className="py-3 px-4 whitespace-nowrap font-semibold" style={{ color: "#34d399" }}>
                    {lead.receivedAmount
                      ? `₹ ${lead.receivedAmount.toLocaleString()}`
                      : <span style={{ color: textSecondary }}>₹ ---</span>
                    }
                  </td>

                  {/* Edit button */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleOpen(lead)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200
                        hover:scale-105 active:scale-95"
                      style={{
                        background: "rgba(99,102,241,0.12)",
                        border: "1px solid rgba(99,102,241,0.25)",
                        color: "#818cf8",
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

              {/* Empty state */}
              {processed.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
                      >
                        <Search size={22} style={{ color: "#818cf8" }} />
                      </div>
                      <p className="font-semibold" style={{ color: textPrimary }}>No leads found</p>
                      <p className="text-sm" style={{ color: textSecondary }}>
                        Try adjusting your search or filter
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div
          className="flex items-center justify-between px-4 py-3 text-xs"
          style={{
            borderTop: `1px solid ${borderCol}`,
            color: textSecondary,
            background: headerBg,
          }}
        >
          <span>{processed.length} results</span>
          <span>CuriumCRM · Leads</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          DIALOG  —  Add / Edit Lead
      ══════════════════════════════════════════════════ */}
      {open && (
        /* Backdrop */
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          {/* Dialog card */}
          <div
            className="w-full max-w-md rounded-2xl border shadow-2xl"
            style={{
              background: darkMode ? "rgba(15,18,32,0.95)" : "rgba(255,255,255,0.95)",
              borderColor: darkMode ? "rgba(99,102,241,0.25)" : "rgba(0,0,0,0.1)",
              backdropFilter: "blur(40px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
            }}
          >
            {/* Dialog header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}
            >
              <div>
                <h2 className="font-bold text-lg" style={{ color: textPrimary }}>
                  {currentLead.id ? "Edit Lead" : "Add New Lead"}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                  {currentLead.id ? `Editing #${currentLead.id}` : "Fill in the details below"}
                </p>
              </div>

              {/* Close X */}
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${borderCol}`,
                  color: textSecondary,
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Dialog body */}
            <div className="px-6 py-5 space-y-3">

              {/* Text inputs — name, company, source */}
              {[
                { key: "name",    placeholder: "Full name",   label: "Name"    },
                { key: "company", placeholder: "Company Inc.", label: "Company" },
                { key: "source",  placeholder: "Referral, Website…", label: "Source" },
              ].map(({ key, placeholder, label }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest"
                    style={{ color: textSecondary }}>
                    {label}
                  </label>
                  <GlassInput
                    darkMode={darkMode}
                    placeholder={placeholder}
                    value={currentLead[key]}
                    onChange={(e) => setCurrentLead({ ...currentLead, [key]: e.target.value })}
                  />
                </div>
              ))}

              {/* Status select */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest"
                  style={{ color: textSecondary }}>
                  Status
                </label>
                <GlassSelect
                  darkMode={darkMode}
                  value={currentLead.status}
                  onChange={(e) => setCurrentLead({ ...currentLead, status: e.target.value })}
                >
                  <option value="">Select status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </GlassSelect>
              </div>

              {/* Conversion date */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest"
                  style={{ color: textSecondary }}>
                  Conversion Date
                </label>
                <GlassInput
                  darkMode={darkMode}
                  type="date"
                  value={currentLead.conversionDate}
                  onChange={(e) => setCurrentLead({ ...currentLead, conversionDate: e.target.value })}
                />
              </div>

              {/* Deal status select */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest"
                  style={{ color: textSecondary }}>
                  Deal Status
                </label>
                <GlassSelect
                  darkMode={darkMode}
                  value={currentLead.dealStatus}
                  onChange={(e) => setCurrentLead({ ...currentLead, dealStatus: e.target.value })}
                >
                  <option value="">Select deal status</option>
                  <option value="active">Active</option>
                  <option value="close">Close</option>
                </GlassSelect>
              </div>

              {/* Received amount */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest"
                  style={{ color: textSecondary }}>
                  Received Amount (₹)
                </label>
                <GlassInput
                  darkMode={darkMode}
                  type="number"
                  placeholder="0"
                  value={currentLead.receivedAmount}
                  onChange={(e) =>
                    setCurrentLead({ ...currentLead, receivedAmount: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            {/* Dialog footer */}
            <div
              className="flex justify-end gap-3 px-6 py-4 border-t"
              style={{ borderColor: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}
            >
              {/* Cancel */}
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  hover:scale-[1.02] active:scale-[0.98] border"
                style={{
                  background: "transparent",
                  borderColor: borderCol,
                  color: textSecondary,
                }}
              >
                Cancel
              </button>

              {/* Save */}
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white
                  transition-all duration-200 hover:brightness-110 hover:scale-[1.02]
                  active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
                }}
              >
                {currentLead.id ? "Save changes" : "Add lead"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
