import React, { useMemo, useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { mockData } from "../../../MockData/MockData";
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

// ─── Date helpers ─────────────────────────────────────────────────────────────

const getWeekday    = (d) => new Date(d).toLocaleDateString("en-US", { weekday: "short" });
const getWeekNumber = (d) => Math.ceil(new Date(d).getDate() / 7);
const sumByYear     = (y) =>
  mockData
    .filter((x) => new Date(x.purchaseDate).getFullYear() === y)
    .reduce((a, c) => a + (c.receivedAmount || 0), 0);

// ─── Currency formatter ───────────────────────────────────────────────────────
const fmt = (n) =>
  n >= 1e6 ? `₹${(n / 1e6).toFixed(2)}M`
  : n >= 1e3 ? `₹${(n / 1e3).toFixed(1)}K`
  : `₹${n.toFixed(0)}`;

// ─── Filter options ───────────────────────────────────────────────────────────
const FILTERS = [
  { value: "today",        label: "Today"        },
  { value: "thisMonth",    label: "This Month"   },
  { value: "thisYear",     label: "This Year"    },
  { value: "previousYear", label: "Prev. Year"   },
  { value: "last5Years",   label: "Last 5 Yrs"   },
];

// ─── Animated count-up ────────────────────────────────────────────────────────
function useCountUp(target, duration = 1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [target]);
  return val;
}

// ─── KPI chip above chart ─────────────────────────────────────────────────────
/**
 * Shows 3 quick KPIs derived from the currently filtered dataset:
 * Total, Peak period, and Average per period.
 */
