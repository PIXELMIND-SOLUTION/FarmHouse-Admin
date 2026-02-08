import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaEdit,
  FaFileExport,
  FaEye,
  FaPlus,
  FaBox,
  FaSearch,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FarmhouseSlots from "./FarmHouseSlots";

const API_BASE = "http://31.97.206.144:5124/api";
const ITEMS_PER_PAGE = 10;

const Farmhouses = ({ darkMode }) => {
  const navigate = useNavigate();
  const [showSlots, setShowSlots] = useState(false);
  const [FarmhouseId, setFarmhouseId] = useState();
  const [statusUpdateId, setStatusUpdateId] = useState(null);
  const [statusReason, setStatusReason] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState(null);

  const [farmhouses, setFarmhouses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterBookingFor, setFilterBookingFor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= FETCH ================= */
  const fetchFarmhouses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/all-farmhouse`);
      setFarmhouses(res.data.farmhouses || []);
    } catch {
      alert("Failed to load farmhouses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmhouses();
  }, []);

  /* ================= DELETE ================= */
  const deleteFarmhouse = async (id) => {
    if (!window.confirm("Delete this farmhouse?")) return;
    await axios.delete(`${API_BASE}/farmhouse/${id}`);
    fetchFarmhouses();
  };

  /* ================= TOGGLE ACTIVE STATUS ================= */
  const toggleActiveStatus = (id, currentStatus) => {
    setStatusUpdateId(id);
    setNewStatus(!currentStatus);
    setStatusReason("");
    setShowStatusModal(true);
  };

  const confirmToggleStatus = async () => {
    if (!statusReason.trim()) {
      alert("Please provide a reason for the status change");
      return;
    }

    try {
      await axios.put(`${API_BASE}/${statusUpdateId}/toggle-active`, {
        active: newStatus,
        reason: statusReason.trim()
      });
      
      // Update local state
      setFarmhouses(prev => prev.map(farm => 
        farm._id === statusUpdateId 
          ? { ...farm, active: newStatus } 
          : farm
      ));
      
      setShowStatusModal(false);
      setStatusReason("");
      setStatusUpdateId(null);
      setNewStatus(null);
      
      alert(`Farmhouse ${newStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      alert("Failed to update status. Please try again.");
      console.error("Status update error:", error);
    }
  };

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    return farmhouses.filter((f) => {
      const s = search.toLowerCase();
      const matchesSearch = f.name?.toLowerCase().includes(s) ||
        f.address?.toLowerCase().includes(s);
      
      const matchesBookingFor = !filterBookingFor || f.bookingFor === filterBookingFor;
      
      const matchesStatus = !filterStatus || 
        (filterStatus === "active" && f.active === true) ||
        (filterStatus === "inactive" && f.active === false);
      
      return matchesSearch && matchesBookingFor && matchesStatus;
    });
  }, [farmhouses, search, filterBookingFor, filterStatus]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================= EXPORT ================= */
  const exportCSV = () => {
    const headers = ["SNO", "Name", "Address", "BookingFor", "PricePerDay", "Status"];
    const rows = filteredData.map((f, i) => [
      i + 1,
      f.name,
      f.address,
      f.bookingFor,
      f.pricePerDay,
      f.active ? "Active" : "Inactive"
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((r) => (csv += r.join(",") + "\n"));

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "farmhouses.csv";
    link.click();
  };

  return (
    <div
      className={`min-h-screen p-4 md:p-8 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200"
      }`}
    >
      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 w-full max-w-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className="text-xl font-bold mb-4">
              {newStatus ? "Activate Farmhouse" : "Deactivate Farmhouse"}
            </h3>
            
            <p className="mb-4 opacity-80">
              {newStatus 
                ? "Please provide a reason for activating this farmhouse:" 
                : "Please provide a reason for deactivating this farmhouse:"}
            </p>
            
            <textarea
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              placeholder="Enter reason..."
              className={`w-full p-3 rounded-xl border-2 mb-4 min-h-[120px] ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-white" 
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setStatusReason("");
                  setStatusUpdateId(null);
                }}
                className={`px-5 py-2 rounded-xl font-medium ${
                  darkMode 
                    ? "bg-gray-700 hover:bg-gray-600" 
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              
              <button
                onClick={confirmToggleStatus}
                className={`px-5 py-2 rounded-xl font-medium text-white ${
                  newStatus 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">

        {/* PREMIUM HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              🏡 Farmhouses
            </h2>
            <p className="opacity-70 mt-1 text-sm md:text-base">
              Manage farmhouse listings, bookings and pricing
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/admin/farmhouses/create")}
              className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl font-semibold
              bg-gradient-to-r from-blue-500 to-indigo-600
              hover:scale-105 transition shadow-xl text-white text-sm md:text-base"
            >
              <FaPlus />
              Add Farmhouse
            </button>

            <button
              onClick={exportCSV}
              className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl font-semibold
              bg-gradient-to-r from-emerald-500 to-emerald-700
              hover:scale-105 transition shadow-xl text-white text-sm md:text-base"
            >
              <FaFileExport />
              Export
            </button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div
          className={`mb-8 p-4 md:p-5 rounded-2xl border shadow-lg backdrop-blur-md
          ${
            darkMode
              ? "bg-gray-800/60 border-gray-700"
              : "bg-white/80 border-gray-300"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black"
                }`}
                placeholder="Search farmhouse..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Booking For Filter */}
            <select
              className={`px-4 py-3 rounded-xl border-2 outline-none font-medium ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "border-gray-300 focus:border-blue-500 text-black"
              }`}
              value={filterBookingFor}
              onChange={(e) => setFilterBookingFor(e.target.value)}
            >
              <option value="">All Bookings</option>
              <option value="birthday">Birthday</option>
              <option value="Party">Party</option>
              <option value="stay">Stay</option>
            </select>

            {/* Status Filter */}
            <select
              className={`px-4 py-3 rounded-xl border-2 outline-none font-medium ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "border-gray-300 focus:border-blue-500 text-black"
              }`}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* PREMIUM TABLE */}
        <div className="overflow-x-auto">
          <div
            className={`rounded-2xl overflow-hidden border shadow-2xl min-w-[800px] ${
              darkMode
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-300"
            }`}
          >
            <table className="w-full">
              <thead
                className={`text-sm uppercase tracking-wider ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <tr>
                  {["#", "Farmhouse", "Booking", "Price", "Status", "Booked", "Actions"].map(
                    (h) => (
                      <th key={h} className="px-4 md:px-6 py-3 md:py-4 text-left font-bold border-b whitespace-nowrap">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center opacity-60">
                      Loading farmhouses...
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center opacity-60">
                      No farmhouses found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((f, index) => (
                    <tr
                      key={f._id}
                      className="border-b hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:text-white transition"
                    >
                      <td className="px-4 md:px-6 py-3 md:py-4 font-semibold whitespace-nowrap">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>

                      {/* Name */}
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="font-bold text-sm md:text-base">{f.name}</div>
                        <div className="text-xs md:text-sm opacity-60">{f.address}</div>
                      </td>

                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${
                          f.bookingFor === 'birthday' ? 'bg-pink-100 text-pink-700' :
                          f.bookingFor === 'party' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {f.bookingFor}
                        </span>
                      </td>

                      <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-emerald-600 whitespace-nowrap">
                        ₹{f.pricePerDay}
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleActiveStatus(f._id, f.active)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                              f.active
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {f.active ? (
                              <>
                                <FaToggleOn className="text-lg" />
                                Active
                              </>
                            ) : (
                              <>
                                <FaToggleOff className="text-lg" />
                                Inactive
                              </>
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${
                          (f.bookedSlots?.length || 0) > 0 
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {f.bookedSlots?.length || 0}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex gap-3 md:gap-4 text-base md:text-lg">
                          <FaEye
                            className="cursor-pointer text-emerald-500 hover:scale-125 transition hover:text-emerald-600"
                            title="View Details"
                            onClick={() => navigate(`/admin/farmhouses/${f._id}`)}
                          />

                          <FaBox
                            className="cursor-pointer text-indigo-500 hover:scale-125 transition hover:text-indigo-600"
                            title="Manage Slots"
                            onClick={() => {
                              setFarmhouseId(f._id);
                              setShowSlots(true);
                            }}
                          />

                          <FaEdit
                            className="cursor-pointer text-blue-500 hover:scale-125 transition hover:text-blue-600"
                            title="Edit Farmhouse"
                            onClick={() =>
                              navigate(`/admin/farmhouses/edit/${f._id}`)
                            }
                          />

                          <FaTrash
                            className="cursor-pointer text-red-500 hover:scale-125 transition hover:text-red-600"
                            title="Delete Farmhouse"
                            onClick={() => deleteFarmhouse(f._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PREMIUM PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            <p className="opacity-70 font-medium text-sm md:text-base">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} farmhouses
            </p>

            <div className="flex gap-2 md:gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-4 md:px-5 py-2 rounded-xl border font-semibold transition ${
                  darkMode
                    ? "hover:bg-gray-700 disabled:opacity-40"
                    : "hover:bg-gray-200 disabled:opacity-40"
                }`}
              >
                Prev
              </button>

              <div className="flex items-center">
                <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`px-4 md:px-5 py-2 rounded-xl border font-semibold transition ${
                  darkMode
                    ? "hover:bg-gray-700 disabled:opacity-40"
                    : "hover:bg-gray-200 disabled:opacity-40"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <FarmhouseSlots
        open={showSlots}
        onClose={() => setShowSlots(false)}
        farmhouseId={FarmhouseId}
        darkMode={darkMode}
      />
    </div>
  );
};

export default Farmhouses;