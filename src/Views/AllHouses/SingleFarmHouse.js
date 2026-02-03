import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStar, FaCalendarAlt } from "react-icons/fa";

const API_BASE = "http://31.97.206.144:5124/api";

const SingleFarmhouse = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/farmhouse/${id}`).then((res) => {
      setData(res.data.farmhouse);
    });
  }, [id]);

  if (!data)
    return (
      <div className="p-10 text-center opacity-70">
        Loading farmhouse details...
      </div>
    );

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
        <p className="opacity-80 mt-1">{data.address}</p>

        <div className="flex flex-wrap gap-3 mt-3">
          <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-sm">
            {data.bookingFor}
          </span>
          <span className="px-3 py-1 rounded-full bg-yellow-500 text-black flex items-center gap-1 text-sm">
            <FaStar /> {data.rating}
          </span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {data.images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            className="h-48 w-full object-cover rounded-xl shadow hover:scale-[1.02] transition"
          />
        ))}
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div
          className={`md:col-span-2 p-6 rounded-xl ${
            darkMode ? "bg-gray-800" : "bg-white shadow"
          }`}
        >
          <h2 className="text-xl font-semibold mb-3">About this Farmhouse</h2>

          <p className="leading-relaxed opacity-90 mb-4">
            {data.description}
          </p>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {data.amenities.map((a, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="opacity-70">Price / Hour</p>
              <p className="font-semibold">₹{data.pricePerHour}</p>
            </div>
            <div>
              <p className="opacity-70">Price / Day</p>
              <p className="font-semibold">₹{data.pricePerDay}</p>
            </div>
          </div>
        </div>

        {/* Side Info */}
        <div
          className={`p-6 rounded-xl ${
            darkMode ? "bg-gray-800" : "bg-white shadow"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">Quick Info</h3>

          <div className="space-y-3 text-sm">
            <div>
              <p className="opacity-70">Feedback</p>
              <p>{data.feedbackSummary}</p>
            </div>

            <div>
              <p className="opacity-70">Total Bookings</p>
              <p className="font-semibold">
                {data.bookedSlots.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booked Slots */}
      {data.bookedSlots.length > 0 && (
        <div
          className={`mt-8 p-6 rounded-xl ${
            darkMode ? "bg-gray-800" : "bg-white shadow"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaCalendarAlt /> Booked Slots
          </h3>

          <div className="space-y-3">
            {data.bookedSlots.map((b) => (
              <div
                key={b._id}
                className="flex justify-between items-center p-4 rounded-lg bg-blue-500/10"
              >
                <div>
                  <p className="font-semibold">{b.label}</p>
                  <p className="text-xs opacity-70">{b.timing}</p>
                </div>
                <div className="text-xs opacity-70">
                  {new Date(b.checkIn).toLocaleDateString()} –{" "}
                  {new Date(b.checkOut).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleFarmhouse;
