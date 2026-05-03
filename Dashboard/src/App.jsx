import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom"; // ✅ CHANGED: Navigate import add kiya
import { useState } from "react";
import Sidebar from "./assets/Sidebar/Sidebar.jsx";
import Dashboard from "./assets/components/Dashboard/Dashboard.jsx";
import Topbar from "./assets/Topbar/Topbar.jsx";
import Leads from "./assets/components/Leads/Leads.jsx";
import Customer from "./assets/components/Customers/Customer.jsx";
import Support from "./assets/components/Support/Support.jsx";
import Deals from "./assets/components/Deals/Deals.jsx";
import Reports from "./assets/components/Reports/Reports.jsx";
import Tasks from "./assets/components/Tasks/Tasks.jsx";
import Projects from "./assets/components/Projects/Projects.jsx";
import CalendarPage from "./assets/components/Calender/CalendarPage.jsx";
import Team from "./assets/components/Team/Team.jsx";
import Settings from "./assets/components/Settings/Settings.jsx";

import Products from "./assets/components/Products/Products.jsx"; // Products component import kiya

// -----------------------------------JWT se role nikalne ka helper
// Backend: POST /api/auth/login → JWT token mein role embed hota hai
const getRoleFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null; // "ADMIN" | "EMPLOYEE" | "CUSTOMER"
  } catch {
    return null;
  }
};

// --------------------------------------ProtectedRoute component
// - Token nahi → /login pe redirect
// - Role allowed nahi → /unauthorized pe redirect
// - Sab theek → children render
// Backend: Har API call mein Authorization: Bearer <token> header bheja jayega
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = getRoleFromToken();

  // Token hi nahi → login karo
  if (!token) return <Navigate to="/login" replace />;

  // Role check — agar allowedRoles pass kiya hai toh check karo
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function App() {
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(true);
  const location = useLocation();

  // -----------------------------------role ek baar read karo — Settings ko pass karne ke liye
  // Backend: GET /api/auth/me → current user ka role fetch (agar chahiye toh)
  const userRole = getRoleFromToken(); // "ADMIN" | "EMPLOYEE" | "CUSTOMER" | null

  const getPlaceHolder = () => {
    if (location.pathname === "/leads") return "Search by name and Company";
    if (location.pathname === "/customers") return "Search by customer name and Company";
    if (location.pathname === "/support") return "Search by support tickets";
    if (location.pathname === "/deals") return "Search deals";
    if (location.pathname === "/projects") return "Search projects...";
    if (location.pathname === "/calender") return "Search events...";
    if (location.pathname === "/team") return "Search team members...";
    return "Search now...";
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar isDark={dark} />

      <main className={`flex-1 min-w-0 flex flex-col h-screen overflow-y-auto ${dark ? "bg-[#171821]" : "bg-amber-50"}`}>
        <Topbar
          setSearch={setSearch}
          searchPlaceHolder={getPlaceHolder()}
          isDark={dark}
          setIsDark={setDark}
        />
        <div className="p-3">
          <Routes>

            {/* -----------------------------------Sabhi routes ProtectedRoute mein wrap kiye */}

            {/* Sab roles dekh sakte hain */}
            <Route path="/" element={
              <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE", "CUSTOMER"]}>
                <Dashboard isDark={dark} />
              </ProtectedRoute>
            } />

            {/* ADMIN + EMPLOYEE only */}
            {/* Backend: GET /api/leads → @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')") */}
            <Route path="/leads" element={
              <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
                <Leads darkMode={dark} searchQuery={search} />
              </ProtectedRoute>
            } />

            {/* Backend: GET /api/customers → @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')") */}
            <Route path="/customers" element={
              <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
                <Customer darkMode={dark} searchQuery={search} />
              </ProtectedRoute>
            } />

            {/* Backend: GET /api/deals → @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')") */}
            <Route path="/deals" element={
              <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
                <Deals darkMode={dark} searchQuery={search} />
              </ProtectedRoute>
            } />

            {/* ADMIN + CUSTOMER — customer apne projects dekhe */}
            {/* Backend: GET /api/projects → @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')") */}
            <Route path="/projects" element={
              <ProtectedRoute allowedRoles={["ADMIN", "CUSTOMER"]}>
                <Projects darkMode={dark} searchQuery={search} />
              </ProtectedRoute>
            } />

            {/* Backend: GET /api/tasks → @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')") */}
            <Route path="/taskAndActivities" element={
              <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
                <Tasks darkMode={dark} />
              </ProtectedRoute>
            } />

            {/* Backend: GET /api/calendar → @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')") */}
            <Route path="/calendar" element={
              <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
                <CalendarPage darkMode={dark} />
              </ProtectedRoute>
            } />

            {/* Sab roles — customer ticket raise kare */}
            {/* Backend: GET /api/support → @PreAuthorize("isAuthenticated()") */}
            <Route path="/support" element={
              <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE", "CUSTOMER"]}>
                <Support darkMode={dark} searchQuery={search} />
              </ProtectedRoute>
            } />

              {/* Sab roles — products dekhe  but edit sirf admin*/}
            <Route path="/products" element={
              <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE", "CUSTOMER"]}>
                <Products darkMode={dark} />
              </ProtectedRoute>
            } />


            {/* ADMIN only */}
            {/* Backend: GET /api/team → @PreAuthorize("hasRole('ADMIN')") */}
            <Route path="/team" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Team darkMode={dark} searchQuery={search} />
              </ProtectedRoute>
            } />

            {/* Backend: GET /api/reports → @PreAuthorize("hasRole('ADMIN')") */}
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Reports darkMode={dark} />
              </ProtectedRoute>
            } />

            {/* Sab roles — apni profile */}
            {/* Backend: GET /api/auth/me → @PreAuthorize("isAuthenticated()") */}
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE", "CUSTOMER"]}>
                <Settings
                  isDark={dark}
                  setIsDark={setDark}
                  userRole={userRole} // hardcoded "Admin" ki jagah JWT se aaya role
                  currentUser={{
                    name: "Raj Kumar",
                    email: "raj.kumar@curiumcrm.com",
                    phone: "+91 98765 43210",
                    initials: "RK",
                  }}
                />
              </ProtectedRoute>
            } />

            {/* -----------------------------------Unauthorized page — role mismatch pe yahan aao */}
            <Route path="/unauthorized" element={
              <div className="flex items-center justify-center h-full text-red-400 text-xl">
                ⛔ Access Denied — You don't have permission to view this page.
              </div>
            } />

            {/* -----------------------------------Login route — abhi placeholder, baad mein Login component lagana */}
            {/* Backend: POST /api/auth/login */}
            <Route path="/login" element={
              <div className="flex items-center justify-center h-full text-white text-xl">
                🔐 Login Page — coming soon
              </div>
            } />

          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;