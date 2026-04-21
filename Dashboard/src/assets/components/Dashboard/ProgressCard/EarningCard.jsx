import React, { useState, useRef, useEffect } from "react";
import { mockData } from "../../../MockData/MockData";
import {
  GaugeContainer,
  GaugeReferenceArc,
  GaugeValueArc,
  useGaugeState,
} from "@mui/x-charts/Gauge";

// ─── Constants ────────────────────────────────────────────────────────────────

// Earning target — in production this would come from props or an API
const MONTHLY_TARGET = 2000000;

// ─── Animated count-up hook ───────────────────────────────────────────────────
function useCountUp(target, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const num = parseFloat(target);
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setVal(eased * num);
      if (p < 1) requestAnimationFrame(step);
      else setVal(num);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

// ─── Custom Gauge Needle ──────────────────────────────────────────────────────
/**
 * Replaces the default MUI gauge needle with a premium tapered needle + hub.
 * Uses useGaugeState() to read the current angle.
 */
function GaugeNeedle({ darkMode }) {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();
  if (valueAngle === null) return null;

  // Needle tip position
  const tipX = cx + (outerRadius - 12) * Math.sin(valueAngle);
  const tipY = cy - (outerRadius - 12) * Math.cos(valueAngle);

  // Needle base — two side points for a tapered shape
  const baseAngleL = valueAngle - Math.PI / 2;
  const baseAngleR = valueAngle + Math.PI / 2;
  const baseWidth  = 5;
  const baseL = {
    x: cx + baseWidth * Math.sin(baseAngleL),
    y: cy - baseWidth * Math.cos(baseAngleL),
  };
  const baseR = {
    x: cx + baseWidth * Math.sin(baseAngleR),
    y: cy - baseWidth * Math.cos(baseAngleR),
  };

  return (
    <g>
      {/* Tapered needle body */}
      <path
        d={`M ${baseL.x} ${baseL.y} L ${tipX} ${tipY} L ${baseR.x} ${baseR.y} Z`}
        fill="url(#needleGrad)"
        opacity={0.95}
      />
      {/* Center hub circle */}
      <circle cx={cx} cy={cy} r={9}  fill={darkMode ? "#1a1a2e" : "#ffffff"} />
      <circle cx={cx} cy={cy} r={6}  fill="#c084fc" />
      <circle cx={cx} cy={cy} r={3}  fill={darkMode ? "rgba(255,255,255,0.9)" : "#fff"} />

      {/* Gradient def for needle */}
      <defs>
        <linearGradient id="needleGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#c084fc" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </g>
  );
}

// ─── Custom Gauge Center Label ────────────────────────────────────────────────
/**
 * Shows the % value inside the gauge arc.
 * Positioned at the optical center of the half-gauge.
 */
function GaugeCenterLabel({ value, darkMode }) {
  const { cx, cy } = useGaugeState();
  return (
    <text
      x={cx}
      y={cy + 10} // slightly below center for half-gauge visual balance
      textAnchor="middle"
      fontSize={22}
      fontWeight={700}
      letterSpacing={-0.5}
      fill={darkMode ? "#ffffff" : "#1a1a2e"}
    >
      {Math.round(value)}%
    </text>
  );
}

// ─── Mini Stat Chip ───────────────────────────────────────────────────────────
/** Small stat pill shown below the gauge: e.g. "Target", "MoM", "YTD" */
function StatChip({ label, value, color, darkMode }) {
  return (
    <div className={`stat-chip ${darkMode ? "chip-bg-dark" : "chip-bg-light"}`}>
      <span className={`chip-label ${darkMode ? "chip-label-dark" : "chip-label-light"}`}>{label}</span>
      <span className="chip-value" style={{ color }}>{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EarningsCard({ darkMode }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  // ── Calculate totals from mockData ──
  let totalEarning    = 0;
  let lastMonthEarn   = 0;
  let thisMonthEarn   = 0;

  const now   = new Date();
  const prevM = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  mockData.forEach((deal) => {
    const amt  = deal.receivedAmount || 0;
    const date = new Date(deal.createdAt || deal.purchaseDate || 0);
    totalEarning += amt;

    // This month
    if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear())
      thisMonthEarn += amt;

    // Last month
    if (date.getMonth() === prevM.getMonth() && date.getFullYear() === prevM.getFullYear())
      lastMonthEarn += amt;
  });

  // ── Derived stats ──
  const progressPct = Math.min((totalEarning / MONTHLY_TARGET) * 100, 100); // gauge fill %

  // Month-over-month change
  const momChange = lastMonthEarn > 0
    ? (((thisMonthEarn - lastMonthEarn) / lastMonthEarn) * 100).toFixed(1)
    : null;
  const momPositive = momChange === null || parseFloat(momChange) >= 0;

  // YTD (year-to-date) earnings
  let ytdEarn = 0;
  mockData.forEach((deal) => {
    const date = new Date(deal.createdAt || deal.purchaseDate || 0);
    if (date.getFullYear() === now.getFullYear()) ytdEarn += deal.receivedAmount || 0;
  });

  // ── Animated earning display ──
  const animatedEarning = useCountUp(totalEarning, 1600);

  // ── 3D tilt ──
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.transform = `perspective(900px) rotateX(${((y / rect.height) - 0.5) * -7}deg) rotateY(${((x / rect.width) - 0.5) * 7}deg)`;
    glow.style.left = `${x}px`;
    glow.style.top  = `${y}px`;
    glow.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  // ── Format currency (compact) ──
  const formatCurrency = (n) =>
    n >= 1e6 ? `₹${(n / 1e6).toFixed(2)}M`
    : n >= 1e3 ? `₹${(n / 1e3).toFixed(1)}K`
    : `₹${n.toFixed(0)}`;

  return (
    <>
      <style>{`

        /* ── GLASS CARD ── */
        .ec-card {
          position: relative; overflow: hidden; border-radius: 22px;
          padding: 22px 20px 20px; width: 100%;
          animation: ecEntrance 0.65s cubic-bezier(0.34,1.4,0.64,1) both;
          will-change: transform; transform-style: preserve-3d;
          transition: box-shadow 0.3s ease;
        }
        .ec-dark {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.11);
          backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .ec-light {
          background: rgba(255,255,255,0.68); border: 1px solid rgba(255,255,255,0.92);
          backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(100,100,150,0.1), inset 0 1px 0 rgba(255,255,255,1);
        }
        .ec-dark:hover  { box-shadow: 0 24px 60px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.2); }
        .ec-light:hover { box-shadow: 0 24px 60px rgba(100,100,150,0.18), inset 0 1px 0 rgba(255,255,255,1); }

        /* Cursor glow + shimmer */
        .ec-glow {
          position: absolute; width: 240px; height: 240px; border-radius: 50%; pointer-events: none;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(192,132,252,0.15) 0%, transparent 70%);
          transition: opacity 0.3s ease, left 0.05s, top 0.05s; z-index: 0;
        }
        .ec-shimmer {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, transparent 55%); z-index: 0;
        }

        /* ── HEADER ── */
        .ec-header {
          position: relative; z-index: 1;
          display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px;
        }
        .ec-title-dark  { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.5); margin: 0 0 4px; letter-spacing: 0.3px; text-transform: uppercase; }
        .ec-title-light { font-size: 13px; font-weight: 500; color: rgba(30,30,60,0.45);   margin: 0 0 4px; letter-spacing: 0.3px; text-transform: uppercase; }

        /* Animated earning value — big hero number */
        .ec-amount {
          font-size: 26px; font-weight: 700; letter-spacing: -1px; line-height: 1;
          background: linear-gradient(135deg, #c084fc 0%, #818cf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ec-amount-light {
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* MoM badge */
        .ec-mom-badge {
          display: flex; align-items: center; gap: 3px;
          font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px;
          white-space: nowrap;
        }
        .mom-pos { background: rgba(52,211,153,0.15); color: #34d399; border: 1px solid rgba(52,211,153,0.25); }
        .mom-neg { background: rgba(248,113,113,0.15); color: #f87171; border: 1px solid rgba(248,113,113,0.25); }
        .mom-neu { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.1); }

        /* Subtitle */
        .ec-subtitle { position: relative; z-index: 1; font-size: 12px; margin: 4px 0 0; }
        .ec-subtitle-dark  { color: rgba(255,255,255,0.4); }
        .ec-subtitle-light { color: rgba(30,30,60,0.45); }

        /* ── GAUGE WRAP ── */
        .ec-gauge-wrap {
          position: relative; z-index: 1;
          display: flex; justify-content: center; align-items: center;
          margin: 8px 0 4px;
        }

        /* Target progress bar under gauge */
        .ec-target-row {
          position: relative; z-index: 1;
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 12px; padding: 0 4px;
        }
        .ec-target-label { font-size: 10.5px; font-weight: 500; }
        .ec-target-dark  { color: rgba(255,255,255,0.4); }
        .ec-target-light { color: rgba(30,30,60,0.45); }

        /* ── STAT CHIPS ROW ── */
        .ec-chips {
          position: relative; z-index: 1;
          display: flex; gap: 8px;
          padding-top: 12px;
          border-top: 1px solid rgba(128,128,128,0.1);
        }

        .stat-chip {
          flex: 1; border-radius: 12px; padding: 8px 10px;
          display: flex; flex-direction: column; gap: 3px;
        }
        .chip-bg-dark  { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); }
        .chip-bg-light { background: rgba(0,0,0,0.035);     border: 1px solid rgba(0,0,0,0.07); }

        .chip-label { font-size: 10px; font-weight: 500; letter-spacing: 0.2px; }
        .chip-label-dark  { color: rgba(255,255,255,0.38); }
        .chip-label-light { color: rgba(30,30,60,0.45); }

        .chip-value { font-size: 13px; font-weight: 700; letter-spacing: -0.3px; }

        /* ── ENTRANCE ── */
        @keyframes ecEntrance {
          from { opacity:0; transform: perspective(900px) translateY(28px) scale(0.96); }
          to   { opacity:1; transform: perspective(900px) translateY(0) scale(1); }
        }
      `}</style>

      <div
        ref={cardRef}
        className={`ec-card ${darkMode ? "ec-dark" : "ec-light"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Decorative overlays */}
        <div ref={glowRef} className="ec-glow" style={{ opacity: 0 }} />
        <div className="ec-shimmer" />

        {/* ── Header: title + MoM badge ── */}
        <div className="ec-header">
          <div>
            {/* "EARNINGS" label in muted uppercase — premium card convention */}
            <p className={darkMode ? "ec-title-dark" : "ec-title-light"}>Earnings</p>

            {/* Hero number — animated count-up with gradient text */}
            <div className={`ec-amount ${!darkMode ? "ec-amount-light" : ""}`}>
              ₹ {animatedEarning.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
          </div>

          {/* Month-over-month change badge */}
          {momChange !== null ? (
            <div className={`ec-mom-badge ${momPositive ? "mom-pos" : "mom-neg"}`}>
              {momPositive ? "↑" : "↓"} {Math.abs(momChange)}% MoM
            </div>
          ) : (
            <div className="ec-mom-badge mom-neu">No prev. data</div>
          )}
        </div>

        {/* Subtitle: profit vs target */}
        <p className={`ec-subtitle ${darkMode ? "ec-subtitle-dark" : "ec-subtitle-light"}`}>
          {progressPct.toFixed(0)}% of ₹{(MONTHLY_TARGET / 1e6).toFixed(1)}M target reached
        </p>

        {/* ── Gauge Chart ── */}
        <div className="ec-gauge-wrap">
          <div style={{ width: "100%", maxWidth: 260 }}>
            <GaugeContainer
              startAngle={-110}
              endAngle={110}
              value={progressPct}
              height={180}
              sx={{
                /* Reference arc (track) */
                "& .MuiGauge-referenceArc": {
                  fill: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
                },
                /* Value arc — gradient via filter trick */
                "& .MuiGauge-valueArc": {
                  fill: "url(#gaugeGrad)",
                },
              }}
            >
              {/* SVG gradient for gauge arc */}
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>

              <GaugeReferenceArc />
              <GaugeValueArc />
              {/* Premium tapered needle */}
              <GaugeNeedle darkMode={darkMode} />
              {/* Percentage label inside the arc */}
              <GaugeCenterLabel value={progressPct} darkMode={darkMode} />
            </GaugeContainer>
          </div>
        </div>

        {/* Target label row */}
        <div className="ec-target-row">
          <span className={`ec-target-label ${darkMode ? "ec-target-dark" : "ec-target-light"}`}>
            ₹0
          </span>
          <span className={`ec-target-label ${darkMode ? "ec-target-dark" : "ec-target-light"}`} style={{ fontWeight: 600 }}>
            Target: {formatCurrency(MONTHLY_TARGET)}
          </span>
          <span className={`ec-target-label ${darkMode ? "ec-target-dark" : "ec-target-light"}`}>
            {formatCurrency(MONTHLY_TARGET)}
          </span>
        </div>

        {/* ── 3 stat chips: This Month / Last Month / YTD ── */}
        <div className="ec-chips">
          <StatChip
            label="This Month"
            value={formatCurrency(thisMonthEarn)}
            color="#c084fc"
            darkMode={darkMode}
          />
          <StatChip
            label="Last Month"
            value={formatCurrency(lastMonthEarn)}
            color={darkMode ? "rgba(255,255,255,0.7)" : "#4f46e5"}
            darkMode={darkMode}
          />
          <StatChip
            label="YTD"
            value={formatCurrency(ytdEarn)}
            color="#34d399"
            darkMode={darkMode}
          />
        </div>
      </div>
    </>
  );
}
