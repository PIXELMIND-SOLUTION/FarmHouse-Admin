import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const API_BASE = "http://31.97.206.144:5124/api";

const initialForm = {
  name: "",
  address: "",
  description: "",
  amenities: "",
  rating: "",
  feedbackSummary: "",
  bookingFor: "",
  lat: "",
  lng: "",
  pricePerHour: "",
  pricePerDay: "",
};

const FarmhouseForm = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [timePrices, setTimePrices] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchData = async () => {
      Swal.fire({
        title: "Loading Farmhouse...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const res = await axios.get(`${API_BASE}/farmhouse/${id}`);
        const f = res.data.farmhouse;

        setForm({
          name: f.name || "",
          address: f.address || "",
          description: f.description || "",
          amenities: f.amenities?.join(",") || "",
          rating: f.rating || "",
          feedbackSummary: f.feedbackSummary || "",
          bookingFor: f.bookingFor || "",
          lat: f.location?.coordinates?.[1] || "",
          lng: f.location?.coordinates?.[0] || "",
          pricePerHour: f.pricePerHour || "",
          pricePerDay: f.pricePerDay || "",
        });

        setExistingImages(f.images || []);
        setTimePrices(f.timePrices || []);

        Swal.close(); // close loading popup

      } catch (err) {
        console.error("Fetch Error:", err);

        Swal.fire({
          icon: "error",
          title: "Failed to Load",
          text: "Unable to fetch farmhouse data.",
        });
      }
    };

    fetchData();
  }, [id, isEditMode]);

  /* ================= HANDLERS ================= */

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addTimePrice = () =>
    setTimePrices([...timePrices, { label: "", timing: "" }]);

  const updateTimePrice = (index, key, value) => {
    const updated = [...timePrices];
    updated[index][key] = value;
    setTimePrices(updated);
  };

  const removeTimePrice = (index) => {
    if (!window.confirm("Remove this time slot?")) return;
    setTimePrices(timePrices.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 🔵 Loading popup
      Swal.fire({
        title: isEditMode ? "Updating Farmhouse..." : "Creating Farmhouse...",
        text: "Please wait while we save the data.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });

      fd.append("timePrices", JSON.stringify(timePrices));

      images.forEach((img) => {
        fd.append("images", img);
      });

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (isEditMode) {
        await axios.put(`${API_BASE}/farmhouse/${id}`, fd, config);

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Farmhouse updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

      } else {
        await axios.post(`${API_BASE}/farmhouse-create`, fd, config);

        Swal.fire({
          icon: "success",
          title: "Created!",
          text: "Farmhouse created successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      navigate("/admin/farmhouses");

    } catch (err) {
      console.error("API ERROR:", err?.response?.data || err.message);

      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text:
          err?.response?.data?.message ||
          "Something went wrong while saving farmhouse.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-8 ${darkMode
        ? "bg-gradient-to-br from-stone-900 via-stone-950 to-black text-white"
        : "bg-gradient-to-br from-lime-100 via-white to-lime-200"
        }`}
    >
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-5 py-2 rounded-xl font-semibold
          bg-lime-600 hover:bg-lime-700 text-white shadow-lg"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
          {isEditMode ? "✏️ Edit Farmhouse" : "➕ Create Farmhouse"}
        </h2>

        <div
          className={`p-8 rounded-3xl border shadow-2xl backdrop-blur-md ${darkMode
            ? "bg-stone-900/70 border-stone-700"
            : "bg-white/80 border-lime-300"
            }`}
        >

          {/* INPUT GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            {Object.keys(initialForm).map((key) => (
              <div key={key} className="flex flex-col gap-1">
                <label className={`text-sm font-semibold capitalize ${darkMode ? 'text-stone-400' : 'text-stone-700'
                  }`}>
                  {key}
                </label>

                <input
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${key}`}
                  className={`px-4 py-3 rounded-xl border-2 outline-none transition ${darkMode
                    ? "bg-stone-800 border-stone-700 text-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/50"
                    : "bg-white border-lime-300 text-stone-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-200"
                    }`}
                />
              </div>
            ))}
          </div>

          {/* EXISTING IMAGES */}
          {existingImages.length > 0 && (
            <div className="mt-10">
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
                Existing Images
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((img, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl shadow-md hover:scale-105 transition border-2 border-lime-400"
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-32 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IMAGE UPLOAD */}
          <div className="mt-10">
            <label className={`font-semibold block mb-2 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
              Upload Images
            </label>

            <input
              type="file"
              multiple
              onChange={(e) => setImages([...e.target.files])}
              className={`w-full p-3 border-2 border-dashed rounded-xl cursor-pointer ${darkMode
                ? "border-stone-700 bg-stone-800 hover:border-lime-500"
                : "border-lime-300 bg-lime-50 hover:border-lime-400"
                }`}
            />
          </div>

          {/* TIME SLOT */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
                Time Slots
              </h3>

              <button
                onClick={addTimePrice}
                className="flex items-center gap-2 px-4 py-2 rounded-xl
                bg-lime-600 hover:bg-lime-700 text-white shadow-md"
              >
                <FaPlus /> Add Slot
              </button>
            </div>

            {timePrices.length === 0 && (
              <p className={darkMode ? 'text-stone-400' : 'text-stone-600'}>
                No time slots added yet
              </p>
            )}

            <div className="space-y-4">
              {timePrices.map((tp, i) => (
                <div
                  key={i}
                  className={`grid md:grid-cols-3 gap-3 p-4 rounded-xl border ${darkMode
                    ? "bg-stone-800 border-stone-700"
                    : "bg-lime-50 border-lime-300"
                    }`}
                >
                  <input
                    value={tp.label}
                    onChange={(e) =>
                      updateTimePrice(i, "label", e.target.value)
                    }
                    placeholder="Label"
                    className={`p-3 rounded-lg border ${darkMode
                      ? "bg-stone-900 border-stone-700 text-white"
                      : "bg-white border-lime-300 text-stone-900"
                      }`}
                  />

                  <input
                    value={tp.timing}
                    onChange={(e) =>
                      updateTimePrice(i, "timing", e.target.value)
                    }
                    placeholder="Timing"
                    className={`p-3 rounded-lg border ${darkMode
                      ? "bg-stone-900 border-stone-700 text-white"
                      : "bg-white border-lime-300 text-stone-900"
                      }`}
                  />

                  <button
                    onClick={() => removeTimePrice(i)}
                    className="flex items-center justify-center gap-2
                    bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <div className="mt-12 flex justify-end">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl font-bold text-white
              bg-gradient-to-r from-lime-500 to-lime-700
              hover:scale-105 transition shadow-xl disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update Farmhouse"
                  : "Create Farmhouse"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FarmhouseForm;