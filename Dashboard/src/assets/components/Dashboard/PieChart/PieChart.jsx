import { PieChart } from "@mui/x-charts/PieChart";
import { mockData } from "../../../MockData/MockData";
import { useState, useRef, useEffect } from "react";

// ─── Lead status config: color + label + icon ─────────────────────────────────
// Centralized so legend, chart, and tooltip all stay in sync.
const STATUS_CONFIG = {
  new:       { color: "#60a5fa", label: "New",       icon: "◈" },
  contacted: { color: "#f59e0b", label: "Contacted", icon: "◉" },
  qualified: { color: "#f87171", label: "Qualified", icon: "◎" },
  converted: { color: "#22d3ee", label: "Converted", icon: "⊕" },
  lost:      { color: "#34d399", label: "Lost",      icon: "◇" },
};

// ─── Date filter helpers ───────────────────────────────────────────────────────

function thisWeek(dateStr) {
  const date  = new Date(dateStr);
  const now   = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay()); // Sunday
  const end = new Date(start);
  end.setDate(start.getDate() + 6);            // Saturday
  return date >= start && date <= end;
}

function thisMonth(dateStr) {
  const date = new Date(dateStr);
  const now  = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function thisYear(dateStr) {
  return new Date(dateStr).getFullYear() === new Date().getFullYear();
}

// ─── Animated count-up for legend numbers ─────────────────────────────────────
function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [target]);
  return val;
}

// ─── Legend Item with animated count + mini bar ───────────────────────────────
/**
 * Each legend row shows:
 * - Color dot + label
 * - Count (animated on filter change)
 * - Mini progress bar showing % of total
 * - % label
 */
function LegendRow({ color, label, icon, count, total, darkMode, isHighlighted, onHover }) {
  const animVal = useCountUp(count);
  const pct     = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
  const barW    = total > 0 ? (count / total) * 100 : 0;

  return (
    <div
      className={`legend-row ${isHighlighted ? "legend-highlighted" : ""}`}
      onMouseEnter={() => onHover(label)}
      onMouseLeave={() => onHover(null)}
      style={{ opacity: isHighlighted === false ? 0.4 : 1, transition: "opacity 0.2s" }}
    >
      {/* Left: icon pill + label */}
      <div className="legend-left">
        <div className="legend-icon-pill" style={{ background: color + "22", border: `1px solid ${color}44` }}>
          <span style={{ color, fontSize: 11 }}>{icon}</span>
        </div>
        <span className={`legend-label-text ${darkMode ? "leg-dark" : "leg-light"}`}>{label}</span>
      </div>

      {/* Center: mini bar */}
      <div className="legend-bar-wrap">
        <div className="legend-bar-track">
          <div
            className="legend-bar-fill"
            style={{ width: `${barW}%`, background: color, transition: "width 0.9s cubic-bezier(0.34,1.1,0.64,1)" }}
          />
        </div>
      </div>

      {/* Right: count + % */}
      <div className="legend-right">
        <span className={`legend-count ${darkMode ? "leg-dark" : "leg-light"}`}>{animVal}</span>
        <span className="legend-pct" style={{ color: color }}>{pct}%</span>
      </div>
    </div>
  );
}

// ─── Center donut label ───────────────────────────────────────────────────────
/**
 * Drawn as an SVG overlay centered on the donut hole.
 * Shows total count or hovered slice info.
 */
