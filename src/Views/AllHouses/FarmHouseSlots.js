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

  /* ================= FETCH SLOTS ================= */
  const fetchSlots = async (selectedDate) => {
    if (!selectedDate || !farmhouseId) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/${farmhouseId}/slots?date=${selectedDate}`
      );

      // API response structure handled here
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Modal Box */}
      <div
        className={`w-full max-w-4xl mx-4 rounded-2xl shadow-2xl overflow-hidden
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            📅 Available Slots
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date Picker */}
          <div
            className={`flex items-center gap-3 p-4 rounded-xl
            ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
          >
            <FaCalendarAlt className="text-blue-500 text-lg" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 rounded border text-black w-full sm:w-auto"
            />
          </div>

          {/* Slots */}
          {loading ? (
            <p className="text-center opacity-70">Loading slots...</p>
          ) : slots.length === 0 ? (
            <p className="text-center opacity-60">
              No slots available for selected date
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2">
              {slots.map((slot, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-xl border flex justify-between items-center transition
                  ${
                    slot.available
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-red-500 bg-red-500/10"
                  }`}
                >
                  <div>
                    <h3 className="text-lg font-semibold">{slot.label}</h3>
                    <p className="text-sm opacity-80">{slot.timing}</p>

                    {/* Check-in / Check-out */}
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

                    <p className="mt-2 font-semibold text-lg">
                      ₹{slot.price}
                    </p>
                  </div>

                  <div>
                    {slot.available ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <FaCheckCircle /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 font-medium">
                        <FaTimesCircle /> Booked
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmhouseSlots;
