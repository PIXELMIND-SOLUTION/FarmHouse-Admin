import React, { useState, useEffect } from 'react';
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaChartBar,
  FaCog,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaLifeRing,
  FaSignOutAlt,
  FaTimes,
  FaBars,
  FaHome,
  FaIdBadge,
  FaChevronDown,
  FaChevronRight,
  FaRegQuestionCircle,
  FaDownload,
  FaPlus,
  FaSquare,
  FaCoins,
  FaBell,
  FaMoneyBill,
  FaStore      // for Vendors
} from 'react-icons/fa';
import { FaBilibili, FaPhotoFilm } from 'react-icons/fa6';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const Sidebar = ({ sidebarOpen, darkMode, toggleSidebar, collapsed, toggleCollapsed, onNavigate }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [openSubmenus, setOpenSubmenus] = useState({
    Packages: false,
    analytics: false,
    settings: false,
    Vendors: false   // added for vendors submenu
  });

  // Update active item based on route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/users')) setActiveItem('users');
    else if (path.includes('/vendors')) {
      setActiveItem('Vendors');
      setOpenSubmenus(prev => ({ ...prev, Vendors: true }));
    }
    else if (path.includes('/packages') || path.includes('/categories') || path.includes('/products')) {
      setActiveItem('Packages');
      setOpenSubmenus(prev => ({ ...prev, Packages: true }));
    }
    else if (path.includes('/orders')) setActiveItem('orders');
    else if (path.includes('/analytics')) {
      setActiveItem('analytics');
      setOpenSubmenus(prev => ({ ...prev, analytics: true }));
    }
    else if (path.includes('/settings')) {
      setActiveItem('settings');
      setOpenSubmenus(prev => ({ ...prev, settings: true }));
    }
    else setActiveItem('dashboard');
  }, [location]);

  const toggleSubmenu = (menu) => {
    if (collapsed) return;
    setOpenSubmenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const menuItems = [
    { id: 'dashboard', icon: <FaTachometerAlt />, text: 'Dashboard', path: '/' },
    { id: 'users', icon: <FaUsers />, text: 'Users', path: '/users' },
    {
      id: 'Vendors',
      icon: <FaStore />,
      text: 'Vendors',
      path: '/vendors',
      subItems: [
        { id: 'AllVendors', text: 'All Vendors', path: '/vendors' },
        { id: 'Vendors Application', text: 'Vendors Application', path: '/vendorapplications' },
      ]
    },
    {
      id: 'AllHouses',
      icon: <FaSquare />,
      text: 'AllHouses',
      path: '/farmhouses',
      subItems: [
        { id: 'Create FarmHouses', text: 'Create FarmHouses', path: '/farmhouses/create' },
        { id: 'Farm Houses', text: 'Farm Houses', path: '/farmhouses' },
      ]
    },
    { id: 'Service Fees', icon: <FaMoneyBill />, text: 'Service Fees', path: '/service-fees' },
    { id: 'Banners', icon: <FaPhotoFilm />, text: 'Banners', path: '/banners' },
    {
      id: 'All Bookings',
      icon: <FaCoins />,
      text: 'All Bookings',
      path: '/allbookings',
      subItems: [
        { id: 'All Bookings', text: 'All Bookings', path: '/allbookings' },
      ]
    },
    { id: 'Payments', icon: <FaFileInvoiceDollar />, text: 'Payments', path: '/all-payments' },
    { id: 'Revenue', icon: <FaMoneyBill />, text: 'Revenue', path: '/revenue' },
  ];

  const handleItemClick = (item) => {
    if (item.subItems && !collapsed) {
      toggleSubmenu(item.id);
      if (!openSubmenus[item.id]) {
        onNavigate(item.path);
        setActiveItem(item.id);
      }
    } else {
      onNavigate(item.path);
      setActiveItem(item.id);
    }
  };

  const handleSubItemClick = (subItem, parentId) => {
    onNavigate(subItem.path);
    setActiveItem(subItem.id);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#10b981",
      confirmButtonText: "Yes, Logout",
    });
    if (!result.isConfirmed) return;
    Swal.fire({
      title: "Logging out...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    setTimeout(() => {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("AdminData");
      sessionStorage.removeItem("isAdmin");
      localStorage.removeItem("authToken");
      Swal.fire({
        icon: "success",
        title: "Logged out successfully",
        timer: 1200,
        showConfirmButton: false,
      });
      window.location.href = "/";
    }, 800);
  };

  const isSubItemActive = (parentId, subItems) => {
    return subItems?.some(subItem => {
      const path = location.pathname;
      return path.includes(subItem.path.split('/')[1]) || path === subItem.path;
    });
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <aside
        className={`
          ${darkMode ? 'bg-stone-800 text-white' : 'bg-white text-stone-800'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'md:w-20' : 'md:w-64'}
          fixed top-0 left-0 h-[100vh] w-64 z-50 transition-all duration-300 ease-in-out flex flex-col
          border-r ${darkMode ? 'border-stone-700' : 'border-lime-200'} shadow-2xl md:shadow-lg
        `}
      >
        {/* Header */}
        <div className={`
          p-4 ${darkMode ? 'border-stone-700' : 'border-lime-200'} 
          flex items-center ${collapsed ? 'justify-center' : 'justify-between'} border-b
        `}>
          {!collapsed ? (
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('/')}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                <img src="/logo1.png" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>V Farm House</h1>
                <p className={`text-xs ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>Admin Panel</p>
              </div>
            </div>
          ) : (
            <div
              className="w-8 h-8 bg-gradient-to-br from-lime-500 to-lime-600 rounded-lg flex items-center justify-center cursor-pointer"
              onClick={() => onNavigate('/')}
            >
              <span className="text-white font-bold">V</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={`md:hidden p-1 rounded ${darkMode ? 'hover:bg-stone-700' : 'hover:bg-lime-100'} ${collapsed ? 'hidden' : ''}`}
          >
            <FaTimes className="text-lg" />
          </button>
          <button
            onClick={toggleCollapsed}
            className={`hidden md:flex p-1 rounded ${darkMode ? 'bg-stone-700 hover:bg-stone-600' : 'bg-lime-100 hover:bg-lime-200'} ${collapsed ? 'absolute -right-3 top-6 bg-white dark:bg-stone-800 border shadow-lg' : ''}`}
          >
            {collapsed ? <FiChevronRight className="text-lg" /> : <FiChevronLeft className="text-lg" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-2 md:p-4 overflow-y-auto scrollbar-thin">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <div>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`
                      w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} 
                      p-3 rounded-lg transition-all duration-200
                      ${activeItem === item.id || isSubItemActive(item.id, item.subItems)
                        ? `${darkMode ? 'bg-lime-600 text-white' : 'bg-lime-100 text-lime-700'}`
                        : `${darkMode ? 'hover:bg-stone-700 text-stone-300' : 'hover:bg-lime-50 text-stone-700'}`
                      }
                      ${collapsed ? 'relative' : ''}
                    `}
                    onMouseEnter={() => collapsed && setHoveredItem(item.id)}
                    onMouseLeave={() => collapsed && setHoveredItem(null)}
                  >
                    <div className="flex items-center">
                      <span className={`${collapsed ? 'text-xl' : 'text-lg'}`}>{item.icon}</span>
                      {!collapsed && <span className="ml-3 font-medium">{item.text}</span>}
                    </div>
                    {!collapsed && item.subItems && (
                      <span className="text-xs ml-2">
                        {openSubmenus[item.id] ? <FaChevronDown /> : <FaChevronRight />}
                      </span>
                    )}
                    {(activeItem === item.id || isSubItemActive(item.id, item.subItems)) && !collapsed && (
                      <span className={`w-2 h-2 ${darkMode ? 'bg-lime-400' : 'bg-lime-600'} rounded-full`}></span>
                    )}
                    {collapsed && hoveredItem === item.id && (
                      <div className={`absolute left-full ml-2 px-3 py-2 rounded-md shadow-lg z-50 ${darkMode ? 'bg-stone-700 text-white' : 'bg-white text-stone-800 border border-lime-200'} whitespace-nowrap`}>
                        {item.text}
                      </div>
                    )}
                  </button>
                  {!collapsed && item.subItems && openSubmenus[item.id] && (
                    <div className={`mt-1 ml-6 pl-3 border-l-2 ${darkMode ? 'border-stone-700' : 'border-lime-200'} space-y-1`}>
                      {item.subItems.map((subItem) => {
                        const isActive = location.pathname === subItem.path || location.pathname.includes(subItem.path.split('/')[1]);
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => handleSubItemClick(subItem, item.id)}
                            className={`
                              w-full flex items-center justify-start p-2 rounded-lg transition-all duration-200 text-sm
                              ${isActive
                                ? `${darkMode ? 'bg-stone-700 text-lime-400' : 'bg-lime-50 text-lime-700'} font-medium`
                                : `${darkMode ? 'hover:bg-stone-700 text-stone-300' : 'hover:bg-lime-50 text-stone-600'}`
                              }
                            `}
                          >
                            <span className="mr-2">•</span>
                            {subItem.text}
                            {isActive && <span className={`ml-auto w-1.5 h-1.5 ${darkMode ? 'bg-lime-400' : 'bg-lime-600'} rounded-full`}></span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className={`my-4 border-t ${darkMode ? 'border-stone-700' : 'border-lime-200'}`}></div>
          <div className="relative">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start'} 
                p-3 rounded-lg transition-all duration-200
                ${darkMode ? 'hover:bg-stone-700 text-red-400' : 'hover:bg-amber-50 text-red-600'}
                ${collapsed ? 'relative' : ''}
              `}
              onMouseEnter={() => collapsed && setHoveredItem('logout')}
              onMouseLeave={() => collapsed && setHoveredItem(null)}
            >
              <FaSignOutAlt className={`${collapsed ? 'text-xl' : 'text-lg'}`} />
              {!collapsed && <span className="ml-3 font-medium">Logout</span>}
              {collapsed && hoveredItem === 'logout' && (
                <div className={`absolute left-full ml-2 px-3 py-2 rounded-md shadow-lg z-50 ${darkMode ? 'bg-stone-700 text-white' : 'bg-white text-stone-800 border border-lime-200'} whitespace-nowrap`}>
                  Logout
                </div>
              )}
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className={`p-3 border-t ${darkMode ? 'border-stone-700' : 'border-lime-200'} ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? (
            <div className="relative">
              <img
                src="/logo1.png"
                alt="Admin"
                className="w-10 h-10 rounded-full mx-auto cursor-pointer border-2 border-lime-500"
                onMouseEnter={() => setHoveredItem('profile')}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => onNavigate('/profile')}
              />
              <div className={`absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-3 h-3 ${darkMode ? 'bg-lime-500' : 'bg-lime-600'} rounded-full border-2 ${darkMode ? 'border-stone-800' : 'border-white'}`}></div>
              {hoveredItem === 'profile' && (
                <div className={`absolute left-full bottom-0 ml-2 px-3 py-2 rounded-md shadow-lg z-50 ${darkMode ? 'bg-stone-700 text-white' : 'bg-white text-stone-800 border border-lime-200'} whitespace-nowrap`}>
                  <div className="text-sm font-medium">Admin</div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('/profile')}>
              <div className="relative">
                <img src="/logo1.png" alt="Admin User" className="w-10 h-10 rounded-full border-2 border-lime-500" />
                <div className={`absolute bottom-0 right-0 w-3 h-3 ${darkMode ? 'bg-lime-500' : 'bg-lime-600'} rounded-full border-2 ${darkMode ? 'border-stone-800' : 'border-white'}`}></div>
              </div>
              <div className="ml-3">
                <h4 className={`font-semibold text-sm ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>Admin</h4>
              </div>
            </div>
          )}
        </div>
      </aside>
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 left-4 md:hidden z-50 bg-gradient-to-br from-lime-600 to-lime-700 text-white p-3 rounded-full shadow-lg hover:from-lime-700 hover:to-lime-800 transition-all duration-200 hover:scale-105"
        >
          <FaBars className="text-xl" />
        </button>
      )}
    </>
  );
};

export default Sidebar;