import React from "react";

// ─── Dashboard Components ─────────────────────────────────────────────────────
import Cards               from "./Cards/Cards";
import EarningsCard        from "./ProgressCard/EarningCard";
import SalesChart          from "./SalesChart/SalesChart";
import MeetingCard         from "./MeetingCard/MeetingCard";
import LeadsPipeline       from "./LeadsPipeline/LeadsPipeline"; 
import TopPerformers       from "./TopPerformers/TopPerformers";
import LeadsPieChart       from "./PieChart/PieChart";
import CustomerFulfilment  from "./CustomerFullfillment/CustomerFullfillment";
import TodoList            from "./ToDoList/TodoList";


/**
 * ......................................... Dashboserd Layout........................
 *
 * ┌──────────────────────────────────────────┬───────────────┐
 * │  Cards — 4 KPI metrics (flex fill)       │  EarningsCard │  ROW 1
 * ├──────────────────────────────────────────┼───────────────┤
 * │  SalesChart (flex fill)                  │  MeetingCard  │  ROW 2
 * ├──────────────────────────────────────────┴───────────────┤
 * │  LeadsPipeline — full width                              │  ROW 3
 * ├──────────────────────────────┬───────────────────────────┤
 * │  TopPerformers (55%)         │  LeadsPieChart (45%)      │  ROW 4
 * ├──────────────────────┬───────┴───────────────────────────┤
 * │  CustomerFulfilment  │  TodoList (wider)                 │  ROW 5
 * └──────────────────────┴───────────────────────────────────┘
 */
export default function Dashboard({ darkMode, isDark }) {
  // Accept both prop name conventions (isdark or darkMode) for flexibility
  darkMode = darkMode ?? isDark;  

  return (
    <>
      <style>{`
        /* ─── Root ─────────────────────────────────────────────── */
        .db {
          width: 100%;
          min-height: 100vh;
          padding: 20px 24px 48px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ─── Subtle section divider ────────────────────────────── */
        .db-divider {
          height: 1px;
          background: currentColor;
          opacity: 0.06;
        }

        /* ─── ROW 1: KPIs + Earnings ────────────────────────────── */
        /*   Cards fills available width; EarningsCard is fixed      */
        .db-r1 {
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: 20px;
          align-items: stretch;      /* both columns same height */
        }
        /* Ensures the Cards wrapper fills row height too */
        .db-r1 > :first-child { min-width: 0; }

        /* ─── ROW 2: Sales chart + Meetings ─────────────────────── */
        .db-r2 {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 20px;
          align-items: stretch;
        }

        /* ─── ROW 3: Lead Pipeline — full width ─────────────────── */
        .db-r3 { width: 100%; }

        /* ─── ROW 4: Top Performers + Pie ───────────────────────── */
        /*   55/45 split — leaderboard bars need the extra space     */
        .db-r4 {
          display: grid;
          grid-template-columns: 55fr 45fr;
          gap: 20px;
          align-items: stretch;
        }

        /* ─── ROW 5: Fulfilment chart + Tasks ───────────────────── */
        /*   40/60 split — chart is compact; tasks benefit from width */
        .db-r5 {
          display: grid;
          grid-template-columns: 40fr 60fr;
          gap: 20px;
          align-items: stretch;
        }

        /* ─── Responsive breakpoints ────────────────────────────── */
        @media (max-width: 1200px) {
          .db-r1 { grid-template-columns: 1fr 240px; }
          .db-r2 { grid-template-columns: 1fr 280px; }
        }

        @media (max-width: 960px) {
          .db-r1,
          .db-r2,
          .db-r4,
          .db-r5 { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .db { padding: 12px 14px 32px; gap: 14px; }
        }
      `}</style>

      <div className="db">

        {/* ══ ROW 1 — KPI Metrics + Earnings gauge ══ */}
        <div className="db-r1">
          <Cards darkMode={isDark} /> 
          <EarningsCard darkMode={darkMode} />
        </div>

        <div className="db-divider" />

        {/* ══ ROW 2 — Sales trend + Upcoming meetings ══ */}
        <div className="db-r2">
          <SalesChart darkMode={darkMode} />
          <MeetingCard darkMode={darkMode} />
        </div>

        <div className="db-divider" />

        {/* ══ ROW 3 — Lead Pipeline (full width) ══ */}
        <div className="db-r3">
          <LeadsPipeline darkMode={darkMode} />
        </div>

        <div className="db-divider" />

        {/* ══ ROW 4 — Agent leaderboard + Lead distribution ══ */}
        <div className="db-r4">
          <TopPerformers darkMode={darkMode} />
          <LeadsPieChart darkMode={darkMode} />
        </div>

        <div className="db-divider" />

        {/* ══ ROW 5 — Fulfilment trend + Task list ══ */}
        <div className="db-r5">
          <CustomerFulfilment darkMode={darkMode} />
          <TodoList darkMode={darkMode} />
        </div>

      </div>
    </>
  );
}
