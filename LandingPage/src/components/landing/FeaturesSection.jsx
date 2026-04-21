/**
 * FeaturesSection.jsx — CURIEM CRM Landing
 * ─────────────────────────────────────────────────────────────────
 * Three-column feature overview cards.
 *
 * Backend endpoints referenced by features:
 *   Lead Inbox → GET /api/v1/clients              (Admin, Manager)
 *   Tasks      → GET /api/v1/tasks                (All roles)
 *   Analytics  → GET /api/v1/taskStatistics       (Admin, Manager)
 *               GET /api/v1/jobStatitstic/{projectId}  (Admin, Manager)
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";

const ACCENT_COLOR = {
  cyan:    "text-cyan-300",
  purple:  "text-purple-300",
  emerald: "text-emerald-300",
};

/** Single feature card */
function FeatureCard({ accent, tag, title, desc, items, delay }) {
  return (
    <div
      className="rounded-2xl border border-gray-800 bg-[#050b17]/90 p-5 shadow-sm card-hover"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className={`text-[11px] uppercase tracking-wide mb-1 ${ACCENT_COLOR[accent]}`}>{tag}</p>
      <h3 className="text-sm sm:text-base font-semibold mb-2">{title}</h3>
      <p className="text-xs text-gray-400 mb-3">{desc}</p>
      <ul className="text-[11px] text-gray-400 space-y-1">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

const FEATURES = [
  {
    accent: "cyan",
    delay: 0,
    tag: "Lead Inbox",
    title: "Central lead timeline",
    desc: "View every touchpoint — emails, calls, notes — in one place.",
    // API: GET /api/v1/clients  (Admin, Leader)
    items: [
      "Filter by status, owner, and source",
      "Instant search by name, company, or email",
      "One-click jump to deal details",
    ],
  },
  {
    accent: "purple",
    delay: 100,
    tag: "Tasks & Activities",
    title: "Smart daily task list",
    desc: "Auto-built to-dos based on due follow-ups, new leads, and renewal dates.",
    // API: GET /api/v1/tasks  (All roles)
    //      PUT /tasks/{id}    (Member — update own task status)
    //      Spring @Scheduled auto-updates overdue task status server-side
    items: [
      "Call, email, and meeting tasks",
      "Overdue items highlighted gently",
      "Personal & team-wide activity views",
    ],
  },
  {
    accent: "emerald",
    delay: 200,
    tag: "Revenue Insights",
    title: "Clean subscription analytics",
    desc: "Track MRR, churn, expansion, and win-rates with simple charts.",
    // API: GET /api/v1/taskStatistics              (All roles)
    //      GET /api/v1/jobStatitstic/{projectId}   (Admin, Leader)
    //      NOTE: "jobStatitstic" is the exact backend route spelling (report Table 9)
    items: [
      "Plan-wise MRR breakdown",
      "Pipeline by stage & owner",
      "Weekly email reports",
    ],
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-10 sm:py-14 border-t border-gray-800/70">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
            Stay on top of every lead.
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-md">
            One workspace for leads, conversations, tasks, and revenue —
            your team never misses a follow-up again.
          </p>
        </div>
        <p className="hidden sm:block text-[11px] text-gray-400">
          Realtime insights · Tasks · Team performance
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {FEATURES.map((f) => (
          <FeatureCard key={f.tag} {...f} />
        ))}
      </div>
    </section>
  );
}
