import React, { useState, useMemo, useRef } from "react";
import {
  ChevronLeft, ChevronRight, Plus, X, Calendar,
  Clock, Tag, User, Briefcase, Target, Bell,
  CheckCircle2, AlertTriangle, Users, Zap,
} from "lucide-react";

// ─── Mock event data ───────────────────────────────────────────────────────────
// In production this would come from your backend events table (owner_id, category, date_time, title)
const INITIAL_EVENTS = [
  { id: "E001", title: "Demo Call with Jane Smith",        date: "2025-04-03", time: "17:00", category: "Meeting",  description: "Product demo for CRM Pro.",          client: "Acme Corp",        project: null,            owner: "Raj Kumar"  },
  { id: "E002", title: "Review Meeting with ABC Ltd",      date: "2025-04-07", time: "10:00", category: "Meeting",  description: "Q2 review session.",                 client: "TechNova Ltd.",    project: "Cloud Migration", owner: "Sarah Kim"  },
  { id: "E003", title: "Website Redesign Deadline",        date: "2025-04-10", time: "23:59", category: "Deadline", description: "Final handover to Acme Corp.",       client: "Acme Corp",        project: "Website Redesign", owner: "Raj Kumar" },
  { id: "E004", title: "Team Standup",                     date: "2025-04-14", time: "09:00", category: "Meeting",  description: "Weekly team sync.",                  client: null,               project: null,            owner: "Raj Kumar"  },
  { id: "E005", title: "Cloud Migration Phase 1 Deadline", date: "2025-04-18", time: "18:00", category: "Deadline", description: "Data migration phase 1 complete.",   client: "TechNova Ltd.",    project: "Cloud Migration", owner: "John Doe"   },
  { id: "E006", title: "Client Sync with Tech Solutions",  date: "2025-04-21", time: "11:00", category: "Meeting",  description: "Monthly check-in.",                 client: "TechNova Ltd.",    project: null,            owner: "Raj Kumar"  },
  { id: "E007", title: "CRM Analytics Sprint Review",      date: "2025-04-22", time: "14:00", category: "Meeting",  description: "Sprint 3 demo & feedback.",          client: "Neon Industries",  project: "CRM Analytics Dashboard", owner: "Priya Sharma" },
  { id: "E008", title: "Office Holiday",                   date: "2025-04-25", time: "00:00", category: "Holiday",  description: "Company-wide off.",                  client: null,               project: null,            owner: "Raj Kumar"  },
  { id: "E009", title: "Mobile App UAT Kickoff",           date: "2025-04-28", time: "10:00", category: "Task",     description: "UAT testing begins.",                client: "GreenLeaf",        project: "Mobile App Development", owner: "Sarah Kim" },
  { id: "E010", title: "Security Audit Start",             date: "2025-04-30", time: "09:00", category: "Task",     description: "Initial security assessment.",       client: "Data Systems",     project: "Security Audit", owner: "Priya Sharma" },
  { id: "E011", title: "Investor Presentation",            date: "2025-04-08", time: "15:00", category: "Meeting",  description: "Q1 results + roadmap walkthrough.",  client: null,               project: null,            owner: "Raj Kumar"  },
  { id: "E012", title: "Product Launch — v2.0",            date: "2025-04-15", time: "12:00", category: "Event",    description: "CuriumCRM v2.0 public release.",     client: null,               project: null,            owner: "Raj Kumar"  },
  { id: "E013", title: "Follow-up Call with John Doe",     date: "2025-04-16", time: "14:00", category: "Meeting",  description: "Discussing renewal.",                client: "Acme Corp",        project: null,            owner: "Sarah Kim"  },
  { id: "E014", title: "Sprint Planning",                  date: "2025-04-23", time: "10:30", category: "Meeting",  description: "Sprint 4 planning session.",         client: null,               project: "CRM Analytics Dashboard", owner: "Priya Sharma" },
];

