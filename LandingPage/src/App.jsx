import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./assets/LandingPage";
import Dashboard   from "./dashboard/Dashboard";

// ── Protected Route ───────────────────────────────────────────
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");  // "admin" | "employee" | "customer"

  if (!token) return <Navigate to="/" replace />;  // no token → landing page
  if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected dashboards */}
        <Route path="/dashboard/admin" element={
          <ProtectedRoute allowedRole="admin">
            <Dashboard />
          </ProtectedRoute>
        }/>
        <Route path="/dashboard/employee" element={
          <ProtectedRoute allowedRole="employee">
            <Dashboard />
          </ProtectedRoute>
        }/>
        <Route path="/dashboard/customer" element={
          <ProtectedRoute allowedRole="customer">
            <Dashboard />
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}