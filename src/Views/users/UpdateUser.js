import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Swal from "sweetalert2";

const API_BASE = "https://backend.vfarmstays.com/api/auth";

const UpdateUser = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* FETCH USER */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/getprofile/${id}`);
        // ✅ FIX: response has 'profile' not 'user'
        const u = res.data.profile;
        setForm({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email || "",
          phoneNumber: u.phoneNumber || "",
          gender: u.gender || "",
        });
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load user data. Please try again.",
        }).then(() => navigate("/admin/users"));
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    Swal.fire({
      title: "Updating...",
      text: "Please wait while we update the user.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await axios.put(`${API_BASE}/update/${id}`, form);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "User updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/admin/users");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-stone-900 text-white' : 'bg-lime-50 text-stone-900'}`}>
        <div className="text-lg font-semibold animate-pulse">Loading user...</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-8 ${darkMode
        ? "bg-gradient-to-br from-stone-900 via-stone-950 to-black text-white"
        : "bg-gradient-to-br from-lime-100 via-white to-lime-200 text-stone-900"
      }`}
    >
      <div className={`max-w-3xl mx-auto rounded-3xl shadow-2xl p-8 ${darkMode ? 'bg-stone-800/50 border-2 border-stone-700' : 'bg-white border-2 border-lime-200'}`}>
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 mb-6 font-semibold transition ${darkMode
            ? 'text-lime-400 hover:text-lime-300'
            : 'text-lime-600 hover:text-lime-700'
          }`}
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
          Update User
        </h2>

        <form onSubmit={handleUpdate} className="grid gap-5">
          {[
            { label: "First Name", name: "firstName", type: "text" },
            { label: "Last Name", name: "lastName", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phoneNumber", type: "tel" },
          ].map((f) => (
            <div key={f.name}>
              <label className={`text-sm font-semibold ${darkMode ? "text-stone-300" : "text-stone-700"}`}>
                {f.label}
              </label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={(e) => {
                  let value = e.target.value;
                  if (f.name === "phoneNumber") {
                    value = value.replace(/\D/g, "").slice(0, 10);
                  }
                  setForm({ ...form, [f.name]: value });
                }}
                className={`w-full mt-1 px-4 py-3 rounded-xl border-2 outline-none transition ${darkMode
                    ? "bg-stone-900 border-stone-700 text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    : "bg-white border-lime-300 text-stone-900 focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  }`}
                required={f.name === "email" || f.name === "firstName"}
              />
            </div>
          ))}

          <div>
            <label className={`text-sm font-semibold ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-3 rounded-xl border-2 outline-none transition ${darkMode
                ? 'bg-stone-900 border-stone-700 text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500'
                : 'bg-white border-lime-300 text-stone-900 focus:ring-2 focus:ring-lime-500 focus:border-lime-500'
              }`}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            disabled={saving}
            className={`mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
              ${saving ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]'}
              ${darkMode ? 'bg-lime-600 text-white hover:bg-lime-700' : 'bg-lime-500 text-white hover:bg-lime-600'}
            `}
          >
            <FaSave />
            {saving ? "Saving..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;