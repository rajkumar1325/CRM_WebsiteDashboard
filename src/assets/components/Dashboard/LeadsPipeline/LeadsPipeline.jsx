import React, { useState, useRef, useMemo } from "react";
import { mockData } from "../../../MockData/MockData";

// ─── Pipeline stages — ordered funnel ────────────────────────────────────────
const STAGES = [
  { key: "new",       label: "New",       color: "#60a5fa", bg: "rgba(96,165,250,0.13)",  border: "rgba(96,165,250,0.28)",  icon: "◈" },
  { key: "contacted", label: "Contacted", color: "#f59e0b", bg: "rgba(245,158,11,0.13)",  border: "rgba(245,158,11,0.28)",  icon: "◉" },
  { key: "qualified", label: "Qualified", color: "#c084fc", bg: "rgba(192,132,252,0.13)", border: "rgba(192,132,252,0.28)", icon: "◎" },
  { key: "converted", label: "Converted", color: "#34d399", bg: "rgba(52,211,153,0.13)",  border: "rgba(52,211,153,0.28)",  icon: "⊕" },
  { key: "lost",      label: "Lost",      color: "#f87171", bg: "rgba(248,113,113,0.13)", border: "rgba(248,113,113,0.28)", icon: "◇" },
];

// ─── Currency formatter ───────────────────────────────────────────────────────
const fmt = (n) =>
  n >= 1e6 ? `₹${(n / 1e6).toFixed(1)}M`
  : n >= 1e3 ? `₹${(n / 1e3).toFixed(0)}K`
  : `₹${n}`;

