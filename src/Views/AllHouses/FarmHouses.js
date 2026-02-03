import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaFileExport, FaEye, FaPlus, FaBox } from "react-icons/fa";
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
        (f.name.toLowerCase().includes(s) ||
          f.address.toLowerCase().includes(s)) &&
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
      f.pricePerDay
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
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
      {/* Header */}
      <div className="flex justify-between mb-5">
        <h2 className="text-3xl font-bold">🏡 Farmhouses</h2>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/farmhouses/create")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <FaPlus /> Add
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
          >
            <FaFileExport /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`mb-4 p-4 rounded-xl flex gap-4 ${darkMode ? "bg-gray-800" : "bg-white shadow"
          }`}
      >
        <input
          className="px-4 py-2 rounded-lg bg-white text-black w-64"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 rounded-lg bg-white text-black"
          value={filterBookingFor}
          onChange={(e) => setFilterBookingFor(e.target.value)}
        >
          <option value="">All Bookings</option>
          <option value="birthday">Birthday</option>
          <option value="party">Party</option>
          <option value="stay">Stay</option>
        </select>
      </div>

      {/* Table */}
      <div className={`overflow-x-auto rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow"}`}>
        <table className="min-w-full text-sm">
          <thead className={darkMode ? "bg-gray-700" : "bg-gray-200"}>
            <tr>
              {["S No", "Name", "Booking", "Price", "Booked", "Actions"].map((h) => (
                <th key={h} className="p-4 text-left uppercase text-xs tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center opacity-70">
                  Loading...
                </td>
              </tr>
            ) : (
              paginatedData.map((f, index) => (
                <tr
                  key={f._id}
                  className={`border-b hover:bg-blue-500/10 transition ${darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                >
                  <td className="p-4">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="p-4 font-medium">{f.name}</td>
                  <td className="p-4">{f.bookingFor}</td>
                  <td className="p-4 font-semibold">₹{f.pricePerDay}</td>
                  <td className="p-4 text-center">{f.bookedSlots.length}</td>
                  <td className="p-4 flex gap-4">
                    <FaEye
                      className="text-emerald-500 cursor-pointer"
                      onClick={() => {
                        navigate(`/admin/farmhouses/${f._id}`);
                        setFarmhouseId(f._id);
                      }}
                    />
                    <button
                      onClick={() => {
                        setFarmhouseId(f._id);
                        setShowSlots(true);
                      }}
                      className="text-blue-600 underline"
                    >
                      <FaBox/>
                    </button>

                    <FaEdit
                      className="text-blue-500 cursor-pointer"
                      onClick={() =>
                        navigate(`/admin/farmhouses/edit/${f._id}`)
                      }
                    />
                    <FaTrash
                      className="text-red-500 cursor-pointer"
                      onClick={() => deleteFarmhouse(f._id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-5 py-2 rounded-lg bg-gray-400 disabled:opacity-40"
        >
          Prev
        </button>
        <span className="font-semibold">
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-5 py-2 rounded-lg bg-gray-400 disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <FarmhouseSlots
        open={showSlots}
        onClose={() => setShowSlots(false)}
        farmhouseId={FarmhouseId}
        darkMode={false}
      />
    </div>
  );
};

export default Farmhouses;