// ─── Category config ───────────────────────────────────────────────────────────
const CATEGORY = {
  Meeting:  { color: "#818cf8", bg: "rgba(129,140,248,0.15)", border: "rgba(129,140,248,0.3)", dot: "#818cf8", Icon: Users       },
  Deadline: { color: "#f87171", bg: "rgba(248,113,113,0.15)", border: "rgba(248,113,113,0.3)", dot: "#f87171", Icon: AlertTriangle},
  Task:     { color: "#fbbf24", bg: "rgba(251,191,36,0.15)",  border: "rgba(251,191,36,0.3)",  dot: "#fbbf24", Icon: CheckCircle2 },
  Event:    { color: "#34d399", bg: "rgba(52,211,153,0.15)",  border: "rgba(52,211,153,0.3)",  dot: "#34d399", Icon: Zap          },
  Holiday:  { color: "#f472b6", bg: "rgba(244,114,182,0.15)", border: "rgba(244,114,182,0.3)", dot: "#f472b6", Icon: Bell         },
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pad  = (n) => String(n).padStart(2, "0");
const toDateStr = (y, m, d) => `${y}-${pad(m+1)}-${pad(d)}`;
const today = new Date();
const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

// ─── Reusable badge ────────────────────────────────────────────────────────────
function Badge({ label, cfg }) {
  if (!cfg || !label) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
      text-[10px] font-semibold whitespace-nowrap"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {label}
    </span>
  );
}

