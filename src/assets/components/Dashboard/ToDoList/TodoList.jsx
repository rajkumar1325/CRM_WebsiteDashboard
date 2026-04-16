import { useState, useRef } from "react";
import TodoIcon from "./task-list.svg?react";

// ─── Priority config ──────────────────────────────────────────────────────────
const PRIORITY = {
  high:   { color: "#f87171", bg: "rgba(248,113,113,0.13)", border: "rgba(248,113,113,0.28)", label: "High"   },
  medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.13)",  border: "rgba(251,191,36,0.28)",  label: "Med"    },
  low:    { color: "#34d399", bg: "rgba(52,211,153,0.13)",  border: "rgba(52,211,153,0.28)",  label: "Low"    },
};

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = ["All", "CRM", "Follow-up", "Admin", "Personal"];

// ─── Initial tasks ────────────────────────────────────────────────────────────
const INITIAL_TASKS = [
  { id: 1, text: "Follow up with John Doe",       done: true,  priority: "high",   category: "Follow-up", createdAt: Date.now() - 86400000 },
  { id: 2, text: "Send contract to Acme Inc",     done: false, priority: "high",   category: "CRM",       createdAt: Date.now() - 72000000 },
  { id: 3, text: "Call Jane Smith",               done: true,  priority: "medium", category: "Follow-up", createdAt: Date.now() - 50000000 },
  { id: 4, text: "Prepare proposal for XYZ Corp", done: false, priority: "high",   category: "CRM",       createdAt: Date.now() - 36000000 },
  { id: 5, text: "Schedule product demo",         done: false, priority: "low",    category: "Admin",     createdAt: Date.now() - 10000000 },
];

// ─── Single Task Row ──────────────────────────────────────────────────────────
/**
 * Each task row shows:
 * - Custom animated checkbox
 * - Task text (strikethrough when done)
 * - Priority badge + category chip
 * - Delete button (revealed on hover)
 */
