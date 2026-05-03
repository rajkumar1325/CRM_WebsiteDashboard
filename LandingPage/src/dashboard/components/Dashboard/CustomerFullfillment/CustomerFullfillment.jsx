import { useRef, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// ─── Constants ────────────────────────────────────────────────────────────────

const LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const LAST_MONTH_DATA = [4000, 5000, 4200, 3900, 4100, 4300, 4087];
const THIS_MONTH_DATA = [4800, 4500, 4700, 4300, 4400, 4900, 5506];

// Brand accent colors — consistent across chart + legend
const COLOR_TEAL   = "#7de0d6";
const COLOR_PURPLE = "#c084fc";

// ─── Sparkline Summary Bar ────────────────────────────────────────────────────

/**
 * Animated progress bar shown in the legend section.
 * Grows from 0 → target width on mount to show relative performance.
 */
function SparkBar({ percent, color }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Tiny delay so CSS transition fires after paint
    const t = setTimeout(() => setWidth(percent), 80);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <div className="sparkbar-track">
      <div
        className="sparkbar-fill"
        style={{
          width: `${width}%`,
          background: color,
          transition: "width 1s cubic-bezier(0.34,1.1,0.64,1)",
        }}
      />
    </div>
  );
}

// ─── Legend Item ──────────────────────────────────────────────────────────────

/**
 * One row in the legend: color dot + label, value, and animated sparkbar.
 */
