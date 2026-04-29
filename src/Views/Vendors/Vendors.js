import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaFileExport,
  FaChevronLeft,
  FaChevronRight,
  FaStore,
  FaEye,
  FaTrash,
  FaTimes,
  FaUser,
  FaImage,
  FaClipboardList,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = "https://backend.vfarmstays.com/api/admin/allvendor";
const DELETE_URL = "https://backend.vfarmstays.com/api/admin/deletevendor";
const PAGE_SIZE = 8;

const Vendors = ({ darkMode }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        const dataArray = res.data?.data || [];
        setApplications(dataArray);
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to load vendor applications.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Filter logic
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const q = search.toLowerCase();
      const applicantName = (app.name || "").toLowerCase();
      const email = (app.email || "").toLowerCase();
      const appId = (app.applicationId || "").toLowerCase();
      const matchSearch =
        applicantName.includes(q) || email.includes(q) || appId.includes(q);

      let matchStatus = true;
      if (statusFilter !== "all") {
        const appStatus = (app.status || "").toLowerCase();
        matchStatus = appStatus === statusFilter.toLowerCase();
      }
      return matchSearch && matchStatus;
    });
  }, [applications, search, statusFilter]);

  const totalPages = Math.ceil(filteredApps.length / PAGE_SIZE);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Export CSV
  const exportCSV = () => {
    const headers = [
      "S.No",
      "Applicant Name",
      "Email",
      "Application ID",
      "Status",
      "Submitted Date",
      "Reviewed Date",
    ];
    const rows = filteredApps.map((app, i) => [
      i + 1,
      app.name || "N/A",
      app.email || "N/A",
      app.applicationId || "N/A",
      app.status || "N/A",
      app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A",
      app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString() : "Not reviewed",
    ]);
    const csv =
      headers.join(",") +
      "\n" +
      rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vendor_applications.csv";
    link.click();
  };

  // Delete application
  const handleDelete = async (id, applicantName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Application from "${applicantName}" will be permanently deleted!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${DELETE_URL}/${id}`);
      setApplications((prev) => prev.filter((app) => app._id !== id));
      Swal.fire("Deleted!", "Application has been deleted.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to delete.", "error");
    }
  };

  // Open modal
  const openModal = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApp(null);
  };

  // Render amenities with icons
  const renderAmenities = (amenities) => {
    if (!amenities || amenities.length === 0) return "None";
    return amenities.map((a, i) => {
      let icon = <FaClipboardList className="inline mr-1" />;
      if (a.toLowerCase().includes("pool")) icon = <FaSwimmingPool className="inline mr-1" />;
      else if (a.toLowerCase().includes("wifi")) icon = <FaWifi className="inline mr-1" />;
      else if (a.toLowerCase().includes("food")) icon = <FaUtensils className="inline mr-1" />;
      return (
        <span key={i} className="inline-flex items-center mr-3 mb-1">
          {icon} {a}
        </span>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-14 w-14 border-4 border-lime-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${
        darkMode
          ? "bg-gradient-to-br from-stone-900 via-stone-950 to-black text-white"
          : "bg-gradient-to-br from-lime-100 via-white to-lime-200"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-3 ${
                darkMode ? "text-lime-400" : "text-lime-700"
              }`}
            >
              <FaStore className={darkMode ? "text-lime-500" : "text-lime-600"} />
              Vendor Applications
            </h2>
            <p className={`${darkMode ? "text-stone-400" : "text-stone-600"} mt-1`}>
              Manage farmhouse vendor applications
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-lime-500 to-lime-700 hover:scale-105 transition shadow-xl text-white"
          >
            <FaFileExport /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div
          className={`mb-8 p-4 rounded-2xl border shadow-lg backdrop-blur-md ${
            darkMode ? "bg-stone-800/60 border-stone-700" : "bg-white/80 border-lime-300"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-stone-400" : "text-stone-500"}`} />
              <input
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none ${
                  darkMode
                    ? "bg-stone-900 border-stone-700 text-white focus:border-lime-500"
                    : "bg-white border-lime-300 text-stone-900 focus:border-lime-500"
                }`}
                placeholder="Search by applicant name, email or application ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className={`px-4 py-3 rounded-xl border-2 outline-none font-medium ${
                darkMode ? "bg-stone-900 border-stone-700 text-white" : "bg-white border-lime-300"
              }`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table – only vendor details, actions: View + Delete */}
        <div
          className={`rounded-2xl overflow-hidden border shadow-2xl ${
            darkMode ? "bg-stone-900 border-stone-700" : "bg-white border-lime-300"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className={`${darkMode ? "bg-stone-800" : "bg-lime-100"}`}>
                <tr>
                  {["#", "Applicant", "Email", "Application ID", "Status", "Submitted", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-4 text-left text-xs sm:text-sm font-bold border-b ${
                        darkMode ? "border-stone-700 text-lime-400" : "border-lime-200 text-lime-700"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedApps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  paginatedApps.map((app, idx) => {
                    const applicantName = app.name || "N/A";
                    const status = app.status || "pending";
                    const statusColor =
                      status === "approved"
                        ? "bg-green-100 text-green-700"
                        : status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700";

                    return (
                      <tr
                        key={app._id}
                        className={`border-b transition ${
                          darkMode ? "border-stone-800 hover:bg-stone-800" : "border-lime-100 hover:bg-lime-50"
                        }`}
                      >
                        <td className="px-4 py-4 font-semibold">{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-lime-500 to-lime-600 flex items-center justify-center text-white font-bold">
                              {applicantName.charAt(0).toUpperCase()}
                            </div>
                            <span>{applicantName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">{app.email}</td>
                        <td className="px-4 py-4 text-sm font-mono">{app.applicationId || "N/A"}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(app)}
                              className="p-2 rounded-lg bg-lime-100 text-lime-600 hover:bg-lime-600 hover:text-white transition"
                              title="View Farmhouse Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleDelete(app._id, applicantName)}
                              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                              title="Delete"
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
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            <p className="text-sm">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 rounded-xl border hover:bg-lime-100 disabled:opacity-40"
              >
                <FaChevronLeft />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 rounded-xl border hover:bg-lime-100 disabled:opacity-40"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========== MODAL – FARMHOUSE DETAILS (NO EDIT BUTTON) ========== */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto">
          <div
            className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
              darkMode ? "bg-stone-800 text-white" : "bg-white text-stone-800"
            }`}
          >
            {/* Modal Header */}
            <div className={`sticky top-0 flex justify-between items-center p-5 border-b ${darkMode ? "border-stone-700" : "border-lime-200"} bg-inherit z-10`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-lime-500 to-lime-600 flex items-center justify-center text-white font-bold">
                  {selectedApp.name?.charAt(0).toUpperCase() || "F"}
                </div>
                <h3 className="text-xl font-bold">Farmhouse Details</h3>
              </div>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-stone-700">
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Farmhouse Info */}
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <h4 className="font-bold text-lime-500 flex items-center gap-2"><FaStore /> Farmhouse</h4>
                  </div>
                  <div><span className="font-semibold">Name:</span> {selectedApp.submittedData?.name || "N/A"}</div>
                  <div><span className="font-semibold">Address:</span> {selectedApp.submittedData?.address || "N/A"}</div>
                  <div><span className="font-semibold">Description:</span> <p className="mt-1 text-sm">{selectedApp.submittedData?.description || "N/A"}</p></div>
                  <div><span className="font-semibold">Price per night:</span> ₹{selectedApp.submittedData?.price || "N/A"}</div>
                  <div><span className="font-semibold">Booking For:</span> {selectedApp.submittedData?.bookingFor || "Not specified"}</div>
                  <div><span className="font-semibold">Amenities:</span> 
                    <div className="flex flex-wrap mt-1">{renderAmenities(selectedApp.submittedData?.amenities)}</div>
                  </div>
                  {selectedApp.submittedData?.lat && selectedApp.submittedData?.lng && (
                    <div><span className="font-semibold">Coordinates:</span> {selectedApp.submittedData.lat}, {selectedApp.submittedData.lng}</div>
                  )}
                </div>

                {/* Right Column: Vendor Info */}
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <h4 className="font-bold text-lime-500 flex items-center gap-2"><FaUser /> Vendor Info</h4>
                  </div>
                  <div><span className="font-semibold">Applicant Name:</span> {selectedApp.name}</div>
                  <div><span className="font-semibold">Email:</span> {selectedApp.email}</div>
                  <div><span className="font-semibold">Application ID:</span> {selectedApp.applicationId}</div>
                  <div><span className="font-semibold">Submitted:</span> {new Date(selectedApp.createdAt).toLocaleString()}</div>
                  <div><span className="font-semibold">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedApp.status === "approved" ? "bg-green-100 text-green-700" :
                      selectedApp.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    }`}>{selectedApp.status}</span>
                  </div>
                  {selectedApp.adminNotes && (
                    <div><span className="font-semibold">Admin Notes:</span> <p className="mt-1 text-sm bg-stone-100 dark:bg-stone-700 p-2 rounded">{selectedApp.adminNotes}</p></div>
                  )}
                  {selectedApp.reviewedAt && (
                    <div><span className="font-semibold">Reviewed:</span> {new Date(selectedApp.reviewedAt).toLocaleString()} by {selectedApp.reviewedBy || "admin"}</div>
                  )}
                </div>
              </div>

              {/* Images Section */}
              {selectedApp.submittedData?.images && selectedApp.submittedData.images.length > 0 && (
                <div>
                  <div className="border-b pb-2 mb-3">
                    <h4 className="font-bold text-lime-500 flex items-center gap-2"><FaImage /> Farmhouse Images</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedApp.submittedData.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Farmhouse ${idx+1}`} className="w-full h-32 object-cover rounded-lg border" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer – only Close button (no Edit) */}
            <div className={`sticky bottom-0 flex justify-end p-5 border-t ${darkMode ? "border-stone-700" : "border-lime-200"} bg-inherit`}>
              <button onClick={closeModal} className="px-4 py-2 rounded-lg border border-lime-500 text-lime-600 hover:bg-lime-50 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;