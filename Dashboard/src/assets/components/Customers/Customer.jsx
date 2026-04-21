import React, { useState, useMemo } from "react";
import { customersData } from "../../MockData/MockData.jsx";
import {
  Users, TrendingUp, DollarSign, ShoppingBag,
  X, Mail, Phone, MapPin, Package, Calendar, Search,
} from "lucide-react";

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS = {
  Active: { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.28)", text: "#6ee7b7", dot: "#34d399" },
  closed: { bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.28)", text: "#fca5a5", dot: "#f87171" },
};

// ─── Stat card ─────────────────────────────────────────────────────────────────
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
      </div>
    </div>
  );
}

// ─── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS[status] || STATUS.closed;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {status}
    </span>
  );
}

// ─── Detail row inside modal ───────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, value, accent = "#818cf8", darkMode }) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl border"
      style={{
        background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
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
        <p className="text-sm font-medium break-all"
          style={{ color: darkMode ? "#cbd5e1" : "#1e293b" }}>{value || "—"}</p>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
const Customer = ({ darkMode, searchQuery = "" }) => {

  // ── State ────────────────────────────────────────────────────────────────────
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [statusFilter,     setStatusFilter]     = useState("all");
  const [hoveredCard,      setHoveredCard]       = useState(null);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return customersData.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(q)    ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)   ||
        c.phone.toLowerCase().includes(q)   ||
        c.product.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all" || c.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [searchQuery, statusFilter]);

  // ── Summary stats ─────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:    customersData.length,
    active:   customersData.filter((c) => c.status === "Active").length,
    closed:   customersData.filter((c) => c.status !== "Active").length,
    revenue:  customersData.reduce((sum, c) => sum + (Number(c.value) || 0), 0),
  }), []);

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const bg          = darkMode ? "#171821"                  : "#f1f5f9";
  const cardBg      = darkMode ? "rgba(33,34,45,0.80)"      : "rgba(255,255,255,0.85)";
  const borderCol   = darkMode ? "rgba(255,255,255,0.07)"   : "rgba(0,0,0,0.08)";
  const textPrimary = darkMode ? "#e2e8f0"                  : "#0f172a";
  const textMuted   = darkMode ? "#64748b"                  : "#94a3b8";

  // ── Initials color per customer ───────────────────────────────────────────
  const avatarColor = (id) => ({
    bg:     `hsl(${(id * 53) % 360}, 55%, 22%)`,
    text:   `hsl(${(id * 53) % 360}, 75%, 70%)`,
    border: `hsl(${(id * 53) % 360}, 55%, 32%)`,
  });

  return (
    /* ── Page wrapper ── */
    <div
      className="min-h-screen p-4 sm:p-6 transition-colors duration-300"
      style={{ background: bg, color: textPrimary }}
    >

      {/* ══════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════ */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: textPrimary }}>
          Customer Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: textMuted }}>
          Showing {filtered.length} of {customersData.length} customers
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          STAT CARDS
      ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users}       label="Total"    value={stats.total}                         accent="#818cf8" darkMode={darkMode} />
        <StatCard icon={TrendingUp}  label="Active"   value={stats.active}                        accent="#34d399" darkMode={darkMode} />
        <StatCard icon={ShoppingBag} label="Closed"   value={stats.closed}                        accent="#f87171" darkMode={darkMode} />
        <StatCard icon={DollarSign}  label="Revenue"  value={stats.revenue.toLocaleString()}      accent="#f472b6" darkMode={darkMode} />
      </div>

      {/* ══════════════════════════════════════════════
          STATUS FILTER PILLS
      ══════════════════════════════════════════════ */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { key: "all",    label: "All Customers" },
          { key: "Active", label: "Active"         },
          { key: "closed", label: "Closed"         },
        ].map(({ key, label }) => {
          const active = statusFilter === key;
          const cfg    = STATUS[key];
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold
                transition-all duration-200 border"
              style={{
                background:   active ? (cfg?.bg   ?? "rgba(99,102,241,0.15)") : "transparent",
                borderColor:  active ? (cfg?.border ?? "rgba(99,102,241,0.35)") : borderCol,
                color:        active ? (cfg?.text   ?? "#818cf8") : textMuted,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════
          CUSTOMER GRID
      ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {filtered.map((c) => {
          const av      = avatarColor(c.id);
          const isHover = hoveredCard === c.id;
          const sCfg    = STATUS[c.status] || STATUS.closed;

          return (
            <div
              key={c.id}
              onMouseEnter={() => setHoveredCard(c.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="rounded-2xl border transition-all duration-250 flex flex-col"
              style={{
                /* glass card */
                background:         cardBg,
                borderColor:        isHover ? sCfg.border : borderCol,
                backdropFilter:     "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: isHover
                  ? `0 8px 40px rgba(0,0,0,0.25), 0 0 0 1px ${sCfg.border}`
                  : darkMode
                    ? "0 4px 20px rgba(0,0,0,0.3)"
                    : "0 2px 12px rgba(0,0,0,0.07)",
                transform: isHover ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              {/* ── Card header ── */}
              <div
                className="flex items-center justify-between px-5 pt-5 pb-3 border-b"
                style={{ borderColor: borderCol }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Initials avatar */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: av.bg, color: av.text, border: `1px solid ${av.border}` }}
                  >
                    {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold text-sm truncate" style={{ color: textPrimary }}>
                      {c.name}
                    </h2>
                    <p className="text-xs truncate" style={{ color: textMuted }}>{c.company}</p>
                  </div>
                </div>

                {/* Status badge */}
                <StatusBadge status={c.status} />
              </div>

              {/* ── Card body — info rows ── */}
              <div className="px-5 py-4 flex flex-col gap-2 flex-1">

                {/* Email */}
                <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                  <Mail size={11} className="flex-shrink-0" style={{ color: "#818cf8" }} />
                  <span className="truncate">{c.email}</span>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                  <Phone size={11} className="flex-shrink-0" style={{ color: "#34d399" }} />
                  <span>{c.phone}</span>
                </div>

                {/* Product */}
                <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                  <Package size={11} className="flex-shrink-0" style={{ color: "#fb923c" }} />
                  <span className="truncate">{c.product}</span>
                </div>

                {/* Purchase date */}
                <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                  <Calendar size={11} className="flex-shrink-0" style={{ color: "#f472b6" }} />
                  <span>{c.purchaseDate}</span>
                </div>
              </div>

              {/* ── Card footer — value + View button ── */}
              <div
                className="flex items-center justify-between px-5 py-3 border-t rounded-b-2xl"
                style={{
                  borderColor: borderCol,
                  background: darkMode ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.02)",
                }}
              >
                <span className="text-base font-bold" style={{ color: "#818cf8" }}>
                  {Number(c.value) ? `₹ ${Number(c.value).toLocaleString()}` : c.value}
                </span>

                <button
                  onClick={() => setSelectedCustomer(c)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                    hover:scale-105 active:scale-95"
                  style={{
                    background:  "rgba(99,102,241,0.12)",
                    border:      "1px solid rgba(99,102,241,0.25)",
                    color:       "#818cf8",
                  }}
                >
                  View
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <Search size={24} style={{ color: "#818cf8" }} />
            </div>
            <p className="font-semibold text-lg" style={{ color: textPrimary }}>No customers found</p>
            <p className="text-sm" style={{ color: textMuted }}>
              Try adjusting your search or filter
            </p>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          MODAL — Customer Detail
      ══════════════════════════════════════════════ */}
      {selectedCustomer && (() => {
        const c   = selectedCustomer;
        const av  = avatarColor(c.id);
        const sCfg = STATUS[c.status] || STATUS.closed;

        return (
          /* Backdrop — click outside to close */
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedCustomer(null); }}
          >
            {/* Modal card */}
            <div
              className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
              style={{
                background:   darkMode ? "rgba(13,16,30,0.97)" : "rgba(255,255,255,0.97)",
                borderColor:  darkMode ? "rgba(99,102,241,0.22)" : "rgba(0,0,0,0.1)",
                backdropFilter: "blur(40px)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.12)",
              }}
            >
              {/* ── Modal header ── */}
              <div
                className="relative flex flex-col items-center pt-8 pb-5 px-6 border-b"
                style={{ borderColor: borderCol }}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center
                    transition-colors duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${borderCol}`,
                    color: textMuted,
                  }}
                >
                  <X size={14} />
                </button>

                {/* Avatar */}
                {c.photo ? (
                  <img
                    src={c.photo}
                    alt={c.name}
                    className="w-20 h-20 rounded-2xl object-cover mb-3 border-2"
                    style={{ borderColor: sCfg.border }}
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center
                      text-2xl font-bold mb-3"
                    style={{
                      background: av.bg, color: av.text,
                      border: `2px solid ${av.border}`,
                      boxShadow: `0 4px 20px ${av.bg}`,
                    }}
                  >
                    {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                )}

                {/* Name + company */}
                <h2 className="text-xl font-bold text-center" style={{ color: textPrimary }}>
                  {c.name}
                </h2>
                <p className="text-sm mt-0.5 mb-3" style={{ color: textMuted }}>{c.company}</p>

                {/* Status badge */}
                <StatusBadge status={c.status} />
              </div>

              {/* ── Modal body — detail rows ── */}
              <div className="px-5 py-4 grid grid-cols-1 gap-2">
                <DetailRow icon={Mail}     label="Email"         value={c.email}        accent="#818cf8" darkMode={darkMode} />
                <DetailRow icon={Phone}    label="Phone"         value={c.phone}        accent="#34d399" darkMode={darkMode} />
                <DetailRow icon={MapPin}   label="Address"       value={c.address}      accent="#fb923c" darkMode={darkMode} />
                <DetailRow icon={Package}  label="Product"       value={c.product}      accent="#f472b6" darkMode={darkMode} />
                <DetailRow icon={Calendar} label="Purchase Date" value={c.purchaseDate} accent="#38bdf8" darkMode={darkMode} />
              </div>

              {/* ── Modal footer — value + Close ── */}
              <div
                className="flex items-center justify-between px-5 py-4 border-t"
                style={{ borderColor: borderCol }}
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
                    style={{ color: textMuted }}>Contract value</p>
                  <p className="text-xl font-bold" style={{ color: "#818cf8" }}>
                    {Number(c.value) ? `₹ ${Number(c.value).toLocaleString()}` : c.value}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                    transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #06b6d4)",
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

export default Customer;
