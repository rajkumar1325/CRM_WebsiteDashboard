import { useState, useEffect } from "react";

// ⚠️ ADJUST THIS IMPORT PATH TO MATCH YOUR PROJECT STRUCTURE
import { tasksData } from "../../MockData/MockData"; 

// ─────────────────────────────────────────────────────────────────────────────
// TYPE CONFIG (Premium neon-pastel palette for dark mode)
// ─────────────────────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  "follow-up": { label: "Follow-up", dark: { bg: "bg-indigo-500/10 border-indigo-500/20",  text: "text-indigo-400" }, light: { bg: "bg-indigo-100",  text: "text-indigo-700" } },
  "call":      { label: "Call",      dark: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400"}, light: { bg: "bg-emerald-100", text: "text-emerald-700"} },
  "deal":      { label: "Deal",      dark: { bg: "bg-amber-500/10 border-amber-500/20",   text: "text-amber-400"  }, light: { bg: "bg-amber-100",   text: "text-amber-700"  } },
  "email":     { label: "Email",     dark: { bg: "bg-sky-500/10 border-sky-500/20",     text: "text-sky-400"    }, light: { bg: "bg-sky-100",     text: "text-sky-700"    } },
  "support":   { label: "Support",   dark: { bg: "bg-rose-500/10 border-rose-500/20",    text: "text-rose-400"   }, light: { bg: "bg-rose-100",    text: "text-rose-700"   } },
  "report":    { label: "Report",    dark: { bg: "bg-slate-500/10 border-slate-500/20",   text: "text-slate-400"  }, light: { bg: "bg-slate-200",   text: "text-slate-600"  } },
};

