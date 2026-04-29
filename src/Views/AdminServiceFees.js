import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaSave,
  FaSyncAlt,
  FaMoneyBillWave,
  FaRupeeSign,
} from "react-icons/fa";
import Swal from "sweetalert2";

const API_BASE = "https://backend.vfarmstays.com/api/fees";

const AdminFeesConfig = ({ darkMode = false }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [configId, setConfigId] = useState(null);
  const [cleaningFee, setCleaningFee] = useState("");
  const [serviceFee, setServiceFee] = useState("");

  /* ================= FETCH ================= */
  const fetchFees = async () => {
    try {
      Swal.fire({
        title: "Loading Fees...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      setLoading(true);

      const res = await axios.get(`${API_BASE}/get`);
      const cfg = res.data?.configs?.[0];

      if (cfg) {
        setConfigId(cfg._id);
        setCleaningFee(cfg.cleaningFee);
        setServiceFee(cfg.serviceFee);
      }

      Swal.close();

    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Failed to Load",
        text: "Unable to fetch fees configuration.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);


  // ================= SAVE =================
  const handleSave = async () => {
    if (!cleaningFee || !serviceFee) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both Cleaning Fee and Service Fee.",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Saving Fees...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      setSaving(true);

      await axios.put(`${API_BASE}/update`, {
        cleaningFee: Number(cleaningFee),
        serviceFee: Number(serviceFee),
      });

      await fetchFees();

      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Fees updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Unable to update fees.",
      });
    } finally {
      setSaving(false);
    }
  };


  // ================= DELETE =================
  const handleDelete = async () => {
    if (!configId) return;

    const confirm = await Swal.fire({
      title: "Delete Fee Configuration?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#16a34a",
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await axios.delete(`${API_BASE}/delete/${configId}`);

      setConfigId(null);
      setCleaningFee("");
      setServiceFee("");

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Fee configuration removed.",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Unable to delete fee configuration.",
      });
    }
  };

  return (
    <div
      className={`relative min-h-screen p-6 overflow-hidden ${darkMode
          ? "bg-gradient-to-br from-stone-900 via-stone-950 to-black text-white"
          : "bg-gradient-to-br from-lime-100 via-white to-lime-200 text-stone-900"
        }`}
    >


      <div className="relative max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h2 className={`text-4xl font-bold flex items-center gap-3 tracking-tight ${darkMode ? 'text-lime-400' : 'text-lime-700'
            }`}>
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-lime-500/15' : 'bg-lime-100'
              }`}>
              <FaMoneyBillWave className={`text-2xl ${darkMode ? 'text-lime-400' : 'text-lime-600'
                }`} />
            </div>

            Fees Configuration
          </h2>

          <button
            onClick={fetchFees}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl
            backdrop-blur-xl border
            transition-all duration-300 shadow-lg ${darkMode
                ? 'bg-white/10 border-white/20 hover:bg-lime-600'
                : 'bg-white/10 border-lime-300 hover:bg-lime-600 hover:text-white'
              }`}
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        {/* 🔥 MAIN CARD */}
        <div className="relative">
          {/* glow */}
          <div className={`absolute inset-0 opacity-20 blur-2xl rounded-3xl ${darkMode
              ? 'bg-gradient-to-r from-lime-500 via-amber-500 to-lime-500'
              : 'bg-gradient-to-r from-lime-400 via-amber-400 to-lime-400'
            }`}></div>

          <div
            className={`relative rounded-3xl p-10 backdrop-blur-2xl border shadow-[0_20px_80px_rgba(0,0,0,0.45)] ${darkMode
                ? "bg-white/5 border-stone-700"
                : "bg-white/70 border-lime-200"
              }`}
          >
            {loading ? (
              <div className="flex justify-center py-20">
                <FaSyncAlt className={`animate-spin text-3xl ${darkMode ? 'text-lime-400' : 'text-lime-600'
                  }`} />
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
                    bg-red-600 hover:bg-red-700 text-white
                    shadow-lg hover:scale-105
                    transition disabled:opacity-40"
                  >
                    <FaTrash />
                    Delete
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl
                    hover:scale-105 shadow-xl font-semibold text-white
                    transition disabled:opacity-50 ${darkMode
                        ? 'bg-gradient-to-r from-lime-600 to-amber-600'
                        : 'bg-gradient-to-r from-lime-500 to-amber-500'
                      }`}
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
        <p className={`mt-6 text-center text-sm ${darkMode ? 'text-stone-500' : 'text-stone-600'
          }`}>
          This configuration is applied globally across bookings.
        </p>
      </div>
    </div>
  );
};

/* ================= PREMIUM INPUT ================= */

const PremiumInput = ({ label, value, onChange, darkMode }) => (
  <div className="space-y-2">
    <label className={`font-medium ${darkMode ? 'text-stone-300' : 'text-stone-700'
      }`}>{label} (₹)</label>

    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border
      transition focus-within:ring-2 ${darkMode
          ? "bg-white/5 border-stone-700 focus-within:ring-lime-500 focus-within:border-lime-500"
          : "bg-white border-lime-300 shadow-sm focus-within:ring-lime-500 focus-within:border-lime-500"
        }`}
    >
      <FaRupeeSign className={darkMode ? 'text-lime-400' : 'text-lime-600'} />

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter amount"
        className={`w-full bg-transparent outline-none ${darkMode ? 'text-white placeholder:text-stone-500' : 'text-stone-900 placeholder:text-stone-400'
          }`}
      />
    </div>
  </div>
);

export default AdminFeesConfig;