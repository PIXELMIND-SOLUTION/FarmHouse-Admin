import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaBell,
  FaEnvelope,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaCompress,
  FaExpand
} from 'react-icons/fa';
import { FiChevronDown, FiMenu } from 'react-icons/fi';

const Navbar = ({ toggleSidebar, toggleDarkMode, darkMode, collapsed, sidebarOpen }) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const notifications = [
    { id: 1, text: 'New order received', time: '5 min ago', unread: true },
    { id: 2, text: 'Server backup completed', time: '1 hour ago', unread: true },
    { id: 3, text: 'New user registered', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className={`
      ${darkMode ? 'bg-stone-800 text-white' : 'bg-white text-stone-800'}
      border-b ${darkMode ? 'border-stone-700' : 'border-lime-200'}
      px-4 py-3
      flex items-center justify-between
      transition-all duration-300
      sticky top-0 z-30
      ${sidebarOpen ? 'md:ml-0' : 'md:ml-0'}
    `}>
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Menu Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-stone-700' : 'hover:bg-lime-100'} transition-colors`}
          aria-label="Toggle menu"
        >
          {isMobile ? (
            <FiMenu className="text-xl" />
          ) : ("")}
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-stone-700' : 'hover:bg-lime-100'} transition-colors`}
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <FaSun className="text-lg text-amber-400" />
          ) : (
            <FaMoon className="text-lg text-amber-600" />
          )}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className={`relative p-2 rounded-lg transition-colors
    ${darkMode ? "hover:bg-stone-700" : "hover:bg-lime-100"}
  `}
        >
          {isFullscreen ? (
            <FaCompress className="text-lg" />
          ) : (
            <FaExpand className="text-lg" />
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center space-x-2 p-1 pr-2 rounded-lg ${darkMode ? 'hover:bg-stone-700' : 'hover:bg-lime-100'} transition-colors`}
          >
            <img
              src="/logo1.png"
              alt="Admin"
              className={`w-8 h-8 rounded-full border-2 ${darkMode ? 'border-lime-500' : 'border-lime-600'}`}
            />
            {!collapsed && (
              <>
                <div className="hidden md:block text-left">
                  <p className={`text-sm font-medium ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>Admin</p>
                  <p className={`text-xs ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>Administrator</p>
                </div>
                <FiChevronDown className="hidden md:block" />
              </>
            )}
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              ></div>
              <div className={`
                absolute right-0 mt-2 w-48
                ${darkMode ? 'bg-stone-800' : 'bg-white'}
                rounded-lg shadow-xl border ${darkMode ? 'border-stone-700' : 'border-lime-200'}
                z-50
              `}>
                <div className={`p-4 border-b ${darkMode ? 'border-stone-700' : 'border-lime-200'}`}>
                  <div className="flex items-center space-x-3">
                    <img
                      src="/logo1.png"
                      alt="Admin"
                      className={`w-10 h-10 rounded-full border-2 ${darkMode ? 'border-lime-500' : 'border-lime-600'}`}
                    />
                    <div>
                      <p className={`font-semibold ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>Admin</p>
                    </div>
                  </div>
                </div>
                <div className={`border-t ${darkMode ? 'border-stone-700' : 'border-lime-200'}`}></div>
                <a
                  href="/"
                  className={`block px-4 py-3 ${darkMode ? 'hover:bg-stone-700' : 'hover:bg-lime-50'} text-red-600 dark:text-red-400`}
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;