import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaSave,
  FaSyncAlt,
  FaMoneyBillWave,
  FaRupeeSign,
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

  /* ================= SAVE ================= */
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
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div
      className={`relative min-h-screen p-6 overflow-hidden ${
        darkMode
          ? "bg-[#020617] text-white"
          : "bg-gradient-to-br from-slate-100 to-white text-gray-900"
      }`}
    >
      

      <div className="relative max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold flex items-center gap-3 tracking-tight">
            <div className="p-3 rounded-xl bg-emerald-500/15">
              <FaMoneyBillWave className="text-emerald-400 text-2xl" />
            </div>

            Fees Configuration
          </h2>

          <button
            onClick={fetchFees}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-white/10 backdrop-blur-xl
            border border-white/20
            hover:bg-indigo-600
            transition-all duration-300 shadow-lg"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        {/* 🔥 MAIN CARD */}
        <div className="relative">
          {/* glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 opacity-20 blur-2xl rounded-3xl"></div>

          <div
            className={`relative rounded-3xl p-10 backdrop-blur-2xl border shadow-[0_20px_80px_rgba(0,0,0,0.45)]
            ${
              darkMode
                ? "bg-white/5 border-white/10"
                : "bg-white/70 border-white"
            }`}
          >
            {loading ? (
              <div className="flex justify-center py-20">
                <FaSyncAlt className="animate-spin text-3xl text-emerald-400" />
              </div>
            ) : (
              <>
                {/* INPUTS */}
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  <PremiumInput
                    label="Cleaning Fee"
                    value={cleaningFee}
                    onChange={setCleaningFee}
                    darkMode={darkMode}
                  />

                  <PremiumInput
                    label="Service Fee"
                    value={serviceFee}
                    onChange={setServiceFee}
                    darkMode={darkMode}
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={handleDelete}
                    disabled={!configId}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl
                    bg-red-600 hover:bg-red-700
                    shadow-lg hover:scale-105
                    transition disabled:opacity-40"
                  >
                    <FaTrash />
                    Delete
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl
                    bg-gradient-to-r from-emerald-500 to-indigo-500
                    hover:scale-105
                    shadow-xl
                    font-semibold
                    transition disabled:opacity-50"
                  >
                    <FaSave />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* FOOTNOTE */}
        <p className="mt-6 text-center text-sm opacity-60">
          This configuration is applied globally across bookings.
        </p>
      </div>
    </div>
  );
};

/* ================= PREMIUM INPUT ================= */

const PremiumInput = ({ label, value, onChange, darkMode }) => (
  <div className="space-y-2">
    <label className="font-medium opacity-80">{label} (₹)</label>

    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border
      transition focus-within:ring-2 focus-within:ring-emerald-400
      ${
        darkMode
          ? "bg-white/5 border-white/10"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <FaRupeeSign className="text-emerald-400" />

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter amount"
        className="w-full bg-transparent outline-none"
      />
    </div>
  </div>
);

export default AdminFeesConfig;
