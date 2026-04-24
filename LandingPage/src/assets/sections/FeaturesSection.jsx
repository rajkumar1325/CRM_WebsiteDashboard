// ─── sections/FeaturesSection.jsx ────────────────────────────────────────────
// Interactive 4-tab feature showcase.
// Each tab maps to one USP from data.js.
// Props: activeFeature, setActiveFeature, dashRole, setDashRole

import { useState } from "react";
import { Icon } from "../shared/Icons";
import MiniCalendar from "../shared/MiniCalendar";
import RoleDashboardPreview from "../shared/RoleDashboardPreview";
import { FEATURES } from "../data";

// Map iconKey strings (from data.js) → actual Icon components
const ICON_MAP = {
  Link:     Icon.Link,
  Shield:   Icon.Shield,
  Zap:      Icon.Zap,
  Calendar: Icon.Calendar,
};

// Scheduler log shown for the "Automated Task Status" tab
function SchedulerLog() {
  const logs = [
    { time: "02:00:00", msg: "Scan: 41 tasks checked",  ok: true  },
    { time: "02:00:00", msg: "3 tasks marked OVERDUE",  ok: false },
    { time: "03:00:00", msg: "Scan: 41 tasks checked",  ok: true  },
    { time: "03:00:00", msg: "0 status changes",        ok: true  },
  ];
  return (
    <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/5 p-4">
      <p className="text-[10px] font-bold text-amber-400/60 uppercase tracking-widest mb-3">
        Scheduler Log
      </p>
      {logs.map((log, i) => (
        <div key={i} className="flex items-center gap-3 text-[10px] font-mono mb-1.5">
          <span className="text-white/25">{log.time}</span>
          <span className={log.ok ? "text-emerald-400/70" : "text-amber-400/80"}>{log.msg}</span>
        </div>
      ))}
    </div>
  );
}

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [dashRole, setDashRole]           = useState("manager");

  const f   = FEATURES[activeFeature];
  const FIcon = ICON_MAP[f.iconKey];

  return (
    <section id="features" className="py-14 border-t border-white/5">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[11px] font-bold uppercase tracking-widest text-purple-400/60 mb-3">
          Core Features
        </p>
        <h2 className="lp-display text-2xl sm:text-3xl font-bold text-white max-w-xl">
          Built around how your team actually works.
        </h2>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">

        {/* ── Tab list (left column on desktop, horizontal scroll on mobile) ── */}
        <div className="lg:col-span-2 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          {FEATURES.map((feat, i) => {
            const TabIcon = ICON_MAP[feat.iconKey];
            return (
              <div
                key={i}
                onClick={() => setActiveFeature(i)}
                className={`feature-tab shrink-0 rounded-2xl border p-4 ${activeFeature === i ? "active" : ""}`}
                style={{
                  borderColor: activeFeature === i ? `${feat.tagColor}30` : "rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${feat.tagColor}15`,
                      border:     `1px solid ${feat.tagColor}30`,
                      color:       feat.tagColor,
                    }}
                  >
                    <TabIcon />
                  </div>
                  <p className="text-xs font-bold text-white/80 leading-tight">{feat.tag}</p>
                </div>
                {activeFeature === i && (
                  <div
                    className="mt-2 h-0.5 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${feat.tagColor}, transparent)` }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Feature detail panel (right) ── */}
        <div className="lg:col-span-3">
          <div key={activeFeature} className="glass-card rounded-2xl p-6 h-full anim-fade-scale">

            {/* Icon */}
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: `${f.tagColor}18`,
                border:     `1px solid ${f.tagColor}35`,
                color:       f.tagColor,
              }}
            >
              <FIcon />
            </div>

            {/* Tag */}
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: f.tagColor }}>
              {f.tag}
            </p>

            {/* Title */}
            <h3 className="lp-display text-xl sm:text-2xl font-bold text-white mb-3">{f.title}</h3>

            {/* Description */}
            <p className="text-sm text-white/45 leading-relaxed mb-5">{f.desc}</p>

            {/* Points */}
            <div className="space-y-2.5">
              {f.points.map((pt, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${f.tagColor}20`, color: f.tagColor }}
                  >
                    <Icon.Check />
                  </div>
                  {pt}
                </div>
              ))}
            </div>

            {/* ── Tab-specific previews ── */}

            {/* Calendar tab → Mini Calendar widget */}
            {activeFeature === 3 && (
              <div className="mt-6">
                <MiniCalendar />
              </div>
            )}

            {/* Automated Task Status tab → Scheduler log */}
            {activeFeature === 2 && <SchedulerLog />}

            {/* Role Dashboards tab → interactive role switcher */}
            {activeFeature === 1 && (
              <div className="mt-6">
                {/* Role toggle buttons */}
                <div className="flex gap-2 mb-3">
                  {["admin", "manager", "employee"].map(r => {
                    const roleColor = r === "admin" ? "#f87171" : r === "manager" ? "#fbbf24" : "#34d399";
                    return (
                      <button
                        key={r}
                        onClick={() => setDashRole(r)}
                        className="px-3 py-1 rounded-full text-[10px] font-semibold border transition-all"
                        style={{
                          borderColor: dashRole === r ? roleColor : "rgba(255,255,255,0.08)",
                          color:       dashRole === r ? "white"    : "rgba(255,255,255,0.3)",
                          background:  dashRole === r ? "rgba(255,255,255,0.05)" : "transparent",
                        }}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    );
                  })}
                </div>
                <RoleDashboardPreview role={dashRole} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
