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
  FaHome,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://31.97.206.144:5124/api";

const SingleFarmhouse = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [index, setIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);


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
        ? "bg-stone-900 text-white"
        : "bg-gradient-to-br from-lime-100 to-white text-stone-900"
        }`}
    >
      {/* BACK */}
      <div className="max-w-7xl mx-auto p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 px-6 py-2 rounded-xl font-semibold
          bg-lime-600 hover:bg-lime-700 text-white shadow-lg transition"
        >
          <FaArrowLeft /> Back
        </button>

        {/* ================= HERO CAROUSEL ================= */}

        <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] mb-10">

          {data?.images?.length > 0 ? (

            <AnimatePresence mode="wait">
              <motion.img
                key={data.images[index]}
                src={data.images[index]}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="h-[520px] w-full object-cover"
              />
            </AnimatePresence>

          ) : (

            <div
              className={`h-[520px] w-full flex items-center justify-center relative overflow-hidden ${
                darkMode 
                  ? 'bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900'
                  : 'bg-gradient-to-br from-lime-100 via-amber-100 to-lime-200'
              }`}
            >
              {/* Glow blobs */}
              <div className={`absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-40 top-[-100px] left-[-100px] ${
                darkMode ? 'bg-lime-700' : 'bg-lime-300'
              }`} />
              <div className={`absolute w-[350px] h-[350px] rounded-full blur-[120px] opacity-40 bottom-[-100px] right-[-100px] ${
                darkMode ? 'bg-amber-700' : 'bg-amber-300'
              }`} />

              {/* Content */}
              <div className="relative text-center px-6 py-4">
                <div className="flex justify-center items-center mb-4">
                  <FaHome className={`text-6xl ${darkMode ? 'text-lime-500' : 'text-lime-600'}`} />
                </div>


                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-lime-400' : 'text-stone-700'}`}>
                  No Farmhouse Images Yet
                </h2>

                <p className={darkMode ? 'text-stone-400' : 'text-stone-500'}>
                  Upload high-quality images to attract more bookings
                  and build trust with your guests.
                </p>
              </div>
            </div>

          )}


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
          <span className={`px-4 py-1 rounded-full shadow ${
            darkMode ? 'bg-lime-600 text-white' : 'bg-lime-500 text-white'
          }`}>
            {data.bookingFor}
          </span>

          <span className={`px-4 py-1 rounded-full flex items-center gap-1 font-semibold shadow ${
            darkMode ? 'bg-amber-600 text-white' : 'bg-amber-400 text-stone-900'
          }`}>
            <FaStar /> {data.rating}
          </span>
        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="grid md:grid-cols-3 gap-8">

          {/* LEFT */}
          <div
            className={`md:col-span-2 p-8 rounded-3xl backdrop-blur-xl border shadow-xl ${darkMode
              ? "bg-white/5 border-stone-700"
              : "bg-white border-lime-200"
              }`}
          >
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
              About this Farmhouse
            </h2>

            <p className={`leading-relaxed mb-8 ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>
              {data.description}
            </p>

            {/* Amenities */}
            <h3 className={`font-semibold mb-4 text-lg ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
              Amenities
            </h3>

            <div className="flex flex-wrap gap-3 mb-8">
              {data.amenities.map((a, i) => (
                <span
                  key={i}
                  className={`px-4 py-1 rounded-full border text-xs font-semibold ${
                    darkMode 
                      ? 'bg-lime-500/10 border-lime-500 text-lime-400'
                      : 'bg-lime-100 border-lime-400 text-lime-700'
                  }`}
                >
                  {a}
                </span>
              ))}
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-6">
              <div className={`p-6 rounded-2xl border ${
                darkMode 
                  ? 'bg-lime-500/10 border-lime-500'
                  : 'bg-lime-100 border-lime-400'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                  Price / Hour
                </p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
                  ₹{data.pricePerHour}
                </p>
              </div>

              <div className={`p-6 rounded-2xl border ${
                darkMode 
                  ? 'bg-amber-500/10 border-amber-500'
                  : 'bg-amber-100 border-amber-400'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                  Price / Day
                </p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                  ₹{data.pricePerDay}
                </p>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div
            className={`p-8 rounded-3xl backdrop-blur-xl border shadow-xl ${darkMode
              ? "bg-white/5 border-stone-700"
              : "bg-white border-lime-200"
              }`}
          >
            <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
              Quick Info
            </h3>

            <div className="space-y-6 text-sm">

              <div>
                <p className={darkMode ? 'text-stone-400' : 'text-stone-600'}>
                  Feedback
                </p>
                <p className="font-medium">
                  {data.feedbackSummary}
                </p>
              </div>

              <div>
                <p className={darkMode ? 'text-stone-400' : 'text-stone-600'}>
                  Total Bookings
                </p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
                  {data.bookedSlots.length}
                </p>
              </div>

              <div>
                <p className={darkMode ? 'text-stone-400' : 'text-stone-600'}>
                  Rating
                </p>
                <p className="flex items-center gap-2 font-semibold">
                  <FaStar className={darkMode ? 'text-amber-400' : 'text-amber-500'} />
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
              ? "bg-white/5 border-stone-700"
              : "bg-white border-lime-200"
              }`}
          >
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              darkMode ? 'text-lime-400' : 'text-lime-700'
            }`}>
              <FaCalendarAlt /> Booked Slots
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {data.bookedSlots.map((b) => (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  key={b._id}
                  className={`flex justify-between items-center p-5 rounded-2xl border ${
                    darkMode 
                      ? 'bg-lime-500/10 border-lime-500'
                      : 'bg-lime-100 border-lime-300'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-lg">
                      {b.label}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                      {b.timing}
                    </p>
                  </div>

                  <div className={`text-xs text-right ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                    {new Date(b.checkIn).toLocaleDateString()}
                    <br />–<br />
                    {new Date(b.checkOut).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {data?.vendorCredentials?.name ? (


          < div
            className={`mt-10 p-8 rounded-3xl backdrop-blur-xl border shadow-xl transition ${darkMode
              ? "bg-lime-500/10 border-lime-500"
              : "bg-white border-lime-200"
              }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
                Vendor Credentials
              </h3>

              {/* Copy BOTH */}
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `Farmhouse Credentials:\nUserId: ${data?.vendorCredentials?.name}\nPassword: ${data?.vendorCredentials?.password}`
                  )
                }
                className={`px-4 py-2 rounded-xl border font-semibold text-sm transition ${
                  darkMode 
                    ? 'bg-lime-500/20 border-lime-500 text-lime-400 hover:bg-lime-500/30'
                    : 'bg-lime-100 border-lime-400 text-lime-700 hover:bg-lime-200'
                }`}
              >
                Copy All
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">

              {/* USERNAME */}
              <div
                className={`flex justify-between items-center rounded-2xl border p-5 ${
                  darkMode 
                    ? 'bg-lime-500/10 border-lime-500'
                    : 'bg-lime-100 border-lime-400'
                }`}
              >
                <div>
                  <p className={`text-xs ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                    User ID
                  </p>
                  <p className="font-semibold text-lg">
                    {data?.vendorCredentials?.name}
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${data?.vendorCredentials?.name}`
                    )
                  }
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold transition ${
                    darkMode 
                      ? 'bg-lime-500/20 border-lime-500 text-lime-400 hover:bg-lime-500/30'
                      : 'bg-lime-100 border-lime-400 text-lime-700 hover:bg-lime-200'
                  }`}
                >
                  Copy
                </button>
              </div>

              {/* PASSWORD */}
              <div
                className={`flex justify-between items-center rounded-2xl border p-5 ${
                  darkMode 
                    ? 'bg-lime-500/10 border-lime-500'
                    : 'bg-lime-100 border-lime-400'
                }`}
              >
                <div>
                  <p className={`text-xs ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                    Password
                  </p>
                  <p className="font-semibold text-lg tracking-widest">
                    {showPassword
                      ? data?.vendorCredentials?.password
                      : "••••••••"}
                  </p>
                </div>

                <div className="flex gap-2">
                  {/* Eye Toggle */}
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className={`px-3 py-2 rounded-lg border text-sm font-semibold transition ${
                      darkMode 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 hover:bg-amber-500/30'
                        : 'bg-amber-100 border-amber-400 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                  {/* Copy */}
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${data?.vendorCredentials?.password}`
                      )
                    }
                    className={`px-3 py-2 rounded-lg border text-sm font-semibold transition ${
                      darkMode 
                        ? 'bg-lime-500/20 border-lime-500 text-lime-400 hover:bg-lime-500/30'
                        : 'bg-lime-100 border-lime-400 text-lime-700 hover:bg-lime-200'
                    }`}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Hint */}
            <p className={`text-xs mt-4 ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>
              🔒 Keep these credentials secure. Do not share publicly.
            </p>
          </div>
        ) :
          null
        }



      </div>
    </div >
  );
};

export default SingleFarmhouse;