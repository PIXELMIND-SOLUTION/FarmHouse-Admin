import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const DEFAULT_EMAIL = "admin@gmail.com";
const DEFAULT_PASSWORD = "admin@123";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* LOGIN */
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
        sessionStorage.setItem("adminToken", "mock-admin-token");
        navigate("/admin");
      } else {
        setError("Invalid credentials");
      }

      setLoading(false);
    }, 900);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">

      {/* 🌆 REAL ESTATE GRID BACKGROUND */}
<div className="absolute inset-0 -z-20 bg-[#f6f9fc]" />

{/* Blueprint Grid */}
<div
  className="absolute inset-0 -z-10 opacity-[0.35]"
  style={{
    backgroundImage: `
      linear-gradient(to right, rgba(30,64,175,0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(30,64,175,0.08) 1px, transparent 1px)
    `,
    backgroundSize: "42px 42px",
  }}
/>

{/* Large City Blocks */}
<div
  className="absolute inset-0 -z-10 opacity-[0.15]"
  style={{
    backgroundImage: `
      linear-gradient(to right, rgba(30,64,175,0.12) 2px, transparent 2px),
      linear-gradient(to bottom, rgba(30,64,175,0.12) 2px, transparent 2px)
    `,
    backgroundSize: "140px 140px",
  }}
/>

{/* 🌇 Building Shadows */}
<div className="absolute bottom-0 left-0 right-0 h-[280px] -z-10 bg-gradient-to-t from-slate-900/10 to-transparent" />

{/* Skyscraper Silhouettes */}
<div className="absolute bottom-0 left-0 w-full flex justify-between items-end px-10 -z-10 opacity-20">

  <div className="w-16 h-40 bg-slate-800 rounded-t-lg"></div>
  <div className="w-24 h-56 bg-slate-900 rounded-t-xl"></div>
  <div className="w-14 h-32 bg-slate-800 rounded-t-md"></div>
  <div className="w-20 h-48 bg-slate-900 rounded-t-lg"></div>
  <div className="w-12 h-28 bg-slate-800 rounded-t"></div>
  <div className="w-28 h-60 bg-slate-900 rounded-t-xl"></div>

</div>


      {/* 🌈 AURORA BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[600px] h-[600px] bg-purple-400 rounded-full blur-[140px] opacity-40 -top-32 -left-32"></div>
        <div className="absolute w-[500px] h-[500px] bg-blue-400 rounded-full blur-[140px] opacity-40 bottom-0 right-0"></div>
        <div className="absolute w-[400px] h-[400px] bg-pink-400 rounded-full blur-[120px] opacity-30 top-1/3 right-1/4"></div>
      </div>

      {/* GLASS CARD */}
      <div
        className="w-full max-w-md p-8 rounded-[28px]
        backdrop-blur-2xl
        bg-white/30
        border border-white/40
        shadow-[0_20px_80px_rgba(0,0,0,0.15)]"
      >
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            V Farm House
          </h1>

          <p className="text-gray-700 mt-2">
            Admin Control Center
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* EMAIL */}
          <div className="relative">
            <FiMail className="absolute left-4 top-4 text-gray-500" />

            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full pl-11 pr-4 py-3.5
                rounded-xl
                bg-white/70
                border border-white/60
                focus:border-indigo-400
                focus:ring-4
                focus:ring-indigo-200
                outline-none
                transition
              "
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <FiLock className="absolute left-4 top-4 text-gray-500" />

            <input
              type={show ? "text" : "password"}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full pl-11 pr-11 py-3.5
                rounded-xl
                bg-white/70
                border border-white/60
                focus:border-purple-400
                focus:ring-4
                focus:ring-purple-200
                outline-none
                transition
              "
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            disabled={loading}
            className="
              w-full py-3.5
              rounded-xl
              text-white
              font-semibold
              flex items-center justify-center gap-2
              bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
              hover:scale-[1.02]
              active:scale-[0.98]
              transition
              shadow-lg
            "
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <FiLogIn />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div className="text-center mt-8 text-sm text-gray-700">
          Secure Admin Portal • {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default Login;
