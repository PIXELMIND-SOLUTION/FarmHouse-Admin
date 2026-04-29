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

  const API_BASE = "https://backend.vfarmstays.com/api/auth";

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
        <FaSpinner className={`animate-spin text-4xl ${darkMode ? 'text-lime-400' : 'text-lime-600'}`} />
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
          ? "bg-gradient-to-br from-stone-900 via-stone-950 to-black text-white"
          : "bg-gradient-to-br from-lime-100 via-white to-lime-200 text-stone-900"
      }`}
    >
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className={`group flex items-center gap-2 px-5 py-2.5 rounded-full
          backdrop-blur-xl border
          transition-all duration-300 shadow-lg ${
            darkMode
              ? 'bg-white/10 hover:bg-lime-600 border-white/20 hover:border-lime-500'
              : 'bg-white/10 hover:bg-lime-600 border-lime-300 hover:border-lime-500'
          }`}
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition" />
          Back
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden relative">

        {/* glowing border */}
        <div className={`absolute inset-0 opacity-20 blur-2xl ${
          darkMode 
            ? 'bg-gradient-to-r from-lime-500 via-amber-500 to-lime-500'
            : 'bg-gradient-to-r from-lime-400 via-amber-400 to-lime-400'
        }`}></div>

        <div
          className={`relative backdrop-blur-2xl border rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]
          ${
            darkMode
              ? "bg-white/5 border-stone-700"
              : "bg-white/70 border-lime-200"
          }`}
        >
          {/* HEADER */}
          <div className={`flex flex-col md:flex-row items-center gap-8 p-10 border-b ${
            darkMode ? 'border-stone-700' : 'border-lime-200'
          }`}>
            {/* Avatar */}
            <div className="relative">
              <div className={`absolute inset-0 rounded-full blur-2xl ${
                darkMode ? 'bg-lime-500/40' : 'bg-lime-400/40'
              }`}></div>

              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="profile"
                  className={`relative w-32 h-32 rounded-full object-cover ring-4 shadow-2xl ${
                    darkMode ? 'ring-lime-500' : 'ring-lime-600'
                  }`}
                />
              ) : (
                <div
                  className={`relative w-32 h-32 rounded-full flex items-center justify-center
                  text-5xl font-bold text-white
                  bg-gradient-to-br from-lime-500 to-lime-600
                  ring-4 shadow-2xl ${
                    darkMode ? 'ring-lime-500' : 'ring-lime-600'
                  }`}
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

              <p className={darkMode ? 'text-stone-400 mt-1' : 'text-stone-600 mt-1'}>@{user.username}</p>

              <span
                className={`inline-block mt-3 px-4 py-1 rounded-full text-sm border ${
                  darkMode
                    ? 'bg-lime-500/20 border-lime-500/30 text-lime-400'
                    : 'bg-lime-100 border-lime-400/30 text-lime-700'
                }`}
              >
                {user.gender?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-8 p-10">

            {/* CONTACT CARD */}
            <PremiumCard darkMode={darkMode} title="Contact Information">
              <InfoRow darkMode={darkMode} icon={<FaEnvelope />} label="Email" value={user.email} />
              <InfoRow darkMode={darkMode} icon={<FaPhone />} label="Phone" value={user.phoneNumber} />
            </PremiumCard>

            {/* LOCATION CARD */}
            <PremiumCard darkMode={darkMode} title="Live Location">
              {lat && lng ? (
                <>
                  <InfoRow
                    darkMode={darkMode}
                    icon={<FaMapMarkerAlt />}
                    label="Coordinates"
                    value={`${lat} , ${lng}`}
                  />

                  <a
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-4 inline-flex items-center gap-2 text-sm transition ${
                      darkMode
                        ? 'text-lime-400 hover:text-lime-300'
                        : 'text-lime-600 hover:text-lime-700'
                    }`}
                  >
                    Open in Google Maps
                    <FaExternalLinkAlt size={12} />
                  </a>
                </>
              ) : (
                <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Location unavailable</p>
              )}
            </PremiumCard>

            {/* ADDRESS — ULTRA PREMIUM */}
            {address && (
              <div className="md:col-span-2">
                <div
                  className={`rounded-2xl p-[1px] ${
                    darkMode 
                      ? 'bg-gradient-to-r from-lime-500 via-amber-500 to-lime-500'
                      : 'bg-gradient-to-r from-lime-400 via-amber-400 to-lime-400'
                  }`}
                >
                  <div
                    className={`rounded-2xl p-8 backdrop-blur-xl ${
                      darkMode ? "bg-stone-900" : "bg-white"
                    }`}
                  >
                    <h3 className={`text-xl font-semibold mb-6 ${
                      darkMode ? 'text-lime-400' : 'text-lime-700'
                    }`}>
                      Primary Address
                    </h3>

                    {/* big address */}
                    <div
                      className={`p-5 rounded-xl mb-6 ${
                        darkMode
                          ? "bg-white/5 border border-stone-700"
                          : "bg-lime-50 border border-lime-200"
                      }`}
                    >
                      <p className="text-lg font-medium">
                        {address.fullAddress}
                      </p>
                    </div>

                    {/* grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <AddressItem darkMode={darkMode} label="City" value={address.city} />
                      <AddressItem darkMode={darkMode} label="State" value={address.state} />
                      <AddressItem darkMode={darkMode} label="Country" value={address.country} />
                      <AddressItem darkMode={darkMode} label="Postal Code" value={address.postalCode} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className={`p-6 text-xs text-center border-t ${
            darkMode ? 'border-stone-700 text-stone-500' : 'border-lime-200 text-stone-500'
          }`}>
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
    className={`rounded-2xl p-6 backdrop-blur-xl border transition hover:scale-[1.02] ${
      darkMode
        ? "bg-white/5 border-stone-700 hover:border-lime-500/40"
        : "bg-white/70 border-lime-200 hover:shadow-xl hover:border-lime-300"
    }`}
  >
    <h3 className={`text-lg font-semibold mb-5 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const InfoRow = ({ icon, label, value, darkMode }) => (
  <div className="flex items-center gap-4">
    <div className={`text-lg ${darkMode ? 'text-lime-400' : 'text-lime-600'}`}>{icon}</div>

    <div>
      <p className={`text-xs ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>{label}</p>
      <p className="text-sm font-medium">{value || "—"}</p>
    </div>
  </div>
);

const AddressItem = ({ label, value, darkMode }) => (
  <div>
    <p className={`text-xs ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>{label}</p>
    <p className="font-semibold mt-1">{value}</p>
  </div>
);

export default UserDetails;