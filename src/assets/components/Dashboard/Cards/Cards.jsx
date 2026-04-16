import React, { useState, useEffect, useRef } from "react";
import { mockData } from "../../../MockData/MockData.jsx";

// ─── SVG Icon Imports ────────────────────────────────────────────────────────
import TotalIcon from "./icons/total-lead.svg?react";
import ActiveIcon from "./icons/active.svg?react";
import CloseIcon from "./icons/close.svg?react";
import ConvertedIcon from "./icons/conversion-rate.svg?react";
import UpIcon from "./icons/up-arrow.svg?react";
import DownIcon from "./icons/down-arrow.svg?react";


// ─── Date Helpers ─────────────────────────────────────────────────────────────

/** Returns true if the given date string matches today's date */
function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

//  Returns true if the given date string matches yesterday's date 
function isYesterday(dateStr) {
  const d = new Date(dateStr);
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return (
    d.getFullYear() === y.getFullYear() &&
    d.getMonth() === y.getMonth() &&
    d.getDate() === y.getDate()
  );
}


// ─── Change Calculator ────────────────────────────────────────────────────────
/**
 * Calculates the percentage change between today and yesterday's values.
 * Returns: { percent, diff, direction: "up" | "down" | "neutral", color }
 */
function getChange(today, yesterday) {
  if (yesterday === 0 && today === 0)
    return { percent: "0%", diff: 0, direction: "neutral", color: "change-neutral" };

  if (yesterday === 0)
    return { percent: "+100%", diff: today, direction: "up", color: "change-up" };

  const diff = today - yesterday;
  const percent = ((diff / yesterday) * 100).toFixed(1);

  if (diff > 0)
    return { percent: `+${percent}%`, diff, direction: "up", color: "change-up" };
  if (diff < 0)
    return { percent: `${percent}%`, diff: Math.abs(diff), direction: "down", color: "change-down" };

  return { percent: "0%", diff: 0, direction: "neutral", color: "change-neutral" };
}





// ─── Animated Counter Hook ────────────────────────────────────────────────────
/**
 * Custom hook: animates a number from 0 → target on mount.
 * Gives each card that satisfying "counting up" entrance feel.
 */
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime = null;
    const isDecimal = String(target).includes(".");
    const numericTarget = parseFloat(target);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic — fast start, gentle finish
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * numericTarget;
      setCount(isDecimal ? current.toFixed(1) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target); // snap to exact final value
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return count;
}


// ─── Single Stat Card ─────────────────────────────────────────────────────────
/**
 * GlassCard — one metric card with:
 *  • Glassmorphism surface (backdrop-filter blur)
 *  • Mouse-tracking 3D tilt on hover
 *  • Animated shimmer highlight following the cursor
 *  • Count-up number animation on mount
 *  • Staggered entrance via CSS animation-delay
 */
