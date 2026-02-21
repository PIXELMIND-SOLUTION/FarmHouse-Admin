import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import Swal from "sweetalert2";

const API_BASE = "http://31.97.206.144:5124/api";

const FarmhouseSlots = ({ open, onClose, farmhouseId, darkMode }) => {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const [reasonModal, setReasonModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");

  /* ================= FETCH ================= */

  const fetchSlots = async (selectedDate) => {
    if (!selectedDate || !farmhouseId) return;

    try {
      Swal.fire({
        title: "Loading Slots...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/${farmhouseId}/slots?date=${selectedDate}`
      );

      setSlots(res.data?.slots || []);

      Swal.close(); // close loader
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Failed to Fetch Slots",
        text: "Unable to load slots for selected date.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchSlots(date);
  }, [open, date]);

  /* ================= OPEN MODAL ================= */

  const openReasonModal = (slot) => {
    setSelectedSlot(slot);
    setReason("");
    setReasonModal(true);
  };

  /* ================= TOGGLE SLOT ================= */

  const handleToggle = async () => {
    if (!selectedSlot) return;

    if (!reason.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Reason Required",
        text: "Please enter a reason before changing slot status.",
      });
      return;
    }

    const actionText = selectedSlot.isActive ? "Deactivate" : "Activate";

    // 🔴 Confirmation Popup
    const confirm = await Swal.fire({
      title: `${actionText} Slot?`,
      text: "This action will update slot availability.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${actionText}`,
    });

    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({
        title: "Updating Slot...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      setTogglingId(selectedSlot.slotId);

      await axios.put(
        `${API_BASE}/${farmhouseId}/slots/${selectedSlot.slotId}/toggle?date=${date}`,
        {
          isActive: !selectedSlot.isActive,
          reason,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setReasonModal(false);
      setSelectedSlot(null);

      await fetchSlots(date);

      Swal.fire({
        icon: "success",
        title: `Slot ${actionText}d`,
        text: "Slot status updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error("Toggle Error:", err?.response?.data || err.message);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          err?.response?.data?.message ||
          "Failed to toggle slot. Please try again.",
      });
    } finally {
      setTogglingId(null);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* ================= MAIN MODAL ================= */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl">

        <div
          className={`relative w-full max-w-5xl mx-4 rounded-3xl overflow-hidden
          shadow-[0_25px_80px_rgba(0,0,0,0.6)]
          border backdrop-blur-2xl
          ${darkMode
              ? "bg-gradient-to-br from-stone-900/95 to-stone-950 border-stone-700 text-white"
              : "bg-gradient-to-br from-white/95 to-lime-100 border-lime-200 text-stone-900"
            }`}
        >

          {/* HEADER */}
          <div className={`sticky top-0 flex justify-between items-center px-8 py-6 border-b ${darkMode ? 'border-stone-700' : 'border-lime-200'
            }`}>
            <h2 className={`text-3xl font-bold flex items-center gap-3 ${darkMode ? 'text-lime-400' : 'text-lime-700'
              }`}>
              <FaCalendarAlt className={darkMode ? 'text-lime-500' : 'text-lime-600'} />
              Available Slots
            </h2>

            <button
              onClick={onClose}
              className="p-3 rounded-full bg-white/10 hover:bg-red-500/80 transition"
            >
              <FaTimes />
            </button>
          </div>

          {/* BODY */}
          <div className="p-8 space-y-8">

            {/* DATE */}
            <div
              className={`flex items-center justify-between gap-4 p-6 rounded-2xl border ${darkMode
                ? "bg-stone-800/60 border-stone-700"
                : "bg-white border-lime-200"
                }`}
            >
              <div className={`flex items-center gap-3 text-lg font-semibold ${darkMode ? 'text-lime-400' : 'text-lime-700'
                }`}>
                <FaCalendarAlt className={darkMode ? 'text-lime-500' : 'text-lime-600'} />
                Select Date
              </div>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`px-5 py-3 rounded-xl border shadow-md ${darkMode
                  ? 'bg-stone-900 border-stone-700 text-white'
                  : 'bg-white border-lime-300 text-stone-900'
                  }`}
              />
            </div>

            {/* SLOTS */}
            {loading ? (
              <div className="text-center py-10 animate-pulse">
                Loading slots...
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6 max-h-[55vh] overflow-y-auto pr-2">
                {slots.map((slot) => (
                  <div
                    key={slot.slotId}
                    className={`p-6 rounded-2xl border transition ${slot.available
                      ? darkMode
                        ? 'border-lime-500 bg-lime-500/10'
                        : 'border-lime-500 bg-lime-100'
                      : 'border-red-500 bg-red-500/10'
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold">
                          {slot.label}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                          {slot.timing}
                        </p>

                        <p className={`mt-2 text-2xl font-bold ${darkMode ? 'text-lime-400' : 'text-lime-700'
                          }`}>
                          ₹{slot.price}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 items-end">

                        {/* STATUS */}
                        {slot.available ? (
                          <span className={`flex items-center gap-2 px-4 py-2 rounded-full ${darkMode ? 'bg-lime-600 text-white' : 'bg-lime-500 text-white'
                            }`}>
                            <FaCheckCircle />
                            Available
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white">
                            <FaTimesCircle />
                            Booked
                          </span>
                        )}

                        {/* TOGGLE */}
                        <button
                          disabled={togglingId === slot.slotId}
                          onClick={() => openReasonModal(slot)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${slot.isActive
                            ? darkMode
                              ? 'bg-lime-600 hover:bg-lime-700 text-white'
                              : 'bg-lime-500 hover:bg-lime-600 text-white'
                            : darkMode
                              ? 'bg-stone-600 hover:bg-stone-700 text-white'
                              : 'bg-stone-500 hover:bg-stone-600 text-white'
                            }`}
                        >
                          {slot.isActive ? (
                            <>
                              <FaToggleOn />
                              Active
                            </>
                          ) : (
                            <>
                              <FaToggleOff />
                              Inactive
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className={`flex justify-end px-8 py-6 border-t ${darkMode ? 'border-stone-700' : 'border-lime-200'
            }`}>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl font-semibold
              bg-gradient-to-r from-lime-600 to-lime-700
              text-white shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* ================= REASON MODAL ================= */}

      {reasonModal && selectedSlot && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-lg">
          <div
            className={`w-full max-w-lg p-8 rounded-3xl shadow-2xl border ${darkMode
              ? "bg-stone-900 border-stone-700 text-white"
              : "bg-white border-lime-200"
              }`}
          >
            <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-lime-400' : 'text-lime-700'
              }`}>
              Enter Reason
            </h3>

            <textarea
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Type reason here..."
              className={`w-full p-4 rounded-xl border ${darkMode
                ? 'bg-stone-800 border-stone-700 text-white'
                : 'bg-white border-lime-300 text-stone-900'
                }`}
            />

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setReasonModal(false)}
                className={`px-6 py-2 rounded-lg ${darkMode ? 'bg-stone-600 text-white' : 'bg-stone-400 text-white'
                  }`}
              >
                Cancel
              </button>

              <button
                onClick={handleToggle}
                className={`px-6 py-2 rounded-lg ${darkMode ? 'bg-lime-600 text-white' : 'bg-lime-500 text-white'
                  }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FarmhouseSlots;