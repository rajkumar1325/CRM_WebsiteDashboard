import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — swap out with real Supabase queries when ready
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_TASKS = [
  {
    id: 1,
    title: "Follow up with Mary Johnson",
    desc: "Send pricing proposal for Q2 deal — she asked for it last call.",
    type: "follow-up",
    priority: "high",
    due: "2025-05-26",
    lead: "Mary Johnson",
    company: "Innovate Inc.",
    done: false,
  },
  {
    id: 2,
    title: "Schedule demo with Michael Davis",
    desc: "Tech Corp. is qualified — book a 30-min product walkthrough.",
    type: "call",
    priority: "medium",
    due: "2025-05-27",
    lead: "Michael Davis",
    company: "Tech Corp.",
    done: false,
  },
  {
    id: 3,
    title: "Review deal: Cloud Migration Service",
    desc: "Negotiation phase — check TechNova's latest counter-offer.",
    type: "deal",
    priority: "high",
    due: "2025-05-25",
    lead: "Lucas Martínez",
    company: "TechNova Ltd.",
    done: false,
  },
  {
    id: 4,
    title: "Send onboarding docs to Laura Green",
    desc: "Converted lead — share welcome kit and access credentials.",
    type: "email",
    priority: "low",
    due: "2025-05-28",
    lead: "Laura Green",
    company: "Data Systems",
    done: true,
  },
  {
    id: 5,
    title: "Resolve billing error ticket",
    desc: "Priya Sharma billing dispute is in-progress — follow up with support.",
    type: "support",
    priority: "medium",
    due: "2025-05-26",
    lead: "Priya Sharma",
    company: "Sharma Designs",
    done: false,
  },
  {
    id: 6,
    title: "Prepare monthly report",
    desc: "Compile lead conversion and revenue data for May review meeting.",
    type: "report",
    priority: "low",
    due: "2025-05-31",
    lead: null,
    company: null,
    done: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TYPE CONFIG — explicit dark + light classes so Tailwind purge keeps both
// ─────────────────────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  "follow-up": {
    label: "Follow-up",
    dark:  { bg: "bg-violet-500/20",  text: "text-violet-300" },
    light: { bg: "bg-violet-100",     text: "text-violet-700" },
  },
  call: {
    label: "Call",
    dark:  { bg: "bg-emerald-500/20", text: "text-emerald-300" },
    light: { bg: "bg-emerald-100",    text: "text-emerald-700" },
  },
  deal: {
    label: "Deal",
    dark:  { bg: "bg-amber-500/20",   text: "text-amber-300"   },
    light: { bg: "bg-amber-100",      text: "text-amber-700"   },
  },
  email: {
    label: "Email",
    dark:  { bg: "bg-sky-500/20",     text: "text-sky-300"     },
    light: { bg: "bg-sky-100",        text: "text-sky-700"     },
  },
  support: {
    label: "Support",
    dark:  { bg: "bg-rose-500/20",    text: "text-rose-300"    },
    light: { bg: "bg-rose-100",       text: "text-rose-700"    },
  },
  report: {
    label: "Report",
    dark:  { bg: "bg-slate-500/20",   text: "text-slate-300"   },
    light: { bg: "bg-slate-200",      text: "text-slate-600"   },
  },
};

// Priority dot color (works on any bg)
const PRIORITY_DOT = { high: "bg-rose-500", medium: "bg-amber-400", low: "bg-slate-400" };

// Avatar background colors keyed by first char
const AVATAR_COLORS = [
  "bg-violet-500", "bg-emerald-500", "bg-sky-500",
  "bg-rose-500",   "bg-amber-500",   "bg-teal-500",
];

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function isOverdue(iso, done) {
  if (done) return false;
  return new Date(iso) < new Date(new Date().toDateString());
}

// ─────────────────────────────────────────────────────────────────────────────
// AVATAR — initials circle, consistent color per name
// ─────────────────────────────────────────────────────────────────────────────
function Avatar({ name, size = "w-6 h-6", textSize = "text-[9px]" }) {
  if (!name) return null;
  const parts    = name.trim().split(" ");
  const initials = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  const color    = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <span className={`${size} ${color} rounded-full flex items-center justify-center font-bold ${textSize} text-white shrink-0 uppercase`}>
      {initials}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TASK CARD — every color class conditional on darkMode prop
// ─────────────────────────────────────────────────────────────────────────────
function TaskCard({ task, darkMode, onToggle, onDelete }) {
  const cfg     = TYPE_CONFIG[task.type] ?? TYPE_CONFIG.report;
  const badge   = darkMode ? cfg.dark : cfg.light;               // badge color scheme
  const overdue = isOverdue(task.due, task.done);

  // Surface color
  const cardBase = darkMode
    ? "bg-white/[0.05] border-white/10 hover:bg-white/[0.09] hover:border-white/20 hover:shadow-black/40"
    : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300";

  const cardDone = darkMode
    ? "bg-white/[0.02] border-white/5 opacity-40"
    : "bg-gray-50 border-gray-100 opacity-50";

  // Text colors
  const titleCls  = darkMode ? "text-white/90" : "text-gray-800";
  const descCls   = darkMode ? "text-white/40"  : "text-gray-400";
  const metaCls   = darkMode ? "text-white/35"  : "text-gray-400";
  const dateCls   = overdue ? "text-rose-500"
                  : darkMode ? "text-white/30" : "text-gray-400";

  // Checkbox ring color when unchecked
  const checkRing = darkMode
    ? "border-white/25 hover:border-white/60"
    : "border-gray-300 hover:border-violet-500";

  // Delete button
  const delBg = darkMode
    ? "bg-white/5 hover:bg-rose-500/20"
    : "bg-gray-100 hover:bg-rose-100";

  const delStroke = darkMode ? "rgba(255,255,255,0.35)" : "#9ca3af";

  return (
    <div className={`
      group relative rounded-2xl border transition-all duration-200 p-4 flex gap-3 backdrop-blur-sm
      ${task.done ? cardDone : cardBase}
    `}>

      {/* ── Checkbox toggle ── */}
      <button
        onClick={() => onToggle(task.id)}
        aria-label="Toggle done"
        className={`
          mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center
          transition-all duration-200
          ${task.done ? "bg-emerald-500 border-emerald-500" : checkRing}
        `}
      >
        {task.done && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* ── Content ── */}
      <div className="flex-1 min-w-0">

        {/* Title + priority dot */}
        <div className="flex items-start justify-between gap-2">
          <p className={`font-semibold text-sm leading-snug ${task.done ? `line-through opacity-40 ${titleCls}` : titleCls}`}>
            {task.title}
          </p>
          <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${PRIORITY_DOT[task.priority]}`} title={`${task.priority} priority`} />
        </div>

        {/* Description */}
        {task.desc && (
          <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${descCls}`}>{task.desc}</p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mt-3">

          {/* Type badge */}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${badge.bg} ${badge.text}`}>
            {cfg.label}
          </span>

          {/* Lead avatar + name */}
          {task.lead && (
            <span className={`flex items-center gap-1.5 text-[11px] ${metaCls}`}>
              <Avatar name={task.lead} />
              {task.lead}
            </span>
          )}

          {/* Due date — pushed right */}
          <span className={`ml-auto text-[11px] font-medium flex items-center gap-1 ${dateCls}`}>
            {/* Calendar icon */}
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="shrink-0">
              <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M1 5h10" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            {overdue ? "Overdue · " : ""}{fmtDate(task.due)}
          </span>
        </div>
      </div>

      {/* ── Delete (hover reveal) ── */}
      <button
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${delBg}`}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2l-8 8" stroke={delStroke} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD TASK PANEL — glass panel, colors tied to darkMode prop
// ─────────────────────────────────────────────────────────────────────────────
function AddTaskPanel({ darkMode, onAdd, onClose }) {
  const [form, setForm] = useState({
    title: "", desc: "", type: "follow-up", priority: "medium", due: "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function submit() {
    if (!form.title.trim() || !form.due) return;
    onAdd({ ...form, id: Date.now(), lead: null, company: null, done: false });
    onClose();
  }

  // Panel surface
  const panelCls = darkMode
    ? "bg-[#0f0f18]/95 border-white/10 shadow-black/60"
    : "bg-white border-gray-200 shadow-gray-200";

  // Input fields
  const inputCls = darkMode
    ? "bg-white/5 border-white/10 text-white/80 placeholder-white/20 focus:border-violet-500/50"
    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-300 focus:border-violet-400";

  const labelCls = darkMode ? "text-white/40"  : "text-gray-400";
  const titleCls = darkMode ? "text-white/80"  : "text-gray-700";
  const cancelCls = darkMode
    ? "text-white/40 hover:text-white/70"
    : "text-gray-400 hover:text-gray-600";

  const input = `w-full border rounded-xl px-3 py-2 text-sm outline-none transition-colors ${inputCls}`;

  const Field = ({ label, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className={`text-[11px] font-bold uppercase tracking-wider ${labelCls}`}>{label}</label>
      {children}
    </div>
  );

  return (
    <div className={`backdrop-blur-xl border rounded-2xl p-5 shadow-2xl ${panelCls}`}>
      <p className={`text-sm font-bold mb-4 ${titleCls}`}>New Task</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Field label="Task title">
            <input className={input} placeholder="e.g. Follow up with client..." value={form.title} onChange={e => set("title", e.target.value)} />
          </Field>
        </div>

        <div className="col-span-2">
          <Field label="Notes">
            <textarea className={`${input} resize-none h-16`} placeholder="Optional context..." value={form.desc} onChange={e => set("desc", e.target.value)} />
          </Field>
        </div>

        <Field label="Type">
          <select className={input} value={form.type} onChange={e => set("type", e.target.value)}>
            {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>

        <Field label="Priority">
          <select className={input} value={form.priority} onChange={e => set("priority", e.target.value)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </Field>

        <div className="col-span-2">
          <Field label="Due date">
            <input type="date" className={input} value={form.due} onChange={e => set("due", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={submit} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl py-2 transition-colors">
          Add Task
        </button>
        <button onClick={onClose} className={`px-4 text-sm transition-colors ${cancelCls}`}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// Receives darkMode prop exactly like your Deals, Customers, etc. pages:
//   <TasksPage darkMode={isDark} searchQuery={query} />
// ─────────────────────────────────────────────────────────────────────────────
export default function TasksPage({ darkMode = true, searchQuery = "" }) {
  const [tasks,      setTasks]      = useState(INITIAL_TASKS);
  const [filter,     setFilter]     = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAdd,    setShowAdd]    = useState(false);
  const [search,     setSearch]     = useState(searchQuery);

  // ── Derived counts ────────────────────────────────────────────────────────
  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  const pending = total - done;
  const overdue = tasks.filter(t => isOverdue(t.due, t.done)).length;

  // ── Filter logic ──────────────────────────────────────────────────────────
  const visible = tasks.filter(t => {
    if (filter === "pending" && t.done)  return false;
    if (filter === "done"    && !t.done) return false;
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    const q = search.toLowerCase();
    if (q && !t.title.toLowerCase().includes(q) && !(t.lead ?? "").toLowerCase().includes(q)) return false;
    return true;
  });

  // ── Mutation handlers ─────────────────────────────────────────────────────
  const toggleDone = id => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = id => setTasks(ts => ts.filter(t => t.id !== id));
  const addTask    = t  => setTasks(ts => [t, ...ts]);

  // ── Page-level theme tokens ───────────────────────────────────────────────
  const pageBg      = darkMode ? "bg-[#0b0b10]"  : "bg-gray-50";
  const headingCls  = darkMode ? "text-white/90"  : "text-gray-800";
  const subCls      = darkMode ? "text-white/35"  : "text-gray-400";
  const statCardCls = darkMode ? "bg-white/[0.04] border-white/8"   : "bg-white border-gray-200";
  const searchCls   = darkMode
    ? "bg-white/5 border-white/10 text-white/80 placeholder-white/20 focus:border-violet-500/40"
    : "bg-white border-gray-200 text-gray-800 placeholder-gray-300 focus:border-violet-400";
  const searchIconCls = darkMode ? "text-white/25"  : "text-gray-300";
  const footerCls   = darkMode ? "text-white/20"  : "text-gray-300";
  const emptyIconCls = darkMode ? "bg-white/5" : "bg-gray-100";
  const emptyTextCls = darkMode ? "text-white/30" : "text-gray-300";

  // Filter pill factory — active = violet, inactive = mode-aware subtle
  const pill = active => `
    px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap
    ${active
      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
      : darkMode
        ? "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70"
        : "bg-white text-gray-400 border border-gray-200 hover:bg-gray-100 hover:text-gray-600"
    }
  `;

  return (
    <div className={`min-h-screen ${pageBg} px-6 py-8 font-sans transition-colors duration-300`}>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${headingCls}`}>Tasks & Activities</h1>
          <p className={`text-sm mt-1 ${subCls}`}>Stay on top of your pipeline actions</p>
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-violet-500/20"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Task
        </button>
      </div>

      {/* ── Add task panel ── */}
      {showAdd && (
        <div className="mb-6">
          <AddTaskPanel darkMode={darkMode} onAdd={addTask} onClose={() => setShowAdd(false)} />
        </div>
      )}

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total",   value: total,   color: darkMode ? "text-white/80" : "text-gray-700" },
          { label: "Pending", value: pending, color: "text-amber-500"   },
          { label: "Done",    value: done,    color: "text-emerald-500" },
          { label: "Overdue", value: overdue, color: "text-rose-500"    },
        ].map(s => (
          <div key={s.label} className={`border rounded-2xl px-4 py-3 backdrop-blur-sm ${statCardCls}`}>
            <p className={`text-[11px] font-bold uppercase tracking-widest ${subCls}`}>{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search + filters ── */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className={`absolute left-3 top-1/2 -translate-y-1/2 ${searchIconCls}`} width="13" height="13" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            className={`w-full border rounded-xl pl-8 pr-3 py-2 text-sm outline-none transition-colors ${searchCls}`}
            placeholder="Search tasks or leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Status pills */}
        <div className="flex gap-2">
          {[["all","All"],["pending","Pending"],["done","Done"]].map(([v,l]) => (
            <button key={v} className={pill(filter === v)} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>

        {/* Type pills */}
        <div className="flex gap-2 flex-wrap">
          <button className={pill(typeFilter === "all")} onClick={() => setTypeFilter("all")}>All types</button>
          {Object.entries(TYPE_CONFIG).map(([k,v]) => (
            <button key={k} className={pill(typeFilter === k)} onClick={() => setTypeFilter(k)}>{v.label}</button>
          ))}
        </div>
      </div>

      {/* ── Task list ── */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${emptyIconCls}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke={darkMode ? "rgba(255,255,255,0.2)" : "#d1d5db"} strokeWidth="1.5"/>
              <path d="M8 12h8M8 8h5M8 16h3" stroke={darkMode ? "rgba(255,255,255,0.2)" : "#d1d5db"} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className={`text-sm ${emptyTextCls}`}>No tasks match your filters</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              darkMode={darkMode}
              onToggle={toggleDone}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}

      {/* ── Footer count ── */}
      {visible.length > 0 && (
        <p className={`text-center text-[11px] mt-6 ${footerCls}`}>
          {visible.length} task{visible.length !== 1 ? "s" : ""} shown
        </p>
      )}
    </div>
  );
}
