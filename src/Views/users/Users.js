import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaFileExport,
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
} from "react-icons/fa";

const API_URL = "http://31.97.206.144:5124/api/auth/users";
const PAGE_SIZE = 8;

const Users = ({ darkMode }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(API_URL);
        setUsers(res.data?.users || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  /* ================= FILTER + SEARCH ================= */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();

      const matchSearch =
        u.firstName?.toLowerCase().includes(q) ||
        u.lastName?.toLowerCase().includes(q) ||
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phoneNumber?.includes(q);

      const matchGender =
        genderFilter === "all" || u.gender === genderFilter;

      return matchSearch && matchGender;
    });
  }, [users, search, genderFilter]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const headers = [
      "S.No",
      "Full Name",
      "Email",
      "Phone",
      "Gender",
      "Latitude",
      "Longitude",
    ];

    const rows = filteredUsers.map((u, i) => [
      i + 1,
      u.fullName || `${u.firstName} ${u.lastName}`,
      u.email,
      u.phoneNumber,
      u.gender,
      u.liveLocation?.coordinates?.[1] || "",
      u.liveLocation?.coordinates?.[0] || "",
    ]);

    const csv =
      headers.join(",") +
      "\n" +
      rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users.csv";
    link.click();
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-b-2 border-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <FaUsers className="text-blue-500" />
              Users Management
            </h2>
            <p className="text-sm opacity-70">
              View and manage all registered users
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <FaFileExport />
            Export CSV
          </button>
        </div>

        {/* FILTER BAR */}
        <div
          className={`p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 ${
            darkMode ? "bg-gray-800" : "bg-white shadow"
          }`}
        >
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 rounded-lg border text-black"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* TABLE */}
        <div
          className={`rounded-xl overflow-x-auto ${
            darkMode ? "bg-gray-800" : "bg-white shadow"
          }`}
        >
          <table className="w-full text-sm">
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-200"}>
              <tr>
                {[
                  "S.No",
                  "Name",
                  "Email",
                  "Phone",
                  "Gender",
                  "Location",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left uppercase text-xs tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center opacity-60">
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u, index) => (
                  <tr
                    key={u._id}
                    className={`border-b hover:bg-blue-500/10 transition ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <td className="px-4 py-3">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {u.fullName || `${u.firstName} ${u.lastName}`}
                    </td>

                    <td className="px-4 py-3">{u.email}</td>

                    <td className="px-4 py-3">{u.phoneNumber}</td>

                    <td className="px-4 py-3 capitalize">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {u.gender}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs opacity-70">
                      {u.liveLocation?.coordinates?.[1]
                        ? `${u.liveLocation.coordinates[1]}, ${u.liveLocation.coordinates[0]}`
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm opacity-70">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg border disabled:opacity-40"
              >
                <FaChevronLeft />
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg border disabled:opacity-40"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
