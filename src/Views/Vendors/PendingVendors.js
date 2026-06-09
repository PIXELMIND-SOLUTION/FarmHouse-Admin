import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaFileExport,
  FaChevronLeft,
  FaChevronRight,
  FaStore,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUser,
  FaImage,
  FaClipboardList,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaCheckCircle,
  FaBan,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = "https://backend.vfarmstays.com/api/admin/vendor/applications/pending";
const DELETE_URL = "https://backend.vfarmstays.com/api/admin/deletevendor";
const REVIEW_URL = "https://backend.vfarmstays.com/api/admin/vendor/application";
const PAGE_SIZE = 8;

const PendingVendors = ({ darkMode }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAction, setEditAction] = useState("approve");
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectedReason, setRejectedReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch pending applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        const dataArray = res.data?.applications || [];
        setApplications(dataArray);
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to load pending applications.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Helper function to get farmhouse name from application
  const getFarmhouseName = (app) => {
    if (app.farmhouseId?.name) return app.farmhouseId.name;
    if (app.submittedData?.name) return app.submittedData.name;
    return "N/A";
  };

  // Helper function to get farmhouse price from application
  const getFarmhousePrice = (app) => {
    if (app.farmhouseId?.price) return app.farmhouseId.price;
    if (app.submittedData?.price) return app.submittedData.price;
    return "N/A";
  };

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const q = search.toLowerCase();
      const name = getFarmhouseName(app).toLowerCase();
      const email = (app.email || "").toLowerCase();
      const appId = (app.applicationId || "").toLowerCase();
      return name.includes(q) || email.includes(q) || appId.includes(q);
    });
  }, [applications, search]);

  const totalPages = Math.ceil(filteredApps.length / PAGE_SIZE);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const exportCSV = () => {
    const headers = [
      "S.No",
      "Farmhouse Name",
      "Email",
      "Application ID",
      "Price",
      "Submitted Date",
    ];
    const rows = filteredApps.map((app, i) => [
      i + 1,
      getFarmhouseName(app),
      app.email || "N/A",
      app.applicationId || "N/A",
      getFarmhousePrice(app),
      app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A",
    ]);
    const csv =
      headers.join(",") +
      "\n" +
      rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pending_applications.csv";
    link.click();
  };

  const handleDelete = async (id, farmhouseName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Application for "${farmhouseName}" will be permanently deleted!`,
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

  // Open View Modal with fresh API call
  const openViewModal = async (app) => {
    setSelectedApp(app);
    setShowViewModal(true);
    setViewLoading(true);
    setViewData(null);
    try {
      const res = await axios.get(`${REVIEW_URL}/${app.applicationId}`);
      if (res.data?.success && res.data?.application) {
        setViewData(res.data.application);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to fetch application details.", "error");
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  const openEditModal = (app) => {
    setSelectedApp(app);
    setEditAction("approve");
    setAdminNotes("");
    setRejectedReason("");
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedApp(null);
    setViewData(null);
  };

  const handleReviewSubmit = async () => {
    if (!selectedApp) return;
    if (editAction === "reject" && !rejectedReason.trim()) {
      Swal.fire("Error!", "Please provide a reason for rejection.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        action: editAction,
        adminNotes: adminNotes.trim() || undefined,
      };
      if (editAction === "reject") {
        payload.rejectedReason = rejectedReason.trim();
      }

      const response = await axios.put(
        `${REVIEW_URL}/${selectedApp.applicationId}/review`,
        payload
      );

      if (response.data.success) {
        setApplications((prev) => prev.filter((app) => app._id !== selectedApp._id));
        Swal.fire(
          "Success!",
          editAction === "approve"
            ? "Application approved and farmhouse created."
            : "Application rejected.",
          "success"
        );
        closeModals();
      } else {
        throw new Error(response.data.message || "Review failed");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", error.response?.data?.message || "Failed to review application.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const renderAmenities = (amenities) => {
    if (!amenities || amenities.length === 0) return "None";
    return amenities.map((a, i) => {
      let icon = <FaClipboardList className="inline mr-1" />;
      if (a.toLowerCase().includes("pool")) icon = <FaSwimmingPool className="inline mr-1" />;
      else if (a.toLowerCase().includes("wifi")) icon = <FaWifi className="inline mr-1" />;
      else if (a.toLowerCase().includes("food") || a.toLowerCase().includes("restaurant")) icon = <FaUtensils className="inline mr-1" />;
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
              Pending Vendor Applications
            </h2>
            <p className={`${darkMode ? "text-stone-400" : "text-stone-600"} mt-1`}>
              Review pending farmhouse applications
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-lime-500 to-lime-700 hover:scale-105 transition shadow-xl text-white"
          >
            <FaFileExport /> Export CSV
          </button>
        </div>

        {/* Search */}
        <div
          className={`mb-8 p-4 rounded-2xl border shadow-lg backdrop-blur-md ${
            darkMode ? "bg-stone-800/60 border-stone-700" : "bg-white/80 border-lime-300"
          }`}
        >
          <div className="relative">
            <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-stone-400" : "text-stone-500"}`} />
            <input
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none ${
                darkMode
                  ? "bg-stone-900 border-stone-700 text-white focus:border-lime-500"
                  : "bg-white border-lime-300 text-stone-900 focus:border-lime-500"
              }`}
              placeholder="Search by farmhouse name, email or application ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div
          className={`rounded-2xl overflow-hidden border shadow-2xl ${
            darkMode ? "bg-stone-900 border-stone-700" : "bg-white border-lime-300"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className={`${darkMode ? "bg-stone-800" : "bg-lime-100"}`}>
                <tr>
                  {["#", "Farmhouse", "Email", "Application ID", "Price", "Submitted", "Actions"].map((h) => (
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
                      No pending applications found.
                    </td>
                  </tr>
                ) : (
                  paginatedApps.map((app, idx) => {
                    const farmhouseName = getFarmhouseName(app);
                    const price = getFarmhousePrice(app);
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
                              {farmhouseName.charAt(0).toUpperCase()}
                            </div>
                            <span>{farmhouseName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">{app.email}</td>
                        <td className="px-4 py-4 text-sm font-mono">{app.applicationId || "N/A"}</td>
                        <td className="px-4 py-4">₹{price}</td>
                        <td className="px-4 py-4 text-sm">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openViewModal(app)}
                              className="p-2 rounded-lg bg-lime-100 text-lime-600 hover:bg-lime-600 hover:text-white transition"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => openEditModal(app)}
                              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                              title="Review (Approve/Reject)"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(app._id, farmhouseName)}
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
            <p className="text-sm">Page {currentPage} of {totalPages}</p>
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

      {/* ========== VIEW MODAL with API data ========== */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto">
          <div
            className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
              darkMode ? "bg-stone-800 text-white" : "bg-white text-stone-800"
            }`}
          >
            <div className={`sticky top-0 flex justify-between items-center p-5 border-b ${darkMode ? "border-stone-700" : "border-lime-200"} bg-inherit z-10`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-lime-500 to-lime-600 flex items-center justify-center text-white font-bold">
                  {viewData?.farmhouse?.name?.charAt(0).toUpperCase() || "F"}
                </div>
                <h3 className="text-xl font-bold">Farmhouse Application Details</h3>
              </div>
              <button onClick={closeModals} className="p-1 rounded-full hover:bg-stone-700">
                <FaTimes className="text-xl" />
              </button>
            </div>

            {viewLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="h-10 w-10 border-4 border-lime-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : viewData ? (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Farmhouse Info */}
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <h4 className="font-bold text-lime-500 flex items-center gap-2"><FaStore /> Farmhouse</h4>
                    </div>
                    <div><span className="font-semibold">Name:</span> {viewData.farmhouse?.name || "N/A"}</div>
                    <div><span className="font-semibold">Address:</span> {viewData.farmhouse?.address || "N/A"}</div>
                    <div><span className="font-semibold">Description:</span> <p className="mt-1 text-sm">{viewData.farmhouse?.description || "N/A"}</p></div>
                    <div><span className="font-semibold">Number of Persons:</span> {viewData.farmhouse?.noOfPersons || "N/A"}</div>
                    <div><span className="font-semibold">Price per night:</span> ₹{viewData.farmhouse?.price || "N/A"}</div>
                    <div><span className="font-semibold">Booking For:</span> {viewData.farmhouse?.bookingFor || "Not specified"}</div>
                    <div><span className="font-semibold">Amenities:</span> 
                      <div className="flex flex-wrap mt-1">{renderAmenities(viewData.farmhouse?.amenities)}</div>
                    </div>
                    {viewData.farmhouse?.location?.coordinates && (
                      <div><span className="font-semibold">Coordinates:</span> {viewData.farmhouse.location.coordinates[1]}, {viewData.farmhouse.location.coordinates[0]}</div>
                    )}
                  </div>

                  {/* Right: Vendor Info */}
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <h4 className="font-bold text-lime-500 flex items-center gap-2"><FaUser /> Applicant Info</h4>
                    </div>
                    <div><span className="font-semibold">Email:</span> {viewData.email}</div>
                    <div><span className="font-semibold">Application ID:</span> {viewData.applicationId}</div>
                    <div><span className="font-semibold">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        viewData.status === "approved" ? "bg-green-100 text-green-700" :
                        viewData.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                      }`}>{viewData.status || "pending"}</span>
                    </div>
                    <div><span className="font-semibold">Submitted:</span> {viewData.createdAt ? new Date(viewData.createdAt).toLocaleString() : "N/A"}</div>
                  </div>
                </div>

                {/* Time Prices */}
                {viewData.farmhouse?.timePrices && viewData.farmhouse.timePrices.length > 0 && (
                  <div>
                    <div className="border-b pb-2 mb-3">
                      <h4 className="font-bold text-lime-500 flex items-center gap-2">Time-based Pricing</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className={darkMode ? "bg-stone-700" : "bg-lime-50"}>
                            <th className="px-3 py-2 text-left">Label</th>
                            <th className="px-3 py-2 text-left">Timing</th>
                            <th className="px-3 py-2 text-left">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewData.farmhouse.timePrices.map((tp, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="px-3 py-2">{tp.label}</td>
                              <td className="px-3 py-2">{tp.timing}</td>
                              <td className="px-3 py-2">₹{tp.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Images */}
                {viewData.farmhouse?.images && viewData.farmhouse.images.length > 0 && (
                  <div>
                    <div className="border-b pb-2 mb-3">
                      <h4 className="font-bold text-lime-500 flex items-center gap-2"><FaImage /> Images ({viewData.farmhouse.images.length})</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {viewData.farmhouse.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`Farmhouse ${idx+1}`} className="w-full h-32 object-cover rounded-lg border" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-red-500">Failed to load data</div>
            )}

            <div className={`sticky bottom-0 flex justify-end p-5 border-t ${darkMode ? "border-stone-700" : "border-lime-200"} bg-inherit`}>
              <button onClick={closeModals} className="px-4 py-2 rounded-lg border border-lime-500 text-lime-600 hover:bg-lime-50 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ========== EDIT MODAL (Approve/Reject) ========== */}
      {showEditModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto">
          <div
            className={`relative w-full max-w-lg rounded-2xl shadow-2xl ${
              darkMode ? "bg-stone-800 text-white" : "bg-white text-stone-800"
            }`}
          >
            <div className={`flex justify-between items-center p-5 border-b ${darkMode ? "border-stone-700" : "border-lime-200"}`}>
              <h3 className="text-xl font-bold">Review Application</h3>
              <button onClick={closeModals} className="p-1 rounded-full hover:bg-stone-700">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block font-semibold mb-2">Farmhouse: <span className="font-normal">{getFarmhouseName(selectedApp)}</span></label>
                <label className="block font-semibold mb-2">Applicant: <span className="font-normal">{selectedApp.email}</span></label>
                <label className="block font-semibold mb-2">Application ID: <span className="font-normal">{selectedApp.applicationId}</span></label>
              </div>

              <div>
                <label className="block font-semibold mb-2">Action</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="approve"
                      checked={editAction === "approve"}
                      onChange={() => setEditAction("approve")}
                    />
                    <FaCheckCircle className="text-green-600" /> Approve
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="reject"
                      checked={editAction === "reject"}
                      onChange={() => setEditAction("reject")}
                    />
                    <FaBan className="text-red-600" /> Reject
                  </label>
                </div>
              </div>

              {editAction === "reject" && (
                <div>
                  <label className="block font-semibold mb-2">Rejection Reason *</label>
                  <textarea
                    rows="3"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode ? "bg-stone-700 border-stone-600" : "bg-white border-lime-300"
                    }`}
                    placeholder="Why is this application being rejected?"
                    value={rejectedReason}
                    onChange={(e) => setRejectedReason(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold mb-2">Admin Notes (optional)</label>
                <textarea
                  rows="2"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode ? "bg-stone-700 border-stone-600" : "bg-white border-lime-300"
                  }`}
                  placeholder="Internal notes (will be saved but not visible to applicant unless sent via email)"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>

            <div className={`flex justify-end gap-3 p-5 border-t ${darkMode ? "border-stone-700" : "border-lime-200"}`}>
              <button onClick={closeModals} className="px-4 py-2 rounded-lg border border-lime-500 text-lime-600 hover:bg-lime-50 transition">Cancel</button>
              <button
                onClick={handleReviewSubmit}
                disabled={submitting}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  editAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } disabled:opacity-50`}
              >
                {submitting ? "Processing..." : (editAction === "approve" ? "Approve" : "Reject")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingVendors;