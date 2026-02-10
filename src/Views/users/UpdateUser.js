import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const API = "http://31.97.206.144:5124/api/auth/user";

const UpdateUser = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    username: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* FETCH USER */
  useEffect(() => {
    axios.get(`${API}/${id}`).then((res) => {
      const u = res.data.user;
      setForm({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        phoneNumber: u.phoneNumber || "",
        gender: u.gender || "",
        username: u.username || "",
      });
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(`http://31.97.206.144:5124/api/auth/update/${id}`, form);
      alert("User updated successfully");
      navigate("/admin/users");
    } catch (err) {
      alert("Update failed");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading user...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-gray-100 to-white"
      }`}
    >
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8">

        {/* HEADER */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-indigo-600 font-semibold"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-3xl font-bold mb-6">
          Update User
        </h2>

        {/* FORM */}
        <form onSubmit={handleUpdate} className="grid gap-5">

          {[
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Email", name: "email" },
            { label: "Phone", name: "phoneNumber" },
            { label: "Username", name: "username" },
          ].map((f) => (
            <div key={f.name}>
              <label className="text-sm font-semibold">
                {f.label}
              </label>
              <input
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
          ))}

          {/* GENDER */}
          <div>
            <label className="text-sm font-semibold">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-xl border"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* SAVE */}
          <button
            disabled={saving}
            className="mt-4 flex items-center justify-center gap-2 px-6 py-3
            rounded-xl bg-indigo-600 text-white font-semibold
            hover:bg-indigo-700 transition"
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