function DonutCenter({ total, hovered, data, darkMode }) {
  const hoveredItem = data.find((d) => d.label === hovered);
  const pct = hoveredItem ? ((hoveredItem.value / total) * 100).toFixed(0) : null;

  // Zero state — empty ring
  if (total === 0) return (
    <div className="donut-center">
      <div className={`dc-total ${darkMode ? "dc-dark" : "dc-light"}`}>0</div>
      <div className={`dc-sublabel ${darkMode ? "dc-sub-dark" : "dc-sub-light"}`}>0%</div>
    </div>
  );

  return (
    <div className="donut-center">
      {hovered && hoveredItem ? (
        <>
          <div className="dc-value" style={{ color: STATUS_CONFIG[hoveredItem.label.toLowerCase()]?.color || "#fff" }}>
            {hoveredItem.value}
          </div>
          <div className={`dc-label ${darkMode ? "dc-dark" : "dc-light"}`}>{hovered}</div>
          <div className="dc-pct" style={{ color: STATUS_CONFIG[hoveredItem.label.toLowerCase()]?.color || "#aaa" }}>
            {pct}%
          </div>
        </>
      ) : (
        <>
          <div className={`dc-total ${darkMode ? "dc-dark" : "dc-light"}`}>{total}</div>
          <div className={`dc-sublabel ${darkMode ? "dc-sub-dark" : "dc-sub-light"}`}>Total</div>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LeadsPieChart({ darkMode }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const [filter,    setFilter]    = useState("all");
  const [hovered,   setHovered]   = useState(null); // hovered legend/slice label
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // ── Apply date filter ──
  const filteredData = mockData.filter((lead) => {
    if (filter === "thisWeek")  return thisWeek(lead.purchaseDate);
    if (filter === "thisMonth") return thisMonth(lead.purchaseDate);
    if (filter === "thisYear")  return thisYear(lead.purchaseDate);
    return true;
  });

  // ── Count by status ──
  const counts = { new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0 };
  filteredData.forEach((lead) => {
    if (counts[lead.status] !== undefined) counts[lead.status]++;
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  // ── Build chart data array aligned with STATUS_CONFIG ──
  const data = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    label: cfg.label,
    value: counts[key],
    color: cfg.color,
  }));

  // ── Highlight scope: fade all except hovered ──
  const highlightedIndex = hovered
    ? data.findIndex((d) => d.label === hovered)
    : null;

  // ── 3D tilt ──
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.transform = `perspective(1000px) rotateX(${((y / rect.height) - 0.5) * -6}deg) rotateY(${((x / rect.width) - 0.5) * 6}deg)`;
    glow.style.left = `${x}px`;
    glow.style.top  = `${y}px`;
    glow.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
    setHovered(null);
  };

  // ── Filter tabs config ──
  const filterOptions = [
    { value: "all",       label: "All"        },
    { value: "thisWeek",  label: "This Week"  },
    { value: "thisMonth", label: "This Month" },
    { value: "thisYear",  label: "This Year"  },
  ];

  return (
    <>
      <style>{`

        /* ── GLASS CARD ── */
        .pc-card {
          position: relative; overflow: hidden; border-radius: 22px;
          padding: 22px 20px 20px; width: 100%;
          animation: pcEntrance 0.65s cubic-bezier(0.34,1.4,0.64,1) both;
          will-change: transform; transform-style: preserve-3d;
          transition: box-shadow 0.3s ease;
        }
        .pc-dark {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.11);
          backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.9);
        }
        .pc-light {
          background: rgba(255,255,255,0.68); border: 1px solid rgba(255,255,255,0.92);
          backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(100,100,150,0.1), inset 0 1px 0 rgba(255,255,255,1);
          color: #1a1a2e;
        }
        .pc-dark:hover  { box-shadow: 0 24px 60px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.2); }
        .pc-light:hover { box-shadow: 0 24px 60px rgba(100,100,150,0.18), inset 0 1px 0 rgba(255,255,255,1); }

        .pc-glow {
          position: absolute; width: 260px; height: 260px; border-radius: 50%;
          pointer-events: none; transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%);
          transition: opacity 0.3s ease, left 0.05s, top 0.05s; z-index: 0;
        }
        .pc-shimmer {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, transparent 55%); z-index: 0;
        }

        /* ── HEADER ── */
        .pc-header {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
        }
        .pc-title { font-size: 15px; font-weight: 600; margin: 0; }

        /* ── FILTER TABS ── */
        .pc-filters {
          display: flex; gap: 4px; flex-wrap: wrap;
        }
        .pc-tab {
          font-size: 10.5px; font-weight: 500; padding: 3px 10px; border-radius: 20px;
          border: 1px solid transparent; cursor: pointer; transition: all 0.2s ease;
          white-space: nowrap;
        }
        .pc-tab-dark  { color: rgba(255,255,255,0.38); background: transparent; border-color: rgba(255,255,255,0.08); }
        .pc-tab-light { color: rgba(30,30,60,0.4);    background: transparent; border-color: rgba(0,0,0,0.08); }
        .pc-active-dark  { background: rgba(96,165,250,0.18); color: #60a5fa; border-color: rgba(96,165,250,0.3); }
        .pc-active-light { background: rgba(59,130,246,0.1);  color: #3b82f6; border-color: rgba(59,130,246,0.25); }

        /* ── DONUT WRAP ── */
        .pc-donut-wrap {
          position: relative; z-index: 1;
          display: flex; justify-content: center; align-items: center;
          margin: 4px 0 16px;
          /* Must be relative so the absolute center label anchors to THIS div */
        }

        /*
          Center label overlay.
          The MUI PieChart SVG is 210px tall and centered.
          We use a fixed pixel position to land exactly in the donut hole.
          innerRadius = 55px, chart height = 210px → vertical center = 105px
          The SVG itself is centered horizontally inside the flex container.
        */
        .donut-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          pointer-events: none;
          text-align: center;
          width: 100px; /* wide enough to not clip numbers */
          z-index: 10;
        }
        .dc-value    { font-size: 24px; font-weight: 700; letter-spacing: -0.5px; line-height: 1; }
        .dc-label    { font-size: 10px; font-weight: 500; margin-top: 3px; }
        .dc-pct      { font-size: 12px; font-weight: 600; margin-top: 1px; }
        .dc-total    { font-size: 28px; font-weight: 700; letter-spacing: -1px; line-height: 1; }
        .dc-sublabel { font-size: 11px; font-weight: 500; margin-top: 3px; }

        /* ── Boosted contrast for dark mode text ── */
        .dc-dark       { color: #ffffff; }
        .dc-light      { color: #1a1a2e; }
        .dc-sub-dark   { color: rgba(255,255,255,0.55); }
        .dc-sub-light  { color: rgba(30,30,60,0.5); }

        /* ── LEGEND ── */
        .pc-legend {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 6px;
          padding-top: 12px;
          border-top: 1px solid rgba(128,128,128,0.1);
        }

        .legend-row {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 6px; border-radius: 10px; cursor: default;
          transition: background 0.15s ease, opacity 0.2s ease;
        }
        .legend-row:hover { background: rgba(128,128,128,0.07); }

        .legend-left  { display: flex; align-items: center; gap: 7px; width: 90px; flex-shrink: 0; }
        .legend-icon-pill {
          width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .legend-label-text { font-size: 12px; font-weight: 600; letter-spacing: 0.1px; }
        .leg-dark  { color: #e2e8f0; }   /* near-white, crisp in dark mode */
        .leg-light { color: #1e1b4b; }

        /* Mini bar */
        .legend-bar-wrap  { flex: 1; }
        .legend-bar-track { height: 3px; border-radius: 99px; background: rgba(128,128,128,0.12); overflow: hidden; }
        .legend-bar-fill  { height: 100%; border-radius: 99px; }

        /* Right: count + % */
        .legend-right { display: flex; align-items: center; gap: 6px; width: 68px; justify-content: flex-end; flex-shrink: 0; }
        .legend-count { font-size: 12px; font-weight: 700; }
        .legend-count.leg-dark  { color: #f1f5f9; }   /* bright white count */
        .legend-count.leg-light { color: #1e1b4b; }
        .legend-pct   { font-size: 10px; font-weight: 700; min-width: 36px; text-align: right; }

        /* Empty state */
        .pc-empty {
          text-align: center; padding: 32px 0; font-size: 12px;
          color: rgba(128,128,128,0.4); position: relative; z-index: 1;
        }

        /* ── ENTRANCE ── */
        @keyframes pcEntrance {
          from { opacity:0; transform: perspective(1000px) translateY(28px) scale(0.96); }
          to   { opacity:1; transform: perspective(1000px) translateY(0) scale(1); }
        }
      `}</style>

      <div
        ref={cardRef}
        className={`pc-card ${darkMode ? "pc-dark" : "pc-light"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Decorative overlays */}
        <div ref={glowRef} className="pc-glow" style={{ opacity: 0 }} />
        <div className="pc-shimmer" />

        {/* ── Header: title + filter tabs ── */}
        <div className="pc-header">
          <p className="pc-title">Lead Distribution</p>

          {/* Filter tabs replace the old plain <select> for premium feel */}
          <div className="pc-filters">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                className={`pc-tab
                  ${darkMode ? "pc-tab-dark" : "pc-tab-light"}
                  ${filter === opt.value ? (darkMode ? "pc-active-dark" : "pc-active-light") : ""}
                `}
                onClick={() => setFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Donut Chart ── */}
        {total === 0 ? (
          /* Empty state: grey ring + "0 / Total" in center */
          <div className="pc-donut-wrap">
            <svg width="210" height="210" viewBox="0 0 210 210">
              {/* Background empty ring */}
              <circle
                cx="105" cy="105" r="75"
                fill="none"
                stroke={darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}
                strokeWidth="38"
                strokeDasharray="none"
              />
            </svg>
            {/* Center label — same component, total=0 */}
            <DonutCenter total={0} hovered={null} data={[]} darkMode={darkMode} />
          </div>
        ) : (
          <>
            <div className="pc-donut-wrap">
              {/* MUI PieChart as a donut.
                  width + margin props force the SVG to occupy exactly 210×210
                  with no space reserved for the built-in legend panel.
                  slotProps.legend.hidden is the v6+ way to fully suppress it. */}
              <PieChart
                series={[
                  {
                    innerRadius: 55,
                    outerRadius: 95,
                    paddingAngle: 2,
                    cornerRadius: 4,
                    cx: 95,   // explicit horizontal center within the 210px SVG
                    cy: 100,  // explicit vertical center
                    data: data.map((d) => ({
                      ...d,
                      ...(hovered === d.label
                        ? { outerRadius: 102 }
                        : hovered && hovered !== d.label
                          ? { outerRadius: 92, color: d.color + "55" }
                          : {}),
                    })),
                    highlightScope: { fade: "global", highlight: "item" },
                  },
                ]}
                width={210}
                height={210}
                margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                /* v6 API — fully kills the legend panel so it takes 0px */
                slotProps={{ legend: { hidden: true } }}
                onItemClick={(_, itemData) => {
                  const clickedLabel = data[itemData.dataIndex]?.label;
                  setHovered((prev) => (prev === clickedLabel ? null : clickedLabel));
                }}
                sx={{
                  "& .MuiChartsArc-root": {
                    stroke: darkMode ? "rgba(20,20,35,0.6)" : "rgba(255,255,255,0.7)",
                    strokeWidth: 2,
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                  },
                  "& .MuiChartsArc-root:hover": { filter: "brightness(1.15)" },
                  /* Hard-kill any residual legend DOM via CSS */
                  "& .MuiChartsLegend-root":  { display: "none !important" },
                  "& .MuiChartsLegend-label": { display: "none !important" },
                  "& .MuiChartsLegend-mark":  { display: "none !important" },
                }}
              />

              {/* Center donut label — shows total or hovered slice info */}
              <DonutCenter total={total} hovered={hovered} data={data} darkMode={darkMode} />
            </div>

            {/* ── Legend with mini bars + animated counts ── */}
            <div className="pc-legend">
              {data.map((item) => {
                const cfg = STATUS_CONFIG[item.label.toLowerCase()];
                return (
                  <LegendRow
                    key={item.label}
                    color={item.color}
                    label={item.label}
                    icon={cfg?.icon || "●"}
                    count={item.value}
                    total={total}
                    darkMode={darkMode}
                    // Cross-highlight: dim others when one is hovered
                    isHighlighted={hovered ? hovered === item.label : null}
                    onHover={setHovered}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