function LegendItem({ color, label, value, percent, darkMode }) {
  return (
    <div className="legend-item">
      {/* Top row: dot + label + value */}
      <div className="legend-row">
        <div className="legend-left">
          <span className="legend-dot" style={{ background: color }} />
          <span className={`legend-label ${darkMode ? "text-muted-dark" : "text-muted-light"}`}>
            {label}
          </span>
        </div>
        <span className={`legend-value ${darkMode ? "value-dark" : "value-light"}`}>
          {value}
        </span>
      </div>

      {/* Animated progress bar */}
      <SparkBar percent={percent} color={color} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CustomerFulfilmentChart({ darkMode }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  // ── Growth % for sparkbars (relative to max of both final values) ──
  const maxVal = Math.max(
    LAST_MONTH_DATA[LAST_MONTH_DATA.length - 1],
    THIS_MONTH_DATA[THIS_MONTH_DATA.length - 1]
  );
  const lastPercent = (LAST_MONTH_DATA[LAST_MONTH_DATA.length - 1] / maxVal) * 100;
  const thisPercent = (THIS_MONTH_DATA[THIS_MONTH_DATA.length - 1] / maxVal) * 100;

  // ── Growth badge: show % increase this month vs last ──
  const lastFinal = LAST_MONTH_DATA[LAST_MONTH_DATA.length - 1];
  const thisFinal = THIS_MONTH_DATA[THIS_MONTH_DATA.length - 1];
  const growthPct  = (((thisFinal - lastFinal) / lastFinal) * 100).toFixed(1);
  const isPositive = thisFinal >= lastFinal;

  // ── 3D tilt on mouse move (same pattern as Cards) ──
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -8; // gentle tilt for a larger card
    const rotateY = ((x / rect.width) - 0.5) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    glow.style.left = `${x}px`;
    glow.style.top  = `${y}px`;
    glow.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  // ── Chart.js dataset config ──
  const chartData = {
    labels: LABELS,
    datasets: [
      {
        label: "Last Month",
        data: LAST_MONTH_DATA,
        borderColor: COLOR_TEAL,
        // Gradient fill is set dynamically via plugin (below via canvas context)
        backgroundColor: darkMode
          ? "rgba(125, 224, 214, 0.08)"
          : "rgba(125, 224, 214, 0.12)",
        fill: true,
        tension: 0.45,        // smooth bezier curves
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: COLOR_TEAL,
        pointBorderColor: darkMode ? "#1e1f2e" : "#fff",
        pointBorderWidth: 2,
        borderWidth: 2,
      },
      {
        label: "This Month",
        data: THIS_MONTH_DATA,
        borderColor: COLOR_PURPLE,
        backgroundColor: darkMode
          ? "rgba(192, 132, 252, 0.08)"
          : "rgba(192, 132, 252, 0.12)",
        fill: true,
        tension: 0.45,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: COLOR_PURPLE,
        pointBorderColor: darkMode ? "#1e1f2e" : "#fff",
        pointBorderWidth: 2,
        borderWidth: 2,
      },
    ],
  };

  // ── Chart.js options ──
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      // Crosshair tooltip across both datasets at once
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: { display: false }, // We draw our own premium legend below
      tooltip: {
        enabled: true,
        backgroundColor: darkMode ? "rgba(20,20,35,0.92)" : "rgba(255,255,255,0.95)",
        titleColor: darkMode ? "rgba(255,255,255,0.9)" : "#1a1a2e",
        bodyColor: darkMode ? "rgba(255,255,255,0.65)" : "#4b5563",
        borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        // Format tooltip values as currency
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: $${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
          font: { size: 11, weight: "500" },
        },
      },
      y: {
        grid: {
          color: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          drawBorder: false,
        },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
          font: { size: 11 },
          // Compact number format: 4000 → $4k
          callback: (v) => `$${v / 1000}k`,
          maxTicksLimit: 5,
        },
      },
    },
  };

  return (
    <>
      <style>{`

        /* ─────────────────────────────────────────────
           GLASS CARD — same system as Cards.jsx
        ───────────────────────────────────────────── */
        .cf-card {
          position: relative;
          overflow: hidden;
          border-radius: 22px;
          padding: 22px 20px 20px;
          width: 100%;
          max-width: 360px;
          margin: 0 auto;
          transition: box-shadow 0.3s ease;
          animation: cfEntrance 0.65s cubic-bezier(0.34,1.4,0.64,1) both;
          will-change: transform;
          transform-style: preserve-3d;
        }

        /* Dark glass */
        .cf-dark {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.11);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow:
            0 8px 32px rgba(0,0,0,0.38),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }
        /* Light glass */
        .cf-light {
          background: rgba(255,255,255,0.68);
          border: 1px solid rgba(255,255,255,0.92);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow:
            0 8px 32px rgba(100,100,150,0.1),
            inset 0 1px 0 rgba(255,255,255,1);
        }

        .cf-dark:hover {
          box-shadow:
            0 24px 60px rgba(0,0,0,0.48),
            inset 0 1px 0 rgba(255,255,255,0.16);
          border-color: rgba(255,255,255,0.2);
        }
        .cf-light:hover {
          box-shadow:
            0 24px 60px rgba(100,100,150,0.18),
            inset 0 1px 0 rgba(255,255,255,1);
        }

        /* ─── Cursor shimmer glow ─── */
        .cf-glow {
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(192,132,252,0.15) 0%, transparent 70%);
          transition: opacity 0.3s ease, left 0.05s, top 0.05s;
          z-index: 0;
        }

        /* ─── Decorative top-left shimmer ─── */
        .cf-shimmer {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%);
          z-index: 0;
        }

        /* ─────────────────────────────────────────────
           HEADER ROW
        ───────────────────────────────────────────── */
        .cf-header {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .cf-title-dark  { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.9);  margin: 0 0 3px; }
        .cf-title-light { font-size: 15px; font-weight: 600; color: #1a1a2e; margin: 0 0 3px; }

        .cf-subtitle-dark  { font-size: 11px; color: rgba(255,255,255,0.35); margin: 0; }
        .cf-subtitle-light { font-size: 11px; color: rgba(30,30,60,0.4);    margin: 0; }

        /* Growth badge */
        .cf-badge {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.2px;
          white-space: nowrap;
        }
        .badge-pos { background: rgba(52,211,153,0.15); color: #34d399; border: 1px solid rgba(52,211,153,0.25); }
        .badge-neg { background: rgba(248,113,113,0.15); color: #f87171; border: 1px solid rgba(248,113,113,0.25); }

        /* ─────────────────────────────────────────────
           CHART AREA
        ───────────────────────────────────────────── */
        .cf-chart-wrap {
          position: relative;
          z-index: 1;
          height: 180px;
          margin-bottom: 18px;
        }

        /* ─────────────────────────────────────────────
           DIVIDER
        ───────────────────────────────────────────── */
        .cf-divider-dark  { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 0 0 16px; }
        .cf-divider-light { border: none; border-top: 1px solid rgba(0,0,0,0.07);       margin: 0 0 16px; }

        /* ─────────────────────────────────────────────
           LEGEND ITEMS
        ───────────────────────────────────────────── */
        .cf-legend {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .legend-item  { display: flex; flex-direction: column; gap: 5px; }
        .legend-row   { display: flex; justify-content: space-between; align-items: center; }
        .legend-left  { display: flex; align-items: center; gap: 7px; }

        .legend-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .legend-label { font-size: 12px; font-weight: 500; }
        .text-muted-dark  { color: rgba(255,255,255,0.5); }
        .text-muted-light { color: rgba(30,30,60,0.5); }

        .legend-value { font-size: 13px; font-weight: 700; letter-spacing: -0.3px; }
        .value-dark   { color: rgba(255,255,255,0.9); }
        .value-light  { color: #1a1a2e; }

        /* ─── Sparkbar ─── */
        .sparkbar-track {
          height: 3px;
          border-radius: 99px;
          background: rgba(128,128,128,0.12);
          overflow: hidden;
        }
        .sparkbar-fill {
          height: 100%;
          border-radius: 99px;
          width: 0%;            /* starts at 0, animated via JS */
        }

        /* ─────────────────────────────────────────────
           ENTRANCE ANIMATION
        ───────────────────────────────────────────── */
        @keyframes cfEntrance {
          from { opacity: 0; transform: perspective(1000px) translateY(28px) scale(0.96); }
          to   { opacity: 1; transform: perspective(1000px) translateY(0)    scale(1);    }
        }

      `}</style>

      <div
        ref={cardRef}
        className={`cf-card ${darkMode ? "cf-dark" : "cf-light"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Decorative overlays — behind all content */}
        <div ref={glowRef} className="cf-glow" style={{ opacity: 0 }} />
        <div className="cf-shimmer" />

        {/* ── Header: title + growth badge ── */}
        <div className="cf-header">
          <div>
            <p className={darkMode ? "cf-title-dark" : "cf-title-light"}>
              Customer Fulfilment
            </p>
            <p className={darkMode ? "cf-subtitle-dark" : "cf-subtitle-light"}>
              Weekly performance
            </p>
          </div>

          {/* % change badge between last and this month's final values */}
          <div className={`cf-badge ${isPositive ? "badge-pos" : "badge-neg"}`}>
            {isPositive ? "↑" : "↓"} {Math.abs(growthPct)}%
          </div>
        </div>

        {/* ── Line Chart ── */}
        <div className="cf-chart-wrap">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* ── Divider ── */}
        <hr className={darkMode ? "cf-divider-dark" : "cf-divider-light"} />

        {/* ── Legend with animated sparkbars ── */}
        <div className="cf-legend">
          <LegendItem
            color={COLOR_TEAL}
            label="Last Month"
            value={`$${lastFinal.toLocaleString()}`}
            percent={lastPercent}
            darkMode={darkMode}
          />
          <LegendItem
            color={COLOR_PURPLE}
            label="This Month"
            value={`$${thisFinal.toLocaleString()}`}
            percent={thisPercent}
            darkMode={darkMode}
          />
        </div>
      </div>
    </>
  );
}
