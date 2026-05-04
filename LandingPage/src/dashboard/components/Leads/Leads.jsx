import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search, Plus, ChevronUp, ChevronDown, X,
  ArrowUpDown, TrendingUp, Users, DollarSign, Target,
  Trash2, Loader2, AlertCircle, RefreshCw,
} from "lucide-react";

// ─── API Base ─────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:8080/api/leads";

const getToken = () => localStorage.getItem("token");
 
const authHeaders = () => ({
  "Authorization": `Bearer ${getToken()}`,
});
 
const api = {
  getAll: (search = "") =>
    fetch(`${BASE_URL}${search ? `?search=${encodeURIComponent(search)}` : ""}`, {
      headers: authHeaders(),
    }).then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); }),
 
  create: (data) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); }),
 
  update: (id, data) =>
    fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); }),
 
  delete: (id) =>
    fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then((r) => { if (!r.ok) throw new Error(r.statusText); }),
};

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

const EMPTY_LEAD = {
  name: "", company: "", email: "", phone: "", status: "",
  source: "", conversionDate: "", dealStatus: "", receivedAmount: "", notes: "",
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent, darkMode }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: darkMode ? "rgba(33,34,45,0.85)" : "rgba(255,255,255,0.85)",
        borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
      }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
        <Icon size={15} style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-widest"
          style={{ color: darkMode ? "#475569" : "#94a3b8" }}>{label}</p>
        <p className="text-base font-bold leading-tight"
          style={{ color: darkMode ? "#e2e8f0" : "#0f172a" }}>{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status, config }) {
  if (!config) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide capitalize whitespace-nowrap"
      style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: config.dot }} />
      {config.label}
    </span>
  );
}

function SortIcon({ col, sortKey, sortDir }) {
  if (sortKey !== col) return <ArrowUpDown size={11} className="opacity-30" />;
  return sortDir === "asc"
    ? <ChevronUp size={12} className="text-indigo-400" />
    : <ChevronDown size={12} className="text-indigo-400" />;
}

