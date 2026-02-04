import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStar, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-semibold animate-pulse opacity-70">
          Loading farmhouse details...
        </div>
      </div>
    );

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 px-5 py-2 rounded-xl font-semibold
          bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition"
        >
          <FaArrowLeft /> Back
        </button>

        {/* HERO SECTION */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            {data.name}
          </h1>

          <div className="flex items-center gap-2 opacity-80 mt-2">
            <FaMapMarkerAlt />
            {data.address}
          </div>

          {/* BADGES */}
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="px-4 py-1 rounded-full bg-emerald-600 text-white text-sm shadow">
              {data.bookingFor}
            </span>

            <span className="px-4 py-1 rounded-full bg-yellow-400 text-black flex items-center gap-1 text-sm font-semibold shadow">
              <FaStar /> {data.rating}
            </span>
          </div>
        </div>

        {/* IMAGE GALLERY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="md:col-span-2">
            <img
              src={data.images[0]}
              alt=""
              className="h-[420px] w-full object-cover rounded-3xl shadow-xl hover:scale-[1.01] transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {data.images.slice(1, 5).map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="h-48 w-full object-cover rounded-2xl shadow-md hover:scale-[1.02] transition"
              />
            ))}
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* LEFT */}
          <div
            className={`md:col-span-2 p-8 rounded-3xl border shadow-xl backdrop-blur-md ${
              darkMode
                ? "bg-gray-900/70 border-gray-700"
                : "bg-white/80 border-gray-300"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">
              About this Farmhouse
            </h2>

            <p className="leading-relaxed opacity-90 mb-6">
              {data.description}
            </p>

            {/* AMENITIES */}
            <h3 className="font-semibold mb-3 text-lg">
              Amenities
            </h3>

            <div className="flex flex-wrap gap-3 mb-6">
              {data.amenities.map((a, i) => (
                <span
                  key={i}
                  className="px-4 py-1 rounded-full bg-blue-600 text-white text-xs shadow"
                >
                  {a}
                </span>
              ))}
            </div>

            {/* PRICING */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-400">
                <p className="opacity-70 text-sm">Price / Hour</p>
                <p className="text-2xl font-bold">
                  ₹{data.pricePerHour}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-400">
                <p className="opacity-70 text-sm">Price / Day</p>
                <p className="text-2xl font-bold">
                  ₹{data.pricePerDay}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div
            className={`p-8 rounded-3xl border shadow-xl ${
              darkMode
                ? "bg-gray-900/70 border-gray-700"
                : "bg-white/80 border-gray-300"
            }`}
          >
            <h3 className="text-xl font-bold mb-6">
              Quick Info
            </h3>

            <div className="space-y-5 text-sm">

              <div>
                <p className="opacity-70">Feedback</p>
                <p className="font-medium">
                  {data.feedbackSummary}
                </p>
              </div>

              <div>
                <p className="opacity-70">Total Bookings</p>
                <p className="text-2xl font-bold">
                  {data.bookedSlots.length}
                </p>
              </div>

              <div>
                <p className="opacity-70">Rating</p>
                <p className="flex items-center gap-2 font-semibold">
                  <FaStar className="text-yellow-400" />
                  {data.rating}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* BOOKED SLOTS */}
        {data.bookedSlots.length > 0 && (
          <div
            className={`mt-10 p-8 rounded-3xl border shadow-xl ${
              darkMode
                ? "bg-gray-900/70 border-gray-700"
                : "bg-white/80 border-gray-300"
            }`}
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaCalendarAlt /> Booked Slots
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {data.bookedSlots.map((b) => (
                <div
                  key={b._id}
                  className="flex justify-between items-center p-5 rounded-2xl
                  bg-blue-500/10 border border-blue-300 hover:shadow-lg transition"
                >
                  <div>
                    <p className="font-semibold text-lg">
                      {b.label}
                    </p>
                    <p className="text-xs opacity-70">
                      {b.timing}
                    </p>
                  </div>

                  <div className="text-xs opacity-70 text-right">
                    {new Date(b.checkIn).toLocaleDateString()}
                    <br />–
                    <br />
                    {new Date(b.checkOut).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleFarmhouse;
