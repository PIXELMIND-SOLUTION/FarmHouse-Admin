import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const API_BASE = "http://31.97.206.144:5124/api";

const FarmhouseSlots = ({ darkMode }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const today = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState(today);

    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ================= FETCH SLOTS ================= */
    const fetchSlots = async (selectedDate) => {
        if (!selectedDate) return;

        try {
            setLoading(true);
            const res = await axios.get(
                `${API_BASE}/${id}/slots?date=${selectedDate}`
            );
            setSlots(res.data.slots || []);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch slots");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (date) fetchSlots(date);
    }, [date]);

    return (
        <div
            className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
                }`}
        >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                    <FaArrowLeft />
                </button>
                <h2 className="text-3xl font-bold">📅 Available Slots</h2>
            </div>

            {/* Date Picker */}
            <div
                className={`flex items-center gap-3 mb-6 p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow"
                    }`}
            >
                <FaCalendarAlt className="text-blue-500 text-lg" />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="px-4 py-2 rounded border text-black"
                />
            </div>

            {/* Slots */}
            <div
                className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow"
                    }`}
            >
                {loading ? (
                    <p className="text-center opacity-70">Loading slots...</p>
                ) : slots.length === 0 ? (
                    <p className="text-center opacity-60">
                        Select a date to see available slots
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {slots.map((slot, i) => (
                            <div
                                key={i}
                                className={`p-5 rounded-xl border flex justify-between items-center ${slot.available
                                    ? "border-emerald-500 bg-emerald-500/10"
                                    : "border-red-500 bg-red-500/10"
                                    }`}
                            >
                                <div>
                                    <h3 className="text-lg font-semibold">{slot.label}</h3>
                                    <p className="text-sm opacity-80">{slot.timing}</p>
                                    <p className="mt-1 font-semibold">
                                        ₹{slot.price}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
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
        </div>
    );
};

export default FarmhouseSlots;
