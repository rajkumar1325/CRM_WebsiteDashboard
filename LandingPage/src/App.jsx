// ─── App.jsx — Merged LandingPage + Dashboard ────────────────────────────────
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";

// ── Landing Page ──────────────────────────────────────────────────────────────
import LandingPage  from "./assets/LandingPage";

// ── Dashboard Shell ───────────────────────────────────────────────────────────
import Sidebar      from "./dashboard/Sidebar/Sidebar.jsx";
import Topbar       from "./dashboard/Topbar/Topbar.jsx";

// ── Dashboard Pages ───────────────────────────────────────────────────────────
import Dashboard    from "./dashboard/components/Dashboard/Dashboard.jsx";
import Leads        from "./dashboard/components/Leads/Leads.jsx";
import Customer     from "./dashboard/components/Customers/Customer.jsx";
import Support      from "./dashboard/components/Support/Support.jsx";
import Deals        from "./dashboard/components/Deals/Deals.jsx";
import Reports      from "./dashboard/components/Reports/Reports.jsx";
import Tasks        from "./dashboard/components/Tasks/Tasks.jsx";
import Projects     from "./dashboard/components/Projects/Projects.jsx";
import CalendarPage from "./dashboard/components/Calender/CalendarPage.jsx";
import Team         from "./dashboard/components/Team/Team.jsx";
import Settings     from "./dashboard/components/Settings/Settings.jsx";
import Products     from "./dashboard/components/Products/Products.jsx";

import "./dashboard/DashboardApp.css";

// ── JWT Helper ────────────────────────────────────────────────────────────────
// const getRoleFromToken = () => {
//   try {
//     const token = localStorage.getItem("token");
//     const storedRole = localStorage.getItem("role");
//     if (token) {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       const rawRole = payload.role || payload.roles?.[0] || storedRole;
//       return rawRole ? rawRole.toString().toUpperCase() : null;
//     }
//     return storedRole ? storedRole.toString().toUpperCase() : null;
//   } catch {
//     const storedRole = localStorage.getItem("role");
//     return storedRole ? storedRole.toString().toUpperCase() : null;
//   }
// };



const getRoleFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const rawRole = payload.role || payload.roles?.[0] || storedRole;
      return rawRole ? rawRole.toString().toUpperCase() : null;
    }
    return storedRole ? storedRole.toString().toUpperCase() : null;
  } catch {
    const storedRole = localStorage.getItem("role");
    return storedRole ? storedRole.toString().toUpperCase() : null; 
  }
};




// ── Protected Route ───────────────────────────────────────────────────────────
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const token = localStorage.getItem("token");
//   const role  = getRoleFromToken();
//   if (!token)                                        return <Navigate to="/"             replace />;
//   if (allowedRoles && !allowedRoles.includes(role))  return <Navigate to="/unauthorized" replace />;
//   return children;
// };

// ── Protected Route ───────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role  = getRoleFromToken();

  if (!token) return <Navigate to="/" replace />;

  // ✅ Fix: was silently falling through to "/" — now explicitly unauthorized
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};





// ── Dashboard Layout ──────────────────────────────────────────────────────────
// NOTE: No ProtectedRoute here — it's applied from outside in App routes
function DashboardLayout() {
  const [search, setSearch] = useState("");
  const [dark,   setDark]   = useState(true);
  const location            = useLocation();
  const userRole            = getRoleFromToken();

  const getPlaceholder = () => ({
    "/dashboard/leads":     "Search by name and company...",
    "/dashboard/customers": "Search by customer name...",
    "/dashboard/support":   "Search support tickets...",
    "/dashboard/deals":     "Search deals...",
    "/dashboard/projects":  "Search projects...",
    "/dashboard/calendar":  "Search events...",
    "/dashboard/team":      "Search team members...",
  })[location.pathname] || "Search now...";

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar isDark={dark} />

      <main className={`flex-1 min-w-0 flex flex-col h-screen overflow-y-auto ${dark ? "bg-[#171821]" : "bg-amber-50"}`}>
        <Topbar
          setSearch={setSearch}
          searchPlaceHolder={getPlaceholder()}
          isDark={dark}
          setIsDark={setDark}
        />

        <div className="p-3">
          <Routes>

            {/* index = /dashboard */}
            <Route index element={<Dashboard isDark={dark} />} />

            {/* ADMIN + EMPLOYEE */}
            <Route path="leads"            element={
              <ProtectedRoute allowedRoles={["ADMIN","EMPLOYEE"]}>
                <Leads darkMode={dark} searchQuery={search} />
              </ProtectedRoute>
            }/>
            <Route path="customers"        element={
              <ProtectedRoute allowedRoles={["ADMIN","EMPLOYEE"]}>
                <Customer darkMode={dark} searchQuery={search} />
              </ProtectedRoute>
            }/>
            <Route path="deals"            element={
              <ProtectedRoute allowedRoles={["ADMIN","EMPLOYEE"]}>
                <Deals darkMode={dark} searchQuery={search} />
              </ProtectedRoute>
            }/>
            <Route path="taskAndActivities" element={
              <ProtectedRoute allowedRoles={["ADMIN","EMPLOYEE"]}>
                <Tasks darkMode={dark} />
              </ProtectedRoute>
            }/>
            <Route path="calendar"         element={
              <ProtectedRoute allowedRoles={["ADMIN","EMPLOYEE"]}>
                <CalendarPage darkMode={dark} />
              </ProtectedRoute>
            }/>

            {/* ADMIN + CUSTOMER */}
            <Route path="projects"         element={
              <ProtectedRoute allowedRoles={["ADMIN","CUSTOMER"]}>
                <Projects darkMode={dark} searchQuery={search} />
              </ProtectedRoute>
            }/>

            {/* ALL ROLES */}
            <Route path="support"          element={
              <ProtectedRoute allowedRoles={["ADMIN","EMPLOYEE","CUSTOMER"]}>
                <Support darkMode={dark} searchQuery={search} />
              </ProtectedRoute>
            }/>
            <Route path="products"         element={
              <ProtectedRoute allowedRoles={["ADMIN","EMPLOYEE","CUSTOMER"]}>
                <Products darkMode={dark} />
              </ProtectedRoute>
            }/>
            <Route path="settings"         element={
              <ProtectedRoute allowedRoles={["ADMIN","EMPLOYEE","CUSTOMER"]}>
                <Settings
                  isDark={dark}
                  setIsDark={setDark}
                  userRole={userRole}
                  currentUser={{
                    name:     localStorage.getItem("name")  || "User",
                    email:    localStorage.getItem("email") || "",
                    phone:    localStorage.getItem("phone") || "",
                    initials: (localStorage.getItem("name") || "U")
                                .split(" ").map(w => w[0]).join("").toUpperCase(),
                  }}
                />
              </ProtectedRoute>
            }/>

            {/* ADMIN ONLY */}
            <Route path="team"             element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Team darkMode={dark} searchQuery={search} />
              </ProtectedRoute>
            }/>
            <Route path="reports"          element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Reports darkMode={dark} />
              </ProtectedRoute>
            }/>

          </Routes>
        </div>
      </main>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Dashboard — ProtectedRoute wraps DashboardLayout here */}
        <Route path="/dashboard/*" element={
          <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE", "CUSTOMER"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }/>

        {/* Utility */}
        <Route path="/unauthorized" element={
          <div className="flex items-center justify-center h-screen bg-[#171821] text-red-400 text-xl">
            ⛔ Access Denied — You don't have permission to view this page.
          </div>
        }/>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}