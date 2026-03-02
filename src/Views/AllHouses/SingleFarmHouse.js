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
import Swal from "sweetalert2";
import toast from "react-hot-toast";

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

  const copyToClipboard = async (text) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      // 🎉 Toast success animation
      toast.success("Copied to clipboard!", {
        duration: 2000,
        style: {
          borderRadius: "12px",
          background: "#111",
          color: "#fff",
          padding: "12px 18px",
          fontSize: "14px",
        },
      });

    } catch (err) {
      toast.error("Copy failed!");
      console.error(err);
    }
  };

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-base sm:text-lg font-semibold animate-pulse opacity-70">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 sm:mb-8 px-4 sm:px-6 py-2 rounded-xl font-semibold bg-lime-600 hover:bg-lime-700 text-white shadow-lg transition text-sm sm:text-base"
        >
          <FaArrowLeft /> Back
        </button>

        {/* HERO CAROUSEL */}
        <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] mb-8">
          <AnimatePresence mode="wait">
            <motion.img
              key={data.images[index]}
              src={data.images[index]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[260px] sm:h-[340px] md:h-[420px] lg:h-[520px] w-full object-cover"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* TITLE */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 sm:px-6 sm:py-4">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {data.name}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <FaMapMarkerAlt /> {data.address}
            </div>
          </div>

          <button onClick={prevSlide} className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-white/20 p-2 sm:p-3 rounded-full">
            <FaChevronLeft />
          </button>
          <button onClick={nextSlide} className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-white/20 p-2 sm:p-3 rounded-full">
            <FaChevronRight />
          </button>
        </div>

        {/* BADGES */}
        <div className="flex gap-2 sm:gap-3 mb-6 flex-wrap">
          <span className="px-4 py-1 rounded-full bg-lime-500 text-white">
            {data.bookingFor}
          </span>
          <span className="px-4 py-1 rounded-full flex items-center gap-1 bg-amber-400 text-stone-900">
            <FaStar /> {data.rating}
          </span>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div
            className={`lg:col-span-2 p-5 sm:p-6 lg:p-8 rounded-3xl border ${darkMode ? "bg-white/5 border-stone-700" : "bg-white border-lime-200"
              }`}
          >
            <h2 className="text-2xl font-bold mb-4 text-lime-600">
              About this Farmhouse
            </h2>
            <p className="mb-6">{data.description}</p>

            <h3 className="font-semibold mb-4 text-lg text-lime-600">
              Amenities
            </h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {data.amenities.map((a, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-lime-100 text-lime-700 text-xs font-semibold">
                  {a}
                </span>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-lime-100 text-gray-900 border border-lime-400">
                ₹{data.pricePerHour}/hr
              </div>
              <div className="p-6 rounded-2xl bg-amber-100 text-gray-900 border border-amber-400">
                ₹{data.pricePerDay}/day
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className={`p-5 sm:p-6 lg:p-8 rounded-3xl border ${darkMode ? "bg-white/5 border-stone-700" : "bg-white border-lime-200"
            }`}>
            <h3 className="text-xl font-bold mb-6 text-lime-600">
              Quick Info
            </h3>
            <p>{data.feedbackSummary}</p>
            <p className="text-3xl font-bold mt-4 text-lime-600">
              {data.bookedSlots.length} bookings
            </p>
          </div>
        </div>

        {/* BOOKED SLOTS */}
        {data.bookedSlots.length > 0 && (
          <div className={`mt-10 p-6 rounded-3xl border bg-white border-lime-200  ${darkMode ? "bg-white/5 border-stone-700" : "bg-white border-lime-200"
            }`}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-lime-600">
              <FaCalendarAlt /> Booked Slots
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.bookedSlots.map((b) => (
                <div key={b._id} className="p-4 rounded-xl bg-lime-100 text-gray-900 border border-lime-300">
                  <p className="font-semibold">{b.label}</p>
                  <p className="text-sm">{b.timing}</p>
                </div>
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
                onClick={async () => {
                  const text = [
  "Farmhouse Credentials",
  "---------------------",
  `User ID : ${data?.vendorCredentials?.name || ""}`,
  `Password: ${data?.vendorCredentials?.password || ""}`
].join("\n");

                  copyToClipboard(text);

                  Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Credentials copied to clipboard",
                    showConfirmButton: false,
                    timer: 1800,
                    timerProgressBar: true,
                  });
                }}
                className={`px-4 py-2 rounded-xl border font-semibold text-sm transition ${darkMode
                  ? "bg-lime-500/20 border-lime-500 text-lime-400 hover:bg-lime-500/30"
                  : "bg-lime-100 border-lime-400 text-lime-700 hover:bg-lime-200"
                  }`}
              >
                Copy All
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">

              {/* USERNAME */}
              <div
                className={`flex justify-between items-center rounded-2xl border p-5 ${darkMode
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
                  onClick={async () => {
                    copyToClipboard(data?.vendorCredentials?.name || "");

                    Swal.fire({
                      toast: true,
                      position: "top-end",
                      icon: "success",
                      title: "User ID copied",
                      showConfirmButton: false,
                      timer: 1600,
                      timerProgressBar: true,
                    });
                  }}
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold transition ${darkMode
                    ? "bg-lime-500/20 border-lime-500 text-lime-400 hover:bg-lime-500/30"
                    : "bg-lime-100 border-lime-400 text-lime-700 hover:bg-lime-200"
                    }`}
                >
                  Copy
                </button>
              </div>

              {/* PASSWORD */}
              <div
                className={`flex justify-between items-center rounded-2xl border p-5 ${darkMode
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
                    className={`px-3 py-2 rounded-lg border text-sm font-semibold transition ${darkMode
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 hover:bg-amber-500/30'
                      : 'bg-amber-100 border-amber-400 text-amber-700 hover:bg-amber-200'
                      }`}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                  {/* Copy */}
                  <button
                    onClick={async () => {
                      copyToClipboard(data?.vendorCredentials?.password || "");

                      Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: "Password copied",
                        showConfirmButton: false,
                        timer: 1600,
                        timerProgressBar: true,
                      });
                    }}
                    className={`px-3 py-2 rounded-lg border text-sm font-semibold transition ${darkMode
                      ? "bg-lime-500/20 border-lime-500 text-lime-400 hover:bg-lime-500/30"
                      : "bg-lime-100 border-lime-400 text-lime-700 hover:bg-lime-200"
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