function GlassCard({ icon, label, value, suffix = "", change, darkMode, delay = 0 }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [setHovered] = useState(false);

  const animatedValue = useCountUp(parseFloat(value));



  // ──----- 3D tilt + glow tracking on mouse move ──---------
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // cursor X relative to card
    const y = e.clientY - rect.top;  // cursor Y relative to card

    // Map cursor position to tilt angles (max ±12°)
    const rotateX = ((y / rect.height) - 0.5) * -12;
    const rotateY = ((x / rect.width) - 0.5) * 12;

    card.style.transform = `
      perspective(800px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.03)
    `;

    // Move the shimmer glow to follow cursor
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
    glow.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (card) card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    if (glow) glow.style.opacity = "0";
    setHovered(false);
  };




  // ── Determine change badge styling ──
  const isUp = change.direction === "up";
  const isDown = change.direction === "down";

  return (
    <div
      ref={cardRef}
      className={`glass-card ${darkMode ? "glass-dark" : "glass-light"}`}
      style={{
        animationDelay: `${delay}ms`,
        transition: "transform 0.15s ease, box-shadow 0.3s ease",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
    >
      {/* ── Cursor-following shimmer glow ── */}
      <div
        ref={glowRef}
        className="card-glow"
        style={{ opacity: 0, transition: "opacity 0.3s ease, left 0.05s, top 0.05s" }}
      />

      {/* ── Top row: icon + change badge ── */}
      <div className="card-top-row">
        {/* Icon container with glass pill */}
        <div className={`icon-pill ${darkMode ? "icon-pill-dark" : "icon-pill-light"}`}>
          {icon}
        </div>

        {/* Change badge (up / down / neutral) */}
        {change.direction !== "neutral" && (
          <div className={`change-badge ${isUp ? "badge-up" : "badge-down"}`}>
            <span className="badge-arrow">{isUp ? "↑" : "↓"}</span>
            <span>{change.percent}</span>
          </div>
        )}
      </div>

      {/* ── Main metric value ── */}
      <div className="card-value">
        {animatedValue}{suffix}
      </div>

      {/* ── Label ── */}
      <div className={`card-label ${darkMode ? "label-dark" : "label-light"}`}>
        {label}
      </div>

      {/* ── Bottom change row ── */}
      <div className="card-footer">
        <span className={`footer-change ${isUp ? "footer-up" : isDown ? "footer-down" : "footer-neutral"}`}>
          {change.diff > 0
            ? `${isUp ? "+" : "-"}${change.diff} ${isUp ? "more" : "less"} today`
            : "No change today"}
        </span>
        <span className={`footer-vs ${darkMode ? "footer-vs-dark" : "footer-vs-light"}`}>
          vs yesterday
        </span>
      </div>

      {/* ── Subtle border shimmer on hover (CSS handles this) ── */}
      <div className="card-border-glow" />
    </div>
  );
}


// ─── Main Cards Component ─────────────────────────────────────────────────────

export default function Cards({ darkMode }) {

  // ── Aggregate today's and yesterday's counts from mock data ──
  const today = { total: 0, active: 0, closed: 0, converted: 0 };
  const yesterday = { total: 0, active: 0, closed: 0, converted: 0 };

  mockData.forEach((lead) => {
    const trackDate = lead.statusUpdatedAt || lead.createdAt;

    if (isToday(trackDate)) {
      today.total++;
      if (lead.dealStatus === "active") today.active++;
      if (lead.dealStatus === "close") today.closed++;
      if (lead.status === "converted") today.converted++;
    }

    if (isYesterday(trackDate)) {
      yesterday.total++;
      if (lead.dealStatus === "active") yesterday.active++;
      if (lead.dealStatus === "close") yesterday.closed++;
      if (lead.status === "converted") yesterday.converted++;
    }
  });

  // ── All-time totals ──
  const TotalLeads = mockData.length;
  const ActiveLeads = mockData.filter((a) => a.dealStatus === "active").length;
  const ClosedLeads = mockData.filter((d) => d.dealStatus === "close").length;
  const ConversionRate = ((ClosedLeads / TotalLeads) * 100).toFixed(1);

  // ── Day-over-day change objects ──
  const totalChange = getChange(today.total, yesterday.total);
  const activeChange = getChange(today.active, yesterday.active);
  const closedChange = getChange(today.closed, yesterday.closed);
  const conversionChange = getChange(today.converted, yesterday.converted);

  // ── Card definitions — easy to extend ──
  const cards = [
    { icon: <TotalIcon />,     label: "Total Leads",      value: TotalLeads,      suffix: "",  change: totalChange,      delay: 0   },
    { icon: <ActiveIcon />,    label: "Active Leads",     value: ActiveLeads,     suffix: "",  change: activeChange,     delay: 100 },
    { icon: <CloseIcon />,     label: "Closed Leads",     value: ClosedLeads,     suffix: "",  change: closedChange,     delay: 200 },
    { icon: <ConvertedIcon />, label: "Conversion Rate",  value: ConversionRate,  suffix: "%", change: conversionChange, delay: 300 },
  ];

  return (
    <>
      {/* ── Scoped styles: glass effect, animations, theming ── */}
      <style>{`

        /* ─────────────────────────────────────────────
           SECTION WRAPPER
        ───────────────────────────────────────────── */
        .cards-section {
          width: 100%;
          border-radius: 20px;
          padding: 24px;
          transition: background 0.4s ease;
        }
        .cards-section-dark  { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); }
        .cards-section-light { background: rgba(255,255,255,0.55); border: 1px solid rgba(255,255,255,0.8);  }

        /* ── Section title ── */
        .section-title {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.5px;
          margin: 0 0 20px 4px;
        }
        .title-dark  { color: rgba(255,255,255,0.92); }
        .title-light { color: #1a1a2e; }

        /* ─────────────────────────────────────────────
           CARD GRID
        ───────────────────────────────────────────── */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        /* ─────────────────────────────────────────────
           GLASS CARD BASE
           Core Apple-style glassmorphism surface.
           backdrop-filter creates the frosted glass blur.
        ───────────────────────────────────────────── */
        .glass-card {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          padding: 22px 20px 18px;
          cursor: default;
          animation: cardEntrance 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
          will-change: transform;
        }

        /* Dark-mode glass */
        .glass-dark {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          box-shadow:
            0 8px 32px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.12);
        }

        /* Light-mode glass */
        .glass-light {
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          box-shadow:
            0 8px 32px rgba(100,100,150,0.12),
            inset 0 1px 0 rgba(255,255,255,0.95);
        }

        /* Hover — elevate shadow */
        .glass-dark:hover {
          box-shadow:
            0 20px 60px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.22);
        }
        .glass-light:hover {
          box-shadow:
            0 20px 60px rgba(100,100,150,0.2),
            inset 0 1px 0 rgba(255,255,255,1);
          border-color: rgba(255,255,255,1);
        }

        /* ─────────────────────────────────────────────
           CURSOR SHIMMER GLOW
           Radial spotlight that follows the mouse cursor.
           Positioned absolutely, transformed so center = cursor.
        ───────────────────────────────────────────── */
        .card-glow {
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            circle,
            rgba(160, 130, 255, 0.18) 0%,
            transparent 70%
          );
          z-index: 0;
        }

        /* ─────────────────────────────────────────────
           CARD BORDER SHIMMER (decorative inner ring)
        ───────────────────────────────────────────── */
        .card-border-glow {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.12) 0%,
            transparent 50%,
            rgba(255,255,255,0.04) 100%
          );
          z-index: 0;
        }

        /* ─────────────────────────────────────────────
           CARD INTERNALS — all above the glow layer
        ───────────────────────────────────────────── */
        .card-top-row {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        /* Icon pill container */
        .icon-pill {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-pill svg { width: 20px; height: 20px; }

        .icon-pill-dark  {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
        }
        .icon-pill-light {
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(200,200,230,0.4);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        /* ─── Change badge ─── */
        .change-badge {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 20px;
          letter-spacing: 0.2px;
        }
        .badge-up {
          background: rgba(52, 211, 153, 0.15);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.25);
        }
        .badge-down {
          background: rgba(248, 113, 113, 0.15);
          color: #f87171;
          border: 1px solid rgba(248, 113, 113, 0.25);
        }
        .badge-arrow { font-size: 10px; }

        /* ─── Main value ─── */
        .card-value {
          position: relative;
          z-index: 1;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1;
          margin-bottom: 6px;
          /* Subtle shimmer gradient on number */
          background: linear-gradient(135deg, #fff 40%, rgba(180,160,255,0.9) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        /* Light mode: dark gradient instead */
        .glass-light .card-value {
          background: linear-gradient(135deg, #1a1a2e 40%, #6b48ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ─── Label ─── */
        .card-label {
          position: relative;
          z-index: 1;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.2px;
          margin-bottom: 12px;
        }
        .label-dark  { color: rgba(255,255,255,0.5); }
        .label-light { color: rgba(30,30,60,0.55); }

        /* ─── Footer change row ─── */
        .card-footer {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .footer-change { font-weight: 600; }
        .footer-up      { color: #34d399; }
        .footer-down    { color: #f87171; }
        .footer-neutral { color: rgba(255,255,255,0.35); }
        .footer-vs-dark  { color: rgba(255,255,255,0.3); }
        .footer-vs-light { color: rgba(30,30,60,0.35); }

        /* ─────────────────────────────────────────────
           ENTRANCE ANIMATION
           Cards fly in from below with a spring bounce.
           Each card gets an animation-delay for stagger.
        ───────────────────────────────────────────── */
        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: perspective(800px) translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: perspective(800px) translateY(0) scale(1);
          }
        }

      `}</style>

      {/* ── Section Wrapper ── */}
      <div className={`cards-section ${darkMode ? "cards-section-dark" : "cards-section-light"}`}>

        {/* Section heading */}
        <h1 className={`section-title ${darkMode ? "title-dark" : "title-light"}`}>
          Leads Summary
        </h1>

        {/* Card grid — renders one GlassCard per metric */}
        <div className="cards-grid">
          {cards.map((card, i) => (
            <GlassCard
              key={card.label}
              icon={card.icon}
              label={card.label}
              value={card.value}
              suffix={card.suffix}
              change={card.change}
              darkMode={darkMode}
              delay={card.delay}
            />
          ))}
        </div>

      </div>
    </>
  );
}
