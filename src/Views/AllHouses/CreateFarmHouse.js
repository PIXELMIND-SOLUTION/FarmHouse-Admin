import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";

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
  pricePerDay: ""
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

  /* ================= FETCH (EDIT MODE) ================= */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchData = async () => {
      const res = await axios.get(`${API_BASE}/farmhouse/${id}`);
      const f = res.data.farmhouse;

      setForm({
        name: f.name,
        address: f.address,
        description: f.description,
        amenities: f.amenities.join(","),
        rating: f.rating,
        feedbackSummary: f.feedbackSummary,
        bookingFor: f.bookingFor,
        lat: f.location?.coordinates[1] || "",
        lng: f.location?.coordinates[0] || "",
        pricePerHour: f.pricePerHour,
        pricePerDay: f.pricePerDay
      });

      setExistingImages(f.images || []);
      setTimePrices(f.timePrices || []);
    };

    fetchData();
  }, [id, isEditMode]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addTimePrice = () =>
    setTimePrices([...timePrices, { label: "", timing: "", price: "" }]);

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
    const fd = new FormData();

    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("timePrices", JSON.stringify(timePrices));
    images.forEach((img) => fd.append("images", img));

    try {
      setLoading(true);

      if (isEditMode) {
        await axios.put(`${API_BASE}/farmhouse/${id}`, fd);
        alert("Farmhouse updated successfully");
      } else {
        await axios.post(`${API_BASE}/farmhouse/create`, fd);
        alert("Farmhouse created successfully");
      }

      navigate("/admin/farmhouses");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        <FaArrowLeft /> Back
      </button>

      <h2 className="text-3xl font-bold mb-6">
        {isEditMode ? "✏️ Edit Farmhouse" : "➕ Create Farmhouse"}
      </h2>

      <div
        className={`p-6 rounded-xl ${
          darkMode ? "bg-gray-800" : "bg-white shadow"
        }`}
      >
        {/* Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          {Object.keys(initialForm).map((key) => (
            <input
              key={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder={key}
              className="px-4 py-2 rounded border bg-white text-black"
            />
          ))}
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Existing Images</h3>
            <div className="grid grid-cols-4 gap-3">
              {existingImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="h-24 w-full object-cover rounded"
                  alt=""
                />
              ))}
            </div>
          </div>
        )}

        {/* Upload Images */}
        <input
          type="file"
          multiple
          onChange={(e) => setImages([...e.target.files])}
          className="mt-4"
        />

        {/* Time Prices */}
        <div className="mt-6">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">Time Slot Pricing</h3>
            <button
              onClick={addTimePrice}
              className="text-blue-500 font-medium"
            >
              + Add Slot
            </button>
          </div>

          {timePrices.length === 0 && (
            <p className="text-sm opacity-60 mb-2">
              No time slots added yet
            </p>
          )}

          {timePrices.map((tp, i) => (
            <div
              key={i}
              className="grid grid-cols-3 gap-2 mb-2 items-center"
            >
              <input
                value={tp.label}
                onChange={(e) =>
                  updateTimePrice(i, "label", e.target.value)
                }
                placeholder="Label"
                className="p-2 border rounded bg-white text-black"
              />
              <input
                value={tp.timing}
                onChange={(e) =>
                  updateTimePrice(i, "timing", e.target.value)
                }
                placeholder="Timing"
                className="p-2 border rounded bg-white text-black"
              />
              <div className="flex gap-2">
                <input
                  value={tp.price}
                  onChange={(e) =>
                    updateTimePrice(i, "price", e.target.value)
                  }
                  placeholder="Price"
                  className="p-2 border rounded bg-white text-black w-full"
                />
                <button
                  onClick={() => removeTimePrice(i)}
                  className="px-3 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="mt-8 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
        >
          {loading
            ? "Saving..."
            : isEditMode
            ? "Update Farmhouse"
            : "Create Farmhouse"}
        </button>
      </div>
    </div>
  );
};

export default FarmhouseForm;
