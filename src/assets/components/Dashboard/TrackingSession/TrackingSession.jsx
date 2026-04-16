import React, { useState, useRef, useMemo } from "react";
import { mockData } from "../../../MockData/MockData";

// Icons
import PhoneIcon    from "./icons/phone.svg?react";
import MailIcon     from "./icons/mail.svg?react";
import UserIcon     from "./icons/user.svg?react";
import Employee     from "./icons/employee.svg?react";
import CalendarIcon from "./icons/calendar.svg?react";

// ─── Contact type config ──────────────────────────────────────────────────────
const CONTACT_CONFIG = {
  Call:  { icon: PhoneIcon, color: "#34d399", bg: "rgba(52,211,153,0.13)",  border: "rgba(52,211,153,0.28)",  label: "Call"   },
  Email: { icon: MailIcon,  color: "#60a5fa", bg: "rgba(96,165,250,0.13)",  border: "rgba(96,165,250,0.28)",  label: "Email"  },
  Local: { icon: UserIcon,  color: "#c084fc", bg: "rgba(192,132,252,0.13)", border: "rgba(192,132,252,0.28)", label: "Visit"  },
};

// ─── Rating config ────────────────────────────────────────────────────────────
// Returns color based on star rating value
const ratingColor = (r) =>
  r >= 4 ? "#34d399" : r === 3 ? "#fbbf24" : "#f87171";

// ─── Date formatter ───────────────────────────────────────────────────────────
function formatDateTime(timeStr) {
  if (!timeStr) return "—";
  const d = new Date(timeStr);
  if (isNaN(d)) return timeStr; // fallback: show raw string if unparseable
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    + " · "
    + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

// ─── Relative time label ──────────────────────────────────────────────────────
function relativeTime(timeStr) {
  if (!timeStr) return "";
  const diff = Date.now() - new Date(timeStr);
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Star Rating component ────────────────────────────────────────────────────
function StarRating({ rating, color }) {
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ fontSize: 12, color: s <= rating ? color : "rgba(128,128,128,0.25)" }}>
          ★
        </span>
      ))}
    </div>
  );
}

// ─── Single Call Card ─────────────────────────────────────────────────────────
/**
 * One call log card with:
 * - Contact type icon pill (Call / Email / Visit) with accent color
 * - Client name + employee who handled it
 * - Relative time + formatted date
 * - Feedback text (italic)
 * - Star rating with color-coded score
 * - Expandable feedback (truncated → full on click)
 */