// ─── Empty form template ───────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: "", date: "", time: "09:00",
  category: "Meeting", description: "",
  client: "", project: "", owner: "Raj Kumar",
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CalendarPage({ darkMode }) {

  // ── State ──────────────────────────────────────────────────────────────────
  const [events,       setEvents]       = useState(INITIAL_EVENTS);
  const [year,         setYear]         = useState(today.getFullYear());
  const [month,        setMonth]        = useState(today.getMonth());
  const [viewMode,     setViewMode]     = useState("month");   // "month" | "week" | "agenda"
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [showModal,    setShowModal]    = useState(false);
  const [editEvent,    setEditEvent]    = useState(null);      // null = new, object = edit
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [catFilter,    setCatFilter]    = useState("all");
  const [hoveredDay,   setHoveredDay]   = useState(null);
  const [mousePos,     setMousePos]     = useState({ x: 0.5, y: 0.5 });
  const calRef = useRef(null);

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const bg          = darkMode ? "#171821"                : "#fffbeb";
  const cardBg      = darkMode ? "rgba(33,34,45,0.88)"   : "rgba(255,255,255,0.88)";
  const borderCol   = darkMode ? "rgba(255,255,255,0.07)": "rgba(0,0,0,0.08)";
  const headerBg    = darkMode ? "rgba(15,17,28,0.95)"   : "rgba(241,245,249,0.95)";
  const textPrimary = darkMode ? "#e2e8f0"               : "#0f172a";
  const textMuted   = darkMode ? "#64748b"               : "#94a3b8";
  const todayAccent = "#6366f1";

  // ── 3D tilt effect (mouse position → perspective) ─────────────────────────
  const handleMouseMove = (e) => {
    if (!calRef.current) return;
    const rect = calRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height,
    });
  };

  const tilt3D = {
    transform: `perspective(1200px)
      rotateX(${(mousePos.y - 0.5) * 3}deg)
      rotateY(${(mousePos.x - 0.5) * -3}deg)`,
    transition: "transform 0.08s ease-out",
    transformStyle: "preserve-3d",
  };

  // ── Filtered events ────────────────────────────────────────────────────────
  const filteredEvents = useMemo(() =>
    events.filter((e) => catFilter === "all" || e.category === catFilter),
  [events, catFilter]);

  // ── Events grouped by date string ─────────────────────────────────────────
  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [filteredEvents]);

  // ── Events for selected date ───────────────────────────────────────────────
  const selectedEvents = eventsByDate[selectedDate] || [];

  // ── Calendar grid days ────────────────────────────────────────────────────
  const daysInMonth  = getDaysInMonth(year, month);
  const firstDay     = getFirstDayOfMonth(year, month);
  const totalCells   = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  // ── Navigation ────────────────────────────────────────────────────────────
  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  const goToday   = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); setSelectedDate(todayStr); };

  // ── Open modal ─────────────────────────────────────────────────────────────
  const openNew = (date = selectedDate) => {
    setEditEvent(null);
    setForm({ ...EMPTY_FORM, date });
    setShowModal(true);
  };
  const openEdit = (ev) => {
    setEditEvent(ev);
    setForm({ title: ev.title, date: ev.date, time: ev.time, category: ev.category,
              description: ev.description || "", client: ev.client || "",
              project: ev.project || "", owner: ev.owner || "Raj Kumar" });
    setShowModal(true);
  };

  // ── Save event ─────────────────────────────────────────────────────────────
  const saveEvent = () => {
    if (!form.title.trim() || !form.date) return;
    if (editEvent) {
      setEvents(prev => prev.map(e => e.id === editEvent.id ? { ...editEvent, ...form } : e));
    } else {
      const newId = `E${String(events.length + 1).padStart(3, "0")}`;
      setEvents(prev => [...prev, { id: newId, ...form }]);
    }
    setShowModal(false);
  };

  // ── Delete event ───────────────────────────────────────────────────────────
  const deleteEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));

  // ── Stats ──────────────────────────────────────────────────────────────────
  const monthEvents = filteredEvents.filter(e => {
    const [y, m] = e.date.split("-").map(Number);
    return y === year && m === month + 1;
  });

  // ── Week view: 7 days starting from the week containing selectedDate ──────
  const weekDays = useMemo(() => {
    const base = new Date(selectedDate);
    const dow  = base.getDay();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() - dow + i);
      return toDateStr(d.getFullYear(), d.getMonth(), d.getDate());
    });
  }, [selectedDate]);

  // ── Agenda: next 30 days from today ───────────────────────────────────────
  const agendaItems = useMemo(() => {
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() + 30);
    return filteredEvents
      .filter(e => new Date(e.date) >= today && new Date(e.date) <= cutoff)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [filteredEvents]);

  // ── Shared glass input style ───────────────────────────────────────────────
  const inputStyle = {
    width: "100%", background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    border: `1px solid ${borderCol}`, borderRadius: 10, padding: "9px 12px",
    color: textPrimary, fontSize: 13, outline: "none", fontFamily: "inherit",
  };

  // CSS injected once
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Syne:wght@600;700&display=swap');
    .cal-root * { box-sizing: border-box; }
    .cal-root { font-family: 'DM Sans', sans-serif; }
    .cal-day-cell { transition: all 0.18s cubic-bezier(0.4,0,0.2,1); }
    .cal-day-cell:hover { transform: translateZ(6px) scale(1.03); }
    .ev-chip { transition: all 0.15s; }
    .ev-chip:hover { filter: brightness(1.15); transform: scale(1.02); }
    .cal-input:focus { border-color: rgba(99,102,241,0.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
    @keyframes modalIn { from { opacity:0; transform:scale(0.94) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
    .modal-card { animation: modalIn 0.25s cubic-bezier(0.4,0,0.2,1) forwards; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    .fade-up { animation: fadeUp 0.3s ease both; }
  `;

  return (
    <>
      <style>{CSS}</style>

      <div className="cal-root min-h-screen p-4 sm:p-5 transition-colors duration-300"
        style={{ background: bg, color: textPrimary }}>

        {/* ══════════════════════════════════════════
            TOP BAR
        ══════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ fontFamily: "Syne, sans-serif", color: textPrimary }}>
              Calendar
            </h1>
            <p className="text-sm mt-0.5" style={{ color: textMuted }}>
              {monthEvents.length} events in {MONTHS[month]} {year}
            </p>
          </div>

          {/* Controls row */}
          <div className="flex flex-wrap items-center gap-2">

            {/* Category filter pills */}
            <div className="flex gap-1.5 overflow-x-auto">
              {["all", ...Object.keys(CATEGORY)].map((cat) => {
                const cfg    = CATEGORY[cat];
                const active = catFilter === cat;
                return (
                  <button key={cat} onClick={() => setCatFilter(cat)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold
                      transition-all duration-200 border"
                    style={{
                      background:  active ? (cfg?.bg  ?? "rgba(99,102,241,0.15)") : "transparent",
                      borderColor: active ? (cfg?.border ?? "rgba(99,102,241,0.35)") : borderCol,
                      color:       active ? (cfg?.color  ?? "#818cf8") : textMuted,
                    }}>
                    {cat === "all" ? "All" : cat}
                  </button>
                );
              })}
            </div>

            {/* View mode toggle */}
            <div className="flex rounded-xl p-1 border"
              style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", borderColor: borderCol }}>
              {[
                { key: "month",  label: "Month"  },
                { key: "week",   label: "Week"   },
                { key: "agenda", label: "Agenda" },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setViewMode(key)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{
                    background: viewMode === key ? "linear-gradient(135deg,#6366f1,#06b6d4)" : "transparent",
                    color:      viewMode === key ? "#fff" : textMuted,
                    boxShadow:  viewMode === key ? "0 2px 10px rgba(99,102,241,0.4)" : "none",
                  }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Add event button */}
            <button onClick={() => openNew()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                text-white transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                boxShadow:  "0 4px 20px rgba(99,102,241,0.35)",
              }}>
              <Plus size={15} /> Add Event
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            MONTH NAV
        ══════════════════════════════════════════ */}
        <div className="flex items-center gap-4 mb-4">
          <button onClick={prevMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-200"
            style={{ borderColor: borderCol, color: textMuted, background: "transparent" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.color = "#818cf8"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = borderCol; e.currentTarget.style.color = textMuted; }}>
            <ChevronLeft size={16} />
          </button>

          <h2 className="text-xl font-bold min-w-[200px] text-center"
            style={{ fontFamily: "Syne, sans-serif", color: textPrimary }}>
            {MONTHS[month]} {year}
          </h2>

          <button onClick={nextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-200"
            style={{ borderColor: borderCol, color: textMuted, background: "transparent" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.color = "#818cf8"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = borderCol; e.currentTarget.style.color = textMuted; }}>
            <ChevronRight size={16} />
          </button>

          <button onClick={goToday}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200"
            style={{ borderColor: "rgba(99,102,241,0.3)", color: "#818cf8", background: "rgba(99,102,241,0.08)" }}>
            Today
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">

          {/* ════════════════════════════════════════
              LEFT — CALENDAR GRID / WEEK / AGENDA
          ════════════════════════════════════════ */}
          <div className="flex-1 min-w-0">

            {/* ── MONTH VIEW ── */}
            {viewMode === "month" && (
              <div ref={calRef} onMouseMove={handleMouseMove}
                className="rounded-2xl border overflow-hidden"
                style={{
                  background:           cardBg,
                  borderColor:          borderCol,
                  backdropFilter:       "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: darkMode
                    ? "0 8px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(99,102,241,0.08)"
                    : "0 4px 30px rgba(0,0,0,0.1)",
                  ...tilt3D,
                }}>

                {/* Day headers */}
                <div className="grid grid-cols-7 border-b"
                  style={{ borderColor: borderCol, background: headerBg }}>
                  {DAYS.map((d) => (
                    <div key={d} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: textMuted }}>{d}</div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7"
                  style={{ transformStyle: "preserve-3d" }}>
                  {Array.from({ length: totalCells }, (_, i) => {
                    const dayNum  = i - firstDay + 1;
                    const isValid = dayNum >= 1 && dayNum <= daysInMonth;
                    const dateStr = isValid ? toDateStr(year, month, dayNum) : null;
                    const dayEvs  = dateStr ? (eventsByDate[dateStr] || []) : [];
                    const isToday = dateStr === todayStr;
                    const isSel   = dateStr === selectedDate;
                    const isHov   = hoveredDay === dateStr;

                    return (
                      <div key={i}
                        onClick={() => isValid && setSelectedDate(dateStr)}
                        onMouseEnter={() => isValid && setHoveredDay(dateStr)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`cal-day-cell border-b border-r min-h-[80px] p-1.5 cursor-pointer
                          transition-all duration-150`}
                        style={{
                          borderColor: borderCol,
                          background: isSel
                            ? "rgba(99,102,241,0.12)"
                            : isHov
                              ? darkMode ? "rgba(255,255,255,0.04)" : "rgba(99,102,241,0.04)"
                              : "transparent",
                        }}>

                        {isValid && (
                          <>
                            {/* Date number */}
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center
                              text-xs font-bold mb-1 mx-auto`}
                              style={{
                                background: isToday ? todayAccent : isSel ? "rgba(99,102,241,0.2)" : "transparent",
                                color:      isToday ? "#fff"       : isSel ? "#818cf8"             : textMuted,
                                boxShadow:  isToday ? "0 2px 10px rgba(99,102,241,0.5)" : "none",
                              }}>
                              {dayNum}
                            </div>

                            {/* Event chips — max 2 shown, +N for overflow */}
                            <div className="space-y-0.5">
                              {dayEvs.slice(0, 2).map((ev) => {
                                const cfg = CATEGORY[ev.category];
                                return (
                                  <div key={ev.id}
                                    onClick={(e) => { e.stopPropagation(); openEdit(ev); }}
                                    className="ev-chip px-1.5 py-0.5 rounded-md text-[9px] font-semibold
                                      truncate cursor-pointer"
                                    style={{ background: cfg?.bg, color: cfg?.color, border: `1px solid ${cfg?.border}` }}>
                                    {ev.title}
                                  </div>
                                );
                              })}
                              {dayEvs.length > 2 && (
                                <div className="text-[9px] font-bold px-1.5"
                                  style={{ color: textMuted }}>
                                  +{dayEvs.length - 2} more
                                </div>
                              )}
                            </div>

                            {/* Quick add on hover */}
                            {isHov && dayEvs.length === 0 && (
                              <div onClick={(e) => { e.stopPropagation(); openNew(dateStr); }}
                                className="absolute inset-x-1 bottom-1 flex items-center justify-center
                                  opacity-0 group-hover:opacity-100"
                                style={{ opacity: 0.5 }}>
                                <Plus size={10} style={{ color: textMuted }} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── WEEK VIEW ── */}
            {viewMode === "week" && (
              <div className="rounded-2xl border overflow-hidden"
                style={{
                  background:           cardBg,
                  borderColor:          borderCol,
                  backdropFilter:       "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: darkMode ? "0 8px 50px rgba(0,0,0,0.4)" : "0 4px 30px rgba(0,0,0,0.1)",
                }}>

                {/* Week header row */}
                <div className="grid grid-cols-7 border-b"
                  style={{ borderColor: borderCol, background: headerBg }}>
                  {weekDays.map((ds) => {
                    const d    = new Date(ds + "T00:00:00");
                    const isT  = ds === todayStr;
                    const isS  = ds === selectedDate;
                    return (
                      <div key={ds} onClick={() => setSelectedDate(ds)}
                        className="py-4 text-center cursor-pointer transition-colors duration-150"
                        style={{ background: isS ? "rgba(99,102,241,0.1)" : "transparent" }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1"
                          style={{ color: textMuted }}>
                          {DAYS[d.getDay()]}
                        </p>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto text-sm font-bold"
                          style={{
                            background: isT ? todayAccent : "transparent",
                            color:      isT ? "#fff"       : textPrimary,
                            boxShadow:  isT ? "0 2px 10px rgba(99,102,241,0.5)" : "none",
                          }}>
                          {d.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Week event rows */}
                <div className="grid grid-cols-7 min-h-[240px]">
                  {weekDays.map((ds) => {
                    const dayEvs = eventsByDate[ds] || [];
                    const isS    = ds === selectedDate;
                    return (
                      <div key={ds} onClick={() => setSelectedDate(ds)}
                        className="border-r p-2 cursor-pointer min-h-[240px]"
                        style={{
                          borderColor: borderCol,
                          background: isS ? "rgba(99,102,241,0.06)" : "transparent",
                        }}>
                        <div className="space-y-1">
                          {dayEvs.map((ev) => {
                            const cfg = CATEGORY[ev.category];
                            return (
                              <div key={ev.id}
                                onClick={(e) => { e.stopPropagation(); openEdit(ev); }}
                                className="ev-chip px-2 py-1.5 rounded-lg text-[10px] font-semibold
                                  leading-snug cursor-pointer"
                                style={{ background: cfg?.bg, color: cfg?.color, border: `1px solid ${cfg?.border}` }}>
                                <p className="truncate">{ev.title}</p>
                                <p className="opacity-70 mt-0.5">{ev.time}</p>
                              </div>
                            );
                          })}
                          {dayEvs.length === 0 && (
                            <button onClick={(e) => { e.stopPropagation(); openNew(ds); }}
                              className="w-full py-2 rounded-lg text-[10px] font-semibold border border-dashed
                                transition-opacity duration-200 opacity-0 hover:opacity-100"
                              style={{ borderColor: borderCol, color: textMuted }}>
                              + Add
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── AGENDA VIEW ── */}
            {viewMode === "agenda" && (
              <div className="rounded-2xl border overflow-hidden"
                style={{
                  background:           cardBg,
                  borderColor:          borderCol,
                  backdropFilter:       "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: darkMode ? "0 8px 50px rgba(0,0,0,0.4)" : "0 4px 30px rgba(0,0,0,0.1)",
                }}>

                <div className="px-5 py-4 border-b flex items-center justify-between"
                  style={{ borderColor: borderCol, background: headerBg }}>
                  <h3 className="font-bold text-sm" style={{ color: textPrimary }}>
                    Next 30 days
                  </h3>
                  <span className="text-xs" style={{ color: textMuted }}>
                    {agendaItems.length} upcoming events
                  </span>
                </div>

                <div className="divide-y max-h-[520px] overflow-y-auto" style={{ borderColor: borderCol }}>
                  {agendaItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <Calendar size={24} style={{ color: "#818cf8" }} />
                      <p className="text-sm" style={{ color: textMuted }}>No upcoming events</p>
                    </div>
                  )}
                  {agendaItems.map((ev, i) => {
                    const cfg  = CATEGORY[ev.category];
                    const CatI = cfg?.Icon ?? Calendar;
                    return (
                      <div key={ev.id}
                        onClick={() => { setSelectedDate(ev.date); openEdit(ev); }}
                        className="flex items-center gap-4 px-5 py-3.5 cursor-pointer
                          transition-colors duration-150 fade-up"
                        style={{
                          animationDelay: `${i * 0.04}s`,
                          borderColor: borderCol,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = darkMode ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                        {/* Date block */}
                        <div className="w-12 flex-shrink-0 text-center">
                          <p className="text-[10px] font-bold uppercase tracking-widest"
                            style={{ color: textMuted }}>
                            {new Date(ev.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                          </p>
                          <p className="text-2xl font-bold leading-tight"
                            style={{ color: ev.date === todayStr ? todayAccent : textPrimary }}>
                            {new Date(ev.date + "T00:00:00").getDate()}
                          </p>
                        </div>

                        {/* Color line */}
                        <div className="w-0.5 h-10 rounded-full flex-shrink-0"
                          style={{ background: cfg?.color }} />

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: textPrimary }}>
                            {ev.title}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5 text-[10px]"
                            style={{ color: textMuted }}>
                            <span className="flex items-center gap-1"><Clock size={9} /> {ev.time}</span>
                            {ev.client && <span className="flex items-center gap-1"><Building2 Size={9} /> {ev.client}</span>}
                          </div>
                        </div>

                        <Badge label={ev.category} cfg={cfg} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════
              RIGHT PANEL — Selected day events
          ════════════════════════════════════════ */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="rounded-2xl border overflow-hidden sticky top-4"
              style={{
                background:           cardBg,
                borderColor:          borderCol,
                backdropFilter:       "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: darkMode ? "0 8px 40px rgba(0,0,0,0.35)" : "0 4px 20px rgba(0,0,0,0.08)",
              }}>

              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b"
                style={{ borderColor: borderCol, background: headerBg }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: textMuted }}>Selected</p>
                  <p className="font-bold text-sm" style={{ color: textPrimary }}>
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US",
                      { weekday: "long", month: "short", day: "numeric" })}
                  </p>
                </div>
                <button onClick={() => openNew(selectedDate)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center
                    transition-all duration-200 hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                    boxShadow:  "0 2px 10px rgba(99,102,241,0.4)",
                  }}>
                  <Plus size={13} color="#fff" />
                </button>
              </div>

              {/* Events for selected day */}
              <div className="p-3 space-y-2 max-h-[420px] overflow-y-auto">
                {selectedEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                      <Calendar size={18} style={{ color: "#818cf8" }} />
                    </div>
                    <p className="text-xs text-center" style={{ color: textMuted }}>
                      No events today.<br />
                      <span className="text-indigo-400 cursor-pointer font-semibold"
                        onClick={() => openNew(selectedDate)}>+ Add one</span>
                    </p>
                  </div>
                ) : (
                  selectedEvents.map((ev) => {
                    const cfg  = CATEGORY[ev.category];
                    const CatI = cfg?.Icon ?? Calendar;
                    return (
                      <div key={ev.id} onClick={() => openEdit(ev)}
                        className="rounded-xl border p-3 cursor-pointer transition-all duration-200
                          hover:scale-[1.02]"
                        style={{ background: cfg?.bg, borderColor: cfg?.border }}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <CatI size={13} style={{ color: cfg?.color, flexShrink: 0, marginTop: 2 }} />
                            <p className="font-semibold text-xs leading-snug"
                              style={{ color: textPrimary }}>{ev.title}</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); deleteEvent(ev.id); }}
                            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0
                              transition-colors duration-150 hover:bg-red-500/20"
                            style={{ color: textMuted }}>
                            <X size={10} />
                          </button>
                        </div>

                        <div className="mt-2 space-y-1">
                          <p className="flex items-center gap-1.5 text-[10px]" style={{ color: cfg?.color }}>
                            <Clock size={9} /> {ev.time}
                          </p>
                          {ev.client && (
                            <p className="flex items-center gap-1.5 text-[10px]" style={{ color: textMuted }}>
                              <Briefcase size={9} /> {ev.client}
                            </p>
                          )}
                          {ev.project && (
                            <p className="flex items-center gap-1.5 text-[10px]" style={{ color: textMuted }}>
                              <Target size={9} /> {ev.project}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Mini category legend */}
              <div className="px-4 py-3 border-t"
                style={{ borderColor: borderCol, background: darkMode ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.02)" }}>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: textMuted }}>
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(CATEGORY).map(([cat, cfg]) => (
                    <div key={cat} className="flex items-center gap-1.5 text-[10px]" style={{ color: textMuted }}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            MODAL — Add / Edit Event
        ══════════════════════════════════════════ */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>

            <div className="modal-card w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
              style={{
                background:     darkMode ? "rgba(13,16,30,0.97)" : "rgba(255,255,255,0.97)",
                borderColor:    editEvent ? (CATEGORY[form.category]?.border ?? borderCol) : "rgba(99,102,241,0.3)",
                backdropFilter: "blur(40px)",
                boxShadow:      "0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.12)",
              }}>

              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor: borderCol }}>
                <div>
                  <h2 className="font-bold text-lg" style={{ fontFamily: "Syne, sans-serif", color: textPrimary }}>
                    {editEvent ? "Edit Event" : "New Event"}
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: textMuted }}>
                    {editEvent ? `Editing · ${editEvent.id}` : "Fill in the event details"}
                  </p>
                </div>
                <button onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${borderCol}`, color: textMuted }}>
                  <X size={14} />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-4 space-y-4 max-h-[65vh] overflow-y-auto">

                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: textMuted }}>Title *</label>
                  <input className="cal-input" style={inputStyle}
                    placeholder="e.g. Client Meeting"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                      style={{ color: textMuted }}>Date *</label>
                    <input type="date" className="cal-input" style={inputStyle}
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                      style={{ color: textMuted }}>Time</label>
                    <input type="time" className="cal-input" style={inputStyle}
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: textMuted }}>Category</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(CATEGORY).map((cat) => {
                      const cfg    = CATEGORY[cat];
                      const active = form.category === cat;
                      return (
                        <button key={cat} type="button"
                          onClick={() => setForm({ ...form, category: cat })}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200"
                          style={{
                            background:  active ? cfg.bg       : "transparent",
                            borderColor: active ? cfg.border   : borderCol,
                            color:       active ? cfg.color    : textMuted,
                          }}>
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: textMuted }}>Description</label>
                  <textarea className="cal-input" style={{ ...inputStyle, resize: "vertical", minHeight: 70 }}
                    placeholder="Optional notes..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>

                {/* Client + Project */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                      style={{ color: textMuted }}>Client</label>
                    <input className="cal-input" style={inputStyle}
                      placeholder="Client name"
                      value={form.client}
                      onChange={(e) => setForm({ ...form, client: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                      style={{ color: textMuted }}>Project</label>
                    <input className="cal-input" style={inputStyle}
                      placeholder="Project name"
                      value={form.project}
                      onChange={(e) => setForm({ ...form, project: e.target.value })} />
                  </div>
                </div>

                {/* Owner */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: textMuted }}>Owner</label>
                  <input className="cal-input" style={inputStyle}
                    placeholder="Your name"
                    value={form.owner}
                    onChange={(e) => setForm({ ...form, owner: e.target.value })} />
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t gap-3"
                style={{ borderColor: borderCol }}>
                <div className="flex gap-2">
                  {editEvent && (
                    <button onClick={() => { deleteEvent(editEvent.id); setShowModal(false); }}
                      className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200"
                      style={{ background: "rgba(248,113,113,0.1)", borderColor: "rgba(248,113,113,0.25)", color: "#f87171" }}>
                      Delete
                    </button>
                  )}
                  <button onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200"
                    style={{ background: "transparent", borderColor: borderCol, color: textMuted }}>
                    Cancel
                  </button>
                </div>
                <button onClick={saveEvent}
                  disabled={!form.title.trim() || !form.date}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                    transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]
                    disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                    boxShadow:  "0 4px 16px rgba(99,102,241,0.4)",
                  }}>
                  {editEvent ? "Save changes" : "Create event"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
