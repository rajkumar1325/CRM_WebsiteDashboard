import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Briefcase,
  CheckCircle,
  PieChart,
  BarChart3,
  Info,
  FileDown,
  X,
} from "lucide-react"; // ✅ Modern lucide-react icons
import { reportsData } from "../../MockData/MockData.jsx"; // ✅ Importing mock data

const Reports = ({ darkMode }) => {
  // ==============================
  // 🧠 STATE VARIABLES
  // ==============================
  const [selectedReport, setSelectedReport] = useState(null); // Which card user clicked
  const [breakdownData, setBreakdownData] = useState([]); // Table data shown in modal

  // Extract summary from mock data
  const { summary } = reportsData;

  // Theme-based card background
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";

  // ==============================
  // 📂 MOCK DETAILED REPORT DATA
  // ==============================
  const detailedReports = {
    "Total Leads": [
      { source: "Website Signups", leads: 62, progress: 80 },
      { source: "Email Campaigns", leads: 45, progress: 60 },
      { source: "Referrals", leads: 20, progress: 40 },
      { source: "Social Media", leads: 18, progress: 30 },
    ],
    "Total Customers": [
      { region: "North America", customers: 40, progress: 90 },
      { region: "Europe", customers: 25, progress: 70 },
      { region: "Asia", customers: 22, progress: 60 },
    ],
    "Deals Won": [
      { name: "TechNova Ltd.", value: "$12,000", progress: 100 },
      { name: "Acme Corp", value: "$4,200", progress: 80 },
      { name: "Sharma Designs", value: "$3,000", progress: 60 },
    ],
    "Deals Lost": [
      { name: "Bright Marketing", reason: "Chose competitor", progress: 30 },
      { name: "Designify", reason: "Budget constraints", progress: 20 },
    ],
    "Total Revenue": [
      { month: "September", revenue: "$33,000", progress: 70 },
      { month: "October", revenue: "$42,000", progress: 90 },
      { month: "November", revenue: "$45,000", progress: 95 },
    ],
    "Conversion Rate": [
      { stage: "Prospecting", rate: "10%", progress: 25 },
      { stage: "Negotiation", rate: "18%", progress: 60 },
      { stage: "Closed Won", rate: "24%", progress: 80 },
    ],
    "Average Deal Value": [
      { month: "September", avg: "$1,080", progress: 70 },
      { month: "October", avg: "$1,200", progress: 85 },
      { month: "November", avg: "$1,285", progress: 95 },
    ],
    "Active Deals": [
      { rep: "Sarah Kim", activeDeals: 14, progress: 90 },
      { rep: "John Doe", activeDeals: 10, progress: 75 },
      { rep: "Priya Sharma", activeDeals: 8, progress: 60 },
      { rep: "Lucas Martínez", activeDeals: 8, progress: 60 },
    ],
  };

  // ==============================
  // 🖱️ EVENT HANDLERS
  // ==============================
  const openModal = (metric) => {
    setSelectedReport(metric);
    setBreakdownData(detailedReports[metric] || []);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setBreakdownData([]);
  };

  // Export data as CSV
  const exportToCSV = () => {
    if (!breakdownData.length) return;
    const headers = Object.keys(breakdownData[0]).join(",");
    const rows = breakdownData.map((obj) => Object.values(obj).join(","));
    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${selectedReport}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic color for progress bars
  const getProgressColor = (value) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // ==============================
  // 🧱 MAIN COMPONENT STRUCTURE
  // ==============================
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#171821] text-white" : "bg-gray-100 text-gray-900"
      } p-8`}
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 size={30} className="text-blue-500" />
          <h1 className="text-3xl font-bold">Reports Dashboard</h1>
        </div>

        {/* ======================
            CARDS GRID
        ======================= */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {[
            ["Total Leads", <Users className="text-blue-500" />],
            ["Total Customers", <CheckCircle className="text-green-500" />],
            ["Deals Won", <TrendingUp className="text-emerald-500" />],
            ["Deals Lost", <TrendingDown className="text-red-500" />],
          ].map(([title, icon]) => {
            // Direct key map to avoid camelCase mismatch bug
            const keyMap = {
              "Total Leads": "totalLeads",
              "Total Customers": "totalCustomers",
              "Deals Won": "dealsWon",
              "Deals Lost": "dealsLost",
            };
            return (
              <div
                key={title}
                onClick={() => openModal(title)}
                className={`${cardBg} cursor-pointer hover:scale-[1.03] transition-transform duration-200 p-5 rounded-2xl shadow flex items-center gap-4`}
              >
                {icon}
                <div>
                  <p className="text-sm text-gray-400">{title}</p>
                  <h2 className="text-2xl font-bold">
                    {summary[keyMap[title]] ?? "—"}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>

        {/* SECOND ROW */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Total Revenue */}
          <div
            onClick={() => openModal("Total Revenue")}
            className={`${cardBg} cursor-pointer hover:scale-[1.03] transition-transform duration-200 p-6 rounded-2xl shadow flex items-center justify-between`}
          >
            <div>
              <h2 className="text-xl font-semibold mb-1">Total Revenue</h2>
              <p className="text-3xl font-bold text-blue-500">
                ${summary.totalRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign size={40} className="text-blue-500 opacity-80" />
          </div>

          {/* Conversion Rate */}
          <div
            onClick={() => openModal("Conversion Rate")}
            className={`${cardBg} cursor-pointer hover:scale-[1.03] transition-transform duration-200 p-6 rounded-2xl shadow flex items-center justify-between`}
          >
            <div>
              <h2 className="text-xl font-semibold mb-1">Conversion Rate</h2>
              <p className="text-3xl font-bold text-green-500">
                {summary.conversionRate}%
              </p>
            </div>
            <PieChart size={40} className="text-green-500 opacity-80" />
          </div>
        </div>

        {/* THIRD ROW */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Deal Value */}
          <div
            onClick={() => openModal("Average Deal Value")}
            className={`${cardBg} cursor-pointer hover:scale-[1.03] transition-transform duration-200 p-6 rounded-2xl shadow flex items-center justify-between`}
          >
            <div>
              <h2 className="text-xl font-semibold mb-1">Average Deal Value</h2>
              <p className="text-3xl font-bold text-purple-500">
                ${summary.avgDealValue.toLocaleString()}
              </p>
            </div>
            <Briefcase size={40} className="text-purple-500 opacity-80" />
          </div>

          {/* Active Deals */}
          <div
            onClick={() => openModal("Active Deals")}
            className={`${cardBg} cursor-pointer hover:scale-[1.03] transition-transform duration-200 p-6 rounded-2xl shadow flex items-center justify-between`}
          >
            <div>
              <h2 className="text-xl font-semibold mb-1">Active Deals</h2>
              <p className="text-3xl font-bold text-yellow-500">40</p>
            </div>
            <BarChart3 size={40} className="text-yellow-500 opacity-80" />
          </div>
        </div>
      </div>

      {/* ======================
          MODAL SECTION
      ======================= */}
      {selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
          <div
            className={`${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            } p-6 rounded-2xl shadow-xl w-[90%] max-w-lg relative transform scale-100 transition-transform duration-300`}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <Info size={24} className="text-blue-500" />
              <h2 className="text-2xl font-semibold">{selectedReport}</h2>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              Detailed analytics for <strong>{selectedReport}</strong>.
            </p>

            {/* Table */}
            <div
              className={`overflow-x-auto border rounded-lg mb-4 ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <table className="w-full text-sm">
                <thead
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  } text-left`}
                >
                  <tr>
                    {breakdownData.length > 0 &&
                      Object.keys(breakdownData[0])
                        .filter((h) => h !== "progress")
                        .map((header) => (
                          <th key={header} className="px-4 py-2 capitalize">
                            {header}
                          </th>
                        ))}
                    <th className="px-4 py-2">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdownData.map((row, i) => (
                    <tr
                      key={i}
                      className={`${
                        darkMode
                          ? "odd:bg-gray-800 even:bg-gray-900"
                          : "odd:bg-gray-50 even:bg-white"
                      }`}
                    >
                      {Object.entries(row)
                        .filter(([key]) => key !== "progress")
                        .map(([key, value]) => (
                          <td key={key} className="px-4 py-2">
                            {value}
                          </td>
                        ))}
                      <td className="px-4 py-2">
                        <div className="w-full bg-gray-300 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-700 ${getProgressColor(
                              row.progress
                            )}`}
                            style={{ width: `${row.progress}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                <FileDown size={16} /> Export Report
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
