import React, { useState, useRef, useMemo } from "react";
import { mockData, analyticsData } from "../../../MockData/MockData";

// ─── Currency formatter ───────────────────────────────────────────────────────
const fmt = (n) =>
  n >= 1e6 ? `₹${(n / 1e6).toFixed(2)}M`
  : n >= 1e3 ? `₹${(n / 1e3).toFixed(1)}K`
  : `₹${n}`;

// ─── Rank medal colors ────────────────────────────────────────────────────────
const RANK_STYLE = [
  { bg: "rgba(251,191,36,0.18)",  color: "#fbbf24", border: "rgba(251,191,36,0.35)",  medal: "🥇" },
  { bg: "rgba(148,163,184,0.18)", color: "#94a3b8", border: "rgba(148,163,184,0.35)", medal: "🥈" },
  { bg: "rgba(180,120,80,0.18)",  color: "#cd7c40", border: "rgba(180,120,80,0.35)",  medal: "🥉" },
];

// ─── Metric options ───────────────────────────────────────────────────────────
const METRICS = [
  { value: "revenue", label: "Revenue"    },
  { value: "deals",   label: "Deals"      },
  { value: "rating",  label: "Avg Rating" },
  { value: "calls",   label: "Calls Made" },
];

// ─── Build agent stats from real mockData ────────────────────────────────────
function buildAgentStats() {
  const map = {};

  mockData.forEach((lead) => {
    const agent = lead.assignedTo;
    if (!agent) return;
    if (!map[agent]) {
      map[agent] = { name: agent, revenue: 0, deals: 0, totalRating: 0, ratingCount: 0, calls: 0 };
    }
    map[agent].revenue += lead.receivedAmount || 0;
    if (lead.status === "converted") map[agent].deals++;

    (lead.callHistory || []).forEach((call) => {
      map[agent].calls++;
      if (call.rating) {
        map[agent].totalRating += call.rating;
        map[agent].ratingCount++;
      }
    });
  });

  return Object.values(map).map((a) => ({
    ...a,
    avgRating: a.ratingCount > 0 ? (a.totalRating / a.ratingCount).toFixed(1) : "—",
    avgRatingNum: a.ratingCount > 0 ? a.totalRating / a.ratingCount : 0,
    initials: a.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
  }));
}

// ─── Star mini-display ────────────────────────────────────────────────────────
function MiniStars({ rating, color }) {
  const num = parseFloat(rating);
  if (isNaN(num)) return <span style={{ fontSize: 10, color: "rgba(128,128,128,0.4)" }}>—</span>;
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[1,2,3,4,5].map((s) => (
        <span key={s} style={{ fontSize: 10, color: s <= Math.round(num) ? color : "rgba(128,128,128,0.2)" }}>★</span>
      ))}
    </div>
  );
}

