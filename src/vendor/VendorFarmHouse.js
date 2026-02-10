import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEye, FiMapPin, FiStar, FiHeart } from "react-icons/fi";
import FarmhouseSlotsModal from "./FarmhouseSlotModal";

const farmHouse = JSON.parse(sessionStorage.getItem("VendorData"));
const FARMHOUSE_ID = farmHouse?.vendorId;

const VendorFarmhouse = () => {
  const [farmhouse, setFarmhouse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  /* FETCH */
  const fetchFarmhouse = async () => {
    try {
      const res = await axios.get(
        `http://31.97.206.144:5124/api/farmhouse/${FARMHOUSE_ID}`
      );

      setFarmhouse(res.data.farmhouse);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFarmhouse();
  }, []);

  /* AUTO SLIDE */
  useEffect(() => {
    if (!farmhouse?.images?.length) return;

    const interval = setInterval(() => {
      setImageIndex((prev) =>
        prev === farmhouse.images.length - 1 ? 0 : prev + 1
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [farmhouse]);

  if (!farmhouse) return <div className="p-6">Loading...</div>;

  return (
    <>
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* IMAGE CAROUSEL */}
        <div className="relative h-72 md:h-96">
          <img
            src={
              farmhouse.images?.[imageIndex] ||
              "https://via.placeholder.com/1200x600"
            }
            alt=""
            className="w-full h-full object-cover transition"
          />

          {/* dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {farmhouse.images?.map((_, i) => (
              <div
                key={i}
                className={`
                  w-3 h-3 rounded-full
                  ${
                    i === imageIndex
                      ? "bg-white"
                      : "bg-white/50"
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* TITLE */}
          <div className="flex flex-wrap justify-between gap-3">
            <h1 className="text-3xl font-bold">
              {farmhouse.name}
            </h1>

            <div className="flex gap-6">
              <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                <FiStar />
                {farmhouse.rating}
              </div>

              <div className="flex items-center gap-1 text-pink-500 font-semibold">
                <FiHeart />
                {farmhouse.wishlist.length}
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="flex items-center gap-2 text-gray-600">
            <FiMapPin />
            {farmhouse.address}
          </div>

          {/* DESC */}
          <p className="text-gray-500">
            {farmhouse.description}
          </p>

          {/* AMENITIES */}
          <div className="flex flex-wrap gap-2">
            {farmhouse.amenities.map((a, i) => (
              <span
                key={i}
                className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium"
              >
                {a}
              </span>
            ))}
          </div>

          {/* PRICES */}
          <div className="flex gap-8 font-semibold text-lg flex-wrap">
            <span>₹{farmhouse.pricePerHour}/hr</span>
            <span>₹{farmhouse.pricePerDay}/day</span>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => setModalOpen(true)}
            className="
              flex items-center gap-2
              px-6 py-3
              rounded-xl
              bg-gradient-to-r
              from-indigo-500 to-purple-600
              text-white font-semibold
              shadow-md
              hover:scale-105
              active:scale-95
              transition
            "
          >
            <FiEye />
            Manage Slots
          </button>
        </div>
      </div>

      {/* MODAL */}
      <FarmhouseSlotsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        farmhouseId={FARMHOUSE_ID}
        name={farmhouse.name}
      />
    </>
  );
};

export default VendorFarmhouse;