const PRIORITY_COLORS = { 
  high:   { dot: "bg-rose-500",    bar: "w-full bg-rose-500",     text: "text-rose-400" }, 
  medium: { dot: "bg-amber-400",   bar: "w-2/3 bg-amber-400",     text: "text-amber-400" }, 
  low:    { dot: "bg-blue-400",    bar: "w-1/3 bg-blue-400",      text: "text-blue-400" } 
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES & HELPER COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function isOverdue(iso, done) {
  if (done) return false;
  return new Date(iso) < new Date(new Date().toDateString());
}

const PremiumCard = ({ children, className = "", darkMode = true, onClick }) => (
  <div
    onClick={onClick}
    className={`
      rounded-2xl border backdrop-blur-xl transition-all duration-300
      ${darkMode 
        ? "bg-[#151921]/80 border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.1)] hover:border-white/[0.15] hover:bg-[#1A1F29]/90 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-0.5" 
        : "bg-white border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300"}
      ${className}
    `}
  >
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// TASK CARD
// ─────────────────────────────────────────────────────────────────────────────
function TaskCard({ task, activeTheme, onToggle, onDelete }) {
  const cfg     = TYPE_CONFIG[task.type] ?? TYPE_CONFIG.report;
  const badge   = activeTheme ? cfg.dark : cfg.light;               
  const overdue = isOverdue(task.due, task.done);
  const prio    = PRIORITY_COLORS[task.priority];

  const titleCls  = activeTheme ? "text-white" : "text-slate-800";
  const descCls   = activeTheme ? "text-slate-400" : "text-slate-500";
  const metaCls   = activeTheme ? "text-slate-400" : "text-slate-500";
  
  const checkBg = task.done 
    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
    : (activeTheme ? "bg-white/5 border-white/20 hover:border-blue-400 text-transparent hover:text-blue-400/30" : "bg-slate-50 border-slate-300 hover:border-blue-500 text-transparent");

  return (
    <PremiumCard darkMode={activeTheme} className={`group relative p-5 flex flex-col h-full ${task.done ? "opacity-60" : ""}`}>
      
      <div className="flex items-start gap-3 mb-3">
        <button onClick={(e) => { e.stopPropagation(); onToggle(task.id); }} className={`mt-0.5 w-6 h-6 rounded-full border-[1.5px] shrink-0 flex items-center justify-center transition-all duration-300 ${checkBg}`}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={task.done ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"}>
            <polyline points="2.5 7.5 5.5 10.5 11.5 3.5"></polyline>
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-[15px] truncate ${task.done ? "line-through opacity-70" : ""} ${titleCls}`}>
            {task.title}
          </h3>
        </div>
        <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${badge.bg} ${badge.text}`}>
          {cfg.label}
        </span>
      </div>

      <p className={`text-[13px] leading-relaxed line-clamp-2 mb-4 flex-1 ${descCls}`}>
        {task.desc || "No additional details provided."}
      </p>

      <div className={`py-3 border-t border-b ${activeTheme ? "border-white/5" : "border-slate-100"} mb-4`}>
        {task.lead ? (
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${activeTheme ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {task.lead.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-semibold truncate ${activeTheme ? "text-white/90" : "text-slate-700"}`}>{task.lead}</p>
              <p className={`text-[10px] truncate ${metaCls}`}>{task.company}</p>
            </div>
          </div>
        ) : (
          <p className={`text-xs italic ${metaCls}`}>Internal Task</p>
        )}
      </div>

      <div className="flex items-end justify-between mt-auto">
        <div className="w-1/2">
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${activeTheme ? "text-slate-500" : "text-slate-400"}`}>Priority</p>
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${activeTheme ? "bg-white/5" : "bg-slate-100"}`}>
            <div className={`h-full rounded-full transition-all duration-500 ${prio.bar}`} />
          </div>
        </div>
        
        <div className="text-right">
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${activeTheme ? "text-slate-500" : "text-slate-400"}`}>Due Date</p>
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${overdue ? "text-rose-400" : (activeTheme ? "text-white/80" : "text-slate-700")}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${overdue ? "bg-rose-500 animate-pulse" : (activeTheme ? "bg-blue-400" : "bg-blue-500")}`} />
            {fmtDate(task.due)}
          </div>
        </div>
      </div>

      <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg translate-y-1 group-hover:translate-y-0 ${activeTheme ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white" : "bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white"}`}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
      </button>

    </PremiumCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD TASK MODAL 
// ─────────────────────────────────────────────────────────────────────────────
function AddTaskModal({ activeTheme, onAdd, onClose }) {
  const [form, setForm] = useState({ title: "", desc: "", type: "follow-up", priority: "medium", due: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function submit() {
    if (!form.title.trim() || !form.due) return;
    onAdd({ ...form, id: Date.now(), lead: null, company: null, done: false });
    onClose();
  }

  const inputCls = activeTheme
    ? "bg-black/20 border-white/10 text-white placeholder-white/20 focus:border-blue-500/50 focus:bg-black/40"
    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white";
  const labelCls = activeTheme ? "text-slate-400" : "text-slate-500";

  const Field = ({ label, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className={`text-[10px] font-bold uppercase tracking-wider ${labelCls}`}>{label}</label>
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <PremiumCard darkMode={activeTheme} className="w-full max-w-lg p-7 shadow-2xl relative">
        <button onClick={onClose} className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeTheme ? 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'}`}>✕</button>
        
        <h2 className={`text-xl font-bold mb-1 ${activeTheme ? "text-white" : "text-slate-800"}`}>Create New Task</h2>
        <p className={`text-xs mb-6 ${activeTheme ? "text-slate-400" : "text-slate-500"}`}>Add a new actionable item to your pipeline.</p>

        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <Field label="Task Title">
              <input className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${inputCls}`} placeholder="e.g. Follow up with client..." value={form.title} onChange={e => set("title", e.target.value)} />
            </Field>
          </div>

          <div className="col-span-2">
            <Field label="Notes & Details">
              <textarea className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none h-24 ${inputCls}`} placeholder="Optional context..." value={form.desc} onChange={e => set("desc", e.target.value)} />
            </Field>
          </div>

          <Field label="Task Type">
            <select className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${inputCls}`} value={form.type} onChange={e => set("type", e.target.value)}>
              {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </Field>

          <Field label="Priority Level">
            <select className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${inputCls}`} value={form.priority} onChange={e => set("priority", e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </Field>

          <div className="col-span-2">
            <Field label="Due Date">
              <input type="date" className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${inputCls}`} value={form.due} onChange={e => set("due", e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={submit} className="flex-1 bg-[#60A5FA] hover:bg-[#3B82F6] text-white text-sm font-bold rounded-xl py-3 transition-colors shadow-lg shadow-blue-500/20">
            Save Task
          </button>
          <button onClick={onClose} className={`px-6 text-sm font-bold rounded-xl transition-colors ${activeTheme ? "bg-white/5 hover:bg-white/10 text-white/80" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}>
            Cancel
          </button>
        </div>
      </PremiumCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function TasksPage({ darkMode, isDark, searchQuery = "" }) {
  const activeTheme = darkMode ?? isDark ?? true; 

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState(searchQuery);

  // ── SIMULATED API CALL ──
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate backend delay
      
      // Fetch from the updated mockDATA file
      setTasks(tasksData);
      setIsLoading(false);
    };

    fetchTasks();
  }, []);

  // ── Derived counts ──
  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  const pending = total - done;
  const overdue = tasks.filter(t => isOverdue(t.due, t.done)).length;

  // ── Filter logic ──
  const visible = tasks.filter(t => {
    if (filter === "pending" && t.done)  return false;
    if (filter === "done"    && !t.done) return false;
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    const q = search.toLowerCase();
    if (q && !t.title.toLowerCase().includes(q) && !(t.lead ?? "").toLowerCase().includes(q)) return false;
    return true;
  });

  // ── Handlers ──
  // Note: Once you have a backend, these will be axios.put/delete/post calls!
  const toggleDone = id => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = id => setTasks(ts => ts.filter(t => t.id !== id));
  const addTask    = t  => setTasks(ts => [t, ...ts]);

  // ── Styles ──
  const textPrimary = activeTheme ? "text-white" : "text-slate-800";
  const textSecondary = activeTheme ? "text-slate-300" : "text-slate-600";
  const textMuted = activeTheme ? "text-slate-500" : "text-slate-400";
  
  const searchCls = activeTheme
    ? "bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50"
    : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400";

  const pill = active => `
    px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap border
    ${active
      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
      : activeTheme
        ? "bg-transparent text-slate-400 border-white/10 hover:bg-white/5 hover:text-white"
        : "bg-transparent text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
    }
  `;

  if (isLoading) {
    return (
      <div className={`w-full min-h-screen flex items-center justify-center ${activeTheme ? "text-white" : "text-slate-800"}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className={textMuted}>Fetching Tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans ${activeTheme ? "text-white" : "text-slate-800"} p-8 bg-transparent`} style={{ fontFamily: "'DM Sans', 'SF Pro Display', system-ui, sans-serif" }}>
      <div className="max-w-7xl mx-auto">
        
        {/* ── Page header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${textPrimary}`}>
              Tasks Dashboard
            </h1>
            <p className={`text-sm mt-1 ${textMuted}`}>
              {pending} pending actions • {overdue} overdue
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-[#60A5FA] hover:bg-[#3B82F6] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
          >
            <span className="text-lg leading-none mb-0.5">+</span> Add Task
          </button>
        </div>

        {/* ── Add task modal ── */}
        {showAdd && (
          <AddTaskModal activeTheme={activeTheme} onAdd={addTask} onClose={() => setShowAdd(false)} />
        )}

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Tasks", value: total,   icon: "layers", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { label: "Pending",     value: pending, icon: "clock",  color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
            { label: "Completed",   value: done,    icon: "check",  color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
            { label: "Overdue",     value: overdue, icon: "alert",  color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
          ].map(s => (
            <PremiumCard key={s.label} darkMode={activeTheme} className="p-4 flex items-center gap-4">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${s.bg} ${s.border} ${s.color}`}>
                 {s.icon === "layers" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>}
                 {s.icon === "clock" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
                 {s.icon === "check" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
                 {s.icon === "alert" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>}
               </div>
               <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>{s.label}</p>
                  <p className={`text-2xl font-bold mt-0.5 ${textPrimary}`}>{s.value}</p>
               </div>
            </PremiumCard>
          ))}
        </div>

        {/* ── Filters Row ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex gap-2 bg-transparent">
            {[["all","All Status"],["pending","Pending"],["done","Completed"]].map(([v,l]) => (
              <button key={v} className={pill(filter === v)} onClick={() => setFilter(v)}>{l}</button>
            ))}
          </div>

          <div className={`hidden md:block h-6 w-px ${activeTheme ? "bg-white/10" : "bg-slate-200"}`} />

          <div className="flex gap-2 flex-wrap bg-transparent overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button className={pill(typeFilter === "all")} onClick={() => setTypeFilter("all")}>All Types</button>
            {Object.entries(TYPE_CONFIG).map(([k,v]) => (
              <button key={k} className={pill(typeFilter === k)} onClick={() => setTypeFilter(k)}>{v.label}</button>
            ))}
          </div>

          <div className="relative md:ml-auto w-full md:w-64">
            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              className={`w-full pl-9 pr-3 py-2 text-sm outline-none transition-colors rounded-xl border ${searchCls}`}
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Task Grid ── */}
        {visible.length === 0 ? (
          <PremiumCard darkMode={activeTheme} className="flex flex-col items-center justify-center py-24 text-center mt-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border ${activeTheme ? "bg-white/5 border-white/10 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
            </div>
            <p className={`text-base font-semibold ${textSecondary}`}>No tasks found</p>
            <p className={`text-sm mt-1 ${textMuted}`}>Try adjusting your filters or create a new task.</p>
          </PremiumCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                activeTheme={activeTheme}
                onToggle={toggleDone}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}