// ─── Single Agent Row ─────────────────────────────────────────────────────────
function AgentRow({ agent, rank, metric, maxVal, darkMode }) {
  const [hovered, setHovered] = useState(false);
  const rs = RANK_STYLE[rank] || null;

  // Which value to show as the primary metric
  const primaryVal =
    metric === "revenue" ? fmt(agent.revenue)
    : metric === "deals"   ? `${agent.deals} deals`
    : metric === "rating"  ? `${agent.avgRating} ★`
    : `${agent.calls} calls`;

  // Bar width relative to top performer
  const barVal =
    metric === "revenue" ? agent.revenue
    : metric === "deals"   ? agent.deals
    : metric === "rating"  ? agent.avgRatingNum
    : agent.calls;

  const barPct = maxVal > 0 ? (barVal / maxVal) * 100 : 0;
  const accentColor = rs ? rs.color : (darkMode ? "rgba(255,255,255,0.4)" : "rgba(30,30,60,0.4)");

  return (
    <div
      className={`agent-row ${darkMode ? "agent-dark" : "agent-light"} ${hovered ? "agent-hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Rank number / medal */}
      <div className="agent-rank">
        {rs ? (
          <span style={{ fontSize: 16 }}>{rs.medal}</span>
        ) : (
          <span className={`rank-num ${darkMode ? "rank-dark" : "rank-light"}`}>{rank + 1}</span>
        )}
      </div>

      {/* Avatar */}
      <div
        className="agent-avatar"
        style={{
          background: rs ? rs.bg : "rgba(128,128,128,0.1)",
          border: `1.5px solid ${rs ? rs.border : "rgba(128,128,128,0.2)"}`,
          color: rs ? rs.color : (darkMode ? "rgba(255,255,255,0.6)" : "rgba(30,30,60,0.6)"),
        }}
      >
        {agent.initials}
      </div>

      {/* Name + bar */}
      <div className="agent-body">
        <p className={`agent-name ${darkMode ? "agent-name-dark" : "agent-name-light"}`}>
          {agent.name}
        </p>
        {/* Performance bar */}
        <div className="agent-bar-track">
          <div
            className="agent-bar-fill"
            style={{
              width: `${barPct}%`,
              background: rs ? rs.color : (darkMode ? "rgba(255,255,255,0.25)" : "rgba(30,30,60,0.2)"),
              transition: "width 1s cubic-bezier(0.34,1.1,0.64,1)",
            }}
          />
        </div>
      </div>

      {/* Primary metric */}
      <div className="agent-right">
        <span className="agent-primary-val" style={{ color: accentColor }}>
          {primaryVal}
        </span>
        {/* Always show mini stars as secondary */}
        {metric !== "rating" && (
          <MiniStars rating={agent.avgRating} color={accentColor} />
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TopPerformers({ darkMode }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const [metric, setMetric] = useState("revenue");

  // ── 3D tilt ──
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.transform = `perspective(900px) rotateX(${((y / rect.height) - 0.5) * -6}deg) rotateY(${((x / rect.width) - 0.5) * 6}deg)`;
    glow.style.left = `${x}px`;
    glow.style.top  = `${y}px`;
    glow.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  // ── Build + sort agents by selected metric ──
  const agents = useMemo(() => {
    const stats = buildAgentStats();
    return stats.sort((a, b) => {
      if (metric === "revenue") return b.revenue - a.revenue;
      if (metric === "deals")   return b.deals - a.deals;
      if (metric === "rating")  return b.avgRatingNum - a.avgRatingNum;
      if (metric === "calls")   return b.calls - a.calls;
      return 0;
    });
  }, [metric]);

  // Max value for bar scaling
  const maxVal = useMemo(() => {
    if (metric === "revenue") return Math.max(...agents.map((a) => a.revenue));
    if (metric === "deals")   return Math.max(...agents.map((a) => a.deals));
    if (metric === "rating")  return 5;
    return Math.max(...agents.map((a) => a.calls));
  }, [agents, metric]);

  // Team totals for header chips
  const teamRevenue  = agents.reduce((a, ag) => a + ag.revenue, 0);
  const teamDeals    = agents.reduce((a, ag) => a + ag.deals, 0);
  const teamAvgRating = agents.length
    ? (agents.reduce((a, ag) => a + ag.avgRatingNum, 0) / agents.length).toFixed(1)
    : "—";

  return (
    <>
      <style>{`

        /* ── GLASS CARD ── */
        .tp-card {
          position: relative; overflow: hidden; border-radius: 22px;
          padding: 22px 20px 20px; width: 100%;
          animation: tpEntrance 0.65s cubic-bezier(0.34,1.4,0.64,1) both;
          will-change: transform; transform-style: preserve-3d;
          transition: box-shadow 0.3s ease;
        }
        .tp-dark {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.11);
          backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .tp-light {
          background: rgba(255,255,255,0.68); border: 1px solid rgba(255,255,255,0.92);
          backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(100,100,150,0.1), inset 0 1px 0 rgba(255,255,255,1);
        }
        .tp-dark:hover  { box-shadow: 0 24px 60px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.2); }
        .tp-light:hover { box-shadow: 0 24px 60px rgba(100,100,150,0.18), inset 0 1px 0 rgba(255,255,255,1); }

        .tp-glow {
          position: absolute; width: 240px; height: 240px; border-radius: 50%; pointer-events: none;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%);
          transition: opacity 0.3s ease, left 0.05s, top 0.05s; z-index: 0;
        }
        .tp-shimmer {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, transparent 55%); z-index: 0;
        }

        /* ── HEADER ── */
        .tp-header {
          position: relative; z-index: 1;
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 14px; gap: 10px; flex-wrap: wrap;
        }
        .tp-title-dark  { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.92); margin: 0 0 6px; }
        .tp-title-light { font-size: 15px; font-weight: 600; color: #1a1a2e; margin: 0 0 6px; }

        /* Team summary chips */
        .tp-summary { display: flex; gap: 6px; flex-wrap: wrap; }
        .tp-chip {
          font-size: 10.5px; font-weight: 600; padding: 3px 9px; border-radius: 20px;
          white-space: nowrap;
        }
        .tpc-revenue { background: rgba(52,211,153,0.14);  color: #34d399; border: 1px solid rgba(52,211,153,0.28); }
        .tpc-deals   { background: rgba(96,165,250,0.14);  color: #60a5fa; border: 1px solid rgba(96,165,250,0.28); }
        .tpc-rating  { background: rgba(251,191,36,0.14);  color: #fbbf24; border: 1px solid rgba(251,191,36,0.28); }

        /* ── METRIC TABS ── */
        .tp-metrics {
          position: relative; z-index: 1;
          display: flex; gap: 5px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .tp-tab {
          font-size: 11px; font-weight: 500; padding: 4px 12px; border-radius: 20px;
          border: 1px solid transparent; cursor: pointer; transition: all 0.2s;
        }
        .tp-tab-dark  { color: rgba(255,255,255,0.38); border-color: rgba(255,255,255,0.08); background: transparent; }
        .tp-tab-light { color: rgba(30,30,60,0.4);    border-color: rgba(0,0,0,0.08);       background: transparent; }
        .tp-active-dark  { background: rgba(251,191,36,0.16); color: #fbbf24; border-color: rgba(251,191,36,0.3); }
        .tp-active-light { background: rgba(234,179,8,0.1);   color: #a16207; border-color: rgba(234,179,8,0.28); }

        /* ── AGENT LIST ── */
        .tp-list {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 6px;
        }

        /* ── AGENT ROW ── */
        .agent-row {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 14px;
          transition: background 0.15s ease; cursor: default;
        }
        .agent-dark  { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); }
        .agent-light { background: rgba(0,0,0,0.025);     border: 1px solid rgba(0,0,0,0.06); }
        .agent-dark:hover  { background: rgba(255,255,255,0.08); }
        .agent-light:hover { background: rgba(0,0,0,0.045); }

        /* Rank */
        .agent-rank { width: 22px; text-align: center; flex-shrink: 0; }
        .rank-num { font-size: 11px; font-weight: 700; }
        .rank-dark  { color: rgba(255,255,255,0.3); }
        .rank-light { color: rgba(30,30,60,0.35); }

        /* Avatar */
        .agent-avatar {
          width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800; letter-spacing: 0.5px;
        }

        /* Body */
        .agent-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .agent-name { font-size: 12px; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .agent-name-dark  { color: rgba(255,255,255,0.88); }
        .agent-name-light { color: #1a1a2e; }

        .agent-bar-track { height: 3px; border-radius: 99px; background: rgba(128,128,128,0.1); overflow: hidden; }
        .agent-bar-fill  { height: 100%; border-radius: 99px; }

        /* Right: metric value + stars */
        .agent-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; min-width: 72px; }
        .agent-primary-val { font-size: 12px; font-weight: 700; letter-spacing: -0.2px; white-space: nowrap; }

        /* ── ENTRANCE ── */
        @keyframes tpEntrance {
          from { opacity:0; transform: perspective(900px) translateY(28px) scale(0.96); }
          to   { opacity:1; transform: perspective(900px) translateY(0) scale(1); }
        }
      `}</style>

      <div
        ref={cardRef}
        className={`tp-card ${darkMode ? "tp-dark" : "tp-light"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={glowRef} className="tp-glow" style={{ opacity: 0 }} />
        <div className="tp-shimmer" />

        {/* ── Header ── */}
        <div className="tp-header">
          <div>
            <p className={darkMode ? "tp-title-dark" : "tp-title-light"}>Top Performers</p>
            {/* Team-level summary chips */}
            <div className="tp-summary">
              <span className="tp-chip tpc-revenue">{fmt(teamRevenue)} total rev.</span>
              <span className="tp-chip tpc-deals">{teamDeals} deals closed</span>
              <span className="tp-chip tpc-rating">★ {teamAvgRating} team avg</span>
            </div>
          </div>
        </div>

        {/* ── Metric toggle tabs ── */}
        <div className="tp-metrics">
          {METRICS.map((m) => (
            <button
              key={m.value}
              className={`tp-tab
                ${darkMode ? "tp-tab-dark" : "tp-tab-light"}
                ${metric === m.value ? (darkMode ? "tp-active-dark" : "tp-active-light") : ""}
              `}
              onClick={() => setMetric(m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* ── Agent leaderboard ── */}
        <div className="tp-list">
          {agents.map((agent, i) => (
            <AgentRow
              key={agent.name}
              agent={agent}
              rank={i}
              metric={metric}
              maxVal={maxVal}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </>
  );
}
