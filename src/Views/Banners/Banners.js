import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus, FaSpinner } from "react-icons/fa";

const Banners = ({ darkMode, collapsed }) => {
  const [banners, setBanners] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const API_BASE = "http://31.97.206.144:5124/api/auth";

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/all-banners`);
      setBanners(res.data.banners || []);
    } catch (err) {
      console.error("Failed to fetch banners", err);
      alert("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Create banner
  const handleCreateBanner = async () => {
    if (images.length === 0) {
      alert("Please select at least one image");
      return;
    }

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    try {
      setUploading(true);
      await axios.post(`${API_BASE}/create-banner`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Banner created successfully");
      setImages([]);
      fetchBanners();
    } catch (err) {
      console.error("Banner upload failed", err);
      alert("Failed to create banner");
    } finally {
      setUploading(false);
    }
  };

  // Delete banner
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      await axios.delete(`${API_BASE}/delete-banner/${id}`);
      alert("Banner deleted");
      fetchBanners();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete banner");
    }
  };

  return (
    <div
      className={`p-6 transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Banners Management</h2>
      </div>

      {/* Upload Section */}
      <div
        className={`p-4 rounded-lg mb-8 ${
          darkMode ? "bg-gray-800" : "bg-white shadow"
        }`}
      >
        <h3 className="text-lg font-medium mb-3">Add New Banner</h3>

        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="mb-4 block"
        />

        <button
          onClick={handleCreateBanner}
          disabled={uploading}
          className={`flex items-center gap-2 px-4 py-2 rounded text-white ${
            uploading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
          {uploading ? "Uploading..." : "Create Banner"}
        </button>
      </div>

      {/* Banners List */}
      <div
        className={`rounded-lg p-4 ${
          darkMode ? "bg-gray-800" : "bg-white shadow"
        }`}
      >
        <h3 className="text-lg font-medium mb-4">All Banners</h3>

        {loading ? (
          <div className="flex justify-center py-10">
            <FaSpinner className="animate-spin text-2xl" />
          </div>
        ) : banners.length === 0 ? (
          <p className="text-center text-gray-500">No banners found</p>
        ) : (
          banners.map((banner) => (
            <div
              key={banner._id}
              className={`mb-6 p-4 rounded border ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              {/* Images */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {banner.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="banner"
                    className="h-32 w-full object-cover rounded"
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleDelete(banner._id)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Banners;
