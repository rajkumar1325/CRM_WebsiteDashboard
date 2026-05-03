import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ CHANGED: redirect ke liye

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

// ✅ CHANGED: JWT se role nikalne ka helper
// Backend: POST /api/auth/login → JWT mein role embed hota hai
const getRoleFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role?.toUpperCase() || null; // "ADMIN" | "EMPLOYEE" | "CUSTOMER"
  } catch {
    return null;
  }
};

/**
 * Dashboard Layout — Role Based
 *
 * ADMIN (full access):
 * ┌──────────────────────────────────────────┬───────────────┐
 * │  Cards — 4 KPI metrics (flex fill)       │  EarningsCard │  ROW 1
 * ├──────────────────────────────────────────┼───────────────┤
 * │  SalesChart (flex fill)                  │  MeetingCard  │  ROW 2
 * ├──────────────────────────────────────────┴───────────────┤
 * │  LeadsPipeline — full width                              │  ROW 3
 * ├──────────────────────────────┬───────────────────────────┤
 * │  TopPerformers (55%)         │  LeadsPieChart (45%)      │  ROW 4
 * ├──────────────────┬───────────┴───────────────────────────┤
 * │  CustomerFulfil  │  TodoList                             │  ROW 5
 * └──────────────────┴───────────────────────────────────────┘
 *
 * EMPLOYEE (apna kaam):
 * ┌───────────────────────────────────────────────────────────┐
 * │  Cards — assigned tasks/leads count           ROW 1       │
 * ├──────────────────────────────┬────────────────────────────┤
 * │  MeetingCard                 │  TodoList         ROW 2    │
 * ├──────────────────────────────┼────────────────────────────┤
 * │  TopPerformers (55%)         │  LeadsPieChart    ROW 3    │
 * ├──────────────────────────────┴────────────────────────────┤
 * │  CustomerFulfilment — full width              ROW 4       │
 * └───────────────────────────────────────────────────────────┘
 *
 * CUSTOMER → /support redirect
 */
