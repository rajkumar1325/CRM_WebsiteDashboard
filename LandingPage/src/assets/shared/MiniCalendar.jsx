// ─── MiniCalendar.jsx ─────────────────────────────────────────────────────────
// Decorative mini calendar shown inside the Features section (Calendar tab).
// No props needed — purely presentational.

export default function MiniCalendar() {
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const grid = [
    [null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, null, null, null],
  ];

  // day number → color name
  const events = { 9: "cyan", 15: "purple", 22: "emerald", 17: "amber" };

  const colorClasses = {
    cyan:    "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40",
    purple:  "bg-purple-500/20 text-purple-300 ring-1 ring-purple-400/40",
    emerald: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40",
    amber:   "bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/40",
  };

  const dotColors = {
    cyan: "bg-cyan-400",
    purple: "bg-purple-400",
    emerald: "bg-emerald-400",
  };

  const upcomingEvents = [
    { color: "cyan",    label: "Client Review — Acme Corp",  time: "9:00 AM" },
    { color: "purple",  label: "Sprint Planning",             time: "2:00 PM" },
    { color: "emerald", label: "Task deadline — UI Redesign", time: "EOD"     },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-white/80">April 2025</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded flex items-center justify-center hover:bg-white/10 cursor-pointer text-white/40">‹</div>
          <div className="w-4 h-4 rounded flex items-center justify-center hover:bg-white/10 cursor-pointer text-white/40">›</div>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {days.map(d => (
          <div key={d} className="text-[9px] text-white/30 text-center font-medium">{d}</div>
        ))}
      </div>

      {/* Date grid */}
      {grid.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7 gap-1 mb-1">
          {row.map((d, ci) => {
            const color = d ? events[d] : null;
            return (
              <div key={ci}
                className={`h-6 w-full rounded-md flex items-center justify-center text-[10px] font-medium
                  ${!d ? "" : color ? colorClasses[color] : "text-white/50 hover:bg-white/5 cursor-pointer"}
                `}>
                {d || ""}
              </div>
            );
          })}
        </div>
      ))}

      {/* Upcoming events */}
      <div className="mt-3 space-y-1.5">
        {upcomingEvents.map((ev, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px]">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[ev.color]}`} />
            <span className="text-white/60 truncate flex-1">{ev.label}</span>
            <span className="text-white/30">{ev.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
