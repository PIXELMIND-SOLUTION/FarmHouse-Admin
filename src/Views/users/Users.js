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
        <div className="h-14 w-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
              <FaUsers className="text-blue-600" />
              Users Management
            </h2>
            <p className="opacity-70 mt-1">
              Monitor, filter and export platform users
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
            bg-gradient-to-r from-emerald-500 to-emerald-700
            hover:scale-105 transition shadow-xl text-white"
          >
            <FaFileExport />
            Export CSV
          </button>
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
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black"
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 outline-none text-black font-medium"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
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
                {["#", "User", "Email", "Phone", "Gender", "Location"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left font-bold border-b"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center opacity-60">
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u, index) => {
                  const name =
                    u.fullName || `${u.firstName} ${u.lastName}`;
                  const initials = name?.charAt(0)?.toUpperCase();

                  return (
                    <tr
                      key={u._id}
                      className="border-b hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="px-6 py-4 font-semibold">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </td>

                      {/* USER */}
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow">
                          {initials}
                        </div>
                        <span className="font-semibold">{name}</span>
                      </td>

                      <td className="px-6 py-4">{u.email}</td>

                      <td className="px-6 py-4 font-medium">
                        {u.phoneNumber}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {u.gender}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm opacity-70">
                        {u.liveLocation?.coordinates?.[1]
                          ? `${u.liveLocation.coordinates[1]}, ${u.liveLocation.coordinates[0]}`
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })
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
                <FaChevronLeft />
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-5 py-2 rounded-xl border font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40"
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
