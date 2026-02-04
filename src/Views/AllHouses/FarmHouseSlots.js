import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
} from "react-icons/fa";

const API_BASE = "http://31.97.206.144:5124/api";

const FarmhouseSlots = ({ open, onClose, farmhouseId, darkMode }) => {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl">
      
      {/* ================= MODAL ================= */}
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

        {/* Glow Border */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/10 detached" />

        {/* ================= HEADER ================= */}
        <div className="sticky top-0 z-10 flex justify-between items-center px-8 py-6 border-b border-white/10 backdrop-blur-xl">
          <h2 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
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

        {/* ================= BODY ================= */}
        <div className="p-8 space-y-8">

          {/* DATE PICKER */}
          <div
            className={`flex items-center justify-between gap-4 p-6 rounded-2xl border shadow-inner
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
              className="px-5 py-3 rounded-xl border text-black
              focus:ring-4 focus:ring-blue-400/40
              shadow-md"
            />
          </div>

          {/* ================= SLOTS ================= */}

          {loading ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-16 opacity-60 text-lg">
              No slots available for selected date
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6 max-h-[55vh] overflow-y-auto pr-2">
              {slots.map((slot, i) => {
                const available = slot.available;

                return (
                  <div
                    key={i}
                    className={`relative p-6 rounded-2xl border transition-all duration-300
                    hover:scale-[1.02] hover:shadow-2xl
                    ${
                      available
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-red-500 bg-red-500/10"
                    }`}
                  >

                    {/* Glow */}
                    <div
                      className={`absolute inset-0 rounded-2xl blur-xl opacity-20
                      ${
                        available
                          ? "bg-emerald-400"
                          : "bg-red-400"
                      }`}
                    />

                    <div className="relative flex justify-between items-center">

                      {/* LEFT */}
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">
                          {slot.label}
                        </h3>

                        <p className="opacity-80 text-sm">
                          {slot.timing}
                        </p>

                        {/* Times */}
                        <p className="text-xs opacity-70 mt-1">
                          Check-in:{" "}
                          {new Date(slot.checkIn).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" • "}
                          Check-out:{" "}
                          {new Date(slot.checkOut).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        <p className="mt-3 text-2xl font-bold">
                          ₹{slot.price}
                        </p>
                      </div>

                      {/* RIGHT STATUS */}
                      <div>
                        {available ? (
                          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white shadow-lg">
                            <FaCheckCircle />
                            Available
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white shadow-lg">
                            <FaTimesCircle />
                            Booked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="sticky bottom-0 flex justify-end px-8 py-6 border-t border-white/10 backdrop-blur-xl">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl font-semibold
            bg-gradient-to-r from-blue-600 to-indigo-600
            hover:from-blue-700 hover:to-indigo-700
            text-white shadow-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmhouseSlots;
