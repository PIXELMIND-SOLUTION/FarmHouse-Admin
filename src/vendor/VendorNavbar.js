import React, { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";

const VendorNavbar = ({ toggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  /* Close when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/vendor-login";
  };

  return (
    <div className="top-0 z-30 px-4 sm:px-6 lg:px-8 pt-4">
      <div
        className="
        flex items-center justify-between
        rounded-2xl
        bg-white
        border border-gray-200
        shadow-md
        px-4 sm:px-6
        py-3 sm:py-4
        "
      >
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="
            p-2 rounded-lg
            hover:bg-gray-100
            transition
          "
        >
          <FiMenu size={22} />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="
              flex items-center gap-2
              rounded-xl
              px-2 py-1.5
              hover:bg-gray-100
              transition
            "
          >
            {/* Avatar */}
            <div
              className="
              w-9 h-9
              rounded-full
              bg-gradient-to-r
              from-indigo-500 to-purple-600
              text-white
              flex items-center justify-center
              font-semibold
              shadow-sm
              "
            >
              V
            </div>

            {/* Hide name on small screens */}
            <span className="hidden sm:block font-semibold text-gray-700">
              Vendor
            </span>

            <FiChevronDown
              className={`transition ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div
              className="
              absolute right-0 mt-3
              w-56
              bg-white
              border border-gray-200
              rounded-2xl
              shadow-xl
              overflow-hidden
              animate-in fade-in zoom-in-95
              "
            >
              {/* Profile */}
              {/* <button
                className="
                flex items-center gap-3
                w-full px-4 py-3
                hover:bg-gray-50
                transition
                text-left
                "
              >
                <FiUser />
                Profile
              </button> */}

              {/* Settings */}
              {/* <button
                className="
                flex items-center gap-3
                w-full px-4 py-3
                hover:bg-gray-50
                transition
                text-left
                "
              >
                <FiSettings />
                Settings
              </button> */}

              <div className="border-t" />

              {/* Logout */}
              <button
                onClick={logout}
                className="
                flex items-center gap-3
                w-full px-4 py-3
                text-red-600
                hover:bg-red-50
                transition
                text-left
                "
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
