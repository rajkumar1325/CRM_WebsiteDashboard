import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
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

function App() {
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(true);
  const location = useLocation();

  const getPlaceHolder = () => {
    if (location.pathname === "/leads") return "Search by name and Company";
    if (location.pathname === "/customers") return "Search by customer name and Company";
    if (location.pathname === "/support") return "Search by support tickets";
    if (location.pathname === "/deals") return "Search deals";
    return "Search now...";
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">

      {/*  Sidebar is always rendered but on mobile it's position:fixed (out of flex flow) */}
      <Sidebar isDark={dark} />

      {/* main always takes full width on mobile since sidebar is out of flow */}
      <main className={`flex-1 min-w-0 flex flex-col h-screen overflow-y-auto ${dark ? "bg-[#171821]" : "bg-amber-50"}`}>
        <Topbar
          setSearch={setSearch}
          searchPlaceHolder={getPlaceHolder()}
          isDark={dark}
          setIsDark={setDark}
        />
        <div className="p-3">
          <Routes>
            <Route path="/" element={<Dashboard isDark={dark} />} />
            <Route path="/leads" element={<Leads darkMode={dark} searchQuery={search} />} />
            <Route path="/customers" element={<Customer darkMode={dark} searchQuery={search} />} />
            <Route path="/support" element={<Support darkMode={dark} searchQuery={search} />} />
            <Route path="/deals" element={<Deals darkMode={dark} searchQuery={search} />} />
            <Route path="/reports" element={<Reports darkMode={dark} />} />
            <Route path="/taskAndActivities" element={<Tasks />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;