// ─── Single Lead Pill inside a stage column ───────────────────────────────────
function LeadPill({ lead, color, darkMode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`lead-pill ${darkMode ? "pill-dark" : "pill-light"} ${hovered ? "pill-hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar initial */}
      <div className="pill-avatar" style={{ background: color + "22", color, border: `1px solid ${color}44` }}>
        {lead.name.charAt(0)}
      </div>

      <div className="pill-body">
        <p className={`pill-name ${darkMode ? "pill-name-dark" : "pill-name-light"}`}>
          {lead.name}
        </p>
        <p className={`pill-company ${darkMode ? "pill-sub-dark" : "pill-sub-light"}`}>
          {lead.company}
        </p>
      </div>

      {/* Show amount if converted */}
      {lead.receivedAmount > 0 && (
        <span className="pill-amount" style={{ color }}>
          {fmt(lead.receivedAmount)}
        </span>
      )}
    </div>
  );
}

// ─── Stage Column ─────────────────────────────────────────────────────────────
function StageColumn({ stage, leads, totalLeads, darkMode }) {
  const pct       = totalLeads > 0 ? ((leads.length / totalLeads) * 100).toFixed(0) : 0;
  const stageRevenue = leads.reduce((a, l) => a + (l.receivedAmount || 0), 0);

  return (
    <div className={`stage-col ${darkMode ? "stage-col-dark" : "stage-col-light"}`}>

      {/* Column header */}
      <div className="stage-header">
        <div className="stage-header-top">
          <div className="stage-icon-pill" style={{ background: stage.bg, border: `1px solid ${stage.border}` }}>
            <span style={{ color: stage.color, fontSize: 12 }}>{stage.icon}</span>
          </div>
          <span className={`stage-label ${darkMode ? "stg-label-dark" : "stg-label-light"}`}>
            {stage.label}
          </span>
          {/* Count badge */}
          <span className="stage-count" style={{ background: stage.bg, color: stage.color, border: `1px solid ${stage.border}` }}>
            {leads.length}
          </span>
        </div>

        {/* Mini funnel bar showing % of total */}
        <div className="stage-bar-track">
          <div
            className="stage-bar-fill"
            style={{
              width: `${pct}%`,
              background: stage.color,
              transition: "width 1s cubic-bezier(0.34,1.1,0.64,1)",
            }}
          />
        </div>

        {/* Revenue in this stage */}
        {stageRevenue > 0 && (
          <p className="stage-revenue" style={{ color: stage.color }}>
            {fmt(stageRevenue)}
          </p>
        )}
      </div>

      {/* Lead pills */}
      <div className="stage-pills">
        {leads.length === 0 ? (
          <div className={`stage-empty ${darkMode ? "empty-dark" : "empty-light"}`}>
            No leads
          </div>
        ) : (
          leads.map((lead) => (
            <LeadPill key={lead.id} lead={lead} color={stage.color} darkMode={darkMode} />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LeadsPipeline({ darkMode }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const [search, setSearch] = useState("");

  // ── 3D tilt ──
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.transform = `perspective(1200px) rotateX(${((y / rect.height) - 0.5) * -4}deg) rotateY(${((x / rect.width) - 0.5) * 4}deg)`;
    glow.style.left = `${x}px`;
    glow.style.top  = `${y}px`;
    glow.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(1200px) rotateX(0) rotateY(0)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  // ── Filter by search ──
  const filtered = useMemo(() => {
    if (!search.trim()) return mockData;
    const q = search.toLowerCase();
    return mockData.filter(
      (l) => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q)
    );
  }, [search]);

  // ── Group leads by stage ──
  const grouped = useMemo(() =>
    Object.fromEntries(STAGES.map((s) => [s.key, filtered.filter((l) => l.status === s.key)])),
  [filtered]);

  // ── Summary stats ──
  const totalRevenue = mockData.reduce((a, l) => a + (l.receivedAmount || 0), 0);
  const conversionRate = ((mockData.filter((l) => l.status === "converted").length / mockData.length) * 100).toFixed(0);

  return (
    <>
      <style>{`

        /* ── GLASS CARD ── */
        .lp-card {
          position: relative; overflow: hidden; border-radius: 22px;
          padding: 22px 20px 20px; width: 100%;
          animation: lpEntrance 0.65s cubic-bezier(0.34,1.4,0.64,1) both;
          will-change: transform; transform-style: preserve-3d;
          transition: box-shadow 0.3s ease;
        }
        .lp-dark {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.11);
          backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .lp-light {
          background: rgba(255,255,255,0.68); border: 1px solid rgba(255,255,255,0.92);
          backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(100,100,150,0.1), inset 0 1px 0 rgba(255,255,255,1);
        }
        .lp-dark:hover  { box-shadow: 0 24px 60px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.2); }
        .lp-light:hover { box-shadow: 0 24px 60px rgba(100,100,150,0.18), inset 0 1px 0 rgba(255,255,255,1); }

        .lp-glow {
          position: absolute; width: 300px; height: 300px; border-radius: 50%; pointer-events: none;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 70%);
          transition: opacity 0.3s ease, left 0.05s, top 0.05s; z-index: 0;
        }
        .lp-shimmer {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 55%); z-index: 0;
        }

        /* ── HEADER ── */
        .lp-header {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px; flex-wrap: wrap; gap: 10px;
        }
        .lp-title-dark  { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.92); margin: 0; }
        .lp-title-light { font-size: 15px; font-weight: 600; color: #1a1a2e; margin: 0; }

        /* Header right: summary chips */
        .lp-header-right { display: flex; align-items: center; gap: 8px; }
        .lp-stat-chip {
          font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px;
          white-space: nowrap;
        }
        .chip-revenue { background: rgba(52,211,153,0.14); color: #34d399; border: 1px solid rgba(52,211,153,0.28); }
        .chip-rate    { background: rgba(192,132,252,0.14); color: #c084fc; border: 1px solid rgba(192,132,252,0.28); }

        /* Search */
        .lp-search {
          position: relative; z-index: 1; margin-bottom: 14px;
        }
        .lp-search-input {
          width: 100%; max-width: 260px; box-sizing: border-box;
          padding: 7px 12px 7px 32px; border-radius: 12px;
          font-size: 12px; outline: none; transition: border-color 0.2s;
        }
        .lp-search-dark  { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.85); }
        .lp-search-light { background: rgba(0,0,0,0.04);      border: 1px solid rgba(0,0,0,0.1);       color: #1a1a2e; }
        .lp-search-dark:focus  { border-color: rgba(192,132,252,0.5); }
        .lp-search-light:focus { border-color: rgba(107,72,255,0.45); }
        .lp-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 12px; opacity: 0.4; pointer-events: none; }

        /* ── PIPELINE GRID ── */
        .lp-grid {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        @media (max-width: 900px) {
          .lp-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 600px) {
          .lp-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── STAGE COLUMN ── */
        .stage-col {
          border-radius: 16px; padding: 12px 10px;
          display: flex; flex-direction: column; gap: 8px;
          min-width: 0;
        }
        .stage-col-dark  { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); }
        .stage-col-light { background: rgba(0,0,0,0.025);     border: 1px solid rgba(0,0,0,0.06); }

        /* Stage header */
        .stage-header { display: flex; flex-direction: column; gap: 6px; margin-bottom: 4px; }
        .stage-header-top { display: flex; align-items: center; gap: 6px; }

        .stage-icon-pill {
          width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .stage-label { font-size: 11.5px; font-weight: 600; flex: 1; }
        .stg-label-dark  { color: rgba(255,255,255,0.8); }
        .stg-label-light { color: #1a1a2e; }

        .stage-count {
          font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 20px; flex-shrink: 0;
        }

        .stage-bar-track { height: 3px; border-radius: 99px; background: rgba(128,128,128,0.1); overflow: hidden; }
        .stage-bar-fill  { height: 100%; border-radius: 99px; }

        .stage-revenue { font-size: 10px; font-weight: 700; margin: 0; }

        /* Stage pills list */
        .stage-pills { display: flex; flex-direction: column; gap: 6px; max-height: 260px; overflow-y: auto; scrollbar-width: none; }
        .stage-pills::-webkit-scrollbar { display: none; }

        .stage-empty { text-align: center; font-size: 10.5px; padding: 16px 0; }
        .empty-dark  { color: rgba(255,255,255,0.2); }
        .empty-light { color: rgba(30,30,60,0.25); }

        /* ── LEAD PILL ── */
        .lead-pill {
          display: flex; align-items: center; gap: 7px;
          padding: 7px 8px; border-radius: 10px;
          transition: background 0.15s ease, transform 0.1s ease;
          cursor: default;
        }
        .pill-dark  { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); }
        .pill-light { background: rgba(255,255,255,0.7);  border: 1px solid rgba(0,0,0,0.06); }
        .lead-pill:hover { transform: translateY(-1px); }
        .pill-dark:hover  { background: rgba(255,255,255,0.08); }
        .pill-light:hover { background: rgba(255,255,255,0.9); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

        .pill-avatar {
          width: 24px; height: 24px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
        }
        .pill-body { flex: 1; min-width: 0; }
        .pill-name { font-size: 11px; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pill-name-dark  { color: rgba(255,255,255,0.88); }
        .pill-name-light { color: #1a1a2e; }
        .pill-company { font-size: 9.5px; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pill-sub-dark  { color: rgba(255,255,255,0.35); }
        .pill-sub-light { color: rgba(30,30,60,0.45); }

        .pill-amount { font-size: 9.5px; font-weight: 700; flex-shrink: 0; white-space: nowrap; }

        /* ── ENTRANCE ── */
        @keyframes lpEntrance {
          from { opacity:0; transform: perspective(1200px) translateY(28px) scale(0.96); }
          to   { opacity:1; transform: perspective(1200px) translateY(0) scale(1); }
        }
      `}</style>

      <div
        ref={cardRef}
        className={`lp-card ${darkMode ? "lp-dark" : "lp-light"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={glowRef} className="lp-glow" style={{ opacity: 0 }} />
        <div className="lp-shimmer" />

        {/* ── Header ── */}
        <div className="lp-header">
          <p className={darkMode ? "lp-title-dark" : "lp-title-light"}>Lead Pipeline</p>
          <div className="lp-header-right">
            <span className="lp-stat-chip chip-revenue">₹ {fmt(totalRevenue)} total</span>
            <span className="lp-stat-chip chip-rate">{conversionRate}% converted</span>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="lp-search">
          <span className="lp-search-icon">🔍</span>
          <input
            className={`lp-search-input ${darkMode ? "lp-search-dark" : "lp-search-light"}`}
            placeholder="Search by name or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ── Pipeline columns ── */}
        <div className="lp-grid">
          {STAGES.map((stage) => (
            <StageColumn
              key={stage.key}
              stage={stage}
              leads={grouped[stage.key] || []}
              totalLeads={filtered.length}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </>
  );
}
