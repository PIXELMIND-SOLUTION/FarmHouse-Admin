import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

const API_BASE = "https://backend.vfarmstays.com/api";

const FarmhouseSlotsModal = ({ open, onClose, farmhouseId, darkMode }) => {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const [reasonModal, setReasonModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");

  /* 🔒 BODY SCROLL LOCK */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  /* ⌨️ ESC CLOSE */
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  /* 📡 FETCH SLOTS */
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
      Swal.close();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Failed to Fetch Slots",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchSlots(date);
  }, [open, date]);

  /* 🟡 OPEN REASON MODAL */
  const openReasonModal = (slot) => {
    setSelectedSlot(slot);
    setReason("");
    setReasonModal(true);
  };

  /* 🔁 ACTIVATE / DEACTIVATE SLOT */
  const handleToggle = async () => {
    if (!selectedSlot) return;

    if (!reason.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Reason Required",
        text: "Please enter a reason.",
      });
    }

    const actionText = selectedSlot.isActive ? "Deactivating" : "Activating";

    try {
      Swal.fire({
        title: `${actionText} Slot...`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      setTogglingId(selectedSlot.slotId);

      await axios.put(
        `${API_BASE}/${farmhouseId}/slots/${selectedSlot.slotId}/toggle?date=${date}`,
        {
          isActive: !selectedSlot.isActive,
          reason: reason.trim(),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setReasonModal(false);
      setSelectedSlot(null);
      setReason("");

      await fetchSlots(date);

      Swal.fire({
        icon: "success",
        title: `Slot ${selectedSlot.isActive ? "Deactivated" : "Activated"} Successfully`,
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setTogglingId(null);
    }
  };

  if (!open) return null;

  /* ================= MAIN MODAL ================= */

  const mainModal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-5xl mx-4 rounded-3xl overflow-hidden shadow-2xl border ${
          darkMode
            ? "bg-stone-900 border-stone-700 text-white"
            : "bg-white border-lime-200 text-stone-900"
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6 border-b">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FaCalendarAlt /> Available Slots
          </h2>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-red-500/70">
            <FaTimes />
          </button>
        </div>

        {/* BODY */}
        <div className="p-8 space-y-6">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 rounded-lg border"
          />

          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6 max-h-[55vh] overflow-y-auto">
              {slots.map((slot) => (
                <div key={slot.slotId} className="p-5 rounded-2xl border shadow">
                  <h3 className="text-lg font-bold">{slot.label}</h3>
                  <p className="text-sm">{slot.timing}</p>
                  <p className="text-xl font-bold mt-2">₹{slot.price}</p>

                  <div className="flex justify-between items-center mt-4">
                    {slot.available ? (
                      <span className="text-green-600 flex gap-2">
                        <FaCheckCircle /> Available
                      </span>
                    ) : (
                      <span className="text-red-600 flex gap-2">
                        <FaTimesCircle /> Booked
                      </span>
                    )}

                    <button
                      disabled={togglingId === slot.slotId}
                      onClick={() => openReasonModal(slot)}
                      className="px-4 py-2 rounded-lg bg-lime-600 text-white"
                    >
                      {slot.isActive ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end px-8 py-6 border-t">
          <button onClick={onClose} className="px-6 py-3 bg-lime-600 text-white rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );

  /* ================= REASON MODAL ================= */

  const reasonModalContent =
    reasonModal &&
    selectedSlot &&
    createPortal(
      <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-lg">
        <div className="w-full max-w-lg p-8 bg-white rounded-3xl shadow-2xl">
          <h3 className="text-xl font-bold mb-4">Enter Reason</h3>

          <textarea
            rows="4"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-4 border rounded-lg"
          />

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setReasonModal(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleToggle}
              className={`px-6 py-2 rounded-lg text-white font-semibold ${
                selectedSlot?.isActive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {selectedSlot?.isActive ? "Deactivate Slot" : "Activate Slot"}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      {createPortal(mainModal, document.body)}
      {reasonModalContent}
    </>
  );
};

export default FarmhouseSlotsModal;