function CallCard({ call, darkMode }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = CONTACT_CONFIG[call.contactType] || CONTACT_CONFIG.Call;
  const Icon = cfg.icon;
  const color = cfg.color;
  const rating = call.rating || 0;
  const starColor = ratingColor(rating);

  // Contact identifier: phone number / email / "Visited Office"
  const contactId =
    call.contactType === "Call"  ? call.callNumber
    : call.contactType === "Email" ? call.email
    : "Visited Office";

  return (
    <div className={`call-card ${darkMode ? "call-card-dark" : "call-card-light"}`}>

      {/* ── Top row: type pill + time ── */}
      <div className="call-top">
        {/* Contact type pill */}
        <div
          className="call-type-pill"
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
        >
          <Icon style={{ width: 12, height: 12, color }} />
          <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: 0.3 }}>
            {cfg.label}
          </span>
        </div>

        {/* Relative time chip */}
        <span className={`call-time-chip ${darkMode ? "time-dark" : "time-light"}`}>
          {relativeTime(call.time)}
        </span>
      </div>

      {/* ── Contact identifier (phone / email / visit) ── */}
      <div className="call-contact-id" style={{ color }}>
        {contactId}
      </div>

      {/* ── Client name ── */}
      <div className={`call-client ${darkMode ? "client-dark" : "client-light"}`}>
        {call.leadName}
        {call.leadEmail && (
          <span className={`call-email ${darkMode ? "email-dark" : "email-light"}`}>
            {" · "}{call.leadEmail}
          </span>
        )}
      </div>

      {/* ── Date ── */}
      <div className="call-date-row">
        <CalendarIcon style={{ width: 11, height: 11, color: "rgba(128,128,128,0.5)", flexShrink: 0 }} />
        <span className={`call-date ${darkMode ? "date-dark" : "date-light"}`}>
          {formatDateTime(call.time)}
        </span>
      </div>

      {/* ── Feedback (truncated, click to expand) ── */}
      {call.feedback && (
        <div
          className={`call-feedback ${darkMode ? "feedback-dark" : "feedback-light"} ${expanded ? "" : "feedback-clamped"}`}
          onClick={() => setExpanded((v) => !v)}
          title={expanded ? "Click to collapse" : "Click to expand"}
        >
          "{call.feedback}"
          {!expanded && <span className="feedback-more" style={{ color }}>  more</span>}
        </div>
      )}

      {/* ── Footer: employee + rating ── */}
      <div className="call-footer">
        <div className="call-employee">
          <Employee style={{ width: 13, height: 13, color: "rgba(128,128,128,0.5)" }} />
          <span className={`employee-name ${darkMode ? "emp-dark" : "emp-light"}`}>
            {call.contactedBy}
          </span>
        </div>

        {/* Star rating with color-coded score */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <StarRating rating={rating} color={starColor} />
          <span style={{ fontSize: 10, fontWeight: 700, color: starColor }}>{rating}/5</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TrackingSession({ darkMode }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const [filterType,   setFilterType]   = useState("All");   // All | Call | Email | Local
  const [sortBy,       setSortBy]       = useState("newest"); // newest | oldest | rating
  const [searchQuery,  setSearchQuery]  = useState("");

  // ── 3D tilt ──
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.transform = `perspective(900px) rotateX(${((y / rect.height) - 0.5) * -5}deg) rotateY(${((x / rect.width) - 0.5) * 5}deg)`;
    glow.style.left = `${x}px`;
    glow.style.top  = `${y}px`;
    glow.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  // ── Extract all call logs from mockData ──
  const allCalls = useMemo(() =>
    mockData.flatMap((lead) =>
      (lead.callHistory || []).map((call) => ({
        ...call,
        leadName:  lead.name,
        leadEmail: lead.email,
      }))
    ), []);

  // ── Derived stats for header chips ──
  const stats = useMemo(() => ({
    total:    allCalls.length,
    calls:    allCalls.filter((c) => c.contactType === "Call").length,
    emails:   allCalls.filter((c) => c.contactType === "Email").length,
    visits:   allCalls.filter((c) => c.contactType === "Local").length,
    avgRating: allCalls.length
      ? (allCalls.reduce((a, c) => a + (c.rating || 0), 0) / allCalls.length).toFixed(1)
      : "—",
  }), [allCalls]);

  // ── Filter + sort + search ──
  const filtered = useMemo(() => {
    let result = allCalls;

    // Type filter
    if (filterType !== "All") result = result.filter((c) => c.contactType === filterType);

    // Search by client name or employee
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.leadName?.toLowerCase().includes(q) ||
          c.contactedBy?.toLowerCase().includes(q) ||
          c.feedback?.toLowerCase().includes(q)
      );
    }

    // Sort
    return [...result].sort((a, b) => {
      if (sortBy === "newest")  return new Date(b.time) - new Date(a.time);
      if (sortBy === "oldest")  return new Date(a.time) - new Date(b.time);
      if (sortBy === "rating")  return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [allCalls, filterType, sortBy, searchQuery]);

  const FILTER_TABS = [
    { value: "All",   label: `All (${stats.total})`   },
    { value: "Call",  label: `Calls (${stats.calls})`  },
    { value: "Email", label: `Email (${stats.emails})` },
    { value: "Local", label: `Visit (${stats.visits})` },
  ];

  return (
    <>
      <style>{`

        /* ── GLASS CARD ── */
        .ts-card {
          position: relative; overflow: hidden; border-radius: 22px;
          padding: 22px 20px 18px; width: 100%;
          animation: tsEntrance 0.65s cubic-bezier(0.34,1.4,0.64,1) both;
          will-change: transform; transform-style: preserve-3d;
          transition: box-shadow 0.3s ease;
        }
        .ts-dark {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.11);
          backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .ts-light {
          background: rgba(255,255,255,0.68); border: 1px solid rgba(255,255,255,0.92);
          backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(100,100,150,0.1), inset 0 1px 0 rgba(255,255,255,1);
        }
        .ts-dark:hover  { box-shadow: 0 24px 60px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.2); }
        .ts-light:hover { box-shadow: 0 24px 60px rgba(100,100,150,0.18), inset 0 1px 0 rgba(255,255,255,1); }

        .ts-glow {
          position: absolute; width: 240px; height: 240px; border-radius: 50%; pointer-events: none;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%);
          transition: opacity 0.3s ease, left 0.05s, top 0.05s; z-index: 0;
        }
        .ts-shimmer {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, transparent 55%); z-index: 0;
        }

        /* ── HEADER ── */
        .ts-header { position: relative; z-index: 1; margin-bottom: 14px; }
        .ts-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .ts-title-dark  { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.92); margin: 0; }
        .ts-title-light { font-size: 15px; font-weight: 600; color: #1a1a2e; margin: 0; }

        /* Avg rating badge */
        .ts-rating-badge {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px;
          background: rgba(251,191,36,0.14); color: #fbbf24; border: 1px solid rgba(251,191,36,0.28);
        }

        /* ── SEARCH BAR ── */
        .ts-search {
          position: relative; z-index: 1; margin-bottom: 10px;
        }
        .ts-search-input {
          width: 100%; box-sizing: border-box; padding: 8px 12px 8px 34px;
          border-radius: 12px; font-size: 12px; outline: none; transition: border-color 0.2s;
        }
        .search-dark  { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.85); }
        .search-light { background: rgba(0,0,0,0.04);      border: 1px solid rgba(0,0,0,0.1);       color: #1a1a2e; }
        .search-dark:focus  { border-color: rgba(52,211,153,0.5); }
        .search-light:focus { border-color: rgba(16,185,129,0.5); }
        .search-icon {
          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
          font-size: 13px; pointer-events: none; opacity: 0.4;
        }

        /* ── FILTER TABS + SORT ── */
        .ts-controls {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between;
          gap: 6px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .ts-tabs { display: flex; gap: 4px; flex-wrap: wrap; }

        .ts-tab {
          font-size: 10.5px; font-weight: 500; padding: 3px 10px; border-radius: 20px;
          border: 1px solid transparent; cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .ts-tab-dark  { color: rgba(255,255,255,0.38); border-color: rgba(255,255,255,0.08); background: transparent; }
        .ts-tab-light { color: rgba(30,30,60,0.4);    border-color: rgba(0,0,0,0.08);       background: transparent; }
        .ts-active-dark  { background: rgba(52,211,153,0.16); color: #34d399; border-color: rgba(52,211,153,0.3); }
        .ts-active-light { background: rgba(16,185,129,0.1);  color: #059669; border-color: rgba(16,185,129,0.28); }

        /* Sort select */
        .ts-sort {
          font-size: 10.5px; padding: 3px 8px; border-radius: 10px; cursor: pointer; outline: none;
        }
        .sort-dark  { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); }
        .sort-light { background: rgba(0,0,0,0.04);      border: 1px solid rgba(0,0,0,0.08);      color: rgba(30,30,60,0.6); }

        /* ── SCROLLABLE LIST ── */
        .ts-list {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 10px;
          max-height: 380px; overflow-y: auto;
          padding-right: 4px;
          scrollbar-width: thin;
          scrollbar-color: rgba(52,211,153,0.25) transparent;
        }
        .ts-list::-webkit-scrollbar { width: 4px; }
        .ts-list::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.25); border-radius: 99px; }

        /* Empty state */
        .ts-empty { text-align: center; padding: 30px 0; font-size: 12px; color: rgba(128,128,128,0.4); }

        /* ── CALL CARD ── */
        .call-card {
          border-radius: 16px; padding: 12px 14px;
          display: flex; flex-direction: column; gap: 6px;
          transition: background 0.2s ease, border-color 0.2s ease;
          cursor: default;
        }
        .call-card-dark  { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); }
        .call-card-light { background: rgba(0,0,0,0.025);     border: 1px solid rgba(0,0,0,0.07); }
        .call-card-dark:hover  { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.14); }
        .call-card-light:hover { background: rgba(0,0,0,0.04);      border-color: rgba(0,0,0,0.11); }

        /* Top row: type pill + relative time */
        .call-top { display: flex; align-items: center; justify-content: space-between; }
        .call-type-pill {
          display: flex; align-items: center; gap: 5px;
          padding: 3px 9px; border-radius: 20px;
        }
        .call-time-chip { font-size: 10px; font-weight: 500; }
        .time-dark  { color: rgba(255,255,255,0.3); }
        .time-light { color: rgba(30,30,60,0.4); }

        /* Contact identifier */
        .call-contact-id { font-size: 13px; font-weight: 700; letter-spacing: -0.2px; }

        /* Client name */
        .call-client { font-size: 12px; font-weight: 500; }
        .client-dark  { color: rgba(255,255,255,0.75); }
        .client-light { color: rgba(30,30,60,0.75); }

        .call-email { font-size: 11px; font-weight: 400; }
        .email-dark  { color: rgba(255,255,255,0.3); }
        .email-light { color: rgba(30,30,60,0.38); }

        /* Date row */
        .call-date-row { display: flex; align-items: center; gap: 5px; }
        .call-date { font-size: 10.5px; }
        .date-dark  { color: rgba(255,255,255,0.3); }
        .date-light { color: rgba(30,30,60,0.4); }

        /* Feedback */
        .call-feedback {
          font-size: 11.5px; font-style: italic; line-height: 1.5;
          cursor: pointer; transition: color 0.15s;
          border-left: 2px solid rgba(128,128,128,0.15);
          padding-left: 8px; margin: 2px 0;
        }
        .feedback-dark  { color: rgba(255,255,255,0.5); }
        .feedback-light { color: rgba(30,30,60,0.55); }
        /* Clamp to 2 lines unless expanded */
        .feedback-clamped {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .feedback-more { font-style: normal; font-weight: 600; font-size: 10.5px; cursor: pointer; }

        /* Footer: employee + rating */
        .call-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 2px; }
        .call-employee { display: flex; align-items: center; gap: 5px; }
        .employee-name { font-size: 11px; font-weight: 600; }
        .emp-dark  { color: rgba(255,255,255,0.65); }
        .emp-light { color: rgba(30,30,60,0.65); }

        /* ── ENTRANCE ── */
        @keyframes tsEntrance {
          from { opacity:0; transform: perspective(900px) translateY(28px) scale(0.96); }
          to   { opacity:1; transform: perspective(900px) translateY(0) scale(1); }
        }
      `}</style>

      <div
        ref={cardRef}
        className={`ts-card ${darkMode ? "ts-dark" : "ts-light"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={glowRef} className="ts-glow" style={{ opacity: 0 }} />
        <div className="ts-shimmer" />

        {/* ── Header ── */}
        <div className="ts-header">
          <div className="ts-title-row">
            <p className={darkMode ? "ts-title-dark" : "ts-title-light"}>Tracking Sessions</p>
            {/* Average rating badge */}
            <div className="ts-rating-badge">
              ★ {stats.avgRating} avg
            </div>
          </div>

          {/* Search bar */}
          <div className="ts-search">
            <span className="search-icon">🔍</span>
            <input
              className={`ts-search-input ${darkMode ? "search-dark" : "search-light"}`}
              placeholder="Search by client, agent, or feedback…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ── Filter tabs + sort ── */}
        <div className="ts-controls">
          <div className="ts-tabs">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                className={`ts-tab
                  ${darkMode ? "ts-tab-dark" : "ts-tab-light"}
                  ${filterType === tab.value ? (darkMode ? "ts-active-dark" : "ts-active-light") : ""}
                `}
                onClick={() => setFilterType(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <select
            className={`ts-sort ${darkMode ? "sort-dark" : "sort-light"}`}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        {/* ── Call log list ── */}
        <div className="ts-list">
          {filtered.length === 0 ? (
            <div className="ts-empty">
              {searchQuery ? `No results for "${searchQuery}"` : "No sessions recorded"}
            </div>
          ) : (
            filtered.map((call, i) => (
              <CallCard key={i} call={call} darkMode={darkMode} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
