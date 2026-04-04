import React, { useState } from "react";
import { mockData } from "../../MockData/MockData";

const statusColors = {
  new: "bg-blue-400",
  contacted: "bg-orange-400",
  qualified: "bg-purple-500",
  converted: "bg-green-500",
  lost: "bg-red-500",
};

const dealStatusColors = {
  active: "bg-yellow-400",
  close: "bg-gray-400",
};

export default function Leads({ darkMode, searchQuery = "" }) {
  const [leads, setLeads] = useState(mockData);
  const [open, setOpen] = useState(false);

  const [currentLead, setCurrentLead] = useState({
    name: "",
    company: "",
    status: "",
    source: "",
    conversionDate: "",
    dealStatus: "",
    receivedAmount: "",
  });

  // Filtering  leads using searchQuery based on name and compnay
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpen = (lead = currentLead) => {
    setCurrentLead(lead);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (currentLead.id) {
      setLeads(leads.map((l) => (l.id === currentLead.id ? currentLead : l)));
    } else {
      const newId = Math.max(...leads.map((l) => l.id), 0) + 1;
      setLeads([...leads, { ...currentLead, id: newId }]);
    }
    handleClose();
  };

  return (
    <div
      className={`p-3 sm:p-6 transition-all duration-300 ${
        darkMode ? "bg-[#171821] text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/*......................................... Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1
            className={`text-xl sm:text-2xl font-bold 
              ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Leads
          </h1>
          <p
            className={`text-xs sm:text-sm 
              ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Manage your sales leads
          </p>
        </div>

        {/*.............................................. Add lead button */}
        <button
          onClick={() => handleOpen()}
          className="bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base hover:bg-blue-500 transition"
        >
          + Add Lead
        </button>
      </div>

      {/* ........................Table --> {wrap in small devices, so user can easily scroll it and view}*/}
      <div
        className={`overflow-x-scroll border rounded-lg shadow-sm 
          ${darkMode ? "border-gray-700" : "border-gray-300"}`}
      >


        <table className="w-full text-xs sm:text-sm text-left">

          {/* ...........................................Table heading */}
          <thead
            className={`
              ${
                darkMode
                  ? "bg-gray-800 text-gray-200"
                  : "bg-gray-100 text-gray-800"
              }`}
          >
            <tr>
              {[
                "ID",
                "Name",
                "Company",
                "Status",
                "Source",
                "Conversion Date",
                "Deal Status",
                "Received Amount",
                "Action",
              ].map((h) => (

                //whitespace-nowrap --> stops the text from wrapping and ensure it be in 1 line only
                <th key={h} className="py-2 px-3 sm:px-4 whitespace-nowrap"> 
                  {h}
                </th>
              ))}
            </tr>
          </thead>



          {/* .............................table body */}
          <tbody>
            {filteredLeads.map((lead) => (
              <tr
                key={lead.id}

                // border bottom side only for clear table look
                className={`border-b 
                  ${ 
                    darkMode
                    ? "border-gray-700 hover:bg-gray-800"
                    : "border-gray-300 hover:bg-gray-200"
                    }`
                  }
              >


                <td className="py-2 px-3 sm:px-4">{lead.id}</td>

                <td className="py-2 px-3 sm:px-4 font-medium whitespace-nowrap">
                  {lead.name}
                </td>

                <td className="py-2 px-3 sm:px-4 whitespace-nowrap">
                  {lead.company}
                </td>

                <td className="py-2 px-3 sm:px-4">
                  <span
                    className={`text-white text-[10px] sm:text-xs px-2 py-1 rounded-full capitalize ${
                      statusColors[lead.status] || "bg-gray-400"
                    }`}
                  >
                    {lead.status}
                  </span>
                </td>

                <td className="py-2 px-3 sm:px-4 whitespace-nowrap">
                  {lead.source}
                </td>
                <td className="py-2 px-3 sm:px-4 whitespace-nowrap">
                  {lead.conversionDate}
                </td>

                <td className="py-2 px-3 sm:px-4">
                  <span
                    className={`text-white text-[10px] sm:text-xs px-2 py-1 rounded-full capitalize ${
                      dealStatusColors[lead.dealStatus] || "bg-gray-400"
                    }`}
                  >
                    {lead.dealStatus}
                  </span>
                </td>

                <td className="py-2 px-3 sm:px-4 font-semibold text-green-500 whitespace-nowrap">
                  ₹ {" "}
                  {lead.receivedAmount
                    ? lead.receivedAmount.toLocaleString()
                    : "---"}
                </td>

                <td className="py-2 px-3 sm:px-4 text-center">
                  <button
                    onClick={() => handleOpen(lead)}
                    className="text-blue-600 hover:underline text-xs sm:text-sm"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}



            {/* ...........filter hte leads based on search query */}
            {filteredLeads.length === 0 && (
              <tr>
                <td
                  colSpan="9"
                  className="py-4 text-center text-gray-400 text-sm"
                >
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>






      {/*............................................. DIALOG BOX */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4">
          <div
            className={`w-full max-w-sm p-4 sm:p-6 rounded-xl shadow-lg space-y-4 ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-lg sm:text-xl font-semibold">
              {currentLead.id ? "Edit Lead" : "Add New Lead"}
            </h2>

            <div className="flex flex-col gap-2">
              {["name", "company", "source"].map((key) => (
                <input
                  key={key}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={currentLead[key]}
                  onChange={(e) =>
                    setCurrentLead({ ...currentLead, [key]: e.target.value })
                  }
                  className={`border rounded-lg px-3 py-2 text-sm ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                />
              ))}

              <select
                value={currentLead.status}
                onChange={(e) =>
                  setCurrentLead({ ...currentLead, status: e.target.value })
                }
                className={`border rounded-lg px-3 py-2 text-sm ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              >
                <option value="">Select Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>

              <input
                type="date"
                value={currentLead.conversionDate}
                onChange={(e) =>
                  setCurrentLead({
                    ...currentLead,
                    conversionDate: e.target.value,
                  })
                }
                className={`border rounded-lg px-3 py-2 text-sm ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />

              <select
                value={currentLead.dealStatus}
                onChange={(e) =>
                  setCurrentLead({ ...currentLead, dealStatus: e.target.value })
                }
                className={`border rounded-lg px-3 py-2 text-sm ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              >
                <option value="">Select Deal Status</option>
                <option value="active">Active</option>
                <option value="close">Close</option>
              </select>

              <input
                type="number"
                placeholder="Received Amount"
                value={currentLead.receivedAmount}
                onChange={(e) =>
                  setCurrentLead({
                    ...currentLead,
                    receivedAmount: Number(e.target.value),
                  })
                }
                className={`border rounded-lg px-3 py-2 text-sm ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleClose}
                className={`px-4 py-2 rounded-lg border text-sm ${
                  darkMode
                    ? "border-gray-500 text-gray-300 hover:bg-gray-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
