import React, { useState, useRef, useEffect } from "react";

// ─── Meeting Data ─────────────────────────────────────────────────────────────
// In production, this would come from props or an API call.
// Each meeting has: type (call/sync/standup/demo/review), status, and attendees.
const INITIAL_MEETINGS = [
  {
    id: 1,
    title: "Demo Call with Jane Smith",
    date: new Date("2024-03-11T17:00:00"),
    type: "demo",       // used for icon + accent color
    status: "upcoming", // upcoming | done | cancelled
    attendees: ["JS"],  // initials for avatar stack
    priority: "high",
  },
  {
    id: 2,
    title: "Review Meeting with ABC Ltd",
    date: new Date("2024-03-12T10:00:00"),
    type: "review",
    status: "upcoming",
    attendees: ["AB", "CL"],
    priority: "medium",
  },
  {
    id: 3,
    title: "Follow-up Call with John Doe",
    date: new Date("2024-03-13T14:00:00"),
    type: "call",
    status: "upcoming",
    attendees: ["JD"],
    priority: "high",
  },
  {
    id: 4,
    title: "Client Sync with Tech Solutions",
    date: new Date("2024-03-14T11:00:00"),
    type: "sync",
    status: "upcoming",
    attendees: ["TS", "RK", "AM"],
    priority: "medium",
  },
  {
    id: 5,
    title: "Team Standup",
    date: new Date("2024-03-14T09:00:00"),
    type: "standup",
    status: "upcoming",
    attendees: ["RK", "JS", "PL"],
    priority: "low",
  },
];

// ─── Meeting type config: icon + accent color ─────────────────────────────────
const TYPE_CONFIG = {
  demo:    { icon: "◈", accent: "#c084fc", label: "Demo"     },
  review:  { icon: "◎", accent: "#7de0d6", label: "Review"   },
  call:    { icon: "◉", accent: "#60a5fa", label: "Call"     },
  sync:    { icon: "⊕", accent: "#f59e0b", label: "Sync"     },
  standup: { icon: "◇", accent: "#34d399", label: "Standup"  },
};

