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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FarmhouseSlots from "./FarmHouseSlots";

const API_BASE = "http://31.97.206.144:5124/api";
const ITEMS_PER_PAGE = 10;

const Farmhouses = ({ darkMode }) => {
  const navigate = useNavigate();
  const [showSlots, setShowSlots] = useState(false);
  const [FarmhouseId, setFarmhouseId] = useState();

  const [farmhouses, setFarmhouses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterBookingFor, setFilterBookingFor] = useState("");
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
    await axios.delete(`${API_BASE}/delete/${id}`);
    fetchFarmhouses();
  };

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    return farmhouses.filter((f) => {
      const s = search.toLowerCase();
      return (
        (f.name?.toLowerCase().includes(s) ||
          f.address?.toLowerCase().includes(s)) &&
        (!filterBookingFor || f.bookingFor === filterBookingFor)
      );
    });
  }, [farmhouses, search, filterBookingFor]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================= EXPORT ================= */
  const exportCSV = () => {
    const headers = ["SNO", "Name", "Address", "BookingFor", "PricePerDay"];
    const rows = filteredData.map((f, i) => [
      i + 1,
      f.name,
      f.address,
      f.bookingFor,
      f.pricePerDay,
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
      className={`min-h-screen p-8 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto">

        {/* PREMIUM HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-4xl font-bold flex items-center gap-3">
              🏡 Farmhouses
            </h2>
            <p className="opacity-70 mt-1">
              Manage farmhouse listings, bookings and pricing
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/admin/farmhouses/create")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
              bg-gradient-to-r from-blue-500 to-indigo-600
              hover:scale-105 transition shadow-xl text-white"
            >
              <FaPlus />
              Add Farmhouse
            </button>

            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
              bg-gradient-to-r from-emerald-500 to-emerald-700
              hover:scale-105 transition shadow-xl text-white"
            >
              <FaFileExport />
              Export
            </button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div
          className={`mb-8 p-5 rounded-2xl border shadow-lg backdrop-blur-md
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
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black"
                placeholder="Search farmhouse..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter */}
            <select
              className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 outline-none text-black font-medium"
              value={filterBookingFor}
              onChange={(e) => setFilterBookingFor(e.target.value)}
            >
              <option value="">All Bookings</option>
              <option value="birthday">Birthday</option>
              <option value="party">Party</option>
              <option value="stay">Stay</option>
            </select>
          </div>
        </div>

        {/* PREMIUM TABLE */}
        <div
          className={`rounded-2xl overflow-hidden border shadow-2xl ${
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
                {["#", "Farmhouse", "Booking", "Price", "Booked", "Actions"].map(
                  (h) => (
                    <th key={h} className="px-6 py-4 text-left font-bold border-b">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center opacity-60">
                    Loading farmhouses...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center opacity-60">
                    No farmhouses found
                  </td>
                </tr>
              ) : (
                paginatedData.map((f, index) => (
                  <tr
                    key={f._id}
                    className="border-b hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 font-semibold">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="font-bold">{f.name}</div>
                      <div className="text-sm opacity-60">{f.address}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {f.bookingFor}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-emerald-600">
                      ₹{f.pricePerDay}
                    </td>

                    <td className="px-6 py-4">
                      {f.bookedSlots?.length || 0}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 flex gap-4 text-lg">
                      <FaEye
                        className="cursor-pointer text-emerald-500 hover:scale-125 transition"
                        onClick={() => navigate(`/admin/farmhouses/${f._id}`)}
                      />

                      <FaBox
                        className="cursor-pointer text-indigo-500 hover:scale-125 transition"
                        onClick={() => {
                          setFarmhouseId(f._id);
                          setShowSlots(true);
                        }}
                      />

                      <FaEdit
                        className="cursor-pointer text-blue-500 hover:scale-125 transition"
                        onClick={() =>
                          navigate(`/admin/farmhouses/edit/${f._id}`)
                        }
                      />

                      <FaTrash
                        className="cursor-pointer text-red-500 hover:scale-125 transition"
                        onClick={() => deleteFarmhouse(f._id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PREMIUM PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-8">
            <p className="opacity-70 font-medium">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-5 py-2 rounded-xl border font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40"
              >
                Prev
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-5 py-2 rounded-xl border font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40"
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
