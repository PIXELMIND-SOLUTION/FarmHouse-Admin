import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaFileExport,
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = "http://31.97.206.144:5124/api/auth/users";
const PAGE_SIZE = 8;

const Users = ({ darkMode }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

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
        <div className="h-14 w-14 border-4 border-lime-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-8 ${darkMode
        ? "bg-gradient-to-br from-stone-900 via-stone-950 to-black text-white"
        : "bg-gradient-to-br from-lime-100 via-white to-lime-200"
        }`}
    >
      <div className="max-w-7xl mx-auto">

        {/* PREMIUM HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className={`text-4xl font-bold flex items-center gap-3 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
              <FaUsers className={darkMode ? 'text-lime-500' : 'text-lime-600'} />
              Users Management
            </h2>
            <p className={`${darkMode ? 'text-stone-400' : 'text-stone-600'} mt-1`}>
              Monitor, filter and export platform users
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
            bg-gradient-to-r from-lime-500 to-lime-700
            hover:scale-105 transition shadow-xl text-white"
          >
            <FaFileExport />
            Export CSV
          </button>
        </div>

        {/* FILTER BAR */}
        <div
          className={`mb-8 p-5 rounded-2xl border shadow-lg backdrop-blur-md
          ${darkMode
              ? "bg-stone-800/60 border-stone-700"
              : "bg-white/80 border-lime-300"
            }`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`} />
              <input
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-2 outline-none
                  ${darkMode 
                    ? 'bg-stone-900 border-stone-700 text-white focus:border-lime-500 focus:ring-lime-500/50' 
                    : 'bg-white border-lime-300 text-stone-900 focus:border-lime-500 focus:ring-lime-200'
                  }`}
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className={`px-4 py-3 rounded-xl border-2 outline-none font-medium
                ${darkMode 
                  ? 'bg-stone-900 border-stone-700 text-white focus:border-lime-500' 
                  : 'bg-white border-lime-300 text-stone-900 focus:border-lime-500'
                }`}
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
          className={`rounded-2xl overflow-hidden border shadow-2xl ${darkMode
            ? "bg-stone-900 border-stone-700"
            : "bg-white border-lime-300"
            }`}
        >
          <table className="w-full">
            <thead
              className={`text-sm uppercase tracking-wider ${darkMode ? "bg-stone-800" : "bg-lime-100"
                }`}
            >
              <tr>
                {["#", "User", "Email", "Phone", "Gender", "Location", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-left font-bold border-b ${
                        darkMode ? 'border-stone-700 text-lime-400' : 'border-lime-200 text-lime-700'
                      }`}
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
                  <td colSpan="7" className={`py-12 text-center ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
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
                      className={`border-b transition ${
                        darkMode 
                          ? 'border-stone-800 hover:bg-stone-800 text-white' 
                          : 'border-lime-100 hover:bg-lime-50 text-stone-900'
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </td>

                      {/* USER */}
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-r from-lime-500 to-lime-600 flex items-center justify-center text-white font-bold shadow">
                          {initials}
                        </div>
                        <span className="font-semibold">{name}</span>
                      </td>

                      <td className="px-6 py-4">{u.email}</td>

                      <td className="px-6 py-4 font-medium">
                        {u.phoneNumber}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          darkMode 
                            ? 'bg-lime-500/20 text-lime-400' 
                            : 'bg-lime-100 text-lime-700'
                        }`}>
                          {u.gender}
                        </span>
                      </td>

                      <td className={`px-6 py-4 text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                        {u.liveLocation?.coordinates?.[1]
                          ? `${u.liveLocation.coordinates[1]}, ${u.liveLocation.coordinates[0]}`
                          : "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-3">

                          {/* VIEW */}
                          <button
                            onClick={() => navigate(`/admin/user/${u._id}`)}
                            className={`p-2.5 rounded-xl transition ${
                              darkMode 
                                ? 'bg-lime-500/10 text-lime-400 hover:bg-lime-600 hover:text-white' 
                                : 'bg-lime-100 text-lime-600 hover:bg-lime-600 hover:text-white'
                            }`}
                          >
                            <FaEye />
                          </button>

                          {/* EDIT */}
                          <button
                            onClick={() => navigate(`/admin/user/update/${u._id}`)}
                            className={`p-2.5 rounded-xl transition ${
                              darkMode 
                                ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-600 hover:text-white' 
                                : 'bg-amber-100 text-amber-600 hover:bg-amber-600 hover:text-white'
                            }`}
                          >
                            <FaEdit />
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={async () => {
                              if (!window.confirm("Delete this user permanently?")) return;

                              try {
                                await axios.delete(
                                  `http://31.97.206.144:5124/api/auth/user/${u._id}`
                                );

                                setUsers((prev) =>
                                  prev.filter((x) => x._id !== u._id)
                                );
                              } catch (err) {
                                alert("Failed to delete user");
                              }
                            }}
                            className="p-2.5 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition"
                          >
                            <FaTrash />
                          </button>

                        </div>
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
            <p className={`font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-5 py-2 rounded-xl border font-semibold transition disabled:opacity-40 ${
                  darkMode 
                    ? 'border-stone-700 hover:bg-stone-800' 
                    : 'border-lime-300 hover:bg-lime-100'
                }`}
              >
                <FaChevronLeft />
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`px-5 py-2 rounded-xl border font-semibold transition disabled:opacity-40 ${
                  darkMode 
                    ? 'border-stone-700 hover:bg-stone-800' 
                    : 'border-lime-300 hover:bg-lime-100'
                }`}
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