// Priority badge config
const PRIORITY_CONFIG = {
  high:   { color: "rgba(248,113,113,0.15)", text: "#f87171", border: "rgba(248,113,113,0.3)",  label: "High"   },
  medium: { color: "rgba(251,191,36,0.15)",  text: "#fbbf24", border: "rgba(251,191,36,0.3)",   label: "Med"    },
  low:    { color: "rgba(52,211,153,0.15)",  text: "#34d399", border: "rgba(52,211,153,0.3)",   label: "Low"    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const formatTime = (date) =>
  date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

/** Returns "Today", "Tomorrow", or formatted date */
function getRelativeDay(date) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return formatDate(date);
}

/** Returns minutes until meeting — negative means it's past */
function minutesUntil(date) {
  return Math.round((date - new Date()) / 60000);
}

// ─── Add Meeting Modal ────────────────────────────────────────────────────────
/**
 * Lightweight inline modal to add a new meeting.
 * In production this would submit to an API.
 */
function AddMeetingModal({ darkMode, onAdd, onClose }) {
  const [form, setForm] = useState({
    title: "", date: "", time: "", type: "call", priority: "medium",
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.title || !form.date || !form.time) return;
    const dateObj = new Date(`${form.date}T${form.time}:00`);
    onAdd({
      id: Date.now(),
      title: form.title,
      date: dateObj,
      type: form.type,
      status: "upcoming",
      attendees: ["ME"],
      priority: form.priority,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-box ${darkMode ? "modal-dark" : "modal-light"}`}
        onClick={(e) => e.stopPropagation()} // prevent backdrop click closing
      >
        <div className="modal-header">
          <span className={darkMode ? "modal-title-dark" : "modal-title-light"}>New Meeting</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Title */}
        <input
          className={`modal-input ${darkMode ? "input-dark" : "input-light"}`}
          placeholder="Meeting title..."
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />

        {/* Date + Time row */}
        <div className="modal-row">
          <input
            type="date"
            className={`modal-input modal-half ${darkMode ? "input-dark" : "input-light"}`}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          />
          <input
            type="time"
            className={`modal-input modal-half ${darkMode ? "input-dark" : "input-light"}`}
            value={form.time}
            onChange={(e) => set("time", e.target.value)}
          />
        </div>

        {/* Type + Priority row */}
        <div className="modal-row">
          <select
            className={`modal-input modal-half ${darkMode ? "input-dark" : "input-light"}`}
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
          >
            {Object.entries(TYPE_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            className={`modal-input modal-half ${darkMode ? "input-dark" : "input-light"}`}
            value={form.priority}
            onChange={(e) => set("priority", e.target.value)}
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-confirm" onClick={handleSubmit}>Schedule</button>
        </div>
      </div>
    </div>
  );
}

// ─── Single Meeting Row ───────────────────────────────────────────────────────
/**
 * One meeting row with:
 * - Type icon with accent color
 * - Title + relative date label
 * - Attendee avatar stack
 * - Priority badge
 * - Countdown chip (e.g. "in 2h")
 * - Mark Done / Cancel quick actions on hover
 */
function MeetingRow({ meeting, darkMode, onMarkDone, onCancel }) {
  const [hovered, setHovered] = useState(false);
  const cfg = TYPE_CONFIG[meeting.type] || TYPE_CONFIG.call;
  const pri = PRIORITY_CONFIG[meeting.priority] || PRIORITY_CONFIG.medium;
  const mins = minutesUntil(meeting.date);

  // Countdown label
  let countdown = null;
  if (meeting.status === "upcoming") {
    if (mins > 0 && mins < 1440) { // within 24h
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      countdown = h > 0 ? `in ${h}h ${m > 0 ? m + "m" : ""}` : `in ${m}m`;
    } else if (mins <= 0 && mins > -60) {
      countdown = "Now";
    }
  }

  const isDone      = meeting.status === "done";
  const isCancelled = meeting.status === "cancelled";

  return (
    <div
      className={`meeting-row ${darkMode ? "row-dark" : "row-light"} ${isDone ? "row-done" : ""} ${isCancelled ? "row-cancelled" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left: type icon pill */}
      <div className="meeting-icon-pill" style={{ background: cfg.accent + "1a", border: `1px solid ${cfg.accent}33` }}>
        <span style={{ color: cfg.accent, fontSize: 14 }}>{cfg.icon}</span>
      </div>

      {/* Center: title + date */}
      <div className="meeting-center">
        <p className={`meeting-title ${darkMode ? "title-dark" : "title-light"} ${isDone ? "line-through" : ""}`}>
          {meeting.title}
        </p>
        <p className={`meeting-date ${darkMode ? "date-dark" : "date-light"}`}>
          {getRelativeDay(meeting.date)} · {formatTime(meeting.date)}
        </p>
      </div>

      {/* Right side — shows meta normally, shows actions on hover */}
      <div className="meeting-right">
        {!hovered ? (
          <div className="meeting-meta">
            {/* Attendee avatar stack */}
            <div className="avatar-stack">
              {meeting.attendees.slice(0, 3).map((a, i) => (
                <div
                  key={i}
                  className="avatar"
                  style={{
                    background: cfg.accent + "33",
                    border: `1.5px solid ${cfg.accent}55`,
                    color: cfg.accent,
                    zIndex: 10 - i,
                    marginLeft: i === 0 ? 0 : -8,
                  }}
                >
                  {a}
                </div>
              ))}
              {meeting.attendees.length > 3 && (
                <div className="avatar avatar-more">+{meeting.attendees.length - 3}</div>
              )}
            </div>

            {/* Priority badge */}
            <div
              className="priority-badge"
              style={{ background: pri.color, color: pri.text, border: `1px solid ${pri.border}` }}
            >
              {pri.label}
            </div>

            {/* Countdown chip — only if within 24h */}
            {countdown && (
              <div className={`countdown-chip ${countdown === "Now" ? "chip-now" : darkMode ? "chip-dark" : "chip-light"}`}>
                {countdown}
              </div>
            )}
          </div>
        ) : (
          /* Quick action buttons revealed on hover */
          <div className="quick-actions">
            {meeting.status === "upcoming" && (
              <>
                <button className="qa-btn qa-done" onClick={() => onMarkDone(meeting.id)} title="Mark as done">
                  ✓
                </button>
                <button className="qa-btn qa-cancel" onClick={() => onCancel(meeting.id)} title="Cancel meeting">
                  ✕
                </button>
              </>
            )}
            {(isDone || isCancelled) && (
              <span className={`status-chip ${isDone ? "chip-done" : "chip-cancelled"}`}>
                {isDone ? "Done" : "Cancelled"}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MeetingCard({ darkMode = false }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const [meetings, setMeetings]     = useState(INITIAL_MEETINGS);
  const [showModal, setShowModal]   = useState(false);
  const [filter, setFilter]         = useState("all"); // all | today | upcoming

  // ── 3D tilt on mouse move ──
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.transform = `perspective(1000px) rotateX(${((y / rect.height) - 0.5) * -5}deg) rotateY(${((x / rect.width) - 0.5) * 5}deg)`;
    glow.style.left = `${x}px`;
    glow.style.top  = `${y}px`;
    glow.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  // ── Meeting actions ──
  const markDone   = (id) => setMeetings((ms) => ms.map((m) => m.id === id ? { ...m, status: "done" }      : m));
  const cancelMtg  = (id) => setMeetings((ms) => ms.map((m) => m.id === id ? { ...m, status: "cancelled" } : m));
  const addMeeting = (m)  => setMeetings((ms) => [...ms, m].sort((a, b) => a.date - b.date));

  // ── Filtered list ──
  const today = new Date();
  const filtered = meetings.filter((m) => {
    if (filter === "today")    return m.date.toDateString() === today.toDateString();
    if (filter === "upcoming") return m.status === "upcoming";
    return true;
  });

  // ── Count badges for header ──
  const upcomingCount = meetings.filter((m) => m.status === "upcoming").length;
  const todayCount    = meetings.filter((m) => m.date.toDateString() === today.toDateString()).length;

  return (
    <>
      <style>{`

        /* ── GLASS CARD ── */
        .mc-card {
          position: relative;
          overflow: hidden;
          border-radius: 22px;
          padding: 22px 20px 18px;
          width: 100%;
          animation: mcEntrance 0.65s cubic-bezier(0.34,1.4,0.64,1) both;
          will-change: transform;
          transform-style: preserve-3d;
          transition: box-shadow 0.3s ease;
        }
        .mc-dark {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.11);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .mc-light {
          background: rgba(255,255,255,0.68);
          border: 1px solid rgba(255,255,255,0.92);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(100,100,150,0.1), inset 0 1px 0 rgba(255,255,255,1);
        }
        .mc-dark:hover  { box-shadow: 0 24px 60px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.2); }
        .mc-light:hover { box-shadow: 0 24px 60px rgba(100,100,150,0.18), inset 0 1px 0 rgba(255,255,255,1); }

        /* Glow + shimmer overlays */
        .mc-glow {
          position: absolute; width: 240px; height: 240px; border-radius: 50%;
          pointer-events: none; transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(192,132,252,0.13) 0%, transparent 70%);
          transition: opacity 0.3s ease, left 0.05s, top 0.05s; z-index: 0;
        }
        .mc-shimmer {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, transparent 55%); z-index: 0;
        }

        /* ── HEADER ── */
        .mc-header {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .mc-header-left { display: flex; align-items: center; gap: 10px; }
        .mc-title-dark  { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.9); margin: 0; }
        .mc-title-light { font-size: 15px; font-weight: 600; color: #1a1a2e; margin: 0; }

        /* Count pill next to title */
        .count-pill {
          font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 20px;
          background: rgba(192,132,252,0.18); color: #c084fc; border: 1px solid rgba(192,132,252,0.3);
        }

        /* Add meeting button */
        .add-btn {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 20px;
          border: 1px solid rgba(192,132,252,0.35);
          background: rgba(192,132,252,0.12); color: #c084fc;
          cursor: pointer; transition: background 0.2s ease, transform 0.1s ease;
        }
        .add-btn:hover  { background: rgba(192,132,252,0.22); }
        .add-btn:active { transform: scale(0.97); }

        /* ── FILTER TABS ── */
        .mc-filters {
          position: relative; z-index: 1;
          display: flex; gap: 6px; margin-bottom: 14px;
        }
        .filter-tab {
          font-size: 11px; font-weight: 500; padding: 4px 12px; border-radius: 20px;
          border: 1px solid transparent; cursor: pointer; transition: all 0.2s ease;
        }
        .filter-tab-dark  { color: rgba(255,255,255,0.4); background: transparent; border-color: rgba(255,255,255,0.08); }
        .filter-tab-light { color: rgba(30,30,60,0.4);    background: transparent; border-color: rgba(0,0,0,0.08); }
        .filter-active-dark  { background: rgba(192,132,252,0.18); color: #c084fc; border-color: rgba(192,132,252,0.3); }
        .filter-active-light { background: rgba(107,72,255,0.1);   color: #6b48ff; border-color: rgba(107,72,255,0.25); }

        /* ── MEETING ROWS ── */
        .mc-list { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 4px; }

        .meeting-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 10px; border-radius: 14px;
          transition: background 0.2s ease;
          cursor: default;
        }
        .row-dark:hover  { background: rgba(255,255,255,0.05); }
        .row-light:hover { background: rgba(0,0,0,0.035); }
        .row-done      { opacity: 0.5; }
        .row-cancelled { opacity: 0.35; }

        /* Divider between rows */
        .meeting-row + .meeting-row {
          border-top: 1px solid rgba(128,128,128,0.08);
        }

        /* Type icon pill */
        .meeting-icon-pill {
          width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }

        /* Center text */
        .meeting-center { flex: 1; min-width: 0; }
        .meeting-title  {
          font-size: 12.5px; font-weight: 500; margin: 0 0 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .title-dark  { color: rgba(255,255,255,0.88); }
        .title-light { color: #1a1a2e; }
        .line-through { text-decoration: line-through; }

        .meeting-date { font-size: 11px; margin: 0; }
        .date-dark    { color: rgba(255,255,255,0.35); }
        .date-light   { color: rgba(30,30,60,0.45); }

        /* Right side meta */
        .meeting-right { display: flex; align-items: center; flex-shrink: 0; }
        .meeting-meta  { display: flex; align-items: center; gap: 6px; }

        /* Avatar stack */
        .avatar-stack { display: flex; align-items: center; }
        .avatar {
          width: 22px; height: 22px; border-radius: 50%;
          font-size: 8px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .avatar-more {
          background: rgba(128,128,128,0.2); color: rgba(255,255,255,0.5);
          font-size: 8px; margin-left: -8px;
        }

        /* Priority badge */
        .priority-badge {
          font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 20px;
        }

        /* Countdown chip */
        .countdown-chip {
          font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 20px;
          white-space: nowrap;
        }
        .chip-now   { background: rgba(248,113,113,0.18); color: #f87171; border: 1px solid rgba(248,113,113,0.3); animation: pulse 1.5s infinite; }
        .chip-dark  { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.1); }
        .chip-light { background: rgba(0,0,0,0.05); color: rgba(30,30,60,0.5); border: 1px solid rgba(0,0,0,0.08); }

        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }

        /* Quick action buttons (shown on hover) */
        .quick-actions { display: flex; align-items: center; gap: 6px; }
        .qa-btn {
          width: 26px; height: 26px; border-radius: 8px; border: none;
          font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: transform 0.1s ease;
        }
        .qa-btn:active { transform: scale(0.92); }
        .qa-done   { background: rgba(52,211,153,0.18); color: #34d399; }
        .qa-cancel { background: rgba(248,113,113,0.18); color: #f87171; }

        .status-chip { font-size: 10px; font-weight: 600; padding: 3px 9px; border-radius: 20px; }
        .chip-done      { background: rgba(52,211,153,0.15); color: #34d399; }
        .chip-cancelled { background: rgba(248,113,113,0.15); color: #f87171; }

        /* ── EMPTY STATE ── */
        .mc-empty {
          text-align: center; padding: 28px 0;
          font-size: 12px; color: rgba(128,128,128,0.5);
        }

        /* ── MODAL ── */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        .modal-box {
          width: 340px; border-radius: 20px; padding: 22px;
          animation: slideUp 0.3s cubic-bezier(0.34,1.4,0.64,1);
        }
        @keyframes slideUp { from { opacity:0; transform: translateY(20px) scale(0.97); } to { opacity:1; transform: translateY(0) scale(1); } }

        .modal-dark  { background: #1a1a2e; border: 1px solid rgba(255,255,255,0.12); }
        .modal-light { background: #fff;    border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 20px 60px rgba(0,0,0,0.15); }

        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .modal-title-dark  { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.9); }
        .modal-title-light { font-size: 15px; font-weight: 600; color: #1a1a2e; }
        .modal-close { background: none; border: none; font-size: 14px; cursor: pointer; color: rgba(128,128,128,0.6); padding: 2px 6px; border-radius: 6px; }
        .modal-close:hover { background: rgba(128,128,128,0.1); }

        .modal-input {
          width: 100%; box-sizing: border-box;
          padding: 9px 12px; border-radius: 10px; font-size: 13px;
          margin-bottom: 10px; outline: none;
          transition: border-color 0.2s;
        }
        .input-dark  { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.85); }
        .input-light { background: rgba(0,0,0,0.04);      border: 1px solid rgba(0,0,0,0.1);       color: #1a1a2e; }
        .input-dark:focus  { border-color: rgba(192,132,252,0.6); }
        .input-light:focus { border-color: rgba(107,72,255,0.5); }

        .modal-row   { display: flex; gap: 8px; }
        .modal-half  { flex: 1; }

        .modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
        .btn-cancel  { padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 500; cursor: pointer; background: transparent; border: 1px solid rgba(128,128,128,0.2); color: rgba(128,128,128,0.7); }
        .btn-confirm { padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer; background: linear-gradient(135deg, #c084fc, #818cf8); border: none; color: #fff; transition: opacity 0.2s; }
        .btn-confirm:hover { opacity: 0.9; }

        /* ── ENTRANCE ── */
        @keyframes mcEntrance {
          from { opacity:0; transform: perspective(1000px) translateY(28px) scale(0.96); }
          to   { opacity:1; transform: perspective(1000px) translateY(0) scale(1); }
        }
      `}</style>

      {/* ── Glass Card ── */}
      <div
        ref={cardRef}
        className={`mc-card ${darkMode ? "mc-dark" : "mc-light"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Decorative overlays */}
        <div ref={glowRef} className="mc-glow" style={{ opacity: 0 }} />
        <div className="mc-shimmer" />

        {/* ── Header: title + count + add button ── */}
        <div className="mc-header">
          <div className="mc-header-left">
            <p className={darkMode ? "mc-title-dark" : "mc-title-light"}>Upcoming Meetings</p>
            {/* Live count of upcoming meetings */}
            <span className="count-pill">{upcomingCount}</span>
          </div>
          {/* Opens the Add Meeting modal */}
          <button className="add-btn" onClick={() => setShowModal(true)}>
            + Schedule
          </button>
        </div>

        {/* ── Filter tabs: All / Today / Upcoming only ── */}
        <div className="mc-filters">
          {["all", "today", "upcoming"].map((f) => {
            const isActive = filter === f;
            const label = f === "all" ? `All (${meetings.length})` : f === "today" ? `Today (${todayCount})` : `Pending (${upcomingCount})`;
            return (
              <button
                key={f}
                className={`filter-tab
                  ${darkMode ? "filter-tab-dark" : "filter-tab-light"}
                  ${isActive ? (darkMode ? "filter-active-dark" : "filter-active-light") : ""}
                `}
                onClick={() => setFilter(f)}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Meeting list ── */}
        <div className="mc-list">
          {filtered.length === 0 ? (
            <div className="mc-empty">No meetings in this view</div>
          ) : (
            filtered.map((meeting) => (
              <MeetingRow
                key={meeting.id}
                meeting={meeting}
                darkMode={darkMode}
                onMarkDone={markDone}
                onCancel={cancelMtg}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Add Meeting Modal ── */}
      {showModal && (
        <AddMeetingModal
          darkMode={darkMode}
          onAdd={addMeeting}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
