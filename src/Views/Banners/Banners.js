import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaPlus,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
} from "react-icons/fa";

const Banners = ({ darkMode }) => {
  const [banners, setBanners] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const API_BASE = "http://31.97.206.144:5124/api/auth";

  /* ================= FETCH ================= */
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/all-banners`);
      setBanners(res.data.banners || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  /* ================= CREATE ================= */
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleCreateBanner = async () => {
    if (images.length === 0) {
      alert("Select at least one image");
      return;
    }
    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));
    try {
      setUploading(true);
      await axios.post(`${API_BASE}/create-banner`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImages([]);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await axios.delete(`${API_BASE}/delete-banner/${id}`);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= CAROUSEL ================= */
  const carouselImages = banners.flatMap((b) => b.images || []);

  const nextSlide = () => {
    setCurrentIndex((p) => (p === carouselImages.length - 1 ? 0 : p + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((p) => (p === 0 ? carouselImages.length - 1 : p - 1));
  };

  return (
    <div
      className={`relative min-h-screen p-8 overflow-hidden ${
        darkMode
          ? "bg-gradient-to-br from-stone-900 via-stone-950 to-black text-white"
          : "bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100 text-stone-900"
      }`}
    >
      {/* MESH BACKGROUND */}
      <div className={`absolute top-0 left-0 w-96 h-96 blur-[120px] ${
        darkMode ? "bg-lime-500/10" : "bg-lime-300/30"
      }`} />
      <div className={`absolute bottom-0 right-0 w-96 h-96 blur-[120px] ${
        darkMode ? "bg-amber-500/10" : "bg-amber-300/30"
      }`} />

      <div className="relative max-w-7xl mx-auto">
        {/* HEADER */}
        <h1 className={`text-4xl font-bold mb-10 tracking-tight flex items-center gap-3 ${
          darkMode ? "text-lime-400" : "text-lime-700"
        }`}>
          <FaImages className={darkMode ? "text-lime-400" : "text-lime-600"} />
          Banner Management
        </h1>

        {/* ================= HERO CAROUSEL ================= */}
        {carouselImages.length > 0 && (
          <div className="relative mb-14">
            {/* glow */}
            <div className={`absolute inset-0 opacity-20 blur-3xl rounded-3xl ${
              darkMode
                ? "bg-gradient-to-r from-lime-500 via-amber-500 to-lime-500"
                : "bg-gradient-to-r from-lime-400 via-amber-400 to-lime-400"
            }`}></div>

            <div className="relative rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)] group">
              <img
                src={carouselImages[currentIndex]}
                alt="banner"
                className="w-full h-[420px] object-cover transition duration-700 group-hover:scale-105"
              />
              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              {/* controls */}
              <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-xl hover:bg-white/40 p-3 rounded-full transition"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-xl hover:bg-white/40 p-3 rounded-full transition"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* ================= UPLOAD ================= */}
        <div className="relative mb-14">
          <div className={`absolute inset-0 blur-2xl rounded-3xl ${
            darkMode ? "bg-lime-500/10" : "bg-lime-200/40"
          }`}></div>

          <div
            className={`relative rounded-3xl p-10 backdrop-blur-2xl border ${
              darkMode
                ? "bg-white/5 border-stone-700"
                : "bg-white/70 border-lime-200"
            }`}
          >
            <h2 className={`text-2xl font-semibold mb-6 ${
              darkMode ? "text-lime-400" : "text-lime-700"
            }`}>
              Upload New Banner
            </h2>

            {/* DROPZONE */}
            <label
              className={`flex flex-col items-center justify-center gap-3
              border-2 border-dashed rounded-2xl cursor-pointer py-12
              transition hover:scale-[1.01] ${
                darkMode
                  ? "border-stone-700 hover:border-lime-500"
                  : "border-lime-300 hover:border-lime-500 bg-lime-50/50"
              }`}
            >
              <FaImages className={`text-3xl ${darkMode ? "text-lime-400" : "text-lime-600"}`} />
              <p className={`font-medium ${darkMode ? "text-stone-300" : "text-stone-700"}`}>
                Click to upload or drag images
              </p>
              <span className={`text-sm ${darkMode ? "text-stone-500" : "text-stone-500"}`}>
                PNG, JPG recommended
              </span>
              <input type="file" multiple onChange={handleImageChange} hidden />
            </label>

            {/* preview */}
            {images.length > 0 && (
              <div className="flex gap-4 mt-6 flex-wrap">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    alt=""
                    className="w-24 h-24 object-cover rounded-xl shadow-lg border-2 border-lime-400"
                  />
                ))}
              </div>
            )}

            <button
              onClick={handleCreateBanner}
              disabled={uploading}
              className="mt-8 px-8 py-3 rounded-xl
              bg-gradient-to-r from-lime-500 to-amber-500
              hover:from-lime-600 hover:to-amber-600
              hover:scale-105 shadow-2xl font-semibold text-white
              flex items-center gap-2 transition disabled:opacity-50"
            >
              {uploading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
              {uploading ? "Uploading..." : "Create Banner"}
            </button>
          </div>
        </div>

        {/* ================= GRID ================= */}
        <div
          className={`rounded-3xl p-8 backdrop-blur-2xl border ${
            darkMode
              ? "bg-white/5 border-stone-700"
              : "bg-white/70 border-lime-200"
          }`}
        >
          <h2 className={`text-2xl font-semibold mb-8 ${
            darkMode ? "text-lime-400" : "text-lime-700"
          }`}>
            All Banners
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <FaSpinner className={`animate-spin text-3xl ${
                darkMode ? "text-lime-400" : "text-lime-600"
              }`} />
            </div>
          ) : banners.length === 0 ? (
            <p className={`text-center ${darkMode ? "text-stone-400" : "text-stone-600"}`}>
              No banners found
            </p>
          ) : (
            banners.map((banner) => (
              <div
                key={banner._id}
                className={`mb-10 p-6 rounded-2xl border hover:scale-[1.01] transition ${
                  darkMode
                    ? "bg-stone-800/40 border-stone-700"
                    : "bg-lime-50/50 border-lime-200"
                }`}
              >
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                  {banner.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      className="h-40 w-full object-cover rounded-xl shadow-lg hover:scale-105 transition border-2 border-lime-300"
                    />
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl
                    bg-red-600 hover:bg-red-700 text-white
                    shadow-lg hover:scale-105 transition"
                  >
                    <FaTrash />
                    Delete Banner
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Banners;