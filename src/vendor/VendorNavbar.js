import React, { useState, useRef, useEffect } from "react";
import { FiMenu, FiLogOut, FiChevronDown } from "react-icons/fi";
import Swal from "sweetalert2";

const VendorNavbar = ({ toggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const farmHouse = JSON.parse(sessionStorage.getItem("VendorFarmhouse"));
  const farmHouseName = farmHouse?.name;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#10b981",
    });

    if (!result.isConfirmed) return;

    // Loading animation
    Swal.fire({
      title: "Logging out...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    setTimeout(() => {
      sessionStorage.clear();

      Swal.fire({
        icon: "success",
        title: "Logged out successfully",
        showConfirmButton: false,
        timer: 1200,
      });

      setTimeout(() => {
        window.location.href = "/vendor-login";
      }, 1200);
    }, 700);
  };
  return (
    <div className="top-0 z-30 px-4 sm:px-6 lg:px-8 pt-4">
      <div className="flex items-center justify-between rounded-2xl bg-white border border-lime-200 shadow-lg px-4 sm:px-6 py-3 sm:py-4">

        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-lime-100 transition">
          <FiMenu size={22} className="text-lime-700" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-lime-100 transition"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-lime-500 to-amber-500 text-white flex items-center justify-center font-semibold shadow">
              {farmHouseName.slice(0, 1)}
            </div>

            <span className="hidden sm:block font-semibold text-lime-800">
              {farmHouseName}
            </span>

            <FiChevronDown className={`transition text-lime-700 ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-lime-200 rounded-2xl shadow-xl overflow-hidden">
              <div className="border-t" />
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition text-left"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorNavbar;
