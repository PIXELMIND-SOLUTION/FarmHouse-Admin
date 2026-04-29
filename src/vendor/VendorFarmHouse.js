import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEye, FiMapPin, FiStar, FiHeart } from "react-icons/fi";
import FarmhouseSlotsModal from "./FarmhouseSlotModal";

// const farmHouse = JSON.parse(sessionStorage.getItem("VendorData"));
// const FARMHOUSE_ID = farmHouse?.farmhouseId;

const VendorFarmhouse = () => {
  const [farmhouse, setFarmhouse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const [farmhouseId, setFarmhouseId] = useState(null);

  useEffect(() => {
    const vendor = JSON.parse(sessionStorage.getItem("VendorData"));
    if (vendor?.farmhouseId) {
      setFarmhouseId(vendor.farmhouseId);
    }
  }, []);

  const fetchFarmhouse = async () => {
    if (!farmhouseId) return; // ⛔ WAIT until ID exists

    try {
      const res = await axios.get(
        `https://backend.vfarmstays.com/api/farmhouse/${farmhouseId}`
      );
      console.log("API RESPONSE:", res.data); // debug
      setFarmhouse(res.data.farmhouse);
    } catch (err) {
      console.error("API ERROR:", err);
    }
  };

  useEffect(() => {
    fetchFarmhouse();
  }, [farmhouseId]);

  useEffect(() => {
    if (!farmhouse?.images?.length) return;
    const interval = setInterval(() => {
      setImageIndex(prev => prev === farmhouse.images.length - 1 ? 0 : prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, [farmhouse]);

  if (!farmhouse)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="relative w-16 h-16">

          {/* outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-lime-200"></div>

          {/* spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-lime-600 border-t-transparent animate-spin"></div>

          {/* center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-lime-600 rounded-full animate-pulse"></div>
          </div>

        </div>
      </div>
    );

  return (
    <>
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-lime-200 overflow-hidden">

        {/* IMAGE */}
        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden">

          {farmhouse.images && farmhouse.images.length > 0 ? (
            <>
              <img
                src={farmhouse.images[imageIndex]}
                alt="Farmhouse"
                className="w-full h-full object-cover"
              />

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {farmhouse.images.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition ${i === imageIndex ? "bg-lime-400" : "bg-white/50"
                      }`}
                  />
                ))}
              </div>
            </>
          ) : (
            /* NO IMAGE STATE */
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300 text-stone-600">

              {/* Icon */}
              <svg
                className="w-16 h-16 mb-4 opacity-70"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16l4-4a3 3 0 014 0l4 4m-4-4l1.5-1.5a3 3 0 014 0L21 16M3 16V6a2 2 0 012-2h14a2 2 0 012 2v10"
                />
              </svg>

              <p className="text-lg font-semibold">No Images Available</p>
              <p className="text-sm opacity-70 mt-1">
                This farmhouse has no uploaded images yet.
              </p>
            </div>
          )}

        </div>

        {/* BODY */}
        <div className="p-6 md:p-8 space-y-6">

          <div className="flex flex-wrap justify-between gap-3">
            <h1 className="text-3xl font-bold text-lime-800">{farmhouse.name}</h1>

            <div className="flex gap-6">
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <FiStar /> {farmhouse.rating}
              </div>
              <div className="flex items-center gap-1 text-pink-500 font-semibold">
                <FiHeart /> {farmhouse.wishlist.length}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-lime-700">
            <FiMapPin /> {farmhouse.address}
          </div>

          <p className="text-lime-600">{farmhouse.description}</p>

          <div className="flex flex-wrap gap-2">
            {farmhouse.amenities.map((a, i) => (
              <span key={i} className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-sm font-semibold">
                {a}
              </span>
            ))}
          </div>

          <div className="flex gap-8 font-semibold text-lg flex-wrap text-lime-800">
            <span>₹{farmhouse.price}/Slot</span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-lime-500 to-amber-500 text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition"
          >
            <FiEye /> Manage Slots
          </button>
        </div>
      </div>

      <FarmhouseSlotsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        farmhouseId={farmhouseId}
        name={farmhouse.name}
      />
    </>
  );
};

export default VendorFarmhouse;