function GlassInput({ darkMode, className = "", ...props }) {
  return (
    <input {...props}
      className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition-all duration-200 border focus:ring-2 focus:ring-indigo-500/30 ${className}`}
      style={{
        background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
        borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
        color: darkMode ? "#e2e8f0" : "#0f172a",
      }}
    />
  );
}

function GlassSelect({ darkMode, children, ...props }) {
  return (
    <select {...props}
      className="w-full rounded-xl px-3 py-2 text-sm outline-none transition-all duration-200 border focus:ring-2 focus:ring-indigo-500/30"
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

// ─── Delete confirm modal ─────────────────────────────────────────────────────
function DeleteConfirm({ lead, onConfirm, onCancel, darkMode, borderCol, textPrimary, textSecondary }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}>
      <div className="w-full max-w-sm rounded-2xl border shadow-2xl p-6 text-center"
        style={{
          background: darkMode ? "rgba(15,18,32,0.97)" : "rgba(255,255,255,0.97)",
          borderColor: "rgba(248,113,113,0.3)",
        }}>
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3">
          <Trash2 size={20} className="text-red-400" />
        </div>
        <h3 className="font-bold text-lg mb-1" style={{ color: textPrimary }}>Delete Lead</h3>
        <p className="text-sm mb-5" style={{ color: textSecondary }}>
          Are you sure you want to delete <strong>{lead.name}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-semibold border"
            style={{ borderColor: borderCol, color: textSecondary }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", boxShadow: "0 4px 16px rgba(239,68,68,0.4)" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Leads({ darkMode, searchQuery = "" }) {

  // ── State ──────────────────────────────────────────────────────────────────
  const [leads,         setLeads]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState(null);
  const [open,          setOpen]          = useState(false);
  const [currentLead,   setCurrentLead]   = useState(EMPTY_LEAD);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [sortKey,       setSortKey]       = useState("id");
  const [sortDir,       setSortDir]       = useState("asc");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [hoveredRow,    setHoveredRow]    = useState(null);

  // ── Fetch leads from API ───────────────────────────────────────────────────
  const fetchLeads = useCallback(async (search = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAll(search);
      setLeads(data);
    } catch (err) {
      setError("Failed to load leads. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // Re-fetch when searchQuery changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => fetchLeads(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchLeads]);

  // ── Dialog helpers ─────────────────────────────────────────────────────────
  const handleOpen  = (lead = EMPTY_LEAD) => { setCurrentLead(lead); setOpen(true); };
  const handleClose = () => { setOpen(false); setCurrentLead(EMPTY_LEAD); };

  // ── Save (add or update) ──────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      if (currentLead.id) {
        const updated = await api.update(currentLead.id, currentLead);
        setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      } else {
        const created = await api.create(currentLead);
        setLeads((prev) => [...prev, created]);
      }
      handleClose();
    } catch (err) {
      setError("Failed to save lead. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(deleteTarget.id);
      setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError("Failed to delete lead.");
      setDeleteTarget(null);
    }
  };

  // ── Sort ──────────────────────────────────────────────────────────────────
  const handleSort = (key) => {
    if (!COLUMNS.find((c) => c.key === key)?.sortable) return;
    setSortDir((d) => (sortKey === key ? (d === "asc" ? "desc" : "asc") : "asc"));
    setSortKey(key);
  };

  // ── Derived data ──────────────────────────────────────────────────────────
  const processed = useMemo(() => {
    let data = leads.filter((lead) => {
      const matchStatus = statusFilter === "all" || lead.status === statusFilter;
      return matchStatus;
    });
    data = [...data].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return data;
  }, [leads, statusFilter, sortKey, sortDir]);

  // ── Summary stats ─────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:     leads.length,
    active:    leads.filter((l) => l.dealStatus === "active").length,
    converted: leads.filter((l) => l.status === "converted").length,
    revenue:   leads.reduce((acc, l) => acc + (Number(l.receivedAmount) || 0), 0),
  }), [leads]);

  // ── Theme ─────────────────────────────────────────────────────────────────
  const bg          = darkMode ? "#171821"              : "#fffbeb";
  const cardBg      = darkMode ? "rgba(33,34,45,0.85)"  : "rgba(255,255,255,0.85)";
  const borderCol   = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const headerBg    = darkMode ? "rgba(15,17,28,0.9)"   : "rgba(241,245,249,0.9)";
  const rowHoverBg  = darkMode ? "rgba(255,255,255,0.04)" : "rgba(99,102,241,0.04)";
  const textPrimary    = darkMode ? "#e2e8f0" : "#0f172a";
  const textSecondary  = darkMode ? "#64748b" : "#94a3b8";

  return (
    <div className="min-h-screen p-4 sm:p-6 transition-colors duration-300"
      style={{ background: bg, color: textPrimary }}>

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4 border"
          style={{ background: "rgba(248,113,113,0.1)", borderColor: "rgba(248,113,113,0.3)", color: "#fca5a5" }}>
          <AlertCircle size={16} />
          <span className="text-sm flex-1">{error}</span>
          <button onClick={() => setError(null)}><X size={14} /></button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: textPrimary }}>
            Leads
          </h1>
          <p className="text-sm mt-0.5" style={{ color: textSecondary }}>
            {loading
              ? "Loading..."
              : `${processed.length} of ${leads.length} leads · sorted by ${sortKey}`}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Refresh */}
          <button onClick={() => fetchLeads(searchQuery)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 hover:scale-[1.02]"
            style={{ borderColor: borderCol, color: textSecondary, background: "transparent" }}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>

          {/* Add Lead */}
          <button onClick={() => handleOpen()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            style={{
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
            }}>
            <Plus size={15} />
            Add Lead
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users}      label="Total Leads" value={stats.total}                          accent="#818cf8" darkMode={darkMode} />
        <StatCard icon={TrendingUp} label="Active"      value={stats.active}                         accent="#34d399" darkMode={darkMode} />
        <StatCard icon={Target}     label="Converted"   value={stats.converted}                      accent="#fb923c" darkMode={darkMode} />
        <StatCard icon={DollarSign} label="Revenue"     value={`₹${stats.revenue.toLocaleString()}`} accent="#f472b6" darkMode={darkMode} />
      </div>

      {/* ── Status Filters ── */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {["all", "new", "contacted", "qualified", "converted", "lost"].map((s) => {
          const cfg = STATUS_CONFIG[s];
          const isActive = statusFilter === s;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200 border"
              style={{
                background: isActive ? (cfg ? cfg.bg : "rgba(99,102,241,0.15)") : "transparent",
                borderColor: isActive ? (cfg ? cfg.border : "rgba(99,102,241,0.35)") : borderCol,
                color: isActive ? (cfg ? cfg.text : "#818cf8") : textSecondary,
              }}>
              {s === "all" ? "All" : cfg?.label}
            </button>
          );
        })}
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl overflow-hidden border"
        style={{
          background: cardBg, borderColor: borderCol,
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          boxShadow: darkMode
            ? "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "0 4px 24px rgba(0,0,0,0.08)",
        }}>

        {/* Loading overlay */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={28} className="animate-spin" style={{ color: "#818cf8" }} />
              <p className="text-sm" style={{ color: textSecondary }}>Loading leads...</p>
            </div>
          </div>
        )}

        {!loading && (
          <div className="overflow-x-auto overflow-y-auto max-h-[65vh]">
            <table className="w-full text-sm min-w-[900px]">

              <thead className="sticky top-0 z-10">
                <tr style={{ background: headerBg, borderBottom: `1px solid ${borderCol}` }}>
                  {COLUMNS.map(({ key, label, sortable }) => (
                    <th key={key} onClick={() => handleSort(key)}
                      className={`py-3 px-4 text-left font-semibold text-[11px] tracking-widest uppercase select-none whitespace-nowrap transition-colors duration-150
                        ${sortable ? "cursor-pointer hover:text-indigo-400" : "cursor-default"}`}
                      style={{ color: textSecondary }}>
                      <span className="flex items-center gap-1.5">
                        {label}
                        {sortable && <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {processed.map((lead) => (
                  <tr key={lead.id}
                    onMouseEnter={() => setHoveredRow(lead.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="transition-colors duration-150"
                    style={{
                      background: hoveredRow === lead.id ? rowHoverBg : "transparent",
                      borderBottom: `1px solid ${borderCol}`,
                    }}>

                    {/* ID */}
                    <td className="py-3 px-4 font-mono text-xs" style={{ color: textSecondary }}>{lead.id}</td>

                    {/* Name */}
                    <td className="py-3 px-4 font-semibold whitespace-nowrap" style={{ color: textPrimary }}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                          style={{
                            background: `hsl(${(lead.id * 47) % 360}, 60%, 25%)`,
                            color: `hsl(${(lead.id * 47) % 360}, 80%, 75%)`,
                            border: `1px solid hsl(${(lead.id * 47) % 360}, 60%, 35%)`,
                          }}>
                          {(lead.name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div>{lead.name}</div>
                          {lead.email && (
                            <div className="text-[10px] font-normal" style={{ color: textSecondary }}>{lead.email}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-3 px-4 whitespace-nowrap" style={{ color: textSecondary }}>{lead.company}</td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={lead.status} config={STATUS_CONFIG[lead.status]} />
                    </td>

                    {/* Source */}
                    <td className="py-3 px-4 whitespace-nowrap text-xs" style={{ color: textSecondary }}>{lead.source}</td>

                    {/* Conversion date */}
                    <td className="py-3 px-4 whitespace-nowrap text-xs font-mono" style={{ color: textSecondary }}>
                      {lead.conversionDate || "—"}
                    </td>

                    {/* Deal status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={lead.dealStatus} config={DEAL_CONFIG[lead.dealStatus]} />
                    </td>

                    {/* Received amount */}
                    <td className="py-3 px-4 whitespace-nowrap font-semibold" style={{ color: "#34d399" }}>
                      {lead.receivedAmount
                        ? `₹ ${Number(lead.receivedAmount).toLocaleString()}`
                        : <span style={{ color: textSecondary }}>₹ ---</span>}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleOpen(lead)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                          style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8" }}>
                          Edit
                        </button>
                        <button onClick={() => setDeleteTarget(lead)}
                          className="px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                          style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {processed.length === 0 && !loading && (
                  <tr>
                    <td colSpan={9} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                          <Search size={22} style={{ color: "#818cf8" }} />
                        </div>
                        <p className="font-semibold" style={{ color: textPrimary }}>No leads found</p>
                        <p className="text-sm" style={{ color: textSecondary }}>Try adjusting your search or filter</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && (
          <div className="flex items-center justify-between px-4 py-3 text-xs"
            style={{ borderTop: `1px solid ${borderCol}`, color: textSecondary, background: headerBg }}>
            <span>{processed.length} results</span>
            <span>CuriumCRM · Leads</span>
          </div>
        )}
      </div>

      {/* ══ Add / Edit Dialog ══ */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>

          <div className="w-full max-w-md rounded-2xl border shadow-2xl overflow-y-auto max-h-[90vh]"
            style={{
              background: darkMode ? "rgba(15,18,32,0.95)" : "rgba(255,255,255,0.95)",
              borderColor: darkMode ? "rgba(99,102,241,0.25)" : "rgba(0,0,0,0.1)",
              backdropFilter: "blur(40px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
            }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
              style={{
                borderColor: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
                background: darkMode ? "rgba(15,18,32,0.95)" : "rgba(255,255,255,0.95)",
              }}>
              <div>
                <h2 className="font-bold text-lg" style={{ color: textPrimary }}>
                  {currentLead.id ? "Edit Lead" : "Add New Lead"}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: textSecondary }}>
                  {currentLead.id ? `Editing #${currentLead.id}` : "Fill in the details below"}
                </p>
              </div>
              <button onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${borderCol}`, color: textSecondary }}>
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-3">

              {/* Name + Email in a row */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "name",  placeholder: "Full name",   label: "Name"  },
                  { key: "email", placeholder: "email@co.com", label: "Email" },
                ].map(({ key, placeholder, label }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: textSecondary }}>{label}</label>
                    <GlassInput darkMode={darkMode} placeholder={placeholder}
                      value={currentLead[key]}
                      onChange={(e) => setCurrentLead({ ...currentLead, [key]: e.target.value })} />
                  </div>
                ))}
              </div>

              {/* Phone + Company */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "phone",   placeholder: "+91 9876543210", label: "Phone"   },
                  { key: "company", placeholder: "Company Inc.",   label: "Company" },
                ].map(({ key, placeholder, label }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: textSecondary }}>{label}</label>
                    <GlassInput darkMode={darkMode} placeholder={placeholder}
                      value={currentLead[key]}
                      onChange={(e) => setCurrentLead({ ...currentLead, [key]: e.target.value })} />
                  </div>
                ))}
              </div>

              {/* Source */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: textSecondary }}>Source</label>
                <GlassSelect darkMode={darkMode} value={currentLead.source}
                  onChange={(e) => setCurrentLead({ ...currentLead, source: e.target.value })}>
                  <option value="">Select source</option>
                  {["Website", "Referral", "Social Media", "Cold Call", "Email Campaign", "Other"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </GlassSelect>
              </div>

              {/* Status + Deal Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: textSecondary }}>Status</label>
                  <GlassSelect darkMode={darkMode} value={currentLead.status}
                    onChange={(e) => setCurrentLead({ ...currentLead, status: e.target.value })}>
                    <option value="">Select status</option>
                    {["new", "contacted", "qualified", "converted", "lost"].map((s) => (
                      <option key={s} value={s}>{STATUS_CONFIG[s]?.label}</option>
                    ))}
                  </GlassSelect>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: textSecondary }}>Deal Status</label>
                  <GlassSelect darkMode={darkMode} value={currentLead.dealStatus}
                    onChange={(e) => setCurrentLead({ ...currentLead, dealStatus: e.target.value })}>
                    <option value="">Select</option>
                    <option value="active">Active</option>
                    <option value="close">Close</option>
                  </GlassSelect>
                </div>
              </div>

              {/* Conversion Date + Received Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: textSecondary }}>Conversion Date</label>
                  <GlassInput darkMode={darkMode} type="date" value={currentLead.conversionDate}
                    onChange={(e) => setCurrentLead({ ...currentLead, conversionDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: textSecondary }}>Amount (₹)</label>
                  <GlassInput darkMode={darkMode} type="number" placeholder="0" value={currentLead.receivedAmount}
                    onChange={(e) => setCurrentLead({ ...currentLead, receivedAmount: e.target.value })} />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: textSecondary }}>Notes</label>
                <textarea
                  rows={3}
                  placeholder="Any additional notes..."
                  value={currentLead.notes || ""}
                  onChange={(e) => setCurrentLead({ ...currentLead, notes: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none transition-all duration-200 border focus:ring-2 focus:ring-indigo-500/30 resize-none"
                  style={{
                    background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                    borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
                    color: darkMode ? "#e2e8f0" : "#0f172a",
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t sticky bottom-0"
              style={{
                borderColor: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
                background: darkMode ? "rgba(15,18,32,0.95)" : "rgba(255,255,255,0.95)",
              }}>
              <button onClick={handleClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border"
                style={{ background: "transparent", borderColor: borderCol, color: textSecondary }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}>
                {saving && <Loader2 size={13} className="animate-spin" />}
                {currentLead.id ? "Save changes" : "Add lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Delete Confirm Modal ══ */}
      {deleteTarget && (
        <DeleteConfirm
          lead={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          darkMode={darkMode}
          borderCol={borderCol}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
        />
      )}
    </div>
  );
}