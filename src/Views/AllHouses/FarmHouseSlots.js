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
      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/${farmhouseId}/slots?date=${selectedDate}`
      );

      setSlots(res.data?.slots || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchSlots(date);
  }, [open, date]);

  /* ================= OPEN MODAL ================= */

  const openReasonModal = (slot) => {
    setSelectedSlot(slot); // ✅ FULL object
    setReason("");
    setReasonModal(true);
  };

  /* ================= TOGGLE SLOT ================= */

  const handleToggle = async () => {
    if (!selectedSlot) return;

    if (!reason.trim()) {
      alert("Please enter a reason");
      return;
    }

    try {
      setTogglingId(selectedSlot.slotId); // ✅ correct id

      await axios.put(
        `${API_BASE}/${farmhouseId}/slots/${selectedSlot.slotId}/toggle?date=${date}`,
        {
          isActive: !selectedSlot.isActive,
          reason,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setReasonModal(false);
      setSelectedSlot(null);

      fetchSlots(date);

    } catch (err) {
      console.error("Toggle Error:", err?.response?.data || err.message);
      alert("Failed to toggle slot");
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
          ${
            darkMode
              ? "bg-gradient-to-br from-gray-900/95 to-gray-950 border-gray-700 text-white"
              : "bg-gradient-to-br from-white/95 to-gray-100 border-gray-200 text-gray-900"
          }`}
        >

          {/* HEADER */}
          <div className="sticky top-0 flex justify-between items-center px-8 py-6 border-b border-white/10">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <FaCalendarAlt className="text-blue-500" />
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
              className={`flex items-center justify-between gap-4 p-6 rounded-2xl border
              ${
                darkMode
                  ? "bg-gray-800/60 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 text-lg font-semibold">
                <FaCalendarAlt className="text-blue-500" />
                Select Date
              </div>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-5 py-3 rounded-xl border text-black shadow-md"
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
                    key={slot.slotId} // ✅ FIXED
                    className={`p-6 rounded-2xl border transition
                    ${
                      slot.available
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-red-500 bg-red-500/10"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold">
                          {slot.label}
                        </h3>
                        <p className="text-sm opacity-70">
                          {slot.timing}
                        </p>

                        <p className="mt-2 text-2xl font-bold">
                          ₹{slot.price}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 items-end">

                        {/* STATUS */}
                        {slot.available ? (
                          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white">
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
                          onClick={() => openReasonModal(slot)} // ✅ PASS FULL SLOT
                          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold
                          ${
                            slot.isActive
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-gray-500 hover:bg-gray-600 text-white"
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
          <div className="flex justify-end px-8 py-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl font-semibold
              bg-gradient-to-r from-blue-600 to-indigo-600
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
            className={`w-full max-w-lg p-8 rounded-3xl shadow-2xl border
            ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-white"
                : "bg-white border-gray-200"
            }`}
          >
            <h3 className="text-2xl font-bold mb-4">
              Enter Reason
            </h3>

            <textarea
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Type reason here..."
              className="w-full p-4 rounded-xl border text-black"
            />

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setReasonModal(false)}
                className="px-6 py-2 rounded-lg bg-gray-400 text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleToggle}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white"
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
