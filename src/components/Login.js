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

      {/* 🌿 FARMHOUSE GARDEN BACKGROUND */}
      
      {/* Sky Gradient - Light Brown & Green Theme */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-b from-amber-50 via-stone-50 to-lime-50" />

      {/* Soft Cloud Shapes */}
      <div className="absolute top-0 left-0 w-full h-64 -z-20 overflow-hidden opacity-40">
        <div className="absolute top-10 left-20 w-64 h-24 bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-16 left-48 w-48 h-20 bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-8 right-32 w-72 h-28 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-64 w-56 h-22 bg-white rounded-full blur-2xl"></div>
      </div>

      {/* Sun/Golden Hour Glow */}
      <div className="absolute top-20 right-32 w-32 h-32 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full blur-3xl opacity-50 -z-25"></div>

      {/* Rolling Hills - Background Layer */}
      <div className="absolute bottom-0 left-0 w-full -z-20">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#bef264"
            fillOpacity="0.25"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,165.3C960,171,1056,149,1152,133.3C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Rolling Hills - Foreground Layer */}
      <div className="absolute bottom-0 left-0 w-full -z-15">
        <svg viewBox="0 0 1440 280" className="w-full">
          <path
            fill="#a3e635"
            fillOpacity="0.3"
            d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Garden Grass Base */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-lime-500/15 via-lime-400/10 to-transparent -z-10"></div>

      {/* 🏡 FARMHOUSE SILHOUETTE */}
      <div className="absolute bottom-12 left-16 -z-10 opacity-35">
        {/* Main House Body */}
        <div className="relative">
          {/* Roof */}
          <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[40px] border-b-amber-700 mx-auto"></div>
          
          {/* Chimney */}
          <div className="absolute top-2 right-8 w-6 h-12 bg-stone-700 rounded-t"></div>
          
          {/* House Body */}
          <div className="w-32 h-28 bg-amber-600 rounded-b-sm relative">
            {/* Door */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-14 bg-amber-800 rounded-t"></div>
            
            {/* Windows */}
            <div className="absolute top-4 left-3 w-6 h-6 bg-yellow-300 border border-amber-700"></div>
            <div className="absolute top-4 right-3 w-6 h-6 bg-yellow-300 border border-amber-700"></div>
          </div>
        </div>
      </div>

      {/* 🏡 GUEST HOUSE - Right Side */}
      <div className="absolute bottom-16 right-24 -z-10 opacity-30">
        <div className="relative">
          {/* Slanted Roof */}
          <div className="w-0 h-0 border-l-[45px] border-l-transparent border-r-[45px] border-r-transparent border-b-[30px] border-b-stone-600 mx-auto"></div>
          
          {/* Small House Body */}
          <div className="w-24 h-20 bg-stone-500 rounded-b-sm relative">
            {/* Window */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-300 border border-stone-700"></div>
            
            {/* Door */}
            <div className="absolute bottom-0 left-2 w-6 h-10 bg-stone-700 rounded-t-sm"></div>
          </div>
        </div>
      </div>

      {/* 🌳 TREES - Decorative Elements */}
      
      {/* Tree Left */}
      <div className="absolute bottom-32 left-48 -z-10 opacity-40">
        <div className="w-4 h-16 bg-amber-700 mx-auto"></div>
        <div className="w-20 h-20 bg-lime-600 rounded-full -mt-12"></div>
        <div className="w-16 h-16 bg-lime-500 rounded-full absolute top-0 left-2"></div>
      </div>

      {/* Tree Right */}
      <div className="absolute bottom-28 right-56 -z-10 opacity-35">
        <div className="w-3 h-12 bg-amber-700 mx-auto"></div>
        <div className="w-16 h-16 bg-lime-600 rounded-full -mt-10"></div>
        <div className="w-12 h-12 bg-lime-500 rounded-full absolute top-2 left-3"></div>
      </div>

      {/* 🌻 GARDEN FLOWERS - Bottom Decoration */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-around px-12 -z-5 opacity-40">
        {/* Sunflowers */}
        <div className="flex flex-col items-center">
          <div className="w-3 h-8 bg-lime-600"></div>
          <div className="w-6 h-6 bg-yellow-400 rounded-full -mt-3 border-4 border-yellow-500"></div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-2 h-6 bg-lime-500"></div>
          <div className="w-5 h-5 bg-pink-400 rounded-full -mt-2 border-2 border-pink-500"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-3 h-10 bg-lime-600"></div>
          <div className="w-7 h-7 bg-orange-400 rounded-full -mt-4 border-4 border-orange-500"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-2 h-7 bg-lime-500"></div>
          <div className="w-5 h-5 bg-purple-400 rounded-full -mt-3 border-2 border-purple-500"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-3 h-9 bg-lime-600"></div>
          <div className="w-6 h-6 bg-red-400 rounded-full -mt-3 border-3 border-red-500"></div>
        </div>
      </div>

      {/* 🌾 WHEAT/GRASS FIELD TEXTURE */}
      <div className="absolute bottom-0 left-0 right-0 h-24 -z-8">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-1 bg-gradient-to-t from-lime-600 to-lime-400 opacity-20"
            style={{
              left: `${(i * 100) / 30}%`,
              height: `${Math.random() * 30 + 20}px`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
          ></div>
        ))}
      </div>

      {/* 🦋 FLOATING BUTTERFLIES */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 -z-5 opacity-50 animate-bounce">
        <div className="w-2 h-3 bg-pink-400 rounded-full transform -rotate-45"></div>
        <div className="w-2 h-3 bg-pink-400 rounded-full absolute top-0 left-2 transform rotate-45"></div>
      </div>

      <div className="absolute top-1/3 left-1/4 w-3 h-3 -z-5 opacity-40 animate-pulse">
        <div className="w-1.5 h-2 bg-yellow-400 rounded-full transform -rotate-45"></div>
        <div className="w-1.5 h-2 bg-yellow-400 rounded-full absolute top-0 left-1.5 transform rotate-45"></div>
      </div>

      {/* 🌈 SOFT AMBIENT GLOW */}
      <div className="absolute inset-0 -z-12">
        <div className="absolute w-[500px] h-[500px] bg-lime-300 rounded-full blur-[150px] opacity-15 bottom-0 left-0"></div>
        <div className="absolute w-[400px] h-[400px] bg-amber-200 rounded-full blur-[130px] opacity-20 top-20 right-20"></div>
        <div className="absolute w-[350px] h-[350px] bg-lime-200 rounded-full blur-[120px] opacity-12 top-1/2 left-1/3"></div>
      </div>

      {/* ✨ PREMIUM GLASS CARD */}
      <div
        className="relative w-full max-w-md p-10 rounded-[32px]
        backdrop-blur-3xl
        bg-white/45
        border-2 border-white/60
        shadow-[0_25px_100px_rgba(0,0,0,0.1),0_0_80px_rgba(163,230,53,0.06)]
        hover:shadow-[0_30px_120px_rgba(0,0,0,0.12),0_0_100px_rgba(163,230,53,0.1)]
        transition-all duration-500"
      >
        {/* Decorative Corner Accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-lime-400/30 rounded-tl-[32px]"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-amber-400/30 rounded-br-[32px]"></div>

        {/* HEADER */}
        <div className="text-center mb-10 relative">
          {/* Farm Icon */}
          <div className="mx-auto w-16 h-16 mb-4 bg-gradient-to-br from-lime-500 to-lime-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>

          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-lime-700 via-lime-600 to-amber-700 bg-clip-text text-transparent mb-2">
            V Farm House
          </h1>

          <p className="text-gray-700 font-medium text-base flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></span>
            Admin Control Center
            <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></span>
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 text-red-700 bg-red-50/80 backdrop-blur-sm border-2 border-red-300 p-4 rounded-2xl text-sm text-center font-medium shadow-sm">
            ⚠️ {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* EMAIL INPUT */}
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
              Email Address
            </label>
            <FiMail className="absolute left-4 top-[46px] text-lime-600 group-focus-within:text-lime-700 transition-colors z-10" size={20} />

            <input
              type="email"
              required
              placeholder="youremail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full pl-12 pr-4 py-4
                rounded-2xl
                bg-white/80
                border-2 border-lime-200/60
                hover:border-lime-300
                focus:border-lime-500
                focus:ring-4
                focus:ring-lime-200/50
                outline-none
                transition-all duration-300
                text-gray-800
                placeholder:text-gray-400
                font-medium
                shadow-sm
              "
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
              Password
            </label>
            <FiLock className="absolute left-4 top-[46px] text-amber-600 group-focus-within:text-amber-700 transition-colors z-10" size={20} />

            <input
              type={show ? "text" : "password"}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full pl-12 pr-12 py-4
                rounded-2xl
                bg-white/80
                border-2 border-amber-200/60
                hover:border-amber-300
                focus:border-amber-500
                focus:ring-4
                focus:ring-amber-200/50
                outline-none
                transition-all duration-300
                text-gray-800
                placeholder:text-gray-400
                font-medium
                shadow-sm
              "
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-[46px] text-gray-500 hover:text-gray-700 transition-colors z-10 p-1"
            >
              {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            disabled={loading}
            className="
              w-full py-4 mt-6
              rounded-2xl
              text-white
              font-bold text-lg
              flex items-center justify-center gap-3
              bg-gradient-to-r from-lime-600 via-lime-500 to-amber-600
              hover:from-lime-700 hover:via-lime-600 hover:to-amber-700
              hover:scale-[1.02]
              active:scale-[0.98]
              disabled:opacity-70
              disabled:cursor-not-allowed
              transition-all duration-300
              shadow-[0_10px_40px_rgba(163,230,53,0.25)]
              hover:shadow-[0_15px_50px_rgba(163,230,53,0.35)]
            "
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <FiLogIn size={22} />
                Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div className="text-center mt-8 pt-6 border-t border-lime-200/30">
          <p className="text-sm text-gray-600 font-medium flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure Admin Portal
          </p>
          <p className="text-xs text-gray-500 mt-2">
            © {new Date().getFullYear()} V Farm House. All rights reserved.
          </p>
        </div>

        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Login;