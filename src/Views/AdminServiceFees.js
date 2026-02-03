import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaSave,
  FaSyncAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

const API_BASE = "http://31.97.206.144:5124/api/fees";

const AdminFeesConfig = ({ darkMode = false }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [configId, setConfigId] = useState(null);
  const [cleaningFee, setCleaningFee] = useState("");
  const [serviceFee, setServiceFee] = useState("");

  /* ================= FETCH ================= */
  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/get`);
      const cfg = res.data?.configs?.[0];

      if (cfg) {
        setConfigId(cfg._id);
        setCleaningFee(cfg.cleaningFee);
        setServiceFee(cfg.serviceFee);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load fees config");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const handleSave = async () => {
    if (!cleaningFee || !serviceFee) {
      alert("Please enter all values");
      return;
    }

    try {
      setSaving(true);
      await axios.put(`${API_BASE}/update`, {
        cleaningFee: Number(cleaningFee),
        serviceFee: Number(serviceFee),
      });

      alert("Fees updated successfully");
      fetchFees();
    } catch (err) {
      console.error(err);
      alert("Failed to update fees");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!configId) return;
    if (!window.confirm("Delete fee configuration?")) return;

    try {
      await axios.delete(`${API_BASE}/delete/${configId}`);
      setConfigId(null);
      setCleaningFee("");
      setServiceFee("");
      alert("Fees config deleted");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <FaMoneyBillWave className="text-emerald-500" />
            Fees Configuration
          </h2>

          <button
            onClick={fetchFees}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        {/* Card */}
        <div
          className={`rounded-2xl shadow-xl p-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {loading ? (
            <p className="text-center opacity-70">Loading...</p>
          ) : (
            <>
              {/* Inputs */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-2 font-medium">
                    Cleaning Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={cleaningFee}
                    onChange={(e) => setCleaningFee(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-emerald-400 text-black"
                    placeholder="Enter cleaning fee"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Service Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={serviceFee}
                    onChange={(e) => setServiceFee(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-emerald-400 text-black"
                    placeholder="Enter service fee"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleDelete}
                  disabled={!configId}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-40"
                >
                  <FaTrash />
                  Delete
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                >
                  <FaSave />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <p className="mt-4 text-sm opacity-60 text-center">
          This configuration is applied globally across bookings.
        </p>
      </div>
    </div>
  );
};

export default AdminFeesConfig;
