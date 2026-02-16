import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Dashboard from '../Views/Dashboard';
import Users from '../Views/users/Users';
import Settings from '../Views/Settings';
import AllPayments from '../Views/payments/AllPayments';
import FarmHouses from '../Views/AllHouses/FarmHouses';
import AllBookings from '../Views/Bookings/AllBookings';
import Banners from '../Views/Banners/Banners';
import FarmhouseForm from '../Views/AllHouses/CreateFarmHouse'
import SingleFarmhouse from '../Views/AllHouses/SingleFarmHouse'
import FarmhouseSlots from '../Views/AllHouses/FarmHouseSlots';
import AdminFeesConfig from '../Views/AdminServiceFees';
import UserDetails from '../Views/users/UserDetails';
import UpdateUser from '../Views/users/UpdateUser';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const [darkMode, setDarkMode] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        // Load from localStorage or default to false
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true' || false;
    });

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleCollapsed = () => {
        const newCollapsed = !collapsed;
        setCollapsed(newCollapsed);
        localStorage.setItem('sidebarCollapsed', newCollapsed);
    };

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
    };

    const handleNavigation = (path) => {
        navigate(`/admin${path}`);
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    // Load preferences
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
    }, []);

    return (
        <div className={`h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <div className="flex">
                {/* Sidebar */}
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    darkMode={darkMode}
                    toggleSidebar={toggleSidebar}
                    collapsed={collapsed}
                    toggleCollapsed={toggleCollapsed}
                    onNavigate={handleNavigation}
                />

                {/* Main Content Area */}
                <div className={`
                    flex-1 flex flex-col 
                    transition-all duration-300 ease-in-out
                    ${sidebarOpen ? 'md:ml-0' : 'md:ml-0'}
                `}>
                    {/* Navbar */}
                    <Navbar
                        toggleSidebar={toggleSidebar}
                        toggleDarkMode={toggleDarkMode}
                        darkMode={darkMode}
                        collapsed={collapsed}
                        sidebarOpen={sidebarOpen}
                        onNavigate={handleNavigation}
                    />
                    <div className={`${collapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300`}>
                        {/* Main Content Area with Routes */}
                        <main className={`
                        flex-1
                        overflow-y-auto
                        overflow-x-hidden
                        p-4 md:p-6
                    `}>
                            <Routes>
                                <Route path="/" element={<Dashboard darkMode={darkMode} collapsed={collapsed} />} />
                                <Route path="/dashboard" element={<Dashboard darkMode={darkMode} collapsed={collapsed} />} />

                                <Route path="/users" element={<Users darkMode={darkMode} collapsed={collapsed} />} />
                                <Route path="/user/:id" element={<UserDetails darkMode={darkMode} collapsed={collapsed} />} />
                                <Route path="/user/update/:id" element={<UpdateUser darkMode={darkMode} collapsed={collapsed} />} />

                                <Route path="/service-fees" element={<AdminFeesConfig darkMode={darkMode} collapsed={collapsed} />} />

                                <Route path="/banners" element={<Banners darkMode={darkMode} collapsed={collapsed} />} />

                                <Route path="/farmhouses/create" element={<FarmhouseForm darkMode={darkMode} />} />
                                <Route path="/farmhouses/edit/:id" element={<FarmhouseForm darkMode={darkMode} />} />

                                <Route path='/farmhouses' element={<FarmHouses darkMode={darkMode} collapsed={collapsed} />} />
                                <Route path='/farmhouses/:id' element={<SingleFarmhouse darkMode={darkMode} collapsed={collapsed} />} />
                                <Route path='/farmhouses/slot/:id' element={<FarmhouseSlots darkMode={darkMode} collapsed={collapsed} />} />

                                <Route path="/allbookings" element={<AllBookings darkMode={darkMode} collapsed={collapsed} />} />

                                <Route path="/all-payments" element={<AllPayments darkMode={darkMode} collapsed={collapsed} />} />




                                <Route path="/settings" element={<Settings darkMode={darkMode} collapsed={collapsed} />} />

                                <Route path="*" element={<Navigate to="/admin" replace />} />
                            </Routes>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;