function TaskRow({ task, darkMode, onToggle, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const pri = PRIORITY[task.priority] || PRIORITY.low;

  return (
    <div
      className={`task-row ${darkMode ? "task-row-dark" : "task-row-light"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ opacity: task.done ? 0.55 : 1, transition: "opacity 0.2s" }}
    >
      {/* ── Custom animated checkbox ── */}
      <div
        className={`task-checkbox ${task.done ? "cb-checked" : (darkMode ? "cb-unchecked-dark" : "cb-unchecked-light")}`}
        onClick={() => onToggle(task.id)}
        role="checkbox"
        aria-checked={task.done}
        tabIndex={0}
        onKeyDown={(e) => e.key === " " && onToggle(task.id)}
      >
        {task.done && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* ── Text + meta ── */}
      <div className="task-body" onClick={() => onToggle(task.id)} style={{ cursor: "pointer" }}>
        <p className={`task-text ${task.done ? "task-done" : ""} ${darkMode ? "task-text-dark" : "task-text-light"}`}>
          {task.text}
        </p>

        {/* Priority badge + Category chip */}
        <div className="task-meta">
          <span
            className="task-priority-badge"
            style={{ background: pri.bg, color: pri.color, border: `1px solid ${pri.border}` }}
          >
            {pri.label}
          </span>
          <span className={`task-category ${darkMode ? "cat-dark" : "cat-light"}`}>
            {task.category}
          </span>
        </div>
      </div>

      {/* ── Delete button — visible on hover ── */}
      <button
        className={`task-delete ${hovered ? "delete-visible" : "delete-hidden"}`}
        onClick={() => onDelete(task.id)}
        title="Delete task"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TodoList({ darkMode = false }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const [tasks,      setTasks]      = useState(INITIAL_TASKS);
  const [history,    setHistory]    = useState([]);
  const [showModal,  setShowModal]  = useState(false);
  const [activeTab,  setActiveTab]  = useState("All");     // category filter
  const [showDone,   setShowDone]   = useState(true);      // toggle completed visibility

  // ── Add task form state ──
  const [newText,     setNewText]     = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newCategory, setNewCategory] = useState("CRM");

  // ── 3D tilt ──
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.transform = `perspective(900px) rotateX(${((y / rect.height) - 0.5) * -5}deg) rotateY(${((x / rect.width) - 0.5) * 5}deg)`;
    glow.style.left = `${x}px`;
    glow.style.top  = `${y}px`;
    glow.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  // ── Task actions ──
  const toggleTask = (id) =>
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));

  const deleteTask = (id) => {
    setTasks((prev) => {
      const deleted = prev.find((t) => t.id === id);
      if (deleted) setHistory((h) => [{ ...deleted, deletedAt: Date.now() }, ...h]);
      return prev.filter((t) => t.id !== id);
    });
  };

  const addTask = () => {
    if (!newText.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text: newText.trim(), done: false, priority: newPriority, category: newCategory, createdAt: Date.now() },
    ]);
    setNewText("");
    setNewPriority("medium");
    setNewCategory("CRM");
    setShowModal(false);
  };

  // ── Restore a deleted task from history ──
  const restoreTask = (id) => {
    const task = history.find((h) => h.id === id);
    if (!task) return;
    const { deletedAt, ...restored } = task;
    setTasks((prev) => [...prev, { ...restored, done: false }]);
    setHistory((h) => h.filter((t) => t.id !== id));
  };

  // ── Filter tasks by category + done visibility ──
  const filtered = tasks
    .filter((t) => activeTab === "All" || t.category === activeTab)
    .filter((t) => showDone || !t.done)
    .sort((a, b) => {
      // Sort: undone → done, then by priority
      if (a.done !== b.done) return a.done ? 1 : -1;
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });

  // ── Stats for header ──
  const doneCount   = tasks.filter((t) => t.done).length;
  const totalCount  = tasks.length;
  const pct         = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <>
      <style>{`

        /* ── GLASS CARD ── */
        .todo-card {
          position: relative; overflow: hidden; border-radius: 22px;
          padding: 22px 20px 20px; width: 100%;
          animation: todoEntrance 0.65s cubic-bezier(0.34,1.4,0.64,1) both;
          will-change: transform; transform-style: preserve-3d;
          transition: box-shadow 0.3s ease;
        }
        .todo-dark {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.11);
          backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .todo-light {
          background: rgba(255,255,255,0.68); border: 1px solid rgba(255,255,255,0.92);
          backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(100,100,150,0.1), inset 0 1px 0 rgba(255,255,255,1);
        }
        .todo-dark:hover  { box-shadow: 0 24px 60px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.2); }
        .todo-light:hover { box-shadow: 0 24px 60px rgba(100,100,150,0.18), inset 0 1px 0 rgba(255,255,255,1); }

        /* Glow + shimmer */
        .todo-glow {
          position: absolute; width: 240px; height: 240px; border-radius: 50%; pointer-events: none;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(192,132,252,0.13) 0%, transparent 70%);
          transition: opacity 0.3s ease, left 0.05s, top 0.05s; z-index: 0;
        }
        .todo-shimmer {
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, transparent 55%); z-index: 0;
        }

        /* ── HEADER ── */
        .todo-header {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
        }
        .todo-title-dark  { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.92); margin: 0; }
        .todo-title-light { font-size: 15px; font-weight: 600; color: #1a1a2e; margin: 0; }

        /* Add task button */
        .todo-add-btn {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 20px;
          border: 1px solid rgba(192,132,252,0.35); background: rgba(192,132,252,0.12);
          color: #c084fc; cursor: pointer; transition: background 0.2s;
        }
        .todo-add-btn:hover { background: rgba(192,132,252,0.22); }

        /* ── PROGRESS BAR ── */
        .todo-progress {
          position: relative; z-index: 1; margin-bottom: 14px;
        }
        .progress-top {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;
        }
        .progress-label-dark  { font-size: 11px; color: rgba(255,255,255,0.4); }
        .progress-label-light { font-size: 11px; color: rgba(30,30,60,0.45); }
        .progress-pct { font-size: 11px; font-weight: 700; color: #c084fc; }

        .progress-track {
          height: 4px; border-radius: 99px; background: rgba(128,128,128,0.12); overflow: hidden;
        }
        .progress-fill {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, #818cf8, #c084fc);
          transition: width 0.9s cubic-bezier(0.34,1.1,0.64,1);
        }

        /* ── CATEGORY TABS ── */
        .todo-cats {
          position: relative; z-index: 1;
          display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 12px;
          align-items: center; justify-content: space-between;
        }
        .todo-cats-left { display: flex; gap: 5px; flex-wrap: wrap; }

        .cat-tab {
          font-size: 10.5px; font-weight: 500; padding: 3px 10px; border-radius: 20px;
          border: 1px solid transparent; cursor: pointer; transition: all 0.2s;
        }
        .cat-tab-dark  { color: rgba(255,255,255,0.38); border-color: rgba(255,255,255,0.08); background: transparent; }
        .cat-tab-light { color: rgba(30,30,60,0.4);    border-color: rgba(0,0,0,0.08);       background: transparent; }
        .cat-active-dark  { background: rgba(192,132,252,0.18); color: #c084fc; border-color: rgba(192,132,252,0.3); }
        .cat-active-light { background: rgba(107,72,255,0.1);   color: #7c3aed; border-color: rgba(107,72,255,0.25); }

        /* Show/hide done toggle */
        .toggle-done {
          font-size: 10px; font-weight: 500; padding: 3px 9px; border-radius: 20px;
          border: 1px solid transparent; cursor: pointer; transition: all 0.2s;
        }
        .toggle-done-dark  { color: rgba(255,255,255,0.3); border-color: rgba(255,255,255,0.07); background: transparent; }
        .toggle-done-light { color: rgba(30,30,60,0.35);   border-color: rgba(0,0,0,0.07);      background: transparent; }
        .toggle-done:hover { opacity: 0.75; }

        /* ── TASK LIST ── */
        .todo-list {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 2px;
          max-height: 280px; overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(192,132,252,0.3) transparent;
        }
        .todo-list::-webkit-scrollbar { width: 4px; }
        .todo-list::-webkit-scrollbar-thumb { background: rgba(192,132,252,0.3); border-radius: 99px; }

        /* Empty state */
        .todo-empty {
          text-align: center; padding: 28px 0;
          font-size: 12px; color: rgba(128,128,128,0.45);
        }

        /* ── TASK ROW ── */
        .task-row {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 8px; border-radius: 12px;
          transition: background 0.15s ease;
        }
        .task-row-dark:hover  { background: rgba(255,255,255,0.05); }
        .task-row-light:hover { background: rgba(0,0,0,0.03); }

        /* Custom checkbox */
        .task-checkbox {
          width: 18px; height: 18px; border-radius: 6px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease;
        }
        .cb-checked       { background: linear-gradient(135deg, #818cf8, #c084fc); border: none; }
        .cb-unchecked-dark  { background: transparent; border: 1.5px solid rgba(255,255,255,0.2); }
        .cb-unchecked-light { background: transparent; border: 1.5px solid rgba(0,0,0,0.2); }
        .cb-unchecked-dark:hover  { border-color: #c084fc; }
        .cb-unchecked-light:hover { border-color: #7c3aed; }

        /* Task text + meta */
        .task-body { flex: 1; min-width: 0; }
        .task-text {
          font-size: 12.5px; font-weight: 500; margin: 0 0 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          transition: color 0.2s;
        }
        .task-text-dark  { color: rgba(255,255,255,0.88); }
        .task-text-light { color: #1a1a2e; }
        .task-done { text-decoration: line-through; }

        .task-meta { display: flex; align-items: center; gap: 5px; }
        .task-priority-badge {
          font-size: 9.5px; font-weight: 700; padding: 1px 7px; border-radius: 20px;
        }
        .task-category {
          font-size: 10px; font-weight: 500;
        }
        .cat-dark  { color: rgba(255,255,255,0.3); }
        .cat-light { color: rgba(30,30,60,0.4); }

        /* Delete button */
        .task-delete {
          width: 22px; height: 22px; border-radius: 7px; border: none;
          background: rgba(248,113,113,0.15); color: #f87171;
          font-size: 10px; cursor: pointer; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.15s ease, transform 0.1s ease;
        }
        .task-delete:active { transform: scale(0.9); }
        .delete-visible { opacity: 1; }
        .delete-hidden  { opacity: 0; pointer-events: none; }

        /* ── ADD TASK MODAL ── */
        .todo-modal-backdrop {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        .todo-modal-box {
          width: 320px; border-radius: 20px; padding: 22px;
          animation: slideUp 0.3s cubic-bezier(0.34,1.4,0.64,1);
        }
        @keyframes slideUp { from { opacity:0; transform: translateY(20px) scale(0.97); } to { opacity:1; transform: translateY(0) scale(1); } }

        .tmodal-dark  { background: #1a1a2e; border: 1px solid rgba(255,255,255,0.12); }
        .tmodal-light { background: #fff;    border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 20px 60px rgba(0,0,0,0.15); }

        .tmodal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .tmodal-title-dark  { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.9); }
        .tmodal-title-light { font-size: 14px; font-weight: 600; color: #1a1a2e; }
        .tmodal-close { background: none; border: none; font-size: 13px; cursor: pointer; color: rgba(128,128,128,0.5); padding: 2px 6px; border-radius: 6px; }
        .tmodal-close:hover { background: rgba(128,128,128,0.1); }

        .tmodal-input {
          width: 100%; box-sizing: border-box; padding: 9px 12px; border-radius: 10px;
          font-size: 13px; margin-bottom: 10px; outline: none; transition: border-color 0.2s;
        }
        .tinput-dark  { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.85); }
        .tinput-light { background: rgba(0,0,0,0.04);      border: 1px solid rgba(0,0,0,0.1);       color: #1a1a2e; }
        .tinput-dark:focus  { border-color: rgba(192,132,252,0.6); }
        .tinput-light:focus { border-color: rgba(107,72,255,0.5); }

        .tmodal-row  { display: flex; gap: 8px; }
        .tmodal-half { flex: 1; }

        .tmodal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px; }
        .tbtn-cancel  { padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 500; cursor: pointer; background: transparent; border: 1px solid rgba(128,128,128,0.2); color: rgba(128,128,128,0.7); }
        .tbtn-confirm { padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer; background: linear-gradient(135deg, #c084fc, #818cf8); border: none; color: #fff; transition: opacity 0.2s; }
        .tbtn-confirm:hover { opacity: 0.88; }

        /* History section inside modal */
        .history-title { font-size: 10.5px; font-weight: 600; color: #f87171; margin: 12px 0 6px; }
        .history-empty { font-size: 11px; color: rgba(128,128,128,0.5); font-style: italic; }
        .history-list  { max-height: 90px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; }
        .history-row   { display: flex; align-items: center; justify-content: space-between; }
        .history-text  { font-size: 11px; text-decoration: line-through; }
        .history-text-dark  { color: rgba(255,255,255,0.3); }
        .history-text-light { color: rgba(30,30,60,0.4); }
        .restore-btn   { font-size: 10px; font-weight: 600; color: #c084fc; background: none; border: none; cursor: pointer; padding: 1px 4px; border-radius: 4px; }
        .restore-btn:hover { background: rgba(192,132,252,0.15); }

        /* ── ENTRANCE ── */
        @keyframes todoEntrance {
          from { opacity:0; transform: perspective(900px) translateY(28px) scale(0.96); }
          to   { opacity:1; transform: perspective(900px) translateY(0) scale(1); }
        }
      `}</style>

      {/* ── Glass Card ── */}
      <div
        ref={cardRef}
        className={`todo-card ${darkMode ? "todo-dark" : "todo-light"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={glowRef} className="todo-glow" style={{ opacity: 0 }} />
        <div className="todo-shimmer" />

        {/* ── Header: title + add button ── */}
        <div className="todo-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TodoIcon style={{ width: 16, height: 16, opacity: 0.6, color: darkMode ? "#c084fc" : "#7c3aed" }} />
            <p className={darkMode ? "todo-title-dark" : "todo-title-light"}>Tasks</p>
            {/* Live count pill */}
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20,
              background: "rgba(192,132,252,0.15)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.28)"
            }}>
              {doneCount}/{totalCount}
            </span>
          </div>
          <button className="todo-add-btn" onClick={() => setShowModal(true)}>
            + Add Task
          </button>
        </div>

        {/* ── Completion progress bar ── */}
        <div className="todo-progress">
          <div className="progress-top">
            <span className={darkMode ? "progress-label-dark" : "progress-label-light"}>
              {doneCount} of {totalCount} completed
            </span>
            <span className="progress-pct">{pct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* ── Category tabs + show/hide done toggle ── */}
        <div className="todo-cats">
          <div className="todo-cats-left">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-tab
                  ${darkMode ? "cat-tab-dark" : "cat-tab-light"}
                  ${activeTab === cat ? (darkMode ? "cat-active-dark" : "cat-active-light") : ""}
                `}
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Toggle: show or hide completed tasks */}
          <button
            className={`toggle-done ${darkMode ? "toggle-done-dark" : "toggle-done-light"}`}
            onClick={() => setShowDone((v) => !v)}
          >
            {showDone ? "Hide done" : "Show done"}
          </button>
        </div>

        {/* ── Task list ── */}
        <div className="todo-list">
          {filtered.length === 0 ? (
            <div className="todo-empty">No tasks in this category</div>
          ) : (
            filtered.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                darkMode={darkMode}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Add Task Modal ── */}
      {showModal && (
        <div className="todo-modal-backdrop" onClick={() => setShowModal(false)}>
          <div
            className={`todo-modal-box ${darkMode ? "tmodal-dark" : "tmodal-light"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tmodal-header">
              <span className={darkMode ? "tmodal-title-dark" : "tmodal-title-light"}>Add New Task</span>
              <button className="tmodal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {/* Task text */}
            <input
              className={`tmodal-input ${darkMode ? "tinput-dark" : "tinput-light"}`}
              placeholder="Task description..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              autoFocus
            />

            {/* Priority + Category */}
            <div className="tmodal-row">
              <select
                className={`tmodal-input tmodal-half ${darkMode ? "tinput-dark" : "tinput-light"}`}
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
              <select
                className={`tmodal-input tmodal-half ${darkMode ? "tinput-dark" : "tinput-light"}`}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                {CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Deleted task history + restore */}
            <p className="history-title">Deleted History</p>
            {history.length === 0 ? (
              <p className="history-empty">No deleted tasks</p>
            ) : (
              <div className="history-list">
                {history.map((h) => (
                  <div key={h.id} className="history-row">
                    <span className={`history-text ${darkMode ? "history-text-dark" : "history-text-light"}`}>
                      {h.text}
                    </span>
                    {/* Restore button — brings the task back to the active list */}
                    <button className="restore-btn" onClick={() => restoreTask(h.id)}>
                      ↩ Restore
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="tmodal-actions">
              <button className="tbtn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="tbtn-confirm" onClick={addTask}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
