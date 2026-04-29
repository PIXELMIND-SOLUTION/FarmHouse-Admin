import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { GiOakLeaf } from "react-icons/gi";

const API_BASE = "https://backend.vfarmstays.com/api";

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
      setError("Please enter your credentials");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/vendor/login`, { name, password });
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
      sessionStorage.setItem("VendorFarmhouse", JSON.stringify(farmhouse));

      navigate("/vendor/farmhouses");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans px-4">
      
      {/* 🌾 UNIQUE FARMHOUSE GARDEN BACKGROUND */}
      
      {/* Layered Sky - Sunset/Sunrise Pastoral Theme */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-b from-rose-100 via-peach-50 to-lime-100" 
           style={{ background: 'linear-gradient(to bottom, #fef3c7 0%, #fde68a 20%, #fef3c7 40%, #d9f99d 70%, #bef264 100%)' }} />

      {/* Gentle Cloud Formations */}
      <div className="absolute top-0 left-0 w-full h-72 -z-20 overflow-hidden opacity-30">
        <div className="absolute top-8 left-24 w-56 h-20 bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-12 left-52 w-40 h-16 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-16 right-40 w-64 h-24 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-6 right-72 w-48 h-18 bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-20 left-1/3 w-52 h-20 bg-white rounded-full blur-2xl"></div>
      </div>

      {/* Warm Sun Glow - Positioned Left */}
      <div className="absolute top-16 left-24 w-40 h-40 bg-gradient-to-br from-yellow-300 via-amber-200 to-orange-200 rounded-full blur-3xl opacity-50 -z-25"></div>

      {/* Organic Hills Pattern - Multiple Layers */}
      <div className="absolute bottom-0 left-0 w-full -z-18">
        <svg viewBox="0 0 1440 400" className="w-full" preserveAspectRatio="none">
          <path
            fill="#d4d4a8"
            fillOpacity="0.2"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z"
          ></path>
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-full -z-16">
        <svg viewBox="0 0 1440 350" className="w-full" preserveAspectRatio="none">
          <path
            fill="#bef264"
            fillOpacity="0.25"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,208C672,213,768,203,864,197.3C960,192,1056,192,1152,208C1248,224,1344,256,1392,272L1440,288L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z"
          ></path>
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-full -z-14">
        <svg viewBox="0 0 1440 300" className="w-full" preserveAspectRatio="none">
          <path
            fill="#a3e635"
            fillOpacity="0.3"
            d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,144C672,149,768,203,864,213.3C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z"
          ></path>
        </svg>
      </div>

      {/* Grass Field with Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-lime-500/20 via-lime-400/12 to-transparent -z-12"></div>

      {/* 🏡 VINTAGE FARMHOUSE - Left Bottom */}
      <div className="absolute bottom-16 left-12 -z-11 opacity-40">
        <div className="relative">
          {/* Roof with overhang */}
          <div className="relative">
            <div className="w-0 h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[45px] border-b-amber-800 mx-auto"></div>
            {/* Chimney */}
            <div className="absolute top-3 right-6 w-7 h-14 bg-amber-900 rounded-t-sm border-t-2 border-amber-950"></div>
          </div>
          
          {/* House Body */}
          <div className="w-36 h-32 bg-amber-700 rounded-b relative shadow-lg">
            {/* Front Door */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-16 bg-amber-950 rounded-t-md border-2 border-amber-900">
              <div className="absolute top-1/2 right-1 w-1 h-1 bg-yellow-400 rounded-full"></div>
            </div>
            
            {/* Windows */}
            <div className="absolute top-5 left-4 w-7 h-7 bg-yellow-200 border-2 border-amber-900">
              <div className="absolute inset-0 grid grid-cols-2 gap-0.5">
                <div className="border-r border-amber-800"></div>
                <div></div>
              </div>
            </div>
            <div className="absolute top-5 right-4 w-7 h-7 bg-yellow-200 border-2 border-amber-900">
              <div className="absolute inset-0 grid grid-cols-2 gap-0.5">
                <div className="border-r border-amber-800"></div>
                <div></div>
              </div>
            </div>
          </div>

          {/* Front Porch */}
          <div className="absolute -bottom-2 left-0 right-0 h-2 bg-amber-800"></div>
        </div>
      </div>

      {/* 🌾 BARN STRUCTURE - Right Bottom */}
      <div className="absolute bottom-20 right-16 -z-11 opacity-35">
        <div className="relative">
          {/* Barn Roof */}
          <div className="w-0 h-0 border-l-[55px] border-l-transparent border-r-[55px] border-r-transparent border-b-[35px] border-b-red-800 mx-auto"></div>
          
          {/* Barn Body */}
          <div className="w-28 h-28 bg-red-700 rounded-b relative">
            {/* Hay Door */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-6 bg-amber-950 rounded-sm"></div>
            
            {/* Large Barn Door */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-14 bg-red-950 rounded-t border-2 border-red-900">
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-amber-900"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 🌳 GARDEN TREES - Different Sizes and Positions */}
      
      {/* Large Oak Tree - Left */}
      <div className="absolute bottom-36 left-52 -z-10 opacity-45">
        <div className="w-5 h-20 bg-amber-800 mx-auto rounded-t-sm"></div>
        <div className="w-24 h-24 bg-lime-700 rounded-full -mt-14 shadow-md"></div>
        <div className="w-20 h-20 bg-lime-600 rounded-full absolute top-2 left-3"></div>
        <div className="w-16 h-16 bg-lime-500 rounded-full absolute top-6 left-1"></div>
      </div>

      {/* Medium Tree - Right Center */}
      <div className="absolute bottom-32 right-64 -z-10 opacity-40">
        <div className="w-4 h-16 bg-amber-800 mx-auto rounded-t-sm"></div>
        <div className="w-20 h-20 bg-lime-600 rounded-full -mt-12"></div>
        <div className="w-16 h-16 bg-lime-500 rounded-full absolute top-3 left-2"></div>
      </div>

      {/* Small Tree - Far Right */}
      <div className="absolute bottom-24 right-40 -z-10 opacity-35">
        <div className="w-3 h-12 bg-amber-700 mx-auto"></div>
        <div className="w-14 h-14 bg-lime-600 rounded-full -mt-9"></div>
        <div className="w-11 h-11 bg-lime-500 rounded-full absolute top-2 left-2"></div>
      </div>

      {/* 🌻 WILDFLOWER GARDEN PATCH - Bottom Scattered */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-between px-16 -z-8 opacity-45">
        <div className="flex flex-col items-center">
          <div className="w-3 h-9 bg-lime-700"></div>
          <div className="w-7 h-7 bg-yellow-400 rounded-full -mt-4 border-4 border-yellow-500 shadow-sm"></div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-2 h-7 bg-lime-600"></div>
          <div className="w-5 h-5 bg-pink-500 rounded-full -mt-3 border-2 border-pink-600"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-3 h-8 bg-lime-600"></div>
          <div className="w-6 h-6 bg-purple-500 rounded-full -mt-3 border-3 border-purple-600"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-2 h-6 bg-lime-700"></div>
          <div className="w-5 h-5 bg-orange-500 rounded-full -mt-2 border-2 border-orange-600"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-3 h-10 bg-lime-700"></div>
          <div className="w-7 h-7 bg-red-500 rounded-full -mt-4 border-4 border-red-600"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-2 h-8 bg-lime-600"></div>
          <div className="w-6 h-6 bg-blue-400 rounded-full -mt-3 border-3 border-blue-500"></div>
        </div>
      </div>

      {/* 🌿 GRASS BLADES - Foreground Detail */}
      <div className="absolute bottom-0 left-0 right-0 h-28 -z-6">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-1 bg-gradient-to-t from-lime-700 via-lime-500 to-transparent opacity-25"
            style={{
              left: `${(i * 100) / 40}%`,
              height: `${Math.random() * 35 + 25}px`,
              transform: `rotate(${Math.random() * 25 - 12}deg)`,
            }}
          ></div>
        ))}
      </div>

      {/* 🦋 ANIMATED BUTTERFLIES */}
      <div className="absolute top-1/3 right-1/5 w-5 h-5 -z-5 opacity-50 animate-bounce" style={{ animationDuration: '3s' }}>
        <div className="w-2.5 h-3 bg-orange-400 rounded-full transform -rotate-45 shadow-sm"></div>
        <div className="w-2.5 h-3 bg-orange-400 rounded-full absolute top-0 left-2.5 transform rotate-45 shadow-sm"></div>
      </div>

      <div className="absolute top-1/4 left-1/3 w-4 h-4 -z-5 opacity-45 animate-pulse" style={{ animationDuration: '4s' }}>
        <div className="w-2 h-2.5 bg-pink-400 rounded-full transform -rotate-45"></div>
        <div className="w-2 h-2.5 bg-pink-400 rounded-full absolute top-0 left-2 transform rotate-45"></div>
      </div>

      {/* 🌤️ SOFT AMBIENT LIGHTING */}
      <div className="absolute inset-0 -z-13">
        <div className="absolute w-[550px] h-[550px] bg-lime-200 rounded-full blur-[160px] opacity-12 bottom-0 left-0"></div>
        <div className="absolute w-[450px] h-[450px] bg-amber-200 rounded-full blur-[140px] opacity-18 top-16 right-16"></div>
        <div className="absolute w-[400px] h-[400px] bg-yellow-100 rounded-full blur-[130px] opacity-10 top-1/2 left-1/2"></div>
      </div>

      {/* 🎴 PREMIUM VENDOR LOGIN CARD */}
      <div
        className="
        relative z-10
        w-full max-w-md
        bg-white/50
        backdrop-blur-2xl
        border-2 border-white/70
        rounded-[2.8rem]
        p-11
        shadow-[0_30px_90px_rgba(120,113,108,0.1),0_0_70px_rgba(163,230,53,0.08)]
        hover:shadow-[0_35px_110px_rgba(120,113,108,0.12),0_0_90px_rgba(163,230,53,0.12)]
        transition-all duration-500
        "
      >
        {/* Decorative Leaf Corners */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-lime-400/25 rounded-tl-[2.8rem]">
          <GiOakLeaf className="absolute top-2 left-2 text-lime-500/30" size={20} />
        </div>
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-amber-400/25 rounded-br-[2.8rem]">
          <GiOakLeaf className="absolute bottom-2 right-2 text-amber-500/30" size={20} />
        </div>

        {/* HEADER */}
        <div className="text-center mb-9 relative">
          {/* Leaf Icon Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-lime-500 to-lime-600 rounded-3xl mb-5 shadow-lg shadow-lime-500/20 relative">
            <GiOakLeaf size={40} className="text-white" />
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-3xl bg-lime-400 animate-ping opacity-20"></div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-lime-700 via-lime-600 to-amber-700 bg-clip-text text-transparent mb-2">
            V Farm House Vendor
          </h1>

          <p className="text-gray-700 font-medium text-base flex items-center justify-center gap-2">
            <span className="text-lime-600">🌿</span>
            Manage Your Estate
            <span className="text-amber-600">🏡</span>
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 text-amber-800 bg-amber-50/80 backdrop-blur-sm border-2 border-amber-300/60 p-4 rounded-2xl text-sm text-center font-medium shadow-sm">
            ⚠️ {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* USERNAME INPUT */}
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
              Vendor Username
            </label>
            <FiUser className="absolute left-4 top-[46px] text-lime-600 group-focus-within:text-lime-700 transition-colors z-10" size={20} />

            <input
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              Secure Password
            </label>
            <FiLock className="absolute left-4 top-[46px] text-amber-600 group-focus-within:text-amber-700 transition-colors z-10" size={20} />

            <input
              type={show ? "text" : "password"}
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
              w-full py-4 mt-7
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
              shadow-[0_12px_45px_rgba(163,230,53,0.3)]
              hover:shadow-[0_16px_55px_rgba(163,230,53,0.4)]
              relative
              overflow-hidden
              group
            "
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Cultivating Access...</span>
              </>
            ) : (
              <>
                <GiOakLeaf size={22} />
                Enter Dashboard
              </>
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-10 pt-6 border-t border-lime-200/30">
          <p className="text-center text-gray-600 font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-lime-500 rounded-full"></span>
            Authorized Personnel Only
            <span className="w-2 h-2 bg-lime-500 rounded-full"></span>
          </p>
          <p className="text-center text-gray-500 text-xs mt-2">
            V Farm House © {new Date().getFullYear()}
          </p>
        </div>

        {/* Inner Card Glow */}
        <div className="absolute inset-0 rounded-[2.8rem] bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default VendorLogin;