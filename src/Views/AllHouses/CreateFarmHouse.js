import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const API_BASE = "https://backend.vfarmstays.com/api";

const initialForm = {
  name: "",
  address: "",
  description: "",
  amenities: "",
  lat: "",
  lng: "",
  price: "",
  active: true,
  bookingFor: "",
  rating: "",
  noOfPersons: "",
};

const FarmhouseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [existingVideo, setExistingVideo] = useState("");
  const [timePrices, setTimePrices] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FORMAT TIME (24h → 12h AM/PM) ================= */
  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  /* ================= PARSE TIME (12h AM/PM → 24h) ================= */
  const parseTime = (timeStr) => {
    if (!timeStr) return "";
    // Handles "9:00 AM" or "12:00 PM" format
    const trimmed = timeStr.trim();
    const [time, modifier] = trimmed.split(" ");
    if (!time || !modifier) return "";
    
    let [hour, minute] = time.split(":").map(Number);
    
    if (modifier.toUpperCase() === "PM" && hour !== 12) {
      hour += 12;
    }
    if (modifier.toUpperCase() === "AM" && hour === 12) {
      hour = 0;
    }
    
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  /* ================= FETCH FOR EDIT ================= */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchData = async () => {
      try {
        Swal.fire({
          title: "Loading...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        const res = await axios.get(`${API_BASE}/farmhouse/${id}`);
        const f = res.data.farmhouse;

        setForm({
          name: f.name || "",
          address: f.address || "",
          description: f.description || "",
          amenities: f.amenities?.join(",") || "",
          lat: f.location?.coordinates?.[1] || "",
          lng: f.location?.coordinates?.[0] || "",
          price: f.price || "",
          active: f.active ?? true,
          bookingFor: f.bookingFor || "",
          rating: f.rating || "",
          noOfPersons: f.noOfPersons || "",
        });

        setExistingImages(f.images || []);
        setExistingVideo(f.video || "");
        
        // Parse timePrices: split "9:00 AM - 12:00 PM" → start/end in 24h format
        setTimePrices(
          f.timePrices?.map((tp) => {
            const [startRaw, endRaw] = tp.timing?.split(" - ") || ["", ""];
            return {
              label: tp.label || "",
              start: parseTime(startRaw),
              end: parseTime(endRaw),
            };
          }) || []
        );

        Swal.close();
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire("Error", "Failed to load farmhouse", "error");
      }
    };

    fetchData();
  }, [id, isEditMode]);

  /* ================= HANDLERS ================= */

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addTimePrice = () =>
    setTimePrices([...timePrices, { label: "", start: "", end: "" }]);

  const updateTimePrice = (index, key, value) => {
    const updated = [...timePrices];
    updated[index][key] = value;
    setTimePrices(updated);
  };

  const removeTimePrice = (index) => {
    setTimePrices(timePrices.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {
      setLoading(true);

      Swal.fire({
        title: isEditMode ? "Updating..." : "Creating...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const fd = new FormData();

      fd.append("name", form.name);
      fd.append("address", form.address);
      fd.append("description", form.description);
      fd.append("amenities", form.amenities);
      fd.append("lat", form.lat);
      fd.append("lng", form.lng);
      fd.append("price", form.price);
      fd.append("active", form.active);
      fd.append("bookingFor", form.bookingFor);
      fd.append("rating", form.rating);
      fd.append("noOfPersons", form.noOfPersons);

      const formattedTimePrices = timePrices
        .filter((tp) => tp.label && tp.start && tp.end) // Only send complete slots
        .map((tp) => ({
          label: tp.label,
          timing: `${formatTime(tp.start)} - ${formatTime(tp.end)}`,
        }));

      fd.append("timePrices", JSON.stringify(formattedTimePrices));

      images.forEach((img) => {
        fd.append("images", img);
      });

      if (video) {
        fd.append("video", video);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (isEditMode) {
        await axios.put(`${API_BASE}/farmhouse/${id}`, fd, config);
      } else {
        await axios.post(`${API_BASE}/farmhouse-create`, fd, config);
      }

      Swal.fire("Success", "Farmhouse saved successfully!", "success");
      navigate("/admin/farmhouses");
    } catch (err) {
      console.error("Submit error:", err);
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10 bg-gradient-to-br from-amber-50 via-lime-50 to-amber-100">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-amber-200">

        {/* HEADER */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-xl font-semibold
          bg-gradient-to-r from-amber-500 to-lime-500 text-white shadow-lg hover:scale-105 transition"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-amber-600 to-lime-600 bg-clip-text text-transparent">
          {isEditMode ? "Edit Farmhouse" : "Create Farmhouse"}
        </h2>

        {/* FORM GRID */}
        <div className="grid sm:grid-cols-2 gap-6">
          {Object.keys(initialForm).map((key) => (
            <div key={key} className="flex flex-col gap-2">
              <label className="font-semibold capitalize text-amber-700">
                {key === "noOfPersons" ? "Number of Persons" : key}
              </label>

              {key === "active" ? (
                <select
                  name="active"
                  value={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.value === "true" })
                  }
                  className="p-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-lime-400 outline-none"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              ) : key === "rating" ? (
                <select
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  className="p-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-lime-400 outline-none"
                >
                  <option value="">Select Rating</option>
                  <option value="1">1 Star</option>
                  <option value="1.5">1.5 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="2.5">2.5 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="3.5">3.5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="4.5">4.5 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              ) : key === "bookingFor" ? (
                <select
                  name="bookingFor"
                  value={form.bookingFor}
                  onChange={handleChange}
                  className="p-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-lime-400 outline-none"
                >
                  <option value="">Select Booking Type</option>
                  <option value="Family">Family</option>
                  <option value="Couple">Couple</option>
                  <option value="Friends">Friends</option>
                  <option value="Corporate">Corporate</option>
                </select>
              ) : key === "noOfPersons" ? (
                <input
                  name={key}
                  type="number"
                  value={form[key]}
                  onChange={handleChange}
                  className="p-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-lime-400 outline-none"
                  placeholder="Enter maximum persons"
                />
              ) : (
                <input
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="p-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-lime-400 outline-none"
                />
              )}
            </div>
          ))}
        </div>

        {/* IMAGE UPLOAD */}
        <div className="mt-10">
          <label className="font-semibold text-amber-700">
            Upload Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...e.target.files])}
            className="mt-3 w-full border-2 border-dashed border-lime-400 p-4 rounded-xl bg-lime-50"
          />
          
          {/* Show existing images in edit mode */}
          {isEditMode && existingImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-amber-700 mb-2">Existing Images:</p>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.trim()}
                    alt={`Existing ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-amber-200"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* VIDEO UPLOAD */}
        <div className="mt-10">
          <label className="font-semibold text-amber-700">
            Upload Video (Optional)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="mt-3 w-full border-2 border-dashed border-lime-400 p-4 rounded-xl bg-lime-50"
          />
          
          {/* Show existing video in edit mode */}
          {isEditMode && existingVideo && (
            <div className="mt-4">
              <p className="text-sm text-amber-700 mb-2">Existing Video:</p>
              <video
                src={existingVideo}
                controls
                className="w-64 rounded-lg border border-amber-200"
              />
            </div>
          )}
        </div>

        {/* TIME SLOTS */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-amber-700">
              Time Slots
            </h3>
            <button
              onClick={addTimePrice}
              className="flex items-center gap-2 px-4 py-2 rounded-xl
              bg-gradient-to-r from-amber-500 to-lime-500 text-white shadow-lg hover:scale-105 transition"
            >
              <FaPlus /> Add Slot
            </button>
          </div>

          {timePrices.map((tp, i) => (
            <div
              key={i}
              className="grid sm:grid-cols-4 gap-4 mb-4 p-4 rounded-2xl border border-amber-200 bg-lime-50"
            >
              <input
                value={tp.label}
                onChange={(e) =>
                  updateTimePrice(i, "label", e.target.value)
                }
                placeholder="Label (e.g., Morning)"
                className="p-3 rounded-xl border border-amber-300"
              />

              <input
                type="time"
                value={tp.start}
                onChange={(e) =>
                  updateTimePrice(i, "start", e.target.value)
                }
                className="p-3 rounded-xl border border-amber-300"
              />

              <input
                type="time"
                value={tp.end}
                onChange={(e) =>
                  updateTimePrice(i, "end", e.target.value)
                }
                className="p-3 rounded-xl border border-amber-300"
              />

              <button
                onClick={() => removeTimePrice(i)}
                className="bg-red-500 text-white rounded-xl flex justify-center items-center hover:bg-red-600 transition"
                title="Remove slot"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          
          {timePrices.length === 0 && (
            <p className="text-amber-600 text-sm italic">No time slots added yet.</p>
          )}
        </div>

        {/* SUBMIT */}
        <div className="mt-10 flex justify-end">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-8 py-3 rounded-xl font-bold text-white
            bg-gradient-to-r from-amber-500 to-lime-600
            hover:scale-105 transition shadow-xl disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default FarmhouseForm;