function KpiChips({ data, labels, darkMode }) {
  const total   = data.reduce((a, b) => a + b, 0);
  const peak    = Math.max(...data);
  const peakIdx = data.indexOf(peak);
  const avg     = data.length ? total / data.length : 0;

  const animTotal = useCountUp(total, 900);
  const animPeak  = useCountUp(peak,  900);
  const animAvg   = useCountUp(avg,   900);

  const chips = [
    { label: "Total",   value: fmt(animTotal), color: "#c084fc" },
    { label: "Peak",    value: `${fmt(animPeak)} (${labels[peakIdx] || "—"})`, color: "#60a5fa" },
    { label: "Avg/Period", value: fmt(animAvg), color: "#34d399" },
  ];

  return (
    <div className="sc-kpi-row">
      {chips.map((c) => (
        <div key={c.label} className={`sc-kpi-chip ${darkMode ? "kpi-dark" : "kpi-light"}`}>
          <span className={`kpi-label ${darkMode ? "kpi-lbl-dark" : "kpi-lbl-light"}`}>{c.label}</span>
          <span className="kpi-value" style={{ color: c.color }}>{c.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SalesChart({ darkMode }) {
  const cardRef  = useRef(null);
  const glowRef  = useRef(null);
  const chartRef = useRef(null); // ref to Chart.js instance for gradient

  const [filter,    setFilter]    = useState("thisMonth");
  const [chartInst, setChartInst] = useState(null); // Chart.js canvas context

  // ── 3D tilt ──
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.transform = `perspective(1100px) rotateX(${((y / rect.height) - 0.5) * -5}deg) rotateY(${((x / rect.width) - 0.5) * 5}deg)`;
    glow.style.left = `${x}px`;
    glow.style.top  = `${y}px`;
    glow.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  // ── Data computation (same logic as original, extended) ──
  const computedData = useMemo(() => {
    switch (filter) {

      case "today": {
        // Group all data by weekday (Mon–Sun)
        const DAYS  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const totals = Object.fromEntries(DAYS.map((d) => [d, 0]));
        mockData.forEach((s) => {
          const day = getWeekday(s.purchaseDate);
          if (totals[day] !== undefined) totals[day] += s.receivedAmount || 0;
        });
        const labels = DAYS;
        return { labels, data: labels.map((d) => totals[d]) };
      }

      case "thisMonth": {
        const weeks = [0, 0, 0, 0];
        mockData.forEach((s) => {
          const w = getWeekNumber(s.purchaseDate);
          if (w >= 1 && w <= 4) weeks[w - 1] += s.receivedAmount || 0;
        });
        return { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], data: weeks };
      }

      case "thisYear": {
        const months = new Array(12).fill(0);
        mockData.forEach((s) => {
          months[new Date(s.purchaseDate).getMonth()] += s.receivedAmount || 0;
        });
        return {
          labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
          data: months,
        };
      }

      case "previousYear": {
        const year = new Date().getFullYear() - 1;
        const q = [0, 0, 0, 0];
        mockData.forEach((s) => {
          const d = new Date(s.purchaseDate);
          if (d.getFullYear() === year) q[Math.floor(d.getMonth() / 3)] += s.receivedAmount || 0;
        });
        return { labels: ["Q1", "Q2", "Q3", "Q4"], data: q };
      }

      case "last5Years": {
        const cur    = new Date().getFullYear();
        const labels = [];
        const values = [];
        for (let y = cur - 4; y <= cur; y++) {
          labels.push(`${y}`);
          values.push(sumByYear(y));
        }
        return { labels, data: values };
      }

      default: return { labels: [], data: [] };
    }
  }, [filter]);

  // ── Build gradient fill dynamically using Chart.js canvas context ──
  // This creates the beautiful top-to-transparent area fill.
  const getGradient = (ctx, chartArea) => {
    if (!ctx || !chartArea) return darkMode ? "rgba(192,132,252,0.3)" : "rgba(107,72,255,0.2)";
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    if (darkMode) {
      gradient.addColorStop(0,   "rgba(192,132,252,0.35)");
      gradient.addColorStop(0.6, "rgba(129,140,248,0.12)");
      gradient.addColorStop(1,   "rgba(192,132,252,0)");
    } else {
      gradient.addColorStop(0,   "rgba(107,72,255,0.22)");
      gradient.addColorStop(0.6, "rgba(99,102,241,0.08)");
      gradient.addColorStop(1,   "rgba(107,72,255,0)");
    }
    return gradient;
  };

  // ── Chart.js dataset ──
  const chartData = useMemo(() => ({
    labels: computedData.labels,
    datasets: [
      {
        label: "Sales",
        data: computedData.data,
        borderWidth: 2.5,
        tension: 0.45,          // smooth bezier
        fill: true,
        borderColor: darkMode ? "#c084fc" : "#7c3aed",
        // backgroundColor is a function — Chart.js calls it with {chart} context
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "transparent";
          return getGradient(ctx, chartArea);
        },
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: darkMode ? "#c084fc" : "#7c3aed",
        pointBorderColor: darkMode ? "rgba(20,20,35,0.8)" : "#ffffff",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#ffffff",
        pointHoverBorderColor: darkMode ? "#c084fc" : "#7c3aed",
        pointHoverBorderWidth: 2,
      },
    ],
  }), [computedData, darkMode]);

  // ── Chart.js options ──
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false }, // crosshair tooltip
    animation: {
      duration: 700,
      easing: "easeInOutQuart",  // smooth on filter change
    },
    plugins: {
      legend: { display: false },  // we draw our own KPI chips
      tooltip: {
        enabled: true,
        backgroundColor: darkMode ? "rgba(20,20,35,0.92)" : "rgba(255,255,255,0.96)",
        titleColor: darkMode ? "rgba(255,255,255,0.9)" : "#1a1a2e",
        bodyColor:  darkMode ? "rgba(255,255,255,0.6)" : "#4b5563",
        borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (ctx) => ` Sales: ${fmt(ctx.parsed.y || 0)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,30,60,0.45)",
          font: { size: 11, weight: "500" },
        },
      },
      y: {
        grid: {
          color: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
        },
        border: { display: false },
        ticks: {
          color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(30,30,60,0.45)",
          font: { size: 11 },
          callback: (v) => fmt(v),   // compact labels on Y axis
          maxTicksLimit: 5,
        },
      },
    },
  }), [darkMode]);

  return (
    <>
      <style>{`

        /* ── GLASS CARD ── */
        .sc-card {
          position: relative; overflow: hidden; border-radius: 22px;
          padding: 22px 20px 20px; width: 100%;
          animation: scEntrance 0.65s cubic-bezier(0.34,1.4,0.64,1) both;
          will-change: transform; transform-style: preserve-3d;
          transition: box-shadow 0.3s ease;
        }
        .sc-dark {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.11);
          backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .sc-light {
          background: rgba(255,255,255,0.68); border: 1px solid rgba(255,255,255,0.92);
          backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(100,100,150,0.1), inset 0 1px 0 rgba(255,255,255,1);
        }
        .sc-dark:hover  { box-shadow: 0 24px 60px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.2); }
        .sc-light:hover { box-shadow: 0 24px 60px rgba(100,100,150,0.18), inset 0 1px 0 rgba(255,255,255,1); }

        /* Cursor glow + shimmer */
        .sc-glow {
          position: absolute; width: 300px; height: 300px; border-radius: 50%; pointer-events: none;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 70%);
          transition: opacity 0.3s ease, left 0.05s, top 0.05s; z-index: 0;
        }
        .sc-shimmer {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 55%); z-index: 0;
        }

        /* ── HEADER ── */
        .sc-header {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
        }
        .sc-title-dark  { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.92); margin: 0; }
        .sc-title-light { font-size: 15px; font-weight: 600; color: #1a1a2e; margin: 0; }

        /* ── FILTER PILL TABS ── */
        .sc-filters { display: flex; gap: 5px; flex-wrap: wrap; }
        .sc-tab {
          font-size: 11px; font-weight: 500; padding: 4px 11px; border-radius: 20px;
          border: 1px solid transparent; cursor: pointer; transition: all 0.2s ease; white-space: nowrap;
        }
        .sc-tab-dark  { color: rgba(255,255,255,0.38); background: transparent; border-color: rgba(255,255,255,0.08); }
        .sc-tab-light { color: rgba(30,30,60,0.4);    background: transparent; border-color: rgba(0,0,0,0.08); }
        .sc-active-dark  { background: rgba(192,132,252,0.18); color: #c084fc; border-color: rgba(192,132,252,0.35); }
        .sc-active-light { background: rgba(107,72,255,0.1);   color: #7c3aed; border-color: rgba(107,72,255,0.28); }

        /* ── KPI CHIPS ── */
        .sc-kpi-row {
          position: relative; z-index: 1;
          display: flex; gap: 8px; margin-bottom: 16px;
        }
        .sc-kpi-chip {
          flex: 1; border-radius: 12px; padding: 8px 10px;
          display: flex; flex-direction: column; gap: 2px;
        }
        .kpi-dark  { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); }
        .kpi-light { background: rgba(0,0,0,0.035);     border: 1px solid rgba(0,0,0,0.07); }

        .kpi-label { font-size: 10px; font-weight: 500; letter-spacing: 0.2px; }
        .kpi-lbl-dark  { color: rgba(255,255,255,0.38); }
        .kpi-lbl-light { color: rgba(30,30,60,0.45); }
        .kpi-value { font-size: 12.5px; font-weight: 700; letter-spacing: -0.2px; }

        /* ── CHART AREA ── */
        .sc-chart-wrap {
          position: relative; z-index: 1;
          height: 220px;
        }

        /* ── ENTRANCE ── */
        @keyframes scEntrance {
          from { opacity:0; transform: perspective(1100px) translateY(28px) scale(0.96); }
          to   { opacity:1; transform: perspective(1100px) translateY(0) scale(1); }
        }
      `}</style>

      <div
        ref={cardRef}
        className={`sc-card ${darkMode ? "sc-dark" : "sc-light"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Decorative overlays */}
        <div ref={glowRef} className="sc-glow" style={{ opacity: 0 }} />
        <div className="sc-shimmer" />

        {/* ── Header: title + filter pill tabs ── */}
        <div className="sc-header">
          <p className={darkMode ? "sc-title-dark" : "sc-title-light"}>Sales Overview</p>

          {/* Pill tabs — replaces the <select> dropdown */}
          <div className="sc-filters">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`sc-tab
                  ${darkMode ? "sc-tab-dark" : "sc-tab-light"}
                  ${filter === f.value ? (darkMode ? "sc-active-dark" : "sc-active-light") : ""}
                `}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── KPI summary chips (Total / Peak / Avg) ── */}
        <KpiChips
          data={computedData.data}
          labels={computedData.labels}
          darkMode={darkMode}
        />

        {/* ── Line Chart ── */}
        <div className="sc-chart-wrap">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </>
  );
}
