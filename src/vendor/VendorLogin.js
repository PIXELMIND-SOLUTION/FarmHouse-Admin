import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const API_BASE = "http://31.97.206.144:5124/api";

const VendorLogin = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !password) {
      setError("Enter username and password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/vendor/login`,
        { name, password }
      );

      const { vendor, farmhouse } = res.data;

      sessionStorage.setItem("isVendor", "true");

      sessionStorage.setItem(
        "VendorData",
        JSON.stringify({
          vendorId: vendor._id,
          farmhouseId: vendor.farmhouseId,
          name: vendor.name,
        })
      );

      sessionStorage.setItem(
        "VendorFarmhouse",
        JSON.stringify(farmhouse)
      );

      navigate("/vendor/farmhouses");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Invalid credentials"
      );
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ===== PREMIUM BACKGROUND ===== */}

      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100" />

      {/* Glow blobs */}
      <div className="absolute w-[500px] h-[500px] bg-purple-300 rounded-full blur-[140px] opacity-40 top-[-120px] left-[-120px]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-300 rounded-full blur-[140px] opacity-40 bottom-[-120px] right-[-120px]" />

      {/* ===== LOGIN CARD ===== */}

      <div
        className="
        relative z-10
        w-full max-w-md
        bg-white/80
        backdrop-blur-2xl
        border border-white
        rounded-3xl
        p-10
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]
        "
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Vendor Portal
          </h1>

          <p className="text-gray-500 mt-2">
            Secure access to your farmhouse dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Username */}
          <div className="relative">
            <FiUser className="absolute left-4 top-3.5 text-indigo-500" />

            <input
              type="text"
              placeholder="Vendor Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full
                pl-11 pr-4 py-3
                rounded-xl
                bg-white
                border border-gray-200
                focus:outline-none
                focus:ring-2 focus:ring-indigo-400
              "
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-4 top-3.5 text-indigo-500" />

            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full
                pl-11 pr-12 py-3
                rounded-xl
                bg-white
                border border-gray-200
                focus:outline-none
                focus:ring-2 focus:ring-indigo-400
              "
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-3.5 text-gray-500"
            >
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="
            w-full py-3 rounded-xl
            bg-gradient-to-r
            from-indigo-600 to-purple-600
            text-white font-semibold
            hover:scale-[1.02]
            active:scale-95
            transition
            shadow-md
            disabled:opacity-70
            "
          >
            {loading
              ? "Entering Dashboard..."
              : "Login to Dashboard"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-8">
          Protected Vendor Access • Farmhouse OS
        </p>
      </div>
    </div>
  );
};

export default VendorLogin;
