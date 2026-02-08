import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://31.97.206.144:5124/api";

const SingleFarmhouse = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    axios.get(`${API_BASE}/farmhouse/${id}`).then((res) => {
      setData(res.data.farmhouse);
    });
  }, [id]);

  const nextSlide = () =>
    setIndex((prev) => (prev + 1) % data.images.length);

  const prevSlide = () =>
    setIndex((prev) =>
      prev === 0 ? data.images.length - 1 : prev - 1
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-semibold animate-pulse opacity-70">
          Loading luxury farmhouse...
        </div>
      </div>
    );

  return (
    <div
      className={`min-h-screen ${darkMode
          ? "bg-[#020617] text-white"
          : "bg-gradient-to-br from-slate-100 to-white text-gray-900"
        }`}
    >
      {/* BACK */}
      <div className="max-w-7xl mx-auto p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 px-6 py-2 rounded-xl font-semibold
          bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition"
        >
          <FaArrowLeft /> Back
        </button>

        {/* ================= HERO CAROUSEL ================= */}

        <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] mb-10">

          {/* IMAGE */}
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={data.images[index]}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="h-[520px] w-full object-cover"
            />
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Title */}
          <div
            className="
    absolute bottom-10 left-10
    bg-white/10
    backdrop-blur-xl
    border border-white/20
    shadow-2xl
    rounded-2xl
    px-6 py-4
  "
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-1 text-white">
              {data.name}
            </h1>

            <div className="flex items-center gap-2 text-white/90">
              <FaMapMarkerAlt />
              {data.address}
            </div>
          </div>


          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2
            bg-white/20 backdrop-blur-lg p-3 rounded-full hover:bg-white/40 transition"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2
            bg-white/20 backdrop-blur-lg p-3 rounded-full hover:bg-white/40 transition"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* ================= BADGES ================= */}

        <div className="flex gap-3 mb-8 flex-wrap">
          <span className="px-4 py-1 rounded-full bg-emerald-500 text-white shadow">
            {data.bookingFor}
          </span>

          <span className="px-4 py-1 rounded-full bg-yellow-400 text-black flex items-center gap-1 font-semibold shadow">
            <FaStar /> {data.rating}
          </span>
        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="grid md:grid-cols-3 gap-8">

          {/* LEFT */}
          <div
            className={`md:col-span-2 p-8 rounded-3xl backdrop-blur-xl border shadow-xl ${darkMode
                ? "bg-white/5 border-white/10"
                : "bg-white border-gray-200"
              }`}
          >
            <h2 className="text-2xl font-bold mb-4">
              About this Farmhouse
            </h2>

            <p className="leading-relaxed opacity-90 mb-8">
              {data.description}
            </p>

            {/* Amenities */}
            <h3 className="font-semibold mb-4 text-lg">
              Amenities
            </h3>

            <div className="flex flex-wrap gap-3 mb-8">
              {data.amenities.map((a, i) => (
                <span
                  key={i}
                  className="px-4 py-1 rounded-full
                  bg-indigo-500/10 border border-indigo-400
                  text-indigo-500 text-xs font-semibold"
                >
                  {a}
                </span>
              ))}
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-400">
                <p className="opacity-70 text-sm">
                  Price / Hour
                </p>
                <p className="text-3xl font-bold">
                  ₹{data.pricePerHour}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-400">
                <p className="opacity-70 text-sm">
                  Price / Day
                </p>
                <p className="text-3xl font-bold">
                  ₹{data.pricePerDay}
                </p>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div
            className={`p-8 rounded-3xl backdrop-blur-xl border shadow-xl ${darkMode
                ? "bg-white/5 border-white/10"
                : "bg-white border-gray-200"
              }`}
          >
            <h3 className="text-xl font-bold mb-6">
              Quick Info
            </h3>

            <div className="space-y-6 text-sm">

              <div>
                <p className="opacity-70">
                  Feedback
                </p>
                <p className="font-medium">
                  {data.feedbackSummary}
                </p>
              </div>

              <div>
                <p className="opacity-70">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold">
                  {data.bookedSlots.length}
                </p>
              </div>

              <div>
                <p className="opacity-70">
                  Rating
                </p>
                <p className="flex items-center gap-2 font-semibold">
                  <FaStar className="text-yellow-400" />
                  {data.rating}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ================= BOOKED SLOTS ================= */}

        {data.bookedSlots.length > 0 && (
          <div
            className={`mt-10 p-8 rounded-3xl backdrop-blur-xl border shadow-xl ${darkMode
                ? "bg-white/5 border-white/10"
                : "bg-white border-gray-200"
              }`}
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaCalendarAlt /> Booked Slots
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {data.bookedSlots.map((b) => (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  key={b._id}
                  className="flex justify-between items-center p-5 rounded-2xl
                  bg-indigo-500/10 border border-indigo-300"
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
                    <br />–<br />
                    {new Date(b.checkOut).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleFarmhouse;
