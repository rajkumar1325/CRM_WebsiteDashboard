import React, { useState } from "react";
import { dealsData } from "../../MockData/MockData.jsx"; // Import mock data for deals

// Component accepts darkMode (theme) and searchQuery (search text) as props
const Deals = ({ darkMode, searchQuery }) => {
  // State to keep track of the currently selected deal for modal view
  const [selectedDeal, setSelectedDeal] = useState(null);

  // Function to open the modal for a specific deal
  const handleView = (deal) => {
    setSelectedDeal(deal);
  };

  // Function to close the modal
  const closeDialog = () => {
    setSelectedDeal(null);
  };

  // ==============================
  // 🔍 FILTER LOGIC
  // ==============================
  // Filters deals based on the search query (case-insensitive)
  const filteredDeals = dealsData.filter((deal) => {
    const query = searchQuery?.toLowerCase() || "";
    return (
      deal.name.toLowerCase().includes(query) ||
      deal.company.toLowerCase().includes(query) ||
      deal.contactPerson.toLowerCase().includes(query) ||
      deal.stage.toLowerCase().includes(query) ||
      deal.status.toLowerCase().includes(query)
    );
  });

  return (
    // Outer container - handles theme colors
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#171821] text-white" : "bg-gray-100 text-gray-900"
      } p-8`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">Deals Dashboard</h1>

        {/* Info text showing count */}
        <p className="mb-4 text-sm text-gray-400">
          Showing {filteredDeals.length} deal
          {filteredDeals.length !== 1 ? "s" : ""} matching your search.
        </p>

        {/* ==============================
            DEALS GRID (FILTERED)
           ============================== */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className={`p-5 rounded-2xl shadow hover:shadow-lg transition duration-200 border ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Header - deal name and stage badge */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">{deal.name}</h2>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    deal.stage.includes("Won")
                      ? "bg-green-100 text-green-700"
                      : deal.stage.includes("Lost")
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {deal.stage}
                </span>
              </div>

              {/* Deal info (compact view) */}
              <p className="text-sm mb-1">
                <strong>Company:</strong> {deal.company}
              </p>
              <p className="text-sm mb-1">
                <strong>Contact:</strong> {deal.contactPerson}
              </p>
              <p className="text-sm mb-1">
                <strong>Value:</strong> {deal.value}
              </p>
              <p className="text-sm mb-1">
                <strong>Probability:</strong> {deal.probability}%
              </p>
              <p className="text-sm mb-1">
                <strong>Expected Close:</strong> {deal.expectedClose}
              </p>

              {/* Status badge + View button */}
              <div className="mt-3 flex justify-between items-center">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    deal.status === "Won"
                      ? "bg-green-100 text-green-700"
                      : deal.status === "Lost"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {deal.status}
                </span>
                <button
                  onClick={() => handleView(deal)}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition"
                >
                  View
                </button>
              </div>
            </div>
          ))}

          {/* Message when no results match search */}
          {filteredDeals.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-10">
              No deals found for “{searchQuery}”.
            </p>
          )}
        </div>
      </div>

      {/* ==============================
          MODAL / DIALOG BOX
         ============================== */}
      {selectedDeal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            } rounded-xl p-6 w-[90%] max-w-md shadow-lg relative`}
          >
            {/* Close button */}
            <button
              onClick={closeDialog}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            {/* Deal header */}
            <h2 className="text-2xl font-semibold mb-2">{selectedDeal.name}</h2>
            <p className="text-sm text-gray-400 mb-4">
              Deal ID: {selectedDeal.id}
            </p>

            {/* Detailed deal info */}
            <div className="space-y-2 text-sm">
              <p>
                <strong>Company:</strong> {selectedDeal.company}
              </p>
              <p>
                <strong>Contact Person:</strong> {selectedDeal.contactPerson}
              </p>
              <p>
                <strong>Stage:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    selectedDeal.stage.includes("Won")
                      ? "bg-green-100 text-green-700"
                      : selectedDeal.stage.includes("Lost")
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedDeal.stage}
                </span>
              </p>
              <p>
                <strong>Deal Value:</strong>{" "}
                <span className="text-blue-500 font-semibold">
                  {selectedDeal.value}
                </span>
              </p>
              <p>
                <strong>Probability:</strong> {selectedDeal.probability}%
              </p>
              <p>
                <strong>Expected Close:</strong> {selectedDeal.expectedClose}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    selectedDeal.status === "Won"
                      ? "bg-green-100 text-green-700"
                      : selectedDeal.status === "Lost"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {selectedDeal.status}
                </span>
              </p>
              <p>
                <strong>Assigned To:</strong> {selectedDeal.assignedTo}
              </p>
              <p>
                <strong>Notes:</strong> {selectedDeal.notes}
              </p>
            </div>

            {/* Close button */}
            <div className="mt-5 text-center">
              <button
                onClick={closeDialog}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
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

export default Deals;