export default function Dashboard({ darkMode, isDark }) {
  darkMode = darkMode ?? isDark;

  // ✅ CHANGED: role read karo JWT se
  const role = getRoleFromToken(); // "ADMIN" | "EMPLOYEE" | "CUSTOMER" | null
  const navigate = useNavigate();

  // ✅ CHANGED: Customer ko support pe redirect karo
  // Customer ke liye dashboard mein relevant data nahi hai
  // Backend: GET /api/support/my-tickets → customer ke tickets
  React.useEffect(() => {
    if (role === "CUSTOMER") {
      navigate("/support", { replace: true });
    }
  }, [role, navigate]);

  // Customer redirect hone tak kuch mat dikhao
  if (role === "CUSTOMER") return null;

  return (
    <>
      <style>{`
        .db {
          width: 100%;
          min-height: 100vh;
          padding: 20px 24px 48px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .db-divider {
          height: 1px;
          background: currentColor;
          opacity: 0.06;
        }
        .db-r1 {
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: 20px;
          align-items: stretch;
        }
        .db-r1 > :first-child { min-width: 0; }
        .db-r2 {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 20px;
          align-items: stretch;
        }
        .db-r3 { width: 100%; }
        .db-r4 {
          display: grid;
          grid-template-columns: 55fr 45fr;
          gap: 20px;
          align-items: stretch;
        }
        .db-r5 {
          display: grid;
          grid-template-columns: 40fr 60fr;
          gap: 20px;
          align-items: stretch;
        }

        /* ── Employee-specific rows ── */
        /* Meeting + Todo side by side */
        .db-emp-r2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          align-items: stretch;
        }

        @media (max-width: 1200px) {
          .db-r1 { grid-template-columns: 1fr 240px; }
          .db-r2 { grid-template-columns: 1fr 280px; }
        }
        @media (max-width: 960px) {
          .db-r1, .db-r2, .db-r4, .db-r5,
          .db-emp-r2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .db { padding: 12px 14px 32px; gap: 14px; }
        }
      `}</style>

      <div className="db">

        {/* ═══════════════════════════════════════════════════════
            ADMIN VIEW — Full access
            Backend endpoints used:
              GET /api/dashboard/kpi        → Cards
              GET /api/dashboard/earnings   → EarningsCard
              GET /api/dashboard/sales      → SalesChart
              GET /api/meetings             → MeetingCard
              GET /api/leads/pipeline       → LeadsPipeline
              GET /api/team/performers      → TopPerformers
              GET /api/leads/distribution   → LeadsPieChart
              GET /api/customers/fulfilment → CustomerFulfilment
              GET /api/tasks/my             → TodoList
        ═══════════════════════════════════════════════════════ */}
        {role === "ADMIN" && (
          <>
            {/* ROW 1 — KPI Metrics + Earnings gauge */}
            <div className="db-r1">
              <Cards darkMode={darkMode} />
              {/* EarningsCard: financial data — ADMIN only */}
              {/* Backend: GET /api/dashboard/earnings → @PreAuthorize("hasRole('ADMIN')") */}
              <EarningsCard darkMode={darkMode} />
            </div>

            <div className="db-divider" />

            {/* ROW 2 — Sales trend + Upcoming meetings */}
            {/* SalesChart: overall company sales — ADMIN only */}
            {/* Backend: GET /api/dashboard/sales → @PreAuthorize("hasRole('ADMIN')") */}
            <div className="db-r2">
              <SalesChart darkMode={darkMode} />
              <MeetingCard darkMode={darkMode} />
            </div>

            <div className="db-divider" />

            {/* ROW 3 — Lead Pipeline (full width) */}
            {/* Pipeline management — ADMIN only */}
            {/* Backend: GET /api/leads/pipeline → @PreAuthorize("hasRole('ADMIN')") */}
            <div className="db-r3">
              <LeadsPipeline darkMode={darkMode} />
            </div>

            <div className="db-divider" />

            {/* ROW 4 — Agent leaderboard + Lead distribution */}
            <div className="db-r4">
              <TopPerformers darkMode={darkMode} />
              <LeadsPieChart darkMode={darkMode} />
            </div>

            <div className="db-divider" />

            {/* ROW 5 — Fulfilment trend + Task list */}
            <div className="db-r5">
              <CustomerFulfilment darkMode={darkMode} />
              <TodoList darkMode={darkMode} />
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════
            EMPLOYEE VIEW — Apna kaam
            Pipeline, SalesChart, EarningsCard nahi dikhega
            Backend endpoints used:
              GET /api/dashboard/kpi           → Cards (filtered by employee)
              GET /api/meetings/my             → MeetingCard
              GET /api/tasks/my                → TodoList
              GET /api/team/performers         → TopPerformers
              GET /api/leads/distribution      → LeadsPieChart
              GET /api/customers/fulfilment    → CustomerFulfilment
            All: @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
        ═══════════════════════════════════════════════════════ */}
        {role === "EMPLOYEE" && (
          <>
            {/* ROW 1 — KPI Cards (apne assigned leads/tasks count) */}
            {/* Backend: GET /api/dashboard/kpi?employeeId={id} */}
            <div className="db-r1" style={{ gridTemplateColumns: "1fr" }}>
              <Cards darkMode={darkMode} />
            </div>

            <div className="db-divider" />

            {/* ROW 2 — Meetings + Todo (apna schedule aur tasks) */}
            <div className="db-emp-r2">
              <MeetingCard darkMode={darkMode} />
              <TodoList darkMode={darkMode} />
            </div>

            <div className="db-divider" />

            {/* ROW 3 — Top Performers + Lead Distribution */}
            {/* TopPerformers: apni ranking dekhe team mein */}
            <div className="db-r4">
              <TopPerformers darkMode={darkMode} />
              <LeadsPieChart darkMode={darkMode} />
            </div>

            <div className="db-divider" />

            {/* ROW 4 — Customer Fulfilment (apna performance) */}
            {/* Backend: GET /api/customers/fulfilment?employeeId={id} */}
            <div className="db-r3">
              <CustomerFulfilment darkMode={darkMode} />
            </div>
          </>
        )}

      </div>
    </>
  );
}