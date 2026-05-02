import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaMusic,
  FaCar,
  FaGamepad,
  FaLeaf,
  FaUser,
  FaHistory,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaCopy,
  FaIdCard,
  FaUserShield,
  FaVideo,
  FaRupeeSign,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const API_BASE = "https://backend.vfarmstays.com/api";

const AMENITY_ICONS = {
  "Swimming Pool": <FaSwimmingPool className="mr-2" />,
  "BBQ Area": <FaUtensils className="mr-2" />,
  "Indoor Games": <FaGamepad className="mr-2" />,
  "Outdoor Lawn": <FaLeaf className="mr-2" />,
  "Music System": <FaMusic className="mr-2" />,
  "Free Parking": <FaCar className="mr-2" />,
  WiFi: <FaWifi className="mr-2" />,
};

const BOOKINGS_PER_PAGE = 10;

// ─── PAGINATION COMPONENT ─────────────────────────────────
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  const renderPages = [];
  let prev = null;
  for (const p of visiblePages) {
    if (prev !== null && p - prev > 1) {
      renderPages.push("...");
    }
    renderPages.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-amber-200
          text-amber-600 hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <FaChevronLeft size={12} />
      </button>

      {renderPages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-sm font-semibold transition border
              ${p === currentPage
                ? "bg-gradient-to-r from-amber-500 to-lime-500 text-white border-transparent shadow-md"
                : "border-amber-200 text-gray-600 hover:bg-amber-50"
              }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-amber-200
          text-amber-600 hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <FaChevronRight size={12} />
      </button>
    </div>
  );
};

