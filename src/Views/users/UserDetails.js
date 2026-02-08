import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSpinner,
  FaArrowLeft,
  FaExternalLinkAlt,
} from "react-icons/fa";

const UserDetails = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = "http://31.97.206.144:5124/api/auth";

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/user/${id}`);
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      setError("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!user) return null;

  const address = user.addresses?.[0];
  const firstLetter = user.fullName?.charAt(0)?.toUpperCase() || "U";

  const lat = user.liveLocation?.coordinates?.[1];
  const lng = user.liveLocation?.coordinates?.[0];

  return (
    <div
      className={`min-h-screen p-6 md:p-10 transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white"
          : "bg-gradient-to-br from-slate-100 via-white to-slate-200 text-gray-900"
      }`}
    >
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full
          backdrop-blur-xl
          bg-white/10 hover:bg-indigo-600
          border border-white/20
          hover:border-indigo-500
          transition-all duration-300 shadow-lg"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition" />
          Back
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden relative">

        {/* glowing border */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-20 blur-2xl"></div>

        <div
          className={`relative backdrop-blur-2xl border rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]
          ${
            darkMode
              ? "bg-white/5 border-white/10"
              : "bg-white/70 border-white/40"
          }`}
        >
          {/* HEADER */}
          <div className="flex flex-col md:flex-row items-center gap-8 p-10 border-b border-white/10">
            {/* Avatar */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl bg-indigo-500/40"></div>

              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="profile"
                  className="relative w-32 h-32 rounded-full object-cover ring-4 ring-indigo-500 shadow-2xl"
                />
              ) : (
                <div
                  className="relative w-32 h-32 rounded-full flex items-center justify-center
                  text-5xl font-bold text-white
                  bg-gradient-to-br from-indigo-500 to-purple-600
                  ring-4 ring-indigo-500 shadow-2xl"
                >
                  {firstLetter}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold tracking-tight">
                {user.fullName}
              </h1>

              <p className="opacity-70 mt-1">@{user.username}</p>

              <span
                className="inline-block mt-3 px-4 py-1 rounded-full text-sm
                bg-gradient-to-r from-indigo-500/20 to-purple-500/20
                border border-indigo-400/30"
              >
                {user.gender?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-8 p-10">

            {/* CONTACT CARD */}
            <PremiumCard darkMode={darkMode} title="Contact Information">
              <InfoRow icon={<FaEnvelope />} label="Email" value={user.email} />
              <InfoRow icon={<FaPhone />} label="Phone" value={user.phoneNumber} />
            </PremiumCard>

            {/* LOCATION CARD */}
            <PremiumCard darkMode={darkMode} title="Live Location">
              {lat && lng ? (
                <>
                  <InfoRow
                    icon={<FaMapMarkerAlt />}
                    label="Coordinates"
                    value={`${lat} , ${lng}`}
                  />

                  <a
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm
                    text-indigo-400 hover:text-indigo-300 transition"
                  >
                    Open in Google Maps
                    <FaExternalLinkAlt size={12} />
                  </a>
                </>
              ) : (
                <p className="opacity-60 text-sm">Location unavailable</p>
              )}
            </PremiumCard>

            {/* ADDRESS — ULTRA PREMIUM */}
            {address && (
              <div className="md:col-span-2">
                <div
                  className={`rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500`}
                >
                  <div
                    className={`rounded-2xl p-8 backdrop-blur-xl ${
                      darkMode ? "bg-[#020617]" : "bg-white"
                    }`}
                  >
                    <h3 className="text-xl font-semibold mb-6">
                      Primary Address
                    </h3>

                    {/* big address */}
                    <div
                      className={`p-5 rounded-xl mb-6 ${
                        darkMode
                          ? "bg-white/5 border border-white/10"
                          : "bg-slate-100"
                      }`}
                    >
                      <p className="text-lg font-medium">
                        {address.fullAddress}
                      </p>
                    </div>

                    {/* grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <AddressItem label="City" value={address.city} />
                      <AddressItem label="State" value={address.state} />
                      <AddressItem label="Country" value={address.country} />
                      <AddressItem label="Postal Code" value={address.postalCode} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-6 text-xs opacity-60 text-center border-t border-white/10">
            Last Updated: {new Date(user.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- SMALL PREMIUM COMPONENTS ---------- */

const PremiumCard = ({ title, children, darkMode }) => (
  <div
    className={`rounded-2xl p-6 backdrop-blur-xl border transition hover:scale-[1.02]
    ${
      darkMode
        ? "bg-white/5 border-white/10 hover:border-indigo-400/40"
        : "bg-white/70 border-white hover:shadow-xl"
    }`}
  >
    <h3 className="text-lg font-semibold mb-5">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="text-indigo-400 text-lg">{icon}</div>

    <div>
      <p className="text-xs opacity-60">{label}</p>
      <p className="text-sm font-medium">{value || "—"}</p>
    </div>
  </div>
);

const AddressItem = ({ label, value }) => (
  <div>
    <p className="text-xs opacity-60">{label}</p>
    <p className="font-semibold mt-1">{value}</p>
  </div>
);

export default UserDetails;