const SingleFarmhouse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  useEffect(() => {
    const fetchFarmhouse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/farmhouse/${id}`);
        setData(res.data.farmhouse);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load farmhouse details");
        Swal.fire("Error", "Could not load farmhouse data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchFarmhouse();
  }, [id]);

  const nextSlide = () =>
    setIndex((prev) => (prev + 1) % (data?.images?.length || 1));
  const prevSlide = () =>
    setIndex((prev) =>
      prev === 0 ? (data?.images?.length || 1) - 1 : prev - 1
    );

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const isPastBooking = (checkOut) => new Date(checkOut) < new Date();

  const copyToClipboard = async (text, successTitle = "Copied to clipboard!") => {
    try {
      if (window.isSecureContext && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: successTitle,
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error("Clipboard error:", err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to copy",
        showConfirmButton: false,
        timer: 1600,
      });
    }
  };

  const handleCopyFullCredentials = () => {
    const text = [
      "Farmhouse Credentials",
      "---------------------",
      `User ID : ${data?.vendorCredentials?.name || ""}`,
      `Password: ${data?.vendorCredentials?.password || ""}`,
    ].join("\n");
    copyToClipboard(text, "Credentials copied to clipboard");
  };

  const handleCopyUsername = () => {
    copyToClipboard(data?.vendorCredentials?.name || "", "User ID copied");
  };

  const handleCopyPassword = () => {
    copyToClipboard(data?.vendorCredentials?.password || "", "Password copied");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-lime-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-amber-700">Loading farmhouse...</p>
        </div>
      </div>
    );

  if (error || !data)
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Oops!</h3>
          <p className="text-gray-600 mb-6">{error || "Farmhouse not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-lime-500 text-white rounded-xl font-semibold hover:scale-105 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const {
    name,
    images = [],
    address,
    description,
    noOfPersons,
    amenities = [],
    price,
    timePrices = [],
    active,
    rating,
    bookedSlots = [],
    createdAt,
    location,
    vendorCredentials,
  } = data;

  const upcomingBookings = bookedSlots.filter((b) => !isPastBooking(b.checkOut));
  const pastBookings = bookedSlots.filter((b) => isPastBooking(b.checkOut));

  const upcomingTotalPages = Math.max(1, Math.ceil(upcomingBookings.length / BOOKINGS_PER_PAGE));
  const pastTotalPages = Math.max(1, Math.ceil(pastBookings.length / BOOKINGS_PER_PAGE));

  const paginatedUpcoming = upcomingBookings.slice(
    (upcomingPage - 1) * BOOKINGS_PER_PAGE,
    upcomingPage * BOOKINGS_PER_PAGE
  );
  const paginatedPast = pastBookings.slice(
    (pastPage - 1) * BOOKINGS_PER_PAGE,
    pastPage * BOOKINGS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-lime-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* BACK BUTTON */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-5 py-2.5 rounded-xl font-semibold 
          bg-white/80 backdrop-blur-sm border border-amber-200 text-amber-700 
          shadow-md hover:shadow-lg transition-all"
        >
          <FaArrowLeft /> <span className="hidden sm:inline">Back</span>
        </motion.button>

        {/* HERO IMAGE CAROUSEL */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 group">
          <AnimatePresence mode="wait">
            <motion.img
              key={images[index]}
              src={images[index]?.trim()}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="h-[280px] sm:h-[420px] lg:h-[520px] w-full object-cover"
              alt={`${name} - View ${index + 1}`}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg"
            >
              {name}
            </motion.h1>
            <p className="flex items-center gap-2 text-white/95 text-lg drop-shadow">
              <FaMapMarkerAlt className="text-amber-300" /> {address}
            </p>
          </div>
          {images.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md 
                p-3 rounded-full text-white hover:bg-white/30 transition border border-white/30"
                aria-label="Previous image"
              >
                <FaChevronLeft size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md 
                p-3 rounded-full text-white hover:bg-white/30 transition border border-white/30"
                aria-label="Next image"
              >
                <FaChevronRight size={20} />
              </motion.button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${idx === index ? "bg-white scale-110 shadow-lg" : "bg-white/50 hover:bg-white/70"
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
          <div className="absolute top-4 right-4">
            {active ? (
              <span className="px-4 py-2 rounded-full bg-lime-500/90 backdrop-blur-sm text-white flex items-center gap-2 text-sm font-semibold shadow-lg">
                <FaCheckCircle /> Available
              </span>
            ) : (
              <span className="px-4 py-2 rounded-full bg-red-500/90 backdrop-blur-sm text-white flex items-center gap-2 text-sm font-semibold shadow-lg">
                <FaTimesCircle /> Unavailable
              </span>
            )}
          </div>
        </div>

        {/* PRICE & ACTIONS BAR */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-10 p-5 
        bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100">
          <div className="flex flex-wrap items-center gap-4">
            <span className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-lime-500 text-white font-bold text-xl shadow-md">
              ₹{price} <span className="text-sm font-normal opacity-90">/ day</span>
            </span>
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-100 text-amber-700 font-semibold">
              <FaStar className="text-amber-500 fill-amber-500" /> {rating ?? "New"}
            </span>
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lime-100 text-lime-700 text-sm">
              <FaClock /> {timePrices.length} time slots
            </span>
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-100 text-amber-700 text-sm">
              <FaCheckCircle /> {amenities.length} amenities
            </span>
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lime-100 text-lime-700 text-sm">
              <FaUser /> {noOfPersons} persons
            </span>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/admin/edit/${id}`)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-amber-500 text-white font-semibold shadow-md hover:shadow-lg transition"
            >
              Edit Farmhouse
            </motion.button>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">

            {/* ── VIDEO PREVIEW ── */}
            {data.video && (
              <div className="mb-8 w-full">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-amber-700 flex items-center gap-2">
                  <FaVideo className="text-amber-500 text-base sm:text-lg" />
                  Video Preview
                </h2>
                <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg">
                  <div className="w-full aspect-video bg-black">
                    <video
                      src={data.video}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── ABOUT ── */}
            <section className="bg-white p-7 rounded-3xl shadow-xl border border-amber-100">
              <h2 className="text-2xl font-bold mb-4 text-amber-700 flex items-center gap-2">
                <FaLeaf className="text-lime-500" /> About This Farmhouse
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">{description}</p>
            </section>

            {/* ── AMENITIES ── */}
            <section className="bg-white p-7 rounded-3xl shadow-xl border border-lime-100">
              <h3 className="text-xl font-bold mb-5 text-lime-700 flex items-center gap-2">
                <FaCheckCircle className="text-lime-500" /> Amenities
              </h3>
              <div className="flex flex-wrap gap-3">
                {amenities.map((item, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-lime-50 to-amber-50 
                    text-lime-800 font-medium text-sm border border-lime-200 
                    flex items-center gap-1.5 shadow-sm hover:shadow transition"
                  >
                    {AMENITY_ICONS[item] || <FaCheckCircle className="mr-1.5 text-lime-500" />}
                    {item}
                  </motion.span>
                ))}
              </div>
            </section>

            {/* ── TIME PRICES ── */}
            {timePrices.length > 0 && (
              <section className="bg-white p-7 rounded-3xl shadow-xl border border-amber-100">
                <h3 className="text-xl font-bold mb-5 text-amber-700 flex items-center gap-2">
                  <FaClock className="text-amber-500" /> Time Slots & Pricing
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {timePrices.map((tp, i) => (
                    <motion.div
                      key={tp._id || i}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-lime-50 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-amber-800 capitalize text-base">
                          {tp.label}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            tp.isActive
                              ? "bg-lime-100 text-lime-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {tp.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <FaClock className="text-amber-400 flex-shrink-0" />
                        <span>{tp.timing}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                        <FaRupeeSign className="text-lime-500 flex-shrink-0" />
                        <span>₹{tp.price}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* ── BOOKING HISTORY ── */}
            <section className="bg-white p-7 rounded-3xl shadow-xl border border-amber-100">
              <h3 className="text-xl font-bold mb-5 text-amber-700 flex items-center gap-2">
                <FaHistory className="text-amber-500" /> Booking History
              </h3>

              {bookedSlots.length > 0 ? (
                <div className="space-y-8">
                  {/* ── UPCOMING ── */}
                  {upcomingBookings.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lime-700 flex items-center gap-2">
                          <FaCheckCircle className="text-lime-500" />
                          Upcoming ({upcomingBookings.length})
                        </h4>
                        {upcomingTotalPages > 1 && (
                          <span className="text-xs text-gray-400">
                            Page {upcomingPage} of {upcomingTotalPages}
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        {paginatedUpcoming.map((booking) => (
                          <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 rounded-2xl bg-gradient-to-r from-lime-50 to-amber-50 
                            border border-lime-200 shadow-sm"
                          >
                            <div className="flex flex-wrap justify-between items-start gap-3">
                              <div className="flex-1 min-w-[200px]">
                                <div className="flex items-center gap-2 mb-2">
                                  <FaUser className="text-amber-500" />
                                  <span className="font-semibold text-gray-800">
                                    User: {booking.userId?.slice(-6) || "N/A"}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 flex items-center gap-1.5">
                                  <FaCalendarAlt className="text-amber-500" />
                                  {formatDate(booking.date)}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                                  <FaClock className="text-lime-500" />
                                  {booking.timing} • {booking.label}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="inline-block px-3 py-1 rounded-full bg-lime-100 text-lime-700 text-xs font-semibold">
                                  Confirmed
                                </span>
                                <p className="text-xs text-gray-500 mt-1">
                                  Booked: {formatDate(booking.bookedAt)}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <Pagination
                        currentPage={upcomingPage}
                        totalPages={upcomingTotalPages}
                        onPageChange={(p) => setUpcomingPage(p)}
                      />
                    </div>
                  )}

                  {/* ── PAST ── */}
                  {pastBookings.length > 0 && (
                    <div className="pt-4 border-t border-amber-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-600 flex items-center gap-2">
                          <FaHistory className="text-gray-400" />
                          Past ({pastBookings.length})
                        </h4>
                        {pastTotalPages > 1 && (
                          <span className="text-xs text-gray-400">
                            Page {pastPage} of {pastTotalPages}
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        {paginatedPast.map((booking) => (
                          <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 rounded-2xl bg-gray-50 border border-gray-200 opacity-80"
                          >
                            <div className="flex flex-wrap justify-between items-start gap-3">
                              <div className="flex-1 min-w-[200px]">
                                <div className="flex items-center gap-2 mb-2">
                                  <FaUser className="text-gray-400" />
                                  <span className="font-semibold text-gray-600">
                                    User: {booking.userId?.slice(-6) || "N/A"}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                  <FaCalendarAlt className="text-gray-400" />
                                  {formatDate(booking.date)}
                                </p>
                                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                  <FaClock className="text-gray-400" />
                                  {booking.timing} • {booking.label}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">
                                  Completed
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <Pagination
                        currentPage={pastPage}
                        totalPages={pastTotalPages}
                        onPageChange={(p) => setPastPage(p)}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaHistory className="text-amber-300 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500 italic">No bookings yet. Be the first to book!</p>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN - Sidebar */}
          <div className="space-y-6">
            {/* Quick Details */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-lime-100 sticky top-6">
              <h3 className="text-xl font-bold mb-5 text-lime-700">Quick Details</h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-amber-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-sm text-gray-600">{address}</p>
                  </div>
                </div>
                {location?.coordinates && (
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-lime-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Coordinates</p>
                      <p className="text-sm text-gray-600 font-mono">
                        {location.coordinates[1]?.toFixed(4)}, {location.coordinates[0]?.toFixed(4)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-amber-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Listed On</p>
                    <p className="text-sm text-gray-600">
                      {new Date(createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaClock className="text-lime-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Total Bookings</p>
                    <p className="text-sm text-gray-600">
                      <span className="font-bold text-amber-600">{bookedSlots.length}</span> confirmed
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-amber-100">
                  <p className="text-sm text-gray-500">
                    <strong className="text-amber-700">ID:</strong>{" "}
                    <span className="font-mono text-xs break-all">{id}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Vendor Credentials */}
            {vendorCredentials && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-amber-100 to-lime-100 p-6 rounded-3xl 
                shadow-xl border border-amber-300 sticky top-[420px]"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-amber-800 flex items-center gap-2">
                    <FaUserShield className="text-lime-600" /> Vendor Credentials
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyFullCredentials}
                    className="px-3 py-1.5 rounded-lg bg-amber-200 text-amber-800 text-sm font-semibold flex items-center gap-2 hover:bg-amber-300 transition shadow-sm"
                    title="Copy both username and password"
                  >
                    <FaCopy size={12} /> Copy All
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/70 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-3">
                      <FaUser className="text-amber-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Username</p>
                        <p className="font-mono font-semibold text-gray-800">{vendorCredentials.name}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCopyUsername}
                      className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                      title="Copy username"
                    >
                      <FaCopy size={14} />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/70 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-3">
                      <FaKey className="text-lime-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Password</p>
                        <p className="font-mono font-semibold text-gray-800">
                          {showPassword ? vendorCredentials.password : "••••••••"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 rounded-lg bg-lime-100 text-lime-700 hover:bg-lime-200 transition"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCopyPassword}
                        className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                        title="Copy password"
                      >
                        <FaCopy size={14} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/70 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-3">
                      <FaIdCard className="text-amber-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Vendor ID</p>
                        <p className="font-mono text-xs text-gray-700 break-all">{vendorCredentials.vendorId}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(vendorCredentials.vendorId, "Vendor ID copied")}
                      className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition flex-shrink-0"
                      title="Copy Vendor ID"
                    >
                      <FaCopy size={14} />
                    </motion.button>
                  </div>

                  <div className="pt-2 border-t border-amber-200">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <FaCalendarAlt className="text-amber-400" />
                      Created: {formatDate(vendorCredentials.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 p-3 bg-amber-50 border border-amber-300 rounded-xl">
                  <p className="text-xs text-amber-800 flex items-start gap-2">
                    <FaTimesCircle className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Keep credentials secure!</strong> Never share these details publicly.
                      Change password after first login.
                    </span>
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleFarmhouse;